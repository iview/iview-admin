describe("HTML Document Utility functions", function () {
    "use strict";

    var doc,
        setHtml = function (html) {
            doc.documentElement.innerHTML = html;
        };

    beforeEach(function () {
        doc = document.implementation.createHTMLDocument('');
    });

    describe("rewriteCssSelectorWith", function () {
        it("should rewrite CSS rules with the new selector", function () {
            setHtml('<head><style>a:hover { color: blue; }</style></head><body><span></span></body>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/a.myFakeHover \{\s*color: blue;\s*\}/);
        });

        it("should rewrite CSS rules in SVG element with the new selector", function () {
            setHtml('<svg><style>.myClass { color: blue; }</style></svg>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, '.myClass', '.myFakeClass');

            expect(doc.querySelector('svg').textContent).toMatch(/.myFakeClass \{\s*color: blue;\s*\}/);
        });

        it("should correctly handle complex selectors", function () {
            setHtml('<style>body:hover span { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/body.myFakeHover span \{\s*color: blue;\s*\}/);
        });

        it("should correctly handle simple selector occurrence", function () {
            setHtml('<style>:hover { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/.myFakeHover \{\s*color: blue;\s*\}/);
        });

        it("should not match partial selector occurrence", function () {
            setHtml('<style>.myClass { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, '.my', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/.myClass \{\s*color: blue;\s*\}/);
        });

        it("should correctly handle multiple selector occurrence in same rule selector", function () {
            setHtml('<style>i:hover, a:hover { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/i.myFakeHover, a.myFakeHover \{\s*color: blue;\s*\}/);
        });

        it("should correctly handle multiple sub-selector", function () {
            setHtml('<style>i:active::after { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':active', '.myFakeActive');

            expect(doc.querySelector('style').textContent).toMatch(/i.myFakeActive::?after \{\s*color: blue;\s*\}/);
        });

        it("should correctly handle multiple selector occurrences in different rules", function () {
            setHtml('<style>a:active {color: green;}i:active { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':active', '.myFakeActive');

            expect(doc.querySelector('style').textContent).toMatch(/i.myFakeActive \{\s*color: blue;\s*\}/);
        });

        it("should cope with non CSSStyleRule", function () {
            setHtml('<head><style>@font-face { font-family: "RaphaelIcons"; src: url("raphaelicons-webfont.woff"); }</style></head><body><span></span></body>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');
        });

        it("should not touch style elements without a matching selector", function () {
            setHtml('<style>a { color: blue; }/* a comment*/</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            // Use the fact that comments are discarded when processing a style sheet
            expect(doc.querySelector('style').textContent).toMatch(/a comment/);
        });

        it("should match pseudo selector independent of letter case", function () {
            setHtml('<style>a:HOver { color: blue; }/* a comment*/</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/a.myFakeHover/);
        });

        it("should correctly replace match with preceding not() functional form", function () {
            setHtml('<style>a:not([disabled]):hover { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myFakeHover');

            expect(doc.querySelector('style').textContent).toMatch(/a(.myFakeHover:not\(\[disabled\]\)|:not\(\[disabled\]\).myFakeHover)/);
        });

        // On Firefox this needs a work around because of https://bugzilla.mozilla.org/show_bug.cgi?id=925493
        ifNotInPhantomJsIt("should integrate with a document loaded through ajax", function (done) {
            testHelper.readHTMLDocumentFixture("hover.html").then(function (doc) {
                documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myfakehover');

                expect(doc.querySelector('style').textContent).toMatch(/body.myfakehover/);
                done();
            });
        });

        // Chrome and WebKit don't seem to care about tag name selector case sensitivity for XML documents.
        // https://github.com/cburgmer/rasterizeHTML.js/issues/91
        ifNotInWebkitOrBlinkIt("should keep letter case", function () {
            setHtml('<style>foreignObject:hover { color: blue; }</style>');

            documentUtil.rewriteCssSelectorWith(doc.documentElement, ':hover', '.myfakehover');

            expect(doc.querySelector('style').textContent).toMatch(/foreignObject.myfakehover/);
        });
    });

    describe("lowercaseCssTypeSelectors", function () {
        it("should convert matching tag name to lower case", function () {
            setHtml('<style>A { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a']);

            expect(doc.querySelector('style').textContent).toMatch(/a \{/);
        });

        it("should convert matching tag name with mixed letter case to lower case", function () {
            setHtml('<style>sPAn { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['span']);

            expect(doc.querySelector('style').textContent).toMatch(/span \{/);
        });

        it("should convert matching tag name from a list of names to lower case", function () {
            setHtml('<style>SPAN { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a', 'span']);

            expect(doc.querySelector('style').textContent).toMatch(/span \{/);
        });

        it("should not touch selector parts outside of the tag name", function () {
            setHtml('<style>SPAN.aClassName { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['span']);

            expect(doc.querySelector('style').textContent).toMatch(/span.aClassName \{/);
        });

        it("should not match any tag names with a matching suffix", function () {
            setHtml('<style>LI { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['i']);

            expect(doc.querySelector('style').textContent).toMatch(/LI \{/);
        });

        it("should not match any IDs with a matching alphabetical part", function () {
            setHtml('<style>#A { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a']);

            expect(doc.querySelector('style').textContent).toMatch(/#A \{/);
        });

        it("should not match a substring if the selector is in the middle of the tag list", function () {
            setHtml('<style>#timeTaken { color: blue; }');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a', 'meta', 'i']);

            expect(doc.querySelector('style').textContent).toMatch(/#timeTaken \{/);
        });

        it("should convert complex selectors", function () {
            setHtml('<style>LI.COMPLEX:active { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['li']);

            expect(doc.querySelector('style').textContent).toMatch(/li.COMPLEX:active \{/);
        });

        // Chrome and WebKit don't seem to care about tag name selector case sensitivity for XML documents.
        // https://github.com/cburgmer/rasterizeHTML.js/issues/91
        ifNotInWebkitOrBlinkIt("should only convert mentioned tag names", function () {
            setHtml('<style>BODY LI { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['li']);

            expect(doc.querySelector('style').textContent).toMatch(/BODY li \{/);
        });

        it("should convert multiple different matches", function () {
            setHtml('<style>BODY LI { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['body', 'li']);

            expect(doc.querySelector('style').textContent).toMatch(/body li \{/);
        });

        it("should convert an selector enumeration", function () {
            setHtml('<style>BODY, LI { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['body', 'li']);

            expect(doc.querySelector('style').textContent).toMatch(/body, li \{/);
        });

        it("should be minimally invasive so we don't touch selectors that might fail unless there's actual change", function () {
            setHtml('<style>esi\\:include, a { color: blue; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a']);

            // expect this not to fail (Chrome would complain about the insertion of an invalid selector:
            // "SyntaxError: Failed to execute 'insertRule' on 'CSSStyleSheet': Failed to parse the rule 'esi:include, a { color: blue; }'.")
        });

        // Document https://github.com/cburgmer/rasterizeHTML.js/issues/92
        xit("should not conflate rules targeting SVGs with ones targeting only HTML", function () {
            // lowercase matches SVG and HTML, while uppercase matches HTML only (case-insensitive)
            setHtml('<style>a { color: blue; } A { color: green; }</style>');

            documentUtil.lowercaseCssTypeSelectors(doc.documentElement, ['a']);

            expect(doc.querySelector('style').textContent).not.toMatch(/\}\s*a \{ color: green/);
        });
    });

    describe("addClassNameRecursively", function () {
        it("should attach class to selected element", function () {
            setHtml("<span>a span</span>");

            documentUtil.addClassNameRecursively(doc.querySelector('span'), '.myClass');

            expect(doc.querySelector('span').className).toMatch(/myClass/);
        });

        it("should attach the fake hover class to select the parent's elements", function () {
            setHtml("<div><ol><li>a list entry</li></ol></div>");

            documentUtil.addClassNameRecursively(doc.querySelector('li'), '.myClass');

            expect(doc.querySelector('ol').className).toMatch(/myClass/);
            expect(doc.querySelector('div').className).toMatch(/myClass/);
            expect(doc.querySelector('body').className).toMatch(/myClass/);
            expect(doc.querySelector('html').className).toMatch(/myClass/);
        });

        it("should not attach the fake hover class to siblings or parent's siblings", function () {
            setHtml("<div><span>a span</span><div><a>a list entry</a><i>text</i></div></div>");

            documentUtil.addClassNameRecursively(doc.querySelector('a'), '.myClass');

            expect(doc.querySelector('i').className).toEqual('');
            expect(doc.querySelector('span').className).toEqual('');
        });
    });

    describe("findHtmlOnlyNodeNames", function () {
        it("should find html node names", function () {
            setHtml("<html><body><p><span class='whatever'><br>content</span></p></body></html>");

            var nodeNames = documentUtil.findHtmlOnlyNodeNames(doc.documentElement);

            expect(nodeNames).toEqual(['html', 'head', 'body', 'p', 'span', 'br']);
        });

        it("should not include tags from other namespaces", function () {
            setHtml("<html><body><svg xmlns='http://www.w3.org/2000/svg'><rect/></svg></body></html>");

            var nodeNames = documentUtil.findHtmlOnlyNodeNames(doc.documentElement);

            expect(nodeNames).toEqual(['html', 'head', 'body']);
        });

        it("should not include HTML tags if they conflict with ones from other namespaces", function () {
            setHtml('<html><body>' +
                    '<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                    '<a xlink:href="target"></a>' +
                    '</svg>' +
                    '<a href="anotherTarget"></a></body></html>');

            var nodeNames = documentUtil.findHtmlOnlyNodeNames(doc.documentElement);

            expect(nodeNames).toEqual(['html', 'head', 'body']);
        });
    });
});
