define(
  'tinymce.plugins.help.test.FakePlugin',
  [
    'tinymce.core.PluginManager'
  ],
  function (PluginManager) {
    var Plugin = function (editor, url) {
      return {
        getMetadata: function () {
          return {
            name: 'Fake',
            url: 'http://www.fake.com'
          };
        }
      };
    };

    PluginManager.add('fake', Plugin);

    return function () {};
  }
);
