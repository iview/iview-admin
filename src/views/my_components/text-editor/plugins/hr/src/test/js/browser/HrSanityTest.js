asynctest(
  'browser.tinymce.plugins.fullscreen.HrSanitytest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.hr.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, Step, TinyApis, TinyLoader, TinyUi, HrPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    HrPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);
      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on hr button', 'div[aria-label="Horizontal line"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
          return s.element('body', {
            children: [
              s.element('hr', {}),
              s.anything()
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'hr',
      toolbar: 'hr',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);