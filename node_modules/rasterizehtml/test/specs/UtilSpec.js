describe("Utilities function", function () {
    "use strict";
    // TODO tests for log and getConstantUniqueIdFor

    describe("joinUrl", function () {
        it("should append the url to a directory-only base", function () {
            var url = util.joinUrl("rel/path/", "the_relative_url");
            expect(url).toEqual("rel/path/the_relative_url");
        });

        it("should append the url to a file base", function () {
            var url = util.joinUrl("rel/path/something", "the_relative_url");
            expect(url).toEqual("rel/path/the_relative_url");
        });

        it("should merge ../ with a directory-only base", function () {
            var url = util.joinUrl("rel/path/", "../the_relative_url");
            expect(url).toEqual("rel/the_relative_url");
        });

        it("should just return the url if absolute", function () {
            var url = util.joinUrl("rel/path/", "/the_relative_url");
            expect(url).toEqual("/the_relative_url");
        });

        it("should combine a url starting with '/' with the host of the base", function () {
            var url = util.joinUrl("http://example.com/rel/path/", "/the_relative_url");
            expect(url).toEqual("http://example.com/the_relative_url");
        });

        it("should ignore base with an absolute url", function () {
            var url = util.joinUrl("http://example.com/rel/path/", "http://github.com//the_relative_url");
            expect(url).toEqual("http://github.com//the_relative_url");
        });

        it("should ignore base without directories", function () {
            var url = util.joinUrl("aFile", "anotherFile");
            expect(url).toEqual("anotherFile");
        });

        it("should ignore an undefined base", function () {
            var url = util.joinUrl(undefined, "aFile");
            expect(url).toEqual("aFile");
        });

        it("should keep a relative base URL", function () {
            var url = util.joinUrl("../rel/path/", "the_relative_url");
            expect(url).toEqual("../rel/path/the_relative_url");
        });
    });

    describe("clone", function () {
        it("should create a copy of the given object", function () {
            var input = {anOption: '1', yetAnotherOption: '21'},
                output;

            output = util.clone(input);

            expect(input).toEqual(output);
            expect(input).not.toBe(output);
        });
    });

    describe("parseOptionalParameters", function () {
        var canvas, options, callback;

        beforeEach(function () {
            canvas = document.createElement("canvas");
            options = {opt: "ions"};
            callback = jasmine.createSpy("callback");
        });

        it("should copy options", function () {
            var params = util.parseOptionalParameters([canvas, options]);
            expect(params.options).toEqual(options);
            expect(params.options).not.toBe(options);
        });

        it("should return all parameters", function () {
            var params = util.parseOptionalParameters([canvas, options]);
            expect(params.canvas).toBe(canvas);
            expect(params.options).toEqual(options);
        });

        it("should deal with a null canvas", function () {
            var params = util.parseOptionalParameters([null, options]);
            expect(params.canvas).toBe(null);
            expect(params.options).toEqual(options);
        });

        it("should make canvas optional", function () {
            var params = util.parseOptionalParameters([options]);
            expect(params.canvas).toBe(null);
            expect(params.options).toEqual(options);
        });

        it("should make options optional", function () {
            var params = util.parseOptionalParameters([canvas]);
            expect(params.canvas).toBe(canvas);
            expect(params.options).toEqual({});
        });

        it("should work with empty parameter list", function () {
            var params = util.parseOptionalParameters([]);
            expect(params.canvas).toBe(null);
            expect(params.options).toEqual({});
        });
    });
});
