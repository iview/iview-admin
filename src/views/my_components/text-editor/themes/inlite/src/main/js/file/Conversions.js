/**
 * Conversions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.file.Conversions',
  [
    'ephox.sand.api.FileReader',
    'tinymce.core.util.Promise'
  ],
  function (FileReader, Promise) {
    var blobToBase64 = function (blob) {
      return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onloadend = function () {
          resolve(reader.result.split(',')[1]);
        };

        reader.readAsDataURL(blob);
      });
    };

    return {
      blobToBase64: blobToBase64
    };
  }
);


