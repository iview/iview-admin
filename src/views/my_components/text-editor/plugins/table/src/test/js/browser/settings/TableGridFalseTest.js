asynctest(
  'browser.tinymce.plugins.table.TableGridFalse',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Pipeline, TinyApis, TinyLoader, TinyUi, TablePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('test table grid disabled', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyUi.sClickOnMenu('click table menu', 'span:contains("Table")'),
          tinyUi.sClickOnUi('click table menu', 'div[role="menu"] span:contains("Table")'),
          Chain.asStep({}, [
            tinyUi.cWaitForPopup('wait for popup', 'div[aria-label="Table properties"][role="dialog"]'),
            Chain.op(function (x) {
              Assertions.assertPresence(
                'assert presence of col and row input',
                {
                  'label:contains("Cols")': 1,
                  'label:contains("Rows")': 1
                }, x);
            })
          ])
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      table_grid: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);