asynctest(
  'browser.tinymce.plugins.compat3x.Compat3xPluginTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Monitor',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiFinder',
    'ephox.katamari.api.Fun',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'ephox.sugar.api.node.Element',
    'global!window',
    'tinymce.core.api.Tinymce',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, GeneralSteps, Logger, Monitor, Pipeline, Step, UiFinder, Fun, TinyApis, TinyLoader, TinyUi, Element, window, Tinymce, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    window.tinymce = Tinymce;
    ModernTheme();

    var getDialogWindow = function (editor) {
      return editor.windowManager.getWindows()[0].getContentWindow();
    };

    var sAddI18n = function (prefix, data) {
      return Step.sync(function () {
        Tinymce.addI18n(prefix, data);
      });
    };

    var sOpenWindow = function (editor, settings) {
      return Step.sync(function () {
        editor.windowManager.open(settings);
      });
    };

    var sDialogExecCommand = function (editor, cmd) {
      return Step.sync(function () {
        var win = getDialogWindow(editor);
        win.tinyMCEPopup.execCommand(cmd);
      });
    };

    var sExistInDialog = function (editor, selector) {
      return Chain.asStep({}, [
        Chain.mapper(function (_) {
          return Element.fromDom(getDialogWindow(editor).document.body);
        }),
        UiFinder.cFindIn(selector)
      ]);
    };

    var sRegisterCompatEvent = function (editor, eventName, f) {
      return Step.sync(function (done, die) {
        editor[eventName].add(f);
      });
    };

    var sAssertMonitorCount = function (label, expectedCount, monitor) {
      return Step.sync(function () {
        Assertions.assertEq(label, expectedCount, monitor.get());
      });
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyUi = TinyUi(editor);
      var tinyApis = TinyApis(editor);
      var setContentMonitor = Monitor(0, Fun.noop);
      var getContentMonitor = Monitor(0, Fun.noop);

      Pipeline.async({}, [
        Logger.t('Open a dialog with i18n translations and execute bold command and make sure events fire', GeneralSteps.sequence([
          sRegisterCompatEvent(editor, 'onSetContent', setContentMonitor.run),
          sRegisterCompatEvent(editor, 'onGetContent', getContentMonitor.run),
          tinyApis.sSetContent('<p>a</p>'),
          tinyApis.sSetSelection([0, 0], 0, [0, 0], 1),
          sAddI18n('en.prefix', { test: 'x' }),
          sOpenWindow(editor, { url: '/project/src/plugins/compat3x/src/test/html/dialog.html' }),
          tinyUi.sWaitForPopup('Wait for dialog', 'div.mce-title:contains("Dialog")'),
          sExistInDialog(editor, 'h1:contains("x")'),
          sDialogExecCommand(editor, 'bold'),
          tinyApis.sAssertContent('<p><strong>a</strong></p>'),
          sAssertMonitorCount('Set onSetContent should be fired once', 1, setContentMonitor),
          sAssertMonitorCount('Set onGetContent should be fired once', 1, getContentMonitor)
        ]))
      ], function () {
        delete window.tinymce;
        onSuccess();
      }, onFailure);
    }, {
      external_plugins: {
        'compat3x': '/project/src/plugins/compat3x/src/main/js/plugin.js'
      },
      toolbar: 'link',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);