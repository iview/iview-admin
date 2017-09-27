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
  'tinymce.plugins.spellchecker.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.spellchecker.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, SpellCheckerPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      SpellCheckerPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "spellchecker code",
        toolbar: "spellchecker code",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        height: 600
      });
    };
  }
);