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
  'tinymce.plugins.anchor.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.themes.modern.Theme',
    'tinymce.plugins.anchor.Plugin',
    'tinymce.plugins.code.Plugin'
  ],
  function (EditorManager, Theme, AnchorPlugin, CodePlugin) {
    Theme();
    AnchorPlugin();
    CodePlugin();

    return function () {
      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "anchor code",
        toolbar: "anchor code",
        height: 600
      });
    };
  }
);