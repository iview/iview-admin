/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.ui.Buttons',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.lists.core.NodeType',
    'tinymce.plugins.lists.core.Selection'
  ],
  function (Tools, NodeType, Selection) {
    var listState = function (editor, listName) {
      return function (e) {
        var ctrl = e.control;

        editor.on('NodeChange', function (e) {
          var lists = Tools.grep(e.parents, NodeType.isListNode);
          ctrl.active(lists.length > 0 && lists[0].nodeName === listName);
        });
      };
    };

    var indentPostRender = function (editor) {
      return function (e) {
        var ctrl = e.control;

        editor.on('nodechange', function () {
          var listItemBlocks = Selection.getSelectedListItems(editor);
          var disable = listItemBlocks.length > 0 && NodeType.isFirstChild(listItemBlocks[0]);
          ctrl.disabled(disable);
        });
      };
    };

    var register = function (editor) {
      var hasPlugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return Tools.inArray(plugins.split(/[ ,]/), plugin) !== -1;
      };

      if (!hasPlugin(editor, 'advlist')) {
        editor.addButton('numlist', {
          title: 'Numbered list',
          cmd: 'InsertOrderedList',
          onPostRender: listState(editor, 'OL')
        });

        editor.addButton('bullist', {
          title: 'Bullet list',
          cmd: 'InsertUnorderedList',
          onPostRender: listState(editor, 'UL')
        });
      }

      editor.addButton('indent', {
        icon: 'indent',
        title: 'Increase indent',
        cmd: 'Indent',
        onPostRender: indentPostRender(editor)
      });
    };

    return {
      register: register
    };
  }
);

