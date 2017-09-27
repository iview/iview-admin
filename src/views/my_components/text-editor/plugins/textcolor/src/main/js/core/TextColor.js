/**
 * TextColor.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.textcolor.core.TextColor',
  [
  ],
  function () {
    var getCurrentColor = function (editor, format) {
      var color;

      editor.dom.getParents(editor.selection.getStart(), function (elm) {
        var value;

        if ((value = elm.style[format === 'forecolor' ? 'color' : 'background-color'])) {
          color = value;
        }
      });

      return color;
    };

    var mapColors = function (colorMap) {
      var i, colors = [];

      for (i = 0; i < colorMap.length; i += 2) {
        colors.push({
          text: colorMap[i + 1],
          color: '#' + colorMap[i]
        });
      }

      return colors;
    };

    var applyFormat = function (editor, format, value) {
      editor.undoManager.transact(function () {
        editor.focus();
        editor.formatter.apply(format, { value: value });
        editor.nodeChanged();
      });
    };

    var removeFormat = function (editor, format) {
      editor.undoManager.transact(function () {
        editor.focus();
        editor.formatter.remove(format, { value: null }, null, true);
        editor.nodeChanged();
      });
    };

    return {
      getCurrentColor: getCurrentColor,
      mapColors: mapColors,
      applyFormat: applyFormat,
      removeFormat: removeFormat
    };
  }
);