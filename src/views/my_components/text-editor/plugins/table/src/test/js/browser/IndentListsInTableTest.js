asynctest(
  'tinymce.plugins.table.IndentListsInTableTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.lists.Plugin',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Keys, Logger, Pipeline, RawAssertions, Step, TinyActions, TinyApis, TinyLoader, ListsPlugin, TablePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();
    ListsPlugin();

    var sAssertTableInnerHTML = function (editor, expected) {
      return Step.sync(function () {
        var actual = editor.getBody().firstChild.innerHTML;
        RawAssertions.assertEq('Does not have correct html', expected, actual);
      });
    };


    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,

        Logger.t('ul > li in table', GeneralSteps.sequence([
          tinyApis.sSetContent('<table><tbody><tr><td><ul><li>a</li><li>b</li></ul></td></tr></tbody></table>'),
          tinyApis.sSetCursor([0, 0, 0, 0, 0, 1], 1),
          tinyActions.sContentKeystroke(Keys.tab(), {}),
          sAssertTableInnerHTML(editor, '<tbody><tr><td><ul><li>a<ul><li>b</li></ul></li></ul></td></tr></tbody>')
        ])),

        Logger.t('ol > li in table', GeneralSteps.sequence([
          tinyApis.sSetContent('<table><tbody><tr><td><ol><li>a</li><li>b</li></ol></td></tr></tbody></table>'),
          tinyApis.sSetCursor([0, 0, 0, 0, 0, 1], 1),
          tinyActions.sContentKeystroke(Keys.tab(), {}),
          sAssertTableInnerHTML(editor, '<tbody><tr><td><ol><li>a<ol><li>b</li></ol></li></ol></td></tr></tbody>')
        ])),

        Logger.t('dl > dt in table', GeneralSteps.sequence([
          tinyApis.sSetContent('<table><tbody><tr><td><dl><dt>a</dt><dt>b</dt></dl></td></tr></tbody></table>'),
          tinyApis.sSetCursor([0, 0, 0, 0, 0, 1], 1),
          tinyActions.sContentKeystroke(Keys.tab(), {}),
          sAssertTableInnerHTML(editor, '<tbody><tr><td><dl><dt>a</dt><dd>b</dd></dl></td></tr></tbody>')
        ]))

      ], onSuccess, onFailure);
    }, {
      plugins: 'lists table',
      toolbar: 'table numlist',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);