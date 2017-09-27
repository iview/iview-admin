/**
 * Statusbar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.ui.Statusbar',
  [
    'tinymce.core.util.Delay',
    'tinymce.plugins.wordcount.text.WordCount'
  ],
  function (Delay, WordCount) {
    var setup = function (editor) {
      var update = function () {
        editor.theme.panel.find('#wordcount').text(['Words: {0}', WordCount.getCount(editor)]);
      };

      editor.on('init', function () {
        var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];
        var debouncedUpdate = Delay.debounce(update, 300);

        if (statusbar) {
          Delay.setEditorTimeout(editor, function () {
            statusbar.insert({
              type: 'label',
              name: 'wordcount',
              text: ['Words: {0}', WordCount.getCount(editor)],
              classes: 'wordcount',
              disabled: editor.settings.readonly
            }, 0);

            editor.on('setcontent beforeaddundo undo redo keyup', debouncedUpdate);
          }, 0);
        }
      });
    };

    return {
      setup: setup
    };
  }
);
