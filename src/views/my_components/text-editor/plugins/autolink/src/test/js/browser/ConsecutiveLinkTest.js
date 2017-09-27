asynctest(
  'browser.tinymce.plugins.autolink.ConsecutiveLinkTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.Env',
    'tinymce.plugins.autolink.Plugin',
    'tinymce.plugins.autolink.test.KeyUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Keys, Logger, Pipeline, Step, TinyActions, TinyApis, TinyLoader, Env, AutolinkPlugin, KeyUtils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    AutolinkPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var steps = Env.ie ? [] : [
        Logger.t('Chrome adds a nbsp between link and text', GeneralSteps.sequence([
          tinyApis.sSetContent('<p><a href="http://www.domain.com">www.domain.com</a>&nbsp;www.domain.com</p>'),
          tinyApis.sSetCursor([0, 1], 15),
          Step.sync(function () {
            KeyUtils.type(editor, ' ');
          }),
          tinyApis.sAssertContent('<p><a href="http://www.domain.com">www.domain.com</a>&nbsp;<a href="http://www.domain.com">www.domain.com</a></p>')
        ])),
        Logger.t('FireFox does not seem to add a nbsp between link and text', GeneralSteps.sequence([
          tinyApis.sSetContent('<p><a href="http://www.domain.com">www.domain.com</a> www.domain.com</p>'),
          tinyApis.sSetCursor([0, 1], 15),
          Step.sync(function () {
            KeyUtils.type(editor, ' ');
          }),
          tinyApis.sAssertContent('<p><a href="http://www.domain.com">www.domain.com</a> <a href="http://www.domain.com">www.domain.com</a></p>')
        ]))
      ];

      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'autolink',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);