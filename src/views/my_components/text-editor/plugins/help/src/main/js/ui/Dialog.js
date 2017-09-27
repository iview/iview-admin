/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.help.ui.Dialog',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.help.ui.KeyboardShortcutsTab',
    'tinymce.plugins.help.ui.PluginsTab',
    'tinymce.plugins.help.ui.ButtonsRow'
  ],
  function (EditorManager, KeyboardShortcutsTab, PluginsTab, ButtonsRow) {
    var open = function (editor, pluginUrl) {
      return function () {
        editor.windowManager.open({
          title: 'Help',
          bodyType: 'tabpanel',
          layout: 'flex',
          body: [
            KeyboardShortcutsTab.makeTab(),
            PluginsTab.makeTab(editor, pluginUrl)
          ],
          buttons: ButtonsRow.makeRow(),
          onPostRender: function () {
            var title = this.getEl('title');
            title.innerHTML = '<img src="' + pluginUrl + '/img/logo.png" alt="TinyMCE Logo" style="width: 200px">';
          }
        });
      };
    };

    return {
      open: open
    };
  });
