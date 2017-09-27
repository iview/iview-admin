/**
 * Proxy.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Handles loading images though a proxy for working around cors.
 */
define(
  'tinymce.plugins.imagetools.core.Proxy',
  [
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.plugins.imagetools.core.Errors',
    'tinymce.plugins.imagetools.core.Utils'
  ],
  function (Promise, Tools, Errors, Utils) {
    var appendApiKey = function (url, apiKey) {
      var separator = url.indexOf('?') === -1 ? '?' : '&';
      if (/[?&]apiKey=/.test(url) || !apiKey) {
        return url;
      } else {
        return url + separator + 'apiKey=' + encodeURIComponent(apiKey);
      }
    };

    var requestServiceBlob = function (url, apiKey) {
      return Utils.requestUrlAsBlob(appendApiKey(url, apiKey), {
        'Content-Type': 'application/json;charset=UTF-8',
        'tiny-api-key': apiKey
      }).then(function (result) {
        return result.status < 200 || result.status >= 300 ? Errors.handleServiceErrorResponse(result.status, result.blob) : Promise.resolve(result.blob);
      });
    };

    function requestBlob(url) {
      return Utils.requestUrlAsBlob(url, {})
        .then(function (result) {
          return result.status < 200 || result.status >= 300 ? Errors.handleHttpError(result.status) : Promise.resolve(result.blob);
        });
    }

    var getUrl = function (url, apiKey) {
      return apiKey ? requestServiceBlob(url, apiKey) : requestBlob(url);
    };

    return {
      getUrl: getUrl
    };
  }
);
