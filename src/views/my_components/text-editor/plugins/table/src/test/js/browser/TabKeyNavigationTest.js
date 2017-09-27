asynctest(
  'browser.tinymce.plugins.table.TabKeyNavigationTest',
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

    suite.test("Tab key navigation", function (editor) {
      editor.setContent('<table><tbody><tr><td>A1</td><td>A2</td></tr><tr><td>B1</td><td>B2</td></tr></tbody></table><p>x</p>');

      LegacyUnit.setSelection(editor, 'td', 0);
      editor.fire('keydown', { keyCode: 9 });
      LegacyUnit.equal(editor.selection.getStart().innerHTML, 'A2');

      LegacyUnit.setSelection(editor, 'td', 0);
      editor.fire('keydown', { keyCode: 9, shiftKey: true });
      LegacyUnit.equal(editor.selection.getStart().innerHTML, 'A1');

      LegacyUnit.setSelection(editor, 'td:nth-child(2)', 0);
      editor.fire('keydown', { keyCode: 9, shiftKey: true });
      LegacyUnit.equal(editor.selection.getStart().innerHTML, 'A1');

      LegacyUnit.setSelection(editor, 'tr:nth-child(2) td:nth-child(2)', 0);
      editor.fire('keydown', { keyCode: 9 });
      LegacyUnit.equal(editor.selection.getStart(true).nodeName, 'TD');
      LegacyUnit.equal(
        editor.getContent(),
        '<table><tbody><tr><td>A1</td><td>A2</td></tr><tr><td>B1</td><td>B2' +
        '</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p>x</p>'
      );
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
