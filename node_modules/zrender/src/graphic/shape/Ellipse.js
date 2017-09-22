/**
 * 椭圆形状
 * @module zrender/graphic/shape/Ellipse
 */

define(function (require) {
    'use strict';

    return require('../Path').extend({
        
        type: 'ellipse',

        shape: {
            cx: 0, cy: 0,
            rx: 0, ry: 0
        },

        buildPath: function (ctx, shape) {
            var k = 0.5522848;
            var x = shape.cx;
            var y = shape.cy;
            var a = shape.rx;
            var b = shape.ry;
            var ox = a * k; // 水平控制点偏移量
            var oy = b * k; // 垂直控制点偏移量
            // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
            ctx.moveTo(x - a, y);
            ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            ctx.closePath();
        }
    });
});
