asynctest(
  'browser.tinymce.plugins.table.MergeCellCommandTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.util.Tools',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Tools, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    var testCommand = function (editor, command, tests) {
      Tools.each(tests, function (test) {
        editor.getBody().innerHTML = test.before;
        editor.selection.select(editor.dom.select('td[data-mce-selected]')[0], true);
        editor.selection.collapse(true);
        editor.execCommand(command);
        LegacyUnit.equal(cleanTableHtml(editor.getContent()), test.after, test.message);
      });
    };

    var cleanTableHtml = function (html) {
      return html.replace(/<p>(&nbsp;|<br[^>]+>)<\/p>$/, '');
    };

    suite.test("mceTableMergeCells", function () {
      testCommand('mceTableMergeCells', [
        {
          message: 'Should merge all cells into one',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">a1</td><td data-mce-selected="1">b1</td></tr>' +
            '<tr><td data-mce-selected="1">a2</td><td data-mce-selected="1">b2</td></tr>' +
            '</tbody>' +
            '</table>'
          ),

          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>a1b1a2b2</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should merge cells in two cols/rows into one cell with colspan',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">a1</td><td data-mce-selected="1">b1</td></tr>' +
            '<tr><td data-mce-selected="1">a2</td><td data-mce-selected="1">b2</td></tr>' +
            '<tr><td>a3</td><td>b3</td></tr>' +
            '</tbody>' +
            '</table>'
          ),

          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td colspan="2">a1b1a2b2</td></tr>' +
            '<tr><td>a3</td><td>b3</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should remove all rowspans since the table is fully merged',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="2">a1</td><td data-mce-selected="1">b1</td></tr>' +
            '<tr><td data-mce-selected="1">b2</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>a1</td><td>b1b2</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should remove all colspans since the table is fully merged',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td colspan="2">a1</td></tr>' +
            '<tr><td data-mce-selected="1">a2</td><td data-mce-selected="1">b2</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>a1</td></tr>' +
            '<tr><td>a2b2</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should remove rowspans since the table is fully merged',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="3">a1</td><td rowspan="3">b1</td><td data-mce-selected="1">c1</td></tr>' +
            '<tr><td data-mce-selected="1">c2</td></tr>' +
            '<tr><td data-mce-selected="1">c3</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>a1</td><td>b1</td><td>c1c2c3</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should remove colspans since the table is fully merged',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">a1</td><td data-mce-selected="1">b1</td><td data-mce-selected="1">c1</td></tr>' +
            '<tr><td colspan="3">a2</td></tr>' +
            '<tr><td colspan="3">a3</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>a1b1c1</td></tr>' +
            '<tr><td>a2</td></tr>' +
            '<tr><td>a3</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should reduce rowspans to 2 keep the colspan and remove one tr',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td colspan="2" rowspan="2">a1</td><td rowspan="3">b1</td><td data-mce-selected="1">c1</td></tr>' +
            '<tr><td data-mce-selected="1">c2</td></tr>' +
            '<tr><td>a3</td><td>b3</td><td data-mce-selected="1">c3</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td colspan="2">a1</td><td rowspan="2">b1</td><td rowspan="2">c1c2c3</td></tr>' +
            '<tr><td>a3</td><td>b3</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should reduce colspans to 2 keep the rowspan',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">a1</td><td data-mce-selected="1">b1</td><td data-mce-selected="1">c1</td></tr>' +
            '<tr><td colspan="3">a2</td></tr>' +
            '<tr><td colspan="2" rowspan="2">a3</td><td>c3</td></tr>' +
            '<tr><td>c4</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td colspan="2">a1b1c1</td></tr>' +
            '<tr><td colspan="2">a2</td></tr>' +
            '<tr><td rowspan="2">a3</td><td>c3</td></tr>' +
            '<tr><td>c4</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should merge b3+c3 but not reduce a2a3',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td>b1</td>' +
            '<td>c1</td>' +
            '</tr>' +
            '<tr>' +
            '<td rowspan="2">a2a3</td>' +
            '<td>b2</td>' +
            '<td>c2</td>' +
            '</tr>' +
            '<tr>' +
            '<td data-mce-selected="1">b3</td>' +
            '<td data-mce-selected="1">c3</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td>b1</td>' +
            '<td>c1</td>' +
            '</tr>' +
            '<tr>' +
            '<td rowspan="2">a2a3</td>' +
            '<td>b2</td>' +
            '<td>c2</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2">b3c3</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should merge b1+c1 and reduce a2',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td data-mce-selected="1">b1</td>' +
            '<td data-mce-selected="1">c1</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="3">a2</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td>b1c1</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="2">a2</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should merge a2+a3 and reduce b1',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td rowspan="3">b1</td>' +
            '</tr>' +
            '<tr>' +
            '<td data-mce-selected="1">a2</td>' +
            '</tr>' +
            '<tr>' +
            '<td data-mce-selected="1">a3</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td>a1</td>' +
            '<td rowspan="2">b1</td>' +
            '</tr>' +
            '<tr>' +
            '<td>a2a3</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>'
          )
        }
      ]);
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
