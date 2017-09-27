/**
 * WordGetter.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.text.WordGetter',
  [
    'tinymce.plugins.wordcount.text.UnicodeData',
    'tinymce.plugins.wordcount.text.StringMapper',
    'tinymce.plugins.wordcount.text.WordBoundary'
  ],
  function (UnicodeData, StringMapper, WordBoundary) {
    var EMPTY_STRING = UnicodeData.EMPTY_STRING;
    var WHITESPACE = UnicodeData.WHITESPACE;
    var PUNCTUATION = UnicodeData.PUNCTUATION;

    var isProtocol = function (word) {
      return word === 'http' || word === 'https';
    };

    var findWordEnd = function (string, index) {
      var i;
      for (i = index; i < string.length; ++i) {
        var chr = string.charAt(i);

        if (WHITESPACE.test(chr)) {
          break;
        }
      }
      return i;
    };

    var extractUrl = function (word, string, index) {
      var endIndex = findWordEnd(string, index + 1);
      var peakedWord = string.substring(index + 1, endIndex);
      if (peakedWord.substr(0, 3) === '://') {
        return {
          word: word + peakedWord,
          index: endIndex
        };
      }

      return {
        word: word,
        index: index
      };
    };

    var doGetWords = function (string, options) {
      var i = 0;
      var map = StringMapper.classify(string);
      var len = map.length;
      var word = [];
      var words = [];
      var chr;
      var includePunctuation;
      var includeWhitespace;

      if (!options) {
        options = {};
      }

      if (options.ignoreCase) {
        string = string.toLowerCase();
      }

      includePunctuation = options.includePunctuation;
      includeWhitespace = options.includeWhitespace;

      // Loop through each character in the classification map and determine
      // whether it precedes a word boundary, building an array of distinct
      // words as we go.
      for (; i < len; ++i) {
        chr = string.charAt(i);

        // Append this character to the current word.
        word.push(chr);

        // If there's a word boundary between the current character and the
        // next character, append the current word to the words array and
        // start building a new word.
        if (WordBoundary.isWordBoundary(map, i)) {
          word = word.join(EMPTY_STRING);

          if (word &&
            (includeWhitespace || !WHITESPACE.test(word)) &&
            (includePunctuation || !PUNCTUATION.test(word))) {
            if (isProtocol(word)) {
              var obj = extractUrl(word, string, i);
              words.push(obj.word);
              i = obj.index;
            } else {
              words.push(word);
            }
          }

          word = [];
        }
      }

      return words;
    };

    var getWords = function (string, options) {
      return doGetWords(string.replace(/\ufeff/g, ''), options);
    };

    return {
      getWords: getWords
    };
  }
);