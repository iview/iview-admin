"use strict";

var util = require('./util'),
    inlineImage = require('./inlineImage'),
    inlineScript = require('./inlineScript'),
    inlineCss = require('./inlineCss'),
    cssSupport = require('./cssSupport');


var getUrlBasePath = function (url) {
    return util.joinUrl(url, '.');
};

var parameterHashFunction = function (params) {
    // HACK JSON.stringify is poor man's hashing;
    // same objects might not receive same result as key order is not guaranteed
    var a = params.map(function (param, idx) {
        // Only include options relevant for method
        if (idx === (params.length - 1)) {
            param = {
                // Two different HTML pages on the same path level have the same base path, but a different URL
                baseUrl: getUrlBasePath(param.baseUrl)
            };
        }
        return JSON.stringify(param);
    });
    return a;
};

var memoizeFunctionOnCaching = function (func, options) {
    if ((options.cache !== false && options.cache !== 'none') && options.cacheBucket) {
        return util.memoize(func, parameterHashFunction, options.cacheBucket);
    } else {
        return func;
    }
};

/* Style inlining */

var requestExternalsForStylesheet = function (styleContent, alreadyLoadedCssUrls, options) {
    var cssRules = cssSupport.rulesForCssText(styleContent);

    return inlineCss.loadCSSImportsForRules(cssRules, alreadyLoadedCssUrls, options).then(function (cssImportResult) {
        return inlineCss.loadAndInlineCSSResourcesForRules(cssRules, options).then(function (cssResourcesResult) {
            var errors = cssImportResult.errors.concat(cssResourcesResult.errors),
                hasChanges = cssImportResult.hasChanges || cssResourcesResult.hasChanges;

            if (hasChanges) {
                styleContent = cssSupport.cssRulesToText(cssRules);
            }

            return {
                hasChanges: hasChanges,
                content: styleContent,
                errors: errors
            };
        });
    });
};

var loadAndInlineCssForStyle = function (style, options, alreadyLoadedCssUrls) {
    var styleContent = style.textContent,
        processExternals = memoizeFunctionOnCaching(requestExternalsForStylesheet, options);

    return processExternals(styleContent, alreadyLoadedCssUrls, options).then(function (result) {
        if (result.hasChanges) {
            style.childNodes[0].nodeValue = result.content;
        }

        return util.cloneArray(result.errors);
    });
};

var getCssStyleElements = function (doc) {
    var styles = doc.getElementsByTagName("style");

    return Array.prototype.filter.call(styles, function (style) {
        return !style.attributes.type || style.attributes.type.value === "text/css";
    });
};

exports.loadAndInlineStyles = function (doc, options) {
    var styles = getCssStyleElements(doc),
        allErrors = [],
        alreadyLoadedCssUrls = [],
        inlineOptions;

    inlineOptions = util.clone(options);
    inlineOptions.baseUrl = inlineOptions.baseUrl || util.getDocumentBaseUrl(doc);

    return util.all(styles.map(function (style) {
        return loadAndInlineCssForStyle(style, inlineOptions, alreadyLoadedCssUrls).then(function (errors) {
            allErrors = allErrors.concat(errors);
        });
    })).then(function () {
        return allErrors;
    });
};

/* CSS link inlining */

var substituteLinkWithInlineStyle = function (oldLinkNode, styleContent) {
    var parent = oldLinkNode.parentNode,
        styleNode;

    styleContent = styleContent.trim();
    if (styleContent) {
        styleNode = oldLinkNode.ownerDocument.createElement("style");
        styleNode.type = "text/css";
        styleNode.appendChild(oldLinkNode.ownerDocument.createTextNode(styleContent));

        parent.insertBefore(styleNode, oldLinkNode);
    }

    parent.removeChild(oldLinkNode);
};

var requestStylesheetAndInlineResources = function (url, options) {
    return util.ajax(url, options)
        .then(function (content) {
            var cssRules = cssSupport.rulesForCssText(content);

            return {
                content: content,
                cssRules: cssRules
            };
        })
        .then(function (result) {
            var hasChangesFromPathAdjustment = inlineCss.adjustPathsOfCssResources(url, result.cssRules);

            return {
                content: result.content,
                cssRules: result.cssRules,
                hasChanges: hasChangesFromPathAdjustment
            };
        })
        .then(function (result) {
            return inlineCss.loadCSSImportsForRules(result.cssRules, [], options)
                .then(function (cssImportResult) {
                    return {
                        content: result.content,
                        cssRules: result.cssRules,
                        hasChanges: result.hasChanges || cssImportResult.hasChanges,
                        errors: cssImportResult.errors
                    };
                });
        })
        .then(function (result) {
            return inlineCss.loadAndInlineCSSResourcesForRules(result.cssRules, options)
                .then(function (cssResourcesResult) {
                    return {
                        content: result.content,
                        cssRules: result.cssRules,
                        hasChanges: result.hasChanges || cssResourcesResult.hasChanges,
                        errors: result.errors.concat(cssResourcesResult.errors)
                    };
                });
        })
        .then(function (result) {
            var content = result.content;
            if (result.hasChanges) {
                content = cssSupport.cssRulesToText(result.cssRules);
            }
            return {
                content: content,
                errors: result.errors
            };
        });
};

var loadLinkedCSS = function (link, options) {
    var cssHref = link.attributes.href.value,
        documentBaseUrl = util.getDocumentBaseUrl(link.ownerDocument),
        ajaxOptions = util.clone(options);

    if (!ajaxOptions.baseUrl && documentBaseUrl) {
        ajaxOptions.baseUrl = documentBaseUrl;
    }

    var processStylesheet = memoizeFunctionOnCaching(requestStylesheetAndInlineResources, options);

    return processStylesheet(cssHref, ajaxOptions).then(function (result) {
        return {
            content: result.content,
            errors: util.cloneArray(result.errors)
        };
    });
};

var getCssStylesheetLinks = function (doc) {
    var links = doc.getElementsByTagName("link");

    return Array.prototype.filter.call(links, function (link) {
        return link.attributes.rel && link.attributes.rel.value === "stylesheet" &&
            (!link.attributes.type || link.attributes.type.value === "text/css");
    });
};

exports.loadAndInlineCssLinks = function (doc, options) {
    var links = getCssStylesheetLinks(doc),
        errors = [];

    return util.all(links.map(function (link) {
        return loadLinkedCSS(link, options).then(function(result) {
            substituteLinkWithInlineStyle(link, result.content + "\n");

            errors = errors.concat(result.errors);
        }, function (e) {
            errors.push({
                resourceType: "stylesheet",
                url: e.url,
                msg: "Unable to load stylesheet " + e.url
            });
        });
    })).then(function () {
        return errors;
    });
};

/* Main */

exports.loadAndInlineImages = inlineImage.inline;
exports.loadAndInlineScript = inlineScript.inline;

exports.inlineReferences = function (doc, options) {
    var allErrors = [],
        inlineFuncs = [
            exports.loadAndInlineImages,
            exports.loadAndInlineStyles,
            exports.loadAndInlineCssLinks];

    if (options.inlineScripts !== false) {
        inlineFuncs.push(exports.loadAndInlineScript);
    }

    return util.all(inlineFuncs.map(function (func) {
        return func(doc, options)
            .then(function (errors) {
                allErrors = allErrors.concat(errors);
            });
    })).then(function () {
        return allErrors;
    });
};
