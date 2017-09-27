/**
 * ListUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.core.ListUtils',
  [
  ],
  function () {
    var isChildOfBody = function (editor, elm) {
      return editor.$.contains(editor.getBody(), elm);
    };

    var isListNode = function (editor) {
      return function (node) {
        return node && (/^(OL|UL|DL)$/).test(node.nodeName) && isChildOfBody(editor, node);
      };
    };

    var getSelectedStyleType = function (editor) {
      var listElm = editor.dom.getParent(editor.selection.getNode(), 'ol,ul');
      return editor.dom.getStyle(listElm, 'listStyleType') || '';
    };

    return {
      isListNode: isListNode,
      getSelectedStyleType: getSelectedStyleType
    };
  }
);