asynctest(
  'browser.tinymce.plugins.table.TableCellClassListTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.table.Plugin',
    'tinymce.plugins.table.test.TableTestUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Pipeline, Step, TinyApis, TinyLoader, TinyUi, TablePlugin, TableTestUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    var tableHtml = '<table><tbody><tr><td>x</td></tr></tbody></table>';

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('no class input without setting', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'td', [0]),
          tinyUi.sClickOnMenu('click table menu', 'span:contains("Table")'),
          tinyUi.sClickOnUi('click table menu', 'div[role="menu"] span:contains("Cell")'),
          tinyUi.sClickOnUi('click table menu', 'div[role="menu"] span:contains("Cell properties")'),
          Chain.asStep({}, [
            tinyUi.cWaitForPopup('wait for popup', 'div[aria-label="Cell properties"][role="dialog"]'),
            Chain.op(function (x) {
              Assertions.assertPresence(
                'assert presence of col and row input',
                {
                  'label:contains("Class")': 0
                }, x);
            })
          ]),
          tinyUi.sClickOnUi('close popup', 'button > span:contains("Cancel")'),
          tinyApis.sSetContent('')
        ])),

        Logger.t('class input with setting', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetSetting('table_cell_class_list', [{ title: 'test', value: 'test' }]),
          tinyApis.sSetContent(tableHtml),
          TableTestUtils.sOpenToolbarOn(editor, 'td', [0]),
          tinyUi.sClickOnMenu('click table menu', 'span:contains("Table")'),
          tinyUi.sClickOnUi('click table menu', 'div[role="menu"] span:contains("Cell")'),
          tinyUi.sClickOnUi('click table menu', 'div[role="menu"] span:contains("Cell properties")'),
          tinyUi.sWaitForPopup('wait for popup', 'div[aria-label="Cell properties"][role="dialog"]'),
          tinyUi.sClickOnUi('click class input', 'button > span:contains("test")'),
          tinyUi.sClickOnUi('click class input', 'div[role="menuitem"] > span:contains("test")'),
          tinyUi.sClickOnUi('close popup', 'button > span:contains("Ok")'),
          tinyApis.sAssertContentPresence({ 'td.test': 1 })
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'table',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);