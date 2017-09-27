asynctest(
  'browser.tinymce.plugins.table.quirks.KeyboardNavigationCellNavigationTest',
  [
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.katamari.api.Cell',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.core.Env',
    'tinymce.plugins.table.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Keys, Pipeline, RawAssertions, Step, Waiter, Cell, TinyActions, TinyApis, TinyLoader, Env, TablePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TablePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyActions = TinyActions(editor);

      var selectionChangeState = Cell(false);

      Pipeline.async({}, Env.webkit ? [
        tinyApis.sFocus,
        tinyApis.sSetContent(
          '<table><tbody><tr><td><ul><li>a</li><li>b</li></ul></td></tr><tr><td><ul><li>c</li><li>d</li></ul></td></tr></tbody></table>'
        ),
        tinyApis.sSetCursor([0, 0, 0, 0, 0, 1, 0], 0),
        tinyActions.sContentKeydown(Keys.down(), {}),
        tinyApis.sSetCursor([0, 0, 1, 0, 0, 0, 0], 0),
        Step.sync(function () {
          editor.on('selectionchange', function () {
            selectionChangeState.set(true);
          });
        }),
        Waiter.sTryUntil(
          'editor did not have correct selection',
          Step.sync(function () {
            RawAssertions.assertEq('state is true', true, selectionChangeState.get());
          }),
          100, 3000
        ),
        tinyApis.sAssertSelection([0, 0, 1, 0, 0, 0, 0], 0, [0, 0, 1, 0, 0, 0, 0], 0)
      ] : [], onSuccess, onFailure);
    }, {
      plugins: 'table',
      skin_url: '/project/src/skins/lightgray/dist/lightgray',
      height: 300
    }, success, failure);
  }
);