

    var util = require('../core/util');
    var BoundingRect = require('../core/BoundingRect');
    var imageHelper = require('../graphic/helper/image');

    var textWidthCache = {};
    var textWidthCacheCounter = 0;

    var TEXT_CACHE_MAX = 5000;
    var STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
    var DEFAULT_FONT = '12px sans-serif';

    var retrieve2 = util.retrieve2;
    var retrieve3 = util.retrieve3;

    /**
     * @public
     * @param {string} text
     * @param {string} font
     * @return {number} width
     */
    function getTextWidth(text, font) {
        font = font || DEFAULT_FONT;
        var key = text + ':' + font;
        if (textWidthCache[key]) {
            return textWidthCache[key];
        }

        var textLines = (text + '').split('\n');
        var width = 0;

        for (var i = 0, l = textLines.length; i < l; i++) {
            // textContain.measureText may be overrided in SVG or VML
            width = Math.max(textContain.measureText(textLines[i], font).width, width);
        }

        if (textWidthCacheCounter > TEXT_CACHE_MAX) {
            textWidthCacheCounter = 0;
            textWidthCache = {};
        }
        textWidthCacheCounter++;
        textWidthCache[key] = width;

        return width;
    }

    /**
     * @public
     * @param {string} text
     * @param {string} font
     * @param {string} [textAlign='left']
     * @param {string} [textVerticalAlign='top']
     * @param {Array.<number>} [textPadding]
     * @param {Object} [rich]
     * @param {Object} [truncate]
     * @return {Object} {x, y, width, height, lineHeight}
     */
    function getTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
        return rich
            ? getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate)
            : getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate);
    }

    function getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, truncate) {
        var contentBlock = parsePlainText(text, font, textPadding, truncate);
        var outerWidth = getTextWidth(text, font);
        if (textPadding) {
            outerWidth += textPadding[1] + textPadding[3];
        }
        var outerHeight = contentBlock.outerHeight;

        var x = adjustTextX(0, outerWidth, textAlign);
        var y = adjustTextY(0, outerHeight, textVerticalAlign);

        var rect = new BoundingRect(x, y, outerWidth, outerHeight);
        rect.lineHeight = contentBlock.lineHeight;

        return rect;
    }

    function getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, rich, truncate) {
        var contentBlock = parseRichText(text, {
            rich: rich,
            truncate: truncate,
            font: font,
            textAlign: textAlign,
            textPadding: textPadding
        });
        var outerWidth = contentBlock.outerWidth;
        var outerHeight = contentBlock.outerHeight;

        var x = adjustTextX(0, outerWidth, textAlign);
        var y = adjustTextY(0, outerHeight, textVerticalAlign);

        return new BoundingRect(x, y, outerWidth, outerHeight);
    }

    /**
     * @public
     * @param {number} x
     * @param {number} width
     * @param {string} [textAlign='left']
     * @return {number} Adjusted x.
     */
    function adjustTextX(x, width, textAlign) {
        // FIXME Right to left language
        if (textAlign === 'right') {
            x -= width;
        }
        else if (textAlign === 'center') {
            x -= width / 2;
        }
        return x;
    }

    /**
     * @public
     * @param {number} y
     * @param {number} height
     * @param {string} [textVerticalAlign='top']
     * @return {number} Adjusted y.
     */
    function adjustTextY(y, height, textVerticalAlign) {
        if (textVerticalAlign === 'middle') {
            y -= height / 2;
        }
        else if (textVerticalAlign === 'bottom') {
            y -= height;
        }
        return y;
    }

    /**
     * @public
     * @param {stirng} textPosition
     * @param {Object} rect {x, y, width, height}
     * @param {number} distance
     * @return {Object} {x, y, textAlign, textVerticalAlign}
     */
    function adjustTextPositionOnRect(textPosition, rect, distance) {

        var x = rect.x;
        var y = rect.y;

        var height = rect.height;
        var width = rect.width;
        var halfHeight = height / 2;

        var textAlign = 'left';
        var textVerticalAlign = 'top';

        switch (textPosition) {
            case 'left':
                x -= distance;
                y += halfHeight;
                textAlign = 'right';
                textVerticalAlign = 'middle';
                break;
            case 'right':
                x += distance + width;
                y += halfHeight;
                textVerticalAlign = 'middle';
                break;
            case 'top':
                x += width / 2;
                y -= distance;
                textAlign = 'center';
                textVerticalAlign = 'bottom';
                break;
            case 'bottom':
                x += width / 2;
                y += height + distance;
                textAlign = 'center';
                break;
            case 'inside':
                x += width / 2;
                y += halfHeight;
                textAlign = 'center';
                textVerticalAlign = 'middle';
                break;
            case 'insideLeft':
                x += distance;
                y += halfHeight;
                textVerticalAlign = 'middle';
                break;
            case 'insideRight':
                x += width - distance;
                y += halfHeight;
                textAlign = 'right';
                textVerticalAlign = 'middle';
                break;
            case 'insideTop':
                x += width / 2;
                y += distance;
                textAlign = 'center';
                break;
            case 'insideBottom':
                x += width / 2;
                y += height - distance;
                textAlign = 'center';
                textVerticalAlign = 'bottom';
                break;
            case 'insideTopLeft':
                x += distance;
                y += distance;
                break;
            case 'insideTopRight':
                x += width - distance;
                y += distance;
                textAlign = 'right';
                break;
            case 'insideBottomLeft':
                x += distance;
                y += height - distance;
                textVerticalAlign = 'bottom';
                break;
            case 'insideBottomRight':
                x += width - distance;
                y += height - distance;
                textAlign = 'right';
                textVerticalAlign = 'bottom';
                break;
        }

        return {
            x: x,
            y: y,
            textAlign: textAlign,
            textVerticalAlign: textVerticalAlign
        };
    }

    /**
     * Show ellipsis if overflow.
     *
     * @public
     * @param  {string} text
     * @param  {string} containerWidth
     * @param  {string} font
     * @param  {number} [ellipsis='...']
     * @param  {Object} [options]
     * @param  {number} [options.maxIterations=3]
     * @param  {number} [options.minChar=0] If truncate result are less
     *                  then minChar, ellipsis will not show, which is
     *                  better for user hint in some cases.
     * @param  {number} [options.placeholder=''] When all truncated, use the placeholder.
     * @return {string}
     */
    function truncateText(text, containerWidth, font, ellipsis, options) {
        if (!containerWidth) {
            return '';
        }

        var textLines = (text + '').split('\n');
        options = prepareTruncateOptions(containerWidth, font, ellipsis, options);

        // FIXME
        // It is not appropriate that every line has '...' when truncate multiple lines.
        for (var i = 0, len = textLines.length; i < len; i++) {
            textLines[i] = truncateSingleLine(textLines[i], options);
        }

        return textLines.join('\n');
    }

    function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
        options = util.extend({}, options);

        options.font = font;
        var ellipsis = retrieve2(ellipsis, '...');
        options.maxIterations = retrieve2(options.maxIterations, 2);
        var minChar = options.minChar = retrieve2(options.minChar, 0);
        // FIXME
        // Other languages?
        options.cnCharWidth = getTextWidth('国', font);
        // FIXME
        // Consider proportional font?
        var ascCharWidth = options.ascCharWidth = getTextWidth('a', font);
        options.placeholder = retrieve2(options.placeholder, '');

        // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
        // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.
        var contentWidth = containerWidth = Math.max(0, containerWidth - 1); // Reserve some gap.
        for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
            contentWidth -= ascCharWidth;
        }

        var ellipsisWidth = getTextWidth(ellipsis);
        if (ellipsisWidth > contentWidth) {
            ellipsis = '';
            ellipsisWidth = 0;
        }

        contentWidth = containerWidth - ellipsisWidth;

        options.ellipsis = ellipsis;
        options.ellipsisWidth = ellipsisWidth;
        options.contentWidth = contentWidth;
        options.containerWidth = containerWidth;

        return options;
    }

    function truncateSingleLine(textLine, options) {
        var containerWidth = options.containerWidth;
        var font = options.font;
        var contentWidth = options.contentWidth;

        if (!containerWidth) {
            return '';
        }

        var lineWidth = getTextWidth(textLine, font);

        if (lineWidth <= containerWidth) {
            return textLine;
        }

        for (var j = 0;; j++) {
            if (lineWidth <= contentWidth || j >= options.maxIterations) {
                textLine += options.ellipsis;
                break;
            }

            var subLength = j === 0
                ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth)
                : lineWidth > 0
                ? Math.floor(textLine.length * contentWidth / lineWidth)
                : 0;

            textLine = textLine.substr(0, subLength);
            lineWidth = getTextWidth(textLine, font);
        }

        if (textLine === '') {
            textLine = options.placeholder;
        }

        return textLine;
    }

    function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
        var width = 0;
        var i = 0;
        for (var len = text.length; i < len && width < contentWidth; i++) {
            var charCode = text.charCodeAt(i);
            width += (0 <= charCode && charCode <= 127) ? ascCharWidth : cnCharWidth;
        }
        return i;
    }

    /**
     * @public
     * @param {string} font
     * @return {number} line height
     */
    function getLineHeight(font) {
        // FIXME A rough approach.
        return getTextWidth('国', font);
    }

    /**
     * @public
     * @param {string} text
     * @param {string} font
     * @return {Object} width
     */
    function measureText(text, font) {
        var ctx = util.getContext();
        ctx.font = font || DEFAULT_FONT;
        return ctx.measureText(text);
    }

    /**
     * @public
     * @param {string} text
     * @param {string} font
     * @param {Object} [truncate]
     * @return {Object} block: {lineHeight, lines, height, outerHeight}
     *  Notice: for performance, do not calculate outerWidth util needed.
     */
    function parsePlainText(text, font, padding, truncate) {
        text != null && (text += '');

        var lineHeight = getLineHeight(font);
        var lines = text ? text.split('\n') : [];
        var height = lines.length * lineHeight;
        var outerHeight = height;

        if (padding) {
            outerHeight += padding[0] + padding[2];
        }

        if (text && truncate) {
            var truncOuterHeight = truncate.outerHeight;
            var truncOuterWidth = truncate.outerWidth;
            if (truncOuterHeight != null && outerHeight > truncOuterHeight) {
                text = '';
                lines = [];
            }
            else if (truncOuterWidth != null) {
                var options = prepareTruncateOptions(
                    truncOuterWidth - (padding ? padding[1] + padding[3] : 0),
                    font,
                    truncate.ellipsis,
                    {minChar: truncate.minChar, placeholder: truncate.placeholder}
                );

                // FIXME
                // It is not appropriate that every line has '...' when truncate multiple lines.
                for (var i = 0, len = lines.length; i < len; i++) {
                    lines[i] = truncateSingleLine(lines[i], options);
                }
            }
        }

        return {
            lines: lines,
            height: height,
            outerHeight: outerHeight,
            lineHeight: lineHeight
        };
    }

    /**
     * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
     * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
     *
     * @public
     * @param {string} text
     * @param {Object} style
     * @return {Object} block
     * {
     *      width,
     *      height,
     *      lines: [{
     *          lineHeight,
     *          width,
     *          tokens: [[{
     *              styleName,
     *              text,
     *              width,      // include textPadding
     *              height,     // include textPadding
     *              textWidth, // pure text width
     *              textHeight, // pure text height
     *              lineHeihgt,
     *              font,
     *              textAlign,
     *              textVerticalAlign
     *          }], [...], ...]
     *      }, ...]
     * }
     * If styleName is undefined, it is plain text.
     */
    function parseRichText(text, style) {
        var contentBlock = {lines: [], width: 0, height: 0};

        text != null && (text += '');
        if (!text) {
            return contentBlock;
        }

        var lastIndex = STYLE_REG.lastIndex = 0;
        var result;
        while ((result = STYLE_REG.exec(text)) != null)  {
            var matchedIndex = result.index;
            if (matchedIndex > lastIndex) {
                pushTokens(contentBlock, text.substring(lastIndex, matchedIndex));
            }
            pushTokens(contentBlock, result[2], result[1]);
            lastIndex = STYLE_REG.lastIndex;
        }

        if (lastIndex < text.length) {
            pushTokens(contentBlock, text.substring(lastIndex, text.length));
        }

        var lines = contentBlock.lines;
        var contentHeight = 0;
        var contentWidth = 0;
        // For `textWidth: 100%`
        var pendingList = [];

        var stlPadding = style.textPadding;

        var truncate = style.truncate;
        var truncateWidth = truncate && truncate.outerWidth;
        var truncateHeight = truncate && truncate.outerHeight;
        if (stlPadding) {
            truncateWidth != null && (truncateWidth -= stlPadding[1] + stlPadding[3]);
            truncateHeight != null && (truncateHeight -= stlPadding[0] + stlPadding[2]);
        }

        // Calculate layout info of tokens.
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineHeight = 0;
            var lineWidth = 0;

            for (var j = 0; j < line.tokens.length; j++) {
                var token = line.tokens[j];
                var tokenStyle = token.styleName && style.rich[token.styleName] || {};
                // textPadding should not inherit from style.
                var textPadding = token.textPadding = tokenStyle.textPadding;

                // textFont has been asigned to font by `normalizeStyle`.
                var font = token.font = tokenStyle.font || style.font;

                // textHeight can be used when textVerticalAlign is specified in token.
                var tokenHeight = token.textHeight = retrieve2(
                    // textHeight should not be inherited, consider it can be specified
                    // as box height of the block.
                    tokenStyle.textHeight, textContain.getLineHeight(font)
                );
                textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
                token.height = tokenHeight;
                token.lineHeight = retrieve3(
                    tokenStyle.textLineHeight, style.textLineHeight, tokenHeight
                );

                token.textAlign = tokenStyle && tokenStyle.textAlign || style.textAlign;
                token.textVerticalAlign = tokenStyle && tokenStyle.textVerticalAlign || 'middle';

                if (truncateHeight != null && contentHeight + token.lineHeight > truncateHeight) {
                    return {lines: [], width: 0, height: 0};
                }

                token.textWidth = textContain.getWidth(token.text, font);
                var tokenWidth = tokenStyle.textWidth;
                var tokenWidthNotSpecified = tokenWidth == null || tokenWidth === 'auto';

                // Percent width, can be `100%`, can be used in drawing separate
                // line when box width is needed to be auto.
                if (typeof tokenWidth === 'string' && tokenWidth.charAt(tokenWidth.length - 1) === '%') {
                    token.percentWidth = tokenWidth;
                    pendingList.push(token);
                    tokenWidth = 0;
                    // Do not truncate in this case, because there is no user case
                    // and it is too complicated.
                }
                else {
                    if (tokenWidthNotSpecified) {
                        tokenWidth = token.textWidth;

                        // FIXME: If image is not loaded and textWidth is not specified, calling
                        // `getBoundingRect()` will not get correct result.
                        var textBackgroundColor = tokenStyle.textBackgroundColor;
                        var bgImg = textBackgroundColor && textBackgroundColor.image;

                        // Use cases:
                        // (1) If image is not loaded, it will be loaded at render phase and call
                        // `dirty()` and `textBackgroundColor.image` will be replaced with the loaded
                        // image, and then the right size will be calculated here at the next tick.
                        // See `graphic/helper/text.js`.
                        // (2) If image loaded, and `textBackgroundColor.image` is image src string,
                        // use `imageHelper.findExistImage` to find cached image.
                        // `imageHelper.findExistImage` will always be called here before
                        // `imageHelper.createOrUpdateImage` in `graphic/helper/text.js#renderRichText`
                        // which ensures that image will not be rendered before correct size calcualted.
                        if (bgImg) {
                            bgImg = imageHelper.findExistImage(bgImg);
                            if (imageHelper.isImageReady(bgImg)) {
                                tokenWidth = Math.max(tokenWidth, bgImg.width * tokenHeight / bgImg.height);
                            }
                        }
                    }

                    var paddingW = textPadding ? textPadding[1] + textPadding[3] : 0;
                    tokenWidth += paddingW;

                    var remianTruncWidth = truncateWidth != null ? truncateWidth - lineWidth : null;

                    if (remianTruncWidth != null && remianTruncWidth < tokenWidth) {
                        if (!tokenWidthNotSpecified || remianTruncWidth < paddingW) {
                            token.text = '';
                            token.textWidth = tokenWidth = 0;
                        }
                        else {
                            token.text = truncateText(
                                token.text, remianTruncWidth - paddingW, font, truncate.ellipsis,
                                {minChar: truncate.minChar}
                            );
                            token.textWidth = textContain.getWidth(token.text, font);
                            tokenWidth = token.textWidth + paddingW;
                        }
                    }
                }

                lineWidth += (token.width = tokenWidth);
                tokenStyle && (lineHeight = Math.max(lineHeight, token.lineHeight));
            }

            line.width = lineWidth;
            line.lineHeight = lineHeight;
            contentHeight += lineHeight;
            contentWidth = Math.max(contentWidth, lineWidth);
        }

        contentBlock.outerWidth = contentBlock.width = retrieve2(style.textWidth, contentWidth);
        contentBlock.outerHeight = contentBlock.height = retrieve2(style.textHeight, contentHeight);

        if (stlPadding) {
            contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
            contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
        }

        for (var i = 0; i < pendingList.length; i++) {
            var token = pendingList[i];
            var percentWidth = token.percentWidth;
            // Should not base on outerWidth, because token can not be placed out of padding.
            token.width = parseInt(percentWidth, 10) / 100 * contentWidth;
        }

        return contentBlock;
    }

    function pushTokens(block, str, styleName) {
        var isEmptyStr = str === '';
        var strs = str.split('\n');
        var lines = block.lines;

        for (var i = 0; i < strs.length; i++) {
            var text = strs[i];
            var token = {
                styleName: styleName,
                text: text,
                isLineHolder: !text && !isEmptyStr
            };

            // The first token should be appended to the last line.
            if (!i) {
                var tokens = (lines[lines.length - 1] || (lines[0] = {tokens: []})).tokens;

                // Consider cases:
                // (1) ''.split('\n') => ['', '\n', ''], the '' at the first item
                // (which is a placeholder) should be replaced by new token.
                // (2) A image backage, where token likes {a|}.
                // (3) A redundant '' will affect textAlign in line.
                // (4) tokens with the same tplName should not be merged, because
                // they should be displayed in different box (with border and padding).
                var tokensLen = tokens.length;
                (tokensLen === 1 && tokens[0].isLineHolder)
                    ? (tokens[0] = token)
                    // Consider text is '', only insert when it is the "lineHolder" or
                    // "emptyStr". Otherwise a redundant '' will affect textAlign in line.
                    : ((text || !tokensLen || isEmptyStr) && tokens.push(token));
            }
            // Other tokens always start a new line.
            else {
                // If there is '', insert it as a placeholder.
                lines.push({tokens: [token]});
            }
        }
    }

    function makeFont(style) {
        // FIXME in node-canvas fontWeight is before fontStyle
        // Use `fontSize` `fontFamily` to check whether font properties are defined.
        return (style.fontSize || style.fontFamily) && [
            style.fontStyle,
            style.fontWeight,
            (style.fontSize || 12) + 'px',
            // If font properties are defined, `fontFamily` should not be ignored.
            style.fontFamily || 'sans-serif'
        ].join(' ') || style.textFont || style.font;
    }

    var textContain = {

        getWidth: getTextWidth,

        getBoundingRect: getTextRect,

        adjustTextPositionOnRect: adjustTextPositionOnRect,

        truncateText: truncateText,

        measureText: measureText,

        getLineHeight: getLineHeight,

        parsePlainText: parsePlainText,

        parseRichText: parseRichText,

        adjustTextX: adjustTextX,

        adjustTextY: adjustTextY,

        makeFont: makeFont,

        DEFAULT_FONT: DEFAULT_FONT
    };

    module.exports = textContain;
