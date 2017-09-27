/**
 * Uuid.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Generates unique ids this is the same as in core but since
 * it's not exposed as a global we can't access it.
 */
define(
  "tinymce.themes.inlite.alien.Uuid",
  [
  ],
  function () {
    var count = 0;

    var seed = function () {
      var rnd = function () {
        return Math.round(Math.random() * 0xFFFFFFFF).toString(36);
      };

      return 's' + Date.now().toString(36) + rnd() + rnd() + rnd();
    };

    var uuid = function (prefix) {
      return prefix + (count++) + seed();
    };

    return {
      uuid: uuid
    };
  }
);
