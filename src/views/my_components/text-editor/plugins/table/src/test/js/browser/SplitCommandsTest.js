asynctest(
  'browser.tinymce.plugins.table.SplitCommandsTest',
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

    suite.test("mceSplitColsBefore", function () {
      testCommand('mceSplitColsBefore', [
        {
          message: 'Should not change anything these is no table cell selection',
          before: '<p>a</p>',
          after: '<p>a</p>'
        },

        {
          message: 'Should not change anything since there is nothing to split (1 row)',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">1a</td><td>2a</td><td>3a</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should not change anything since there is nothing to split (2 rows)',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td data-mce-selected="1">1b</td><td>2b</td><td>3b</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td>1b</td><td>2b</td><td>3b</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should split at second row and remove rowspan',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="2">1a</td><td>2a</td><td rowspan="2">3a</td></tr>' +
            '<tr><td data-mce-selected="1">2b</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td>&nbsp;</td><td>2b</td><td>&nbsp;</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should split at third row and decrease rowspan',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="3">1a</td><td>2a</td><td rowspan="3">3a</td></tr>' +
            '<tr><td>2b</td></tr>' +
            '<tr><td data-mce-selected="1">2c</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="2">1a</td><td>2a</td><td rowspan="2">3a</td></tr>' +
            '<tr><td>2b</td></tr>' +
            '<tr><td>&nbsp;</td><td>2c</td><td>&nbsp;</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        }
      ]);
    });

    suite.test("mceSplitColsAfter", function () {
      testCommand('mceSplitColsAfter', [
        {
          message: 'Should not change anything these is no table cell selection',
          before: '<p>a</p>',
          after: '<p>a</p>'
        },

        {
          message: 'Should not change anything since there is nothing to split (1 row)',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">1a</td><td>2a</td><td>3a</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should not change anything since there is nothing to split (2 rows)',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td data-mce-selected="1">1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td>1b</td><td>2b</td><td>3b</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td>1b</td><td>2b</td><td>3b</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should split at second row and remove rowspan',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="2" data-mce-selected="1">1a</td><td>2a</td><td rowspan="2">3a</td></tr>' +
            '<tr><td>2b</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td>&nbsp;</td><td>2b</td><td>&nbsp;</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        },

        {
          message: 'Should split at first row and produce td:s with decreased rowspans below',
          before: (
            '<table>' +
            '<tbody>' +
            '<tr><td rowspan="3" data-mce-selected="1">1a</td><td>2a</td><td rowspan="3">3a</td></tr>' +
            '<tr><td>2b</td></tr>' +
            '<tr><td>2c</td></tr>' +
            '</tbody>' +
            '</table>'
          ),
          after: (
            '<table>' +
            '<tbody>' +
            '<tr><td>1a</td><td>2a</td><td>3a</td></tr>' +
            '<tr><td rowspan="2">&nbsp;</td><td>2b</td><td rowspan="2">&nbsp;</td></tr>' +
            '<tr><td>2c</td></tr>' +
            '</tbody>' +
            '</table>'
          )
        }
      ]);
    });

    suite.test("mceTableSplitCells command", function (editor) {
      editor.setContent('<table><tbody><tr><td colspan="2">12</td></tr></tbody></table>');
      LegacyUnit.setSelection(editor, 'td', 0);
      editor.execCommand('mceTableSplitCells');
      LegacyUnit.equal(
        cleanTableHtml(editor.getContent()),
        '<table><tbody><tr><td>12</td><td>&nbsp;</td></tr></tbody></table>'
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
