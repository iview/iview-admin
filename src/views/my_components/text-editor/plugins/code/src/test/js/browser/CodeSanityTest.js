asynctest(
  'browser.tinymce.plugins.code.CodeSanityTest',

  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.plugins.code.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (Pipeline, RawAssertions, Step, TinyApis, TinyLoader, TinyUi, document, CodePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    CodePlugin();
    ModernTheme();

    var sAssertTextareaContent = function (expected) {
      return Step.sync(function () {
        var textarea = document.querySelector('div[role="dialog"] textarea');
        RawAssertions.assertEq('should have correct value', expected, textarea.value);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sSetContent('<b>a</b>'),
        tinyUi.sClickOnToolbar('click code button', 'div[aria-label="Source code"] button'),
        tinyUi.sWaitForPopup('wait for window', 'div[role="dialog"]'),
        sAssertTextareaContent('<p><strong>a</strong></p>')
      ], onSuccess, onFailure);
    }, {
      plugins: 'code',
      toolbar: 'code',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
