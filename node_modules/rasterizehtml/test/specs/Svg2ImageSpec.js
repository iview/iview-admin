describe("Svg to Image", function () {
    "use strict";

    var createElementFrom = function (htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString;
        return div.childNodes[0];
    };

    describe("on SVG rendering", function () {
        beforeEach(function () {
            jasmine.addMatchers(imagediff.jasmine);
        });

        ifNotInWebkitIt("should render the SVG", function (done) {
            var referenceImg = createElementFrom('<img src="' + testHelper.fixturesPath + 'rednblue.png" alt="test image"/>'),
                twoColorSvg = (
                    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
                        '<foreignObject x="0" y="0" width="100%" height="100%">' +
                            '<html xmlns="http://www.w3.org/1999/xhtml">' +
                                '<head>' +
                                    '<style type="text/css">body { padding: 0; margin: 0}</style>' +
                                '</head>' +
                                '<body>' +
                                    '<div style="background-color: #ff7700; height: 50px"></div>' +
                                    '<div style="background-color: #1000ff; height: 50px"></div>' +
                                '</body>' +
                            '</html>' +
                        '</foreignObject>' +
                    '</svg>'
                );

            svg2image.renderSvg(twoColorSvg, null).then(function (image) {
                // This fails in Chrome & Safari, possibly due to a bug with same origin policy stuff
                try {
                    expect(image).toImageDiffEqual(referenceImg);
                } catch (err) {
                    expect(err.message).toBeNull();
                }

                done();
            });
        });

        ifNotInWebkitIt("should render an SVG with inline image", function (done) {
            var referenceImg = createElementFrom('<img src="' + testHelper.fixturesPath + 'rednblue.png" alt="test image"/>'),
                twoColorSvg = (
                    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
                        '<foreignObject x="0" y="0" width="100%" height="100%">' +
                            '<html xmlns="http://www.w3.org/1999/xhtml">' +
                                '<head>' +
                                    '<style type="text/css">body { padding: 0; margin: 0}</style>' +
                                '</head>' +
                                '<body>' +
                                    '<img id="image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABAUlEQVR4nO3RMQ3AABDEsINQtoX/hdEMHrxHyu7d0bG/AzAkzZAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMidmzOzoMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMiTEkxpAYQ2IMifkA6bsjwS/Y5YIAAAAASUVORK5CYII=" alt="test image"/>' +
                                '</body>' +
                            '</html>' +
                        '</foreignObject>' +
                    '</svg>'
                );

            svg2image.renderSvg(twoColorSvg, null).then(function (image) {
                // This fails in Chrome & Safari, possibly due to a bug with same origin policy stuff
                try {
                    expect(image).toImageDiffEqual(referenceImg);
                } catch (err) {
                    expect(err.message).toBeNull();
                }

                done();
            });
        });

        it("should return an error when the SVG cannot be rendered", function (done) {
            var OldImage = window.Image,
                imageSpy;

            // We need to mock, as only Chrome & Safari seem to throw errors on a faulty SVG
            spyOn(window, "Image").and.callFake(function () {
                // HACK only spy on the first call
                if (!imageSpy) {
                    imageSpy = {};
                    return imageSpy;
                }
                return new OldImage();
            });

            svg2image.renderSvg("svg", null).fail(done);
            imageSpy.onerror();
        });

        it("should return an image without event listeners attached", function (done) {
            var anSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"></svg>';

            svg2image.renderSvg(anSvg, null).then(function (image) {
                expect(image.onerror).toBeNull();
                expect(image.onload).toBeNull();

                done();
            });
        });
    });
});
