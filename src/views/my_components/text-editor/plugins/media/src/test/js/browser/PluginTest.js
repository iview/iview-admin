asynctest(
  'browser.tinymce.plugins.media.PluginTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.media.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (
    Assertions, Pipeline, TinyApis, TinyDom, TinyLoader, TinyUi, Plugin, Utils,
    Theme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var ui = TinyUi(editor);

      Pipeline.async({}, [
        Utils.sTestEmbedContentFromUrl(ui,
          'https://www.youtube.com/watch?v=b3XFjWInBog',
          '<iframe src="//www.youtube.com/embed/b3XFjWInBog" width="560" height="314" allowFullscreen="1"></iframe>'
        ),
        Utils.sTestEmbedContentFromUrl(ui,
          'https://www.google.com',
          '<video width="300" height="150" controls="controls">\n<source src="https://www.google.com" />\n</video>'
        ),
        Utils.sAssertSizeRecalcConstrained(ui),
        Utils.sAssertSizeRecalcUnconstrained(ui),
        Utils.sAssertSizeRecalcConstrainedReopen(ui)
      ], onSuccess, onFailure);
    }, {
      plugins: ["media"],
      toolbar: "media",
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
