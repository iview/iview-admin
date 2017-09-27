test(
  'atomic.core.WordGetterTest',
  [
    'tinymce.plugins.wordcount.text.WordGetter'
  ],
  function (WordGetter) {
    var getWords = WordGetter.getWords;

    var testGetWords = function () {
      // splits words on whitespace
      assert.eq(['hello', 'world'], getWords('hello world'));
      // does not split on numeric separators
      assert.eq(['the', 'price', 'is', '3,500.50'], getWords('the price is 3,500.50'));
      // does not split on katakana words
      assert.eq(['僕', 'の', '名', '前', 'は', 'マティアス'], getWords('僕の名前はマティアス'));
      // removes punctuation by default
      assert.eq(['a', 'b'], getWords('a .... b'));
      //  but keeps with setting
      assert.eq(['a', '.', '.', '.', '.', 'b'], getWords('a .... b', { includePunctuation: true }));
      // keeps whitespace with setting
      assert.eq(['a', ' ', ' ', ' ', 'b'], getWords('a   b', { includeWhitespace: true }));
      // ignores case with setting
      assert.eq(['hello', 'world'], getWords('HELLO World', { ignoreCase: true }));

      assert.eq(['http://www.google.com'], getWords('http://www.google.com'));
      assert.eq(['https://www.google.com'], getWords('https://www.google.com'));
      assert.eq(['bengt@mail.se'], getWords('bengt@mail.se'));
      assert.eq(['bengt@mail.se', 'abc'], getWords('bengt@mail.se abc'));
      assert.eq(['http://www.google.com', 'abc'], getWords('http://www.google.com abc'));
      assert.eq(['ab'], getWords('a\ufeffb'));
      assert.eq(['1+1*1/1⋉1=1'], getWords('1+1*1/1⋉1=1'));
      assert.eq(['50-10'], getWords('50-10'));
      assert.eq(['jack-in-the-box'], getWords('jack-in-the-box'));
      assert.eq(['n=13'], getWords('n=13'));
    };

    testGetWords();
  }
);