/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.api.Api',
  [
  ],
  function (Actions) {
    var get = function (clipboard, quirks) {
      return {
        clipboard: clipboard,
        quirks: quirks
      };
    };

    return {
      get: get
    };
  }
);
