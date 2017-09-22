"use strict";

var cssom;

try {
  cssom = require('cssom');
} catch (e) {
}


exports.unquoteString = function (quotedUrl) {
    var doubleQuoteRegex = /^"(.*)"$/,
        singleQuoteRegex = /^'(.*)'$/;

    if (doubleQuoteRegex.test(quotedUrl)) {
        return quotedUrl.replace(doubleQuoteRegex, "$1");
    } else {
        if (singleQuoteRegex.test(quotedUrl)) {
            return quotedUrl.replace(singleQuoteRegex, "$1");
        } else {
            return quotedUrl;
        }
    }
};

var rulesForCssTextFromBrowser = function (styleContent) {
    var doc = document.implementation.createHTMLDocument(""),
        styleElement = document.createElement("style"),
        rules;

    styleElement.textContent = styleContent;
    // the style will only be parsed once it is added to a document
    doc.body.appendChild(styleElement);
    rules = styleElement.sheet.cssRules;

    return Array.prototype.slice.call(rules);
};

var browserHasBackgroundImageUrlIssue = (function () {
    // Checks for http://code.google.com/p/chromium/issues/detail?id=161644
    var rules = rulesForCssTextFromBrowser('a{background:url(i)}');
    return !rules.length || rules[0].cssText.indexOf('url()') >= 0;
}());

var browserHasFontFaceUrlIssue = (function () {
    // Checks for https://bugs.chromium.org/p/chromium/issues/detail?id=588129
    var rules = rulesForCssTextFromBrowser('@font-face { font-family: "f"; src: url("f"); }');
    return !rules.length || /url\(['"]*\)/.test(rules[0].cssText);
}());

var browserHasBackgroundImageUrlSetIssue = (function () {
    // Checks for https://bugs.chromium.org/p/chromium/issues/detail?id=660663
    var rules = rulesForCssTextFromBrowser('a{background:url(old)}');
    rules[0].style.setProperty('background', 'url(new)', '');
    return rules[0].style.getPropertyValue('background').indexOf('old') >= 0;
}());

exports.rulesForCssText = function (styleContent) {
    if ((browserHasBackgroundImageUrlIssue || browserHasFontFaceUrlIssue || browserHasBackgroundImageUrlSetIssue) && cssom && cssom.parse) {
        return cssom.parse(styleContent).cssRules;
    } else {
        return rulesForCssTextFromBrowser(styleContent);
    }
};

exports.cssRulesToText = function (cssRules) {
    return cssRules.reduce(function (cssText, rule) {
        return cssText + rule.cssText;
    }, '');
};

exports.exchangeRule = function (cssRules, rule, newRuleText) {
    var ruleIdx = cssRules.indexOf(rule);

    // We create a new document and stylesheet to parse the rule,
    // instead of relying on rule.parentStyleSheet, because
    // rule.parentStyleSheet may be null
    // (https://github.com/cburgmer/inlineresources/issues/3)
    cssRules[ruleIdx] = exports.rulesForCssText(newRuleText)[0];
};

// Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=443978
exports.changeFontFaceRuleSrc = function (cssRules, rule, newSrc) {
    var newRuleText = '@font-face { font-family: ' + rule.style.getPropertyValue("font-family") + '; ';

    if (rule.style.getPropertyValue("font-style")) {
        newRuleText += 'font-style: ' + rule.style.getPropertyValue("font-style") + '; ';
    }

    if (rule.style.getPropertyValue("font-weight")) {
        newRuleText += 'font-weight: ' + rule.style.getPropertyValue("font-weight") + '; ';
    }

    newRuleText += 'src: ' + newSrc + '}';
    exports.exchangeRule(cssRules, rule, newRuleText);
};
