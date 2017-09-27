test(
  'atomic.core.WordBoundaryTest', [
    'tinymce.plugins.wordcount.text.StringMapper',
    'tinymce.plugins.wordcount.text.WordBoundary'
  ],
  function (StringMapper, WordBoundary) {
    var iwb = function (str, index) {
      return WordBoundary.isWordBoundary(StringMapper.classify(str), index);
    };

    var testWordBoundary = function () {
      // should not break between most characters
      assert.eq(false, iwb('abc', 1));
      assert.eq(false, iwb('åäö', 1));
      assert.eq(false, iwb('üßœ', 1));

      // should not break some punctuation
      assert.eq(false, iwb("can't", 2));
      assert.eq(false, iwb("can’t", 2));
      assert.eq(false, iwb('foo.bar', 2));
      assert.eq(false, iwb('foo:bar', 2));

      // shouldn't break on characters attached to numbers
      assert.eq(false, iwb('123', 1));
      assert.eq(false, iwb('a123', 1));
      assert.eq(false, iwb('1a23', 1));

      // shouldn't break on punctuation in number sequences
      assert.eq(false, iwb('3.14', 1));
      assert.eq(false, iwb('1,024', 1));
      assert.eq(false, iwb('5-1', 1));

      // should extend characters
      assert.eq(false, iwb('foo\u00ADbar', 2));
      assert.eq(false, iwb('foo\u0300bar', 2));

      // Should NOT break in Katakana
      assert.eq(false, iwb('カラテ', 1));
      // Should break between every kanji
      assert.eq(true, iwb('空手道', 1));

      // Shouldn't break inside CRLF
      assert.eq(false, iwb('foo\r\nbar', 3));

      // Should break before newlines
      assert.eq(true, iwb('foo\rbar', 2));
      assert.eq(true, iwb('foo\nbar', 2));
      assert.eq(true, iwb('foo\r\nbar', 2));

      // should break after newlines
      assert.eq(true, iwb('foo\rbar', 3));
      assert.eq(true, iwb('foo\nbar', 3));
      assert.eq(true, iwb('foo\r\nbar', 4));

      // shouldn't break from extenders
      assert.eq(false, iwb('foo_bar', 2));
      assert.eq(false, iwb('__', 0));

      // Should break anywhere else
      assert.eq(true, iwb('foo bar', 2));
      assert.eq(true, iwb('foo\tbar', 2));
      assert.eq(true, iwb('foo&bar', 2));
      assert.eq(true, iwb('foo"bar"', 2));
      assert.eq(true, iwb('foo(bar)', 2));
      assert.eq(true, iwb('foo/bar', 2));

      // should return false when given out of bounds index
      assert.eq(false, iwb('', 5));
      assert.eq(false, iwb('', -1));

      // should return true for empty string
      assert.eq(true, iwb('', 0));
    };

    testWordBoundary();
  }
);