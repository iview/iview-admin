/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.api.Settings',
  [
  ],
  function () {
    var shouldPlainTextInform = function (editor) {
      return editor.getParam('paste_plaintext_inform', true);
    };

    var shouldBlockDrop = function (editor) {
      return editor.getParam('paste_block_drop', false);
    };

    var shouldPasteDataImages = function (editor) {
      return editor.getParam('paste_data_images', false);
    };

    var shouldFilterDrop = function (editor) {
      return editor.getParam('paste_filter_drop', true);
    };

    var getPreProcess = function (editor) {
      return editor.getParam('paste_preprocess');
    };

    var getPostProcess = function (editor) {
      return editor.getParam('paste_postprocess');
    };

    var getWebkitStyles = function (editor) {
      return editor.getParam('paste_webkit_styles');
    };

    var shouldRemoveWebKitStyles = function (editor) {
      return editor.getParam('paste_remove_styles_if_webkit', true);
    };

    var shouldMergeFormats = function (editor) {
      return editor.getParam('paste_merge_formats', true);
    };

    var isSmartPasteEnabled = function (editor) {
      return editor.getParam('smart_paste', true);
    };

    var getRetainStyleProps = function (editor) {
      return editor.getParam('paste_retain_style_properties');
    };

    var getWordValidElements = function (editor) {
      var defaultValidElements = (
        '-strong/b,-em/i,-u,-span,-p,-ol,-ul,-li,-h1,-h2,-h3,-h4,-h5,-h6,' +
        '-p/div,-a[href|name],sub,sup,strike,br,del,table[width],tr,' +
        'td[colspan|rowspan|width],th[colspan|rowspan|width],thead,tfoot,tbody'
      );

      return editor.getParam('paste_word_valid_elements', defaultValidElements);
    };

    var shouldConvertWordFakeLists = function (editor) {
      return editor.getParam('paste_convert_word_fake_lists', true);
    };

    var shouldUseDefaultFilters = function (editor) {
      return editor.getParam('paste_enable_default_filters', true);
    };

    return {
      shouldPlainTextInform: shouldPlainTextInform,
      shouldBlockDrop: shouldBlockDrop,
      shouldPasteDataImages: shouldPasteDataImages,
      shouldFilterDrop: shouldFilterDrop,
      getPreProcess: getPreProcess,
      getPostProcess: getPostProcess,
      getWebkitStyles: getWebkitStyles,
      shouldRemoveWebKitStyles: shouldRemoveWebKitStyles,
      shouldMergeFormats: shouldMergeFormats,
      isSmartPasteEnabled: isSmartPasteEnabled,
      getRetainStyleProps: getRetainStyleProps,
      getWordValidElements: getWordValidElements,
      shouldConvertWordFakeLists: shouldConvertWordFakeLists,
      shouldUseDefaultFilters: shouldUseDefaultFilters
    };
  }
);
