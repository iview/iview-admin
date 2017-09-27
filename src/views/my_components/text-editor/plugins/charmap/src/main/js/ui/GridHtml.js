/**
 * GridHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.charmap.ui.GridHtml',
  [
  ],
  function () {
    var getHtml = function (charmap) {
      var gridHtml, x, y;
      var width = Math.min(charmap.length, 25);
      var height = Math.ceil(charmap.length / width);

      gridHtml = '<table role="presentation" cellspacing="0" class="mce-charmap"><tbody>';

      for (y = 0; y < height; y++) {
        gridHtml += '<tr>';

        for (x = 0; x < width; x++) {
          var index = y * width + x;
          if (index < charmap.length) {
            var chr = charmap[index];
            var chrText = chr ? String.fromCharCode(parseInt(chr[0], 10)) : '&nbsp;';

            gridHtml += (
              '<td title="' + chr[1] + '">' +
              '<div tabindex="-1" title="' + chr[1] + '" role="button" data-chr="' + chrText + '">' +
              chrText +
              '</div>' +
              '</td>'
            );
          } else {
            gridHtml += '<td />';
          }
        }

        gridHtml += '</tr>';
      }

      gridHtml += '</tbody></table>';

      return gridHtml;
    };

    return {
      getHtml: getHtml
    };
  }
);