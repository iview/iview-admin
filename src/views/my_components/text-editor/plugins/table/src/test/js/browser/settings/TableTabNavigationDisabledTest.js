asynctest(
  'browser.tinymce.plugins.table.TableTablNavigationDisabledTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.table.test.TableTestUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Keys, Logger, Pipeline, TinyActions, TinyApis, TinyLoader, TinyUi, TablePlugin, TableTestUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td>a</td></tr><tr><td>a</td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        Logger.t('test table grid disabled', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'td', [0]),
          tinyActions.sContentKeystroke(Keys.tab(), {}),
          tinyApis.sAssertSelection([0, 0, 0, 0], 0, [0, 0, 0, 0], 1)
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      table_tab_navigation: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);