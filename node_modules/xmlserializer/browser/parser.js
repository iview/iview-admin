window.parser = (function (html) {
    var parser = {};

    var addHTMLTagAttributes = function (doc, html) {
        var attributeMatch = /<html((?:\s+[^>]*)?)>/im.exec(html),
            helperDoc = document.implementation.createHTMLDocument(''),
            htmlTagSubstitute,
            i, elementSubstitute, attribute;

        if (!attributeMatch) {
            return;
        }

        htmlTagSubstitute = '<div' + attributeMatch[1] + '></div>';
        helperDoc.documentElement.innerHTML = htmlTagSubstitute;
        elementSubstitute = helperDoc.querySelector('div');

        for (i = 0; i < elementSubstitute.attributes.length; i++) {
            attribute = elementSubstitute.attributes[i];
            doc.documentElement.setAttribute(attribute.name, attribute.value);
        }
    };

    parser.parse = function (html) {
        var doc;
        if ((new DOMParser()).parseFromString('<a></a>', 'text/html')) {
            doc = (new DOMParser()).parseFromString(html, 'text/html');
        } else {
            doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = html;

            addHTMLTagAttributes(doc, html);
        }
        return doc;
    };

    return parser;
}());
