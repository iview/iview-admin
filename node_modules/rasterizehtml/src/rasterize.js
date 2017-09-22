var rasterize = (function (util, browser, documentHelper, document2svg, svg2image, inlineresources) {
    "use strict";

    var module = {};

    var generalDrawError = function (e) {
        return {
            message: "Error rendering page",
            originalError: e
        };
    };

    var drawSvgAsImg = function (svg) {
        return svg2image.renderSvg(svg)
            .then(function (image) {
                return {
                    image: image,
                    svg: svg
                };
            }, function (e) {
                throw generalDrawError(e);
            });
    };

    var drawImageOnCanvas = function (image, canvas) {
        try {
            canvas.getContext("2d").drawImage(image, 0, 0);
        } catch (e) {
            // Firefox throws a 'NS_ERROR_NOT_AVAILABLE' if the SVG is faulty
            throw generalDrawError(e);
        }
    };

    var doDraw = function (element, canvas, options) {
        return document2svg.drawDocumentAsSvg(element, options)
            .then(drawSvgAsImg)
            .then(function (result) {
                if (canvas) {
                    drawImageOnCanvas(result.image, canvas);
                }

                return result;
            });
    };

    var operateJavaScriptOnDocument = function (element, options) {
        return browser.executeJavascript(element, options)
            .then(function (result) {
                var document = result.document;
                documentHelper.persistInputValues(document);

                return {
                    document: document,
                    errors: result.errors
                };
            });
    };

    module.rasterize = function (element, canvas, options) {
        var inlineOptions;

        inlineOptions = util.clone(options);
        inlineOptions.inlineScripts = options.executeJs === true;

        return inlineresources.inlineReferences(element, inlineOptions)
            .then(function (errors) {
                if (options.executeJs) {
                    return operateJavaScriptOnDocument(element, options)
                        .then(function (result) {
                            return {
                                element: result.document.documentElement,
                                errors: errors.concat(result.errors)
                            };
                        });
                } else {
                    return {
                        element: element,
                        errors: errors
                    };
                }
            }).then(function (result) {
                return doDraw(result.element, canvas, options)
                    .then(function (drawResult) {
                        return {
                            image: drawResult.image,
                            svg: drawResult.svg,
                            errors: result.errors
                        };
                    });
            });
    };

    return module;
}(util, browser, documentHelper, document2svg, svg2image, inlineresources));
