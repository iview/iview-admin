'use strict';

var innerXML = function (node) {
    var s = new XMLSerializer();
    return Array.prototype.map.call(node.childNodes, function (node) {
        return s.serializeToString(node);
    }).join('');
};

var getParseError = function (doc) {
    // Firefox
    if (doc.documentElement.tagName === 'parsererror' &&
        doc.documentElement.namespaceURI === 'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
        return doc.documentElement;
    }

    // Chrome, Safari
    if ((doc.documentElement.tagName === 'xml' || doc.documentElement.tagName === 'html') &&
        doc.documentElement.childNodes &&
        doc.documentElement.childNodes.length > 0 &&
        doc.documentElement.childNodes[0].nodeName === 'parsererror') {
        return doc.documentElement.childNodes[0];
    }

    // PhantomJS
    if (doc.documentElement.tagName === 'html' &&
        doc.documentElement.childNodes &&
        doc.documentElement.childNodes.length > 0 &&
        doc.documentElement.childNodes[0].nodeName === 'body' &&
        doc.documentElement.childNodes[0].childNodes &&
        doc.documentElement.childNodes[0].childNodes.length &&
        doc.documentElement.childNodes[0].childNodes[0].nodeName === 'parsererror') {
        return doc.documentElement.childNodes[0].childNodes[0];
    }

    return undefined;
};

var errorMessagePatterns = [
    // Chrome, Safari, PhantomJS
    new RegExp('^<h3[^>]*>This page contains the following errors:<\/h3><div[^>]*>(.+?)\n?<\/div>'),
    // Firefox
    new RegExp('^(.+)\n')
];

var extractParseError = function (errorNode) {
    var content = innerXML(errorNode);
    var i, match;

    for(i = 0; i < errorMessagePatterns.length; i++) {
        match = errorMessagePatterns[i].exec(content);

        if (match) {
            return match[1];
        }
    }
    return undefined;
};

var failOnParseError = function (doc) {
    var errorMessage;

    if (doc === null) {
        throw new Error('Parse error');
    }

    var parseError = getParseError(doc);
    if (parseError !== undefined) {
        errorMessage = extractParseError(parseError) || 'Parse error';
        throw new Error(errorMessage);
    }
};

exports.failOnParseError = function (doc) {
    failOnParseError(doc);

    return doc;
};
