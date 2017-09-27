asynctest(
  'browser.tinymce.plugins.image.ImagePluginTest',
  [
    'ephox.agar.api.Pipeline',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Step',
    'ephox.agar.api.Chain',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Logger',
    'ephox.katamari.api.Arr',
    'tinymce.plugins.image.Plugin',
    'ephox.mcagar.api.TinyLoader',
    'ephox.mcagar.api.TinyApis',
    'ephox.mcagar.api.TinyUi',
    'tinymce.themes.modern.Theme',
    'tinymce.core.file.Conversions'
  ],
  function (Pipeline, GeneralSteps, Step, Chain, Assertions, Logger, Arr, Plugin, TinyLoader, TinyApis, TinyUi, Theme, Conversions) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var src = 'http://moxiecode.cachefly.net/tinymce/v9/images/logo.png';

    Theme();
    Plugin();

    TinyLoader.setup(function (editor, onSuccess, onFailure) {
      var api = TinyApis(editor);
      var ui = TinyUi(editor);

      var cPopupToDialog = function (selector) {
        return Chain.fromChains([
          ui.cWaitForPopup("Locate popup", selector),
          Chain.on(function (container, next, die) {
            return Arr.find(editor.windowManager.getWindows(), function (win) {
              return container.dom().id === win._id;
            }).fold(die, function (win) {
              next(Chain.wrap(win));
            });
          })
        ]);
      };

      var sAssertImageTab = function (title, isPresent) {
        return GeneralSteps.sequence([
          ui.sClickOnToolbar("Trigger Image dialog", 'div[aria-label="Insert/edit image"]'),
          Chain.asStep({}, [
            ui.cWaitForPopup("Wait for Image dialog", 'div[role="dialog"][aria-label="Insert/edit image"]'),
            Chain.op(function (container) {
              var expected = {};
              expected['.mce-tab:contains("' + title + '")'] = isPresent ? 1 : 0;
              Assertions.assertPresence("Asserting presence", expected, container);
            })
          ]),
          ui.sClickOnUi("Close dialog", 'button:contains("Cancel")')
        ]);
      };

      var sTriggerUpload = Step.async(function (next, die) {
        var b64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
        Conversions.uriToBlob(b64).then(function (blob) {
          Pipeline.async({}, [
            Chain.asStep({}, [
              cPopupToDialog('div[role="dialog"][aria-label="Insert/edit image"]'),
              Chain.op(function (win) {
                var browseBtn = win.find('browsebutton')[0];
                browseBtn.value = function () {
                  return blob;
                };
                browseBtn.fire('change');
              })
            ])
          ], next, die);
        });
      });


      var sAssertTextValue = function (fieldName, value) {
        return Chain.asStep({}, [
          cPopupToDialog('div[role="dialog"][aria-label="Insert/edit image"]'),
          Chain.op(function (win) {
            Assertions.assertEq("Assert field " + src + " value ", win.find('#' + fieldName).value(), value);
          })
        ]);
      };

      Pipeline.async({}, [
        Logger.t("Upload tab should be present when images_upload_url is set to some truthy value", GeneralSteps.sequence([
          api.sSetContent('<p><img src="' + src + '" /></p>'),
          api.sSelect('img', []),
          api.sSetSetting('image_advtab', false), // make sure that Advanced tab appears separately
          api.sSetSetting('images_upload_url', 'postAcceptor.php'),
          sAssertImageTab('Upload', true),
          sAssertImageTab('Advanced', false),
          api.sSetSetting('image_advtab', true),
          api.sSetSetting('images_upload_url', null),
          sAssertImageTab('Upload', false),
          sAssertImageTab('Advanced', true)
        ])),

        Logger.t("Image uploader should take into account some shared settings, like images_upload_url and images_upload_handler", GeneralSteps.sequence([
          api.sSetContent('<p><img src="' + src + '" /></p>'),
          api.sSelect('img', []),
          api.sSetSetting('images_upload_handler', function (blobInfo, success) {
            return success('file.jpg');
          }),
          api.sSetSetting('images_upload_url', 'postAcceptor.php'),
          ui.sClickOnToolbar("Trigger Image dialog", 'div[aria-label="Insert/edit image"]'),
          ui.sWaitForPopup("Wait for Image dialog", 'div[role="dialog"][aria-label="Insert/edit image"]'),
          ui.sClickOnUi("Switch to Upload tab", '.mce-tab:contains("Upload")'),
          sTriggerUpload,
          ui.sWaitForUi("Wait for General tab to activate", '.mce-tab.mce-active:contains("General")'),
          sAssertTextValue('src', 'file.jpg')
        ]))
      ], onSuccess, onFailure);
    }, {
      plugins: 'image',
      indent: false,
      skin_url: '/project/src/skins/lightgray/dist/lightgray'
    }, success, failure);
  }
);