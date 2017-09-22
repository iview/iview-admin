/* globals isEqual */
"use strict";

var fs = require("fs");

var getDataUriForBase64PNG = function (pngBase64) {
    return "data:image/png;base64," + pngBase64;
};

var renderPage = function (url, successCallback) {
    var page = require("webpage").create();

    page.onError = function(msg) {
        console.error(msg);
    };
    page.viewportSize = { width: 200, height: 100 };
    page.open(url, function () {
        setTimeout(function () {
            var base64PNG, imgURI;

            page.clipRect = {top: 0, left: 0, width: 200, height: 100};
            base64PNG = page.renderBase64("PNG");
            imgURI = getDataUriForBase64PNG(base64PNG);

            successCallback(imgURI);
        }, 500);
    });
};

renderPage(fs.absolute('test/integrationTestPage.html'), function (imageUrl) {
    renderPage(fs.absolute('test/fixtures/testResult.png'), function (targetImageUrl) {
        var imageDiffPage = require("webpage").create();

        imageDiffPage.onConsoleMessage = function (msg) {
            console.log("Integration test: " + msg);
            if (msg === "success") {
                phantom.exit(0);
            } else {
                imageDiffPage.render("test/rasterizeHtmlSmokeTestDiff.png");
                phantom.exit(1);
            }
        };

        imageDiffPage.open(fs.absolute('test/diffHelperPage.html'), function () {
            imageDiffPage.evaluate(function (url1, url2) {
                isEqual(url1, url2, 5);
            }, imageUrl, targetImageUrl);
        });
    });
});
