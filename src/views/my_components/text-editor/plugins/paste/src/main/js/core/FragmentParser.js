/**
 * FragmentParser.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.core.FragmentParser',
  [
  ],
  function () {
    var validContext = /^(p|h[1-6]|li)$/;

    var findStartTokenIndex = function (regexp, html) {
      var matches = regexp.exec(html);
      return matches ? matches.index + matches[0].length : -1;
    };

    var findEndTokenIndex = function (regexp, html) {
      var matches = regexp.exec(html);
      return matches ? matches.index : -1;
    };

    var unwrap = function (startRe, endRe, html) {
      var startIndex = findStartTokenIndex(startRe, html);
      var endIndex = findEndTokenIndex(endRe, html);
      return startIndex !== -1 && endIndex !== -1 ? html.substring(startIndex, endIndex) : html;
    };

    var parseContext = function (html) {
      var matches = /<\/([^>]+)>/g.exec(html);
      return matches ? matches[1].toLowerCase() : 'body';
    };

    var getFragmentInfo = function (html) {
      var startIndex = findStartTokenIndex(/<!--\s*StartFragment\s*-->/g, html);
      var endIndex = findEndTokenIndex(/<!--\s*EndFragment\s*-->/g, html);

      if (startIndex !== -1 && endIndex !== -1) {
        return {
          html: html.substring(startIndex, endIndex),
          context: parseContext(html.substr(endIndex))
        };
      } else {
        return { html: html, context: 'body' };
      }
    };

    var unwrapHtml = function (html) {
      return unwrap(/<body[^>]*>/gi, /<\/body>/gi,
        unwrap(/<!--\s*StartFragment\s*-->/g, /<!--\s*EndFragment\s*-->/g, html)
      );
    };

    var getFragmentHtml = function (html) {
      var fragmentInfo = getFragmentInfo(html);
      return validContext.test(fragmentInfo.context) ? unwrapHtml(fragmentInfo.html) : unwrapHtml(html);
    };

    return {
      getFragmentInfo: getFragmentInfo,
      getFragmentHtml: getFragmentHtml
    };
  }
);