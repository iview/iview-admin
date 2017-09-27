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
  'tinymce.themes.modern.demo.Demo',
  [
    'global!console',
    'global!document',
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
    console, document, EditorManager, Factory, Tools, AdvListPlugin, AnchorPlugin, AutoLinkPlugin, AutoResizePlugin, AutoSavePlugin, BbCodePlugin, CharMapPlugin,
    CodePlugin, CodeSamplePlugin, ColorPickerPlugin, ContextMenuPlugin, DirectionalityPlugin, EmoticonsPlugin, FullPagePlugin, FullScreenPlugin, HrPlugin, ImagePlugin,
    ImageToolsPlugin, ImportCssPlugin, InsertDatetimePlugin, LegacyOutputPlugin, LinkPlugin, ListsPlugin, MediaPlugin, NonBreakingPlugin, NonEditablePlugin,
    PageBreakPlugin, PastePlugin, PreviewPlugin, PrintPlugin, SavePlugin, SearchReplacePlugin, SpellCheckerPlugin, TabFocusPlugin, TablePlugin, TemplatePlugin,
    TextColorPlugin, TextPatternPlugin, TocPlugin, VisualBlocksPlugin, VisualCharsPlugin, WordCountPlugin, ModernTheme
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

    var config = {
      theme: "modern",
      plugins: [
        "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker toc",
        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
        "save table contextmenu directionality emoticons template paste textcolor importcss colorpicker textpattern codesample"
      ],
      /*
      menubar: 'file edit insert view format table tools',
      menu: {
        file: { title: 'File', items: 'newdocument' },
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
        insert: { title: 'Insert', items: 'link media | template hr' },
        view: { title: 'View', items: 'visualaid' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
        table: { title: 'Table', items: 'inserttable tableprops deletetable | cell row column' },
        tools: { title: 'Tools', items: 'spellchecker code' }
      },
      removed_menuitems: 'undo',
      */
      //resize: 'both',
      //statusbar: false,
      //menubar: false,
      add_unload_trigger: false,
      toolbar: "insertfile undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons table codesample",

      setup: function (ed) {
        ed.addSidebar('sidebar1', {
          tooltip: 'My side bar 1',
          icon: 'bold',
          onrender: function (api) {
            var rect = api.element().getBoundingClientRect();
            var panel = Factory.create({
              layout: 'flex',
              direction: 'column',
              pack: 'center',
              align: 'center',
              minWidth: rect.width,
              minHeight: rect.height,
              type: 'panel',
              items: [
                { type: 'button', text: 'Hello world!' }, { type: 'button', text: 'Hello world!' }
              ]
            });
            panel.renderTo(api.element()).reflow();
            console.log('Render panel 1');
          },
          onshow: function (api) {
            console.log('Show panel 1', api.element());
          },
          onhide: function (api) {
            console.log('Hide panel 1', api.element());
          }
        });

        ed.addSidebar('sidebar2', {
          tooltip: 'My side bar 2',
          icon: 'italic',
          onrender: function (api) {
            console.log('Render panel 2', api.element());
          },
          onshow: function (api) {
            console.log('Show panel 2', api.element());
            api.element().innerHTML = document.body.innerText;
          },
          onhide: function (api) {
            console.log('Hide panel 2', api.element());
          }
        });
      }
    };

    EditorManager.init(
      Tools.extend({}, config, {
        selector: 'textarea.tinymce',
        skin_url: '../../../../../skins/lightgray/dist/lightgray',
        codesample_content_css: '../../../../../plugins/codesample/dist/codesample/css/prism.css'
      })
    );

    EditorManager.init(
      Tools.extend({}, config, {
        selector: 'div.tinymce',
        inline: true,
        skin_url: '../../../../../skins/lightgray/dist/lightgray',
        codesample_content_css: '../../../../../plugins/codesample/dist/codesample/css/prism.css'
      })
    );

    return function () {
    };
  }
);
