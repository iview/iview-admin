asynctest(
  'browser.tinymce.plugins.link.ContextToolbarTest',
  [
    'ephox.agar.api.Mouse',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Mouse, Pipeline, UiFinder, TinyApis, TinyDom, TinyLoader, TinyUi, LinkPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    LinkPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        // no toolbar on by default
        tinyApis.sSetContent('<a href="http://www.google.com">google</a>'),
        Mouse.sTrueClickOn(TinyDom.fromDom(editor.getBody()), 'a'),
        UiFinder.sNotExists(TinyDom.fromDom(editor.getBody()), 'div[aria-label="Open link"]'),
        tinyApis.sSetContent(''),

        // only after setting set to true
        tinyApis.sSetSetting('link_context_toolbar', true),
        tinyApis.sSetContent('<a href="http://www.google.com">google</a>'),
        Mouse.sTrueClickOn(TinyDom.fromDom(editor.getBody()), 'a'),
        tinyUi.sWaitForUi('wait for open button', 'div[aria-label="Open link"]')
      ], onSuccess, onFailure);
    }, {
      plugins: 'link',
      toolbar: 'link',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);