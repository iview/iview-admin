var getParser = function () {
        if (typeof require !== "undefined") {
            var Parser = require('parse5').Parser;
            return new Parser();
        } else {
            return window.parser;
        }
    },
    getSerializer = function () {
        if (typeof require !== "undefined") {
            return require('../../lib/serializer');
        } else {
            return window.xmlserializer;
        }
    },
    parser = getParser(),
    serializer = getSerializer();

var serializerCollapsesHeadAndBody = (function () {
    var xhtml = serializer.serializeToString(parser.parse(''));
    return (/<head\/>/).test(xhtml);
}());

describe('xmlserializer', function () {
    var withXHTMLBoilerplate = function (body, head) {
        var document = '<html xmlns="http://www.w3.org/1999/xhtml">';
        head = head || '';
        body = body || '';

        if (serializerCollapsesHeadAndBody && !head) {
            document += '<head/>';
        } else {
            document += '<head>' + head + '</head>';
        }
        if (serializerCollapsesHeadAndBody && !body) {
            document += '<body/>';
        } else {
            document += '<body>' + body + '</body>';
        }
        document += '</html>';
        return document;
    };

    var emptyDocument = function () {
        return withXHTMLBoilerplate();
    };

    it('should return a valid XHTML document for empty input', function() {
        var doc = parser.parse('');

        expect(serializer.serializeToString(doc)).toEqual(emptyDocument());
    });

    it('should return a valid XHTML document for HTML', function () {
        var doc = parser.parse('<html></html>');

        expect(serializer.serializeToString(doc)).toEqual(emptyDocument());
    });

    it('should serialize comments', function () {
        var doc = parser.parse('<html><body><!-- this is a comment -->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!-- this is a comment -->'));
    });

    it('should correctly serialize special characters in comments', function () {
        var doc = parser.parse('<html><body><!-- &gt; -->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!-- &gt; -->'));
    });

    it('should quote dashes in comments', function () {
        var doc = parser.parse('<html><body><!--- -- - - ---- --->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!--&#45; &#45;&#45; &#45; &#45; &#45;&#45;&#45;&#45; &#45;-->'));
    });

    it('should serialize attributes', function () {
        var doc = parser.parse('<p class="myClass"> </p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize text', function () {
        var doc = parser.parse('<p> this is text</p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p> this is text</p>'));
    });

    it('should serialize HTML to lower case tag names', function () {
        var doc = parser.parse('<P> </P>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p> </p>'));
    });

    it('should not change letter case in tag names for non HTML', function () {
        var doc = parser.parse('<html><svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient/></defs></svg></html>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient/></defs></svg>'));
    });

    it('should serialize to lower case attribute names', function () {
        var doc = parser.parse('<p Class="myClass"> </p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize HTML enties', function () {
        var doc = parser.parse('&ndash;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('–'));
    });

    it('should correctly quote ampersand', function () {
        var doc = parser.parse('&amp;&amp;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&amp;&amp;'));
    });

    it('should correctly quote lighter than', function () {
        var doc = parser.parse('&lt;&lt;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&lt;&lt;'));
    });

    it('should correctly quote greater than', function () {
        var doc = parser.parse('&gt;&gt;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&gt;&gt;'));
    });

    it('should not quote tab, carriage return, line feed or space', function () {
        var doc = parser.parse('-&#x9;&#xa;&#xd; -');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('-\t\n\r -'));
    });

    it('should correctly serialize special characters in attributes', function () {
        var doc = parser.parse('<input value="&quot;&gt;&lt;&amp;&apos;"/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<input value="&quot;&gt;&lt;&amp;&apos;"/>'));
    });

    it('should serialize to self closing attribute', function () {
        var doc = parser.parse('<br/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<br/>'));
    });

    it('should quote script content', function () {
        var doc = parser.parse('<script>var a = 1 & 1;</script>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('',
            '<script>var a = 1 &amp; 1;</script>'));
    });

    it('should quote style content', function () {
        var doc = parser.parse('<style>span:before { content: "<"; }</style>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('',
            '<style>span:before { content: "&lt;"; }</style>'));
    });

    it('should convert boolean attributes', function () {
        var doc = parser.parse('<input type="checkbox" checked/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<input type="checkbox" checked=""/>'));
    });

    it('should prefer existing xmlns', function () {
        var doc = parser.parse('<html xmlns="somenamespace"></html>');

        expect(serializer.serializeToString(doc)).toEqual('<html xmlns="somenamespace"><head/><body/></html>');
    });

    it('should serialize any element', function () {
        var doc = parser.parse('<div>a div</div>'),
            htmlNode = doc.childNodes[doc.childNodes.length - 1],
            div = htmlNode.childNodes[1].childNodes[0];

        expect(serializer.serializeToString(div)).toEqual('<div xmlns="http://www.w3.org/1999/xhtml">a div</div>');
    });

    describe('invalid characters', function () {
        it('should remove invalid ASCII control characters', function () {
            var doc = parser.parse('-&#x1;&#x2;&#x3;&#x4;&#x5;&#x6;&#x7;&#x8;&#xb;&#xc;&#xe;&#xf;&#x10;&#x11;&#x12;&#x13;&#x14;&#x15;&#x16;&#x17;&#x18;&#x19;&#x1a;&#x1b;&#x1c;&#x1d;&#x1e;&#x1f;');

            expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('-'));
        });

        it('should remove invalid characters from attributes', function () {
            var doc = parser.parse('<input value="&#x1;"/>');

            expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<input value=""/>'));
        });

        it('should remove invalid characters from script content', function () {
            var doc = parser.parse('<script>\x01</script>');

            expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('', '<script></script>'));
        });

        it('should remove invalid characters from style content', function () {
            var doc = parser.parse('<style>\x01</style>');

            expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('', '<style></style>'));
        });

        it('should remove invalid characters from comments', function () {
            var doc = parser.parse('<html><body><!--\x01-->');

            expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!---->'));
        });

    });
});
