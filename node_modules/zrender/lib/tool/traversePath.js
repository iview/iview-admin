

    var CMD = require('../core/PathProxy').CMD;

    function noop() {};

    module.exports = function (path, handlers) {
        var d = path.data;
        var x0, y0;
        var xi, yi;
        var x, y;
        var len = this._len;
        handlers.M = handlers.M || noop;
        handlers.L = handlers.L || noop;
        handlers.C = handlers.C || noop;
        handlers.Q = handlers.Q || noop;
        handlers.A = handlers.A || noop;
        handlers.R = handlers.R || noop;
        handlers.Z = handlers.Z || noop;
        for (var i = 0; i < len;) {
            var cmd = d[i++];

            if (i == 1) {
                // 如果第一个命令是 L, C, Q
                // 则 previous point 同绘制命令的第一个 point
                // 第一个命令为 Arc 的情况下会在后面特殊处理
                xi = d[i];
                yi = d[i + 1];

                x0 = xi;
                y0 = yi;
            }
            switch (cmd) {
                case CMD.M:
                    x0 = xi = d[i++];
                    y0 = yi = d[i++];
                    handlers.M(xi, yi);
                    break;
                case CMD.L:
                    x = d[i++];
                    y = d[i++];
                    // Not draw too small seg between
                    handlers.L(xi, yi, x, y);
                    xi = x;
                    yi = y;
                    break;
                case CMD.C:
                    handlers.C(xi, yi,
                        d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]
                    );
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.Q:
                    handlers.Q(xi, yi, d[i++], d[i++], d[i++], d[i++]);
                    xi = d[i - 2];
                    yi = d[i - 1];
                    break;
                case CMD.A:
                    var cx = d[i++];
                    var cy = d[i++];
                    var rx = d[i++];
                    var ry = d[i++];
                    var theta = d[i++];
                    var dTheta = d[i++];
                    var psi = d[i++];
                    var fs = d[i++];
                    var r = (rx > ry) ? rx : ry;
                    var endAngle = theta + dTheta;

                    handlers.A(cx, cy, r, theta, endAngle, 1 - fs);

                    if (i == 1) {
                        // 直接使用 arc 命令
                        // 第一个命令起点还未定义
                        x0 = Math.cos(theta) * rx + cx;
                        y0 = Math.sin(theta) * ry + cy;
                    }
                    xi = Math.cos(endAngle) * rx + cx;
                    yi = Math.sin(endAngle) * ry + cy;
                    break;
                case CMD.R:
                    x0 = xi = d[i];
                    y0 = yi = d[i + 1];
                    handlers.R(d[i++], d[i++], d[i++], d[i++]);
                    break;
                case CMD.Z:
                    handlers.Z();
                    xi = x0;
                    yi = y0;
            }
        }
    };
