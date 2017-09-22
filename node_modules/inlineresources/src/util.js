"use strict";

var url = require('url'),
    ayepromise = require('ayepromise');


exports.getDocumentBaseUrl = function (doc) {
    if (doc.baseURI !== 'about:blank') {
        return doc.baseURI;
    }

    return null;
};

exports.clone = function (object) {
    var theClone = {},
        i;
    for (i in object) {
        if (object.hasOwnProperty(i)) {
           theClone[i] = object[i];
        }
    }
    return theClone;
};

exports.cloneArray = function (nodeList) {
    return Array.prototype.slice.apply(nodeList, [0]);
};

exports.joinUrl = function (baseUrl, relUrl) {
    if (!baseUrl) {
        return relUrl;
    }
    return url.resolve(baseUrl, relUrl);
};

exports.isDataUri = function (url) {
    return (/^data:/).test(url);
};

exports.all = function (promises) {
    var defer = ayepromise.defer(),
        pendingPromiseCount = promises.length,
        resolvedValues = [];

    if (promises.length === 0) {
        defer.resolve([]);
        return defer.promise;
    }

    promises.forEach(function (promise, idx) {
        promise.then(function (value) {
            pendingPromiseCount -= 1;
            resolvedValues[idx] = value;

            if (pendingPromiseCount === 0) {
                defer.resolve(resolvedValues);
            }
        }, function (e) {
            defer.reject(e);
        });
    });
    return defer.promise;
};

exports.collectAndReportErrors = function (promises) {
    var errors = [];

    return exports.all(promises.map(function (promise) {
        return promise.fail(function (e) {
            errors.push(e);
        });
    })).then(function () {
        return errors;
    });
};

var lastCacheDate = null;

var getUncachableURL = function (url, cache) {
    if (cache === false || cache === 'none' || cache === 'repeated') {
        if (lastCacheDate === null || cache !== 'repeated') {
            lastCacheDate = Date.now();
        }
        return url + "?_=" + lastCacheDate;
    } else {
        return url;
    }
};

exports.ajax = function (url, options) {
    var ajaxRequest = new window.XMLHttpRequest(),
        defer = ayepromise.defer(),
        joinedUrl = exports.joinUrl(options.baseUrl, url),
        augmentedUrl;

    var doReject = function () {
        defer.reject({
            msg: 'Unable to load url',
            url: joinedUrl
        });
    };

    augmentedUrl = getUncachableURL(joinedUrl, options.cache);

    ajaxRequest.addEventListener("load", function () {
        if (ajaxRequest.status === 200 || ajaxRequest.status === 0) {
            defer.resolve(ajaxRequest.response);
        } else {
            doReject();
        }
    }, false);

    ajaxRequest.addEventListener("error", doReject, false);

    try {
        ajaxRequest.open('GET', augmentedUrl, true);
        ajaxRequest.overrideMimeType(options.mimeType);
        ajaxRequest.send(null);
    } catch (e) {
        doReject();
    }

    return defer.promise;
};

exports.binaryAjax = function (url, options) {
    var ajaxOptions = exports.clone(options);

    ajaxOptions.mimeType = 'text/plain; charset=x-user-defined';

    return exports.ajax(url, ajaxOptions)
        .then(function (content) {
            var binaryContent = "";

            for (var i = 0; i < content.length; i++) {
                binaryContent += String.fromCharCode(content.charCodeAt(i) & 0xFF);
            }

            return binaryContent;
        });
};

var detectMimeType = function (content) {
    var startsWith = function (string, substring) {
        return string.substring(0, substring.length) === substring;
    };

    if (startsWith(content, '<?xml') || startsWith(content, '<svg')) {
        return 'image/svg+xml';
    }
    return 'image/png';
};

exports.getDataURIForImageURL = function (url, options) {
    return exports.binaryAjax(url, options)
        .then(function (content) {
            var base64Content = btoa(content),
                mimeType = detectMimeType(content);

            return 'data:' + mimeType + ';base64,' + base64Content;
        });
};

var uniqueIdList = [];

var constantUniqueIdFor = function (element) {
    // HACK, using a list results in O(n), but how do we hash a function?
    if (uniqueIdList.indexOf(element) < 0) {
        uniqueIdList.push(element);
    }
    return uniqueIdList.indexOf(element);
};

exports.memoize = function (func, hasher, memo) {
    if (typeof memo !== "object") {
        throw new Error("cacheBucket is not an object");
    }

    return function () {
        var args = Array.prototype.slice.call(arguments);

        var argumentHash = hasher(args),
            funcHash = constantUniqueIdFor(func),
            retValue;

        if (memo[funcHash] && memo[funcHash][argumentHash]) {
            return memo[funcHash][argumentHash];
        } else {
            retValue = func.apply(null, args);

            memo[funcHash] = memo[funcHash] || {};
            memo[funcHash][argumentHash] = retValue;

            return retValue;
        }
    };
};
