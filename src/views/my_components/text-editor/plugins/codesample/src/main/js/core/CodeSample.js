/**
 * CodeSample.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.CodeSample',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.plugins.codesample.core.Prism',
    'tinymce.plugins.codesample.util.Utils'
  ],
  function (DOMUtils, Prism, Utils) {
    var getSelectedCodeSample = function (editor) {
      var node = editor.selection.getNode();

      if (Utils.isCodeSample(node)) {
        return node;
      }

      return null;
    };

    var insertCodeSample = function (editor, language, code) {
      editor.undoManager.transact(function () {
        var node = getSelectedCodeSample(editor);

        code = DOMUtils.DOM.encode(code);

        if (node) {
          editor.dom.setAttrib(node, 'class', 'language-' + language);
          node.innerHTML = code;
          Prism.highlightElement(node);
          editor.selection.select(node);
        } else {
          editor.insertContent('<pre id="__new" class="language-' + language + '">' + code + '</pre>');
          editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
        }
      });
    };

    var getCurrentCode = function (editor) {
      var node = getSelectedCodeSample(editor);

      if (node) {
        return node.textContent;
      }

      return '';
    };

    return {
      getSelectedCodeSample: getSelectedCodeSample,
      insertCodeSample: insertCodeSample,
      getCurrentCode: getCurrentCode
    };
  }
);