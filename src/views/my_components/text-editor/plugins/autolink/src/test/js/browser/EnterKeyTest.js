asynctest(
  'browser.tinymce.plugins.autolink.EnterKeyTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.sugar.api.node.Element',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Keyboard, Keys, Pipeline, Step, TinyActions, TinyApis, TinyLoader, Element, AutoLinkPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    AutoLinkPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,
        tinyApis.sSetContent('<p>abcdefghijk</p>'),
        tinyApis.sSetCursor([0, 0], 11),
        tinyActions.sContentKeystroke(Keys.enter(), {}),
        Step.sync(function () {
          try {
            editor.fire('keydown', { keyCode: 13 });
          } catch (error) {
            Assertions.assertEq('should not throw error', true, false);
          }
        })
      ], onSuccess, onFailure);
    }, {
      plugins: 'autolink',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);