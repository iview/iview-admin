/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.api.Commands',
  [
    'tinymce.plugins.advlist.core.Actions'
  ],
  function (Actions) {
    var register = function (editor) {
      editor.addCommand('ApplyUnorderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'UL', value['list-style-type']);
      });

      editor.addCommand('ApplyOrderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'OL', value['list-style-type']);
      });
    };

    return {
      register: register
    };
  }
);

