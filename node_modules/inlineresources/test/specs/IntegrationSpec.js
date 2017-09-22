var inline = require('../../src/inline'),
    testHelper = require('../testHelper');

describe("Integration", function () {
    "use strict";

    var testFixture = function (html) {
        var doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = html;
        return doc;
    };

    var fixturePath = function (path) {
        return testHelper.fixturesPath + 'integration/' + path;
    };

    it("should inline an image", function (done) {
        var doc = testFixture('<img src="' + fixturePath('fakeImage.png') + '">');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var img = doc.querySelector('img');

            expect(img.src).toEqual(
                'data:image/png;base64,' + btoa('fakeImage.png\n')
            );

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline an image input", function (done) {
        var doc = testFixture('<input type="image" src="' + fixturePath('fakeImage.png') + '">');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var input = doc.querySelector('input');

            expect(input.src).toEqual(
                'data:image/png;base64,' + btoa('fakeImage.png\n')
            );

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline a background image", function (done) {
        var doc = testFixture('<style>' +
            'div { background-image: url("' + fixturePath('fakeImage.png') + '"); }' +
            '</style>');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var style = doc.querySelector('style'),
                rule = style.sheet.cssRules[0];

            expect(rule.style.backgroundImage).toMatch(
                new RegExp('url\\("?data:image/png;base64,' + btoa('fakeImage.png\n') + '"?\\)')
            );

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline a font-face rule", function (done) {
        var doc = testFixture('<style>' +
            '@font-face { font-family: "FakeFont"; src: ' +
            'url("' + fixturePath('fakeFont.woff') + '"), ' +
            'url("' + fixturePath('fakeFont.ttf') + '") format("truetype"); }' +
            '</style>');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var style = doc.querySelector('style'),
                rule = style.sheet.cssRules[0];

            expect(rule.style.getPropertyValue("src")).toMatch(
                new RegExp(
                    'url\\("?data:font/woff;base64,' + btoa('fakeFont.woff\n') + '"?\\), ' +
                    'url\\("?data:font/truetype;base64,' + btoa('fakeFont.ttf\n') + '"?\\) format\\("?truetype"?\\)'
                )
            );

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline a import rule", function (done) {
        var doc = testFixture('<style>' +
            '@import url("' + fixturePath('aStylesheet.css') + '");' +
            '</style>');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var style = doc.querySelector('style');

            expect(style.textContent).toMatch(/a \{\s*content: "?stylesheet"?;\s*\}/);

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline a link", function (done) {
        var doc = testFixture('<link rel="stylesheet" href="' + fixturePath('aStylesheet.css') + '">');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var style = doc.querySelector('style');

            expect(style.textContent).toMatch(/a \{\s*content: "stylesheet";\s*\}/);

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should inline a script", function (done) {
        var doc = testFixture('<script src="' + fixturePath('aScript.js') + '">');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var script = doc.querySelector('script');

            expect(script.textContent).toEqual('var a = "script";\n');

            expect(errors).toEqual([]);

            done();
        });
    });

    it("should include a complex setup of link, import and different paths", function (done) {
        var doc = testFixture('<link rel="stylesheet" href="' + fixturePath('withImport.css') + '">');

        inline.inlineReferences(doc, {}).then(function (errors) {
            var style = doc.querySelector('style'),
                rule = style.sheet.cssRules[0];

            expect(rule.style.backgroundImage).toMatch(
                new RegExp('url\\("?data:image/png;base64,' + btoa('anotherFakeImage.svg\n') + '"?\\)')
            );

            expect(errors).toEqual([]);

            done();
        });
    });
});
