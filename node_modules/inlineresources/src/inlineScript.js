"use strict";

var util = require('./util');


var loadLinkedScript = function (script, options) {
    var src = script.attributes.src.value,
        documentBase = util.getDocumentBaseUrl(script.ownerDocument),
        ajaxOptions = util.clone(options);

    if (!ajaxOptions.baseUrl && documentBase) {
        ajaxOptions.baseUrl = documentBase;
    }

    return util.ajax(src, ajaxOptions)
        .fail(function (e) {
            throw {
                resourceType: "script",
                url: e.url,
                msg: "Unable to load script " + e.url
            };
        });
};

var escapeClosingTags = function (text) {
    // http://stackoverflow.com/questions/9246382/escaping-script-tag-inside-javascript
    return text.replace(/<\//g, '<\\/');
};

var substituteExternalScriptWithInline = function (scriptNode, jsCode) {
    scriptNode.attributes.removeNamedItem('src');
    scriptNode.textContent = escapeClosingTags(jsCode);
};

var getScripts = function (doc) {
    var scripts = doc.getElementsByTagName("script");

    return Array.prototype.filter.call(scripts, function (script) {
        return !!script.attributes.src;
    });
};

exports.inline = function (doc, options) {
    var scripts = getScripts(doc);

    return util.collectAndReportErrors(scripts.map(function (script) {
        return loadLinkedScript(script, options).then(function (jsCode) {
            substituteExternalScriptWithInline(script, jsCode);
        });
    }));
};
