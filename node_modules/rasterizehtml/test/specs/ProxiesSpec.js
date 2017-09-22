describe("XHR Proxies", function () {
    "use strict";

    var mockPromisesToResolveSynchronously = function () {
        spyOn(ayepromise, 'defer').and.returnValue(testHelper.synchronousDefer());
    };

    describe("finishNotifyingXhr", function () {
        describe("mocked XHR", function () {
            var callback, originalXHRInstance, xhrMockConstructor;

            var aXHRMockInstance = function () {
                var onloadHandler;
                return {
                    send: function () {},
                    addEventListener: function (event, handler) {
                        onloadHandler = handler;
                    },
                    mockDone: function () {
                        onloadHandler();
                    }
                };
            };

            beforeEach(function () {
                callback = jasmine.createSpy('callback');
                originalXHRInstance = [];
                xhrMockConstructor = function () {
                    var xhrMockInstance = aXHRMockInstance();
                    originalXHRInstance.push(xhrMockInstance);
                    return xhrMockInstance;
                };
            });

            it("should notify when a pending AJAX request has finished", function () {
                mockPromisesToResolveSynchronously();

                var finishNotifyingXhrProxy = proxies.finishNotifyingXhr(xhrMockConstructor),
                    xhr = finishNotifyingXhrProxy();

                // Start XHR request
                xhr.send();

                finishNotifyingXhrProxy.waitForRequestsToFinish().then(callback);

                expect(callback).not.toHaveBeenCalled();

                originalXHRInstance[0].mockDone();

                expect(callback).toHaveBeenCalledWith({totalCount: 1});
            });

            it("should notify when multipel pending AJAX request have finished", function () {
                mockPromisesToResolveSynchronously();

                var finishNotifyingXhrProxy = proxies.finishNotifyingXhr(xhrMockConstructor),
                    xhr1 = finishNotifyingXhrProxy(),
                    xhr2 = finishNotifyingXhrProxy();

                // Start XHR request
                xhr1.send();
                xhr2.send();

                finishNotifyingXhrProxy.waitForRequestsToFinish().then(callback);

                originalXHRInstance[0].mockDone();
                expect(callback).not.toHaveBeenCalled();

                originalXHRInstance[1].mockDone();
                expect(callback).toHaveBeenCalledWith({totalCount: 2});
            });

            it("should handle an onload handler attached to the proxied instance", function (done) {
                var finishNotifyingXhrProxy = proxies.finishNotifyingXhr(xhrMockConstructor),
                    xhr = finishNotifyingXhrProxy();

                xhr.onload = function myOwnOnLoadHandler() {};
                xhr.send();

                finishNotifyingXhrProxy.waitForRequestsToFinish().then(done);

                originalXHRInstance[0].mockDone();
            });

            it("should finish when no XHR request has been started", function (done) {
                var finishNotifyingXhrProxy = proxies.finishNotifyingXhr(xhrMockConstructor);

                finishNotifyingXhrProxy.waitForRequestsToFinish().then(done);
            });

            it("should notify even if called after all requests resovled", function (done) {
                var finishNotifyingXhrProxy = proxies.finishNotifyingXhr(xhrMockConstructor),
                    xhr = finishNotifyingXhrProxy();

                xhr.send();
                originalXHRInstance[0].mockDone();

                finishNotifyingXhrProxy.waitForRequestsToFinish().then(done);
            });
        });

        describe("integration", function () {
            it("should notify after file has loaded", function (done) {
                var callback = jasmine.createSpy('callback'),
                    FinishNotifyingXhrProxy = proxies.finishNotifyingXhr(window.XMLHttpRequest),
                    xhr = new FinishNotifyingXhrProxy();

                xhr.onload = callback;
                xhr.open('GET', testHelper.fixturesPath + 'test.html', true);
                xhr.send(null);

                FinishNotifyingXhrProxy.waitForRequestsToFinish().then(function (result) {
                    expect(callback).toHaveBeenCalled();
                    expect(result).toEqual({totalCount: 1});

                    done();
                });
            });
        });
    });

    describe("baseUrlRespectingXhr", function () {
        it("should load file relative to given base url", function (done) {
            var baseUrl = testHelper.fixturesPath,
                BaseUrlRespectingProxy = proxies.baseUrlRespectingXhr(window.XMLHttpRequest, baseUrl),
                xhr = new BaseUrlRespectingProxy();

            xhr.onload = function () {
                expect(xhr.responseText).toMatch(/Test page/);
                done();
            };
            xhr.open('GET', 'test.html', true);
            xhr.send(null);
        });
    });
});
