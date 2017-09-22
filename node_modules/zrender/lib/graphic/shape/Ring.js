/**
 * 圆环
 * @module zrender/graphic/shape/Ring
 */


    module.exports = require('../Path').extend({

        type: 'ring',

        shape: {
            cx: 0,
            cy: 0,
            r: 0,
            r0: 0
        },

        buildPath: function (ctx, shape) {
            var x = shape.cx;
            var y = shape.cy;
            var PI2 = Math.PI * 2;
            ctx.moveTo(x + shape.r, y);
            ctx.arc(x, y, shape.r, 0, PI2, false);
            ctx.moveTo(x + shape.r0, y);
            ctx.arc(x, y, shape.r0, 0, PI2, true);
        }
    });

