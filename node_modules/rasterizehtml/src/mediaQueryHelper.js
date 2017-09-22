var mediaQueryHelper = (function (cssMediaQuery) {
    "use strict";

    var module = {};

    var svgImgBlueByEmMediaQuery = function () {
        var svg = '<svg id="svg" xmlns="http://www.w3.org/2000/svg" width="10" height="10">' +
                '<style>@media (max-width: 1em) { svg { background: #00f; } }</style>' +
                '</svg>';

        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg),
            img = document.createElement('img');

        img.src = url;

        return img;
    };

    var firstPixelHasColor = function (img, r, g, b) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var context = canvas.getContext("2d"),
            data;

        context.drawImage(img, 0, 0);
        data = context.getImageData(0, 0, 1, 1).data;
        return data[0] === r && data[1] === g && data[2] === b;
    };

    var hasEmMediaQueryIssue = function () {
        var img = svgImgBlueByEmMediaQuery(),
            defer = ayepromise.defer();

        document.querySelector('body').appendChild(img);

        img.onload = function () {
            document.querySelector('body').removeChild(img);
            try {
                defer.resolve(!firstPixelHasColor(img, 0, 0, 255));
            } catch (e) {
                // Fails in PhantomJS, let's assume the issue exists
                defer.resolve(true);
            }
        };
        img.onerror = function () {
            defer.reject();
        };

        return defer.promise;
    };

    var hasEmIssue;

    module.needsEmWorkaround = function () {
        if (hasEmIssue === undefined) {
            hasEmIssue = hasEmMediaQueryIssue();
        }
        return hasEmIssue;
    };

    var asArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    };

    var cssRulesToText = function (cssRules) {
        return asArray(cssRules).map(function (rule) {
            return rule.cssText;
        }).join('\n');
    };

    var mediaQueryRule = function (mediaQuery, cssRules) {
        return '@media ' + mediaQuery + '{' +
            cssRulesToText(cssRules) +
            '}';
    };

    var exchangeRuleWithNewContent = function (styleSheet, ruleIdx, newRuleText) {
        try {
            styleSheet.insertRule(newRuleText, ruleIdx+1);
        } catch (e) {
            // In case the browser does not like our new rule we just keep the existing one and quietly leave
            return;
        }
        styleSheet.deleteRule(ruleIdx);
    };

    var changeCssRule = function (rule, newRuleText) {
        var styleSheet = rule.parentStyleSheet,
            ruleIdx = asArray(styleSheet.cssRules).indexOf(rule);

        exchangeRuleWithNewContent(styleSheet, ruleIdx, newRuleText);
    };

    var rewriteStyleContent = function (styleElement) {
        styleElement.textContent = cssRulesToText(styleElement.sheet.cssRules);
    };

    var serializeExpression = function (exp) {
        var feature = exp.modifier ? exp.modifier + '-' + exp.feature : exp.feature;
        if (exp.value) {
            return '(' + feature + ': ' + exp.value + ')';
        } else {
            return '(' + feature + ')';
        }
    };

    var serializeQueryPart = function (q) {
        var segments = [];

        if (q.inverse) {
            segments.push("not");
        }

        segments.push(q.type);

        if (q.expressions.length > 0) {
            segments.push('and ' + q.expressions.map(serializeExpression).join(' and '));
        }

        return segments.join(' ');
    };

    // poor man's testability
    module.serializeQuery = function (q) {
        var queryParts = q.map(serializeQueryPart);
        return queryParts.join(', ');
    };

    var transformEmIntoPx = function (em) {
        return em * 16;
    };

    var replaceEmValueWithPx = function (value) {
        // Match a number with em unit. Doesn't match all, but should be enough for now
        var match = /^((?:\d+\.)?\d+)em/.exec(value);
        if (match) {
            return transformEmIntoPx(parseFloat(match[1])) + 'px';
        }
        return value;
    };

    var substituteEmWithPx = function (mediaQuery) {
        var parsedQuery = cssMediaQuery.parse(mediaQuery),
            hasChanges = false;

        parsedQuery.forEach(function (q) {
            q.expressions.forEach(function (exp) {
                var rewrittenValue = replaceEmValueWithPx(exp.value);

                hasChanges |= rewrittenValue !== exp.value;
                exp.value = rewrittenValue;
            });
        });

        if (hasChanges) {
            return module.serializeQuery(parsedQuery);
        }
    };

    var replaceEmsWithPx = function (mediaQueryRules) {
        var anyRuleHasChanges = false;

        mediaQueryRules.forEach(function (rule) {
            var rewrittenMediaQuery = substituteEmWithPx(rule.media.mediaText);

            if (rewrittenMediaQuery) {
                changeCssRule(rule, mediaQueryRule(rewrittenMediaQuery, rule.cssRules));
            }

            anyRuleHasChanges |= !!rewrittenMediaQuery;
        });

        return anyRuleHasChanges;
    };

    module.workAroundWebKitEmSizeIssue = function (element) {
        var styles = element.querySelectorAll('style');

        asArray(styles).forEach(function (style) {
            var mediaQueryRules = asArray(style.sheet.cssRules).filter(function (rule) {
                return rule.type === window.CSSRule.MEDIA_RULE;
            });

            var hasChanges = replaceEmsWithPx(mediaQueryRules);
            if (hasChanges) {
                rewriteStyleContent(style);
            }
        });
    };

    return module;
}(cssMediaQuery));
