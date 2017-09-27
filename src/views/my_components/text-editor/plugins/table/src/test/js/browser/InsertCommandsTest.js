asynctest(
  'browser.tinymce.plugins.table.InsertCommandsTest',
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

    suite.test("mceTableInsertColAfter command", function (editor) {
      editor.setContent('<table><tr><td>1</td></tr><tr><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableInsertColAfter');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>1</td><td>&nbsp;</td></tr><tr><td>2</td><td>&nbsp;</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertColAfter command with two selected columns", function (editor) {
      editor.getBody().innerHTML = (
        '<table><tr><td data-mce-selected="1">1</td><td data-mce-selected="1">2</td>' +
        '<td>3</td></tr><tr><td>4</td><td>5</td><td>6</td></tr></table>'
      );
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableInsertColAfter');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>1</td><td>2</td><td>&nbsp;</td><td>&nbsp;</td><td>3</td></tr>' +
        '<tr><td>4</td><td>5</td><td>&nbsp;</td><td>&nbsp;</td><td>6</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertColBefore command", function (editor) {
      editor.setContent('<table><tr><td>1</td></tr><tr><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableInsertColBefore');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>&nbsp;</td><td>1</td></tr><tr><td>&nbsp;</td><td>2</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertColBefore command with two selected columns", function (editor) {
      editor.getBody().innerHTML = (
        '<table><tr><td>1</td><td data-mce-selected="1">2</td><td data-mce-selected="1">3</td>' +
        '</tr><tr><td>4</td><td>5</td><td>6</td></tr></table>'
      );
      LegacyUnit.setSelection(editor, 'td:nth-child(2)', 0);
      editor.execCommand('mceTableInsertColBefore');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>1</td><td>&nbsp;</td><td>&nbsp;</td><td>2</td><td>3</td>' +
        '</tr><tr><td>4</td><td>&nbsp;</td><td>&nbsp;</td><td>5</td><td>6</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertRowAfter command", function (editor) {
      editor.setContent('<table><tr><td>1</td><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableInsertRowAfter');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertRowAfter command with two selected rows", function (editor) {
      editor.getBody().innerHTML = (
        '<table><tr><td data-mce-selected="1">1</td><td>2</td></tr><tr><td data-mce-selected="1">3</td><td>4</td></tr></table>'
      );
      LegacyUnit.setSelection(editor, 'tr', 0);
      editor.execCommand('mceTableInsertRowAfter');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr><tr>' +
        '<td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertRowAfter command on merged cells", function (editor) {
      editor.setContent(
        '<table>' +
        '<tr><td>1</td><td>2</td><td>3</td></tr>' +
        '<tr><td>4</td><td colspan="2" rowspan="2">5</td></tr>' +
        '<tr><td>6</td></tr>' +
        '</table>'
      );

      LegacyUnit.setSelection(editor, 'tr:nth-child(2) td', 0);
      editor.execCommand('mceTableInsertRowAfter');

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),

        '<table>' +
        '<tbody>' +
        '<tr><td>1</td><td>2</td><td>3</td></tr>' +
        '<tr><td>4</td><td colspan="2" rowspan="3">5</td></tr>' +
        '<tr><td>&nbsp;</td></tr>' +
        '<tr><td>6</td></tr>' +
        '</tbody>' +
        '</table>'
      );
    });

    suite.test("mceTableInsertRowBefore command", function (editor) {
      editor.setContent('<table><tr><td>1</td><td>2</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableInsertRowBefore');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>1</td><td>2</td></tr></tbody></table>'
      );
    });

    suite.test("mceTableInsertRowBefore command with two selected rows", function (editor) {
      editor.getBody().innerHTML = (
        '<table><tr><td data-mce-selected="1">1</td><td>2</td></tr><tr><td data-mce-selected="1">3</td><td>4</td></tr></table>'
      );
      LegacyUnit.setSelection(editor, 'tr', 0);
      editor.execCommand('mceTableInsertRowBefore');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr>' +
        '<tr><td>1</td><td>2</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>'
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
