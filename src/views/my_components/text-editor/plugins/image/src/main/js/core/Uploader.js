/**
 * Uploader.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This is basically cut down version of tinymce.core.file.Uploader, which we could use directly
 * if it wasn't marked as private.
 */
define(
  'tinymce.plugins.image.core.Uploader',
  [
    'ephox.sand.api.XMLHttpRequest',
    'global!document',
    'global!window',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools'
  ],
  function (XMLHttpRequest, document, window, Promise, Tools) {
    var noop = function () {};

    var pathJoin = function (path1, path2) {
      if (path1) {
        return path1.replace(/\/$/, '') + '/' + path2.replace(/^\//, '');
      }

      return path2;
    };

    return function (settings) {
      var defaultHandler = function (blobInfo, success, failure, progress) {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.open('POST', settings.url);
        xhr.withCredentials = settings.credentials;

        xhr.upload.onprogress = function (e) {
          progress(e.loaded / e.total * 100);
        };

        xhr.onerror = function () {
          failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        };

        xhr.onload = function () {
          var json;

          if (xhr.status < 200 || xhr.status >= 300) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }

          json = JSON.parse(xhr.responseText);

          if (!json || typeof json.location !== 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }

          success(pathJoin(settings.basePath, json.location));
        };

        formData = new window.FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
      };

      var uploadBlob = function (blobInfo, handler) {
        return new Promise(function (resolve, reject) {
          try {
            handler(blobInfo, resolve, reject, noop);
          } catch (ex) {
            reject(ex.message);
          }
        });
      };

      var isDefaultHandler = function (handler) {
        return handler === defaultHandler;
      };

      var upload = function (blobInfo) {
        return (!settings.url && isDefaultHandler(settings.handler)) ? Promise.reject('Upload url missng from the settings.') : uploadBlob(blobInfo, settings.handler);
      };

      settings = Tools.extend({
        credentials: false,
        handler: defaultHandler
      }, settings);

      return {
        upload: upload
      };
    };
  }
);