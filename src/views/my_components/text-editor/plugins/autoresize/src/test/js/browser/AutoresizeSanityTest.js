asynctest(
  'browser.tinymce.plugins.autoresize.AutoresizeSanityTest',

  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.autoresize.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (
    ApproxStructure, Pipeline, RawAssertions, Step, Waiter, TinyApis, TinyLoader, AutoresizePlugin,
    ModernTheme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    AutoresizePlugin();
    ModernTheme();

    var sAssertEditorHeight = function (editor, minHeight) {
      return Step.sync(function () {
        var editorHeight = editor.getContainer().scrollHeight;
        RawAssertions.assertEq('should be over 5000', true, editorHeight >= minHeight);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sSetContent('<div style="height: 5000px;">hej</div>'),
        Waiter.sTryUntil('wait for editor height', sAssertEditorHeight(editor, 5000), 100, 3000)
      ], onSuccess, onFailure);
    }, {
      plugins: 'autoresize',
      toolbar: 'autoresize',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
