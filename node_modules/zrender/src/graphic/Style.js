/**
 * @module zrender/graphic/Style
 */
define(function (require) {

    var textHelper = require('./helper/text');

    var STYLE_COMMON_PROPS = [
        ['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'],
        ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]
    ];

    // var SHADOW_PROPS = STYLE_COMMON_PROPS.slice(0, 4);
    // var LINE_PROPS = STYLE_COMMON_PROPS.slice(4);

    var Style = function (opts, host) {
        this.extendFrom(opts, false);
        this.host = host;
    };

    function createLinearGradient(ctx, obj, rect) {
        var x = obj.x == null ? 0 : obj.x;
        var x2 = obj.x2 == null ? 1 : obj.x2;
        var y = obj.y == null ? 0 : obj.y;
        var y2 = obj.y2 == null ? 0 : obj.y2;

        if (!obj.global) {
            x = x * rect.width + rect.x;
            x2 = x2 * rect.width + rect.x;
            y = y * rect.height + rect.y;
            y2 = y2 * rect.height + rect.y;
        }

        var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);

        return canvasGradient;
    }

    function createRadialGradient(ctx, obj, rect) {
        var width = rect.width;
        var height = rect.height;
        var min = Math.min(width, height);

        var x = obj.x == null ? 0.5 : obj.x;
        var y = obj.y == null ? 0.5 : obj.y;
        var r = obj.r == null ? 0.5 : obj.r;
        if (!obj.global) {
            x = x * width + rect.x;
            y = y * height + rect.y;
            r = r * min;
        }

        var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);

        return canvasGradient;
    }


    Style.prototype = {

        constructor: Style,

        /**
         * @type {module:zrender/graphic/Displayable}
         */
        host: null,

        /**
         * @type {string}
         */
        fill: '#000',

        /**
         * @type {string}
         */
        stroke: null,

        /**
         * @type {number}
         */
        opacity: 1,

        /**
         * @type {Array.<number>}
         */
        lineDash: null,

        /**
         * @type {number}
         */
        lineDashOffset: 0,

        /**
         * @type {number}
         */
        shadowBlur: 0,

        /**
         * @type {number}
         */
        shadowOffsetX: 0,

        /**
         * @type {number}
         */
        shadowOffsetY: 0,

        /**
         * @type {number}
         */
        lineWidth: 1,

        /**
         * If stroke ignore scale
         * @type {Boolean}
         */
        strokeNoScale: false,

        // Bounding rect text configuration
        // Not affected by element transform
        /**
         * @type {string}
         */
        text: null,

        /**
         * If `fontSize` or `fontFamily` exists, `font` will be reset by
         * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
         * So do not visit it directly in upper application (like echarts),
         * but use `contain/text#makeFont` instead.
         * @type {string}
         */
        font: null,

        /**
         * The same as font. Use font please.
         * @deprecated
         * @type {string}
         */
        textFont: null,

        /**
         * It helps merging respectively, rather than parsing an entire font string.
         * @type {string}
         */
        fontStyle: null,

        /**
         * It helps merging respectively, rather than parsing an entire font string.
         * @type {string}
         */
        fontWeight: null,

        /**
         * It helps merging respectively, rather than parsing an entire font string.
         * Should be 12 but not '12px'.
         * @type {number}
         */
        fontSize: null,

        /**
         * It helps merging respectively, rather than parsing an entire font string.
         * @type {string}
         */
        fontFamily: null,

        /**
         * Reserved for special functinality, like 'hr'.
         * @type {string}
         */
        textTag: null,

        /**
         * @type {string}
         */
        textFill: '#000',

        /**
         * @type {string}
         */
        textStroke: null,

        /**
         * @type {number}
         */
        textWidth: null,

        /**
         * Only for textBackground.
         * @type {number}
         */
        textHeight: null,

        /**
         * textStroke may be set as some color as a default
         * value in upper applicaion, where the default value
         * of textLineWidth should be 0 to make sure that
         * user can choose to do not use text stroke.
         * @type {number}
         */
        textLineWidth: 0,

        /**
         * @type {number}
         */
        textLineHeight: null,

        /**
         * 'inside', 'left', 'right', 'top', 'bottom'
         * [x, y]
         * Based on x, y of rect.
         * @type {string|Array.<number>}
         * @default 'inside'
         */
        textPosition: 'inside',

        /**
         * If not specified, use the boundingRect of a `displayable`.
         * @type {Object}
         */
        textRect: null,

        /**
         * [x, y]
         * @type {Array.<number>}
         */
        textOffset: null,

        /**
         * @type {string}
         */
        textAlign: null,

        /**
         * @type {string}
         */
        textVerticalAlign: null,

        /**
         * @type {number}
         */
        textDistance: 5,

        /**
         * @type {string}
         */
        textShadowColor: 'transparent',

        /**
         * @type {number}
         */
        textShadowBlur: 0,

        /**
         * @type {number}
         */
        textShadowOffsetX: 0,

        /**
         * @type {number}
         */
        textShadowOffsetY: 0,

        /**
         * @type {string}
         */
        textBoxShadowColor: 'transparent',

        /**
         * @type {number}
         */
        textBoxShadowBlur: 0,

        /**
         * @type {number}
         */
        textBoxShadowOffsetX: 0,

        /**
         * @type {number}
         */
        textBoxShadowOffsetY: 0,

        /**
         * Whether transform text.
         * Only useful in Path and Image element
         * @type {boolean}
         */
        transformText: false,

        /**
         * Text rotate around position of Path or Image
         * Only useful in Path and Image element and transformText is false.
         */
        textRotation: 0,

        /**
         * Text origin of text rotation, like [10, 40].
         * Based on x, y of rect.
         * Useful in label rotation of circular symbol.
         * By default, this origin is textPosition.
         * Can be 'center'.
         * @type {string|Array.<number>}
         */
        textOrigin: null,

        /**
         * @type {string}
         */
        textBackgroundColor: null,

        /**
         * @type {string}
         */
        textBorderColor: null,

        /**
         * @type {number}
         */
        textBorderWidth: 0,

        /**
         * @type {number}
         */
        textBorderRadius: 0,

        /**
         * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
         * @type {number|Array.<number>}
         */
        textPadding: null,

        /**
         * Text styles for rich text.
         * @type {Object}
         */
        rich: null,

        /**
         * {outerWidth, outerHeight, ellipsis, placeholder}
         * @type {Object}
         */
        truncate: null,

        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
         * @type {string}
         */
        blend: null,

        /**
         * @param {CanvasRenderingContext2D} ctx
         */
        bind: function (ctx, el, prevEl) {
            var style = this;
            var prevStyle = prevEl && prevEl.style;
            var firstDraw = !prevStyle;

            for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
                var prop = STYLE_COMMON_PROPS[i];
                var styleName = prop[0];

                if (firstDraw || style[styleName] !== prevStyle[styleName]) {
                    // FIXME Invalid property value will cause style leak from previous element.
                    ctx[styleName] = style[styleName] || prop[1];
                }
            }

            if ((firstDraw || style.fill !== prevStyle.fill)) {
                ctx.fillStyle = style.fill;
            }
            if ((firstDraw || style.stroke !== prevStyle.stroke)) {
                ctx.strokeStyle = style.stroke;
            }
            if ((firstDraw || style.opacity !== prevStyle.opacity)) {
                ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
            }

            if ((firstDraw || style.blend !== prevStyle.blend)) {
                ctx.globalCompositeOperation = style.blend || 'source-over';
            }
            if (this.hasStroke()) {
                var lineWidth = style.lineWidth;
                ctx.lineWidth = lineWidth / (
                    (this.strokeNoScale && el && el.getLineScale) ? el.getLineScale() : 1
                );
            }
        },

        hasFill: function () {
            var fill = this.fill;
            return fill != null && fill !== 'none';
        },

        hasStroke: function () {
            var stroke = this.stroke;
            return stroke != null && stroke !== 'none' && this.lineWidth > 0;
        },

        /**
         * Extend from other style
         * @param {zrender/graphic/Style} otherStyle
         * @param {boolean} overwrite true: overwrirte any way.
         *                            false: overwrite only when !target.hasOwnProperty
         *                            others: overwrite when property is not null/undefined.
         */
        extendFrom: function (otherStyle, overwrite) {
            if (otherStyle) {
                for (var name in otherStyle) {
                    if (otherStyle.hasOwnProperty(name)
                        && (overwrite === true
                            || (
                                overwrite === false
                                    ? !this.hasOwnProperty(name)
                                    : otherStyle[name] != null
                            )
                        )
                    ) {
                        this[name] = otherStyle[name];
                    }
                }
            }
        },

        /**
         * Batch setting style with a given object
         * @param {Object|string} obj
         * @param {*} [obj]
         */
        set: function (obj, value) {
            if (typeof obj === 'string') {
                this[obj] = value;
            }
            else {
                this.extendFrom(obj, true);
            }
        },

        /**
         * Clone
         * @return {zrender/graphic/Style} [description]
         */
        clone: function () {
            var newStyle = new this.constructor();
            newStyle.extendFrom(this, true);
            return newStyle;
        },

        getGradient: function (ctx, obj, rect) {
            var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
            var canvasGradient = method(ctx, obj, rect);
            var colorStops = obj.colorStops;
            for (var i = 0; i < colorStops.length; i++) {
                canvasGradient.addColorStop(
                    colorStops[i].offset, colorStops[i].color
                );
            }
            return canvasGradient;
        }

    };

    var styleProto = Style.prototype;
    for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
        var prop = STYLE_COMMON_PROPS[i];
        if (!(prop[0] in styleProto)) {
            styleProto[prop[0]] = prop[1];
        }
    }

    // Provide for others
    Style.getGradient = styleProto.getGradient;

    return Style;
});