describe("Media Query Helper", function () {
    "use strict";

    describe("needsEmWorkaround", function () {

        // rough integration tests

        ifInPhantomJsIt("should detect issue on old WebKit engines", function (done) {
            mediaQueryHelper.needsEmWorkaround().then(function (result) {
                expect(result).toBe(true);

                done();
            });
        });

        // Safari seems to have caught up, great!
        ifNotInPhantomJsIt("should not detect issue on newer browsers", function (done) {
            mediaQueryHelper.needsEmWorkaround().then(function (result) {
                expect(result).toBe(false);

                done();
            });
        });

        it("should remove test image from DOM", function (done) {
            mediaQueryHelper.needsEmWorkaround().then(function () {
                expect(document.querySelector("img")).toBe(null);

                done();
            });
        });
    });

    describe("workAroundWebKitEmSizeIssue", function () {
        var doc;

        var addStyle = function (styleContent) {
            var style = doc.createElement('style');

            style.textContent = styleContent;
            doc.querySelector('head').appendChild(style);
        };

        beforeEach(function () {
            doc = document.implementation.createHTMLDocument('');
        });

        // phantomjs seems not to parse the style and so is not available for manipulation
        ifNotInPhantomJsIt("should rewrite an em value into px", function () {
            addStyle('@media (min-width: 1em) {}');

            mediaQueryHelper.workAroundWebKitEmSizeIssue(doc);

            expect(doc.querySelector('style').textContent).toMatch(/@media (all and )?\(min-width: ?16px\)/);
        });

        ifNotInPhantomJsIt("should keep a px value", function () {
            addStyle('@media (min-width: 15px) {}');

            mediaQueryHelper.workAroundWebKitEmSizeIssue(doc);

            expect(doc.querySelector('style').textContent).toMatch(/@media (all and )?\(min-width: ?15px\)/);
        });

        ifNotInPhantomJsIt("should handle mixed units", function () {
            addStyle('@media (min-width: 15px), (max-width: 2em) {}');

            mediaQueryHelper.workAroundWebKitEmSizeIssue(doc);

            expect(doc.querySelector('style').textContent).toMatch(/@media (all and )?\(min-width: ?15px\), (all and )?\(max-width: ?32px\)/);
        });

        ifNotInPhantomJsIt("should handle fractions", function () {
            addStyle('@media (min-width: 1.2em) {}');

            mediaQueryHelper.workAroundWebKitEmSizeIssue(doc);

            expect(doc.querySelector('style').textContent).toMatch(/@media (all and )?\(min-width: ?19.2px\)/);
        });

        it("should not crash on errors by avoiding rewrite of rules", function () {
            // Let's add an invalid media query and make sure it doesn't get changed (Firefox and Chrome complain)
            addStyle('@media (min-width: 2) {}');

            mediaQueryHelper.workAroundWebKitEmSizeIssue(doc);

            expect(doc.querySelector('style').textContent).toMatch(/@media \(min-width: 2\)/);
        });
    });

    // this functionality should sit inside css-mediaquery
    describe("serializeQuery", function () {
        it("should serialize a simple media query", function () {
            var parsedQuery = cssMediaQuery.parse('(width: 12px)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('all and (width: 12px)');
        });

        it("should serialize query with modifier", function () {
            var parsedQuery = cssMediaQuery.parse('(min-width: 12px)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('all and (min-width: 12px)');
        });

        it("should serialize query with all media", function () {
            var parsedQuery = cssMediaQuery.parse('all and (width: 12px)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('all and (width: 12px)');
        });

        it("should serialize query with screen media", function () {
            var parsedQuery = cssMediaQuery.parse('screen and (width: 12px)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('screen and (width: 12px)');
        });

        it("should serialize query with inverse", function () {
            var parsedQuery = cssMediaQuery.parse('not all and (width: 12px)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('not all and (width: 12px)');
        });

        it("should serialize query with alternatives", function () {
            var parsedQuery = cssMediaQuery.parse('(width: 12px), (height: 20em)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual(
                'all and (width: 12px), all and (height: 20em)'
            );
        });

        it("should serialize multiple query parts", function () {
            var parsedQuery = cssMediaQuery.parse('(width: 12px) and (height: 20em)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual(
                'all and (width: 12px) and (height: 20em)'
            );
        });

        it("should serialize query without value", function () {
            var parsedQuery = cssMediaQuery.parse('all and (color)');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('all and (color)');
        });

        it("should serialize just the media", function () {
            var parsedQuery = cssMediaQuery.parse('print');

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual('print');
        });

        it("should serialize a complex query", function () {
            var parsedQuery = cssMediaQuery.parse(
                'print, (orientation: landscape), screen and (max-width: 720px), not all and (height: 10em) and (min-width: 10px)'
            );

            expect(mediaQueryHelper.serializeQuery(parsedQuery)).toEqual(
                'print, all and (orientation: landscape), screen and (max-width: 720px), not all and (height: 10em) and (min-width: 10px)'
            );
        });
    });
});
