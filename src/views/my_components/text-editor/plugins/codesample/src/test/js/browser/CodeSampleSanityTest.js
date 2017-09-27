asynctest(
  'browser.tinymce.plugins.codesample.CodeSampleSanityTest',

  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.plugins.codesample.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (ApproxStructure, Pipeline, RawAssertions, Step, Waiter, TinyApis, TinyLoader, TinyUi, document, CodePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    CodePlugin();
    ModernTheme();

    var sInsertTextareaContent = function (value) {
      return Step.sync(function () {
        var textarea = document.querySelector('div[role="dialog"] textarea');
        textarea.value = value;
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click code button', 'div[aria-label="Insert/Edit code sample"] button'),
        tinyUi.sWaitForPopup('wait for window', 'div[role="dialog"]'),
        sInsertTextareaContent('<p>a</p>'),
        tinyUi.sClickOnUi('click OK btn', 'div.mce-primary button'),
        Waiter.sTryUntil('assert content',
          tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
            return s.element('body', {
              children: [
                s.element('pre', {
                  attrs: {
                    contenteditable: str.is('false')
                  }
                }),
                s.anything()
              ]
            });
          })), 100, 3000)
      ], onSuccess, onFailure);
    }, {
      plugins: 'codesample',
      toolbar: 'codesample',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
