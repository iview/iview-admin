/**
 * n角星（n>3）
 * @module zrender/graphic/shape/Star
 */


    var PI = Math.PI;

    var cos = Math.cos;
    var sin = Math.sin;

    module.exports = require('../Path').extend({
        
        type: 'star',

        shape: {
            cx: 0,
            cy: 0,
            n: 3,
            r0: null,
            r: 0
        },

        buildPath: function (ctx, shape) {

            var n = shape.n;
            if (!n || n < 2) {
                return;
            }

            var x = shape.cx;
            var y = shape.cy;
            var r = shape.r;
            var r0 = shape.r0;

            // 如果未指定内部顶点外接圆半径，则自动计算
            if (r0 == null) {
                r0 = n > 4
                    // 相隔的外部顶点的连线的交点，
                    // 被取为内部交点，以此计算r0
                    ? r * cos(2 * PI / n) / cos(PI / n)
                    // 二三四角星的特殊处理
                    : r / 3;
            }

            var dStep = PI / n;
            var deg = -PI / 2;
            var xStart = x + r * cos(deg);
            var yStart = y + r * sin(deg);
            deg += dStep;

            // 记录边界点，用于判断inside
            ctx.moveTo(xStart, yStart);
            for (var i = 0, end = n * 2 - 1, ri; i < end; i++) {
                ri = i % 2 === 0 ? r0 : r;
                ctx.lineTo(x + ri * cos(deg), y + ri * sin(deg));
                deg += dStep;
            }
            
            ctx.closePath();
        }
    });

