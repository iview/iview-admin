var svg2image = (function (ayepromise, window) {
    "use strict";

    var module = {};

    var urlForSvg = function (svg, useBlobs) {
        if (useBlobs) {
            return URL.createObjectURL(new Blob([svg], {"type": "image/svg+xml"}));
        } else {
            return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
        }
    };

    var cleanUpUrl = function (url) {
        if (url instanceof Blob) {
            URL.revokeObjectURL(url);
        }
    };

    var simpleForeignObjectSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><foreignObject></foreignObject></svg>';

    var supportsReadingObjectFromCanvas = function (url) {
        var canvas = document.createElement("canvas"),
            image = new Image(),
            defer = ayepromise.defer();

        image.onload = function () {
            var context = canvas.getContext("2d");
            try {
                context.drawImage(image, 0, 0);
                // This will fail in Chrome & Safari
                canvas.toDataURL("image/png");
                defer.resolve(true);
            } catch (e) {
                defer.resolve(false);
            }
        };
        image.onerror = defer.reject;
        image.src = url;

        return defer.promise;
    };

    var readingBackFromCanvasBenefitsFromOldSchoolDataUris = function () {
        // Check for work around for https://code.google.com/p/chromium/issues/detail?id=294129
        var blobUrl = urlForSvg(simpleForeignObjectSvg, true);
        return supportsReadingObjectFromCanvas(blobUrl)
            .then(function (supportsReadingFromBlobs) {
                cleanUpUrl(blobUrl);
                if (supportsReadingFromBlobs) {
                    return false;
                }
                return supportsReadingObjectFromCanvas(urlForSvg(simpleForeignObjectSvg, false))
                    .then(function (s) {
                        return s;
                    });
            }, function () {
                return false;
            });
    };

    var supportsBlobBuilding = function () {
        if (window.Blob) {
            // Available as constructor only in newer builds for all browsers
            try {
                new Blob(['<b></b>'], { "type" : "text/xml" });
                return true;
            } catch (err) {}
        }
        return false;
    };

    var checkBlobSupport = function () {
        var defer = ayepromise.defer();

        if (supportsBlobBuilding && window.URL) {
            readingBackFromCanvasBenefitsFromOldSchoolDataUris()
                .then(function (doesBenefit) {
                    defer.resolve(! doesBenefit);
                }, function () {
                    defer.reject();
                });
        } else {
            defer.resolve(false);
        }

        return defer.promise;
    };

    var checkForBlobsResult;

    var checkForBlobs = function () {
        if (checkForBlobsResult === undefined) {
            checkForBlobsResult = checkBlobSupport();
        }

        return checkForBlobsResult;
    };

    var buildImageUrl = function (svg) {
        return checkForBlobs().then(function (useBlobs) {
            return urlForSvg(svg, useBlobs);
        });
    };

    module.renderSvg = function (svg) {
        var url, image,
            defer = ayepromise.defer(),
            resetEventHandlers = function () {
                image.onload = null;
                image.onerror = null;
            },
            cleanUp = function () {
                if (url) {
                    cleanUpUrl(url);
                }
            };

        image = new Image();
        image.onload = function() {
            resetEventHandlers();
            cleanUp();

            defer.resolve(image);
        };
        image.onerror = function () {
            cleanUp();

            // Webkit calls the onerror handler if the SVG is faulty
            defer.reject();
        };

        buildImageUrl(svg).then(function (imageUrl) {
            url = imageUrl;
            image.src = url;
        }, defer.reject);

        return defer.promise;
    };

    return module;
}(ayepromise, window));
