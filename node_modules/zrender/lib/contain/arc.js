

    var normalizeRadian = require('./util').normalizeRadian;
    var PI2 = Math.PI * 2;

    module.exports = {
        /**
         * 圆弧描边包含判断
         * @param  {number}  cx
         * @param  {number}  cy
         * @param  {number}  r
         * @param  {number}  startAngle
         * @param  {number}  endAngle
         * @param  {boolean}  anticlockwise
         * @param  {number} lineWidth
         * @param  {number}  x
         * @param  {number}  y
         * @return {Boolean}
         */
        containStroke: function (
            cx, cy, r, startAngle, endAngle, anticlockwise,
            lineWidth, x, y
        ) {

            if (lineWidth === 0) {
                return false;
            }
            var _l = lineWidth;

            x -= cx;
            y -= cy;
            var d = Math.sqrt(x * x + y * y);

            if ((d - _l > r) || (d + _l < r)) {
                return false;
            }
            if (Math.abs(startAngle - endAngle) % PI2 < 1e-4) {
                // Is a circle
                return true;
            }
            if (anticlockwise) {
                var tmp = startAngle;
                startAngle = normalizeRadian(endAngle);
                endAngle = normalizeRadian(tmp);
            } else {
                startAngle = normalizeRadian(startAngle);
                endAngle = normalizeRadian(endAngle);
            }
            if (startAngle > endAngle) {
                endAngle += PI2;
            }

            var angle = Math.atan2(y, x);
            if (angle < 0) {
                angle += PI2;
            }
            return (angle >= startAngle && angle <= endAngle)
                || (angle + PI2 >= startAngle && angle + PI2 <= endAngle);
        }
    };
