asynctest(
  'browser.tinymce.plugins.legacyoutput.LegacyOutputPluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.legacyoutput.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test("Font color", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('forecolor', false, '#FF0000');
      LegacyUnit.equal(editor.getContent().toLowerCase(), '<p><font color="#ff0000">text</font></p>');
    });

    suite.test("Font size", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('fontsize', false, 7);
      LegacyUnit.equal(editor.getContent(), '<p><font size="7">text</font></p>');
    });

    suite.test("Font face", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('fontname', false, "times");
      LegacyUnit.equal(editor.getContent(), '<p><font face="times">text</font></p>');
    });

    suite.test("Bold", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('bold');
      LegacyUnit.equal(editor.getContent(), '<p><b>text</b></p>');
    });

    suite.test("Italic", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('italic');
      LegacyUnit.equal(editor.getContent(), '<p><i>text</i></p>');
    });

    suite.test("Underline", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('underline');
      LegacyUnit.equal(editor.getContent(), '<p><u>text</u></p>');
    });

    suite.test("Strikethrough", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('strikethrough');
      LegacyUnit.equal(editor.getContent(), '<p><strike>text</strike></p>');
    });

    suite.test("Justifyleft", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('justifyleft');
      LegacyUnit.equal(editor.getContent(), '<p align="left">text</p>');
    });

    suite.test("Justifycenter", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('justifycenter');
      LegacyUnit.equal(editor.getContent(), '<p align="center">text</p>');
    });

    suite.test("Justifyright", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('justifyright');
      LegacyUnit.equal(editor.getContent(), '<p align="right">text</p>');
    });

    suite.test("Justifyfull", function (editor) {
      editor.setContent('<p>text</p>');
      LegacyUnit.setSelection(editor, 'p', 0, 'p', 4);
      editor.execCommand('justifyfull');
      LegacyUnit.equal(editor.getContent(), '<p align="justify">text</p>');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'legacyoutput',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
