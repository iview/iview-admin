"use strict";

var ayepromise = require('ayepromise'),
    inline = require('../../src/inline');


describe("Inline main", function () {
    var loadAndInlineImages, loadAndInlineCssLinks, loadAndInlineStyles, loadAndInlineScript;

    var withoutErrors = function () {
        return withErrors([]);
    };

    var withErrors = function (errors) {
        var defer = ayepromise.defer();
        defer.resolve(errors);
        return defer.promise;
    };

    beforeEach(function () {
        loadAndInlineImages = spyOn(inline, "loadAndInlineImages");
        loadAndInlineCssLinks = spyOn(inline, "loadAndInlineCssLinks");
        loadAndInlineStyles = spyOn(inline, "loadAndInlineStyles");
        loadAndInlineScript = spyOn(inline, "loadAndInlineScript");
    });

    it("should inline all resources", function (done) {
        var doc = "doc";

        loadAndInlineImages.and.returnValue(withoutErrors());
        loadAndInlineCssLinks.and.returnValue(withoutErrors());
        loadAndInlineStyles.and.returnValue(withoutErrors());
        loadAndInlineScript.and.returnValue(withoutErrors());

        inline.inlineReferences(doc, {}).then(function (errors) {
            expect(errors).toEqual([]);

            expect(loadAndInlineImages).toHaveBeenCalledWith(doc, {});
            expect(loadAndInlineCssLinks).toHaveBeenCalledWith(doc, {});
            expect(loadAndInlineStyles).toHaveBeenCalledWith(doc, {});
            expect(loadAndInlineScript).toHaveBeenCalledWith(doc, {});

            done();
        });
    });

    it("should pass on options", function (done) {
        var doc = "doc";

        loadAndInlineImages.and.returnValue(withoutErrors());
        loadAndInlineCssLinks.and.returnValue(withoutErrors());
        loadAndInlineStyles.and.returnValue(withoutErrors());
        loadAndInlineScript.and.returnValue(withoutErrors());

        inline.inlineReferences(doc, {baseUrl: "a_baseUrl", cache: 'none'}).then(function () {
            expect(loadAndInlineImages).toHaveBeenCalledWith(doc, {baseUrl: "a_baseUrl", cache: 'none'});
            expect(loadAndInlineCssLinks).toHaveBeenCalledWith(doc, {baseUrl: "a_baseUrl", cache: 'none'});
            expect(loadAndInlineStyles).toHaveBeenCalledWith(doc, {baseUrl: "a_baseUrl", cache: 'none'});
            expect(loadAndInlineScript).toHaveBeenCalledWith(doc, {baseUrl: "a_baseUrl", cache: 'none'});

            done();
        });
    });

    it("should pass through an error from inlining", function (done) {
        var doc = "doc";

        loadAndInlineImages.and.returnValue(withErrors(["the error"]));
        loadAndInlineCssLinks.and.returnValue(withoutErrors());
        loadAndInlineStyles.and.returnValue(withoutErrors());
        loadAndInlineScript.and.returnValue(withoutErrors());

        inline.inlineReferences(doc, {}).then(function (errors) {
            expect(errors).toEqual(["the error"]);

            done();
        });
    });

    it("should pass through multiple errors from inlining on drawDocument", function (done) {
        var doc = "doc";

        loadAndInlineImages.and.returnValue(withErrors(["the error"]));
        loadAndInlineStyles.and.returnValue(withErrors(["more error"]));
        loadAndInlineCssLinks.and.returnValue(withErrors(["another error"]));
        loadAndInlineScript.and.returnValue(withErrors(["error from script"]));

        inline.inlineReferences(doc, {}).then(function (errors) {
            expect(errors).toEqual(["the error", "more error", "another error", "error from script"]);

            done();
        });
    });

    it("should optionally not inline scripts", function (done) {
        var doc = "doc";

        loadAndInlineImages.and.returnValue(withoutErrors());
        loadAndInlineCssLinks.and.returnValue(withoutErrors());
        loadAndInlineStyles.and.returnValue(withoutErrors());

        inline.inlineReferences(doc, {inlineScripts: false}).then(function () {
            expect(loadAndInlineScript).not.toHaveBeenCalled();

            done();
        });
    });
});
