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
  'tinymce.plugins.advlist.api.Settings',
  [
  ],
  function () {
    var getNumberStyles = function (editor) {
      var styles = editor.getParam('advlist_number_styles', 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman');
      return styles ? styles.split(/[ ,]/) : [];
    };

    var getBulletStyles = function (editor) {
      var styles = editor.getParam('advlist_bullet_styles', 'default,circle,disc,square');
      return styles ? styles.split(/[ ,]/) : [];
    };

    return {
      getNumberStyles: getNumberStyles,
      getBulletStyles: getBulletStyles
    };
  }
);