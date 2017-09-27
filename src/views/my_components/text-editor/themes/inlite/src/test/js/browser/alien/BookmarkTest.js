asynctest(
  'browser.alien.BookmarkTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Cursors',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyDom',
    'tinymce.core.dom.DOMUtils',
    'tinymce.themes.inlite.alien.Bookmark'
  ],
  function (Assertions, Chain, Cursors, Pipeline, TinyDom, DOMUtils, Bookmark) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var toNativeRange = function (range) {
      var domRange = document.createRange();
      domRange.setStart(range.start().dom(), range.soffset());
      domRange.setEnd(range.finish().dom(), range.foffset());
      return domRange;
    };

    var rangeToBookmark = function (dom) {
      return function (range) {
        return Bookmark.create(dom, range);
      };
    };

    var bookmarkToRange = function (dom) {
      return function (bookmark) {
        return Bookmark.resolve(dom, bookmark);
      };
    };

    var cAssertRangeEq = function (expected) {
      return Chain.op(function (actual) {
        Assertions.assertDomEq('Not equal startContainer', expected.start(), TinyDom.fromDom(actual.startContainer));
        Assertions.assertEq('Not equal startOffset', expected.soffset(), actual.startOffset);
        Assertions.assertDomEq('Not equal endContainer', expected.finish(), TinyDom.fromDom(actual.endContainer));
        Assertions.assertEq('Not equal endOffset', expected.foffset(), actual.endOffset);
      });
    };

    var sTestBookmark = function (html, path) {
      var dom = DOMUtils.DOM;
      var elm = TinyDom.fromDom(dom.create('div', {}, html));

      return Chain.asStep(elm, [
        Cursors.cFollowPath(Cursors.pathFrom(path)),
        Chain.mapper(toNativeRange),
        Chain.mapper(rangeToBookmark(dom)),
        Chain.mapper(bookmarkToRange(dom)),
        cAssertRangeEq(Cursors.calculate(elm, Cursors.pathFrom(path)))
      ]);
    };

    Pipeline.async({}, [
      sTestBookmark('abc', { element: [0], offset: 0 }),
      sTestBookmark('abc', { element: [0], offset: 1 }),
      sTestBookmark('abc', { start: { element: [0], offset: 0 }, finish: { element: [0], offset: 1 } }),
      sTestBookmark('<b>a</b>', { element: [0, 0], offset: 0 }),
      sTestBookmark('<b>a</b>', { element: [0, 0], offset: 0 }),
      sTestBookmark('<b>a</b>', { start: { element: [0, 0], offset: 0 }, finish: { element: [0, 0], offset: 1 } }),
      sTestBookmark('<b>a</b><b>b</b>', { start: { element: [0, 0], offset: 0 }, finish: { element: [1, 0], offset: 1 } })
    ], function () {
      success();
    }, failure);
  }
);
