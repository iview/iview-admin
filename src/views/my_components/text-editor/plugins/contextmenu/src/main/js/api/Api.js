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
  'tinymce.plugins.contextmenu.api.Api',
  [
  ],
  function () {
    var get = function (visibleState) {
      var isContextMenuVisible = function () {
        return visibleState.get();
      };

      return {
        isContextMenuVisible: isContextMenuVisible
      };
    };

    return {
      get: get
    };
  }
);

