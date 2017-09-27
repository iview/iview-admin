/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0, no-unused-vars: 0 */

define(
  'tinymce.plugins.bbcode.demo.Demo',
  [
    'global!document',
    'tinymce.core.EditorManager',
    'tinymce.plugins.bbcode.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (document, EditorManager, BbCodePlugin, CodePlugin, ModernTheme) {
    BbCodePlugin();
    CodePlugin();
    ModernTheme();

    return function () {
      document.querySelector('.tinymce').value = '[b]bbcode plugin[/b]';

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "bbcode code",
        toolbar: "bbcode code",
        height: 600
      });
    };
  }
);