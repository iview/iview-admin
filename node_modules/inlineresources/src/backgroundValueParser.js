// Simple, stupid "background"/"background-image" value parser that just aims at exposing the image URLs
"use strict";

var cssSupport = require('./cssSupport');


var trimCSSWhitespace = function (url) {
    var whitespaceRegex = /^[\t\r\f\n ]*(.+?)[\t\r\f\n ]*$/;

    return url.replace(whitespaceRegex, "$1");
};

// TODO exporting this for the sake of unit testing. Should rather test the background value parser explicitly.
exports.extractCssUrl = function (cssUrl) {
    var urlRegex = /^url\(([^\)]+)\)/,
        quotedUrl;

    if (!urlRegex.test(cssUrl)) {
        throw new Error("Invalid url");
    }

    quotedUrl = urlRegex.exec(cssUrl)[1];
    return cssSupport.unquoteString(trimCSSWhitespace(quotedUrl));
};

var sliceBackgroundDeclaration = function (backgroundDeclarationText) {
    var functionParamRegexS = "\\s*(?:\"[^\"]*\"|'[^']*'|[^\\(]+)\\s*",
        valueRegexS = "(" + "url\\(" + functionParamRegexS + "\\)" + "|" + "[^,\\s]+" + ")",
        simpleSingularBackgroundRegexS = "(?:\\s*" + valueRegexS + ")+",
        simpleBackgroundRegexS = "^\\s*(" + simpleSingularBackgroundRegexS + ")" +
                                  "(?:\\s*,\\s*(" + simpleSingularBackgroundRegexS + "))*" +
                                  "\\s*$",
        simpleSingularBackgroundRegex = new RegExp(simpleSingularBackgroundRegexS, "g"),
        outerRepeatedMatch,
        backgroundLayers = [],
        getValues = function (singularBackgroundDeclaration) {
            var valueRegex = new RegExp(valueRegexS, "g"),
                backgroundValues = [],
                repeatedMatch;

            repeatedMatch = valueRegex.exec(singularBackgroundDeclaration);
            while (repeatedMatch) {
                backgroundValues.push(repeatedMatch[1]);
                repeatedMatch = valueRegex.exec(singularBackgroundDeclaration);
            }
            return backgroundValues;
        };

    if (backgroundDeclarationText.match(new RegExp(simpleBackgroundRegexS))) {
        outerRepeatedMatch = simpleSingularBackgroundRegex.exec(backgroundDeclarationText);
        while (outerRepeatedMatch) {
            backgroundLayers.push(getValues(outerRepeatedMatch[0]));
            outerRepeatedMatch = simpleSingularBackgroundRegex.exec(backgroundDeclarationText);
        }

        return backgroundLayers;
    }
    return [];
};

var findBackgroundImageUrlInValues = function (values) {
    var i, url;

    for(i = 0; i < values.length; i++) {
        try {
            url = exports.extractCssUrl(values[i]);
            return {
                url: url,
                idx: i
            };
        } catch (e) {}
    }
};

exports.parse = function (backgroundValue) {
    var backgroundLayers = sliceBackgroundDeclaration(backgroundValue);

    return backgroundLayers.map(function (backgroundLayerValues) {
        var urlMatch = findBackgroundImageUrlInValues(backgroundLayerValues);

        if (urlMatch) {
            return {
                preUrl: backgroundLayerValues.slice(0, urlMatch.idx),
                url: urlMatch.url,
                postUrl: backgroundLayerValues.slice(urlMatch.idx+1),
            };
        } else {
            return {
                preUrl: backgroundLayerValues
            };
        }
    });
};

exports.serialize = function (parsedBackground) {
    var backgroundLayers = parsedBackground.map(function (backgroundLayer) {
        var values = [].concat(backgroundLayer.preUrl);

        if (backgroundLayer.url) {
            values.push('url("' + backgroundLayer.url + '")');
        }
        if (backgroundLayer.postUrl) {
            values = values.concat(backgroundLayer.postUrl);
        }

        return values.join(' ');
    });

    return backgroundLayers.join(', ');
};
