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
  'tinymce.plugins.help.demo.Demo',
  [
    'tinymce.core.EditorManager',
    'tinymce.core.PluginManager',
    'tinymce.plugins.help.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.emoticons.Plugin',
    'tinymce.plugins.fullpage.Plugin',
    'tinymce.plugins.print.Plugin',
    'tinymce.plugins.fullscreen.Plugin',
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.anchor.Plugin',
    'tinymce.plugins.bbcode.Plugin',
    'tinymce.plugins.colorpicker.Plugin',
    'tinymce.plugins.textcolor.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (EditorManager, PluginManager, HelpPlugin, LinkPlugin, TablePlugin, PastePlugin, CodePlugin, EmoticonsPlugin, FullpagePlugin, PrintPlugin, FullscreenPlugin, AdvListPlugin, AnchorPlugin, BBcodePlugin, ColorpickerPlugin, TextcolorPlugin, ModernTheme) {
    return function () {
      HelpPlugin();
      ModernTheme();
      LinkPlugin();
      TablePlugin();
      PastePlugin();
      CodePlugin();
      EmoticonsPlugin();
      FullpagePlugin();
      PrintPlugin();
      FullscreenPlugin();
      AdvListPlugin();
      AnchorPlugin();
      BBcodePlugin();
      ColorpickerPlugin();
      TextcolorPlugin();


      PluginManager.urls.help = '../../../dist/help';

      EditorManager.init({
        selector: "textarea.tinymce",
        theme: "modern",
        skin_url: "../../../../../skins/lightgray/dist/lightgray",
        plugins: "help link table paste code emoticons fullpage print fullscreen advlist anchor bbcode colorpicker textcolor",
        toolbar: "help",
        height: 600
      });
    };
  }
);