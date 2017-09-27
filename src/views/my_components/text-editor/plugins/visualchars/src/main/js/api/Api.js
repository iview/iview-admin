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
  'tinymce.plugins.visualchars.api.Api',
  [
  ],
  function () {
    var get = function (toggleState) {
      var isEnabled = function () {
        return toggleState.get();
      };

      return {
        isEnabled: isEnabled
      };
    };

    return {
      get: get
    };
  }
);