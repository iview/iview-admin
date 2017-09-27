asynctest(
  'browser.tinymce.plugins.lists.SplitButtonTest',
  [
    'tinymce.plugins.advlist.Plugin',
    'tinymce.plugins.lists.Plugin',
    'tinymce.themes.modern.Theme',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'ephox.agar.api.Pipeline'
  ],
  function (
    AdvListPlugin, ListsPlugin, ModernTheme, LegacyUnit, TinyLoader, Pipeline
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    AdvListPlugin();
    ListsPlugin();
    ModernTheme();

    suite.test("Replace splitbutton control with button when advlist_number_styles/advlist_bullet_styles are empty", function (editor) {
      LegacyUnit.equal(editor.buttons.numlist.type, 'button');
      LegacyUnit.equal(editor.buttons.bullist.type, 'button');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'advlist lists',
      advlist_bullet_styles: '',
      advlist_number_styles: '',
      toolbar: 'numlist bullist',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);