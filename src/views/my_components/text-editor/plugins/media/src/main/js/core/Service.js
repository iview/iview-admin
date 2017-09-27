/**
 * Service.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.Service',
  [
    'tinymce.core.util.Promise',
    'tinymce.plugins.media.api.Settings',
    'tinymce.plugins.media.core.DataToHtml'
  ],
  function (Promise, Settings, DataToHtml) {
    var embedPromise = function (data, dataToHtml, handler) {
      var cache = {};
      return new Promise(function (res, rej) {
        var wrappedResolve = function (response) {
          if (response.html) {
            cache[data.source1] = response;
          }
          return res({
            url: data.source1,
            html: response.html ? response.html : dataToHtml(data)
          });
        };
        if (cache[data.source1]) {
          wrappedResolve(cache[data.source1]);
        } else {
          handler({ url: data.source1 }, wrappedResolve, rej);
        }
      });
    };

    var defaultPromise = function (data, dataToHtml) {
      return new Promise(function (res) {
        res({ html: dataToHtml(data), url: data.source1 });
      });
    };

    var loadedData = function (editor) {
      return function (data) {
        return DataToHtml.dataToHtml(editor, data);
      };
    };

    var getEmbedHtml = function (editor, data) {
      var embedHandler = Settings.getUrlResolver(editor);

      return embedHandler ? embedPromise(data, loadedData(editor), embedHandler) : defaultPromise(data, loadedData(editor));
    };

    return {
      getEmbedHtml: getEmbedHtml
    };
  }
);