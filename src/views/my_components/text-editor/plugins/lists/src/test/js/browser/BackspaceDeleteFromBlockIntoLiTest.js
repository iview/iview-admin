asynctest(
  'Browser Test: .RemoveTrailingBlockquoteTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Keys, Logger, Pipeline, Step, TinyActions, TinyApis, TinyLoader, ListsPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    ListsPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      Pipeline.async({}, [
        Logger.t('backspace from p inside div into li', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent('<ul><li>a</li></ul><div><p><br /></p></div>'),
          tinyApis.sSetCursor([1, 0, 0], 0),
          tinyActions.sContentKeystroke(Keys.backspace(), { }),
          tinyApis.sAssertContent('<ul><li>a</li></ul>')
        ])),
        Logger.t('backspace from p inside blockquote into li', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent('<ul><li>a</li></ul><blockquote><p><br /></p></blockquote>'),
          tinyApis.sSetCursor([1, 0, 0], 0),
          tinyActions.sContentKeystroke(Keys.backspace(), { }),
          tinyApis.sAssertContent('<ul><li>a</li></ul>')
        ])),
        Logger.t('backspace from b inside p inside blockquote into li', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent('<ul><li>a</li></ul><blockquote><p><b><br /></b></p></blockquote>'),
          tinyApis.sSetCursor([1, 0, 0, 0], 0),
          tinyActions.sContentKeystroke(Keys.backspace(), { }),
          tinyApis.sAssertContent('<ul><li>a</li></ul>')
        ])),
        Logger.t('backspace from span inside p inside blockquote into li', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent('<ul><li>a</li></ul><blockquote><p><span class="x"><br /></span></p></blockquote>'),
          tinyApis.sSetCursor([1, 0, 0, 0], 0),
          tinyActions.sContentKeystroke(Keys.backspace(), { }),
          tinyApis.sAssertContent('<ul><li>a</li></ul>')
        ])),
        Logger.t('backspace from p into li', GeneralSteps.sequence([
          tinyApis.sFocus,
          tinyApis.sSetContent('<ul><li>a</li></ul><p><br /></p>'),
          tinyApis.sSetCursor([1, 0], 0),
          tinyActions.sContentKeystroke(Keys.backspace(), { }),
          tinyApis.sAssertContent('<ul><li>a</li></ul>')
        ]))
      ], onSuccess, onFailure);
    }, {
      indent: false,
      plugins: 'lists',
      toolbar: '',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);