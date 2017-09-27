/**
 * Arr.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.wordcount.alien.Arr',
  [
  ],
  function () {
    var each = function (o, cb, s) {
      var n, l;

      if (!o) {
        return 0;
      }

      s = s || o;

      if (o.length !== undefined) {
        // Indexed arrays, needed for Safari
        for (n = 0, l = o.length; n < l; n++) {
          if (cb.call(s, o[n], n, o) === false) {
            return 0;
          }
        }
      } else {
        // Hashtables
        for (n in o) {
          if (o.hasOwnProperty(n)) {
            if (cb.call(s, o[n], n, o) === false) {
              return 0;
            }
          }
        }
      }

      return 1;
    };

    var map = function (array, callback) {
      var out = [];

      each(array, function (item, index) {
        out.push(callback(item, index, array));
      });

      return out;
    };

    return {
      each: each,
      map: map
    };
  }
);
