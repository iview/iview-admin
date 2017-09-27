asynctest(
  'browser.tinymce.plugins.textpattern.TrailingPunctuationTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'tinymce.plugins.textpattern.Plugin',
    'tinymce.plugins.textpattern.test.Utils',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, GeneralSteps, Keys, Logger, Pipeline, Step, Waiter, TinyActions, TinyApis, TinyDom, TinyLoader, TinyUi, TextpatternPlugin, Utils, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TextpatternPlugin();

    var sTypeChar = function (editor, character) {
      return Step.sync(function () {
        var charCode = character.charCodeAt(0);
        editor.fire('keypress', { charCode: charCode });
      });
    };

    var sTypeAndTrigger = function (tinyApis, editor) {
      return function (label, patternText, trigger, tag, rawText) {
        return Logger.t(label, GeneralSteps.sequence([
          tinyApis.sSetContent('<p>' + patternText + trigger + '</p>'),
          tinyApis.sFocus,
          tinyApis.sSetCursor([0, 0], patternText.length + 1),
          sTypeChar(editor, trigger),
          Waiter.sTryUntil(
            'did not get expected format',
            tinyApis.sAssertContentStructure(ApproxStructure.build(function (s, str) {
              return s.element('body', {
                children: [
                  s.element('p', {
                    children: [
                      s.element(tag, {
                        children: [
                          s.text(str.is(rawText))
                        ]
                      }),
                      s.text(str.is(trigger))
                    ]
                  })
                ]
              });
            })), 100, 4000
          )
        ]));
      };
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tnt = sTypeAndTrigger(tinyApis, editor);

      Pipeline.async({}, [
        tnt('em with ,', '*a*', ',', 'em', 'a'),
        tnt('strong with ,', '**a**', ',', 'strong', 'a'),
        tnt('em with .', '*a*', '.', 'em', 'a'),
        tnt('strong with .', '**a**', '.', 'strong', 'a'),
        tnt('em with ;', '*a*', ';', 'em', 'a'),
        tnt('strong with ;', '**a**', ';', 'strong', 'a'),
        tnt('em with :', '*a*', ':', 'em', 'a'),
        tnt('strong with :', '**a**', ':', 'strong', 'a'),
        tnt('em with !', '*a*', '!', 'em', 'a'),
        tnt('strong with !', '**a**', '!', 'strong', 'a'),
        tnt('em with ?', '*a*', '?', 'em', 'a'),
        tnt('strong with ?', '**a**', '?', 'strong', 'a')
      ], onSuccess, onFailure);
    }, {
      plugins: 'textpattern',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);