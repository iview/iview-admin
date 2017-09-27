/**
 * RangePoint.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.contextmenu.core.RangePoint',
  [
    'ephox.katamari.api.Arr'
  ],
  function (Arr) {
    var containsXY = function (clientRect, clientX, clientY) {
      return (
        clientX >= clientRect.left &&
        clientX <= clientRect.right &&
        clientY >= clientRect.top &&
        clientY <= clientRect.bottom
      );
    };

    var isXYWithinRange = function (clientX, clientY, range) {
      if (range.collapsed) {
        return false;
      }

      return Arr.foldl(range.getClientRects(), function (state, rect) {
        return state || containsXY(rect, clientX, clientY);
      }, false);
    };

    return {
      isXYWithinRange: isXYWithinRange
    };
  }
);