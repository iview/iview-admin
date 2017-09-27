/**
 * Picker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.file.Picker',
  [
    'global!document',
    'tinymce.core.util.Promise'
  ],
  function (document, Promise) {
    var pickFile = function () {
      return new Promise(function (resolve) {
        var fileInput;

        fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.style.position = 'fixed';
        fileInput.style.left = 0;
        fileInput.style.top = 0;
        fileInput.style.opacity = 0.001;
        document.body.appendChild(fileInput);

        fileInput.onchange = function (e) {
          resolve(Array.prototype.slice.call(e.target.files));
        };

        fileInput.click();
        fileInput.parentNode.removeChild(fileInput);
      });
    };

    return {
      pickFile: pickFile
    };
  }
);


