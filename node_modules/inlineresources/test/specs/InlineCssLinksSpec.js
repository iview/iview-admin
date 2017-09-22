"use strict";

var ayepromise = require('ayepromise'),
    inline = require('../../src/inline'),
    inlineCss = require('../../src/inlineCss'),
    util = require('../../src/util'),
    testHelper = require('../testHelper');


describe("Inline CSS links", function () {
    var doc, joinUrlSpy, ajaxSpy,
        adjustPathsOfCssResourcesSpy, loadCSSImportsForRulesSpy, loadAndInlineCSSResourcesForRulesSpy,
        ajaxUrlMocks = {};

    var setupAjaxMock = function () {
        ajaxSpy = spyOn(util, "ajax").and.callFake(function (url, options) {
            var defer = ayepromise.defer();

            if (ajaxUrlMocks[url + ' ' + options.baseUrl] !== undefined) {
                defer.resolve(ajaxUrlMocks[url + ' ' + options.baseUrl]);
            // try matching without base url
            } else if (ajaxUrlMocks[url] !== undefined) {
                defer.resolve(ajaxUrlMocks[url]);
            } else {
                defer.reject({
                    url: 'THEURL' + url
                });
            }
            return defer.promise;
        });
    };

    var mockAjaxUrl = function () {
        var url = arguments[0],
            baseUrl = arguments.length > 2 ? arguments[1] : null,
            content = arguments.length > 2 ? arguments[2] : arguments[1],
            urlKey = baseUrl === null ? url : url + ' ' + baseUrl;

        ajaxUrlMocks[urlKey] = content;
    };

    var aCssLink = function () {
        return aCssLinkWith("url/some.css", "p { font-size: 14px; }");
    };

    var aCssLinkWith = function (url, content) {
        var cssLink = window.document.createElement("link");
        cssLink.href = url;
        cssLink.rel = "stylesheet";
        cssLink.type = "text/css";

        mockAjaxUrl(cssLink.href, content);
        // href will return absolute path, attributes.href.value relative one in Chrome
        mockAjaxUrl(cssLink.attributes.href.value, content);

        return cssLink;
    };

    var fulfilled = function (value) {
        var defer = ayepromise.defer();
        defer.resolve(value);
        return defer.promise;
    };

    beforeEach(function () {
        doc = document.implementation.createHTMLDocument("");

        joinUrlSpy = spyOn(util, "joinUrl");
        adjustPathsOfCssResourcesSpy = spyOn(inlineCss, 'adjustPathsOfCssResources');
        loadCSSImportsForRulesSpy = spyOn(inlineCss, 'loadCSSImportsForRules').and.returnValue(fulfilled({
            hasChanges: false,
            errors: []
        }));
        loadAndInlineCSSResourcesForRulesSpy = spyOn(inlineCss, 'loadAndInlineCSSResourcesForRules').and.returnValue(fulfilled({
            hasChanges: false,
            errors: []
        }));
        setupAjaxMock();
    });

    it("should do nothing if no linked CSS is found", function (done) {
        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(0);

            done();
        });
    });

    it("should not touch non-CSS links", function (done) {
        var faviconLink = window.document.createElement("link");
        faviconLink.href = "favicon.ico";
        faviconLink.type = "image/x-icon";

        doc.head.appendChild(faviconLink);

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(0);
            expect(doc.head.getElementsByTagName("link").length).toEqual(1);

            done();
        });
    });

    it("should inline linked CSS", function (done) {
        doc.head.appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(1);
            expect(doc.head.getElementsByTagName("style")[0].textContent).toEqual("p { font-size: 14px; }");
            expect(doc.head.getElementsByTagName("link").length).toEqual(0);

            done();
        });
    });

    it("should inline linked CSS without a type", function (done) {
        var noTypeCssLink = window.document.createElement("link");
        noTypeCssLink.href = 'yet_another.css';
        noTypeCssLink.rel = "stylesheet";

        doc.head.appendChild(noTypeCssLink);

        mockAjaxUrl(noTypeCssLink.href, "p { font-size: 14px; }");
        // href will return absolute path, attributes.href.value relative one in Chrome
        mockAjaxUrl(noTypeCssLink.attributes.href.value, "p { font-size: 14px; }");

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(1);
            expect(doc.head.getElementsByTagName("style")[0].textContent).toEqual("p { font-size: 14px; }");
            expect(doc.head.getElementsByTagName("link").length).toEqual(0);

            done();
        });
    });

    it("should inline multiple linked CSS and keep order", function (done) {
        var anotherCssLink = aCssLinkWith("url/another.css", "a { text-decoration: none; }"),
            inlineCss = window.document.createElement("style");

        inlineCss.type = "text/css";
        inlineCss.textContent = "span { margin: 0; }";

        doc.head.appendChild(aCssLink());
        doc.head.appendChild(inlineCss);
        doc.head.appendChild(anotherCssLink);

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(3);
            expect(doc.head.getElementsByTagName("style")[0].textContent.trim()).toEqual("p { font-size: 14px; }");
            expect(doc.head.getElementsByTagName("style")[1].textContent.trim()).toEqual("span { margin: 0; }");
            expect(doc.head.getElementsByTagName("style")[2].textContent.trim()).toEqual("a { text-decoration: none; }");
            expect(doc.head.getElementsByTagName("link").length).toEqual(0);

            done();
        });
    });

    it("should not add inline CSS if no content given", function (done) {
        var emptyCssLink = aCssLinkWith("url/empty.css", "");

        doc.head.appendChild(emptyCssLink);

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("style").length).toEqual(0);
            expect(doc.head.getElementsByTagName("link").length).toEqual(0);

            done();
        });
    });

    it("should inline CSS imports", function (done) {
        doc.head.appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(loadCSSImportsForRulesSpy).toHaveBeenCalled();
            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[0][0].cssText).toMatch(/p \{\s*font-size: 14px;\s*\}/);

            done();
        });
    });

    it("should inline CSS resources", function (done) {
        doc.head.appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(loadAndInlineCSSResourcesForRulesSpy).toHaveBeenCalled();
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[0][0].cssText).toMatch(/p \{\s*font-size: 14px;\s*\}/);

            done();
        });
    });

    testHelper.ifNotInPhantomIt("should respect the document's baseURI when loading linked CSS", function (done) {
        var getDocumentBaseUrlSpy = spyOn(util, 'getDocumentBaseUrl').and.callThrough();

        testHelper.loadHTMLDocumentFixture("externalCSS.html").then(function (doc) {
            mockAjaxUrl("some.css", "p { font-size: 14px; }");

            inline.loadAndInlineCssLinks(doc, {}).then(function () {
                expect(doc.getElementsByTagName("style").length).toEqual(1);
                expect(doc.getElementsByTagName("style")[0].textContent).toEqual("p { font-size: 14px; }");
                expect(doc.getElementsByTagName("link").length).toEqual(0);

                expect(ajaxSpy.calls.mostRecent().args[1].baseUrl).toEqual(doc.baseURI);
                expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].baseUrl).toEqual(doc.baseURI);
                expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].baseUrl).toEqual(doc.baseURI);
                expect(getDocumentBaseUrlSpy).toHaveBeenCalledWith(doc);

                done();
            });
        });
    });

    testHelper.ifNotInPhantomIt("should respect optional baseUrl when loading linked CSS", function (done) {
        mockAjaxUrl("some.css", "p { font-size: 14px; }");

        testHelper.loadHTMLDocumentFixtureWithoutBaseURI("externalCSS.html").then(function (doc) {
            inline.loadAndInlineCssLinks(doc, {baseUrl: testHelper.fixturesPath}).then(function () {
                expect(ajaxSpy.calls.mostRecent().args[1].baseUrl).toEqual(testHelper.fixturesPath);

                expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].baseUrl).toEqual(testHelper.fixturesPath);
                expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].baseUrl).toEqual(testHelper.fixturesPath);

                done();
            });
        });
    });

    testHelper.ifNotInPhantomIt("should favour explicit baseUrl over document.baseURI when loading linked CSS", function (done) {
        var baseUrl = testHelper.fixturesPath;

        testHelper.loadHTMLDocumentFixture("externalCSS.html").then(function (doc) {
            expect(doc.baseURI).not.toBeNull();
            expect(doc.baseURI).not.toEqual("about:blank");
            expect(doc.baseURI).not.toEqual(baseUrl);

            mockAjaxUrl("some.css", "p { font-size: 14px; }");

            inline.loadAndInlineCssLinks(doc, {baseUrl: testHelper.fixturesPath}).then(function () {
                expect(ajaxSpy.calls.mostRecent().args[1].baseUrl).toEqual(testHelper.fixturesPath);

                expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].baseUrl).toEqual(testHelper.fixturesPath);
                expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].baseUrl).toEqual(testHelper.fixturesPath);

                done();
            });
        });
    });

    it("should map resource paths relative to the stylesheet", function (done) {
        var cssWithRelativeResource;

        cssWithRelativeResource = window.document.createElement("link");
        cssWithRelativeResource.href = "below/some.css";
        cssWithRelativeResource.rel = "stylesheet";
        cssWithRelativeResource.type = "text/css";

        doc.head.appendChild(cssWithRelativeResource);

        mockAjaxUrl("below/some.css", "some_url/",
            'div { background-image: url("../green.png"); }\n' +
            '@font-face { font-family: "test font"; src: url("fake.woff"); }');

        inline.loadAndInlineCssLinks(doc, {baseUrl: "some_url/"}).then(function () {
            expect(adjustPathsOfCssResourcesSpy).toHaveBeenCalledWith("below/some.css", jasmine.any(Object));

            done();
        });
    });

    it("should circumvent caching if requested", function (done) {
        var cssLink = aCssLink();
        doc.head.appendChild(cssLink);

        inline.loadAndInlineCssLinks(doc, {cache: 'none'}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith(cssLink.attributes.href.value, {
                cache: 'none'
            });

            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].cache).toEqual('none');
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].cache).toEqual('none');

            done();
        });
    });

    it("should not circumvent caching by default", function (done) {
        var cssLink = aCssLink();
        doc.head.appendChild(cssLink);

        inline.loadAndInlineCssLinks(doc, {}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith(cssLink.attributes.href.value, {});

            expect(loadCSSImportsForRulesSpy.calls.mostRecent().args[2].cache).not.toBe(false);
            expect(loadAndInlineCSSResourcesForRulesSpy.calls.mostRecent().args[1].cache).not.toBe(false);

            done();
        });
    });

    it("should cache inlined content if a cache bucket is given", function (done) {
        var cacheBucket = {};

        // first call
        doc = document.implementation.createHTMLDocument("");
        doc.head.appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function () {
            expect(ajaxSpy).toHaveBeenCalled();

            ajaxSpy.calls.reset();
            loadCSSImportsForRulesSpy.calls.reset();
            loadAndInlineCSSResourcesForRulesSpy.calls.reset();

            // second call
            doc = document.implementation.createHTMLDocument("");
            doc.head.appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function () {
                expect(ajaxSpy).not.toHaveBeenCalled();
                expect(loadCSSImportsForRulesSpy).not.toHaveBeenCalled();
                expect(loadAndInlineCSSResourcesForRulesSpy).not.toHaveBeenCalled();

                expect(doc.getElementsByTagName("style")[0].textContent).toEqual("p { font-size: 14px; }");

                done();
            });
        });
    });

    it("should cache inlined content for different pages if baseUrl is the same", function (done) {
        var cacheBucket = {};

        joinUrlSpy.and.callThrough();

        // first call
        doc = testHelper.readDocumentFixture("empty1.html");
        doc.getElementsByTagName("head")[0].appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function () {
            ajaxSpy.calls.reset();
            loadCSSImportsForRulesSpy.calls.reset();
            loadAndInlineCSSResourcesForRulesSpy.calls.reset();

            // second call
            doc = testHelper.readDocumentFixture("empty2.html"); // use a document with different url, but same baseUrl
            doc.getElementsByTagName("head")[0].appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function () {
                expect(ajaxSpy).not.toHaveBeenCalled();
                expect(loadCSSImportsForRulesSpy).not.toHaveBeenCalled();
                expect(loadAndInlineCSSResourcesForRulesSpy).not.toHaveBeenCalled();

                expect(doc.getElementsByTagName("style")[0].textContent).toEqual("p { font-size: 14px; }");

                done();
            });
        });
    });

    it("should not cache inlined content if caching turned off", function (done) {
        var cacheBucket = {};

        // first call
        doc = document.implementation.createHTMLDocument("");
        doc.head.appendChild(aCssLink());

        inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket, cache: 'none'}).then(function () {
            expect(ajaxSpy).toHaveBeenCalled();

            ajaxSpy.calls.reset();

            // second call
            doc = document.implementation.createHTMLDocument("");
            doc.head.appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket, cache: 'none'}).then(function () {
                expect(ajaxSpy).toHaveBeenCalled();

                done();
            });
        });
    });

    describe("error handling", function () {
        var brokenCssLink, anotherBrokenCssLink;

        beforeEach(function () {
            brokenCssLink = window.document.createElement("link");
            brokenCssLink.href = "a_document_that_doesnt_exist.css";
            brokenCssLink.rel = "stylesheet";
            brokenCssLink.type = "text/css";

            anotherBrokenCssLink = window.document.createElement("link");
            anotherBrokenCssLink.href = "another_document_that_doesnt_exist.css";
            anotherBrokenCssLink.rel = "stylesheet";
            anotherBrokenCssLink.type = "text/css";

            joinUrlSpy.and.callThrough();
        });

        it("should report an error if a stylesheet could not be loaded", function (done) {
            doc.head.appendChild(brokenCssLink);

            inline.loadAndInlineCssLinks(doc, {}).then(function (errors) {
                expect(errors).toEqual([{
                    resourceType: "stylesheet",
                    url: "THEURL" + "a_document_that_doesnt_exist.css",
                    msg: "Unable to load stylesheet " + "THEURL" + "a_document_that_doesnt_exist.css"
                }]);

                done();
            });
        });

        it("should only report a failing stylesheet as error", function (done) {
            doc.head.appendChild(brokenCssLink);
            doc.head.appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {}).then(function (errors) {
                expect(errors).toEqual([{
                    resourceType: "stylesheet",
                    url: "THEURL" + "a_document_that_doesnt_exist.css",
                    msg: jasmine.any(String)
                }]);

                done();
            });
        });

        it("should report multiple failing stylesheets as error", function (done) {
            doc.head.appendChild(brokenCssLink);
            doc.head.appendChild(anotherBrokenCssLink);

            inline.loadAndInlineCssLinks(doc, {}).then(function (errors) {
                expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                expect(errors[0]).not.toEqual(errors[1]);

                done();
            });
        });

        it("should report errors from inlining resources", function (done) {
            doc.head.appendChild(aCssLink());

            loadCSSImportsForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ["import inline error"]
            }));
            loadAndInlineCSSResourcesForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ["resource inline error"]
            }));

            inline.loadAndInlineCssLinks(doc, {}).then(function (errors) {
                expect(errors).toEqual(["import inline error", "resource inline error"]);

                done();
            });
        });

        it("should report an empty list for a successful stylesheet", function (done) {
            doc.head.appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {}).then(function (errors) {
                expect(errors).toEqual([]);

                done();
            });
        });

        it("should cache errors alongside if a cache bucket is given", function (done) {
            var cacheBucket = {};

            loadCSSImportsForRulesSpy.and.returnValue(fulfilled({
                hasChanges: false,
                errors: ["import inline error"]
            }));

            // first call
            doc = document.implementation.createHTMLDocument("");
            doc.head.appendChild(aCssLink());

            inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function () {

                // second call
                doc = document.implementation.createHTMLDocument("");
                doc.head.appendChild(aCssLink());

                inline.loadAndInlineCssLinks(doc, {cacheBucket: cacheBucket}).then(function (errors) {
                    expect(errors).toEqual(["import inline error"]);

                    done();
                });
            });
        });
    });
});
