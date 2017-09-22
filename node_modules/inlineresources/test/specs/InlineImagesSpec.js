"use strict";

var ayepromise = require('ayepromise'),
    inlineImage = require('../../src/inlineImage'),
    util = require('../../src/util'),
    testHelper = require('../testHelper');


describe("Image and image input inline", function () {
    var firstImage = "firstImage.png",
        secondImage = "secondImage.png",
        firstImageDataURI = "mock_data_URI_of_the_first_image",
        secondImageDataURI = "mock_data_URI_of_the_second_image",
        joinUrlSpy, getDataURIForImageURLSpy, doc,
        urlMocks = {};

    var setupGetDataURIForImageURLMock = function () {
        return spyOn(util, "getDataURIForImageURL").and.callFake(function (url) {
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
        joinUrlSpy = spyOn(util, "joinUrl");
        getDataURIForImageURLSpy = setupGetDataURIForImageURLMock();

        doc = document.implementation.createHTMLDocument("");
    });

    it("should load an external image", function (done) {
        mockGetDataURIForImageURL(firstImage, firstImageDataURI);
        doc.body.innerHTML = '<img id="image" src="' + firstImage + '" alt="test image"/>';

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image").attributes.src.value).toEqual(firstImageDataURI);

            done();
        });
    });

    it("should load an input with type image", function (done) {
        mockGetDataURIForImageURL(firstImage, firstImageDataURI);
        doc.body.innerHTML = '<input type="image" id="input" src="' + firstImage + '" alt="test image"/>';

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("input").attributes.src.value).toEqual(firstImageDataURI);

            done();
        });
    });

    it("should load multiple external images", function (done) {
        mockGetDataURIForImageURL(firstImage, firstImageDataURI);
        mockGetDataURIForImageURL(secondImage, secondImageDataURI);
        doc.body.innerHTML = (
            '<img id="image1" src="' + firstImage + '" alt="test image"/>' +
            '<img id="image2" src="' + secondImage +'" alt="test image"/>'
        );

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image1").attributes.src.value).toEqual(firstImageDataURI);
            expect(doc.getElementById("image2").attributes.src.value).toEqual(secondImageDataURI);

            done();
        });
    });

    it("should finish if no images found", function (done) {
        inlineImage.inline(doc, {}).then(done);
    });

    it("should not touch an already inlined image", function (done) {
        doc.body.innerHTML = '<img id="image" src="data:image/png;base64,soMEfAkebASE64=" alt="test image"/>';

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image").src).toEqual('data:image/png;base64,soMEfAkebASE64=');

            done();
        });
    });

    it("should not touch an image without a src", function (done) {
        doc.body.innerHTML = '<img id="image">';

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image").parentNode.innerHTML).toEqual('<img id="image">');

            done();
        });
    });

    testHelper.ifNotInPhantomIt("should respect the document's baseURI when loading the image", function (done) {
        var getDocumentBaseUrlSpy = spyOn(util, 'getDocumentBaseUrl').and.callThrough();

        testHelper.loadHTMLDocumentFixture("image.html").then(function (doc) {
            inlineImage.inline(doc, {});

            expect(getDataURIForImageURLSpy.calls.mostRecent().args[1].baseUrl).toEqual(doc.baseURI);
            expect(getDocumentBaseUrlSpy).toHaveBeenCalledWith(doc);

            done();
        });
    });

    testHelper.ifNotInPhantomIt("should respect optional baseUrl when loading the image", function (done) {
        testHelper.loadHTMLDocumentFixtureWithoutBaseURI("image.html").then(function (doc) {
            inlineImage.inline(doc, {baseUrl: "aBaseUrl"});

            expect(getDataURIForImageURLSpy.calls.mostRecent().args[1].baseUrl).toEqual("aBaseUrl");
            done();
        });
    });

    testHelper.ifNotInPhantomIt("should favour explicit baseUrl over document.baseURI when loading the image", function (done) {
        var baseUrl = "aBaseUrl";

        testHelper.loadHTMLDocumentFixture("image.html").then(function (doc) {
            expect(doc.baseURI).not.toBeNull();
            expect(doc.baseURI).not.toEqual("about:blank");
            expect(doc.baseURI).not.toEqual(baseUrl);

            inlineImage.inline(doc, {baseUrl: baseUrl});

            expect(getDataURIForImageURLSpy.calls.mostRecent().args[1].baseUrl).toEqual(baseUrl);

            done();
        });
    });

    it("should circumvent caching if requested", function () {
        doc.body.innerHTML = '<img id="image" src="' + firstImage + '" alt="test image"/>';

        inlineImage.inline(doc, {cache: 'none'});

        expect(getDataURIForImageURLSpy).toHaveBeenCalledWith(jasmine.any(String), {cache: 'none'});
    });

    it("should not circumvent caching by default", function () {
        doc.body.innerHTML = '<img id="image" src="' + firstImage + '" alt="test image"/>';

        inlineImage.inline(doc, {});

        expect(getDataURIForImageURLSpy).toHaveBeenCalledWith(jasmine.any(String), {});
    });

    it("should load an external svg image without xlink ns", function (done) {
        mockGetDataURIForImageURL(firstImage, firstImageDataURI);
        doc.body.innerHTML = (
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100" viewBox="0 0 100 100">'+
            	'<image id="image" width="100" height="100" href="' + firstImage + '"></image>'+
            '</svg>'
        );

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image").getAttribute('href')).toEqual(firstImageDataURI);

            done();
        });
    });

    it("should load an external svg image with xlink ns", function (done) {
        mockGetDataURIForImageURL(secondImage, secondImageDataURI);
        doc.body.innerHTML = (
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100" height="100" viewBox="0 0 100 100" xmlns:xlink="http://www.w3.org/1999/xlink">'+
            	'<image id="image2" width="100" height="100" xlink:href="' + secondImage + '"></image>'+
            '</svg>'
        );

        inlineImage.inline(doc, {}).then(function () {
            expect(doc.getElementById("image2").getAttributeNS('http://www.w3.org/1999/xlink','href')).toEqual(secondImageDataURI);

            done();
        });
    });

    describe("on errors", function () {
        var imageThatDoesExist = "image_that_does_exist.png";

        beforeEach(function () {
            joinUrlSpy.and.callThrough();

            mockGetDataURIForImageURL(imageThatDoesExist, "theDataUri");
        });

        it("should report an error if an image could not be loaded", function (done) {
            doc.body.innerHTML = '<img src="image_that_doesnt_exist.png" alt="test image"/>';

            inlineImage.inline(doc, {}).then(function (errors) {
                expect(errors[0]).toEqual(jasmine.objectContaining({
                    resourceType: "image",
                    url: 'THEURL' + "image_that_doesnt_exist.png",
                    msg: "Unable to load image " + "THEURL" + "image_that_doesnt_exist.png"
                }));

                done();
            });
        });

        it("should only report a failing image as error", function (done) {
            doc.body.innerHTML = (
                '<img src="image_that_doesnt_exist.png" alt="test image"/>' +
                '<img src="' + imageThatDoesExist + '" alt="test image"/>'
            );

            inlineImage.inline(doc, {}).then(function (errors) {
                expect(errors.length).toBe(1);

                done();
            });
        });

        it("should report multiple failing images as error", function (done) {
            doc.body.innerHTML = (
                '<img src="image_that_doesnt_exist.png" alt="test image"/>' +
                '<img src="another_image_that_doesnt_exist.png" alt="test image"/>'
            );

            inlineImage.inline(doc, {}).then(function (errors) {
                expect(errors).toEqual([jasmine.any(Object), jasmine.any(Object)]);
                expect(errors[0]).not.toEqual(errors[1]);

                done();
            });
        });

        it("should report an empty list for a successful image", function (done) {
            doc.body.innerHTML = ('<img src="' + imageThatDoesExist + '" alt="test image"/>');

            inlineImage.inline(doc, {}).then(function (errors) {
                expect(errors).toEqual([]);

                done();
            });
        });
    });
});
