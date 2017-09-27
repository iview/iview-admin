/**
 * ListStyles.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.ui.ListStyles',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var styleValueToText = function (styleValue) {
      return styleValue.replace(/\-/g, ' ').replace(/\b\w/g, function (chr) {
        return chr.toUpperCase();
      });
    };

    var toMenuItems = function (styles) {
      return Tools.map(styles, function (styleValue) {
        var text = styleValueToText(styleValue);
        var data = styleValue === 'default' ? '' : styleValue;

        return { text: text, data: data };
      });
    };

    return {
      toMenuItems: toMenuItems
    };
  }
);