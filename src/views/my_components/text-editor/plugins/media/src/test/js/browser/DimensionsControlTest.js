asynctest(
  'browser.tinymce.plugins.media.DimensionsControlTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiFinder',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.media.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (
    Pipeline, Step, UiFinder, Waiter, TinyApis, TinyDom, TinyLoader, TinyUi, Plugin,
    Utils, Theme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var ui = TinyUi(editor);

      Pipeline.async({}, [
        Utils.sOpenDialog(ui),
        ui.sClickOnUi('Click on close button', 'button:contains("Ok")'),
        Waiter.sTryUntil(
          'Wait for dialog to close',
          UiFinder.sNotExists(TinyDom.fromDom(document.body), 'div[aria-label="Insert/edit media"][role="dialog"]'),
          50, 5000
        )

      ], onSuccess, onFailure);
    }, {
      plugins: ["media"],
      toolbar: "media",
      media_dimensions: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
