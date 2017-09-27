asynctest(
  'browser.tinymce.plugins.table.DefaultTableToolbarTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.katamari.api.Fun',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'ephox.sugar.api.search.SelectorFilter',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.table.test.TableTestUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Pipeline, Step, Fun, TinyApis, TinyLoader, TinyUi, SelectorFilter, TablePlugin, TableTestUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td>x</td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('test default count of toolbar buttons', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'table td', [0]),
          Chain.asStep({}, [
            tinyUi.cWaitForUi('no context found', 'div[aria-label="Inline toolbar"]'),
            Chain.mapper(function (x) {
              return SelectorFilter.descendants(x, 'button').length;
            }),
            Assertions.cAssertEq('has correct count', 8)
          ])
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);