describe("diffHelper", function () {
    "use strict";

    describe("toEqualImage matcher", function () {

        it("should fail on different images", function () {
            var a = imagediff.createImageData(1, 1),
                b = imagediff.createImageData(1, 1);
            b.data[0] = 255;

            expect(diffHelper.imageEquals(a, b)).toBe(false);
        });

        it("should pass on similar images", function () {
            var a = imagediff.createImageData(1, 1),
                b = imagediff.createImageData(1, 1);

            expect(diffHelper.imageEquals(a, b)).toBe(true);
        });

        it("should pass when not surpassing threshold", function () {
            var a = imagediff.createImageData(1, 1),
                b = imagediff.createImageData(1, 1);
            b.data[0] = b.data[1] = b.data[2] = b.data[3] = 127;

            expect(diffHelper.imageEquals(a, b, 50)).toBe(true);
        });

        it("should not pass when surpassing threshold", function () {
            var a = imagediff.createImageData(1, 1),
                b = imagediff.createImageData(1, 1);
            b.data[0] = b.data[1] = b.data[2] = b.data[3] = 128;

            expect(diffHelper.imageEquals(a, b, 50)).toBe(false);
        });

        it("should pass when not surpassing minimal threshold", function () {
            var a = imagediff.createImageData(1, 1),
                b = imagediff.createImageData(1, 1);
            b.data[0] = 1;

            expect(diffHelper.imageEquals(a, b, 0.1)).toBe(true);
        });
    });

    describe("toEqualImage matcher", function () {
        beforeEach(function () {
            jasmine.addMatchers(diffHelper.matcher);
        });

        it("should delegate to imageEqual", function () {
            var toEqualImageSpy = spyOn(diffHelper, 'imageEquals').and.returnValue(true);

            // when
            expect('a').toEqualImage('b', 42);

            // then
            expect(toEqualImageSpy).toHaveBeenCalledWith('a', 'b', 42);
        });
    });
});
