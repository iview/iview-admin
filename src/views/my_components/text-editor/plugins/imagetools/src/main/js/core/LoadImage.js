/**
 * LoadImage.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.LoadImage',
  [
    'tinymce.core.util.Promise'
  ],
  function (Promise) {
    var loadImage = function (image) {
      return new Promise(function (resolve) {
        var loaded = function () {
          image.removeEventListener('load', loaded);
          resolve(image);
        };

        if (image.complete) {
          resolve(image);
        } else {
          image.addEventListener('load', loaded);
        }
      });
    };

    return {
      loadImage: loadImage
    };
  }
);
