asynctest(
  'browser.tinymce.plugins.emoticons.EmoticonSanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.emoticons.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, Step, TinyApis, TinyLoader, TinyUi, EmoticonPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    EmoticonPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on emoticons button', 'div[aria-label="Emoticons"] > button'),
        tinyUi.sClickOnUi('click on kiss', 'a[aria-label="kiss"]'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.element('img', {
                    attrs: {
                      alt: str.is('kiss')
                    }
                  })
                ]
              })
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'emoticons',
      toolbar: 'emoticons',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);