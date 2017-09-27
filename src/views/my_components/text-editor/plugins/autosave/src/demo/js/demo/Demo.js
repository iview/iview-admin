/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.plugins.autosave.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.autosave.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, AutoSavePlugin, CodePlugin, ModernTheme) {
    return function () {
      AutoSavePlugin();
      CodePlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "autosave code",
        toolbar: "restoredraft code",
        height: 600
      });
    };
  }
);