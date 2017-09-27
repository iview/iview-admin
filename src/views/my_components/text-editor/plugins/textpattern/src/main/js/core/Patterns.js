/**
 * Patterns.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.textpattern.core.Patterns',
  [
  ],
  function () {
    // Returns a sorted patterns list, ordered descending by start length
    var sortPatterns = function (patterns) {
      return patterns.sort(function (a, b) {
        if (a.start.length > b.start.length) {
          return -1;
        }

        if (a.start.length < b.start.length) {
          return 1;
        }

        return 0;
      });
    };

    // Finds a matching pattern to the specified text
    var findPattern = function (patterns, text) {
      for (var i = 0; i < patterns.length; i++) {
        if (text.indexOf(patterns[i].start) !== 0) {
          continue;
        }

        if (patterns[i].end && text.lastIndexOf(patterns[i].end) !== (text.length - patterns[i].end.length)) {
          continue;
        }

        return patterns[i];
      }
    };

    var isMatchingPattern = function (pattern, text, offset, delta) {
      var textEnd = text.substr(offset - pattern.end.length - delta, pattern.end.length);
      return textEnd === pattern.end;
    };

    var hasContent = function (offset, delta, pattern) {
      return (offset - delta - pattern.end.length - pattern.start.length) > 0;
    };

    // Finds the best matching end pattern
    var findEndPattern = function (patterns, text, offset, delta) {
      var pattern, i;
      var sortedPatterns = sortPatterns(patterns);

      // Find best matching end
      for (i = 0; i < sortedPatterns.length; i++) {
        pattern = sortedPatterns[i];
        if (pattern.end !== undefined && isMatchingPattern(pattern, text, offset, delta) && hasContent(offset, delta, pattern)) {
          return pattern;
        }
      }
    };

    return {
      findPattern: findPattern,
      findEndPattern: findEndPattern
    };
  }
);
