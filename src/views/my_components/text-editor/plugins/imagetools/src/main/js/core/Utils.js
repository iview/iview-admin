/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.Utils',
  [
    'ephox.sand.api.FileReader',
    'ephox.sand.api.XMLHttpRequest',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools'
  ],
  function (FileReader, XMLHttpRequest, Promise, Tools) {
    var isValue = function (obj) {
      return obj !== null && obj !== undefined;
    };

    var traverse = function (json, path) {
      var value;

      value = path.reduce(function (result, key) {
        return isValue(result) ? result[key] : undefined;
      }, json);

      return isValue(value) ? value : null;
    };

    var requestUrlAsBlob = function (url, headers) {
      return new Promise(function (resolve) {
        var xhr;

        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            resolve({
              status: xhr.status,
              blob: this.response
            });
          }
        };

        xhr.open('GET', url, true);

        Tools.each(headers, function (value, key) {
          xhr.setRequestHeader(key, value);
        });

        xhr.responseType = 'blob';
        xhr.send();
      });
    };

    var readBlob = function (blob) {
      return new Promise(function (resolve) {
        var fr = new FileReader();

        fr.onload = function (e) {
          var data = e.target;
          resolve(data.result);
        };

        fr.readAsText(blob);
      });
    };

    var parseJson = function (text) {
      var json;

      try {
        json = JSON.parse(text);
      } catch (ex) {
        // Ignore
      }

      return json;
    };

    return {
      traverse: traverse,
      readBlob: readBlob,
      requestUrlAsBlob: requestUrlAsBlob,
      parseJson: parseJson
    };
  }
);
