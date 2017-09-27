asynctest(
  'browser.tinymce.plugins.preview.PreviewSanityTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.preview.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, TinyApis, TinyLoader, TinyUi, PreviewPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    PreviewPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyApis.sSetContent('<strong>a</strong>'),
        tinyUi.sClickOnToolbar('click on preview toolbar', 'div[aria-label="Preview"] > button'),
        tinyUi.sWaitForPopup('wait for preview popup', 'div[role="dialog"][aria-label="Preview"] iframe')
      ], onSuccess, onFailure);
    }, {
      plugins: 'preview',
      toolbar: 'preview',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);