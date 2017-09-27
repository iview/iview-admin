asynctest(
  'browser.tinymce.plugins.lists.TableInListTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Logger, Pipeline, Step, TinyApis, TinyLoader, TinyUi, ListsPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    ListsPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('unlist table in list then add list inside table', GeneralSteps.sequence([
          tinyApis.sSetContent('<ul><li><table><tbody><tr><td>a</td><td>b</td></tr></tbody></table></li></ul>'),
          tinyApis.sSetCursor([0, 0, 0, 0, 0, 0, 0], 0),
          tinyUi.sClickOnToolbar('click list button', 'div[aria-label="Bullet list"] button'),
          tinyApis.sAssertContent('<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'),
          tinyUi.sClickOnToolbar('click list button', 'div[aria-label="Bullet list"] button'),
          tinyApis.sAssertContent('<table><tbody><tr><td><ul><li>a</li></ul></td><td>b</td></tr></tbody></table>')
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'lists',
      toolbar: 'bullist',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);