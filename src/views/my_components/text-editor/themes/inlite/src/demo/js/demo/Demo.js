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
  'tinymce.themes.inlite.demo.Demo',
  [
    'global!window',
    'tinymce.core.EditorManager',
    'tinymce.plugins.anchor.Plugin',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.plugins.contextmenu.Plugin',
    'tinymce.plugins.image.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.themes.inlite.Theme'
  ],
  function (
    window, EditorManager, AnchorPlugin, AutoLinkPlugin, ContextMenuPlugin, ImagePlugin,
    LinkPlugin, PastePlugin, TablePlugin, TextPatternPlugin, InliteTheme
  ) {
    AnchorPlugin();
    AutoLinkPlugin();
    ContextMenuPlugin();
    ImagePlugin();
    LinkPlugin();
    PastePlugin();
    TablePlugin();
    TextPatternPlugin();
    InliteTheme();

    EditorManager.init({
      selector: 'div.tinymce',
      theme: 'inlite',
      plugins: 'image table link anchor paste contextmenu textpattern autolink',
      skin_url: '../../../../../skins/lightgray/dist/lightgray',
      insert_toolbar: 'quickimage quicktable',
      selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
      inline: true,
      paste_data_images: true,
      filepicker_validator_handler: function (query, success) {
        var valid = /^https?:/.test(query.url);

        success({
          status: valid ? 'valid' : 'invalid',
          message: valid ? 'Url seems to be valid' : 'Are you use that this url is valid?'
        });
      },
      file_picker_callback: function () { }
    });

    window.tinymce = EditorManager;

    return function () { };
  }
);
