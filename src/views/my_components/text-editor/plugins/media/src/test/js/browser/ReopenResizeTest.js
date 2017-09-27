asynctest(
  'browser.tinymce.plugins.media.ReopenResizeTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.media.Plugin',
    'tinymce.plugins.media.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, RawAssertions, Step, Waiter, TinyLoader, TinyUi, Plugin, Utils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Plugin();
    Theme();

    var sWaitForResizeHandles = function (editor) {
      return Waiter.sTryUntil('Wait for new width value', Step.sync(function () {
        RawAssertions.assertEq('Resize handle should exist', editor.dom.select('#mceResizeHandlenw').length, 1);
      }), 1, 3000);
    };

    var sRawAssertImagePresence = function (editor) {
      // Hacky way to assert that the placeholder image is in
      // the correct place that works cross browser
      // assertContentStructure did not work because some
      // browsers insert BRs and some do not
      return Step.sync(function () {
        var actualCount = editor.dom.select('body > img.mce-object').length;
        RawAssertions.assertEq('assert raw content', 1, actualCount);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var ui = TinyUi(editor);

      Pipeline.async({}, [
        Utils.sOpenDialog(ui),
        Utils.sPasteSourceValue(ui, 'a'),
        Utils.sAssertWidthValue(ui, '300'),
        ui.sClickOnUi('Click on close button', 'button:contains("Ok")'),
        sWaitForResizeHandles(editor),
        Utils.sOpenDialog(ui),
        Utils.sChangeWidthValue(ui, '500'),
        ui.sClickOnUi('Click on close button', 'button:contains("Ok")'),
        sWaitForResizeHandles(editor),
        Waiter.sTryUntil(
          'Try assert content',
          sRawAssertImagePresence(editor, 1),
          100, 3000
        )
      ], onSuccess, onFailure);
    }, {
      plugins: ["media"],
      toolbar: "media",
      indent: false,
      forced_root_block: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
