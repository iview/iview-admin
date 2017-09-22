/**
 * 玫瑰线
 * @module zrender/graphic/shape/Rose
 */


    var sin = Math.sin;
    var cos = Math.cos;
    var radian = Math.PI / 180;

    module.exports = require('../Path').extend({

        type: 'rose',

        shape: {
            cx: 0,
            cy: 0,
            r: [],
            k: 0,
            n: 1
        },

        style: {
            stroke: '#000',
            fill: null
        },

        buildPath: function (ctx, shape) {
            var x;
            var y;
            var R = shape.r;
            var r;
            var k = shape.k;
            var n = shape.n;

            var x0 = shape.cx;
            var y0 = shape.cy;

            ctx.moveTo(x0, y0);

            for (var i = 0, len = R.length; i < len ; i++) {
                r = R[i];

                for (var j = 0; j <= 360 * n; j++) {
                    x = r
                         * sin(k / n * j % 360 * radian)
                         * cos(j * radian) 
                         + x0;
                    y = r
                         * sin(k / n * j % 360 * radian)
                         * sin(j * radian)
                         + y0;
                    ctx.lineTo(x, y);
                }
            }
        }
    });

