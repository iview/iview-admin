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
  'tinymce.plugins.autolink.api.Settings',
  [
  ],
  function () {
    var getAutoLinkPattern = function (editor) {
      return editor.getParam('autolink_pattern', /^(https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.|(?:mailto:)?[A-Z0-9._%+\-]+@)(.+)$/i);
    };

    var getDefaultLinkTarget = function (editor) {
      return editor.getParam('default_link_target', '');
    };

    return {
      getAutoLinkPattern: getAutoLinkPattern,
      getDefaultLinkTarget: getDefaultLinkTarget
    };
  }
);