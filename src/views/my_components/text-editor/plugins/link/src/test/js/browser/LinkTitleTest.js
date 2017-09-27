asynctest(
  'browser.tinymce.plugins.link.LinkTitleTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, UiFinder, TinyApis, TinyDom, TinyLoader, TinyUi, document, LinkPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    LinkPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        //show title input by default
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('wait for link dialog', 'div[aria-label="Insert link"][role="dialog"]'),
        UiFinder.sExists(TinyDom.fromDom(document.body), 'label:contains("Title")'),
        tinyUi.sClickOnUi('click on cancel', 'button:contains("Cancel")'),

        // but not when setting set to false
        tinyApis.sSetSetting('link_title', false),
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('wait for link dialog', 'div[aria-label="Insert link"][role="dialog"]'),
        UiFinder.sNotExists(TinyDom.fromDom(document.body), 'label:contains("Title")'),
        tinyUi.sClickOnUi('click on cancel', 'button:contains("Cancel")')
      ], onSuccess, onFailure);
    }, {
      plugins: 'link',
      toolbar: 'link',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);