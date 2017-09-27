define(
  'tinymce.plugins.help.test.NoMetaFakePlugin',
  [
    'tinymce.core.PluginManager'
  ],
  function (PluginManager) {
    PluginManager.add('nometafake', function () {});

    return function () {};
  }
);
