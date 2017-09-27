asynctest(
  'browser.tinymce.plugins.print.PrintSanityTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.print.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, TinyLoader, TinyUi, PrintPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    PrintPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyUi.sWaitForUi('check print button exists', 'div[aria-label="Print"] > button')
      ], onSuccess, onFailure);
    }, {
      plugins: 'print',
      toolbar: 'print',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);