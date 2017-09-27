asynctest(
  'browser.tinymce.plugins.save.SaveSanityTest',
  [
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.save.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Keys, Pipeline, TinyActions, TinyApis, TinyLoader, TinyUi, SavePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    SavePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        tinyUi.sWaitForUi('check button', 'div[aria-disabled="true"] i.mce-i-save'),
        tinyApis.sSetContent('<p>a</p>'),
        tinyApis.sSetCursor([0, 0], 1),
        tinyActions.sContentKeystroke(Keys.enter(), {}),
        tinyUi.sWaitForUi('check button', 'div[aria-disabled="false"] i.mce-i-save')
      ], onSuccess, onFailure);
    }, {
      plugins: 'save',
      toolbar: 'save',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);