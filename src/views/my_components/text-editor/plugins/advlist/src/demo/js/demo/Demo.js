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
  'tinymce.plugins.advlist.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, AdvListPlugin, ListsPlugin, CodePlugin, ModernTheme) {
    AdvListPlugin();
    ListsPlugin();
    CodePlugin();
    ModernTheme();

    return function () {
      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "lists advlist code",
        toolbar: "bullist numlist | outdent indent | code",
        height: 600
      });
    };
  }
);