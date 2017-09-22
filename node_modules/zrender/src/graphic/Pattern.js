define(function (require) {

    var Pattern = function (image, repeat) {
        // Should do nothing more in this constructor. Because gradient can be
        // declard by `color: {image: ...}`, where this constructor will not be called.

        this.image = image;
        this.repeat = repeat;

        // Can be cloned
        this.type = 'pattern';
    };

    Pattern.prototype.getCanvasPattern = function (ctx) {
        return ctx.createPattern(this.image, this.repeat || 'repeat');
    };

    return Pattern;
});