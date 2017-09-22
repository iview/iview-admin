"use strict";

var ayepromise = require('ayepromise'),
    inline = require('../../src/inline'),
    inlineCss = require('../../src/inlineCss'),
    util = require('../../src/util'),
    testHelper = require('../testHelper');


describe("Inline styles", function () {
    var doc, loadCSSImportsForRulesSpy, loadAndInlineCSSResourcesForRulesSpy;

    var fulfilled = function (value) {
        var defer = ayepromise.defer();
        defer.resolve(value);
        return defer.promise;
    };

    beforeEach(function () {
        doc = document.implementation.createHTMLDocument("");

        loadCSSImportsForRulesSpy = spyOn(inlineCss, 'loadCSSImportsForRules').and.returnValue(fulfilled({
            hasChanges: false,
            errors: []
        }));
        loadAndInlineCSSResourcesForRulesSpy = spyOn(inlineCss, 'loadAndInlineCSSResourcesForRules').and.returnValue(fulfilled({
            hasChanges: false,
            errors: []
        }));
        spyOn(util, 'clone').and.callFake(function (object) {
            return object;
        });
    });

    it("should do nothing if no CSS is found", function (done) {
        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).not.toHaveBeenCalled();

            done();
        });
    });

    it("should not touch unrelated CSS", function (done) {
        testHelper.addStyleToDocument(doc, "span { padding-left: 0; }");

        loadCSSImportsForRulesSpy.and.callFake(function(rules) {
            rules[0] = "fake rule";
            return fulfilled({
                hasChanges: false,
                errors: []
            });
        });
        loadAndInlineCSSResourcesForRulesSpy.and.callFake(function(rules) {
            rules[0] = "something else";
            return fulfilled({
                hasChanges: false,
                errors: []
            });
        });

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style")[0].textContent).toEqual("span { padding-left: 0; }");

            done();
        });
    });

    it("should replace an import with the content of the given URL", function (done) {
        testHelper.addStyleToDocument(doc, '@import url("that.css");');

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[0][0].cssText).toMatch(/@import url\([ "]?that.css[ "]?\)\s*;/);

            done();
        });
    });

    it("should inline css resources", function (done) {
        testHelper.addStyleToDocument(doc, 'span { background-image: url("anImage.png"); }');

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[0][0].cssText).toMatch(/span \{\s*background-image: url\("?anImage.png"?\)\s*;\s*\}/);

            done();
        });
    });

    it("should accept a style element without a type", function (done) {
        var styleNode = doc.createElement("style");

        styleNode.appendChild(doc.createTextNode('@import url("imported.css");'));
        doc.head.appendChild(styleNode);

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();

            done();
        });
    });

    it("should ignore a style element with a non CSS type", function (done) {
        var styleNode = doc.createElement("style");
        styleNode.type = "text/plain";

        styleNode.appendChild(doc.createTextNode('@import url("imported.css");'));
        doc.head.appendChild(styleNode);

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).not.toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy).not.toHaveBeenCalled();

            done();
        });
    });

    it("should respect the document's baseURI", function (done) {
        var getDocumentBaseUrlSpy = spyOn(util, 'getDocumentBaseUrl').and.callThrough();
        doc = testHelper.readDocumentFixture("importCss.html");

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalledWith(jasmine.any(Object), [], {baseUrl: doc.baseURI});
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalledWith(jasmine.any(Object), {baseUrl: doc.baseURI});
            expect(getDocumentBaseUrlSpy).toHaveBeenCalledWith(doc);

            done();
        });
    });

    it("should favour explicit baseUrl over document.baseURI", function (done) {
        var baseUrl = "aBaseURI";

        doc = testHelper.readDocumentFixture("importCss.html");

        expect(doc.baseURI).not.toBeNull();
        expect(doc.baseURI).not.toEqual("about:blank");
        expect(doc.baseURI).not.toEqual(baseUrl);

        inline.loadAndInlineStyles(doc, {baseUrl: baseUrl}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalledWith(jasmine.any(Object), [], {baseUrl: baseUrl});
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalledWith(jasmine.any(Object), {baseUrl: baseUrl});

            done();
        });
    });

    it("should circumvent caching if requested", function (done) {
        testHelper.addStyleToDocument(doc, '@import url("that.css");');

        inline.loadAndInlineStyles(doc, {cache: 'none'}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].cache).toEqual('none');
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].cache).toEqual('none');

            done();
        });
    });

    it("should not circumvent caching by default", function (done) {
        testHelper.addStyleToDocument(doc, '@import url("that.css");');

        inline.loadAndInlineStyles(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2]).toBeTruthy();
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].cache).not.toBe(false);

            done();
        });
    });

    it("should cache inlined content if a cache bucket is given", function (done) {
        var cacheBucket = {};

        loadAndInlineCSSResourcesForRulesSpy.and.returnValue(fulfilled({
            hasChanges: true,
            errors: []
        }));

        // first call
        doc = document.implementation.createHTMLDocument("");
        testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

        inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();

            loadCSSImportsForRulesSpy.calls.reset();
            loadAndInlineCSSResourcesForRulesSpy.calls.reset();

            // second call
            doc = document.implementation.createHTMLDocument("");
            testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

            inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function () {
                expect(loadCSSImportsForRulesSpy).not.toHaveBeenCalled();
                expect(loadAndInlineCSSResourcesForRulesSpy).not.toHaveBeenCalled();

                expect(doc.getElementsByTagName("style")[0].textContent).toMatch(/background-image\s*{\s*}/);

                done();
            });
        });
    });

    testHelper.ifNotInPhantomIt("should not use cache inlined content if the documents' URLs don't match", function (done) {
        var cacheBucket = {};

        loadAndInlineCSSResourcesForRulesSpy.and.returnValue(fulfilled({
            hasChanges: true,
            errors: []
        }));

        // first call
        doc = document.implementation.createHTMLDocument("");
        testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

        inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();

            loadCSSImportsForRulesSpy.calls.reset();
            loadAndInlineCSSResourcesForRulesSpy.calls.reset();

            // second call
            testHelper.loadHTMLDocumentFixture("image.html").then(function (doc) { // use a document with different baseUrl
                testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

                inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function () {
                    expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
                    expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();

                    done();
                });
            });
        });
    });

    it("should not cache inlined content if caching turned off", function (done) {
        var cacheBucket = {};

        // first call
        doc = document.implementation.createHTMLDocument("");
        testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

        inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket, cache: 'none'}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();

            loadCSSImportsForRulesSpy.calls.reset();

            // second call
            doc = document.implementation.createHTMLDocument("");
            testHelper.addStyleToDocument(doc, 'background-image { url(anImage.png); }');

            inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket, cache: 'none'}).then(function () {
                expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();

                done();
            });
        });
    });

    describe("error handling", function () {

        it("should report errors", function (done) {
            loadCSSImportsForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ['import error']
            }));
            loadAndInlineCSSResourcesForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ['resource error']
            }));
            testHelper.addStyleToDocument(doc, '@import url("that.css");');

            inline.loadAndInlineStyles(doc, {}).then(function (errors) {
                expect(errors).toEqual(['import error', 'resource error']);

                done();
            });
        });

        it("should cache errors alongside if a cache bucket is given", function (done) {
            var cacheBucket = {};

            loadCSSImportsForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ['import error']
            }));

            // first call
            doc = document.implementation.createHTMLDocument("");
            testHelper.addStyleToDocument(doc, '@import url("that.css");');

            inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function () {

                // second call
                doc = document.implementation.createHTMLDocument("");
                testHelper.addStyleToDocument(doc, '@import url("that.css");');

                inline.loadAndInlineStyles(doc, {cacheBucket: cacheBucket}).then(function (errors) {
                    expect(errors).toEqual(["import error"]);

                    done();
                });
            });
        });
    });
});
