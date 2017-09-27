asynctest(
  'browser.plugin.PluginTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'ephox.sugar.api.properties.Html',
    'global!document',
    'tinymce.plugins.help.Plugin',
    'tinymce.plugins.link.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, Pipeline, UiFinder, TinyApis, TinyDom, TinyLoader, TinyUi, Html, document, HelpPlugin, LinkPlugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();
    HelpPlugin();
    LinkPlugin();

    var sAssertPluginList = function (html) {
      return Chain.asStep(TinyDom.fromDom(document.body), [
        UiFinder.cWaitFor('Could not find notification', 'div.mce-floatpanel ul'),
        Chain.mapper(Html.get),
        Assertions.cAssertHtml('Plugin list html does not match', html)
      ]);
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyUi.sClickOnToolbar('click on button', 'button'),
        sAssertPluginList('<li><a href="https://www.tinymce.com/docs/plugins/help" target="_blank" rel="noopener">Help</a></li><li><a href="https://www.tinymce.com/docs/plugins/link" target="_blank" rel="noopener">Link</a></li>')
      ], onSuccess, onFailure);
    }, {
      plugins: 'help link',
      toolbar: 'help',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);
