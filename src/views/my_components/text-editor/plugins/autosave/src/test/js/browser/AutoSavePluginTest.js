asynctest(
  'browser.tinymce.plugins.autosave.AutoSavePluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.autosave.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test("isEmpty true", function (editor) {
      LegacyUnit.equal(editor.plugins.autosave.isEmpty(''), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('   '), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('\t\t\t'), true);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p id="x"></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p> </p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p>\t</p>'), true);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br /></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br data-mce-bogus="true" /></p>'), true);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br><br></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br /><br /></p>'), true);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br data-mce-bogus="true" /><br data-mce-bogus="true" /></p>'), true);
    });

    suite.test("isEmpty false", function (editor) {
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('X'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('   X'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('\t\t\tX'), false);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p>X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p> X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p>\tX</p>'), false);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br>X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br />X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br data-mce-bogus="true" />X</p>'), false);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br><br>X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br /><br />X</p>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<p><br data-mce-bogus="true" /><br data-mce-bogus="true" />X</p>'), false);

      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<h1></h1>'), false);
      LegacyUnit.equal(editor.plugins.autosave.isEmpty('<img src="x" />'), false);
    });

    suite.test("hasDraft/storeDraft/restoreDraft", function (editor) {
      LegacyUnit.equal(editor.plugins.autosave.hasDraft(), false);

      editor.setContent('X');
      editor.undoManager.add();
      editor.plugins.autosave.storeDraft();

      LegacyUnit.equal(editor.plugins.autosave.hasDraft(), true);

      editor.setContent('Y');
      editor.undoManager.add();

      editor.plugins.autosave.restoreDraft();
      LegacyUnit.equal(editor.getContent(), '<p>X</p>');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'autosave',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);