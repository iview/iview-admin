asynctest(
  'browser.tinymce.plugins.table.TableRowDialogTest',
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

    var getFrontmostWindow = function (editor) {
      return editor.windowManager.windows[editor.windowManager.windows.length - 1];
    };

    var closeTopMostWindow = function (editor) {
      var win = getFrontmostWindow(editor);
      if (win) {
        getFrontmostWindow(editor).close();
      }
    };

    var fillAndSubmitWindowForm = function (editor, data) {
      var win = getFrontmostWindow(editor);

      win.fromJSON(data);
      win.find('form')[0].submit();
      win.close();
    };

    var cleanTableHtml = function (html) {
      return html.replace(/<p>(&nbsp;|<br[^>]+>)<\/p>$/, '');
    };

    suite.test("Table row properties dialog (get data from plain cell)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableRowProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "height": "",
        "type": "tbody",
        "backgroundColor": "",
        "borderColor": "",
        "style": ""
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table row properties dialog (get data from complex row)", function (editor) {
      editor.setContent(
        '<table><thead>' +
          '<tr style="height: 10px; text-align: right; border-color: red; background-color: blue"><td>X</td></tr>' +
        '</thead></table>'
      );
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableRowProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "right",
        "height": "10",
        "type": "thead",
        "backgroundColor": "blue",
        "borderColor": "red",
        "style": "height: 10px; text-align: right; border-color: red; background-color: blue;"
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table row properties dialog (update all)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableRowProps');

      fillAndSubmitWindowForm(editor, {
        "align": "right",
        "height": "10",
        "type": "thead"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><thead><tr style="height: 10px; text-align: right;"><td>X</td></tr></thead></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Caption should always stay the firstChild of the table (see TINY-1167)", function (editor) {
      editor.setContent('<table><caption>CAPTION</caption><tbody><tr><td>X</td></tr><tr><td>Y</td></tr></tbody></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableRowProps');

      fillAndSubmitWindowForm(editor, {
        "type": "thead"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><caption>CAPTION</caption><thead><tr><td>X</td></tr></thead><tbody><tr><td>Y</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table row properties dialog update multiple rows", function (editor) {
      editor.getBody().innerHTML = (
        '<table>' +
        '<tbody>' +
        '<tr style="height: 20px;">' +
        '<td data-mce-selected="1">a</td>' +
        '<td data-mce-selected="1">b</td>' +
        '</tr>' +
        '<tr style="height: 20px;">' +
        '<td data-mce-selected="1">c</td>' +
        '<td data-mce-selected="1">d</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
      );
      LegacyUnit.setSelection(editor, 'tr:nth-child(2) td:nth-child(2)', 0);
      editor.execCommand('mceTableRowProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "height": "",
        "type": "tbody",
        "backgroundColor": "",
        "borderColor": "",
        "style": ""
      }, 'Should not contain height');

      fillAndSubmitWindowForm(editor, {
        "align": "center"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        (
          '<table>' +
          '<tbody>' +
          '<tr style="height: 20px; text-align: center;">' +
          '<td>a</td>' +
          '<td>b</td>' +
          '</tr>' +
          '<tr style="height: 20px; text-align: center;">' +
          '<td>c</td>' +
          '<td>d</td>' +
          '</tr>' +
          '</tbody>' +
          '</table>'
        ),
        'Width should be retained height should be changed'
      );

      closeTopMostWindow(editor);
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
