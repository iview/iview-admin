"use strict";

var ayepromise = require('ayepromise'),
    util = require('../../src/util'),
    testHelper = require('../testHelper');


describe("Inline utilities function", function () {
    describe("clone", function () {
        it("should create a copy of the given object", function () {
            var input = {anOption: '1', yetAnotherOption: '21'},
                output;

            output = util.clone(input);

            expect(input).toEqual(output);
            expect(input).not.toBe(output);
        });
    });

    describe("cloneArray", function () {
        it("should create a copy of the given list", function () {
            var input = [1, 2, 3],
                output;

            output = util.cloneArray(input);

            expect(input).toEqual(output);
            expect(input).not.toBe(output);
        });
    });

    describe("getDocumentBaseUrl", function () {
        var endsWith = function (str, matchStr) {
            return str.substr(-matchStr.length) === matchStr;
        };

        testHelper.ifNotInPhantomIt("should return a document's base url", function (done) {
            var fixturePath = testHelper.fixturesPath + "image.html",
                url, nonQueryPart;
            testHelper.loadHTMLDocumentFixture("image.html").then(function (doc) {
                url = util.getDocumentBaseUrl(doc);
                nonQueryPart = url.split('?')[0];

                expect(endsWith(nonQueryPart, fixturePath)).toBeTruthy();

                done();
            });
        });

        it("should return null if document has no base url", function () {
            var doc = document.implementation.createHTMLDocument(""),
                url;

            url = util.getDocumentBaseUrl(doc);

            expect(url).toBe(null);
        });
    });

    describe("joinUrl", function () {
        it("should append the url to a directory-only base", function () {
            var url = util.joinUrl("rel/path/", "the_relative_url");
            expect(url).toEqual("rel/path/the_relative_url");
        });

        it("should append the url to a file base", function () {
            var url = util.joinUrl("rel/path/something", "the_relative_url");
            expect(url).toEqual("rel/path/the_relative_url");
        });

        it("should merge ../ with a directory-only base", function () {
            var url = util.joinUrl("rel/path/", "../the_relative_url");
            expect(url).toEqual("rel/the_relative_url");
        });

        it("should just return the url if absolute", function () {
            var url = util.joinUrl("rel/path/", "/the_relative_url");
            expect(url).toEqual("/the_relative_url");
        });

        it("should combine a url starting with '/' with the host of the base", function () {
            var url = util.joinUrl("http://example.com/rel/path/", "/the_relative_url");
            expect(url).toEqual("http://example.com/the_relative_url");
        });

        it("should ignore base with an absolute url", function () {
            var url = util.joinUrl("http://example.com/rel/path/", "http://github.com//the_relative_url");
            expect(url).toEqual("http://github.com//the_relative_url");
        });

        it("should ignore base without directories", function () {
            var url = util.joinUrl("aFile", "anotherFile");
            expect(url).toEqual("anotherFile");
        });

        it("should ignore an undefined base", function () {
            var url = util.joinUrl(undefined, "aFile");
            expect(url).toEqual("aFile");
        });

        it("should keep a relative base URL", function () {
            var url = util.joinUrl("../rel/path/", "the_relative_url");
            expect(url).toEqual("../rel/path/the_relative_url");
        });
    });

    describe("isDataUri", function () {
        it("should report data URI", function () {
            expect(util.isDataUri('data:image/png;base64,soMEfAkebASE64=')).toBeTruthy();
        });

        it("should handle single quotes", function () {
            expect(util.isDataUri('path/file.png')).toBeFalsy();
        });
    });

    describe("all", function () {
        it("should fulfill once a passed promise is fulfilled", function (done) {
            var defer = ayepromise.defer(),
                resolved = false;

            util.all([defer.promise])
                .then(function () {
                    expect(resolved).toBe(true);
                    done();
                });

            defer.resolve();

            resolved = true;
        });

        it("should fulfill once multiple passed promises are fulfilled", function (done) {
            var deferOne = ayepromise.defer(),
                deferTwo = ayepromise.defer(),
                resolvedCount = 0;

            var incResolveCount = function () {
                resolvedCount += 1;
            };

            deferOne.promise.then(incResolveCount);
            deferTwo.promise.then(function () {
                setTimeout(incResolveCount, 1);
            });

            util.all([deferOne.promise, deferTwo.promise])
                .then(function () {
                    expect(resolvedCount).toBe(2);
                    done();
                });

            deferOne.resolve();
            deferTwo.resolve();
        });

        it("should return the promises value", function (done) {
            var defer = ayepromise.defer();

            util.all([defer.promise])
                .then(function (values) {
                    expect(values).toEqual([42]);
                    done();
                });

            defer.resolve(42);
        });

        it("should return the promises' values in the correct order", function (done) {
            var deferOne = ayepromise.defer(),
                deferTwo = ayepromise.defer();

            util.all([deferOne.promise, deferTwo.promise])
                .then(function (values) {
                    expect(values).toEqual(['12', '34']);
                    done();
                });

            setTimeout(function () {
                deferOne.resolve('12');

            }, 1);
            deferTwo.resolve('34');
        });

        it("should resolve with an empty input list", function (done) {
            util.all([])
                .then(function (values) {
                    expect(values).toEqual([]);
                    done();
                });
        });

        it("should fail if one of the promises fails", function (done) {
            var deferOne = ayepromise.defer(),
                deferTwo = ayepromise.defer(),
                error = new Error("fail");

            util.all([deferOne.promise, deferTwo.promise])
                .fail(function (e) {
                    expect(e).toBe(error);
                    done();
                });

            deferOne.resolve('1');
            deferTwo.reject(error);
        });
    });

    describe("ajax", function () {
        it("should load content from a URL", function (done) {
            util.ajax(testHelper.fixturesPath + "some.css", {})
                .then(function (loadedContent) {
                    expect(loadedContent).toEqual("p { font-size: 14px; }");

                    done();
                });
        });

        it("should fail correctly", function (done) {
            util.ajax("non_existing_url.html", {})
                .fail(done);
        });

        it("should include msg and url in error", function (done) {
            var url = 'non_existing_url.html';

            util.ajax(url, {})
                .fail(function (e) {
                    expect(e.msg).toEqual('Unable to load url');
                    expect(e.url).toEqual(url);

                    done();
                });
        });

        describe("options", function () {
            var ajaxRequest;

            beforeEach(function () {
                ajaxRequest = jasmine.createSpyObj("ajaxRequest", ["open", "addEventListener", "overrideMimeType", "send"]);
                spyOn(window, "XMLHttpRequest").and.returnValue(ajaxRequest);

                spyOn(util, "joinUrl").and.callFake(function (baseUrl, url) {
                    return baseUrl ? baseUrl + url : url;
                });
            });

            it("should attach an unique parameter to the given URL to circumvent caching if requested", function () {
                util.ajax("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open).toHaveBeenCalledWith('GET', jasmine.any(String), true);
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toMatch(/^non_existing_url.html\?_=[0123456789]+$/);
            });

            it("should attach an unique parameter to the given URL to circumvent caching if requested (legacy: 'false')", function () {
                util.ajax("non_existing_url.html", {cache: false});

                expect(ajaxRequest.open).toHaveBeenCalledWith('GET', jasmine.any(String), true);
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toMatch(/^non_existing_url.html\?_=[0123456789]+$/);
            });

            it("should not attach an unique parameter to the given URL by default", function () {
                util.ajax("non_existing_url.html", {});

                expect(ajaxRequest.open).toHaveBeenCalledWith('GET', "non_existing_url.html", true);
            });

            it("should allow caching for repeated calls if requested", function () {
                var dateNowSpy = spyOn(window.Date, 'now').and.returnValue(42);

                util.ajax("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                dateNowSpy.and.returnValue(43);
                util.ajax("non_existing_url.html", {cache: 'repeated'});
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                expect(dateNowSpy.calls.count()).toEqual(1);
            });

            it("should not cache repeated calls by default", function () {
                var dateNowSpy = spyOn(window.Date, 'now').and.returnValue(42);
                util.ajax("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                dateNowSpy.and.returnValue(43);
                util.ajax("non_existing_url.html", {cache: 'none'});
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=43');
            });

            it("should force mime type if requested", function () {
                util.ajax("non_existing_url.html", {mimeType: "42"});

                expect(ajaxRequest.overrideMimeType).toHaveBeenCalledWith('42');
            });

            it("should load URLs relative to baseUrl", function () {
                util.ajax("relative/url.png", {baseUrl: "http://example.com/"});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('http://example.com/relative/url.png');

                expect(util.joinUrl).toHaveBeenCalledWith("http://example.com/", "relative/url.png");
            });

            it("should report url relative to baseUrl in error", function (done) {
                var url = 'non_existing_url.html',
                    baseUrl = 'http://example.com/';

                ajaxRequest.open.and.throwError(new Error('a'));
                util.ajax(url, {baseUrl: baseUrl})
                    .fail(function (e) {
                        expect(util.joinUrl).toHaveBeenCalledWith(baseUrl, url);

                        expect(e.msg).toEqual('Unable to load url');
                        expect(e.url).toEqual(baseUrl + url);

                        done();
                    });
            });
        });

    });

    describe("binaryAjax", function () {
        var mockAjaxWith = function (promise) {
            return spyOn(util, "ajax").and.returnValue(promise);
        };
        var rejectedPromise = function (e) {
            var defer = ayepromise.defer();
            defer.reject(e);
            return defer.promise;
        };
        var resolvedPromise = function () {
            var defer = ayepromise.defer();
            defer.resolve();
            return defer.promise;
        };

        beforeEach(function () {
            spyOn(util, "joinUrl").and.callFake(function (baseUrl, url) {
                return url;
            });
        });

        it("should load binary data", function (done) {
            util.binaryAjax(testHelper.fixturesPath + "green.png", {})
                .then(function (loadedContent) {
                    expect(btoa(loadedContent)).toEqual("iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABFElEQVR4nO3OMQ0AAAjAMPybhnsKxrHUQGc2r+iBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YGQHgjpgZAeCOmBkB4I6YHAAV821mT1w27RAAAAAElFTkSuQmCC");

                    done();
                });
        });

        it("should handle an error", function (done) {
            mockAjaxWith(rejectedPromise());
            util.binaryAjax("url", {})
                .fail(done);
        });

        it("should hand through the error object", function (done) {
            var e = new Error('oh my');

            mockAjaxWith(rejectedPromise(e));
            util.binaryAjax("url", {})
                .fail(function (error) {
                    expect(error).toBe(e);
                    done();
                });
        });

        it("should circumvent caching if requested", function () {
            var ajaxSpy = mockAjaxWith(resolvedPromise());

            util.binaryAjax("url", {cache: 'none'});

            expect(ajaxSpy).toHaveBeenCalledWith("url", {
                mimeType : jasmine.any(String),
                cache: 'none'
            });
        });

        it("should cache by default", function () {
            var ajaxSpy = mockAjaxWith(resolvedPromise());

            util.binaryAjax("url", {});

            expect(ajaxSpy).toHaveBeenCalledWith("url", {
                mimeType : jasmine.any(String)
            });
        });
    });

    describe("getDataURIForImageURL", function () {
        var binaryAjaxSpy;

        var mockBinaryAjax = function (targetUrl, content) {
            binaryAjaxSpy.and.callFake(function (url) {
                var defer = ayepromise.defer();
                if (url === targetUrl) {
                    defer.resolve(content);
                }
                return defer.promise;
            });
        };

        beforeEach(function () {
            binaryAjaxSpy = spyOn(util, "binaryAjax");
        });

        it("should return an image as data: URI", function (done) {
            mockBinaryAjax('green.png', "fakeImageContent");

            util.getDataURIForImageURL("green.png", {})
                .then(function (returnedDataURI) {
                    expect(returnedDataURI).toEqual('data:image/png;base64,' + btoa('fakeImageContent'));
                    expect(binaryAjaxSpy).toHaveBeenCalledWith('green.png', {});

                    done();
                });
        });

        it("should return a SVG as data: URI", function (done) {
            var svgImageHead = '<?xml version="1.0" encoding="utf-8"?>';

            mockBinaryAjax('green.svg', svgImageHead);

            util.getDataURIForImageURL("green.svg", {})
                .then(function (returnedDataURI) {
                    expect(returnedDataURI).toEqual('data:image/svg+xml;base64,' + btoa(svgImageHead));

                    done();
                });
        });

        it("should return a SVG as data: URI without XML head", function (done) {
            var svgImageHead = '<svg xmlns="http://www.w3.org/2000/svg">';

            mockBinaryAjax('green.svg', svgImageHead);

            util.getDataURIForImageURL("green.svg", {})
                .then(function (returnedDataURI) {
                    expect(returnedDataURI).toEqual('data:image/svg+xml;base64,' + btoa(svgImageHead));

                    done();
                });
        });

        it("should return an error if the image could not be located due to a REST error", function (done) {
            binaryAjaxSpy.and.callFake(function () {
                var defer = ayepromise.defer();
                defer.reject();
                return defer.promise;
            });

            util.getDataURIForImageURL("image_does_not_exist.png", {})
                .fail(done);
        });

        it("should hand through the error object", function (done) {
            var e = new Error('not good');

            binaryAjaxSpy.and.callFake(function () {
                var defer = ayepromise.defer();
                defer.reject(e);
                return defer.promise;
            });

            util.getDataURIForImageURL("image_does_not_exist.png", {})
                .fail(function (error) {
                    expect(error).toBe(e);
                    done();
                });
        });

        it("should circumvent caching if requested", function () {
            mockBinaryAjax('image.png', 'content');

            util.getDataURIForImageURL("image.png", {cache: 'none'});

            expect(binaryAjaxSpy).toHaveBeenCalledWith('image.png', {cache: 'none'});
        });

    });

    describe("memoize", function () {
        var func, aResult, memo, hasher;

        beforeEach(function () {
            memo = {};

            aResult = "the function result";
            func = jasmine.createSpy('func').and.callFake(function () {
                return aResult;
            });
            hasher = function (x) { return x; };
        });

        it("should call the memoized function for the first time", function () {
            var memoized = util.memoize(func, hasher, memo);

            expect(func).not.toHaveBeenCalled();
            memoized('a parameter', 1, 'and a 3rd parameter');

            expect(func).toHaveBeenCalledWith('a parameter', 1, 'and a 3rd parameter');
        });

        it("should not call the memoized function for a second time with the same parameters", function () {
            var memoized = util.memoize(func, hasher, memo);

            memoized('a parameter', 1, 'and a 3rd parameter');
            func.calls.reset();
            memoized('a parameter', 1, 'and a 3rd parameter');

            expect(func).not.toHaveBeenCalled();
        });

        it("should return the return value", function () {
            var memoized = util.memoize(func, hasher, memo);

            var ret = memoized('param1');
            expect(ret).toBe(aResult);
        });

        it("should memoize the return value", function () {
            var memoized = util.memoize(func, hasher, memo);

            memoized('param1');
            var ret = memoized('param1');
            expect(ret).toBe(aResult);
        });

        it("should call the memoized function again with different parameters", function () {
            var memoized = util.memoize(func, hasher, memo);

            memoized('a parameter', 1, 'and a 3rd parameter');
            func.calls.reset();
            memoized('another parameter', 1, 2);

            expect(func).toHaveBeenCalledWith('another parameter', 1, 2);
        });

        it("should memoize different functions independently", function () {
            var yetAnotherResult = 'yet another result',
                func2 = jasmine.createSpy('func2').and.callFake(function () {
                    return yetAnotherResult;
                }),
                memoized = util.memoize(func, hasher, memo),
                memoized2 = util.memoize(func2, hasher, memo);

            memoized('a parameter', 1, 'and a 3rd parameter');
            var ret = memoized2('a parameter', 1, 'and a 3rd parameter');

            expect(func2).toHaveBeenCalled();
            expect(ret).toBe(yetAnotherResult);
        });

        it("should memoize across the same memo objects", function () {
            var memoized1 = util.memoize(func, hasher, memo),
                memoized2 = util.memoize(func, hasher, memo);

            memoized1('a parameter', 1, 'and a 3rd parameter');
            func.calls.reset();
            memoized2('a parameter', 1, 'and a 3rd parameter');

            expect(func).not.toHaveBeenCalled();
        });

        it("should not memoize across different memo objects", function () {
            var memoized1 = util.memoize(func, hasher, memo),
                memoized2 = util.memoize(func, hasher, {});

            memoized1('a parameter', 1, 'and a 3rd parameter');
            func.calls.reset();
            memoized2('a parameter', 1, 'and a 3rd parameter');

            expect(func).toHaveBeenCalledWith('a parameter', 1, 'and a 3rd parameter');
        });

        it("should use hash function result when comparing parameter keys with disjunct values", function () {
            var hasher = JSON.stringify,
                memoized = util.memoize(func, hasher, memo);

            memoized({a: 1}, 1, 2);
            func.calls.reset();
            memoized({b: 2}, 1, 2);
            expect(func).toHaveBeenCalled();
        });

        it("should use hash function result when comparing parameter keys with same values", function () {
            var hasher = function (x) { return typeof x === 'object' ? {} : x; },
                memoized = util.memoize(func, hasher, memo);

            memoized({a: 1}, 1, 2);
            func.calls.reset();
            memoized({b: 2}, 1, 2);
            expect(func).not.toHaveBeenCalled();
        });

        it("should throw an error if the memo is not an object", function () {
            try {
                util.memoize(func, hasher, 42);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.message).toEqual("cacheBucket is not an object");
            }
        });
    });
});
