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
  'tinymce.plugins.autoresize.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.autoresize.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, AutoResizePlugin, CodePlugin, ModernTheme) {
    AutoResizePlugin();
    CodePlugin();
    ModernTheme();

    return function () {
      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "autoresize code",
        toolbar: "autoresize code",
        height: 600
      });
    };
  }
);