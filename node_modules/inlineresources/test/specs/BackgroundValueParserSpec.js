"use strict";

var backgroundValueParser = require('../../src/backgroundValueParser');


describe("Background value parser", function () {
    describe("extractCssUrl", function () {
        it("should extract a CSS URL", function () {
            var url = backgroundValueParser.extractCssUrl('url(path/file.png)');
            expect(url).toEqual("path/file.png");
        });

        it("should handle double quotes", function () {
            var url = backgroundValueParser.extractCssUrl('url("path/file.png")');
            expect(url).toEqual("path/file.png");
        });

        it("should handle single quotes", function () {
            var url = backgroundValueParser.extractCssUrl("url('path/file.png')");
            expect(url).toEqual("path/file.png");
        });

        it("should handle whitespace", function () {
            var url = backgroundValueParser.extractCssUrl('url(   path/file.png )');
            expect(url).toEqual("path/file.png");
        });

        it("should also handle tab, line feed, carriage return and form feed", function () {
            var url = backgroundValueParser.extractCssUrl('url(\t\r\f\npath/file.png\t\r\f\n)');
            expect(url).toEqual("path/file.png");
        });

        it("should keep any other whitspace", function () {
            var url = backgroundValueParser.extractCssUrl('url(\u2003\u3000path/file.png)');
            expect(url).toEqual("\u2003\u3000path/file.png");
        });

        it("should handle whitespace with double quotes", function () {
            var url = backgroundValueParser.extractCssUrl('url( "path/file.png"  )');
            expect(url).toEqual("path/file.png");
        });

        it("should handle whitespace with single quotes", function () {
            var url = backgroundValueParser.extractCssUrl("url( 'path/file.png'  )");
            expect(url).toEqual("path/file.png");
        });

        it("should extract a data URI", function () {
            var url = backgroundValueParser.extractCssUrl('url("data:image/png;base64,soMEfAkebASE64=")');
            expect(url).toEqual("data:image/png;base64,soMEfAkebASE64=");
        });

        it("should throw an exception on invalid CSS URL", function () {
            expect(function () {
                backgroundValueParser.extractCssUrl('invalid_stuff');
            }).toThrow(new Error("Invalid url"));
        });
    });

    describe("parse", function () {
        it("should parse a url", function () {
            var values = backgroundValueParser.parse('url(path/file.png)');
            expect(values).toEqual([{
                preUrl: [],
                url: 'path/file.png',
                postUrl: []
            }]);
        });

        it("should parse an empty string", function () {
            var values = backgroundValueParser.parse('');
            expect(values).toEqual([]);
        });

        // shortcomming of the background value parser
        xit("should deal with a linear-gradient", function () {
            var values = backgroundValueParser.parse('linear-gradient(to bottom right, red, rgba(255,0,0,0))');
            expect(values).toEqual([{
                preUrl: ['linear-gradient(to bottom right, red, rgba(255,0,0,0))']
            }]);
        });

        it("should deal with a url mixed with a linear-gradient", function () {
            var values = backgroundValueParser.parse('url(path/file.png), linear-gradient(to bottom right, red, rgba(255,0,0,0))');
            expect(values[0]).toEqual({
                preUrl: [],
                url: 'path/file.png',
                postUrl: []
            });
        });

        it("should deal with a url mixed with a linear-gradient", function () {
            var values = backgroundValueParser.parse('linear-gradient(to bottom right, red, rgba(255,0,0,0)), url(path/file.png)');
            expect(values[values.length-1]).toEqual({
                preUrl: [],
                url: 'path/file.png',
                postUrl: []
            });
        });
    });

    describe('back and forth conversion', function () {
        it("should handle a url", function () {
            var cssValue = backgroundValueParser.serialize(backgroundValueParser.parse('url(path/file.png)'));
            expect(cssValue).toEqual('url("path/file.png")');
        });

        it("should deal with a url mixed with a linear-gradient", function () {
            var cssValue = backgroundValueParser.serialize(backgroundValueParser.parse('url(path/file.png), linear-gradient(to bottom right, red, rgba(255,0,0,0))'));
            expect(cssValue).toEqual('url("path/file.png"), linear-gradient(to bottom right, red, rgba(255, 0, 0, 0))');
        });

    });
});
