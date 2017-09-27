asynctest(
  'browser.tinymce.plugins.lists.ChangeListStyleTest',
  [
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (GeneralSteps, Logger, Pipeline, Step, TinyApis, TinyLoader, TinyUi, AdvlistPlugin, ListsPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    ListsPlugin();
    AdvlistPlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        Logger.t('ul to alpha, cursor only in parent', GeneralSteps.sequence([
          tinyApis.sSetContent('<ul><li>a</li><ul><li>b</li></ul></ul>'),
          tinyApis.sSetCursor([0, 0, 0], 0, [0, 0, 0], 0),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Numbered list"] button.mce-open'),
          tinyUi.sClickOnUi('click lower alpha item', 'div[role="menuitem"] span:contains("Lower Alpha")'),
          tinyApis.sAssertContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ul><li>b</li></ul></ol>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),
        Logger.t('ul to alpha, selection from parent to sublist', GeneralSteps.sequence([
          tinyApis.sSetContent('<ul><li>a</li><ul><li>b</li></ul></ul>'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 1, 0, 0], 1),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Numbered list"] button.mce-open'),
          tinyUi.sClickOnUi('click lower alpha item', 'div[role="menuitem"] span:contains("Lower Alpha")'),
          tinyApis.sAssertContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 1, 0, 0], 1)
        ])),
        Logger.t('ol to ul, cursor only in parent', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol><li>a</li><ol><li>b</li></ol></ol>'),
          tinyApis.sSetCursor([0, 0, 0], 0),
          tinyUi.sClickOnToolbar('click bullist button', 'div[aria-label="Bullet list"] > button'),
          tinyApis.sAssertContent('<ul><li>a</li><ol><li>b</li></ol></ul>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),
        Logger.t('ol to ul, selection from parent to sublist', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol><li>a</li><ol><li>b</li></ol></ol>'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 1, 0, 0], 1),
          tinyUi.sClickOnToolbar('click bullist button', 'div[aria-label="Bullet list"] > button'),
          tinyApis.sAssertContent('<ul><li>a</li><ul><li>b</li></ul></ul>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 1, 0, 0], 1)
        ])),
        Logger.t('alpha to ol, cursor only in parent', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sSetCursor([0, 0, 0], 0, [0, 0, 0], 0),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Numbered list"] button.mce-open'),
          tinyUi.sClickOnUi('click lower alpha item', 'div[role="menuitem"] span:contains("Default")'),
          tinyApis.sAssertContent('<ol><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),
        Logger.t('alpha to ol, selection from parent to sublist', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 1, 0, 0], 1),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Numbered list"] button.mce-open'),
          tinyUi.sClickOnUi('click lower alpha item', 'div[role="menuitem"] span:contains("Default")'),
          tinyApis.sAssertContent('<ol><li>a</li><ol><li>b</li></ol></ol>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 1, 0, 0], 1)
        ])),
        Logger.t('alpha to ul, cursor only in parent', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sSetCursor([0, 0, 0], 0, [0, 0, 0], 0),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Bullet list"] > button'),
          tinyApis.sAssertContent('<ul><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ul>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 0, 0], 0)
        ])),
        Logger.t('alpha to ul, selection from parent to sublist', GeneralSteps.sequence([
          tinyApis.sSetContent('<ol style="list-style-type: lower-alpha;"><li>a</li><ol style="list-style-type: lower-alpha;"><li>b</li></ol></ol>'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 1, 0, 0], 1),
          tinyUi.sClickOnToolbar('click numlist button', 'div[aria-label="Bullet list"] > button'),
          tinyApis.sAssertContent('<ul><li>a</li><ul><li>b</li></ul></ul>'),
          tinyApis.sAssertSelection([0, 0, 0], 0, [0, 1, 0, 0], 1)
        ]))
      ], onSuccess, onFailure);
    }, {
      indent: false,
      plugins: 'lists advlist',
      toolbar: 'numlist bullist',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);