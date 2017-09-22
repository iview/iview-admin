/**
 * 水滴形状
 * @module zrender/graphic/shape/Droplet
 */

define(function (require) {
    'use strict';

    return require('../Path').extend({
        
        type: 'droplet',

        shape: {
            cx: 0, cy: 0,
            width: 0, height: 0
        },

        buildPath : function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.width;
            var b = shape.height;

            ctx.moveTo(x, y + a);
            ctx.bezierCurveTo(
                x + a,
                y + a,
                x + a * 3 / 2,
                y - a / 3,
                x,
                y - b
            );
            ctx.bezierCurveTo(
                x - a * 3 / 2,
                y - a / 3,
                x - a,
                y + a,
                x,
                y + a
            );
            ctx.closePath();
        }
    });
});
