asynctest(
  'browser.tinymce.plugins.textpattern.UndoTextpatternTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.plugins.textpattern.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Keys, Logger, Pipeline, Step, TinyActions, TinyApis, TinyLoader, TextpatternPlugin, Utils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TextpatternPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      var steps = Utils.withTeardown([
        Logger.t('inline italic then undo', GeneralSteps.sequence([
          Utils.sSetContentAndPressSpace(tinyApis, tinyActions, '*a*'),
          tinyApis.sAssertContentStructure(Utils.inlineStructHelper('em', 'a')),
          tinyApis.sExecCommand('Undo'),
          tinyApis.sAssertContent('<p>*a*&nbsp;</p>')
        ]))
      ], tinyApis.sSetContent(''));

      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'textpattern',
      toolbar: 'textpattern',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);