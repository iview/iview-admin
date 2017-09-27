/**
 * LoadCss.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualblocks.core.LoadCss',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.util.Tools'
  ],
  function (DOMUtils, Tools) {
    var cssId = DOMUtils.DOM.uniqueId();

    var load = function (doc, url) {
      var linkElements = Tools.toArray(doc.getElementsByTagName('link'));
      var matchingLinkElms = Tools.grep(linkElements, function (head) {
        return head.id === cssId;
      });

      if (matchingLinkElms.length === 0) {
        var linkElm = DOMUtils.DOM.create('link', {
          id: cssId,
          rel: 'stylesheet',
          href: url
        });

        doc.getElementsByTagName('head')[0].appendChild(linkElm);
      }
    };

    return {
      load: load
    };
  }
);