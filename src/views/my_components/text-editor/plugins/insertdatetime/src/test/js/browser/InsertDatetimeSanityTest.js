asynctest(
  'browser.tinymce.plugins.insertdatetime.InsertDatetimeSanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.insertdatetime.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, InsertDatetimePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    InsertDatetimePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on insertdatetime button', 'div[aria-label="Insert date/time"] > button.mce-open'),
        tinyUi.sClickOnUi('click on first in menu', 'div[role="menu"] > div.mce-first > span'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s) {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.element('time', {})
                ]
              })
            ]
          });
        }))
      ], onSuccess, onFailure);
    }, {
      plugins: 'insertdatetime',
      toolbar: 'insertdatetime',
      insertdatetime_element: true,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);