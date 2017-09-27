asynctest(
  'browser.tinymce.plugins.wordcount.ApiTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.wordcount.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test("Blank document has 0 words", function (editor) {
      editor.setContent('');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 0);
    });

    suite.test("Simple word count", function (editor) {
      editor.setContent('<p>My sentence is this.</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 4);
    });

    suite.test("Does not count dashes", function (editor) {
      editor.setContent('<p>Something -- ok</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 2);
    });

    suite.test("Does not count asterisks, non-word characters", function (editor) {
      editor.setContent('<p>* something\n\u00b7 something else</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 3);
    });

    suite.test("Does count numbers", function (editor) {
      editor.setContent('<p>Something 123 ok</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 3);
    });

    suite.test("Does not count htmlentities", function (editor) {
      editor.setContent('<p>It&rsquo;s my life &ndash; &#8211; &#x2013; don\'t you forget.</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 6);
    });

    suite.test("Counts hyphenated words as one word", function (editor) {
      editor.setContent('<p>Hello some-word here.</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 3);
    });

    suite.test("Counts words between blocks as two words", function (editor) {
      editor.setContent('<p>Hello</p><p>world</p>');
      var result = editor.plugins.wordcount.getCount();
      LegacyUnit.equal(result, 2);
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'wordcount',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);