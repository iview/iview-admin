asynctest(
  'browser.tinymce.plugins.textpattern.TriggerInlinePatternBeginningTest',
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
      // var tinyActions = TinyActions(editor);

      var steps = Utils.withTeardown([
        Logger.t('enter after first * in *a*', GeneralSteps.sequence([
          tinyApis.sSetContent('<p>*a*</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor([0, 0], 1),
          Step.sync(function () {
            editor.fire('keydown', { keyCode: 13 });
          }),
          tinyApis.sAssertContent('<p>*</p><p>a*</p>')
        ])),
        Logger.t('enter after first * in *a*', GeneralSteps.sequence([
          tinyApis.sSetContent('<p><strong>a</strong>*b*</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor([0, 1], 1),
          Step.sync(function () {
            editor.fire('keydown', { keyCode: 13 });
          })
        ]))
      ], tinyApis.sSetContent(''));

      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'textpattern',
      toolbar: 'textpattern',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);