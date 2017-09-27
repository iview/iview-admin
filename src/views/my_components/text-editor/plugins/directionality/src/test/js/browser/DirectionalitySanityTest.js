asynctest(
  'browser.tinymce.plugins.directionality.DirectionalitySanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.directionality.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, DirectionalityPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    DirectionalityPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sSetContent('a'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 1),
        tinyUi.sClickOnToolbar('click on ltr btn', 'div[aria-label="Right to left"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
          return s.element('body', {
            children: [
              s.element('p', {
                attrs: {
                  dir: str.is('rtl')
                }
              })
            ]
          });
        })),
        tinyUi.sClickOnToolbar('click on rtl btn', 'div[aria-label="Left to right"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
          return s.element('body', {
            children: [
              s.element('p', {
                attrs: {
                  dir: str.is('ltr')
                }
              })
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'directionality',
      toolbar: 'ltr rtl',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);