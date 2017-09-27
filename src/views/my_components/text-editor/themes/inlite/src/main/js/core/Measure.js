/**
 * Measure.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.core.Measure',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.themes.inlite.core.Convert'
  ],
  function (DOMUtils, Convert) {
    var toAbsolute = function (rect) {
      var vp = DOMUtils.DOM.getViewPort();

      return {
        x: rect.x + vp.x,
        y: rect.y + vp.y,
        w: rect.w,
        h: rect.h
      };
    };

    var measureElement = function (elm) {
      var clientRect = elm.getBoundingClientRect();

      return toAbsolute({
        x: clientRect.left,
        y: clientRect.top,
        w: Math.max(elm.clientWidth, elm.offsetWidth),
        h: Math.max(elm.clientHeight, elm.offsetHeight)
      });
    };

    var getElementRect = function (editor, elm) {
      return measureElement(elm);
    };

    var getPageAreaRect = function (editor) {
      return measureElement(editor.getElement().ownerDocument.body);
    };

    var getContentAreaRect = function (editor) {
      return measureElement(editor.getContentAreaContainer() || editor.getBody());
    };

    var getSelectionRect = function (editor) {
      var clientRect = editor.selection.getBoundingClientRect();
      return clientRect ? toAbsolute(Convert.fromClientRect(clientRect)) : null;
    };

    return {
      getElementRect: getElementRect,
      getPageAreaRect: getPageAreaRect,
      getContentAreaRect: getContentAreaRect,
      getSelectionRect: getSelectionRect
    };
  }
);
