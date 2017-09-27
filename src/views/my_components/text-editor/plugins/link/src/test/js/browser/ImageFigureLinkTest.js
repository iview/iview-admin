asynctest(
  'browser.tinymce.plugins.link.ImageFigureLinkTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyDom',
    'tinymce.plugins.link.Plugin',
    'tinymce.plugins.link.core.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, Assertions, Step, TinyApis, TinyLoader, TinyDom, LinkPlugin, LinkPluginUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    LinkPlugin();


    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var api = TinyApis(editor);

      var sLinkTheSelection = function () {
        var insertLink = LinkPluginUtils.link(editor, {});
        return Step.sync(function () {
          insertLink({
            href: 'http://google.com'
          });
        });
      };

      var sUnlinkSelection = function () {
        var removeLink = LinkPluginUtils.unlink(editor);
        return Step.sync(function () {
          removeLink(editor);
        });
      };

      var sAssertPresense = function (selector) {
        return Assertions.sAssertPresence("Detect presense of the element", selector, TinyDom.fromDom(editor.getBody()));
      };


      Pipeline.async({}, [
        api.sSetContent(
          '<figure class="image">' +
            '<img src="http://moxiecode.cachefly.net/tinymce/v9/images/logo.png" />' +
            '<figcaption>TinyMCE</figcaption>' +
          '</figure>'
        ),
        api.sSetSelection([0], 0, [0], 0),
        sLinkTheSelection(),
        sAssertPresense({ 'figure.image > a[href="http://google.com"] > img': 1 }),

        api.sSetSelection([0], 0, [0], 0),
        sUnlinkSelection(),
        sAssertPresense({ 'figure.image > img': 1 })
      ], onSuccess, onFailure);
    }, {
      plugins: 'link',
      toolbar: 'link',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);