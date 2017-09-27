asynctest(
  'browser.tinymce.plugins.visualchars.PluginTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.visualchars.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Assertions, Pipeline, TinyApis, TinyLoader, TinyUi, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    var spanStruct = ApproxStructure.build(function (s, str) {
      return s.element('body', {
        children: [
          s.element('p', {
            children: [
              s.text(str.is('a')),
              s.element('span', {}),
              s.element('span', {}),
              s.text(str.is('b'))
            ]
          })
        ]
      });
    });

    var nbspStruct = ApproxStructure.build(function (s, str) {
      return s.element('body', {
        children: [
          s.element('p', {
            children: [
              s.text(str.is('a')),
              s.text(str.is('\u00a0')),
              s.text(str.is('\u00a0')),
              s.text(str.is('b'))
            ]
          })
        ]
      });
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyApis.sSetContent('<p>a&nbsp;&nbsp;b</p>'),
        Assertions.sAssertEq('assert equal', 0, editor.dom.select('span').length),
        tinyUi.sClickOnToolbar('click on visualchars button', 'div[aria-label="Show invisible characters"] > button'),
        tinyApis.sAssertContentStructure(spanStruct),
        tinyUi.sClickOnToolbar('click on visualchars button', 'div[aria-label="Show invisible characters"] > button'),
        tinyApis.sAssertContentStructure(nbspStruct),
        tinyUi.sClickOnToolbar('click on visualchars button', 'div[aria-label="Show invisible characters"] > button'),
        tinyApis.sAssertContentStructure(spanStruct),
        tinyUi.sClickOnToolbar('click on visualchars button', 'div[aria-label="Show invisible characters"] > button'),
        tinyApis.sAssertContentStructure(nbspStruct)
      ], onSuccess, onFailure);
    }, {
      plugins: 'visualchars',
      toolbar: 'visualchars',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
