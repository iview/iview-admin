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
  'tinymce.plugins.importcss.demo.Demo',
  [
    'global!document',
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.importcss.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (document, EditorManager, CodePlugin, ImportCssPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      ImportCssPlugin();
      ModernTheme();

      document.querySelector('.tinymce').value = 'The format menu should show "red"';

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "importcss code",
        toolbar: "styleselect code",
        height: 600,
        content_css: '../css/rules.css'
      });
    };
  }
);