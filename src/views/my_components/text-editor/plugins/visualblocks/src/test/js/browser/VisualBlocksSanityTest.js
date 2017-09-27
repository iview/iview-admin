asynctest(
  'browser.tinymce.plugins.visualblocks.VisualBlocksSanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.visualblocks.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, VisualBlocksPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    VisualBlocksPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);
      Pipeline.async({}, [
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.not('mce-visualblocks')
            ]
          });
        })),
        tinyUi.sClickOnToolbar('click visualblocks button', 'div[aria-label="Show blocks"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.has('mce-visualblocks')
            ]
          });
        })),
        tinyUi.sClickOnToolbar('click visualblocks button', 'div[aria-label="Show blocks"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            classes: [
              arr.not('mce-visualblocks')
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'visualblocks',
      toolbar: 'visualblocks',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);