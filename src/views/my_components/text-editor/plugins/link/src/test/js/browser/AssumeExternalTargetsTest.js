asynctest(
  'browser.tinymce.plugins.link.AssumeExternalTargetsTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.core.dom.DOMUtils',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, Step, Waiter, TinyActions, TinyApis, TinyLoader, TinyUi, document, DOMUtils, LinkPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    LinkPlugin();

    var sEnterUrl = function (url) {
      return Step.sync(function () {
        var input = document.activeElement;

        input.value = url;
        DOMUtils.DOM.fire(input, 'change');
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        // with default setting, always prompts www.-urls, not other without protocol
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('link popup', 'div[aria-label="Insert link"][role="dialog"]'),
        sEnterUrl('www.google.com'),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyUi.sWaitForUi(
          'wait for dialog',
          'span:contains("The URL you entered seems to be an external link. Do you want to add the required http:// prefix?")'
        ),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyApis.sAssertContentPresence({ 'a': 1 }),
        tinyApis.sSetContent(''),
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('link popup', 'div[aria-label="Insert link"][role="dialog"]'),
        sEnterUrl('google.com'),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyApis.sAssertContentPresence({ 'a': 1 }),
        tinyApis.sSetContent(''),

        // with link_assume_external_targets: true, prompts on all, even without protocol
        tinyApis.sSetSetting('link_assume_external_targets', true),
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('link popup', 'div[aria-label="Insert link"][role="dialog"]'),
        sEnterUrl('www.google.com'),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyUi.sWaitForUi(
          'wait for dialog',
          'span:contains("The URL you entered seems to be an external link. Do you want to add the required http:// prefix?")'
        ),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyApis.sAssertContentPresence({ 'a': 1 }),
        tinyApis.sSetContent(''),
        tinyUi.sClickOnToolbar('click on link button', 'div[aria-label="Insert/edit link"] > button'),
        tinyUi.sWaitForPopup('link popup', 'div[aria-label="Insert link"][role="dialog"]'),
        sEnterUrl('google.com'),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyUi.sWaitForUi(
          'wait for dialog',
          'span:contains("The URL you entered seems to be an external link. Do you want to add the required http:// prefix?")'
        ),
        tinyUi.sClickOnUi('click ok button', 'button > span:contains("Ok")'),
        tinyApis.sAssertContentPresence({ 'a': 1 }),
        tinyApis.sSetContent('')
      ], onSuccess, onFailure);
    }, {
      plugins: 'link',
      toolbar: 'link',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);