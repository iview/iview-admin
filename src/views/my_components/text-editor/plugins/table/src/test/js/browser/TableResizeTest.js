asynctest(
  'browser.tinymce.plugins.table.TableResizeTest',
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

    var getWidth = function (table) {
      return table.offsetWidth;
    };

    var testResizeTable1 = '<table style="width: 426px" class="mce-item-table"><tbody>' +
      '<tr><td style="height: 20px; width: 200px;" colspan="2" data-mce-style="height: 20px; width: 200px;">' +
      'A1</td><td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">A2</td>' +
      '<td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">A3</td></tr>' +
      '<tr><td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">B1</td>' +
      '<td style="height: 20px; width: 200px;" colspan="2" data-mce-style="height: 20px; width: 200px;">B2</td>' +
      '<td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">B3</td></tr>' +
      '<tr><td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">C1</td>' +
      '<td style="height: 20px; width: 100px;" data-mce-style="height: 20px; width: 100px;">C2</td>' +
      '<td style="height: 20px; width: 200px;" colspan="2" data-mce-style="height: 20px; width: 200px;">C3</td></tr>' +
      '<tr><td style="height: 20px; width: 400px;" colspan="4" data-mce-style="height: 20px; width: 400px;">D1</td></tr></tbody></table>';

    var testResizeTable2 = '<table border="1"><tbody>' +
      '<tr><th style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">A0</th>' +
      '<th style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">A1</th>' +
      '<th style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">A2</th>' +
      '<th style="height: 20px; width: 40px;" data-mce-style="height: 20px; width: 40px;">A3</th>' +
      '<th style="height: 20px; width: 10px;" data-mce-style="height: 20px; width: 10px;">A4</th>' +
      '</tr><tr><td style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">B0</td>' +
      '<td style="height: 20px; width: 20px; "' +
      'data-mce-style="height: 20px; width: 20px;">B1</td>' +
      '<td style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">B2</td>' +
      '<td style="height: 20px; width: 40px;" data-mce-style="height: 20px; width: 40px;">B3</td>' +
      '<td style="height: 40px; width: 10px;" rowspan="2" data-mce-style="height: 20px; width: 10px;">' +
      'B3</td></tr><tr><td style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">C0</td>' +
      '<td style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">C1</td>' +
      '<td style="height: 20px; width: 20px;" data-mce-style="height: 20px; width: 20px;">C2</td>' +
      '<td style="height: 20px; width: 40px;" ' +
      'data-mce-style="height: 20px; width: 40px;">C3</td></tr></tbody></table>';

    var testResizeTable3 = '<div style=\"display: block; width: 400px;\">' +
      '<table style=\"border-collapse: collapse; border: 1px solid black;\" width=\"100%\" ' +
      'cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td rowspan=\"2\" width=\"25%\">&nbsp;a</td>' +
      '<td width=\"25%\">&nbsp;b</td><td width=\"25%\">&nbsp;</td>' +
      '<td width=\"25%\">&nbsp;c</td></tr><tr><td width=\"25%\">&nbsp;d</td>' +
      '<td width=\"25%\">&nbsp;</td><td rowspan=\"2\" width=\"25%\">&nbsp;e</td>' +
      '</tr><tr><td width=\"25%\">&nbsp;f</td><td width=\"25%\">&nbsp;g</td><td width=\"25%\">&nbsp;</td>' +
      '</tr><tr><td width=\"25%\">&nbsp;h</td><td width=\"25%\">&nbsp;i</td><td width=\"25%\">&nbsp;</td>' +
      '<td width=\"25%\">j&nbsp;</td></tr></tbody></table></div>';

    var testResizeTable4 = (
      '<table>' +
      '<tbody>' +
      '<tr>' +
      '<td>a</td>' +
      '<td>b</td>' +
      '</tr>' +
      '<tr>' +
      '<td>a</td>' +
      '<td>b</td>' +
      '<td>c</td>' +
      '</tr>' +
      '<tr>' +
      '<td>a</td>' +
      '</tr>' +
      '<tr>' +
      '<td>a</td>' +
      '<td>b</td>' +
      '<td colspan="2">c</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>'
    );

    suite.test("Is Pixel/Percentage Based Width", function (editor) {
      var pixelWidths = ['125px', '200px', '300em'];
      var percentageWidths = ['25%', '30%', '100%'];
      var i, pixelBasedSize, percentBasedSize;

      for (i = 0; i < pixelWidths.length; i++) {
        pixelBasedSize = editor.plugins.table.resizeBars.isPixelBasedSize(pixelWidths[i]);
        LegacyUnit.deepEqual(pixelBasedSize, true);
        percentBasedSize = editor.plugins.table.resizeBars.isPercentageBasedSize(pixelWidths[i]);
        LegacyUnit.deepEqual(percentBasedSize, false);
      }
      for (i = 0; i < percentageWidths.length; i++) {
        pixelBasedSize = editor.plugins.table.resizeBars.isPixelBasedSize(percentageWidths[i]);
        LegacyUnit.deepEqual(pixelBasedSize, false);
        percentBasedSize = editor.plugins.table.resizeBars.isPercentageBasedSize(percentageWidths[i]);
        LegacyUnit.deepEqual(percentBasedSize, true);
      }
    });

    suite.test("Get widths/heights", function (editor) {
      editor.setContent(testResizeTable1);

      var table = editor.dom.select('table')[0];
      var details = editor.plugins.table.resizeBars.getTableDetails(table);
      var tableGrid = editor.plugins.table.resizeBars.getTableGrid(details);

      LegacyUnit.deepEqual(
        editor.plugins.table.resizeBars.getWidths(tableGrid, false, table),
        [100, 100, 100, 100]
      );

      LegacyUnit.deepEqual(
        editor.plugins.table.resizeBars.getPixelHeights(tableGrid),
        [20, 20, 20, 20]
      );

      editor.setContent(testResizeTable2);

      table = editor.dom.select('table')[0];
      details = editor.plugins.table.resizeBars.getTableDetails(table);
      tableGrid = editor.plugins.table.resizeBars.getTableGrid(details);

      LegacyUnit.deepEqual(
        editor.plugins.table.resizeBars.getWidths(tableGrid, false, table),
        [20, 20, 20, 40, 10]
      );

      LegacyUnit.deepEqual(
        editor.plugins.table.resizeBars.getPixelHeights(tableGrid),
        [20, 20, 20]
      );

      editor.setContent(testResizeTable3);

      table = editor.dom.select('table')[0];
      details = editor.plugins.table.resizeBars.getTableDetails(table);
      tableGrid = editor.plugins.table.resizeBars.getTableGrid(details);

      LegacyUnit.deepEqual(
        editor.plugins.table.resizeBars.getWidths(tableGrid, true, table),
        [25, 25, 25, 25]
      );
    });

    suite.test("Draw bars/clear bars", function (editor) {
      editor.setContent(testResizeTable1);

      var table = editor.dom.select('table')[0];

      editor.plugins.table.resizeBars.drawBars(table);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-row').length,
        4);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-col').length,
        4);

      editor.plugins.table.resizeBars.clearBars();

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-row').length,
        0);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-col').length,
        0);
    });

    suite.test("Draw bars/clear bars on invalid table", function (editor) {
      editor.setContent(testResizeTable4);

      var table = editor.dom.select('table')[0];

      editor.plugins.table.resizeBars.drawBars(table);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-row').length,
        4);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-col').length,
        4);

      editor.plugins.table.resizeBars.clearBars();

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-row').length,
        0);

      LegacyUnit.equal(editor.dom.select('.mce-resize-bar-col').length,
        0);
    });

    suite.test("Determine deltas", function (editor) {
      var deltas = editor.plugins.table.resizeBars.determineDeltas([100, 100, 100, 100], 0, 50, 10, false);

      LegacyUnit.deepEqual(deltas, [50, -50, 0, 0]);

      deltas = editor.plugins.table.resizeBars.determineDeltas([100, 100, 100, 100], 1, 50, 10, false);

      LegacyUnit.deepEqual(deltas, [0, 50, -50, 0]);

      deltas = editor.plugins.table.resizeBars.determineDeltas([100, 100, 100, 100], 2, 50, 10, false);

      LegacyUnit.deepEqual(deltas, [0, 0, 50, -50]);

      deltas = editor.plugins.table.resizeBars.determineDeltas([100, 100, 100, 100], 3, 50, 10, false);

      LegacyUnit.deepEqual(deltas, [0, 0, 0, 50]);

      deltas = editor.plugins.table.resizeBars.determineDeltas([50], 0, 5, 10, true);

      LegacyUnit.deepEqual(deltas, [50]); // 50 + 50 = 100, one column, percent case

      deltas = editor.plugins.table.resizeBars.determineDeltas([25, 25, 25, 25], 1, 5, 10, true);

      LegacyUnit.deepEqual(deltas, [0, 5, -5, 0]);
    });

    suite.test("Adjust width", function (editor) {
      editor.setContent(testResizeTable1);

      var table = editor.dom.select('table')[0];
      var beforeWidth1 = getWidth(table);

      editor.plugins.table.resizeBars.adjustWidth(table, 50, 0);

      LegacyUnit.equal(editor.getContent(),
        '<table style=\"width: ' + beforeWidth1 + 'px;\">' +
        '<tbody>' +
        '<tr>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">A1</td>' +
        '<td style=\"width: 100px; height: 20px;\">A2</td>' +
        '<td style=\"width: 100px; height: 20px;\">A3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 150px; height: 20px;\">B1</td>' +
        '<td style=\"width: 150px; height: 20px;\" colspan=\"2\">B2</td>' +
        '<td style=\"width: 100px; height: 20px;\">B3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 150px; height: 20px;\">C1</td>' +
        '<td style=\"width: 50px; height: 20px;\">C2</td>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">C3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 400px; height: 20px;\" colspan=\"4\">D1</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

      editor.setContent(testResizeTable1);

      table = editor.dom.select('table')[0];
      var beforeWidth2 = getWidth(table);

      editor.plugins.table.resizeBars.adjustWidth(table, 50, 1);

      LegacyUnit.equal(editor.getContent(),
        '<table style=\"width: ' + beforeWidth2 + 'px;\">' +
        '<tbody>' +
        '<tr>' +
        '<td style=\"width: 250px; height: 20px;\" colspan=\"2\">A1</td>' +
        '<td style=\"width: 50px; height: 20px;\">A2</td>' +
        '<td style=\"width: 100px; height: 20px;\">A3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">B1</td>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">B2</td>' +
        '<td style=\"width: 100px; height: 20px;\">B3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">C1</td>' +
        '<td style=\"width: 150px; height: 20px;\">C2</td>' +
        '<td style=\"width: 150px; height: 20px;\" colspan=\"2\">C3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 400px; height: 20px;\" colspan=\"4\">D1</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

      editor.setContent(testResizeTable1);

      table = editor.dom.select('table')[0];
      var beforeWidth3 = getWidth(table);

      editor.plugins.table.resizeBars.adjustWidth(table, 50, 2);

      LegacyUnit.equal(editor.getContent(),
        '<table style=\"width: ' + beforeWidth3 + 'px;\">' +
        '<tbody>' +
        '<tr>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">A1</td>' +
        '<td style=\"width: 150px; height: 20px;\">A2</td>' +
        '<td style=\"width: 50px; height: 20px;\">A3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">B1</td>' +
        '<td style=\"width: 250px; height: 20px;\" colspan=\"2\">B2</td>' +
        '<td style=\"width: 50px; height: 20px;\">B3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">C1</td>' +
        '<td style=\"width: 100px; height: 20px;\">C2</td>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">C3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 400px; height: 20px;\" colspan=\"4\">D1</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

      editor.setContent(testResizeTable1);

      table = editor.dom.select('table')[0];
      var beforeWidth4 = getWidth(table);

      editor.plugins.table.resizeBars.adjustWidth(table, 50, 3);

      LegacyUnit.equal(editor.getContent(),
        '<table style=\"width: ' + (beforeWidth4 + 50) + 'px;\">' +
        '<tbody>' +
        '<tr>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">A1</td>' +
        '<td style=\"width: 100px; height: 20px;\">A2</td>' +
        '<td style=\"width: 150px; height: 20px;\">A3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">B1</td>' +
        '<td style=\"width: 200px; height: 20px;\" colspan=\"2\">B2</td>' +
        '<td style=\"width: 150px; height: 20px;\">B3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 100px; height: 20px;\">C1</td>' +
        '<td style=\"width: 100px; height: 20px;\">C2</td>' +
        '<td style=\"width: 250px; height: 20px;\" colspan=\"2\">C3</td>' +
        '</tr>' +
        '<tr>' +
        '<td style=\"width: 450px; height: 20px;\" colspan=\"4\">D1</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');
    });

    suite.test("Adjust height", function (editor) {
      editor.setContent(testResizeTable2);

      var table = editor.dom.select('table')[0];

      editor.plugins.table.resizeBars.adjustHeight(table, 50, 0);

      LegacyUnit.equal(editor.getContent(),
        '<table border=\"1\">' +
        '<tbody>' +
        '<tr style=\"height: 70px;\">' +
        '<th style=\"width: 20px; height: 70px;\">A0</th>' +
        '<th style=\"width: 20px; height: 70px;\">A1</th>' +
        '<th style=\"width: 20px; height: 70px;\">A2</th>' +
        '<th style=\"width: 40px; height: 70px;\">A3</th>' +
        '<th style=\"width: 10px; height: 70px;\">A4</th>' +
        '</tr>' +
        '<tr style=\"height: 20px;\">' +
        '<td style=\"width: 20px; height: 20px;\">B0</td>' +
        '<td style=\"width: 20px; height: 20px;\">B1</td>' +
        '<td style=\"width: 20px; height: 20px;\">B2</td>' +
        '<td style=\"width: 40px; height: 20px;\">B3</td>' +
        '<td style=\"width: 10px; height: 40px;\" rowspan=\"2\">B3</td>' +
        '</tr>' +
        '<tr style=\"height: 20px;\">' +
        '<td style=\"width: 20px; height: 20px;\">C0</td>' +
        '<td style=\"width: 20px; height: 20px;\">C1</td>' +
        '<td style=\"width: 20px; height: 20px;\">C2</td>' +
        '<td style=\"width: 40px; height: 20px;\">C3</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

      editor.setContent(testResizeTable2);

      table = editor.dom.select('table')[0];

      editor.plugins.table.resizeBars.adjustHeight(table, 50, 1);

      LegacyUnit.equal(editor.getContent(),
        '<table border=\"1\">' +
        '<tbody>' +
        '<tr style=\"height: 20px;\">' +
        '<th style=\"width: 20px; height: 20px;\">A0</th>' +
        '<th style=\"width: 20px; height: 20px;\">A1</th>' +
        '<th style=\"width: 20px; height: 20px;\">A2</th>' +
        '<th style=\"width: 40px; height: 20px;\">A3</th>' +
        '<th style=\"width: 10px; height: 20px;\">A4</th>' +
        '</tr>' +
        '<tr style=\"height: 70px;\">' +
        '<td style=\"width: 20px; height: 70px;\">B0</td>' +
        '<td style=\"width: 20px; height: 70px;\">B1</td>' +
        '<td style=\"width: 20px; height: 70px;\">B2</td>' +
        '<td style=\"width: 40px; height: 70px;\">B3</td>' +
        '<td style=\"width: 10px; height: 90px;\" rowspan=\"2\">B3</td>' +
        '</tr>' +
        '<tr style=\"height: 20px;\">' +
        '<td style=\"width: 20px; height: 20px;\">C0</td>' +
        '<td style=\"width: 20px; height: 20px;\">C1</td>' +
        '<td style=\"width: 20px; height: 20px;\">C2</td>' +
        '<td style=\"width: 40px; height: 20px;\">C3</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

      editor.setContent(testResizeTable2);

      table = editor.dom.select('table')[0];

      editor.plugins.table.resizeBars.adjustHeight(table, 50, 2);

      LegacyUnit.equal(editor.getContent(),
        '<table border=\"1\">' +
        '<tbody>' +
        '<tr style=\"height: 20px;\">' +
        '<th style=\"width: 20px; height: 20px;\">A0</th>' +
        '<th style=\"width: 20px; height: 20px;\">A1</th>' +
        '<th style=\"width: 20px; height: 20px;\">A2</th>' +
        '<th style=\"width: 40px; height: 20px;\">A3</th>' +
        '<th style=\"width: 10px; height: 20px;\">A4</th>' +
        '</tr>' +
        '<tr style=\"height: 20px;\">' +
        '<td style=\"width: 20px; height: 20px;\">B0</td>' +
        '<td style=\"width: 20px; height: 20px;\">B1</td>' +
        '<td style=\"width: 20px; height: 20px;\">B2</td>' +
        '<td style=\"width: 40px; height: 20px;\">B3</td>' +
        '<td style=\"width: 10px; height: 90px;\" rowspan=\"2\">B3</td>' +
        '</tr>' +
        '<tr style=\"height: 70px;\">' +
        '<td style=\"width: 20px; height: 70px;\">C0</td>' +
        '<td style=\"width: 20px; height: 70px;\">C1</td>' +
        '<td style=\"width: 20px; height: 70px;\">C2</td>' +
        '<td style=\"width: 40px; height: 70px;\">C3</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>');

    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'table',
      indent: false,
      content_style: 'body .mce-item-table { border: 0 }',
      valid_styles: {
        '*': 'width,height,vertical-align,text-align,float,border-color,background-color,border,padding,border-spacing,border-collapse'
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
