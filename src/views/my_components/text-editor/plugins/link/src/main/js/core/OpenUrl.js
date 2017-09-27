/**
 * OpenUrl.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.link.core.OpenUrl',
  [
    'global!document',
    'global!window',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.Env'
  ],
  function (document, window, DOMUtils, Env) {
    var appendClickRemove = function (link, evt) {
      document.body.appendChild(link);
      link.dispatchEvent(evt);
      document.body.removeChild(link);
    };

    var open = function (url) {
      // Chrome and Webkit has implemented noopener and works correctly with/without popup blocker
      // Firefox has it implemented noopener but when the popup blocker is activated it doesn't work
      // Edge has only implemented noreferrer and it seems to remove opener as well
      // Older IE versions pre IE 11 falls back to a window.open approach
      if (!Env.ie || Env.ie > 10) {
        var link = document.createElement('a');
        link.target = '_blank';
        link.href = url;
        link.rel = 'noreferrer noopener';

        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        appendClickRemove(link, evt);
      } else {
        var win = window.open('', '_blank');
        if (win) {
          win.opener = null;
          var doc = win.document;
          doc.open();
          doc.write('<meta http-equiv="refresh" content="0; url=' + DOMUtils.DOM.encode(url) + '">');
          doc.close();
        }
      }
    };

    return {
      open: open
    };
  }
);