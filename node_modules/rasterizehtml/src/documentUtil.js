var documentUtil = (function () {
    "use strict";

    var module = {};

    var asArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    };

    module.addClassName = function (element, className) {
        element.className += ' ' + className;
    };

    module.addClassNameRecursively = function (element, className) {
        module.addClassName(element, className);

        if (element.parentNode !== element.ownerDocument) {
            module.addClassNameRecursively(element.parentNode, className);
        }
    };

    var changeCssRule = function (rule, newRuleText) {
        var styleSheet = rule.parentStyleSheet,
            ruleIdx = asArray(styleSheet.cssRules).indexOf(rule);

        // Exchange rule with the new text
        styleSheet.insertRule(newRuleText, ruleIdx+1);
        styleSheet.deleteRule(ruleIdx);
    };

    var updateRuleSelector = function (rule, updatedSelector) {
        var styleDefinitions = rule.cssText.replace(/^[^\{]+/, ''),
            newRule = updatedSelector + ' ' + styleDefinitions;

        changeCssRule(rule, newRule);
    };

    var cssRulesToText = function (cssRules) {
        return asArray(cssRules).reduce(function (cssText, rule) {
            return cssText + rule.cssText;
        }, '');
    };

    var rewriteStyleContent = function (styleElement) {
        styleElement.textContent = cssRulesToText(styleElement.sheet.cssRules);
    };

    var addSheetPropertyToSvgStyleElement = function (svgStyleElement) {
        var doc = document.implementation.createHTMLDocument(''),
            cssStyleElement = document.createElement('style');

        cssStyleElement.textContent = svgStyleElement.textContent;
        // the style will only be parsed once it is added to a document
        doc.body.appendChild(cssStyleElement);

        svgStyleElement.sheet = cssStyleElement.sheet;
    };

    var matchingSimpleSelectorsRegex = function (simpleSelectorList) {
        return '(' +
            '(?:^|[^.#:\\w])' +            // start of string or not a simple selector character,
            '|' +                          // ... or ...
            '(?=\\W)' +                    // the next character parsed is not an alphabetic character (and thus a natural boundary)
            ')' +
            '(' +
            simpleSelectorList.join('|') + // one out of the given simple selectors
            ')' +
            '(?=\\W|$)';                   // followed either by a non-alphabetic character or the end of the string
    };

    var replaceSimpleSelectorsBy = function (element, simpleSelectorList, caseInsensitiveReplaceFunc) {
        var selectorRegex = matchingSimpleSelectorsRegex(simpleSelectorList);

        asArray(element.querySelectorAll('style')).forEach(function (styleElement) {
            // SVGStyleElement doesn't have a property sheet in Safari, we need some workaround here
            // more details can be found here: https://github.com/cburgmer/rasterizeHTML.js/issues/158
            if (typeof styleElement.sheet === 'undefined') {
                addSheetPropertyToSvgStyleElement(styleElement);
            }

            var matchingRules = asArray(styleElement.sheet.cssRules).filter(function (rule) {
                return rule.selectorText && new RegExp(selectorRegex, 'i').test(rule.selectorText);
            });

            if (matchingRules.length) {
                matchingRules.forEach(function (rule) {
                    var newSelector = rule.selectorText.replace(new RegExp(selectorRegex, 'gi'),
                                                             function (_, prefixMatch, selectorMatch) {
                        return prefixMatch + caseInsensitiveReplaceFunc(selectorMatch);
                    });

                    if (newSelector !== rule.selectorText) {
                        updateRuleSelector(rule, newSelector);
                    }
                });

                rewriteStyleContent(styleElement);
            }
        });
    };

    module.rewriteCssSelectorWith = function (element, oldSelector, newSelector) {
        replaceSimpleSelectorsBy(element, [oldSelector], function () {
            return newSelector;
        });
    };

    module.lowercaseCssTypeSelectors = function (element, matchingTagNames) {
        replaceSimpleSelectorsBy(element, matchingTagNames, function (match) {
            return match.toLowerCase();
        });
    };

    module.findHtmlOnlyNodeNames = function (element) {
        var treeWalker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_ELEMENT),
            htmlNodeNames = {},
            nonHtmlNodeNames = {},
            currentTagName;

        do {
            currentTagName = treeWalker.currentNode.tagName.toLowerCase();
            if (treeWalker.currentNode.namespaceURI === 'http://www.w3.org/1999/xhtml') {
                htmlNodeNames[currentTagName] = true;
            } else {
                nonHtmlNodeNames[currentTagName] = true;
            }
        } while(treeWalker.nextNode());

        return Object.keys(htmlNodeNames).filter(function (tagName) {
            return !nonHtmlNodeNames[tagName];
        });
    };

    return module;
}());
