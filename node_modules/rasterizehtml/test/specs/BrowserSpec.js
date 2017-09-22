describe("Browser functions", function () {
    "use strict";

    describe("executeJavascript", function () {
        var doc;

        var mockPromisesToResolveSynchronously = function () {
            spyOn(ayepromise, 'defer').and.callFake(testHelper.synchronousDefer);
        };

        var mockFinishNotifyingXHRProxy = function () {
            var fakeXhrProxy = jasmine.createSpyObj('finishNotifyingXhrProxy', ['send', 'waitForRequestsToFinish']),
                defer = testHelper.synchronousDefer();

            fakeXhrProxy.waitForRequestsToFinish.and.returnValue(defer.promise);

            spyOn(proxies, 'finishNotifyingXhr').and.returnValue(fakeXhrProxy);

            return defer;
        };

        var defaultOptionsWithViewport = function (width, height) {
            return {
                width: width || 12,
                height: height || 34
            };
        };

        var defaultOptionsWithTimeout = function (timeout) {
            return {
                baseUrl: undefined,
                executeJsTimeout: timeout,
                width: 12,
                height: 34
            };
        };

        var optionsWithViewport = function (width, height) {
            return {
                width: width || 12,
                height: height || 34,
                executeJsTimeout: 10
            };
        };

        beforeEach(function () {
            doc = window.document.implementation.createHTMLDocument("");
        });

        it("should load an URL and execute the included JS", function (done) {
            doc.documentElement.innerHTML = "<body><script>document.body.innerHTML = 'dynamic content';</script></body>";

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('dynamic content');

                done();
            });
        });

        it("should remove the iframe element when done", function (done) {
            doc.documentElement.innerHTML = "<body></body>";

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function () {
                expect(document.querySelector("iframe")).toBe(null);

                done();
            });
        });

        it("should wait a configured period of time before calling back", function (done) {
            doc.documentElement.innerHTML = "<body onload=\"setTimeout(function () {document.body.innerHTML = 'dynamic content';}, 1);\"></body>";

            browser.executeJavascript(doc.documentElement, defaultOptionsWithTimeout(20)).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('dynamic content');

                done();
            });
        });

        it("should return only when all ajax has loaded", function (done) {
            var callback = jasmine.createSpy('callback');

            mockPromisesToResolveSynchronously();
            var xhrFinishedDefer = mockFinishNotifyingXHRProxy();

            browser.executeJavascript(doc.documentElement, defaultOptionsWithTimeout(10)).then(callback);

            // HACK fragile test. We need to wait for the iframe.onload to be triggered
            setTimeout(function () {
                expect(callback).not.toHaveBeenCalled();

                xhrFinishedDefer.resolve();

                expect(callback).toHaveBeenCalled();

                done();
            }, 100);
        });

        it("should return only when all ajax has loaded, even if timeout is set to 0", function (done) {
            var callback = jasmine.createSpy('callback');

            mockPromisesToResolveSynchronously();
            var xhrFinishedDefer = mockFinishNotifyingXHRProxy();

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(callback);

            // HACK fragile test. We need to wait for the iframe.onload to be triggered
            setTimeout(function () {
                expect(callback).not.toHaveBeenCalled();

                xhrFinishedDefer.resolve();

                expect(callback).toHaveBeenCalled();

                done();
            }, 100);
        });

        it("should be able to access CSS", function (done) {
            doc.documentElement.innerHTML = '<head><style>div { height: 20px; }</style></head><body onload="var elem = document.getElementById(\'elem\'); document.body.innerHTML = elem.offsetHeight;"><div id="elem"></div></body>';

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('20');

                done();
            });
        });

        it("should report failing JS", function (done) {
            doc.documentElement.innerHTML = "<body><script>undefinedVar.t = 42</script></body>";

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function (result) {
                expect(result.errors).toEqual([{
                    resourceType: "scriptExecution",
                    msg: jasmine.any(String)
                }]);
                expect(result.errors[0].msg).toMatch(/(ReferenceError:\s+(.+\s+)?undefinedVar)|('undefinedVar' is undefined)/);

                done();
            });
        });

        it("should be able to access top 'html' tag attributes", function (done) {
            doc.documentElement.innerHTML = '<head></head><body onload="document.body.innerHTML = document.querySelectorAll(\'[myattr]\').length;"></body>';
            doc.documentElement.setAttribute('myattr', 'myvalue');

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('1');

                done();
            });
        });

        ifNotInPhantomJsIt("should be able to load content via AJAX from the correct url", function (done) {
            testHelper.readHTMLDocumentFixture('ajax.html').then(function (doc) {
                browser.executeJavascript(doc.documentElement, {
                    baseUrl: testHelper.fixturesPath,
                    executeJsTimeout: 100,
                    width: 123,
                    height: 456
                }).then(function (result) {
                    expect(result.document.querySelector('div').textContent.trim()).toEqual('The content');

                    done();
                });
            });
        });

        ifNotInPhantomJsIt("should support window.matchMedia() with 'width' media queries", function (done) {
            doc.documentElement.innerHTML = '<body onload="setTimeout(function () {document.body.innerHTML = window.matchMedia(\'(min-width: 30px)\').matches; }, 0);"></body>';

            browser.executeJavascript(doc.documentElement, optionsWithViewport(42, 21)).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('true');

                done();
            });
        });

        ifNotInPhantomJsIt("should support window.matchMedia() with 'height' media queries", function (done) {
            doc.documentElement.innerHTML = '<body onload="setTimeout(function () {document.body.innerHTML = window.matchMedia(\'(min-height: 123px)\').matches; }, 0);"></body>';

            browser.executeJavascript(doc.documentElement, optionsWithViewport(10, 123)).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('true');

                done();
            });
        });

        it("should correctly set canvas size for media queries", function (done) {
            doc.documentElement.innerHTML = '<body onload="document.body.innerHTML = window.matchMedia(\'(max-height: 123px)\').matches;"></body>';

            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport(20, 123)).then(function (result) {
                expect(result.document.body.innerHTML).toEqual('true');

                done();
            });
        });

        it("should correctly set the doctype (see issue #89)", function (done) {
            browser.executeJavascript(doc.documentElement, defaultOptionsWithViewport()).then(function (result) {
                expect(result.document.doctype.name).toEqual('html');

                done();
            });
        });
    });

    describe("parseHtmlFragment", function () {
        it("should parse a single div", function () {
            var element = browser.parseHtmlFragment('<div id="the_div"></div>');

            expect(element.tagName.toLowerCase()).toEqual('div');
            expect(element.id).toEqual('the_div');
        });

        it("should raise error when parsing an otherwise empty body element", function () {
            expect(function () { browser.parseHtmlFragment('<body></body>'); }).toThrow("Invalid source");
        });
    });

    describe("parseHTML", function () {
        var oldDOMParser = window.DOMParser;

        afterEach(function () {
            window.DOMParser = oldDOMParser;
        });

        it("should parse HTML to a document", function () {
            var dom = browser.parseHTML('<html><body>Text</body></html>');

            expect(dom.querySelector("body").textContent).toEqual("Text");
        });

        it("should keep 'html' tag attributes", function () {
            var dom = browser.parseHTML('<html top="attribute"></html>');

            expect(dom.documentElement.getAttribute('top')).toEqual('attribute');
        });

        it("should keep 'html' tag attributes even if DOMParser is not supported", function () {
            var dom;

            window.DOMParser = function () {
                this.parseFromString = function () {
                    return null;
                };
            };

            dom = browser.parseHTML('<html top="attribute"></html>');

            expect(dom.documentElement.getAttribute('top')).toEqual('attribute');
        });

        it("should deal with a missing 'html' tag", function () {
            browser.parseHTML('<div></div>');
        });

        it("should correctly set the doctype (see issue #89)", function () {
            var doc = browser.parseHTML('<b></b>');

            expect(doc.doctype.name).toEqual('html');
        });
    });

    describe("validateXHTML", function () {
        it("should throw an exception if the document is invalid", function () {
            var error;
            try {
                browser.validateXHTML("<invalid document");
            } catch (e) {
                error = e;
            }

            expect(error.message).toEqual("Invalid source");
            expect(error.originalError).toBeTruthy();
        });

        ifNotInPhantomJsIt("should throw an exception if the document is invalid because of a missing namespace", function () {
            var error;
            try {
                browser.validateXHTML('<html xmlns="http://www.w3.org/1999/xhtml"><weird:element></html>');
            } catch (e) {
                error = e;
            }

            expect(error.message).toEqual("Invalid source");
            expect(error.originalError).toBeTruthy();
        });

        it("should pass on a valid document", function () {
            browser.validateXHTML("<b></b>");
        });
    });

    describe("calculateDocumentContentSize", function () {
        var doc,
            setHtml = function (html) {
                doc.documentElement.innerHTML = html;
            },
            setElementWithSize = function (size) {
                var width = size.width ? 'width: ' + size.width + 'px;' : '',
                    height = size.height? 'height: ' + size.height + 'px;' : '',
                    element = '<div style="' + width + height + '">content</div>';

                setHtml('<style>* { padding: 0; margin: 0; }</style>' + element);
            };

        beforeEach(function () {
            doc = document.implementation.createHTMLDocument('');
        });

        it("should return the content height of a document greater than the viewport height", function (done) {
            setElementWithSize({height: 300});

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function (size) {
                expect(size.height).toEqual(300);
                expect(size.viewportHeight).toEqual(300);

                done();
            });
        });

        it("should return the minimum height viewport", function (done) {
            setElementWithSize({height: 100});

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function (size) {
                expect(size.height).toEqual(200);
                expect(size.viewportHeight).toEqual(200);

                done();
            });
        });

        it("should return the minimum width of the viewport", function (done) {
            setElementWithSize({});

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function (size) {
                expect(size.width).toEqual(300);
                expect(size.viewportWidth).toEqual(300);

                done();
            });
        });

        it("should return width greater than viewport width", function (done) {
            setElementWithSize({width: 400, height: 10});

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function (size) {
                expect(size.width).toEqual(400);
                expect(size.viewportWidth).toEqual(400);

                done();
            });
        });

        it("should calculate the document's root font size", function (done) {
            setHtml('<style>html { font-size: 4711px; }</style>');

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function (size) {
                expect(size.rootFontSize).toBe('4711px');

                done();
            });
        });

        it("should calculate the correct size given any DOM element", function (done) {
            setHtml('<div><style>div { width: 400px; height: 400px; }</style></div>');

            browser.calculateDocumentContentSize(doc.querySelector('div'), {width: 300, height: 200}).then(function (size) {
                expect(size.width).toBe(400);
                expect(size.height).toBe(400);

                done();
            });
        });

        it("should not have the body margin influence a DOM element sizing", function (done) {
            setHtml('<div><style>span { display: inline-block; float: left; width: 200px; height: 200px; }</style><span></span><span></span></div>');
            browser.calculateDocumentContentSize(doc.querySelector('div'), {width: 400, height: 200}).then(function (size) {
                expect(size.width).toBe(400);
                expect(size.height).toBe(200);

                done();
            });
        });

        it("should remove the iframe when done calculating", function (done) {
            setElementWithSize({});

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200}).then(function () {
                expect(document.querySelector('iframe')).toBe(null);

                done();
            });
        });

        it("should not execute JavaScript", function (done) {
            setHtml('<div></div><script>document.querySelector("div").style.height="100";</script>');

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 10}).then(function (size) {
                expect(size.height).toEqual(10);

                done();
            });
        });

        it("should use standards mode to calculate sizes", function (done) {
            /* Awkward test setup just to test that we don't get any of those:
               https://developer.mozilla.org/en-US/docs/Mozilla_Quirks_Mode_Behavior */
            setHtml('<style>' +
                    'body { margin: 0; padding: 0; font-size: 10px; line-height: 100%; }' +
                    'ul { list-style: none; margin: 0; } li { display: inline-block; }' +
                    '</style>' +
                    '<body><ul><li></li></ul></body>');

            browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 5}).then(function (size) {
                // In quirks mode the ul seems to be considered empty and doesn't get a height
                expect(size.height).toEqual(10);

                done();
            });
        });

        it("should not include a scrollbar in calculations on Unix systems", function (done) {
            setHtml('<style>' +
                    'html, body { height: 100%; }' +
                    '</style>');

            // For Firefox width and height seem to be important, too small will not trigger the error
            browser.calculateDocumentContentSize(doc.documentElement, {width: 600, height: 200}).then(function (size) {
                expect(size.width).toBe(600);
                expect(size.viewportWidth).toBe(600);

                done();
            });
        });

        describe("zooming", function () {
            it("should report half the viewport size for a zoom of 2", function (done) {
                setElementWithSize({});

                browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200, zoom: 2}).then(function (size) {
                    expect(size.viewportWidth).toEqual(150);
                    expect(size.viewportHeight).toEqual(100);

                    done();
                });
            });

            it("should ignore a zoom level of 0", function (done) {
                setElementWithSize({});

                browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200, zoom: 0}).then(function (size) {
                    expect(size.viewportWidth).toEqual(300);
                    expect(size.viewportHeight).toEqual(200);

                    done();
                });
            });

            it("should increase viewport width for wider element", function (done) {
                setElementWithSize({width: 160});

                browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200, zoom: 2}).then(function (size) {
                    expect(size.viewportWidth).toEqual(160);
                    expect(size.width).toEqual(320);

                    done();
                });
            });

            it("should increase viewport height for higher element", function (done) {
                setElementWithSize({height: 120});

                browser.calculateDocumentContentSize(doc.documentElement, {width: 300, height: 200, zoom: 2}).then(function (size) {
                    expect(size.viewportHeight).toEqual(120);
                    expect(size.height).toEqual(240);

                    done();
                });
            });

            it("should deal with fractions in scaling", function (done) {
                setElementWithSize({});

                browser.calculateDocumentContentSize(doc.documentElement, {width: 200, height: 200, zoom: 3}).then(function (size) {
                    expect(size.viewportWidth).toEqual(66); // not 66.6 or 67
                    expect(size.width).toEqual(200); // not 3*66=198 or 3*67 = 201

                    expect(size.viewportHeight).toEqual(66);
                    expect(size.height).toEqual(200);

                    done();
                });
            });
        });

        describe("element selection", function () {
            beforeEach(function () {
                setHtml('<style>* { padding: 0; margin: 0; }</style>' +
                    '<div style="width: 200px; height: 300px; padding: 12px 0 0 34px; -moz-box-sizing: border-box; box-sizing: border-box;">' +
                    '<span style="display: inline-block; width: 123px; height: 234px;"></span>' +
                    '</div>');
            });

            it("should report the left offset", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'span'}).then(function (size) {
                    expect(size.left).toEqual(34);

                    done();
                });
            });

            it("should report the top offset", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'span'}).then(function (size) {
                    expect(size.top).toEqual(12);

                    done();
                });
            });

            it("should report the width", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'span'}).then(function (size) {
                    expect(size.width).toEqual(123);

                    done();
                });
            });

            it("should report the height", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'span'}).then(function (size) {
                    expect(size.height).toEqual(234);

                    done();
                });
            });

            it("should report the canvas width and height", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'span'}).then(function (size) {
                    expect(size.viewportWidth).toEqual(200);
                    expect(size.viewportHeight).toEqual(300);

                    done();
                });
            });

            it("should match the html dom node", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 200, height: 10, clip: 'html'}).then(function (size) {
                    expect(size.width).toEqual(200);
                    expect(size.height).toEqual(300);

                    done();
                });
            });

            it("should throw an error when the selector is not found", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'a'}).then(null, function (e) {
                    expect(e).toEqual(jasmine.objectContaining({
                        message: "Clipping selector not found"
                    }));

                    done();
                });
            });

            it("should remove the iframe when the selector is not found", function (done) {
                browser.calculateDocumentContentSize(doc.documentElement, {width: 100, height: 10, clip: 'a'}).then(null, function () {
                    expect(document.querySelector('iframe')).toBe(null);

                    done();
                });
            });
        });
    });

    describe("loadDocument", function () {
        it("should load document from a URL", function (done) {
            browser.loadDocument(testHelper.fixturesPath + "ajax.html", {}).then(function (doc) {
                expect(doc.querySelector('title').textContent).toEqual("Test page that tries to load content via AJAX");

                done();
            });
        });

        it("should error on failing URL", function (done) {
            browser.loadDocument(testHelper.fixturesPath + "non_existing_url.html", {}).fail(function (e) {
                expect(e.message).toEqual("Unable to load page");
                expect(e.originalError).toBeTruthy();

                done();
            });
        });

        it("should error on failing parse", function (done) {
            browser.loadDocument(testHelper.fixturesPath + "invalidInput.xhtml", {}).fail(function (e) {
                expect(e.message).toEqual("Invalid source");
                expect(e.originalError).toBeTruthy();

                done();
            });
        });

        describe("options", function () {
            var ajaxRequest;

            beforeEach(function () {
                ajaxRequest = jasmine.createSpyObj("ajaxRequest", ["open", "addEventListener", "overrideMimeType", "send"]);
                spyOn(window, "XMLHttpRequest").and.returnValue(ajaxRequest);

                spyOn(util, "joinUrl").and.callFake(function (baseUrl, url) {
                    return baseUrl ? baseUrl + url : url;
                });
            });

            it("should attach an unique parameter to the given URL to circumvent caching if requested", function () {
                browser.loadDocument("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open).toHaveBeenCalledWith('GET', jasmine.any(String), true);
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toMatch(/^non_existing_url.html\?_=[0123456789]+$/);
            });

            it("should not attach an unique parameter to the given URL by default", function () {
                browser.loadDocument("non_existing_url.html", {});

                expect(ajaxRequest.open).toHaveBeenCalledWith('GET', "non_existing_url.html", true);
            });

            it("should allow caching for repeated calls if requested", function () {
                var dateNowSpy = spyOn(window.Date, 'now').and.returnValue(42);

                browser.loadDocument("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                ajaxRequest.open.calls.reset();
                dateNowSpy.and.returnValue(43);
                browser.loadDocument("non_existing_url.html", {cache: 'repeated'});
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                expect(dateNowSpy.calls.count()).toEqual(1);
            });

            it("should not cache repeated calls by default", function () {
                var dateNowSpy = spyOn(window.Date, 'now').and.returnValue(42);
                browser.loadDocument("non_existing_url.html", {cache: 'none'});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=42');

                ajaxRequest.open.calls.reset();
                dateNowSpy.and.returnValue(43);
                browser.loadDocument("non_existing_url.html", {cache: 'none'});
                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('non_existing_url.html?_=43');
            });

            it("should load URLs relative to baseUrl", function () {
                browser.loadDocument("relative/url.html", {baseUrl: "http://example.com/"});

                expect(ajaxRequest.open.calls.mostRecent().args[1]).toEqual('http://example.com/relative/url.html');

                expect(util.joinUrl).toHaveBeenCalledWith("http://example.com/", "relative/url.html");
            });
        });
    });
});
