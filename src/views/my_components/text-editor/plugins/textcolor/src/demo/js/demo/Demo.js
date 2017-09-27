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
  'tinymce.plugins.textcolor.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.textcolor.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, TextColorPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      TextColorPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "textcolor code",
        toolbar: "forecolor backcolor code",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        height: 600
      });
    };
  }
);