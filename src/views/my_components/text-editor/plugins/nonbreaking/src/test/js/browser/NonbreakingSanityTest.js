asynctest(
  'browser.tinymce.plugins.nonbreaking.NonbreakingSanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.nonbreaking.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, NonbreakingPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    NonbreakingPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on nbsp button', 'div[aria-label="Nonbreaking space"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.text(str.is('\u00a0'))
                ]
              })
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'nonbreaking',
      toolbar: 'nonbreaking',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);