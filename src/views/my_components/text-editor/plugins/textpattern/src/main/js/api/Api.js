/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.textpattern.api.Api',
  [
  ],
  function () {
    var get = function (patternsState) {
      var setPatterns = function (newPatterns) {
        patternsState.set(newPatterns);
      };

      var getPatterns = function () {
        return patternsState.get();
      };

      return {
        setPatterns: setPatterns,
        getPatterns: getPatterns
      };
    };

    return {
      get: get
    };
  }
);