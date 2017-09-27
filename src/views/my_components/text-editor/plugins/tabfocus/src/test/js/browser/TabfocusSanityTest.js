asynctest(
  'browser.tinymce.plugins.tabfocus.TabfocusSanityTest',
  [
    'ephox.agar.api.Keys',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyActions',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'global!document',
    'tinymce.plugins.tabfocus.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Keys, Pipeline, RawAssertions, Step, Waiter, TinyActions, TinyApis, TinyLoader, document, TabfocusPlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    TabfocusPlugin();

    var sAddInputs = function (editor) {
      return Step.sync(function () {
        var container = editor.getContainer();
        var input1 = document.createElement('input');
        input1.id = 'tempinput1';

        container.parentNode.insertBefore(input1, container);
      });
    };

    var sRemoveInputs = Step.sync(function () {
      var input1 = document.getElementById('tempinput1');

      input1.parentNode.removeChild(input1);
    });

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyActions = TinyActions(editor);
      var tinyApis = TinyApis(editor);

      Pipeline.async({}, [
        sAddInputs(editor),
        tinyApis.sFocus,
        Step.sync(function () {
          RawAssertions.assertEq('should be same', 'IFRAME', document.activeElement.nodeName);
        }),
        tinyActions.sContentKeystroke(Keys.tab(), {}),
        Waiter.sTryUntil('vait for focus',
          Step.sync(function () {
            var input = document.getElementById('tempinput1');
            RawAssertions.assertEq('should be same', input.outerHTML, document.activeElement.outerHTML);
          }), 100, 4000),
        sRemoveInputs
      ], onSuccess, onFailure);
    }, {
      plugins: 'tabfocus',
      tabfocus_elements: 'tempinput1',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);