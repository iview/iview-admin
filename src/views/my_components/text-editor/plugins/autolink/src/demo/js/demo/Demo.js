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
  'tinymce.plugins.autolink.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, AutoLinkPlugin, CodePlugin, Theme) {
    AutoLinkPlugin();
    CodePlugin();
    Theme();

    return function () {
      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "autolink code",
        toolbar: "autolink code",
        height: 600
      });
    };
  }
);