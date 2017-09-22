/**
 * 矩形
 * @module zrender/graphic/shape/Rect
 */

define(function (require) {
    var roundRectHelper = require('../helper/roundRect');

    return require('../Path').extend({

        type: 'rect',

        shape: {
            // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
            // r缩写为1         相当于 [1, 1, 1, 1]
            // r缩写为[1]       相当于 [1, 1, 1, 1]
            // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
            // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
            r: 0,

            x: 0,
            y: 0,
            width: 0,
            height: 0
        },

        buildPath: function (ctx, shape) {
            var x = shape.x;
            var y = shape.y;
            var width = shape.width;
            var height = shape.height;
            if (!shape.r) {
                ctx.rect(x, y, width, height);
            }
            else {
                roundRectHelper.buildPath(ctx, shape);
            }
            ctx.closePath();
            return;
        }
    });
});
