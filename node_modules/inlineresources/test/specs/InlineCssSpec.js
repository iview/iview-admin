"use strict";

var ayepromise = require('ayepromise'),
    inlineCss = require('../../src/inlineCss'),
    util = require('../../src/util'),
    testHelper = require('../testHelper'),
    backgroundValueParser = require('../../src/backgroundValueParser'),
    ifNotInChromeIt = testHelper.ifNotInChromeIt;


describe("Inline CSS content", function () {
    var joinUrlSpy, ajaxSpy, binaryAjaxSpy, getDataURIForImageURLSpy;

    var parseRulesNatively = function (text) {
        var doc = document.implementation.createHTMLDocument(""),
            style = doc.createElement('style');

        style.textContent = text;
        doc.documentElement.appendChild(style);
        return Array.prototype.slice.call(style.sheet.cssRules);
    };

    var parseRules = function (text) {
        var cssom = require('cssom');

        // TODO tests should rather be duplicated testing against one backend each
        if (testHelper.isChrome) {
            return cssom.parse(text).cssRules;
        } else {
            return parseRulesNatively(text);
        }
    };

    beforeEach(function () {
        joinUrlSpy = spyOn(util, "joinUrl").and.callFake(function (base, url) {
            return url;
        });
        ajaxSpy = spyOn(util, "ajax");
        binaryAjaxSpy = spyOn(util, "binaryAjax");
        getDataURIForImageURLSpy = spyOn(util, "getDataURIForImageURL");
    });

    describe("adjustPathsOfCssResources", function () {
        var extractCssUrlSpy;

        beforeEach(function () {
            extractCssUrlSpy = spyOn(backgroundValueParser, "extractCssUrl").and.callFake(function (cssUrl) {
                if (/^url/.test(cssUrl)) {
                    return cssUrl.replace(/^url\("?/, '').replace(/"?\)$/, '');
                } else {
                    throw "error";
                }
            });
        });

        it("should map background paths relative to the stylesheet", function () {
            var rules = parseRules('div { background-image: url("../green.png"); }');

            joinUrlSpy.and.callFake(function (base, url) {
                if (url === "../green.png" && base === "below/some.css") {
                    return "green.png";
                }
            });

            inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(rules[0].style.getPropertyValue('background-image')).toMatch(/url\(\"?green\.png\"?\)/);
        });

        it("should map font paths relative to the stylesheet", function () {
            var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.woff"); }');

            joinUrlSpy.and.callFake(function (base, url) {
                if (url === "fake.woff" && base === "below/some.css") {
                    return "below/fake.woff";
                }
            });

            inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(rules[0].style.getPropertyValue('src')).toMatch(/url\(\"?below\/fake\.woff\"?\)/);
        });

        it("should map import paths relative to the stylesheet", function () {
            var rules = parseRules('@import url(my.css);');

            joinUrlSpy.and.callFake(function (base, url) {
                if (url === "my.css" && base === "below/some.css") {
                    return "below/my.css";
                }
            });

            inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(rules[0].href).toEqual('below/my.css');
        });

        it("should report changes", function () {
            var rules = parseRules('@import url(my.css);');

            joinUrlSpy.and.callFake(function () {
                return "below/my.css";
            });

            var hasChanges = inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(hasChanges).toBe(true);
        });

        it("should report no changes", function () {
            var rules = parseRules('div { background-image: url("data:image/png;base64,someDataUri");');

            var hasChanges = inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(hasChanges).toBe(false);
        });

        it("should keep all src references intact when mapping resource paths", function () {
            var rules = parseRules('@font-face { font-family: "test font"; src: local("some font"), url("fake.woff"); }');

            joinUrlSpy.and.callFake(function (base, url) {
                if (base === "some_url/some.css") {
                    return "some_url/" + url;
                }
            });

            inlineCss.adjustPathsOfCssResources("some_url/some.css", rules);

            expect(rules[0].style.getPropertyValue('src')).toMatch(/local\("?some font"?\), url\(\"?some_url\/fake\.woff\"?\)/);
        });

        it("should keep the font-family when inlining with Webkit", function () {
            var rules = parseRules("@font-face { font-family: 'test font'; src: url(\"fake.woff\"); }");

            joinUrlSpy.and.callFake(function (base, url) {
                if (base === "some_url/some.css") {
                    return "some_url/" + url;
                }
            });

            inlineCss.adjustPathsOfCssResources("some_url/some.css", rules);

            expect(rules[0].style.getPropertyValue('font-family')).toMatch(/["']test font["']/);
        });

        it("should keep the font-style when inlining with Webkit", function () {
            var rules = parseRules("@font-face { font-family: 'test font'; font-style: italic; src: url(\"fake.woff\"); }");

            joinUrlSpy.and.callFake(function (base, url) {
                if (base === "some_url/some.css") {
                    return "some_url/" + url;
                }
            });

            inlineCss.adjustPathsOfCssResources("some_url/some.css", rules);

            expect(rules[0].style.getPropertyValue('font-style')).toEqual('italic');
        });

        it("should keep the font-weight when inlining with Webkit", function () {
            var rules = parseRules("@font-face { font-family: 'test font'; font-weight: 700; src: url(\"fake.woff\"); }");

            joinUrlSpy.and.callFake(function (base, url) {
                if (base === "some_url/some.css") {
                    return "some_url/" + url;
                }
            });

            inlineCss.adjustPathsOfCssResources("some_url/some.css", rules);

            expect(rules[0].style.getPropertyValue('font-weight')).toEqual('700');
        });

        it("should keep the !important specifity override", function () {
            var rules = parseRules('div { background-image: url("../green.png") !important; }');

            joinUrlSpy.and.callFake(function () {
                return "green.png";
            });

            inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(rules[0].cssText).toMatch(/\! ?important/);
        });

        xit("should inline both backgroundImage and background when in the same rule to catch CSSOM.js way of handling the shorthand form", function () {
            var rules = parseRules('span { background: url("../green.png"); background-image: url("../blue.png"); }');

            joinUrlSpy.and.callFake(function (base, url) {
                if (url === "../green.png" && base === "below/some.css") {
                    return "green.png";
                } else if (url === "../blue.png" && base === "below/some.css") {
                    return "blue.png";
                }
            });

            inlineCss.adjustPathsOfCssResources("below/some.css", rules);

            expect(rules[0].style.getPropertyValue('background')).toEqual('url("green.png")');
            expect(rules[0].style.getPropertyValue('background-image')).toEqual('url("blue.png")');
        });

    });

    describe("loadCSSImportsForRules", function () {
        var adjustPathsOfCssResourcesSpy,
            ajaxUrlMocks = {};

        var setupAjaxMock = function () {
            ajaxSpy.and.callFake(function (url) {
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

        beforeEach(function () {
            adjustPathsOfCssResourcesSpy = spyOn(inlineCss, 'adjustPathsOfCssResources');

            setupAjaxMock();
        });

        it("should replace an import with the content of the given URL", function (done) {
            var rules = parseRules('@import url("that.css");');

            mockAjaxUrl('that.css', "p { font-size: 10px; }");

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                expect(result.hasChanges).toBe(true);

                expect(rules.length).toEqual(1);
                expect(rules[0].cssText).toMatch(/p \{\s*font-size: 10px;\s*\}/);

                done();
            });
        });

        it("should inline multiple linked CSS and keep order", function (done) {
            var rules = parseRules('@import url("this.css");\n' +
                '@import url("that.css");');

            mockAjaxUrl('this.css', "div { display: inline-block; }");
            mockAjaxUrl('that.css', "p { font-size: 10px; }");

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(rules[0].cssText).toMatch(/div \{\s*display: inline-block;\s*\}/);
                expect(rules[1].cssText).toMatch(/p \{\s*font-size: 10px;\s*\}/);

                done();
            });

        });

        it("should support an import without the functional url() form", function (done) {
            var rules = parseRules('@import "that.css";');

            mockAjaxUrl('that.css', "");

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(ajaxSpy).toHaveBeenCalledWith("that.css", jasmine.any(Object));

                done();
            });

        });

        it("should handle empty content", function (done) {
            var rules = parseRules('@import url("that.css");');

            mockAjaxUrl('that.css', "");

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(rules.length).toEqual(0);

                done();
            });

        });

        it("should not add CSS if no content is given", function (done) {
            var rules = parseRules('@import url("that.css");\n' +
                '@import url("this.css");');

            mockAjaxUrl('that.css', "");
            mockAjaxUrl('this.css', "span { font-weight: bold; }");

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(rules.length).toEqual(1);

                done();
            });

        });

        it("should ignore invalid values", function (done) {
            var rules = parseRules('@import   invalid url;');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                expect(result.hasChanges).toBe(false);

                done();
            });
        });

        it("should not touch unrelated CSS", function (done) {
            var rules = parseRules('span {   padding-left: 0; }');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                expect(result.hasChanges).toBe(false);

                done();
            });
        });

        it("should not include a document more than once", function (done) {
            var rules = parseRules('@import url("that.css");\n' +
                '@import url("that.css");');

            mockAjaxUrl('that.css', 'p { font-size: 12px; }');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(ajaxSpy.calls.count()).toEqual(1);
                expect(rules.length).toEqual(1);

                done();
            });

        });

        it("should handle import in an import", function (done) {
            var rules = parseRules('@import url("this.css");');

            mockAjaxUrl("this.css", '@import url("that.css");');
            mockAjaxUrl("that.css", 'p { font-weight: bold; }');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(rules.length).toEqual(1);
                expect(rules[0].cssText).toMatch(/p \{\s*font-weight: bold;\s*\}/);

                done();
            });
        });

        it("should handle cyclic imports", function (done) {
            var rules = parseRules('@import url("this.css");');

            mockAjaxUrl("this.css",
                '@import url("that.css");\n' +
                'span { font-weight: 300; }');
            mockAjaxUrl("that.css",
                '@import url("this.css");\n' +
                'p { font-weight: bold; }');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(rules[0].cssText).toMatch(/p \{\s*font-weight: bold;\s*\}/);
                expect(rules[1].cssText).toMatch(/span \{\s*font-weight: 300;\s*\}/);

                done();
            });
        });

        it("should handle recursive imports", function (done) {
            var rules = parseRules('@import url("this.css");');

            mockAjaxUrl("this.css", '@import url("this.css");');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(ajaxSpy.calls.count()).toEqual(1);
                expect(rules.length).toEqual(0);

                done();
            });
        });

        it("should handle a baseUrl", function (done) {
            var rules = parseRules('@import url("that.css");');

            inlineCss.loadCSSImportsForRules(rules, [], {baseUrl: 'url_base/page.html'}).then(function () {
                expect(joinUrlSpy).toHaveBeenCalledWith('url_base/page.html', "that.css");

                done();
            });
        });

        it("should map resource paths relative to the stylesheet", function (done) {
            var rules = parseRules('@import url("url_base/that.css");');

            joinUrlSpy.and.callFake(function (base) {
                if (base === "") {
                    return base;
                }
            });
            mockAjaxUrl('url_base/that.css',
                'div { background-image: url("../green.png"); }\n' +
                '@font-face { font-family: "test font"; src: url("fake.woff"); }');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(adjustPathsOfCssResourcesSpy).toHaveBeenCalledWith('url_base/that.css', jasmine.any(Object));
                expect(adjustPathsOfCssResourcesSpy.calls.mostRecent().args[1][0].style.getPropertyValue('background-image')).toMatch(/url\(\"?\.\.\/green\.png\"?\)/);

                done();
            });
        });

        it("should circumvent caching if requested", function (done) {
            var rules = parseRules('@import url("that.css");');

            inlineCss.loadCSSImportsForRules(rules, [], {cache: 'none'}).then(function () {
                expect(ajaxSpy).toHaveBeenCalledWith("that.css", {
                    cache: 'none'
                });

                done();
            });
        });

        it("should not circumvent caching by default", function (done) {
            var rules = parseRules('@import url("that.css");');

            inlineCss.loadCSSImportsForRules(rules, [], {}).then(function () {
                expect(ajaxSpy).toHaveBeenCalledWith("that.css", {});

                done();
            });
        });

        describe("error handling", function () {
            beforeEach(function () {
                joinUrlSpy.and.callThrough();

                mockAjaxUrl("existing_document.css", "");
                mockAjaxUrl("existing_with_second_level_nonexisting.css",
                    '@import url("nonexisting.css");');
            });

            it("should report an error if a stylesheet could not be loaded", function (done) {
                var rules = parseRules('@import url("does_not_exist.css");');

                inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                    expect(result.hasChanges).toEqual(false);
                    expect(result.errors[0]).toEqual(jasmine.objectContaining({
                        resourceType: "stylesheet",
                        url: "THEURL" + "does_not_exist.css",
                        msg: "Unable to load stylesheet " + "THEURL" + "does_not_exist.css"
                    }));

                    done();
                });
            });

            it("should only report a failing stylesheet as error", function (done) {
                var rules = parseRules('@import url("existing_document.css");\n' +
                    '@import url("does_not_exist.css");');

                inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                    expect(result.errors.length).toBe(1);

                    done();
                });
            });

            it("should report multiple failing stylesheets as error", function (done) {
                var rules = parseRules('@import url("does_not_exist.css");\n' +
                    '@import url("also_does_not_exist.css");');

                inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                    expect(result.errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                    expect(result.errors[0]).not.toEqual(result.errors[1]);

                    done();
                });
            });

            it("should report errors from second level @imports", function (done) {
                var rules = parseRules('@import url("existing_with_second_level_nonexisting.css");');

                inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                    expect(result.errors[0]).toEqual(jasmine.objectContaining({
                            resourceType: "stylesheet",
                            url: "THEURL" + "nonexisting.css"
                        }
                    ));

                    done();
                });
            });

            it("should report an empty list for a successful stylesheet", function (done) {
                var rules = parseRules('@import url("existing_document.css");');

                inlineCss.loadCSSImportsForRules(rules, [], {}).then(function (result) {
                    expect(result.errors).toEqual([]);

                    done();
                });
            });
        });
    });

    describe("loadAndInlineCSSResourcesForRules", function () {
        var extractCssUrlSpy,
            urlMocks = {};

        var setupGetDataURIForImageURLMock = function () {
            getDataURIForImageURLSpy.and.callFake(function (url) {
                var defer = ayepromise.defer();
                if (urlMocks[url] !== undefined) {
                    defer.resolve(urlMocks[url]);
                } else {
                    defer.reject({
                        url: 'THEURL' + url
                    });
                }
                return defer.promise;
            });
        };

        var mockGetDataURIForImageURL = function (imageUrl, imageDataUri) {
            urlMocks[imageUrl] = imageDataUri;
        };

        beforeEach(function () {
            extractCssUrlSpy = spyOn(backgroundValueParser, "extractCssUrl").and.callFake(function (cssUrl) {
                if (/^url/.test(cssUrl)) {
                    return cssUrl.replace(/^url\("?/, '').replace(/"?\)$/, '');
                } else {
                    throw "error";
                }
            });

            setupGetDataURIForImageURLMock();
        });

        it("should work with empty content", function (done) {
            inlineCss.loadAndInlineCSSResourcesForRules([], {}).then(done);
        });

        describe("on background-image", function () {
            it("should not touch an already inlined background-image", function (done) {
                var rules = parseRules('span { background-image: url("data:image/png;base64,soMEfAkebASE64="); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);
                    expect(rules[0].style.getPropertyValue('background-image')).toMatch(/url\("?data:image\/png;base64,soMEfAkebASE64="?\)/);

                    done();
                });
            });

            it("should ignore invalid values", function (done) {
                var rules = parseRules('span { background-image: "invalid url"; }');

                extractCssUrlSpy.and.callFake(function () {
                    throw new Error("Invalid url");
                });

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);

                    done();
                });
            });

            // cssom is much more forgiving that the browsers
            ifNotInChromeIt("should ignore an invalid value together with a valid url", function (done) {
                var rules = parseRules('span { background-image: "invalid url", url("valid/url.png"); }');

                extractCssUrlSpy.and.callFake(function (value) {
                    if (value === 'url("valid/url.png")') {
                        return "valid/url.png";
                    } else {
                        throw new Error("Invalid url");
                    }
                });
                mockGetDataURIForImageURL("valid/url.png", "data:image/png;base64,someDataUri");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);

                    done();
                });
            });

            it("should inline a background-image", function (done) {
                var anImage = "anImage.png",
                    anImagesDataUri = "data:image/png;base64,someDataUri",
                    rules = parseRules('span { background-image: url("' + anImage + '"); }');

                mockGetDataURIForImageURL(anImage, anImagesDataUri);

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(true);

                    expect(extractCssUrlSpy.calls.mostRecent().args[0]).toMatch(new RegExp('url\\("?' + anImage + '"?\\)'));

                    expect(rules[0].style.getPropertyValue('background-image')).toMatch(new RegExp('url\\("?' + anImagesDataUri + '"?\\)'));

                    done();
                });
            });

            it("should inline a background declaration", function (done) {
                var anImage = "anImage.png",
                    anImagesDataUri = "data:image/png;base64,someDataUri",
                    rules = parseRules('span { background: url("' + anImage + '") top left, url("data:image/png;base64,someMoreDataUri") #FFF; }');

                mockGetDataURIForImageURL(anImage, anImagesDataUri);

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expect(rules[0].cssText).toMatch(/(background: [^;]*url\("?data:image\/png;base64,someDataUri"?\).*\s*top\s*.*, .*url\("?data:image\/png;base64,someMoreDataUri"?\).*;)|(background-image:\s*url\("?data:image\/png;base64,someDataUri"?\)\s*,\s*url\("?data:image\/png;base64,someMoreDataUri"?\)\s*;)/);

                    done();
                });
            });

            it("should inline multiple background-images in one rule", function (done) {
                var backgroundImageRegex = /url\("?([^\)"]+)"?\)\s*,\s*url\("?([^\)"]+)"?\)/,
                    anImage = "anImage.png",
                    anImagesDataUri = "data:image/png;base64,someDataUri",
                    aSecondImage = "aSecondImage.png",
                    aSecondImagesDataUri = "data:image/png;base64,anotherDataUri",
                    rules = parseRules('span { background-image: url("' + anImage + '"), url("' + aSecondImage + '"); }'),
                    match;

                mockGetDataURIForImageURL(anImage, anImagesDataUri);
                mockGetDataURIForImageURL(aSecondImage, aSecondImagesDataUri);

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expect(extractCssUrlSpy.calls.mostRecent().args[0]).toMatch(new RegExp('url\\("?' + aSecondImage + '"?\\)'));

                    expect(rules[0].style.getPropertyValue('background-image')).toMatch(backgroundImageRegex);
                    match = backgroundImageRegex.exec(rules[0].style.getPropertyValue('background-image'));
                    expect(match[1]).toEqual(anImagesDataUri);
                    expect(match[2]).toEqual(aSecondImagesDataUri);

                    done();
                });
            });

            it("should not break background-position (#30)", function (done) {
                var rules = parseRules('span { background-image: url("anImage.png"); background-position: 0 center, right center;}');

                mockGetDataURIForImageURL('anImage.png', "data:image/png;base64,someDataUri");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expect(rules[0].style.getPropertyValue('background-position')).toMatch(/0(px)?( (center|50%))?, (right|100%)( (center|50%))?/);

                    done();
                });
            });

            it("should handle a baseUrl", function () {
                var rules = parseRules('span { background-image: url("image.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {baseUrl:  'url_base/page.html'});

                expect(getDataURIForImageURLSpy.calls.mostRecent().args[1].baseUrl).toEqual('url_base/page.html');
            });

            it("should circumvent caching if requested", function () {
                var anImage = "anImage.png",
                    rules = parseRules('span { background-image: url("' + anImage + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {cache:  'none'});

                expect(getDataURIForImageURLSpy).toHaveBeenCalledWith(anImage, {cache: 'none'});
            });

            it("should not circumvent caching by default", function () {
                var anImage = "anImage.png",
                    rules = parseRules('span { background-image: url("' + anImage + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {});

                expect(getDataURIForImageURLSpy).toHaveBeenCalledWith(anImage, {});
            });

            it("should keep the !important specifity override", function (done) {
                var anImage = "anImage.png",
                    rules = parseRules('span { background-image: url("' + anImage + '") !important; }');

                mockGetDataURIForImageURL(anImage, "data:image/png;base64,someDataUri");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(true);

                    expect(rules[0].cssText).toMatch(/\! ?important/);

                    done();
                });
            });

            xit("should inline both backgroundImage and background when in the same rule to catch CSSOM.js way of handling the shorthand form", function (done) {
                var anImage = "anImage.png",
                    anImagesDataUri = "data:image/png;base64,someDataUri",
                    anotherImage = "anotherImage.png",
                    anotherImagesDataUri = "data:image/png;base64,otherDataUri",
                    rules = parseRules('span { background: url("' + anotherImage + '"); background-image: url("' + anImage + '"); }');

                mockGetDataURIForImageURL(anImage, anImagesDataUri);
                mockGetDataURIForImageURL(anotherImage, anotherImagesDataUri);

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(true);

                    expect(rules[0].style.getPropertyValue('background')).toEqual('url("' + anotherImagesDataUri + '")');
                    expect(rules[0].style.getPropertyValue('background-image')).toEqual('url("' + anImagesDataUri + '")');

                    done();
                });
            });

            it("should not return an error twice for a missing image", function (done) {
                var rules = parseRules('span { background: url("someImage.png"); background-image: url("someImage.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors.length).toBe(1);

                    done();
                });
            });
        });

        describe("on background-image with errors", function () {
            var aBackgroundImageThatDoesExist = "a_backgroundImage_that_does_exist.png";

            beforeEach(function () {
                mockGetDataURIForImageURL(aBackgroundImageThatDoesExist, '');
                joinUrlSpy.and.callThrough();
            });

            it("should report an error if a backgroundImage could not be loaded", function (done) {
                var rules = parseRules('span { background-image: url("a_backgroundImage_that_doesnt_exist.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);
                    expect(result.errors[0]).toEqual(jasmine.objectContaining({
                        resourceType: "backgroundImage",
                        url: "THEURL" + "a_backgroundImage_that_doesnt_exist.png",
                        msg: "Unable to load background-image " + "THEURL" + "a_backgroundImage_that_doesnt_exist.png"
                    }));

                    done();
                });
            });

            it("should only report a failing backgroundImage as error", function (done) {
                var rules = parseRules('span { background-image: url("a_backgroundImage_that_doesnt_exist.png"); }\n' +
                    'span { background-image: url("' + aBackgroundImageThatDoesExist + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors.length).toBe(1);

                    done();
                });
            });

            it("should report multiple failing backgroundImages as error", function (done) {
                var rules = parseRules('span { background-image: url("a_backgroundImage_that_doesnt_exist.png"); }\n' +
                    'span { background-image: url("another_backgroundImage_that_doesnt_exist.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    var errors = result.errors;
                    expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                    expect(errors[0]).not.toEqual(errors[1]);

                    done();
                });
            });

            it("should only report one failing backgroundImage for multiple in a rule", function (done) {
                var rules = parseRules('span { background-image: url("' + aBackgroundImageThatDoesExist + '"), url("a_backgroundImage_that_doesnt_exist.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors.length).toBe(1);
                    expect(result.errors[0]).toEqual(jasmine.objectContaining({
                        resourceType: "backgroundImage",
                        url: "THEURL" + "a_backgroundImage_that_doesnt_exist.png"
                    }));

                    done();
                });
            });

            it("should report multiple failing backgroundImages in one rule as error", function (done) {
                var rules = parseRules('span { background-image: url("a_backgroundImage_that_doesnt_exist.png"), url("another_backgroundImage_that_doesnt_exist.png"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    var errors = result.errors;
                    expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                    expect(errors[0]).not.toEqual(errors[1]);

                    done();
                });
            });

            it("should report an empty list for a successful backgroundImage", function (done) {
                var rules = parseRules('span { background-image: url("' + aBackgroundImageThatDoesExist + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors).toEqual([]);

                    done();
                });
            });
        });

        describe("on font-face", function () {
            var fontFaceSrcRegex = /url\("?([^\)"]+)"?\)(\s*format\("?([^\)"]+)"?\))?/,
                ajaxUrlMocks = {};

            var setupAjaxMock = function () {
                binaryAjaxSpy.and.callFake(function (url) {
                    var defer = ayepromise.defer();
                    if (ajaxUrlMocks[url] !== undefined) {
                        defer.resolve(ajaxUrlMocks[url]);
                    } else {
                        defer.reject();
                    }
                    return defer.promise;
                });
            };

            var mockBinaryAjaxUrl = function (url, content) {
                ajaxUrlMocks[url] = content;
            };

            var expectFontFaceUrlToMatch = function (rule, url, format) {
                var extractedUrl, match;

                match = fontFaceSrcRegex.exec(rule.style.getPropertyValue('src'));
                extractedUrl = match[1];
                expect(extractedUrl).toEqual(url);
                if (format) {
                    expect(match[3]).toEqual(format);
                }
            };

            beforeEach(function () {
                setupAjaxMock();
            });

            it("should not touch an already inlined font", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("data:font/woff;base64,soMEfAkebASE64="); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);
                    expectFontFaceUrlToMatch(rules[0], "data:font/woff;base64,soMEfAkebASE64=");

                    done();
                });
            });

            it("should ignore an invalid source", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: "invalid url"; }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);

                    expect(binaryAjaxSpy).not.toHaveBeenCalled();

                    done();
                });
            });

            it("should ignore an invalid source together with a valid one", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: "invalid url", url("fake.woff"); }');

                mockBinaryAjaxUrl('fake.woff', "this is not a font");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);

                    done();
                });
            });

            it("should ignore a local font", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: local("font name"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);

                    expect(binaryAjaxSpy).not.toHaveBeenCalled();

                    done();
                });

            });

            it("should inline a font", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.woff"); }');

                mockBinaryAjaxUrl('fake.woff', "this is not a font");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(true);

                    expectFontFaceUrlToMatch(rules[0], "data:font/woff;base64,dGhpcyBpcyBub3QgYSBmb250");

                    done();
                });
            });

            it("should take a font from url with alternatives", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: local("font name"), url("fake.woff"); }');

                mockBinaryAjaxUrl('fake.woff', "this is not a font");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expectFontFaceUrlToMatch(rules[0], "data:font/woff;base64,dGhpcyBpcyBub3QgYSBmb250");

                    done();
                });
            });

            it("should detect a woff", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.woff") format("woff"); }');

                mockBinaryAjaxUrl('fake.woff', "font's content");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expectFontFaceUrlToMatch(rules[0], "data:font/woff;base64,Zm9udCdzIGNvbnRlbnQ=", 'woff');

                    done();
                });
            });

            it("should detect a truetype font", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.ttf") format("truetype"); }');

                mockBinaryAjaxUrl('fake.ttf', "font's content");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expectFontFaceUrlToMatch(rules[0], "data:font/truetype;base64,Zm9udCdzIGNvbnRlbnQ=", 'truetype');

                    done();
                });
            });

            it("should detect a opentype font", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.otf") format("opentype"); }');

                mockBinaryAjaxUrl('fake.otf', "font's content");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expectFontFaceUrlToMatch(rules[0], "data:font/opentype;base64,Zm9udCdzIGNvbnRlbnQ=", 'opentype');

                    done();
                });
            });

            it("should keep all src references intact", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: local("Fake Font"), url("fake.otf") format("opentype"), url("fake.woff"), local("Another Fake Font"); }');

                mockBinaryAjaxUrl('fake.woff', "font");
                mockBinaryAjaxUrl('fake.otf', "font");

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expect(rules[0].style.getPropertyValue('src')).toMatch(/local\("?Fake Font"?\), url\("?data:font\/opentype;base64,Zm9udA=="?\) format\("?opentype"?\), url\("?data:font\/woff;base64,Zm9udA=="?\), local\("?Another Fake Font"?\)/);

                    done();
                });
            });

            it("should handle a baseUrl", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("fake.woff"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {baseUrl:  'url_base/page.html'}).then(function () {
                    expect(binaryAjaxSpy.calls.mostRecent().args[1].baseUrl).toEqual('url_base/page.html');

                    done();
                });
            });

            it("should circumvent caching if requested", function (done) {
                var fontUrl = "fake.woff",
                    rules = parseRules('@font-face { font-family: "test font"; src: url("' + fontUrl + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {cache: 'none'}).then(function () {
                    expect(binaryAjaxSpy).toHaveBeenCalledWith(fontUrl, {cache: 'none'});

                    done();
                });
            });

            it("should not circumvent caching by default", function (done) {
                var fontUrl = "fake.woff",
                    rules = parseRules('@font-face { font-family: "test font"; src: url("' + fontUrl + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function () {
                    expect(binaryAjaxSpy).toHaveBeenCalledWith(fontUrl, {});

                    done();
                });
            });
        });

        describe("on font-face with errors", function () {
            var aFontReferenceThatDoesExist = "a_font_that_does_exist.woff";

            beforeEach(function () {
                binaryAjaxSpy.and.callFake(function (url) {
                    var defer = ayepromise.defer();
                    if (url === aFontReferenceThatDoesExist) {
                        defer.resolve();
                    } else {
                        defer.reject({
                            url: 'THEURL' + url
                        });
                    }
                    return defer.promise;
                });
                joinUrlSpy.and.callThrough();
            });

            it("should report an error if a font could not be loaded", function (done) {
                var rules = parseRules('@font-face { font-family: "test font"; src: url("a_font_that_doesnt_exist.woff"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.hasChanges).toBe(false);
                    expect(result.errors[0]).toEqual(jasmine.objectContaining({
                        resourceType: "fontFace",
                        url: "THEURL" + "a_font_that_doesnt_exist.woff",
                        msg: "Unable to load font-face " + "THEURL" + "a_font_that_doesnt_exist.woff"
                    }));

                    done();
                });
            });

            it("should only report a failing font as error", function (done) {
                var rules = parseRules('@font-face { font-family: "test font1"; src: url("a_font_that_doesnt_exist.woff"); }\n' +
                    '@font-face { font-family: "test font2"; src: url("' + aFontReferenceThatDoesExist + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors.length).toBe(1);

                    done();
                });
            });

            it("should report multiple failing fonts as error", function (done) {
                var rules = parseRules('@font-face { font-family: "test font1"; src: url("a_font_that_doesnt_exist.woff"); }\n' +
                    '@font-face { font-family: "test font2"; src: url("another_font_that_doesnt_exist.woff"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    var errors = result.errors;
                    expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                    expect(errors[0]).not.toEqual(errors[1]);

                    done();
                });
            });

            it("should report an empty list for a successful backgroundImage", function (done) {
                var rules = parseRules('@font-face { font-family: "test font2"; src: url("' + aFontReferenceThatDoesExist + '"); }');

                inlineCss.loadAndInlineCSSResourcesForRules(rules, {}).then(function (result) {
                    expect(result.errors).toEqual([]);

                    done();
                });
            });
        });
    });

});
