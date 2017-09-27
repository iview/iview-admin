asynctest(
  'browser.tinymce.plugins.imagetools.ImageToolsErrorTest',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiFinder',
    'ephox.katamari.api.Arr',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.sugar.api.properties.Html',
    'global!document',
    'tinymce.core.util.URI',
    'tinymce.plugins.imagetools.Plugin',
    'tinymce.plugins.imagetools.test.ImageOps',
    'tinymce.plugins.imagetools.test.ImageUtils',
    'tinymce.themes.modern.Theme'
  ],
  function (
    Assertions, Chain, GeneralSteps, Logger, Mouse, Pipeline, RawAssertions, Step, UiFinder, Arr, TinyApis, TinyDom, TinyLoader, Html, document, URI, Plugin,
    ImageOps, ImageUtils, ModernTheme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];
    var uploadHandlerState = ImageUtils.createStateContainer();

    var corsUrl = 'http://moxiecode.cachefly.net/tinymce/v9/images/logo.png';

    Plugin();
    ModernTheme();

    var sAssertErrorMessage = function (html) {
      return Chain.asStep(TinyDom.fromDom(document.body), [
        UiFinder.cWaitFor('Could not find notification', '.mce-notification-inner'),
        Chain.mapper(Html.get),
        Assertions.cAssertHtml('Message html does not match', html)
      ]);
    };

    var sCloseErrorMessage = Chain.asStep(TinyDom.fromDom(document.body), [
      UiFinder.cWaitFor('Could not find notification', '.mce-notification > button'),
      Mouse.cClick
    ]);


    TinyLoader.setup(
      function (editor, onSuccess, onFailure) {
        var tinyApis = TinyApis(editor);
        var stepsWithTeardown = Arr.bind([
          Logger.t('incorrect service url no api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', 'http://0.0.0.0.0.0/'),
            tinyApis.sSetSetting('api_key', undefined),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy HTTP error: Incorrect Image Proxy URL')
          ])),

          Logger.t('incorrect service url with api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', 'http://0.0.0.0.0.0/'),
            tinyApis.sSetSetting('api_key', 'fake_key'),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy HTTP error: Incorrect Image Proxy URL')
          ])),

          Logger.t('403 no api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', '/custom/403'),
            tinyApis.sSetSetting('api_key', undefined),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy HTTP error: Rejected request')
          ])),

          Logger.t('403 with api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', '/custom/403'),
            tinyApis.sSetSetting('api_key', 'fake_key'),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy Service error: Invalid JSON in service error message')
          ])),

          Logger.t('403 with api key and return error data', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', '/custom/403data'),
            tinyApis.sSetSetting('api_key', 'fake_key'),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy Service error: Unknown service error')
          ])),

          Logger.t('404 no api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', '/custom/404'),
            tinyApis.sSetSetting('api_key', undefined),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy HTTP error: Could not find Image Proxy')
          ])),

          Logger.t('404 with api key', GeneralSteps.sequence([
            uploadHandlerState.sResetState,
            tinyApis.sSetSetting('imagetools_proxy', '/custom/404'),
            tinyApis.sSetSetting('api_key', 'fake_key'),
            ImageUtils.sLoadImage(editor, corsUrl),
            tinyApis.sSelect('img', []),
            ImageUtils.sExecCommand(editor, 'mceImageFlipHorizontal'),
            sAssertErrorMessage('ImageProxy HTTP error: Could not find Image Proxy')
          ]))
        ], function (step) {
          return [
            step,
            GeneralSteps.sequence([
              sCloseErrorMessage,
              tinyApis.sSetContent('')
            ])
          ];
        });


        Pipeline.async({}, stepsWithTeardown, onSuccess, onFailure);
      },
      {
        plugins: 'imagetools',
        automatic_uploads: false,
        skin_url: '/project/src/skins/lightgray/dist/lightgray'
      },
      success,
      failure
    );
  }
);
