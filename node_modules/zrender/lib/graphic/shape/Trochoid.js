/**
 * 内外旋轮曲线
 * @module zrender/graphic/shape/Trochold
 */


    var cos = Math.cos;
    var sin = Math.sin;

    module.exports = require('../Path').extend({

        type: 'trochoid',

        shape: {
            cx: 0,
            cy: 0,
            r: 0,
            r0: 0,
            d: 0,
            location: 'out'
        },

        style: {
            stroke: '#000',

            fill: null
        },

        buildPath: function (ctx, shape) {
            var x1;
            var y1;
            var x2;
            var y2;
            var R = shape.r;
            var r = shape.r0;
            var d = shape.d;
            var offsetX = shape.cx;
            var offsetY = shape.cy;
            var delta = shape.location == 'out' ? 1 : -1;

            if (shape.location && R <= r) {
                return;
            }

            var num = 0;
            var i = 1;
            var theta;

            x1 = (R + delta * r) * cos(0)
                - delta * d * cos(0) + offsetX;
            y1 = (R + delta * r) * sin(0)
                - d * sin(0) + offsetY;

            ctx.moveTo(x1, y1);

            // 计算结束时的i
            do {
                num++;
            }
            while ((r * num) % (R + delta * r) !== 0);

            do {
                theta = Math.PI / 180 * i;
                x2 = (R + delta * r) * cos(theta)
                     - delta * d * cos((R / r +  delta) * theta)
                     + offsetX;
                y2 = (R + delta * r) * sin(theta)
                     - d * sin((R / r + delta) * theta)
                     + offsetY;
                ctx.lineTo(x2, y2);
                i++;
            }
            while (i <= (r * num) / (R + delta * r) * 360);

        }
    });

