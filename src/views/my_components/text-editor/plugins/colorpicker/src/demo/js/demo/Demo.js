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
  'tinymce.plugins.colorpicker.demo.Demo',
  [
    'global!document',
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.colorpicker.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (document, EditorManager, CodePlugin, ColorPickerPlugin, TablePlugin, ModernTheme) {
    return function () {
      CodePlugin();
      ColorPickerPlugin();
      TablePlugin();
      ModernTheme();

      document.querySelector('.tinymce').value = '<table><tbody><tr><td>One</td></tr></tbody></table>';

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "table colorpicker code",
        toolbar: "table code",
        height: 600
      });
    };
  }
);