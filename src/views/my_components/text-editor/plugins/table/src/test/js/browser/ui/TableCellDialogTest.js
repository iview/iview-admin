asynctest(
  'browser.tinymce.plugins.table.TableCellDialogTest',
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

    suite.test("Table cell properties dialog (get data from plain cell)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableCellProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "valign": "",
        "height": "",
        "scope": "",
        "type": "td",
        "width": "",
        "backgroundColor": "",
        "borderColor": "",
        "style": ""
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table cell properties dialog (get/set data from/to plain cell, no adv tab)", function (editor) {
      editor.settings.table_cell_advtab = false;

      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableCellProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "valign": "",
        "height": "",
        "scope": "",
        "type": "td",
        "width": ""
      });

      fillAndSubmitWindowForm(editor, {
        width: 100,
        height: 101
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td style="width: 100px; height: 101px;">X</td></tr></tbody></table>'
      );

      delete editor.settings.table_cell_advtab;
      closeTopMostWindow(editor);
    });

    suite.test("Table cell properties dialog (get data from complex cell)", function (editor) {
      editor.setContent(
        '<table><tr><th style="text-align: right; vertical-align: top; width: 10px; height: 11px; ' +
        'border-color: red; background-color: blue" scope="row">X</th></tr></table>'
      );
      LegacyUnit.setSelection(editor, 'th', 0);
      editor.execCommand('mceTableCellProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "right",
        "valign": "top",
        "height": "11",
        "scope": "row",
        "type": "th",
        "width": "10",
        "backgroundColor": "blue",
        "borderColor": "red",
        "style": "width: 10px; height: 11px; vertical-align: top; text-align: right; border-color: red; background-color: blue;"
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table cell properties dialog (update all)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableCellProps');

      fillAndSubmitWindowForm(editor, {
        "align": "right",
        "height": "11",
        "scope": "row",
        "type": "th",
        "width": "10"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><th style="width: 10px; height: 11px; text-align: right;" scope="row">X</th></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table cell properties dialog update multiple cells", function (editor) {
      editor.getBody().innerHTML = (
        '<table>' +
        '<tbody>' +
        '<tr>' +
        '<td style="width: 10px;" data-mce-selected="1">a</td>' +
        '<td style="width: 20px;" data-mce-selected="1">b</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
      );
      LegacyUnit.setSelection(editor, 'td:nth-child(2)', 0);
      editor.execCommand('mceTableCellProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "valign": "",
        "height": "",
        "scope": "",
        "type": "td",
        "width": "",
        "backgroundColor": "",
        "borderColor": "",
        "style": ""
      }, 'Should not contain width');

      fillAndSubmitWindowForm(editor, {
        "height": "20"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        (
          '<table>' +
          '<tbody>' +
          '<tr>' +
          '<td style="width: 10px; height: 20px;">a</td>' +
          '<td style="width: 20px; height: 20px;">b</td>' +
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
