asynctest(
  'tinymce.plugins.paste.browser.ProcessFiltersTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Pipeline',
    'ephox.katamari.api.Fun',
    'ephox.mcagar.api.TinyLoader',
    'tinymce.plugins.paste.core.ProcessFilters',
    'tinymce.plugins.paste.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (Assertions, Chain, Logger, Pipeline, Fun, TinyLoader, ProcessFilters, PastePlugin, Theme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    Theme();
    PastePlugin();

    var cProcessPre = function (html, internal, preProcess) {
      return Chain.mapper(function (editor) {
        editor.on('PastePreProcess', preProcess);

        var result = ProcessFilters.process(editor, html, internal);

        editor.off('PastePreProcess', preProcess);

        return result;
      });
    };

    var cProcessPrePost = function (html, internal, preProcess, postProcess) {
      return Chain.mapper(function (editor) {
        editor.on('PastePreProcess', preProcess);
        editor.on('PastePostProcess', postProcess);

        var result = ProcessFilters.process(editor, html, internal);

        editor.off('PastePreProcess', preProcess);
        editor.off('PastePostProcess', postProcess);

        return result;
      });
    };

    var preventHandler = function (e) {
      e.preventDefault();
    };

    var preProcessHandler = function (e) {
      e.content += 'X';
    };

    var postProcessHandler = function (editor) {
      return function (e) {
        editor.dom.remove(editor.dom.select('b', e.node), true);
      };
    };

    var assertInternal = function (expectedFlag) {
      return function (e) {
        Assertions.assertEq('Should be expected internal flag', expectedFlag, e.internal);
      };
    };

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      Pipeline.async({}, [
        Logger.t('Paste pre process only', Chain.asStep(editor, [
          cProcessPre('a', true, preProcessHandler),
          Assertions.cAssertEq('Should be preprocessed by adding a X', { content: 'aX', cancelled: false })
        ])),

        Logger.t('Paste pre/post process passthough as is', Chain.asStep(editor, [
          cProcessPrePost('a', true, Fun.noop, Fun.noop),
          Assertions.cAssertEq('Should be unchanged', { content: 'a', cancelled: false })
        ])),

        Logger.t('Paste pre/post process assert internal false', Chain.asStep(editor, [
          cProcessPrePost('a', false, assertInternal(false), assertInternal(false)),
          Assertions.cAssertEq('Should be unchanged', { content: 'a', cancelled: false })
        ])),

        Logger.t('Paste pre/post process assert internal true', Chain.asStep(editor, [
          cProcessPrePost('a', true, assertInternal(true), assertInternal(true)),
          Assertions.cAssertEq('Should be unchanged', { content: 'a', cancelled: false })
        ])),

        Logger.t('Paste pre/post process alter on preprocess', Chain.asStep(editor, [
          cProcessPrePost('a', true, preProcessHandler, Fun.noop),
          Assertions.cAssertEq('Should be preprocessed by adding a X', { content: 'aX', cancelled: false })
        ])),

        Logger.t('Paste pre/post process alter on postprocess', Chain.asStep(editor, [
          cProcessPrePost('a<b>b</b>c', true, Fun.noop, postProcessHandler(editor)),
          Assertions.cAssertEq('Should have all b elements removed', { content: 'abc', cancelled: false })
        ])),

        Logger.t('Paste pre/post process alter on preprocess/postprocess', Chain.asStep(editor, [
          cProcessPrePost('a<b>b</b>c', true, preProcessHandler, postProcessHandler(editor)),
          Assertions.cAssertEq('Should have all b elements removed and have a X added', { content: 'abcX', cancelled: false })
        ])),

        Logger.t('Paste pre/post process prevent default on preProcess', Chain.asStep(editor, [
          cProcessPrePost('a<b>b</b>c', true, preventHandler, postProcessHandler(editor)),
          Assertions.cAssertEq('Should have all b elements removed and be cancelled', { content: 'a<b>b</b>c', cancelled: true })
        ])),

        Logger.t('Paste pre/post process prevent default on postProcess', Chain.asStep(editor, [
          cProcessPrePost('a<b>b</b>c', true, preProcessHandler, preventHandler),
          Assertions.cAssertEq('Should have a X added and be cancelled', { content: 'a<b>b</b>cX', cancelled: true })
        ]))
      ], onSuccess, onFailure);
    }, {
      add_unload_trigger: false,
      indent: false,
      plugins: 'paste',
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);