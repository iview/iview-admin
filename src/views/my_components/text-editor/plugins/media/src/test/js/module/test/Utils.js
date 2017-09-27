define(
  'tinymce.plugins.media.test.Utils',
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Step',
    'ephox.agar.api.UiControls',
    'ephox.agar.api.UiFinder',
    'ephox.agar.api.Waiter',
    'ephox.mcagar.api.TinyDom',
    'tinymce.core.dom.DOMUtils'
  ],
  function (Assertions, Chain, GeneralSteps, Step, UiControls, UiFinder, Waiter, TinyDom, DOMUtils) {
    var sOpenDialog = function (ui) {
      return GeneralSteps.sequence([
        ui.sClickOnToolbar('Click on media button', 'div[aria-label="Insert/edit media"] > button'),
        ui.sWaitForPopup('wait for popup', 'div[role="dialog"]')
      ]);
    };

    var cFindInDialog = function (mapper) {
      return function (ui, text) {
        return Chain.fromChains([
          ui.cWaitForPopup('Wait for popup', 'div[role="dialog"]'),
          UiFinder.cFindIn('label:contains(' + text + ')'),
          Chain.mapper(function (val) {
            return TinyDom.fromDom(mapper(val));
          })
        ]);
      };
    };

    var cFindWidthInput = cFindInDialog(function (value) {
      return document.getElementById(value.dom().htmlFor).querySelector('input[aria-label="Width"]');
    });

    var cFindHeightInput = cFindInDialog(function (value) {
      return document.getElementById(value.dom().htmlFor).querySelector('input[aria-label="Height"]');
    });

    var cGetWidthValue = function (ui) {
      return Chain.fromChains([
        cFindWidthInput(ui, 'Dimensions'),
        UiControls.cGetValue
      ]);
    };

    var cSetWidthValue = function (ui, value) {
      return Chain.fromChains([
        cFindWidthInput(ui, 'Dimensions'),
        UiControls.cSetValue(value)
      ]);
    };

    var cGetHeightValue = function (ui) {
      return Chain.fromChains([
        cFindHeightInput(ui, 'Dimensions'),
        UiControls.cGetValue
      ]);
    };

    var cSetHeightValue = function (ui, value) {
      return Chain.fromChains([
        cFindHeightInput(ui, 'Dimensions'),
        UiControls.cSetValue(value)
      ]);
    };

    var sAssertWidthValue = function (ui, value) {
      return Waiter.sTryUntil('Wait for new width value',
        Chain.asStep({}, [
          cGetWidthValue(ui),
          Assertions.cAssertEq('Assert size value', value)
        ]), 1, 3000
      );
    };

    var sAssertHeightValue = function (ui, value) {
      return Waiter.sTryUntil('Wait for new height value',
        Chain.asStep({}, [
          cGetHeightValue(ui),
          Assertions.cAssertEq('Assert size value', value)
        ]), 1, 3000
      );
    };

    var sAssertSourceValue = function (ui, value) {
      return Waiter.sTryUntil('Wait for source value',
        Chain.asStep({}, [
          cFindFilepickerInput(ui, 'Source'),
          UiControls.cGetValue,
          Assertions.cAssertEq('Assert source value', value)
        ]), 1, 3000
      );
    };


    var sPasteSourceValue = function (ui, value) {
      return Chain.asStep({}, [
        cFindFilepickerInput(ui, 'Source'),
        UiControls.cSetValue(value),
        cFakeEvent('paste')
      ]);
    };

    var sChangeWidthValue = function (ui, value) {
      return Chain.asStep({}, [
        cSetWidthValue(ui, value),
        cFakeEvent('change')
      ]);
    };

    var sChangeHeightValue = function (ui, value) {
      return Chain.asStep({}, [
        cSetHeightValue(ui, value),
        cFakeEvent('change')
      ]);
    };

    var sAssertSizeRecalcConstrained = function (ui) {
      return GeneralSteps.sequence([
        sOpenDialog(ui),
        sPasteSourceValue(ui, 'http://test.se'),
        sAssertWidthValue(ui, "300"),
        sAssertHeightValue(ui, "150"),
        sChangeWidthValue(ui, "350"),
        sAssertWidthValue(ui, "350"),
        sAssertHeightValue(ui, "175"),
        sChangeHeightValue(ui, "100"),
        sAssertHeightValue(ui, "100"),
        sAssertWidthValue(ui, "200"),
        sCloseDialog(ui)
      ]);
    };

    var sAssertSizeRecalcConstrainedReopen = function (ui) {
      return GeneralSteps.sequence([
        sOpenDialog(ui),
        sPasteSourceValue(ui, 'http://test.se'),
        sAssertWidthValue(ui, "300"),
        sAssertHeightValue(ui, "150"),
        sChangeWidthValue(ui, "350"),
        sAssertWidthValue(ui, "350"),
        sAssertHeightValue(ui, "175"),
        sChangeHeightValue(ui, "100"),
        sAssertHeightValue(ui, "100"),
        sAssertWidthValue(ui, "200"),
        sSubmitAndReopen(ui),
        sAssertHeightValue(ui, "100"),
        sAssertWidthValue(ui, "200"),
        sChangeWidthValue(ui, "350"),
        sAssertWidthValue(ui, "350"),
        sAssertHeightValue(ui, "175")
      ]);
    };

    var sAssertSizeRecalcUnconstrained = function (ui) {
      return GeneralSteps.sequence([
        sOpenDialog(ui),
        sPasteSourceValue(ui, 'http://test.se'),
        ui.sClickOnUi('click checkbox', '.mce-checkbox'),
        sAssertWidthValue(ui, "300"),
        sAssertHeightValue(ui, "150"),
        sChangeWidthValue(ui, "350"),
        sAssertWidthValue(ui, "350"),
        sAssertHeightValue(ui, "150"),
        sChangeHeightValue(ui, "100"),
        sAssertHeightValue(ui, "100"),
        sAssertWidthValue(ui, "350"),
        sCloseDialog(ui)
      ]);
    };

    var sCloseDialog = function (ui) {
      return ui.sClickOnUi('Click cancel button', '.mce-i-remove');
    };

    var cFakeEvent = function (name) {
      return Chain.op(function (elm) {
        DOMUtils.DOM.fire(elm.dom(), name);
      });
    };

    var cFindFilepickerInput = cFindInDialog(function (value) {
      return document.getElementById(value.dom().htmlFor).querySelector('input');
    });

    var cFindTextarea = cFindInDialog(function (value) {
      return document.getElementById(value.dom().htmlFor);
    });

    var cSetFormItem = function (ui, value) {
      return Chain.fromChains([
        cFindFilepickerInput(ui, 'Source'),
        UiControls.cSetValue(value)
      ]);
    };

    var cGetTextareaContent = function (ui) {
      return Chain.fromChains([
        cFindTextarea(ui, 'Paste your embed code below:'),
        UiControls.cGetValue
      ]);
    };

    var sPasteTextareaValue = function (ui, value) {
      return Chain.asStep({}, [
        cFindTextarea(ui, 'Paste your embed code below:'),
        UiControls.cSetValue(value),
        cFakeEvent('paste')
      ]);
    };

    var sAssertEmbedContent = function (ui, content) {
      return Waiter.sTryUntil('Textarea should have a proper value',
        Chain.asStep({}, [
          cGetTextareaContent(ui),
          Assertions.cAssertEq('Content same as embed', content)
        ]), 1, 3000
      );
    };

    var sTestEmbedContentFromUrl = function (ui, url, content) {
      return GeneralSteps.sequence([
        sOpenDialog(ui),
        sPasteSourceValue(ui, url),
        sAssertEmbedContent(ui, content),
        sCloseDialog(ui)
      ]);
    };

    var sSetFormItemNoEvent = function (ui, value) {
      return Chain.asStep({}, [
        cSetFormItem(ui, value)
      ]);
    };

    var sAssertEditorContent = function (apis, editor, expected) {
      return Waiter.sTryUntil('Wait for editor value',
        Chain.asStep({}, [
          apis.cGetContent,
          Assertions.cAssertHtml('Assert body content', expected)
        ]), 10, 3000
      );
    };

    var sSubmitDialog = function (ui) {
      return ui.sClickOnUi('Click submit button', 'div.mce-primary > button');
    };

    var sSubmitAndReopen = function (ui) {
      return GeneralSteps.sequence([
        sSubmitDialog(ui),
        sOpenDialog(ui)
      ]);
    };

    var sSetSetting = function (editorSetting, key, value) {
      return Step.sync(function () {
        editorSetting[key] = value;
      });
    };

    return {
      cSetFormItem: cSetFormItem,
      cFakeEvent: cFakeEvent,
      cFindInDialog: cFindInDialog,
      sOpenDialog: sOpenDialog,
      sCloseDialog: sCloseDialog,
      sSubmitDialog: sSubmitDialog,
      sTestEmbedContentFromUrl: sTestEmbedContentFromUrl,
      sSetFormItemNoEvent: sSetFormItemNoEvent,
      sAssertEditorContent: sAssertEditorContent,
      sSetSetting: sSetSetting,
      sSubmitAndReopen: sSubmitAndReopen,
      sAssertWidthValue: sAssertWidthValue,
      sAssertHeightValue: sAssertHeightValue,
      sPasteSourceValue: sPasteSourceValue,
      sAssertSizeRecalcConstrained: sAssertSizeRecalcConstrained,
      sAssertSizeRecalcConstrainedReopen: sAssertSizeRecalcConstrainedReopen,
      sAssertSizeRecalcUnconstrained: sAssertSizeRecalcUnconstrained,
      sAssertEmbedContent: sAssertEmbedContent,
      sAssertSourceValue: sAssertSourceValue,
      sChangeWidthValue: sChangeWidthValue,
      sPasteTextareaValue: sPasteTextareaValue
    };
  }
);