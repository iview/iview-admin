"use strict";

var ayepromise = require('ayepromise'),
    inlineScript = require('../../src/inlineScript'),
    util = require('../../src/util'),
    testHelper = require('../testHelper');


describe("JS inline", function () {
    var doc, joinUrlSpy, ajaxSpy,
        internalScript,
        ajaxUrlMocks = {};

    var setupAjaxMock = function () {
        return spyOn(util, "ajax").and.callFake(function (url) {
            var defer = ayepromise.defer();
            if (ajaxUrlMocks[url] !== undefined) {
                defer.resolve(ajaxUrlMocks[url]);
            } else {
                defer.reject({
                    url: 'THEURL' + url
                });
            }
            return defer.promise;
        });
    };

    var mockAjaxUrl = function (url, content) {
        ajaxUrlMocks[url] = content;
    };

    var anExternalScript = function () {
        return anExternalScriptWith("var b = 1;", "url/some.js");
    };

    var anotherExternalScript = function () {
        var script = anExternalScriptWith("function something() {}", "url/someOther.js");
        script.type = "text/javascript";
        script.id = "myScript";
        return script;
    };

    var anExternalScriptWith = function (content, url) {
        var externalScript = window.document.createElement("script");

        url = url || 'some/url.js';

        externalScript.src = url;

        mockAjaxUrl(url, content);

        return externalScript;
    };

    beforeEach(function () {
        doc = document.implementation.createHTMLDocument("");

        joinUrlSpy = spyOn(util, "joinUrl");
        ajaxSpy = setupAjaxMock();

        internalScript = window.document.createElement("script");
        internalScript.textContent = "function () {}";

        joinUrlSpy.and.callFake(function (base, rel) {
            return base + rel;
        });
    });

    it("should do nothing if no linked JS is found", function (done) {
        inlineScript.inline(doc, {}).then(function () {
            expect(doc.getElementsByTagName("script").length).toEqual(0);

            done();
        });
    });

    it("should inline linked JS", function (done) {
        doc.head.appendChild(anExternalScript());

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("script").length).toEqual(1);
            expect(doc.head.getElementsByTagName("script")[0].textContent).toEqual("var b = 1;");
            expect(doc.head.getElementsByTagName("script")[0].src).toBe('');

            done();
        });
    });

    it("should remove the src attribute from the inlined script", function (done) {
        doc.head.appendChild(anotherExternalScript());

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("script").length).toEqual(1);
            expect(doc.head.getElementsByTagName("script")[0].src).toBe('');

            done();
        });
    });

    it("should keep all other script's attributes inlining", function (done) {
        doc.head.appendChild(anotherExternalScript());

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("script").length).toEqual(1);
            expect(doc.head.getElementsByTagName("script")[0].type).toEqual("text/javascript");
            expect(doc.head.getElementsByTagName("script")[0].id).toEqual("myScript");

            done();
        });
    });

    it("should place the inlined script where the external node was", function (done) {
        doc.head.appendChild(anExternalScript());
        doc.body.appendChild(anotherExternalScript());

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.getElementsByTagName("script").length).toEqual(2);
            expect(doc.head.getElementsByTagName("script")[0].textContent).toEqual("var b = 1;");
            expect(doc.body.getElementsByTagName("script")[0].textContent).toEqual("function something() {}");

            done();
        });
    });

    it("should not touch internal scripts", function (done) {
        doc.head.appendChild(internalScript);

        inlineScript.inline(doc, {}).then(function () {
            expect(ajaxSpy).not.toHaveBeenCalled();
            expect(doc.head.getElementsByTagName("script").length).toEqual(1);
            expect(doc.head.getElementsByTagName("script")[0]).toEqual(internalScript);

            done();
        });
    });

    it("should correctly quote closing HTML tags in the script", function (done) {
        doc.head.appendChild(anExternalScriptWith('var closingScriptTag = "</script>";'));

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("script")[0].textContent).toEqual('var closingScriptTag = "<\\/script>";');

            done();
        });
    });

    xit("should not quote a regex", function (done) {
        doc.head.appendChild(anExternalScriptWith("/</.test('<');"));

        inlineScript.inline(doc, {}).then(function () {
            expect(doc.head.getElementsByTagName("script")[0].textContent).toEqual("/</.test('<');");

            done();
        });
    });

    it("should respect the document's baseURI when loading linked JS", function (done) {
        var getDocumentBaseUrlSpy = spyOn(util, 'getDocumentBaseUrl').and.callThrough();

        doc = testHelper.readDocumentFixture("externalJS.html");

        inlineScript.inline(doc, {}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith("some.js", {baseUrl: doc.baseURI});
            expect(getDocumentBaseUrlSpy).toHaveBeenCalledWith(doc);

            done();
        });
    });

    it("should respect optional baseUrl when loading linked JS", function (done) {
        doc.head.appendChild(anExternalScriptWith('', 'externalScript.js'));

        inlineScript.inline(doc, {baseUrl: "some_base_url/"}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith('externalScript.js', {baseUrl: "some_base_url/"});

            done();
        });
    });

    it("should favour explicit baseUrl over document.baseURI when loading linked JS", function (done) {
        doc = testHelper.readDocumentFixture("externalJS.html");
        expect(doc.baseURI).not.toBeNull();
        expect(doc.baseURI).not.toEqual("about:blank");

        inlineScript.inline(doc, {baseUrl: "some_base_url/"}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith("some.js", {baseUrl: "some_base_url/"});

            done();
        });
    });

    it("should circumvent caching if requested", function (done) {
        doc.head.appendChild(anExternalScript());

        inlineScript.inline(doc, {cache: 'none'}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith(jasmine.any(String), {
                cache: 'none'
            });

            done();
        });
    });

    it("should not circumvent caching by default", function (done) {
        doc.head.appendChild(anExternalScript());

        inlineScript.inline(doc, {}).then(function () {
            expect(ajaxSpy).toHaveBeenCalledWith(jasmine.any(String), {});

            done();
        });
    });

    describe("error handling", function () {
        var brokenJsScript, anotherBrokenJsScript;

        beforeEach(function () {
            brokenJsScript = window.document.createElement("script");
            brokenJsScript.src = "a_document_that_doesnt_exist.js";

            anotherBrokenJsScript = window.document.createElement("script");
            anotherBrokenJsScript.src = "another_document_that_doesnt_exist.js";

            joinUrlSpy.and.callThrough();
        });

        it("should report an error if a script could not be loaded", function (done) {
            doc.head.appendChild(brokenJsScript);

            inlineScript.inline(doc, {}).then(function (errors) {
                expect(errors[0]).toEqual(jasmine.objectContaining({
                    resourceType: "script",
                    url: 'THEURL' + "a_document_that_doesnt_exist.js",
                    msg: "Unable to load script " + 'THEURL' + "a_document_that_doesnt_exist.js"
                }));

                done();
            });
        });

        it("should only report a failing script as error", function (done) {
            doc.head.appendChild(brokenJsScript);
            doc.head.appendChild(anExternalScript());

            inlineScript.inline(doc, {}).then(function (errors) {
                expect(errors.length).toBe(1);

                done();
            });
        });

        it("should report multiple failing scripts as error", function (done) {
            doc.head.appendChild(brokenJsScript);
            doc.head.appendChild(anotherBrokenJsScript);

            inlineScript.inline(doc, {}).then(function (errors) {
                expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                expect(errors[0]).not.toEqual(errors[1]);

                done();
            });
        });

        it("should report an empty list for a successful script", function (done) {
            doc.head.appendChild(anExternalScript());

            inlineScript.inline(doc, {}).then(function (errors) {
                expect(errors).toEqual([]);

                done();
            });
        });
    });

});
