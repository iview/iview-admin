asynctest(
  'browser.tinymce.plugins.table.TableAppearanceTest',
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
    'tinymce.plugins.table.test.TableTestUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Pipeline, TinyApis, TinyLoader, TinyUi, TablePlugin, TableTestUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td>x</td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('text that settings for appearance can be disabled', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'table td', [0]),
          tinyUi.sWaitForUi('no context found', 'div[aria-label="Inline toolbar"]'),
          tinyUi.sClickOnToolbar('click table button', 'div[aria-label="Table"] > button'),
          tinyUi.sClickOnUi('click properties menu item', 'span:contains("Table properties")'),
          Chain.asStep({}, [
            tinyUi.cWaitForPopup('wait for popup', 'div[aria-label="Table properties"][role="dialog"]'),
            Chain.op(function (x) {
              Assertions.assertPresence(
                'assert presence of spacing, padding, border and caption inputs',
                {
                  'label:contains("Cell spacing")': 0,
                  'label:contains("Cell padding")': 0,
                  'label:contains("Border") + input': 0,
                  'label:contains("Caption")': 0
                }, x);
            })
          ])
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      toolbar: 'table',
      table_appearance_options: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);