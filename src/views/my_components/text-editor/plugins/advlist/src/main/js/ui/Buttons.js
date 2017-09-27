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
  'tinymce.plugins.advlist.ui.Buttons',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.advlist.api.Settings',
    'tinymce.plugins.advlist.core.Actions',
    'tinymce.plugins.advlist.core.ListUtils',
    'tinymce.plugins.advlist.ui.ListStyles'
  ],
  function (Tools, Settings, Actions, ListUtils, ListStyles) {
    var listState = function (editor, listName) {
      return function (e) {
        var ctrl = e.control;

        editor.on('NodeChange', function (e) {
          var lists = Tools.grep(e.parents, ListUtils.isListNode(editor));
          ctrl.active(lists.length > 0 && lists[0].nodeName === listName);
        });
      };
    };

    var updateSelection = function (editor) {
      return function (e) {
        var listStyleType = ListUtils.getSelectedStyleType(editor);
        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === listStyleType);
        });
      };
    };

    var addSplitButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        type: 'splitbutton',
        tooltip: tooltip,
        menu: ListStyles.toMenuItems(styles),
        onPostRender: listState(editor, nodeName),
        onshow: updateSelection(editor),
        onselect: function (e) {
          Actions.applyListFormat(editor, nodeName, e.control.settings.data);
        },
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };

    var addButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        type: 'button',
        tooltip: tooltip,
        onPostRender: listState(editor, nodeName),
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };

    var addControl = function (editor, id, tooltip, cmd, nodeName, styles) {
      if (styles.length > 0) {
        addSplitButton(editor, id, tooltip, cmd, nodeName, styles);
      } else {
        addButton(editor, id, tooltip, cmd, nodeName, styles);
      }
    };

    var register = function (editor) {
      addControl(editor, 'numlist', 'Numbered list', 'InsertOrderedList', 'OL', Settings.getNumberStyles(editor));
      addControl(editor, 'bullist', 'Bullet list', 'InsertUnorderedList', 'UL', Settings.getBulletStyles(editor));
    };

    return {
      register: register
    };
  }
);