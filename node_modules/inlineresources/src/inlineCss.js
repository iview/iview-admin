"use strict";

var ayepromise = require('ayepromise'),
    util = require('./util'),
    cssSupport = require('./cssSupport'),
    backgroundValueParser = require('./backgroundValueParser'),
    fontFaceSrcValueParser = require('css-font-face-src');


var updateCssPropertyValue = function (rule, property, value) {
    rule.style.setProperty(property, value, rule.style.getPropertyPriority(property));
};

var findBackgroundImageRules = function (cssRules) {
    return cssRules.filter(function (rule) {
        return rule.type === window.CSSRule.STYLE_RULE && (rule.style.getPropertyValue('background-image') || rule.style.getPropertyValue('background'));
    });
};

var findBackgroundDeclarations = function (rules) {
    var backgroundDeclarations = [];

    rules.forEach(function (rule) {
        if (rule.style.getPropertyValue('background-image')) {
            backgroundDeclarations.push({
                property: 'background-image',
                value: rule.style.getPropertyValue('background-image'),
                rule: rule
            });
        } else if (rule.style.getPropertyValue('background')) {
            backgroundDeclarations.push({
                property: 'background',
                value: rule.style.getPropertyValue('background'),
                rule: rule
            });
        }
    });

    return backgroundDeclarations;
};

var findFontFaceRules = function (cssRules) {
    return cssRules.filter(function (rule) {
        return rule.type === window.CSSRule.FONT_FACE_RULE && rule.style.getPropertyValue("src");
    });
};

var findCSSImportRules = function (cssRules) {
    return cssRules.filter(function (rule) {
        return rule.type === window.CSSRule.IMPORT_RULE && rule.href;
    });
};

var findExternalBackgroundUrls = function (parsedBackground) {
    var matchIndices = [];

    parsedBackground.forEach(function (backgroundLayer, i) {
        if (backgroundLayer.url && !util.isDataUri(backgroundLayer.url)) {
            matchIndices.push(i);
        }
    });

    return matchIndices;
};

var findExternalFontFaceUrls = function (parsedFontFaceSources) {
    var sourceIndices = [];
    parsedFontFaceSources.forEach(function (sourceItem, i) {
        if (sourceItem.url && !util.isDataUri(sourceItem.url)) {
            sourceIndices.push(i);
        }
    });
    return sourceIndices;
};

exports.adjustPathsOfCssResources = function (baseUrl, cssRules) {
    var backgroundRules = findBackgroundImageRules(cssRules),
        backgroundDeclarations = findBackgroundDeclarations(backgroundRules),
        change = false;

    backgroundDeclarations.forEach(function (declaration) {
        var parsedBackground = backgroundValueParser.parse(declaration.value),
            externalBackgroundIndices = findExternalBackgroundUrls(parsedBackground),
            backgroundValue;

        if (externalBackgroundIndices.length > 0) {
            externalBackgroundIndices.forEach(function (backgroundLayerIndex) {
                var relativeUrl = parsedBackground[backgroundLayerIndex].url,
                    url = util.joinUrl(baseUrl, relativeUrl);
                parsedBackground[backgroundLayerIndex].url = url;
            });

            backgroundValue = backgroundValueParser.serialize(parsedBackground);

            updateCssPropertyValue(declaration.rule, declaration.property, backgroundValue);

            change = true;
        }
    });
    findFontFaceRules(cssRules).forEach(function (rule) {
        var fontFaceSrcDeclaration = rule.style.getPropertyValue("src"),
            parsedFontFaceSources, externalFontFaceUrlIndices;

        try {
            parsedFontFaceSources = fontFaceSrcValueParser.parse(fontFaceSrcDeclaration);
        } catch (e) {
            return;
        }
        externalFontFaceUrlIndices = findExternalFontFaceUrls(parsedFontFaceSources);

        if (externalFontFaceUrlIndices.length > 0) {
            externalFontFaceUrlIndices.forEach(function (fontFaceUrlIndex) {
                var relativeUrl = parsedFontFaceSources[fontFaceUrlIndex].url,
                    url = util.joinUrl(baseUrl, relativeUrl);

                parsedFontFaceSources[fontFaceUrlIndex].url = url;
            });

            cssSupport.changeFontFaceRuleSrc(cssRules, rule, fontFaceSrcValueParser.serialize(parsedFontFaceSources));

            change = true;
        }
    });
    findCSSImportRules(cssRules).forEach(function (rule) {
        var cssUrl = rule.href,
            url = util.joinUrl(baseUrl, cssUrl);

        cssSupport.exchangeRule(cssRules, rule, "@import url(" + url + ");");

        change = true;
    });

    return change;
};

/* CSS import inlining */

var substituteRule = function (cssRules, rule, newCssRules) {
    var position = cssRules.indexOf(rule);

    cssRules.splice(position, 1);

    newCssRules.forEach(function (newRule, i) {
        cssRules.splice(position + i, 0, newRule);
    });
};

var fulfilledPromise = function (value) {
    var defer = ayepromise.defer();
    defer.resolve(value);
    return defer.promise;
};

