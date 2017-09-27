/**
 * Keys.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.autolink.core.Keys',
  [
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.plugins.autolink.api.Settings'
  ],
  function (Env, PluginManager, Settings) {
    var rangeEqualsDelimiterOrSpace = function (rangeString, delimiter) {
      return rangeString === delimiter || rangeString === ' ' || rangeString.charCodeAt(0) === 160;
    };

    var handleEclipse = function (editor) {
      parseCurrentLine(editor, -1, '(', true);
    };

    var handleSpacebar = function (editor) {
      parseCurrentLine(editor, 0, '', true);
    };

    var handleEnter = function (editor) {
      parseCurrentLine(editor, -1, '', false);
    };

    var scopeIndex = function (container, index) {
      if (index < 0) {
        index = 0;
      }

      if (container.nodeType === 3) {
        var len = container.data.length;

        if (index > len) {
          index = len;
        }
      }

      return index;
    };

    var setStart = function (rng, container, offset) {
      if (container.nodeType !== 1 || container.hasChildNodes()) {
        rng.setStart(container, scopeIndex(container, offset));
      } else {
        rng.setStartBefore(container);
      }
    };

    var setEnd = function (rng, container, offset) {
      if (container.nodeType !== 1 || container.hasChildNodes()) {
        rng.setEnd(container, scopeIndex(container, offset));
      } else {
        rng.setEndAfter(container);
      }
    };

    var parseCurrentLine = function (editor, endOffset, delimiter) {
      var rng, end, start, endContainer, bookmark, text, matches, prev, len, rngText;
      var autoLinkPattern = Settings.getAutoLinkPattern(editor);
      var defaultLinkTarget = Settings.getDefaultLinkTarget(editor);

      // Never create a link when we are inside a link
      if (editor.selection.getNode().tagName === 'A') {
        return;
      }

      // We need at least five characters to form a URL,
      // hence, at minimum, five characters from the beginning of the line.
      rng = editor.selection.getRng(true).cloneRange();
      if (rng.startOffset < 5) {
        // During testing, the caret is placed between two text nodes.
        // The previous text node contains the URL.
        prev = rng.endContainer.previousSibling;
        if (!prev) {
          if (!rng.endContainer.firstChild || !rng.endContainer.firstChild.nextSibling) {
            return;
          }

          prev = rng.endContainer.firstChild.nextSibling;
        }

        len = prev.length;
        setStart(rng, prev, len);
        setEnd(rng, prev, len);

        if (rng.endOffset < 5) {
          return;
        }

        end = rng.endOffset;
        endContainer = prev;
      } else {
        endContainer = rng.endContainer;

        // Get a text node
        if (endContainer.nodeType !== 3 && endContainer.firstChild) {
          while (endContainer.nodeType !== 3 && endContainer.firstChild) {
            endContainer = endContainer.firstChild;
          }

          // Move range to text node
          if (endContainer.nodeType === 3) {
            setStart(rng, endContainer, 0);
            setEnd(rng, endContainer, endContainer.nodeValue.length);
          }
        }

        if (rng.endOffset === 1) {
          end = 2;
        } else {
          end = rng.endOffset - 1 - endOffset;
        }
      }

      start = end;

      do {
        // Move the selection one character backwards.
        setStart(rng, endContainer, end >= 2 ? end - 2 : 0);
        setEnd(rng, endContainer, end >= 1 ? end - 1 : 0);
        end -= 1;
        rngText = rng.toString();

        // Loop until one of the following is found: a blank space, &nbsp;, delimiter, (end-2) >= 0
      } while (rngText !== ' ' && rngText !== '' && rngText.charCodeAt(0) !== 160 && (end - 2) >= 0 && rngText !== delimiter);

      if (rangeEqualsDelimiterOrSpace(rng.toString(), delimiter)) {
        setStart(rng, endContainer, end);
        setEnd(rng, endContainer, start);
        end += 1;
      } else if (rng.startOffset === 0) {
        setStart(rng, endContainer, 0);
        setEnd(rng, endContainer, start);
      } else {
        setStart(rng, endContainer, end);
        setEnd(rng, endContainer, start);
      }

      // Exclude last . from word like "www.site.com."
      text = rng.toString();
      if (text.charAt(text.length - 1) === '.') {
        setEnd(rng, endContainer, start - 1);
      }

      text = rng.toString();
      matches = text.match(autoLinkPattern);

      if (matches) {
        if (matches[1] === 'www.') {
          matches[1] = 'http://www.';
        } else if (/@$/.test(matches[1]) && !/^mailto:/.test(matches[1])) {
          matches[1] = 'mailto:' + matches[1];
        }

        bookmark = editor.selection.getBookmark();

        editor.selection.setRng(rng);
        editor.execCommand('createlink', false, matches[1] + matches[2]);

        if (defaultLinkTarget) {
          editor.dom.setAttrib(editor.selection.getNode(), 'target', defaultLinkTarget);
        }

        editor.selection.moveToBookmark(bookmark);
        editor.nodeChanged();
      }
    };

    var setup = function (editor) {
      var autoUrlDetectState;

      editor.on("keydown", function (e) {
        if (e.keyCode === 13) {
          return handleEnter(editor);
        }
      });

      // Internet Explorer has built-in automatic linking for most cases
      if (Env.ie) {
        editor.on("focus", function () {
          if (!autoUrlDetectState) {
            autoUrlDetectState = true;

            try {
              editor.execCommand('AutoUrlDetect', false, true);
            } catch (ex) {
              // Ignore
            }
          }
        });

        return;
      }

      editor.on("keypress", function (e) {
        if (e.keyCode === 41) {
          return handleEclipse(editor);
        }
      });

      editor.on("keyup", function (e) {
        if (e.keyCode === 32) {
          return handleSpacebar(editor);
        }
      });
    };

    return {
      setup: setup
    };
  }
);