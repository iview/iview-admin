/**
 * ClassicDemo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.themes.modern.demo.ClassicDemo',
  [
    'tinymce.core.EditorManager',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.anchor.Plugin',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.plugins.autoresize.Plugin',
    'tinymce.plugins.autosave.Plugin',
    'tinymce.plugins.bbcode.Plugin',
    'tinymce.plugins.charmap.Plugin',
    'tinymce.plugins.code.Plugin',
    'tinymce.plugins.codesample.Plugin',
    'tinymce.plugins.colorpicker.Plugin',
    'tinymce.plugins.contextmenu.Plugin',
    'tinymce.plugins.directionality.Plugin',
    'tinymce.plugins.emoticons.Plugin',
    'tinymce.plugins.fullpage.Plugin',
    'tinymce.plugins.fullscreen.Plugin',
    'tinymce.plugins.hr.Plugin',
    'tinymce.plugins.image.Plugin',
    'tinymce.plugins.imagetools.Plugin',
    'tinymce.plugins.importcss.Plugin',
    'tinymce.plugins.insertdatetime.Plugin',
    'tinymce.plugins.legacyoutput.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.lists.Plugin',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.nonbreaking.Plugin',
    'tinymce.plugins.noneditable.Plugin',
    'tinymce.plugins.pagebreak.Plugin',
    'tinymce.plugins.paste.Plugin',
    'tinymce.plugins.preview.Plugin',
    'tinymce.plugins.print.Plugin',
    'tinymce.plugins.save.Plugin',
    'tinymce.plugins.searchreplace.Plugin',
    'tinymce.plugins.spellchecker.Plugin',
    'tinymce.plugins.tabfocus.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.template.Plugin',
    'tinymce.plugins.textcolor.Plugin',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.plugins.toc.Plugin',
    'tinymce.plugins.visualblocks.Plugin',
    'tinymce.plugins.visualchars.Plugin',
    'tinymce.plugins.wordcount.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (
    EditorManager, Factory, Tools, AdvListPlugin, AnchorPlugin, AutoLinkPlugin, AutoResizePlugin, AutoSavePlugin, BbCodePlugin,
    CharMapPlugin, CodePlugin, CodeSamplePlugin, ColorPickerPlugin, ContextMenuPlugin, DirectionalityPlugin, EmoticonsPlugin,
    FullPagePlugin, FullScreenPlugin, HrPlugin, ImagePlugin, ImageToolsPlugin, ImportCssPlugin, InsertDatetimePlugin, LegacyOutputPlugin,
    LinkPlugin, ListsPlugin, MediaPlugin, NonBreakingPlugin, NonEditablePlugin, PageBreakPlugin, PastePlugin, PreviewPlugin, PrintPlugin,
    SavePlugin, SearchReplacePlugin, SpellCheckerPlugin, TabFocusPlugin, TablePlugin, TemplatePlugin, TextColorPlugin, TextPatternPlugin,
    TocPlugin, VisualBlocksPlugin, VisualCharsPlugin, WordCountPlugin, ModernTheme
  ) {
    AdvListPlugin();
    AnchorPlugin();
    AutoLinkPlugin();
    AutoResizePlugin();
    AutoSavePlugin();
    BbCodePlugin();
    CharMapPlugin();
    CodePlugin();
    CodeSamplePlugin();
    ColorPickerPlugin();
    ContextMenuPlugin();
    DirectionalityPlugin();
    EmoticonsPlugin();
    FullPagePlugin();
    FullScreenPlugin();
    HrPlugin();
    ImagePlugin();
    ImageToolsPlugin();
    ImportCssPlugin();
    InsertDatetimePlugin();
    LegacyOutputPlugin();
    LinkPlugin();
    ListsPlugin();
    MediaPlugin();
    NonBreakingPlugin();
    NonEditablePlugin();
    PageBreakPlugin();
    PastePlugin();
    PreviewPlugin();
    PrintPlugin();
    SavePlugin();
    SearchReplacePlugin();
    SpellCheckerPlugin();
    TabFocusPlugin();
    TablePlugin();
    TemplatePlugin();
    TextColorPlugin();
    TextPatternPlugin();
    TocPlugin();
    VisualBlocksPlugin();
    VisualCharsPlugin();
    WordCountPlugin();
    ModernTheme();

    EditorManager.init({
      selector: "textarea.tinymce",
      theme: "modern",
      plugins: [
        "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
        "save table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker codesample"
      ],
      skin_url: '../../../../../skins/lightgray/dist/lightgray',
      add_unload_trigger: false,
      autosave_ask_before_unload: false,

      toolbar1: "save newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright " +
        "alignjustify | styleselect formatselect fontselect fontsizeselect",
      toolbar2: "cut copy paste pastetext | searchreplace | bullist numlist | outdent indent blockquote | undo redo" +
        " | link unlink anchor image media help code | insertdatetime preview | forecolor backcolor",
      toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl" +
        " | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft | insertfile insertimage codesample",
      menubar: false,
      toolbar_items_size: 'small',

      style_formats: [
        { title: 'Bold text', inline: 'b' },
        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
        { title: 'Red header', block: 'h1', styles: { color: '#ff0000' } },
        { title: 'Example 1', inline: 'span', classes: 'example1' },
        { title: 'Example 2', inline: 'span', classes: 'example2' },
        { title: 'Table styles' },
        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
      ],

      templates: [
        { title: 'My template 1', description: 'Some fancy template 1', content: 'My html' },
        { title: 'My template 2', description: 'Some fancy template 2', url: 'development.html' }
      ],

      spellchecker_callback: function (method, data, success) {
        if (method === "spellcheck") {
          var words = data.match(this.getWordCharPattern());
          var suggestions = {};

          for (var i = 0; i < words.length; i++) {
            suggestions[words[i]] = ["First", "second"];
          }

          success({ words: suggestions, dictionary: true });
        }

        if (method === "addToDictionary") {
          success();
        }
      }
    });

    return function () {
    };
  }
);
