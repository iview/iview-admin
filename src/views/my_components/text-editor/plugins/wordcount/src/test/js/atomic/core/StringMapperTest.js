test('atomic.core.StringMapperTest', [
  'tinymce.plugins.wordcount.text.StringMapper',
  'tinymce.plugins.wordcount.text.UnicodeData'
],
  function (StringMapper, UnicodeData) {
    var ci = UnicodeData.characterIndices;

    var ALETTER = ci.ALETTER;
    var MIDNUMLET = ci.MIDNUMLET;
    var MIDLETTER = ci.MIDLETTER;
    var MIDNUM = ci.MIDNUM;
    var NUMERIC = ci.NUMERIC;
    var CR = ci.CR;
    var LF = ci.LF;
    var NEWLINE = ci.NEWLINE;
    var EXTEND = ci.EXTEND;
    var FORMAT = ci.FORMAT;
    var KATAKANA = ci.KATAKANA;
    var EXTENDNUMLET = ci.EXTENDNUMLET;
    var OTHER = ci.OTHER;
    var AT = ci.AT;

    var classify = StringMapper.classify;

    var testClassify = function () {
      assert.eq([ALETTER, ALETTER, ALETTER], classify("abc"));
      assert.eq([ALETTER, ALETTER, ALETTER], classify("åäö"));
      assert.eq([ALETTER, NUMERIC, ALETTER], classify("a2c"));
      assert.eq([ALETTER, MIDNUMLET, ALETTER, ALETTER, OTHER, ALETTER, ALETTER, ALETTER, ALETTER, ALETTER], classify("a'la carte"));
      assert.eq([ALETTER, ALETTER, ALETTER, OTHER, LF, OTHER, ALETTER, ALETTER, ALETTER], classify("one \n two"));
      assert.eq([NUMERIC, MIDNUM, NUMERIC, NUMERIC, NUMERIC, MIDNUMLET, NUMERIC, NUMERIC], classify("3,500.10"));
      assert.eq([OTHER, KATAKANA, KATAKANA], classify('愛ラブ'));
      assert.eq([OTHER, OTHER], classify('ねこ'));
      assert.eq([MIDLETTER], classify('·'));
      assert.eq([EXTENDNUMLET, MIDNUMLET, MIDNUM, MIDNUM, MIDNUM, MIDNUM], classify('=-+*/⋉'));
      assert.eq([CR], classify('\r'));
      assert.eq([EXTEND], classify('̀'));
      assert.eq([NEWLINE], classify('\x0B'));
      assert.eq([FORMAT], classify('؃'));
      assert.eq([EXTENDNUMLET], classify('︴'));
      assert.eq([AT], classify('@'));
    };

    testClassify();
  }
);