define(function (require) {

    var Path = require('../graphic/Path');
    var PathProxy = require('../core/PathProxy');
    var transformPath = require('./transformPath');

    // command chars
    var cc = [
        'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
        'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
    ];

    var mathSqrt = Math.sqrt;
    var mathSin = Math.sin;
    var mathCos = Math.cos;
    var PI = Math.PI;

    var vMag = function(v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    };
    var vRatio = function(u, v) {
        return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
    };
    var vAngle = function(u, v) {
        return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
                * Math.acos(vRatio(u, v));
    };

    function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
        var psi = psiDeg * (PI / 180.0);
        var xp = mathCos(psi) * (x1 - x2) / 2.0
                 + mathSin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * mathSin(psi) * (x1 - x2) / 2.0
                 + mathCos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if (lambda > 1) {
            rx *= mathSqrt(lambda);
            ry *= mathSqrt(lambda);
        }

        var f = (fa === fs ? -1 : 1)
            * mathSqrt((((rx * rx) * (ry * ry))
                    - ((rx * rx) * (yp * yp))
                    - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                    + (ry * ry) * (xp * xp))
                ) || 0;

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0
                 + mathCos(psi) * cxp
                 - mathSin(psi) * cyp;
        var cy = (y1 + y2) / 2.0
                + mathSin(psi) * cxp
                + mathCos(psi) * cyp;

        var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
        var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
        var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
        var dTheta = vAngle(u, v);

        if (vRatio(u, v) <= -1) {
            dTheta = PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * PI;
        }

        path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
    }

    function createPathProxyFromString(data) {
        if (!data) {
            return [];
        }

        // command string
        var cs = data.replace(/-/g, ' -')
            .replace(/  /g, ' ')
            .replace(/ /g, ',')
            .replace(/,,/g, ',');

        var n;
        // create pipes so that we can split the data
        for (n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }

        // create array
        var arr = cs.split('|');
        // init context point
        var cpx = 0;
        var cpy = 0;

        var path = new PathProxy();
        var CMD = PathProxy.CMD;

        var prevCmd;
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            var off = 0;
            var p = str.slice(1).replace(/e,-/g, 'e-').split(',');
            var cmd;

            if (p.length > 0 && p[0] === '') {
                p.shift();
            }

            for (var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }
            while (off < p.length && !isNaN(p[off])) {
                if (isNaN(p[0])) {
                    break;
                }
                var ctlPtx;
                var ctlPty;

                var rx;
                var ry;
                var psi;
                var fa;
                var fs;

                var x1 = cpx;
                var y1 = cpy;

                // convert l, H, h, V, and v to L
                switch (c) {
                    case 'l':
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'L':
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'm':
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.M;
                        path.addData(cmd, cpx, cpy);
                        c = 'l';
                        break;
                    case 'M':
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.M;
                        path.addData(cmd, cpx, cpy);
                        c = 'L';
                        break;
                    case 'h':
                        cpx += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'H':
                        cpx = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'v':
                        cpy += p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'V':
                        cpy = p[off++];
                        cmd = CMD.L;
                        path.addData(cmd, cpx, cpy);
                        break;
                    case 'C':
                        cmd = CMD.C;
                        path.addData(
                            cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]
                        );
                        cpx = p[off - 2];
                        cpy = p[off - 1];
                        break;
                    case 'c':
                        cmd = CMD.C;
                        path.addData(
                            cmd,
                            p[off++] + cpx, p[off++] + cpy,
                            p[off++] + cpx, p[off++] + cpy,
                            p[off++] + cpx, p[off++] + cpy
                        );
                        cpx += p[off - 2];
                        cpy += p[off - 1];
                        break;
                    case 'S':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        var len = path.len();
                        var pathData = path.data;
                        if (prevCmd === CMD.C) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cmd = CMD.C;
                        x1 = p[off++];
                        y1 = p[off++];
                        cpx = p[off++];
                        cpy = p[off++];
                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                        break;
                    case 's':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        var len = path.len();
                        var pathData = path.data;
                        if (prevCmd === CMD.C) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cmd = CMD.C;
                        x1 = cpx + p[off++];
                        y1 = cpy + p[off++];
                        cpx += p[off++];
                        cpy += p[off++];
                        path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
                        break;
                    case 'Q':
                        x1 = p[off++];
                        y1 = p[off++];
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, x1, y1, cpx, cpy);
                        break;
                    case 'q':
                        x1 = p[off++] + cpx;
                        y1 = p[off++] + cpy;
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, x1, y1, cpx, cpy);
                        break;
                    case 'T':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        var len = path.len();
                        var pathData = path.data;
                        if (prevCmd === CMD.Q) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        ctlPtx = cpx;
                        ctlPty = cpy;
                        var len = path.len();
                        var pathData = path.data;
                        if (prevCmd === CMD.Q) {
                            ctlPtx += cpx - pathData[len - 4];
                            ctlPty += cpy - pathData[len - 3];
                        }
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.Q;
                        path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        rx = p[off++];
                        ry = p[off++];
                        psi = p[off++];
                        fa = p[off++];
                        fs = p[off++];

                        x1 = cpx, y1 = cpy;
                        cpx = p[off++];
                        cpy = p[off++];
                        cmd = CMD.A;
                        processArc(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                        );
                        break;
                    case 'a':
                        rx = p[off++];
                        ry = p[off++];
                        psi = p[off++];
                        fa = p[off++];
                        fs = p[off++];

                        x1 = cpx, y1 = cpy;
                        cpx += p[off++];
                        cpy += p[off++];
                        cmd = CMD.A;
                        processArc(
                            x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path
                        );
                        break;
                }
            }

            if (c === 'z' || c === 'Z') {
                cmd = CMD.Z;
                path.addData(cmd);
            }

            prevCmd = cmd;
        }

        path.toStatic();

        return path;
    }

    // TODO Optimize double memory cost problem
    function createPathOptions(str, opts) {
        var pathProxy = createPathProxyFromString(str);
        opts = opts || {};
        opts.buildPath = function (path) {
            if (path.setData) {
                path.setData(pathProxy.data);
                // Svg and vml renderer don't have context
                var ctx = path.getContext();
                if (ctx) {
                    path.rebuildPath(ctx);
                }
            }
            else {
                var ctx = path;
                pathProxy.rebuildPath(ctx);
            }
        };

        opts.applyTransform = function (m) {
            transformPath(pathProxy, m);

            this.dirty(true);
        };

        return opts;
    }

    return {
        /**
         * Create a Path object from path string data
         * http://www.w3.org/TR/SVG/paths.html#PathData
         * @param  {Object} opts Other options
         */
        createFromString: function (str, opts) {
            return new Path(createPathOptions(str, opts));
        },

        /**
         * Create a Path class from path string data
         * @param  {string} str
         * @param  {Object} opts Other options
         */
        extendFromString: function (str, opts) {
            return Path.extend(createPathOptions(str, opts));
        },

        /**
         * Merge multiple paths
         */
        // TODO Apply transform
        // TODO stroke dash
        // TODO Optimize double memory cost problem
        mergePath: function (pathEls, opts) {
            var pathList = [];
            var len = pathEls.length;
            for (var i = 0; i < len; i++) {
                var pathEl = pathEls[i];
                if (!pathEl.path) {
                    pathEl.createPathProxy();
                }
                if (pathEl.__dirtyPath) {
                    pathEl.buildPath(pathEl.path, pathEl.shape, true);
                }
                pathList.push(pathEl.path);
            }

            var pathBundle = new Path(opts);
            // Need path proxy.
            pathBundle.createPathProxy();
            pathBundle.buildPath = function (path) {
                path.appendPath(pathList);
                // Svg and vml renderer don't have context
                var ctx = path.getContext();
                if (ctx) {
                    path.rebuildPath(ctx);
                }
            };

            return pathBundle;
        }
    };
});