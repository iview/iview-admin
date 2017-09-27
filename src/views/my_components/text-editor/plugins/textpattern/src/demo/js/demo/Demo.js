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
  'tinymce.plugins.textpattern.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, TextPatternPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      TextPatternPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "textpattern code",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        toolbar: "code",
        height: 600
      });
    };
  }
);