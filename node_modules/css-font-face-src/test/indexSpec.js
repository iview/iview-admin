var parser = require('../lib/index');

describe("Parser", function () {
    describe("parse", function () {
        it("should throw an error on an invalid value", function () {
            expect(function () {
                parser.parse("invalid text");
            }).toThrow(new parser.SyntaxError('Expected "local(", "url(" or end of input but "i" found.', 1));
        });

        it("should throw an error on an invalid value together with a valid one", function () {
            expect(function () {
                parser.parse('"invalid url", url("font.woff")');
            }).toThrow(new parser.SyntaxError('Expected "local(", "url(" or end of input but "\\"" found.', 1));
        });

        it("should throw an error on an invalid value together with a valid one in the reverse order", function () {
            expect(function () {
                parser.parse('url("font.woff"), "invalid url"');
            }).toThrow(new parser.SyntaxError('Expected "local(", "url(" or [ \\t\\r\\n\\f] but "\\"" found.', 18));
        });

        it("should parse a single local font value", function () {
            var parse = parser.parse('local("font name")');

            expect(parse).toEqual([{
                local: 'font name'
            }]);
        });

        it("should parse a single url value", function () {
            var parse = parser.parse('url("font.woff")');

            expect(parse).toEqual([{
                url: 'font.woff'
            }]);
        });

        it("should parse a single url value with a format", function () {
            var parse = parser.parse('url("font.woff") format("woff")');

            expect(parse).toEqual([{
                url: 'font.woff',
                format: 'woff'
            }]);
        });

        it("should parse a mix of multiple values", function () {
            var parse = parser.parse("local('The Font'), url( 'font.otf') format('opentype'), url(font.woff), local(\"Another Font\")");

            expect(parse).toEqual([{
                local: 'The Font'
            }, {
                url: 'font.otf',
                format: 'opentype'
            }, {
                url: 'font.woff'
            }, {
                local: 'Another Font'
            }]);
        });

        it("should parse white space between values", function () {
            var parse = parser.parse('url("font.woff") \t\r\n\f, \t\r\n\furl("font.eot")');

            expect(parse).toEqual([{
                url: 'font.woff'
            }, {
                url: 'font.eot'
            }]);
        });

        it("should parse white space between a format", function () {
            var parse = parser.parse('url("font.woff") \t\r\n\fformat("woff")');

            expect(parse).toEqual([{
                url: 'font.woff',
                format: 'woff'
            }]);
        });

        it("should handle an empty string", function () {
            var parse = parser.parse("");

            expect(parse).toEqual([]);
        });
    });

    describe("serialize", function () {
        it("should serialize a single local font value", function () {
            var text = parser.serialize(parser.parse('local("font name")'));

            expect(text).toEqual('local("font name")');
        });

        it("should serialize a single url value", function () {
            var text = parser.serialize(parser.parse('url("font.woff")'));

            expect(text).toEqual('url("font.woff")');
        });

        it("should serialize a single url value with a format", function () {
            var text = parser.serialize(parser.parse('url("font.woff") format("woff")'));

            expect(text).toEqual('url("font.woff") format("woff")');
        });

        it("should serialize a mix of multiple values", function () {
            var text = parser.serialize(parser.parse("local('The Font'), url('font.otf') format('opentype'), url('font.woff'), local(\"Another Font\")"));

            expect(text).toEqual('local("The Font"), url("font.otf") format("opentype"), url("font.woff"), local("Another Font")');
        });

        it("should handle an empty string", function () {
            var text = parser.serialize(parser.parse(""));

            expect(text).toEqual('');
        });
    });
});
