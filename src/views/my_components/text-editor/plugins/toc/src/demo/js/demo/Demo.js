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
  'tinymce.plugins.toc.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.toc.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, CodePlugin, TocPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      TocPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "toc code",
        toolbar: "toc code formatselect",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        height: 600
      });
    };
  }
);