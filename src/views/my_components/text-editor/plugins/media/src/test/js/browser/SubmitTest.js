asynctest(
  'browser.core.SubmitTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.media.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (
    Assertions, Chain, GeneralSteps, Pipeline, Waiter, TinyApis, TinyLoader, TinyUi,
    Plugin, Utils, Theme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    var sTestEmbedContentSubmit = function (ui, editor, apis, url, expected) {
      return GeneralSteps.sequence([
        Utils.sOpenDialog(ui),
        Utils.sSetFormItemNoEvent(ui, url),
        ui.sClickOnUi('click checkbox', 'div.mce-primary > button'),
        Utils.sAssertEditorContent(apis, editor, expected)
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var ui = TinyUi(editor);
      var apis = TinyApis(editor);

      Pipeline.async({}, [
        sTestEmbedContentSubmit(ui, editor, apis, 'https://www.youtube.com/watch?v=IcgmSRJHu_8',
          '<p><span id="fake">https://www.youtube.com/watch?v=IcgmSRJHu_8</span></p>'),
        apis.sSetContent(''),
        Utils.sSetSetting(editor.settings, 'media_url_resolver', function (data, resolve) {
          resolve({ html: '' });
        }),
        sTestEmbedContentSubmit(ui, editor, apis, 'https://www.youtube.com/watch?v=IcgmSRJHu_8',
          '<p><iframe src="//www.youtube.com/embed/IcgmSRJHu_8" width="560" height="314" ' +
          'allowfullscreen="allowfullscreen"></iframe></p>'),
        apis.sSetContent('')
      ], onSuccess, onFailure);
    }, {
      plugins: ["media"],
      toolbar: "media",
      media_url_resolver: function (data, resolve) {
        setTimeout(function () {
          resolve({
            html: '<span id="fake">' + data.url + '</span>'
          });
        }, 500);
      },
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);