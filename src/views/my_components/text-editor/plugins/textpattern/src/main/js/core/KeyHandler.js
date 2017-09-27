/**
 * KeyHandler.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.textpattern.core.KeyHandler',
  [
    'tinymce.core.util.VK',
    'tinymce.plugins.textpattern.core.Formatter'
  ],
  function (VK, Formatter) {
    function handleEnter(editor, patterns) {
      var rng, wrappedTextNode;

      wrappedTextNode = Formatter.applyInlineFormat(editor, patterns, false);
      if (wrappedTextNode) {
        rng = editor.dom.createRng();
        rng.setStart(wrappedTextNode, wrappedTextNode.data.length);
        rng.setEnd(wrappedTextNode, wrappedTextNode.data.length);
        editor.selection.setRng(rng);
      }

      Formatter.applyBlockFormat(editor, patterns);
    }

    function handleInlineKey(editor, patterns) {
      var wrappedTextNode, lastChar, lastCharNode, rng, dom;

      wrappedTextNode = Formatter.applyInlineFormat(editor, patterns, true);
      if (wrappedTextNode) {
        dom = editor.dom;
        lastChar = wrappedTextNode.data.slice(-1);

        // Move space after the newly formatted node
        if (/[\u00a0 ]/.test(lastChar)) {
          wrappedTextNode.deleteData(wrappedTextNode.data.length - 1, 1);
          lastCharNode = dom.doc.createTextNode(lastChar);

          if (wrappedTextNode.nextSibling) {
            dom.insertAfter(lastCharNode, wrappedTextNode.nextSibling);
          } else {
            wrappedTextNode.parentNode.appendChild(lastCharNode);
          }

          rng = dom.createRng();
          rng.setStart(lastCharNode, 1);
          rng.setEnd(lastCharNode, 1);
          editor.selection.setRng(rng);
        }
      }
    }

    var checkKeyEvent = function (codes, event, predicate) {
      for (var i = 0; i < codes.length; i++) {
        if (predicate(codes[i], event)) {
          return true;
        }
      }
    };

    var checkKeyCode = function (codes, event) {
      return checkKeyEvent(codes, event, function (code, event) {
        return code === event.keyCode && VK.modifierPressed(event) === false;
      });
    };

    var checkCharCode = function (chars, event) {
      return checkKeyEvent(chars, event, function (chr, event) {
        return chr.charCodeAt(0) === event.charCode;
      });
    };

    return {
      handleEnter: handleEnter,
      handleInlineKey: handleInlineKey,
      checkCharCode: checkCharCode,
      checkKeyCode: checkKeyCode
    };
  }
);
