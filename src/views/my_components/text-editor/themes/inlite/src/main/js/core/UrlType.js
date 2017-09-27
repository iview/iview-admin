/**
 * UrlType.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.core.UrlType',
  [
  ],
  function () {
    var isDomainLike = function (href) {
      return /^www\.|\.(com|org|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)$/i.test(href.trim());
    };

    var isAbsolute = function (href) {
      return /^https?:\/\//.test(href.trim());
    };

    return {
      isDomainLike: isDomainLike,
      isAbsolute: isAbsolute
    };
  }
);


