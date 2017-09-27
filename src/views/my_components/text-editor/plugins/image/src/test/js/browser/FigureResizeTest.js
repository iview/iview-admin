asynctest(
  'browser.tinymce.plugins.image.FigureResizeTest',
  [
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.NamedChain',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.RawAssertions',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiControls',
    'ephox.agar.api.UiFinder',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.plugins.image.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (
    Chain, GeneralSteps, Logger, Mouse, NamedChain, Pipeline, RawAssertions, Step, UiControls, UiFinder, Waiter, TinyApis, TinyDom, TinyLoader, TinyUi, document,
    ImagePlugin, ModernTheme
  ) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    ImagePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,

        Logger.t('image added with caption should show resize handles when clicked', GeneralSteps.sequence([
          tinyUi.sClickOnToolbar('click image button', 'div[aria-label="Insert/edit image"] button'),
          Chain.asStep({}, [
            NamedChain.asChain([
              NamedChain.write('dialog', tinyUi.cWaitForPopup('Wait for dialog', 'div[role="dialog"]')),
              NamedChain.direct('dialog', Chain.fromChains([
                UiFinder.cFindIn('label:contains("Source")'),
                Chain.mapper(function (val) {
                  var inputElm = document.getElementById(val.dom().htmlFor).querySelector('input');
                  return TinyDom.fromDom(inputElm);
                }),
                UiControls.cSetValue('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
              ]), 'scratch'),
              NamedChain.direct('dialog', Chain.fromChains([
                UiFinder.cFindIn('input[aria-label="Width"]'),
                UiControls.cSetValue('100')
              ]), 'scratch'),
              NamedChain.direct('dialog', Chain.fromChains([
                UiFinder.cFindIn('input[aria-label="Height"]'),
                UiControls.cSetValue('100')
              ]), 'scratch'),
              NamedChain.direct('dialog', Chain.fromChains([
                UiFinder.cFindIn('label:contains("Caption")'),
                Chain.mapper(function (val) {
                  return TinyDom.fromDom(document.getElementById(val.dom().htmlFor));
                }),
                Mouse.cClick
              ]), 'scratch')
            ])
          ]),
          tinyUi.sClickOnUi('click on ok button', 'button:contains("Ok")'),
          Chain.asStep({}, [
            Chain.mapper(function () {
              return TinyDom.fromDom(editor.getBody());
            }),
            UiFinder.cFindIn('figure > img'),
            Mouse.cTrueClick
          ]),
          tinyApis.sAssertSelection([0], 0, [0], 1),
          Waiter.sTryUntil('Wait for resize handles',
            Step.sync(function () {
              RawAssertions.assertEq('Resize handle should exist', editor.dom.select('#mceResizeHandlenw').length, 1);
            }), 100, 4000
          )
        ]))

      ], onSuccess, onFailure);
    }, {
      plugins: 'image',
      toolbar: 'image',
      indent: false,
      image_caption: true,
      height: 400,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);