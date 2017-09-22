define(function (require) {

    var env = require('../../core/env');

    // Fix weird bug in some version of IE11 (like 11.0.9600.178**),
    // where exception "unexpected call to method or property access"
    // might be thrown when calling ctx.fill or ctx.stroke after a path
    // whose area size is zero is drawn and ctx.clip() is called and
    // shadowBlur is set. See #4572, #3112, #5777.
    // (e.g.,
    //  ctx.moveTo(10, 10);
    //  ctx.lineTo(20, 10);
    //  ctx.closePath();
    //  ctx.clip();
    //  ctx.shadowBlur = 10;
    //  ...
    //  ctx.fill();
    // )

    var shadowTemp = [
        ['shadowBlur', 0],
        ['shadowColor', '#000'],
        ['shadowOffsetX', 0],
        ['shadowOffsetY', 0]
    ];

    return function (orignalBrush) {

        // version string can be: '11.0'
        return (env.browser.ie && env.browser.version >= 11)

            ? function () {
                var clipPaths = this.__clipPaths;
                var style = this.style;
                var modified;

                if (clipPaths) {
                    for (var i = 0; i < clipPaths.length; i++) {
                        var clipPath = clipPaths[i];
                        var shape = clipPath && clipPath.shape;
                        var type = clipPath && clipPath.type;

                        if (shape && (
                            (type === 'sector' && shape.startAngle === shape.endAngle)
                            || (type === 'rect' && (!shape.width || !shape.height))
                        )) {
                            for (var j = 0; j < shadowTemp.length; j++) {
                                // It is save to put shadowTemp static, because shadowTemp
                                // will be all modified each item brush called.
                                shadowTemp[j][2] = style[shadowTemp[j][0]];
                                style[shadowTemp[j][0]] = shadowTemp[j][1];
                            }
                            modified = true;
                            break;
                        }
                    }
                }

                orignalBrush.apply(this, arguments);

                if (modified) {
                    for (var j = 0; j < shadowTemp.length; j++) {
                        style[shadowTemp[j][0]] = shadowTemp[j][2];
                    }
                }
            }

            : orignalBrush;
    };

});