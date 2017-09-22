'use strict';
/**
 * 正多边形
 * @module zrender/shape/Isogon
 * @author sushuang (宿爽, sushuang0322@gmail.com)
 */


    var PI = Math.PI;
    var sin = Math.sin;
    var cos = Math.cos;

    module.exports = require('../Path').extend({

        type: 'isogon',

        shape: {
            x: 0, y: 0,
            r: 0, n: 0
        },

        buildPath: function (ctx, shape) {
            var n = shape.n;
            if (!n || n < 2) {
                return;
            }

            var x = shape.x;
            var y = shape.y;
            var r = shape.r;

            var dStep = 2 * PI / n;
            var deg = -PI / 2;

            ctx.moveTo(x + r * cos(deg), y + r * sin(deg));
            for (var i = 0, end = n - 1; i < end; i++) {
                deg += dStep;
                ctx.lineTo(x + r * cos(deg), y + r * sin(deg));
            }

            ctx.closePath();

            return;
        }
    });

