define(function (require, exports, module) {

if (!require('../core/env').canvasSupported) {
    var urn = 'urn:schemas-microsoft-com:vml';

    var createNode;
    var win = window;
    var doc = win.document;

    var vmlInited = false;

    try {
        !doc.namespaces.zrvml && doc.namespaces.add('zrvml', urn);
        createNode = function (tagName) {
            return doc.createElement('<zrvml:' + tagName + ' class="zrvml">');
        };
    }
    catch (e) {
        createNode = function (tagName) {
            return doc.createElement('<' + tagName + ' xmlns="' + urn + '" class="zrvml">');
        };
    }

    // From raphael
    var initVML = function () {
        if (vmlInited) {
            return;
        }
        vmlInited = true;

        var styleSheets = doc.styleSheets;
        if (styleSheets.length < 31) {
            doc.createStyleSheet().addRule('.zrvml', 'behavior:url(#default#VML)');
        }
        else {
            // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
            styleSheets[0].addRule('.zrvml', 'behavior:url(#default#VML)');
        }
    };

    // Not useing return to avoid error when converting to CommonJS module
    module.exports = {
        doc: doc,
        initVML: initVML,
        createNode: createNode
    };
}
});