var grammar = require('./grammar');


exports.SyntaxError = function (message, offset) {
    this.message  = message;
    this.offset   = offset;
};

exports.parse = function (fontFaceSourceValue) {
    try {
        return grammar.parse(fontFaceSourceValue);
    } catch (e) {
        throw new exports.SyntaxError(e.message, e.offset);
    }
};

exports.serialize = function (parsedFontFaceSources) {
    return parsedFontFaceSources.map(function (sourceItem) {
        var itemValue;

        if (sourceItem.url) {
            itemValue = 'url("' + sourceItem.url + '")';
            if (sourceItem.format) {
                itemValue += ' format("' + sourceItem.format + '")';
            }
        } else {
            itemValue = 'local("' + sourceItem.local + '")';
        }
        return itemValue;
    }).join(', ');
};
