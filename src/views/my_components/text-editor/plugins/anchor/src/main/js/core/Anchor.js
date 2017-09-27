/**
 * Anchor.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.anchor.core.Anchor',
  [
  ],
  function () {
    var isValidId = function (id) {
      // Follows HTML4 rules: https://www.w3.org/TR/html401/types.html#type-id
      return /^[A-Za-z][A-Za-z0-9\-:._]*$/.test(id);
    };

    var getId = function (editor) {
      var selectedNode = editor.selection.getNode();
      var isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === '';
      return isAnchor ? (selectedNode.id || selectedNode.name) : '';
    };

    var insert = function (editor, id) {
      var selectedNode = editor.selection.getNode();
      var isAnchor = selectedNode.tagName === 'A' && editor.dom.getAttrib(selectedNode, 'href') === '';

      if (isAnchor) {
        selectedNode.removeAttribute('name');
        selectedNode.id = id;
      } else {
        editor.selection.collapse(true);
        editor.execCommand('mceInsertContent', false, editor.dom.createHTML('a', {
          id: id
        }));
      }
    };

    return {
      isValidId: isValidId,
      getId: getId,
      insert: insert
    };
  }
);