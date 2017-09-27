test(
  'atomic.tinymce.plugins.paste.InternalHtmlTest',
  [
    'tinymce.plugins.paste.core.InternalHtml'
  ],
  function (InternalHtml) {
    var testMark = function () {
      assert.eq('<!-- x-tinymce/html -->abc', InternalHtml.mark('abc'));
    };

    var testUnmark = function () {
      assert.eq('abc', InternalHtml.unmark('<!-- x-tinymce/html -->abc'));
      assert.eq('abc', InternalHtml.unmark('abc<!-- x-tinymce/html -->'));
    };

    var testIsMarked = function () {
      assert.eq(true, InternalHtml.isMarked('<!-- x-tinymce/html -->abc'));
      assert.eq(true, InternalHtml.isMarked('abc<!-- x-tinymce/html -->'));
      assert.eq(false, InternalHtml.isMarked('abc'));
    };

    var testInternalHtmlMime = function () {
      assert.eq('x-tinymce/html', InternalHtml.internalHtmlMime());
    };

    testMark();
    testUnmark();
    testIsMarked();
    testInternalHtmlMime();
  }
);