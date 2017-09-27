asynctest(
  'browser.tinymce.plugins.colorpicker.ColorPickerSanityTest',

  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.textcolor.Plugin',
    'tinymce.plugins.colorpicker.Plugin',
    'tinymce.themes.modern.Theme'
  ],

  function (Pipeline, TinyApis, TinyLoader, TinyUi, TextColorPlugin, ColorPickerPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    TextColorPlugin();
    ColorPickerPlugin();
    ModernTheme();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click forecolor arrow', 'div[aria-label="Text color"] button.mce-open'),
        tinyUi.sClickOnUi('click on custom btn', 'button:contains("Custom...")'),
        tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Color"]'),
        tinyUi.sClickOnUi('could not find cancel button', 'button:contains("Cancel")'),
        tinyUi.sClickOnToolbar('click backcolor arrow', 'div[aria-label="Background color"] button.mce-open'),
        tinyUi.sClickOnUi('click on custom btn', 'button:contains("Custom...")'),
        tinyUi.sWaitForPopup('wait for popup', 'div[role="dialog"][aria-label="Color"]'),
        tinyUi.sClickOnUi('could not find cancel button', 'button:contains("Cancel")')
      ], onSuccess, onFailure);
    }, {
      plugins: 'colorpicker textcolor',
      toolbar: 'colorpicker forecolor backcolor',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