var loadAndInlineCSSImport = function (cssRules, rule, alreadyLoadedCssUrls, options) {
    var url = rule.href,
        cssHrefRelativeToDoc;

    url = cssSupport.unquoteString(url);

    cssHrefRelativeToDoc = util.joinUrl(options.baseUrl, url);

    if (alreadyLoadedCssUrls.indexOf(cssHrefRelativeToDoc) >= 0) {
        // Remove URL by adding empty string
        substituteRule(cssRules, rule, []);
        return fulfilledPromise([]);
    } else {
        alreadyLoadedCssUrls.push(cssHrefRelativeToDoc);
    }

    return util.ajax(url, options)
        .then(function (cssText) {
            var externalCssRules = cssSupport.rulesForCssText(cssText);

            // Recursively follow @import statements
            return exports.loadCSSImportsForRules(externalCssRules, alreadyLoadedCssUrls, options)
                .then(function (result) {
                    exports.adjustPathsOfCssResources(url, externalCssRules);

                    substituteRule(cssRules, rule, externalCssRules);

                    return result.errors;
                });
        }, function (e) {
            throw {
                resourceType: "stylesheet",
                url: e.url,
                msg: "Unable to load stylesheet " + e.url
            };
        });
};

exports.loadCSSImportsForRules = function (cssRules, alreadyLoadedCssUrls, options) {
    var rulesToInline = findCSSImportRules(cssRules),
        errors = [],
        hasChanges = false;

    return util.all(rulesToInline.map(function (rule) {
        return loadAndInlineCSSImport(cssRules, rule, alreadyLoadedCssUrls, options).then(function (moreErrors) {
            errors = errors.concat(moreErrors);

            hasChanges = true;
        }, function (e) {
            errors.push(e);
        });
    })).then(function () {
        return {
            hasChanges: hasChanges,
            errors: errors
        };
    });
};

/* CSS linked resource inlining */

var loadAndInlineBackgroundImages = function (backgroundValue, options) {
    var parsedBackground = backgroundValueParser.parse(backgroundValue),
        externalBackgroundLayerIndices = findExternalBackgroundUrls(parsedBackground),
        hasChanges = false;

    return util.collectAndReportErrors(externalBackgroundLayerIndices.map(function (backgroundLayerIndex) {
        var url = parsedBackground[backgroundLayerIndex].url;

        return util.getDataURIForImageURL(url, options)
            .then(function (dataURI) {
                parsedBackground[backgroundLayerIndex].url = dataURI;

                hasChanges = true;
            }, function (e) {
                throw {
                    resourceType: "backgroundImage",
                    url: e.url,
                    msg: "Unable to load background-image " + e.url
                };
            });
    })).then(function (errors) {
        return {
            backgroundValue: backgroundValueParser.serialize(parsedBackground),
            hasChanges: hasChanges,
            errors: errors
        };
    });
};

var iterateOverRulesAndInlineBackgroundImages = function (cssRules, options) {
    var rulesToInline = findBackgroundImageRules(cssRules),
        backgroundDeclarations = findBackgroundDeclarations(rulesToInline),
        errors = [],
        cssHasChanges = false;

    return util.all(backgroundDeclarations.map(function (declaration) {
        return loadAndInlineBackgroundImages(declaration.value, options)
            .then(function (result) {
                if (result.hasChanges) {
                    updateCssPropertyValue(declaration.rule, declaration.property, result.backgroundValue);

                    cssHasChanges = true;
                }

                errors = errors.concat(result.errors);
            });
    })).then(function () {
        return {
            hasChanges: cssHasChanges,
            errors: errors
        };
    });
};

var loadAndInlineFontFace = function (srcDeclarationValue, options) {
    var hasChanges = false,
        parsedFontFaceSources, externalFontFaceUrlIndices;

    try {
        parsedFontFaceSources = fontFaceSrcValueParser.parse(srcDeclarationValue);
    } catch (e) {
        parsedFontFaceSources = [];
    }
    externalFontFaceUrlIndices = findExternalFontFaceUrls(parsedFontFaceSources);

    return util.collectAndReportErrors(externalFontFaceUrlIndices.map(function (urlIndex) {
        var fontSrc = parsedFontFaceSources[urlIndex],
            format = fontSrc.format || "woff";

        return util.binaryAjax(fontSrc.url, options)
            .then(function (content) {
                var base64Content = btoa(content);
                fontSrc.url = 'data:font/' + format + ';base64,' + base64Content;

                hasChanges = true;
            }, function (e) {
                throw {
                    resourceType: "fontFace",
                    url: e.url,
                    msg: "Unable to load font-face " + e.url
                };
            });
    })).then(function (errors) {
        return {
            srcDeclarationValue: fontFaceSrcValueParser.serialize(parsedFontFaceSources),
            hasChanges: hasChanges,
            errors: errors
        };
    });
};

var iterateOverRulesAndInlineFontFace = function (cssRules, options) {
    var rulesToInline = findFontFaceRules(cssRules),
        errors = [],
        hasChanges = false;

    return util.all(rulesToInline.map(function (rule) {
        var srcDeclarationValue = rule.style.getPropertyValue("src");

        return loadAndInlineFontFace(srcDeclarationValue, options).then(function (result) {
            if (result.hasChanges) {
                cssSupport.changeFontFaceRuleSrc(cssRules, rule, result.srcDeclarationValue);

                hasChanges = true;
            }

            errors = errors.concat(result.errors);
        });
    })).then(function () {
        return {
            hasChanges: hasChanges,
            errors: errors
        };
    });
};

exports.loadAndInlineCSSResourcesForRules = function (cssRules, options) {
    var hasChanges = false,
        errors = [];

    return util.all([iterateOverRulesAndInlineBackgroundImages, iterateOverRulesAndInlineFontFace].map(function (func) {
        return func(cssRules, options)
            .then(function (result) {
                hasChanges = hasChanges || result.hasChanges;
                errors = errors.concat(result.errors);
            });
    })).then(function () {
        return {
            hasChanges: hasChanges,
            errors: errors
        };
    });
};
