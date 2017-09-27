asynctest(
  'browser.tinymce.plugins.textpattern.TextPatternPluginTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.GeneralSteps',
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
  function (ApproxStructure, Assertions, GeneralSteps, Logger, Pipeline, Step, TinyActions, TinyApis, TinyLoader, TextpatternPlugin, Utils, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    TextpatternPlugin();
    Theme();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      var steps = Utils.withTeardown([
        Logger.t('Italic format on single word using space', GeneralSteps.sequence([
          Utils.sSetContentAndPressSpace(tinyApis, tinyActions, '*a*'),
          tinyApis.sAssertContentStructure(Utils.inlineStructHelper('em', 'a'))
        ])),
        Logger.t('Bold format on single word using space', GeneralSteps.sequence([
          Utils.sSetContentAndPressSpace(tinyApis, tinyActions, '**a**'),
          tinyApis.sAssertContentStructure(Utils.inlineStructHelper('strong', 'a'))
        ])),
        Logger.t('Bold format on multiple words using space', GeneralSteps.sequence([
          Utils.sSetContentAndPressSpace(tinyApis, tinyActions, '**a b**'),
          tinyApis.sAssertContentStructure(Utils.inlineStructHelper('strong', 'a b'))
        ])),
        Logger.t('Bold format on single word using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '**a**'),
          tinyApis.sAssertContentStructure(Utils.inlineBlockStructHelper('strong', 'a'))
        ])),
        Logger.t('H1 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '# a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h1', ' a'))
        ])),
        Logger.t('H2 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '## a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h2', ' a'))
        ])),
        Logger.t('H3 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '### a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h3', ' a'))
        ])),
        Logger.t('H4 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '#### a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h4', ' a'))
        ])),
        Logger.t('H5 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '##### a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h5', ' a'))
        ])),
        Logger.t('H6 format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '###### a'),
          tinyApis.sAssertContentStructure(Utils.blockStructHelper('h6', ' a'))
        ])),
        Logger.t('OL format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '1. a'),
          tinyApis.sAssertContentPresence({ 'ol': 1, 'li':2 })
        ])),
        Logger.t('UL format on single word node using enter', GeneralSteps.sequence([
          Utils.sSetContentAndPressEnter(tinyApis, tinyActions, '* a'),
          tinyApis.sAssertContentPresence({ 'ul': 1, 'li':2 })
        ])),
        Logger.t('getPatterns/setPatterns', Step.sync(function () {
          editor.plugins.textpattern.setPatterns([
              { start: '#', format: 'h1' },
              { start: '##', format: 'h2' },
              { start: '###', format: 'h3' }
          ]);

          Assertions.assertEq(
              'should be the same',
              editor.plugins.textpattern.getPatterns(),
            [
              {
                "format": "h1",
                "start": "#"
              },
              {
                "format": "h2",
                "start": "##"
              },

              {
                "format": "h3",
                "start": "###"
              }
            ]
            );
        }))
      ], tinyApis.sSetContent(''));

      Pipeline.async({}, steps, onSuccess, onFailure);
    }, {
      plugins: 'textpattern',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);