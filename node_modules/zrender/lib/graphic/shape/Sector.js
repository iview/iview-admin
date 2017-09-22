/**
 * 扇形
 * @module zrender/graphic/shape/Sector
 */



    var Path = require('../Path');
    var fixClipWithShadow = require('../helper/fixClipWithShadow');

    module.exports = Path.extend({

        type: 'sector',

        shape: {

            cx: 0,

            cy: 0,

            r0: 0,

            r: 0,

            startAngle: 0,

            endAngle: Math.PI * 2,

            clockwise: true
        },

        brush: fixClipWithShadow(Path.prototype.brush),

        buildPath: function (ctx, shape) {

            var x = shape.cx;
            var y = shape.cy;
            var r0 = Math.max(shape.r0 || 0, 0);
            var r = Math.max(shape.r, 0);
            var startAngle = shape.startAngle;
            var endAngle = shape.endAngle;
            var clockwise = shape.clockwise;

            var unitX = Math.cos(startAngle);
            var unitY = Math.sin(startAngle);

            ctx.moveTo(unitX * r0 + x, unitY * r0 + y);

            ctx.lineTo(unitX * r + x, unitY * r + y);

            ctx.arc(x, y, r, startAngle, endAngle, !clockwise);

            ctx.lineTo(
                Math.cos(endAngle) * r0 + x,
                Math.sin(endAngle) * r0 + y
            );

            if (r0 !== 0) {
                ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
            }

            ctx.closePath();
        }
    });

