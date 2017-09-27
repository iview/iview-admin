/**
 * Demo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.plugins.link.demo.Demo',

  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (EditorManager, CodePlugin, LinkPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      LinkPlugin();
      ModernTheme();

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "link code",
        toolbar: "link code",
        height: 600
      });
    };
  }
);