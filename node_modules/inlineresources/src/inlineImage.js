"use strict";

var util = require('./util');


var encodeImageAsDataURI = function (image, options) {
    var url = null;
    if(image.hasAttribute('src')){
        url = image.getAttribute('src');
    }
    else if(image.hasAttributeNS('http://www.w3.org/1999/xlink','href')){
        url = image.getAttributeNS('http://www.w3.org/1999/xlink','href');
    }
    else if(image.hasAttribute('href')){
        url = image.getAttribute('href');
    }
    var documentBase = util.getDocumentBaseUrl(image.ownerDocument),
        ajaxOptions = util.clone(options);

    if (!ajaxOptions.baseUrl && documentBase) {
        ajaxOptions.baseUrl = documentBase;
    }

    return util.getDataURIForImageURL(url, ajaxOptions)
        .then(function (dataURI) {
            return dataURI;
        }, function (e) {
            throw {
                resourceType: "image",
                url: e.url,
                msg: "Unable to load image " + e.url
            };
        });
};

var filterExternalImages = function (images) {
    return images.filter(function (image) {
        var url = null;
        if(image.hasAttribute('src')){
            url = image.getAttribute('src');
        }
        else if(image.hasAttributeNS('http://www.w3.org/1999/xlink','href')){
            url = image.getAttributeNS('http://www.w3.org/1999/xlink','href');
        }
        else if(image.hasAttribute('href')){
            url = image.getAttribute('href');
        }

        return url !== null && !util.isDataUri(url);
    });
};

var filterInputsForImageType = function (inputs) {
    return Array.prototype.filter.call(inputs, function (input) {
        return input.type === "image";
    });
};

var toArray = function (arrayLike) {
    return Array.prototype.slice.call(arrayLike);
};

exports.inline = function (doc, options) {
    var images = toArray(doc.getElementsByTagName("img")),
        svgImages = toArray(doc.getElementsByTagName("image")),
        imageInputs = filterInputsForImageType(doc.getElementsByTagName("input"));

    images = images.concat(svgImages);
    images = images.concat(imageInputs);
    var externalImages = filterExternalImages(images);

    return util.collectAndReportErrors(externalImages.map(function (image) {
        return encodeImageAsDataURI(image, options).then(function (dataURI) {
            if(!!image.attributes.src){
                image.attributes.src.value = dataURI;
            }
            else if(!!image.attributes['xlink:href']){
                image.attributes['xlink:href'].value = dataURI;
            }
            else if(!!image.attributes.href){
                image.attributes.href.value = dataURI;
            }
        });
    }));
};
