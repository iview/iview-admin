asynctest(
  'browser.tinymce.plugins.table.TableDialogTest',
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


    suite.test("Table properties dialog (get data from plain table)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "border": "",
        "caption": false,
        "cellpadding": "",
        "cellspacing": "",
        "height": "",
        "width": "",
        "backgroundColor": "",
        "borderColor": "",
        "style": ""
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (get/set data from/to plain table, no adv tab)", function (editor) {
      editor.settings.table_advtab = false;

      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "border": "",
        "caption": false,
        "cellpadding": "",
        "cellspacing": "",
        "height": "",
        "width": ""
      });

      fillAndSubmitWindowForm(editor, {
        width: "100",
        height: "101"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style="width: 100px; height: 101px;"><tbody><tr><td>X</td></tr></tbody></table>'
      );

      delete editor.settings.table_advtab;
      closeTopMostWindow(editor);
    });

    suite.test("Table cell properties dialog (get/set data from/to plain table, no adv tab)", function (editor) {
      editor.settings.table_cell_advtab = false;

      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableCellProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "width": "",
        "height": "",
        "type": "td",
        "scope": "",
        "align": "",
        "valign": ""
      });

      fillAndSubmitWindowForm(editor, {
        width: "100",
        height: "101"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td style="width: 100px; height: 101px;">X</td></tr></tbody></table>'
      );

      delete editor.settings.table_cell_advtab;
      closeTopMostWindow(editor);
    });

    suite.test("Table row properties dialog (get/set data from/to plain table, no adv tab)", function (editor) {
      editor.settings.table_row_advtab = false;

      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableRowProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "type": "tbody",
        "align": "",
        "height": ""
      });

      fillAndSubmitWindowForm(editor, {
        width: "100",
        height: "101"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr style="height: 101px;"><td>X</td></tr></tbody></table>'
      );

      delete editor.settings.table_row_advtab;
      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (get/set data from/to plain table, class list)", function (editor) {
      editor.settings.table_class_list = [{ title: 'Class1', value: 'class1' }];

      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "border": "",
        "caption": false,
        "cellpadding": "",
        "cellspacing": "",
        "height": "",
        "width": "",
        "backgroundColor": "",
        "borderColor": "",
        "style": "",
        "class": ""
      });

      fillAndSubmitWindowForm(editor, {
        width: "100",
        height: "101"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style="width: 100px; height: 101px;"><tbody><tr><td>X</td></tr></tbody></table>'
      );

      delete editor.settings.table_class_list;
      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (get data from full table)", function (editor) {
      editor.setContent(
        '<table style="width: 100px; height: 101px;" border="4" cellspacing="2" cellpadding="3">' +
        '<caption>&nbsp;</caption>' +
        '<tbody>' +
        '<tr>' +
        '<td>&nbsp;</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>'
      );

      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');

      LegacyUnit.deepEqual(getFrontmostWindow(editor).toJSON(), {
        "align": "",
        "border": "4",
        "caption": true,
        "cellpadding": "3",
        "cellspacing": "2",
        "height": "101",
        "width": "100",
        "backgroundColor": "",
        "borderColor": "",
        "style": "width: 100px; height: 101px;"
      });

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (add caption)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        caption: true
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><caption>&nbsp;</caption><tbody><tr><td>X</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (remove caption)", function (editor) {
      editor.setContent('<table><caption>&nbsp;</caption><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        caption: false
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>X</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (change size in pixels)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        width: 100,
        height: 101
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style="width: 100px; height: 101px;"><tbody><tr><td>X</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (change size in %)", function (editor) {
      editor.setContent('<table><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        width: "100%",
        height: "101%"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style="width: 100%; height: 101%;"><tbody><tr><td>X</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog (change: border,cellpadding,cellspacing,align,backgroundColor,borderColor)", function (editor) {
      editor.setContent('<table style="border-color: red; background-color: blue"><tr><td>X</td></tr></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        border: "1",
        cellpadding: "2",
        cellspacing: "3",
        align: "right"
      });

      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style="float: right; border-color: red; background-color: blue;" border="1" cellspacing="3" cellpadding="2">' +
        '<tbody><tr><td>X</td></tr></tbody></table>'
      );

      closeTopMostWindow(editor);
    });

    suite.test("Table properties dialog css border", function (editor) {
      editor.settings.table_style_by_css = true;

      editor.setContent('<table><tr><td>X</td><td>Z</td></tr></table>');

      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableProps');
      fillAndSubmitWindowForm(editor, {
        border: "1px solid green"
      });
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table style=\"border: 1px solid green;\"><tbody><tr><td style=\"border: 1px solid green;\">X</td>' +
        '<td style=\"border: 1px solid green;\">Z</td></tr></tbody></table>'
      );

      delete editor.settings.table_style_by_css;
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
