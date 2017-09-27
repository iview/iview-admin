asynctest(
  'browser.tinymce.plugins.textcolor.TextcolorSanityTest.js',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.core.Env',
    'tinymce.plugins.textcolor.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, Env, TextcolorPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TextcolorPlugin();
    var forecolorStruct = ApproxStructure.build(function (s, str) {
      return s.element('body', {
        children: [
          s.element('p', {
            children: [
              s.element('span', {
                styles: {
                  color: str.is(Env.ie && Env.ie <= 11 ? '#0000ff' : 'rgb(0, 0, 255)'),
                  'font-size': str.is('24pt')
                }
              }),
              s.text(str.is(' test'))
            ]
          })
        ]
      });
    });

    var backcolorStruct = ApproxStructure.build(function (s, str) {
      return s.element('body', {
        children: [
          s.element('p', {
            children: [
              s.element('span', {
                styles: {
                  'background-color': str.is('rgb(204, 153, 255)'),
                  'font-size': str.is('24pt')
                }
              }),
              s.text(str.is(' test'))
            ]
          })
        ]
      });
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);


      Pipeline.async({}, [
        // forecolor test
        tinyApis.sSetContent('hello test'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
        tinyUi.sClickOnToolbar('click forecolor', 'div[aria-label="Text color"] > button.mce-open'),
        tinyUi.sClickOnUi('click green color', 'div[data-mce-color="#00FF00"]:first'),
        tinyUi.sClickOnToolbar('click fontsize', 'div[aria-label="Font Sizes"] > button'),
        tinyUi.sClickOnUi('click 24pt', 'div.mce-floatpanel span.mce-text:contains("24pt")'),
        tinyUi.sClickOnToolbar('click forecolor again', 'div[aria-label="Text color"] > button.mce-open'),
        tinyUi.sClickOnUi('click blue color', 'div[data-mce-color="#0000FF"]:first'),
        tinyApis.sAssertContentStructure(forecolorStruct),
        // backcolor test
        tinyApis.sSetContent('hello test'),
        tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
        tinyUi.sClickOnToolbar('click backcolor', 'div[aria-label="Background color"] > button.mce-open'),
        tinyUi.sClickOnUi('click green color', 'div[data-mce-color="#00FF00"]:last'),
        tinyUi.sClickOnToolbar('click fontsize', 'div[aria-label="Font Sizes"] > button'),
        tinyUi.sClickOnUi('click 24pt', 'div.mce-floatpanel span.mce-text:contains("24pt")'),
        tinyUi.sClickOnToolbar('click backcolor again', 'div[aria-label="Background color"] > button.mce-open'),
        tinyUi.sClickOnUi('click a nice purple color', 'div[data-mce-color="#CC99FF"]:last'),
        tinyApis.sAssertContentStructure(backcolorStruct)
      ], onSuccess, onFailure);
    }, {
      plugins: 'textcolor',
      toolbar: 'forecolor backcolor fontsizeselect',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);