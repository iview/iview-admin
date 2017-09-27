asynctest(
  'browser.tinymce.plugins.table.TableCloneElementsTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme',
    'tinymce.plugins.table.test.TableTestUtils'
  ],
  function (Assertions, GeneralSteps, Logger, Pipeline, TinyApis, TinyLoader, TinyUi, TablePlugin, ModernTheme, TableTestUtils) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td><b>x</b></td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('test clone elements', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'table td', [0]),
          tinyUi.sWaitForUi('no context found', 'div[aria-label="Inline toolbar"]'),
          tinyUi.sClickOnUi('click insert row button', 'div[aria-label="Insert row after"]'),
          tinyApis.sAssertContentPresence({ 'strong': 2 })
        ])),

        Logger.t('test clone elements with disabled setting', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetSetting('table_clone_elements', false),
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'table td', [0]),
          tinyUi.sWaitForUi('no context found', 'div[aria-label="Inline toolbar"]'),
          tinyUi.sClickOnUi('click insert row button', 'div[aria-label="Insert row after"]'),
          tinyApis.sAssertContentPresence({ 'strong': 1 })
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);