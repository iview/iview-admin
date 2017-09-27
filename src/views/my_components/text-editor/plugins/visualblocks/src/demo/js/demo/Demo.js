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
  'tinymce.plugins.visualblocks.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.core.PluginManager',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.visualblocks.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, PluginManager, CodePlugin, VisualBlocksPlugin, ModernTheme) {
    return function () {
      CodePlugin();
      VisualBlocksPlugin();
      ModernTheme();

      PluginManager.urls.visualblocks = '../../../dist/visualblocks';

      EditorManager.init({
        selector: "textarea.tinymce",
        plugins: "visualblocks code",
        toolbar: "visualblocks code",
        visualblocks_default_state: true,
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        //end_container_on_empty_block: true,
        // Style formats
        style_formats: [
          { title: 'h1', block: 'h1' },
          { title: 'h2', block: 'h2' },
          { title: 'h3', block: 'h3' },
          { title: 'h4', block: 'h4' },
          { title: 'h5', block: 'h5' },
          { title: 'h6', block: 'h6' },
          { title: 'p', block: 'p' },
          { title: 'div', block: 'div' },
          { title: 'pre', block: 'pre' },
          { title: 'section', block: 'section', wrapper: true, merge_siblings: false },
          { title: 'article', block: 'article', wrapper: true, merge_siblings: false },
          { title: 'blockquote', block: 'blockquote', wrapper: true },
          { title: 'hgroup', block: 'hgroup', wrapper: true },
          { title: 'aside', block: 'aside', wrapper: true },
          { title: 'figure', block: 'figure', wrapper: true }
        ],
        height: 600
      });
    };
  }
);