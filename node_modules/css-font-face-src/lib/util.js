var trimCSSWhitespace = function (value) {
    var whitespaceRegex = /^[\t\r\f\n ]*(.+?)[\t\r\f\n ]*$/;

    return value.replace(whitespaceRegex, "$1");
};

var unquoteString = function (quotedUrl) {
    var doubleQuoteRegex = /^"(.*)"$/,
        singleQuoteRegex = /^'(.*)'$/;

    if (doubleQuoteRegex.test(quotedUrl)) {
        return quotedUrl.replace(doubleQuoteRegex, "$1");
    } else {
        if (singleQuoteRegex.test(quotedUrl)) {
            return quotedUrl.replace(singleQuoteRegex, "$1");
        } else {
            return quotedUrl;
        }
    }
};

exports.extractValue = function (value) {
    return unquoteString(trimCSSWhitespace(value));
};
