asynctest(
  'browser.tinymce.plugins.image.FigureDeleteTest',
  [
    'ephox.agar.api.ApproxStructure',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Mouse',
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.UiControls',
    'ephox.agar.api.UiFinder',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyDom',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyUi',
    'global!document',
    'tinymce.plugins.image.Plugin',
    'tinymce.themes.modern.Theme'
  ],
  function (ApproxStructure, Chain, GeneralSteps, Logger, Mouse, Pipeline, UiControls, UiFinder, TinyApis, TinyDom, TinyLoader, TinyUi, document, ImagePlugin, ModernTheme) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    ModernTheme();
    ImagePlugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var tinyApis = TinyApis(editor);
      var tinyUi = TinyUi(editor);

      Pipeline.async({}, [
        tinyApis.sFocus,
        Logger.t('removing src in dialog should remove figure element', GeneralSteps.sequence([
          tinyApis.sSetContent('<figure class="image"><img contenteditable="true" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" /><figcaption>x</figcaption></figure>'),
          tinyApis.sSetSelection([0], 0, [0], 1),
          tinyUi.sClickOnToolbar('click on image button', 'div[aria-label="Insert/edit image"] button'),
          Chain.asStep({}, [
            tinyUi.cWaitForPopup('Wait for dialog', 'div[role="dialog"]'),
            UiFinder.cFindIn('label:contains("Source")'),
            Chain.mapper(function (val) {
              var inputElm = document.getElementById(val.dom().htmlFor).querySelector('input');
              return TinyDom.fromDom(inputElm);
            }),
            UiControls.cSetValue('')
          ]),
          tinyUi.sClickOnUi('click on ok button', 'button:contains("Ok")'),
          tinyApis.sAssertContent('')
        ])),

        Logger.t('clicking caption textbox removes figure and adds image only', GeneralSteps.sequence([
          tinyApis.sSetContent('<figure class="image"><img contenteditable="true" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" /><figcaption>x</figcaption></figure>'),
          tinyApis.sSetSelection([0], 0, [0], 1),
          tinyUi.sClickOnToolbar('click on image button', 'div[aria-label="Insert/edit image"] button'),
          Chain.asStep({}, [
            tinyUi.cWaitForPopup('Wait for dialog', 'div[role="dialog"]'),
            UiFinder.cFindIn('label:contains("Caption")'),
            Chain.mapper(function (val) {
              return TinyDom.fromDom(document.getElementById(val.dom().htmlFor));
            }),
            Mouse.cClick
          ]),
          tinyUi.sClickOnUi('click on ok button', 'button:contains("Ok")'),
          tinyApis.sAssertContentPresence({ 'img[contenteditable="true"]': 0 })
        ]))

      ], onSuccess, onFailure);
    }, {
      plugins: 'image',
      toolbar: 'image',
      image_caption: true,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);