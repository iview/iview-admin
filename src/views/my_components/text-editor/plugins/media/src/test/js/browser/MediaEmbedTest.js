asynctest(
  'browser.core.MediaEmbedTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.media.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, TinyApis, TinyLoader, TinyUi, Plugin, Utils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var ui = TinyUi(editor);
      var api = TinyApis(editor);

      Pipeline.async({}, [
        Utils.sTestEmbedContentFromUrl(ui,
          'https://www.youtube.com/watch?v=b3XFjWInBog',
          '<video width="300" height="150" controls="controls">\n' +
          '<source src="https://www.youtube.com/watch?v=b3XFjWInBog" />\n</video>'
        ),
        Utils.sTestEmbedContentFromUrl(ui,
          'https://www.google.com',
          '<video width="300" height="150" controls="controls">\n' +
          '<source src="https://www.google.com" />\n</video>'
        ),
        Utils.sAssertSizeRecalcConstrained(ui),
        Utils.sAssertSizeRecalcUnconstrained(ui),
        api.sSetContent(''),
        Utils.sAssertSizeRecalcConstrainedReopen(ui)
      ], onSuccess, onFailure);
    }, {
      plugins: ["media"],
      toolbar: "media",
      media_url_resolver: function (data, resolve) {
        resolve({
          html: '<video width="300" height="150" ' +
            'controls="controls">\n<source src="' + data.url + '" />\n</video>'
        });
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
