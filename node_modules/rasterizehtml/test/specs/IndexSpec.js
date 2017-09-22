describe("Main", function () {
    "use strict";

    var svgImage = "svg image",
        doc, canvas;

    var fulfilled = function (value) {
        var defer = ayepromise.defer();
        defer.resolve(value);
        return defer.promise;
    };

    var rejected = function (error) {
        var defer = ayepromise.defer();
        defer.reject(error);
        return defer.promise;
    };

    var setUpRasterize = function (image, errors) {
            rasterize.rasterize.and.returnValue(fulfilled({
                image: image,
                errors: errors
            }));
        },
        setUpRasterizeError = function (e) {
            rasterize.rasterize.and.returnValue(rejected(e));
        };

    var setUpLoadDocument = function () {
            browser.loadDocument.and.returnValue(fulfilled(doc));
        },
        setUpLoadDocumentError = function (e) {
            browser.loadDocument.and.returnValue(rejected(e));
        };

    beforeEach(function () {
        doc = document.implementation.createHTMLDocument('');

        spyOn(browser, 'parseHTML').and.returnValue(doc);

        canvas = document.createElement("canvas");
        canvas.width = 123;
        canvas.height = 456;

        spyOn(util, "parseOptionalParameters").and.callThrough();

        spyOn(browser, 'loadDocument');
        spyOn(rasterize, 'rasterize');
        setUpRasterize(svgImage, []);
    });

    describe("drawDocument", function () {
        it("should rasterize a document", function (done) {
            rasterizeHTML.drawDocument(doc, canvas).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(result.errors).toEqual([]);

                expect(rasterize.rasterize).toHaveBeenCalledWith(doc.documentElement, canvas, jasmine.any(Object));

                done();
            });
        });

        it("should use the canvas width and height as viewport size", function (done) {
            rasterizeHTML.drawDocument(doc, canvas).then(function () {
                expect(rasterize.rasterize).toHaveBeenCalledWith(doc.documentElement, canvas, {
                    width: 123,
                    height: 456
                });

                done();
            });
        });

        it("should make the canvas optional", function (done) {
            rasterizeHTML.drawDocument(doc).then(function (result) {
                expect(result.image).toEqual(svgImage);

                expect(rasterize.rasterize).toHaveBeenCalledWith(doc.documentElement, null, jasmine.any(Object));

                expect(util.parseOptionalParameters).toHaveBeenCalled();

                done();
            });
        });

        it("should apply default viewport width and height without canvas and specific options", function (done) {
            rasterizeHTML.drawDocument(doc).then(function () {
                expect(rasterize.rasterize).toHaveBeenCalledWith(doc.documentElement, null, {
                    width: 300,
                    height: 200
                });

                done();
            });
        });

        it("should pass on options", function (done) {
            rasterizeHTML.drawDocument(doc, canvas, {
                baseUrl: "a_baseUrl",
                cache: 'none',
                cacheBucket: {},
                width: 123,
                height: 234,
                hover: '.aSelector',
                active: '#anotherSelector',
                zoom: 42
            }).then(function () {
                expect(rasterize.rasterize).toHaveBeenCalledWith(doc.documentElement, canvas, {
                    baseUrl: "a_baseUrl",
                    cache: 'none',
                    cacheBucket: {},
                    width: 123,
                    height: 234,
                    hover: '.aSelector',
                    active: '#anotherSelector',
                    zoom: 42
                });

                done();
            });
        });
    });

    describe("drawHTML", function () {
        it("should take a HTML string, inline all displayable content and render to the given canvas", function (done) {
            var html = "<head><title>a title</title></head><body>some html</body>",
                drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            browser.parseHTML.and.callFake(function (someHtml) {
                if (someHtml === html) {
                    return doc;
                }
            });

            rasterizeHTML.drawHTML(html, canvas).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(result.errors).toEqual([]);

                expect(drawDocumentSpy).toHaveBeenCalledWith(doc, canvas, {});

                done();
            });
        });

        it("should make the canvas optional when drawing a HTML string", function (done) {
            var html = "the html",
                drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            rasterizeHTML.drawHTML(html, {width: 999, height: 987}).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(drawDocumentSpy).toHaveBeenCalledWith(jasmine.any(Object), null, {width: 999, height: 987});

                done();
            });
        });

        it("should take a HTML string with optional baseUrl, inline all displayable content and render to the given canvas", function (done) {
            var html = "the html",
                drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            rasterizeHTML.drawHTML(html, canvas, {baseUrl: "a_baseUrl"}).then(function () {
                expect(drawDocumentSpy).toHaveBeenCalledWith(jasmine.any(Object), canvas, {baseUrl: "a_baseUrl"});

                done();
            });
        });

        it("should circumvent caching if requested for drawHTML", function (done) {
            var html = "<head><title>a title</title></head><body>some html</body>",
                drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            rasterizeHTML.drawHTML(html, canvas, {cache: 'none'}).then(function () {
                expect(drawDocumentSpy).toHaveBeenCalledWith(jasmine.any(Object), canvas, {cache: 'none'});

                done();
            });
        });
    });

    describe("drawURL", function () {
        it("should take a URL, inline all displayable content and render to the given canvas", function (done) {
            var drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            setUpLoadDocument();

            var documentElement = doc.documentElement;

            rasterizeHTML.drawURL("fixtures/image.html", canvas).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(result.errors).toEqual([]);

                expect(drawDocumentSpy).toHaveBeenCalledWith(jasmine.any(Object), canvas, jasmine.any(Object));
                expect(drawDocumentSpy.calls.mostRecent().args[0].documentElement).toBe(documentElement);

                done();
            });
        });

        it("should make the canvas optional when drawing an URL", function (done) {
            var drawDocumentSpy = spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                    image: svgImage,
                    errors: []
                }));

            setUpLoadDocument();

            rasterizeHTML.drawURL("fixtures/image.html", {width: 999, height: 987}).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(drawDocumentSpy).toHaveBeenCalledWith(jasmine.any(Object), null, jasmine.objectContaining({width: 999, height: 987}));

                done();
            });
        });

        it("should circumvent caching if requested for drawURL", function (done) {
            spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                image: svgImage,
                errors: []
            }));

            setUpLoadDocument();

            rasterizeHTML.drawURL("fixtures/image.html", canvas, {cache: 'none'}).then(function () {
                expect(browser.loadDocument).toHaveBeenCalledWith("fixtures/image.html", {
                    cache: 'none'
                });

                done();
            });
        });
    });

    describe("Error handling", function () {
        it("should pass through an error from inlining on drawDocument", function (done) {
            setUpRasterize(svgImage, [{message: "the error"}]);

            rasterizeHTML.drawDocument(doc, canvas).then(function (result) {
                expect(result.image).toEqual(svgImage);
                expect(result.errors).toEqual([{message: "the error"}]);

                expect(rasterize.rasterize).toHaveBeenCalled();

                done();
            });
        });

        it("should pass through errors to drawHTML", function (done) {
            spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                errors: [{message: "the error"}]
            }));

            rasterizeHTML.drawHTML("", canvas).then(function (result) {
                expect(result.errors).toEqual([{message: "the error"}]);

                done();
            });
        });

        it("should pass through errors to drawURL", function (done) {
            spyOn(rasterizeHTML, "drawDocument").and.returnValue(fulfilled({
                errors: [{message: "the error"}]
            }));

            setUpLoadDocument();

            rasterizeHTML.drawURL("fixtures/image.html", canvas).then(function (result) {
                expect(result.errors).toEqual([{message: "the error"}]);

                done();
            });
        });

        it("should report an error on loading a broken URL", function (done) {
            setUpLoadDocumentError("the error");

            rasterizeHTML.drawURL("non_existing.html", canvas).fail(function (e) {
                expect(e).toEqual("the error");

                done();
            });
        });
    });

    describe("Internal errors", function () {
        it("should fail the returned promise on error from inlining when rendering the SVG on drawDocument", function (done) {
            var error = new Error();

            setUpRasterizeError(error);

            rasterizeHTML.drawDocument(doc, canvas).fail(function (e) {
                expect(e).toBe(error);

                done();
            });
        });
    });
});
