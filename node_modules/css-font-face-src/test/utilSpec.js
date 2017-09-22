var util = require('../lib/util');

describe("Util", function () {
    describe("extractValue", function () {
        it("should handle string without quotes", function () {
            var fontName = util.extractValue('the font');
            expect(fontName).toEqual("the font");
        });

        it("should handle double quotes", function () {
            var fontName = util.extractValue('"the font"');
            expect(fontName).toEqual("the font");
        });

        it("should handle single quotes", function () {
            var fontName = util.extractValue("'the font'");
            expect(fontName).toEqual("the font");
        });

        it("should handle whitespace", function () {
            var fontName = util.extractValue('   the font ');
            expect(fontName).toEqual("the font");
        });

        it("should also handle tab, line feed, carriage return and form feed", function () {
            var fontName = util.extractValue('\t\r\f\nthe font\t\r\f\n');
            expect(fontName).toEqual("the font");
        });

        it("should keep any other whitspace", function () {
            var fontName = util.extractValue('\u2003the font');
            expect(fontName).toEqual("\u2003the font");
        });

        it("should handle whitespace with double quotes", function () {
            var fontName = util.extractValue(' "the font"  ');
            expect(fontName).toEqual("the font");
        });

        it("should handle whitespace with single quotes", function () {
            var fontName = util.extractValue(" 'the font'  ");
            expect(fontName).toEqual("the font");
        });
    });
});
