asynctest(
  'browser.tinymce.plugins.spellchecker.SpellcheckerTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, RawAssertions, Step, TinyLoader, Settings, SpellcheckerPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    SpellcheckerPlugin();

    var sTestDefaultLanguage = function (editor) {
      return Step.sync(function () {
        RawAssertions.assertEq('should be same', Settings.getLanguage(editor), 'en');
      });
    };

    var sCheckButtonType = function (editor, expected) {
      return Step.sync(function () {
        var button = editor.buttons.spellchecker;

        RawAssertions.assertEq('should have same type', expected, button.type);
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, [
        sTestDefaultLanguage(editor),
        sCheckButtonType(editor, 'splitbutton')
      ], onSuccess, onFailure);
    }, {
      plugins: 'spellchecker',
      toolbar: 'spellchecker',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);