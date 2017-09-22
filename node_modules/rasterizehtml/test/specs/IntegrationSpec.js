describe("Integration test", function () {
    "use strict";

    var canvas, finished, callback, referenceImg,
        width = 200,
        height = 100;

    var fulfilled = function (value) {
        var defer = ayepromise.defer();
        defer.resolve(value);
        return defer.promise;
    };

    var forceImageSizeForPlatformCompatibility = function (image) {
        image.width = width;
        image.height = height;
    };

    var createElementFrom = function (htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.childNodes[0];
    };

    beforeEach(function () {
        jasmine.addMatchers(diffHelper.matcher);
        jasmine.addMatchers(imagediff.jasmine);

        canvas = createElementFrom('<canvas width="' + width + '" height="' + height + '"></canvas>'); // Firefox adds a space between the divs and needs the canvas to fit horizontally for all content to be rendered

        referenceImg = createElementFrom('<img src="'+ testHelper.fixturesPath + '/testResult.png" alt="test image"/>');

        finished = false;
        callback = jasmine.createSpy("callback").and.callFake(function () { finished = true; });
    });

    ifNotInWebkitIt("should take a document, inline all displayable content and render to the given canvas", function (done) {
        testHelper.readHTMLDocumentFixture("test.html").then(function (doc) {
            rasterizeHTML.drawDocument(doc, canvas, {
                    cache: 'none',
                    baseUrl: testHelper.fixturesPath, // we need this because of workAroundFirefoxNotLoadingStylesheetStyles()
                    active: '.bgimage',
                    hover: '.webfont',
                    clip: 'body'
                }).then(function (result) {
                    expect(result.errors).toEqual([]);
                    expect(result.svg).toMatch(/<svg[^]+body[^]+bgimage/);

                    forceImageSizeForPlatformCompatibility(result.image);
                    expect(result.image).toEqualImage(referenceImg, 2);

                    expect(canvas).toEqualImage(referenceImg, 2);
                    // expect(canvas).toImageDiffEqual(referenceImg, 10);

                    done();
            });
        });
    });

    ifNotInWebkitIt("should take a HTML string, inline all displayable content and render to the given canvas", function (done) {
        testHelper.readHTMLFixture("test.html").then(function (html) {
            rasterizeHTML.drawHTML(html, canvas, {
                baseUrl: testHelper.fixturesPath,
                cache: 'none',
                active: '.bgimage',
                hover: '.webfont',
                clip: 'body'
            }).then(function (result) {
                expect(result.errors).toEqual([]);

                forceImageSizeForPlatformCompatibility(result.image);
                expect(result.image).toEqualImage(referenceImg, 2);

                expect(canvas).toEqualImage(referenceImg, 2);
                // expect(canvas).toImageDiffEqual(referenceImg, 70);

                done();
            });
        });
    });

    ifNotInWebkitIt("should take a URL, inline all displayable content and render to the given canvas", function (done) {
        rasterizeHTML.drawURL(testHelper.fixturesPath + "testScaled50PercentWithJs.html", canvas, {
            cache: 'none',
            executeJs: true,
            executeJsTimeout: 100,
            zoom: 2,
            active: '.bgimage',
            hover: '.webfont',
            focus: 'img',
            clip: 'body'
        }).then(function (result) {
            expect(result.errors).toEqual([]);
            forceImageSizeForPlatformCompatibility(result.image);
            expect(result.image).toEqualImage(referenceImg, 2);

            expect(canvas).toEqualImage(referenceImg, 2);
            // expect(canvas).toImageDiffEqual(referenceImg, 90);

            done();
        });
    });

    ifNotInWebkitIt("should render a URL without canvas", function (done) {
        rasterizeHTML.drawURL(testHelper.fixturesPath + "testScaled50PercentWithJs.html", {
            cache: 'none',
            width: width,
            height: height,
            executeJs: true,
            executeJsTimeout: 100,
            zoom: 2,
            active: '.bgimage',
            hover: '.webfont',
            focus: 'img',
            clip: 'body'
        }).then(function (result) {
            expect(result.errors).toEqual([]);

            forceImageSizeForPlatformCompatibility(result.image);
            expect(result.image).toEqualImage(referenceImg, 2);
            // expect(result.image).toImageDiffEqual(referenceImg, 90);

            done();
        });
    });

    // This fails in Firefox probably due to https://bugzilla.mozilla.org/show_bug.cgi?id=942138
    ifNotInPhantomJSAndNotLocalRunnerIt("should take a URL and load non UTF-8 content", function (done) {
        var inlineReferencesSpy = spyOn(inlineresources, 'inlineReferences').and.returnValue(fulfilled());

        rasterizeHTML.drawURL(testHelper.fixturesPath + "nonUTF8Encoding.html").then(function () {
            expect(inlineReferencesSpy).toHaveBeenCalled();

            var doc = inlineReferencesSpy.calls.mostRecent().args[0];

            // This fails if SpecRunner is opened locally in Firefox. Open over a local webserver helps here.
            expect(doc.querySelector('body').innerHTML.trim()).toEqual('这是中文');

            done();
        }, function (err) {
            expect(err).toBe(undefined);
            done();
        });
    });

    ifNotInWebKitAndNotLocalRunnerIt("should work around Firefox bug with `null` style properties", function (done) {
        // The bug only turns up when there's no JS executed which creates a new document
        // In addition this test will fail due to https://bugzilla.mozilla.org/show_bug.cgi?id=942138
        rasterizeHTML.drawURL(testHelper.fixturesPath + "test.html", {
                cache: 'none',
                active: '.bgimage',
                hover: '.webfont',
                clip: 'body',
                width: 200,
                height: 100
            })
            .then(function (result) {
                forceImageSizeForPlatformCompatibility(result.image);
                expect(result.image).toEqualImage(referenceImg, 2);

                done();
            });
    });

    ifNotInPhantomJsIt("should report a source error on invalid input from HTML", function (done) {
        rasterizeHTML.drawHTML("<html><weird:element></html>", {cache: 'none'}).then(null, function (error) {
            expect(error.message).toEqual("Invalid source");

            done();
        });
    });

    ifNotInPhantomJsIt("should report a source error on invalid input from URL", function (done) {
        rasterizeHTML.drawURL(testHelper.fixturesPath + "invalidInput.html", {cache: 'none'}).then(null, function (error) {
            expect(error.message).toEqual("Invalid source");

            done();
        });
    });
});
