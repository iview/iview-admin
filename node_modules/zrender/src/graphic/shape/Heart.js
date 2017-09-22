/**
 * 心形
 * @module zrender/graphic/shape/Heart
 */
define(function (require) {
    'use strict';
    
    return require('../Path').extend({
        
        type: 'heart',

        shape: {
            cx: 0,
            cy: 0,
            width: 0,
            height: 0
        },

        buildPath: function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.width;
            var b = shape.height;
            ctx.moveTo(x, y);
            ctx.bezierCurveTo(
                x + a / 2, y - b * 2 / 3,
                x + a * 2, y + b / 3,
                x, y + b
            );
            ctx.bezierCurveTo(
                x - a *  2, y + b / 3,
                x - a / 2, y - b * 2 / 3,
                x, y
            );
        }
    });
});
