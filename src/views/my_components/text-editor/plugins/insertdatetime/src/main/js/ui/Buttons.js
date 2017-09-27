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
  'tinymce.plugins.insertdatetime.ui.Buttons',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.insertdatetime.api.Settings',
    'tinymce.plugins.insertdatetime.core.Actions'
  ],
  function (Tools, Settings, Actions) {
    var createMenuItems = function (editor, lastFormatState) {
      var formats = Settings.getFormats(editor);

      return Tools.map(formats, function (fmt) {
        return {
          text: Actions.getDateTime(editor, fmt),
          onclick: function () {
            lastFormatState.set(fmt);
            Actions.insertDateTime(editor, fmt);
          }
        };
      });
    };

    var register = function (editor, lastFormatState) {
      var menuItems = createMenuItems(editor, lastFormatState);

      editor.addButton('insertdatetime', {
        type: 'splitbutton',
        title: 'Insert date/time',
        menu: menuItems,
        onclick: function () {
          var lastFormat = lastFormatState.get();
          Actions.insertDateTime(editor, lastFormat ? lastFormat : Settings.getDefaultDateTime(editor));
        }
      });

      editor.addMenuItem('insertdatetime', {
        icon: 'date',
        text: 'Date/time',
        menu: menuItems,
        context: 'insert'
      });
    };

    return {
      register: register
    };
  }
);
