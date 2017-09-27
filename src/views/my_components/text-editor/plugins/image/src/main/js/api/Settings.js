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
  'tinymce.plugins.image.api.Settings',
  [
  ],
  function () {
    var hasDimensions = function (editor) {
      return editor.getParam('image_dimensions', true);
    };

    var hasAdvTab = function (editor) {
      return editor.getParam('image_advtab', false);
    };

    var getPrependUrl = function (editor) {
      return editor.getParam('image_prepend_url', '');
    };

    var getClassList = function (editor) {
      return editor.getParam('image_class_list');
    };

    var hasDescription = function (editor) {
      return editor.getParam('image_description', true);
    };

    var hasImageTitle = function (editor) {
      return editor.getParam('image_title', false);
    };

    var hasImageCaption = function (editor) {
      return editor.getParam('image_caption', false);
    };

    var getImageList = function (editor) {
      return editor.getParam('image_list', false);
    };

    return {
      hasDimensions: hasDimensions,
      hasAdvTab: hasAdvTab,
      getPrependUrl: getPrependUrl,
      getClassList: getClassList,
      hasDescription: hasDescription,
      hasImageTitle: hasImageTitle,
      hasImageCaption: hasImageCaption,
      getImageList: getImageList
    };
  }
);