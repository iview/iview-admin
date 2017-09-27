asynctest(
  'browser.tinymce.plugins.pagebreak.PageBreakSanityTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.pagebreak.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Pipeline, TinyApis, TinyLoader, TinyUi, PageBreakPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    PageBreakPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on pagebreak button', 'div[aria-label="Page break"] > button'),
        tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str, arr) {
          return s.element('body', {
            children: [
              s.element('p', {
                children: [
                  s.element('img', {
                    classes: [
                      arr.has('mce-pagebreak')
                    ]
                  })
                ]
              })
            ]
          });
        }))

      ], onSuccess, onFailure);
    }, {
      plugins: 'pagebreak',
      toolbar: 'pagebreak',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);