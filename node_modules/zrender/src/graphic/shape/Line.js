/**
 * 直线
 * @module zrender/graphic/shape/Line
 */
define(function (require) {
    return require('../Path').extend({

        type: 'line',

        shape: {
            // Start point
            x1: 0,
            y1: 0,
            // End point
            x2: 0,
            y2: 0,

            percent: 1
        },

        style: {
            stroke: '#000',
            fill: null
        },

        buildPath: function (ctx, shape) {
            var x1 = shape.x1;
            var y1 = shape.y1;
            var x2 = shape.x2;
            var y2 = shape.y2;
            var percent = shape.percent;

            if (percent === 0) {
                return;
            }

            ctx.moveTo(x1, y1);

            if (percent < 1) {
                x2 = x1 * (1 - percent) + x2 * percent;
                y2 = y1 * (1 - percent) + y2 * percent;
            }
            ctx.lineTo(x2, y2);
        },

        /**
         * Get point at percent
         * @param  {number} percent
         * @return {Array.<number>}
         */
        pointAt: function (p) {
            var shape = this.shape;
            return [
                shape.x1 * (1 - p) + shape.x2 * p,
                shape.y1 * (1 - p) + shape.y2 * p
            ];
        }
    });
});
