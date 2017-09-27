/**
 * Guid.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.toc.core.Guid',
  [
  ],
  function () {
    var create = function (prefix) {
      var counter = 0;

      return function () {
        var guid = new Date().getTime().toString(32);
        return prefix + guid + (counter++).toString(32);
      };
    };

    return {
      create: create
    };
  }
);