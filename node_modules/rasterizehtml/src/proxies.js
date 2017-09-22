// Proxy objects by monkey patching
var proxies = (function (util, ayepromise) {
    "use strict";

    var module = {};

    var monkeyPatchInstanceMethod = function (object, methodName, proxyFunc) {
        var originalFunc = object[methodName];

        object[methodName] = function () {
            var args = Array.prototype.slice.call(arguments);

            return proxyFunc.apply(this, [args, originalFunc]);
        };

        return originalFunc;
    };

    // Bases all XHR calls on the given base URL
    module.baseUrlRespectingXhr = function (XHRObject, baseUrl) {
        var xhrConstructor = function () {
            var xhr = new XHRObject();

            monkeyPatchInstanceMethod(xhr, 'open', function (args, originalOpen) {
                var method = args.shift(),
                    url = args.shift(),
                    joinedUrl = util.joinUrl(baseUrl, url);

                return originalOpen.apply(this, [method, joinedUrl].concat(args));
            });

            return xhr;
        };

        return xhrConstructor;
    };

    // Provides a convenient way of being notified when all pending XHR calls are finished
    module.finishNotifyingXhr = function (XHRObject) {
        var totalXhrCount = 0,
            doneXhrCount = 0,
            waitingForPendingToClose = false,
            defer = ayepromise.defer();

        var checkAllRequestsFinished = function () {
            var pendingXhrCount = totalXhrCount - doneXhrCount;

            if (pendingXhrCount <= 0 && waitingForPendingToClose) {
                defer.resolve({totalCount: totalXhrCount});
            }
        };

        var xhrConstructor = function () {
            var xhr = new XHRObject();

            monkeyPatchInstanceMethod(xhr, 'send', function (_, originalSend) {
                totalXhrCount += 1;
                return originalSend.apply(this, arguments);
            });

            xhr.addEventListener('load', function () {
                doneXhrCount += 1;

                checkAllRequestsFinished();
            });

            return xhr;
        };

        xhrConstructor.waitForRequestsToFinish = function () {
            waitingForPendingToClose = true;
            checkAllRequestsFinished();
            return defer.promise;
        };

        return xhrConstructor;
    };

    return module;
}(util, ayepromise));
