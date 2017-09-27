asynctest(
  'browser.tinymce.plugins.table.DeleteCommandsTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    var cleanTableHtml = function (html) {
      return html.replace(/<p>(&nbsp;|<br[^>]+>)<\/p>$/, '');
    };

    suite.test("mceTableDelete command", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableDelete');
      LegacyUnit.equal(cleanTableHtml(editor.getContent()), '');
    });

    suite.test("mceTableDeleteCol command", function (editor) {
      editor.setContent('<table><tr><td>1</td><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableDeleteCol');
      LegacyUnit.equal(cleanTableHtml(editor.getContent()), '<table><tbody><tr><td>2</td></tr></tbody></table>');
    });

    suite.test("mceTableDeleteRow command", function (editor) {
      editor.setContent('<table><tr><td>1</td></tr><tr><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableDeleteRow');
      LegacyUnit.equal(cleanTableHtml(editor.getContent()), '<table><tbody><tr><td>2</td></tr></tbody></table>');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'table',
      indent: false,
      valid_styles: {
        '*': 'width,height,vertical-align,text-align,float,border-color,background-color,border,padding,border-spacing,border-collapse'
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
