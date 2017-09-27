asynctest(
  'browser.tinymce.plugins.nonbreaking.NonbreakingForceTabUndoTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.nonbreaking.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Keys, Pipeline, Step, TinyActions, TinyApis, TinyLoader, TinyUi, NonbreakingPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    NonbreakingPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        tinyActions.sContentKeystroke(Keys.tab(), {}),
        tinyApis.sAssertContent('<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>'),
        Step.sync(function () {
          editor.undoManager.undo();
        }),
        tinyApis.sAssertContent('')
      ], onSuccess, onFailure);
    }, {
      plugins: 'nonbreaking',
      toolbar: 'nonbreaking',
      nonbreaking_force_tab: 5,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);