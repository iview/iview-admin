/**
 * Text element
 * @module zrender/graphic/Text
 *
 * TODO Wrapping
 *
 * Text not support gradient
 */

define(function (require) {

    var Displayable = require('./Displayable');
    var zrUtil = require('../core/util');
    var textContain = require('../contain/text');
    var textHelper = require('./helper/text');

    /**
     * @alias zrender/graphic/Text
     * @extends module:zrender/graphic/Displayable
     * @constructor
     * @param {Object} opts
     */
    var Text = function (opts) {
        Displayable.call(this, opts);
    };

    Text.prototype = {

        constructor: Text,

        type: 'text',

        brush: function (ctx, prevEl) {
            var style = this.style;

            // Optimize, avoid normalize every time.
            this.__dirty && textHelper.normalizeTextStyle(style, true);

            // Use props with prefix 'text'.
            style.fill = style.stroke = style.shadowBlur = style.shadowColor =
                style.shadowOffsetX = style.shadowOffsetY = null;

            var text = style.text;
            // Convert to string
            text != null && (text += '');

            // Always bind style
            style.bind(ctx, this, prevEl);

            if (!textHelper.needDrawText(text, style)) {
                return;
            }

            this.setTransform(ctx);

            textHelper.renderText(this, ctx, text, style);

            this.restoreTransform(ctx);
        },

        getBoundingRect: function () {
            var style = this.style;

            // Optimize, avoid normalize every time.
            this.__dirty && textHelper.normalizeTextStyle(style, true);

            if (!this._rect) {
                var text = style.text;
                text != null ? (text += '') : (text = '');

                var rect = textContain.getBoundingRect(
                    style.text + '',
                    style.font,
                    style.textAlign,
                    style.textVerticalAlign,
                    style.textPadding,
                    style.rich
                );

                rect.x += style.x || 0;
                rect.y += style.y || 0;

                if (textHelper.getStroke(style.textStroke, style.textLineWidth)) {
                    var w = style.textLineWidth;
                    rect.x -= w / 2;
                    rect.y -= w / 2;
                    rect.width += w;
                    rect.height += w;
                }

                this._rect = rect;
            }

            return this._rect;
        }
    };

    zrUtil.inherits(Text, Displayable);

    return Text;
});