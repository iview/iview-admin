asynctest(
  'browser.tinymce.plugins.charmap.CharMapPluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.mcagar.api.LegacyUnit',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.charmap.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Pipeline, LegacyUnit, TinyLoader, Plugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var suite = LegacyUnit.createSuite();

    Plugin();
    Theme();

    suite.test('Replace characters by array', function (editor) {
      editor.settings.charmap = [
        [65, 'Latin A'],
        [66, 'Latin B']
      ];

      LegacyUnit.deepEqual(editor.plugins.charmap.getCharMap(), [
        [65, 'Latin A'],
        [66, 'Latin B']
      ]);
    });

    suite.test('Replace characters by function', function (editor) {
      editor.settings.charmap = function () {
        return [
          [65, 'Latin A fun'],
          [66, 'Latin B fun']
        ];
      };

      LegacyUnit.deepEqual(editor.plugins.charmap.getCharMap(), [
        [65, 'Latin A fun'],
        [66, 'Latin B fun']
      ]);
    });

    suite.test('Append characters by array', function (editor) {
      editor.settings.charmap = [
        [67, 'Latin C']
      ];

      editor.settings.charmap_append = [
        [65, 'Latin A'],
        [66, 'Latin B']
      ];

      LegacyUnit.deepEqual(editor.plugins.charmap.getCharMap(), [
        [67, 'Latin C'],
        [65, 'Latin A'],
        [66, 'Latin B']
      ]);
    });

    suite.test('Append characters by function', function (editor) {
      editor.settings.charmap = [
        [67, 'Latin C']
      ];

      editor.settings.charmap_append = function () {
        return [
          [65, 'Latin A fun'],
          [66, 'Latin B fun']
        ];
      };

      LegacyUnit.deepEqual(editor.plugins.charmap.getCharMap(), [
        [67, 'Latin C'],
        [65, 'Latin A fun'],
        [66, 'Latin B fun']
      ]);
    });

    suite.test('Insert character', function (editor) {
      var lastEvt;

      editor.on('insertCustomChar', function (e) {
        lastEvt = e;
      });

      editor.plugins.charmap.insertChar('A');
      LegacyUnit.equal(lastEvt.chr, 'A');
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, suite.toSteps(editor), onSuccess, onFailure);
    }, {
      plugins: 'charmap',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);