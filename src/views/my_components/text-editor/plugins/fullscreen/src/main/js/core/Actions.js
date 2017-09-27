/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.core.Actions',
  [
    'global!document',
    'global!window',
    'tinymce.core.dom.DOMUtils',
    'tinymce.plugins.fullscreen.api.Events'
  ],
  function (document, window, DOMUtils, Events) {
    var DOM = DOMUtils.DOM;

    var getWindowSize = function () {
      var w, h, win = window, doc = document;
      var body = doc.body;

      // Old IE
      if (body.offsetWidth) {
        w = body.offsetWidth;
        h = body.offsetHeight;
      }

      // Modern browsers
      if (win.innerWidth && win.innerHeight) {
        w = win.innerWidth;
        h = win.innerHeight;
      }

      return { w: w, h: h };
    };

    var getScrollPos = function () {
      var vp = DOM.getViewPort();

      return {
        x: vp.x,
        y: vp.y
      };
    };

    var setScrollPos = function (pos) {
      window.scrollTo(pos.x, pos.y);
    };

    var toggleFullscreen = function (editor, fullscreenInfo) {
      var body = document.body, documentElement = document.documentElement, editorContainerStyle;
      var editorContainer, iframe, iframeStyle;

      var resize = function () {
        DOM.setStyle(iframe, 'height', getWindowSize().h - (editorContainer.clientHeight - iframe.clientHeight));
      };

      var removeResize = function () {
        DOM.unbind(window, 'resize', resize);
      };

      editorContainer = editor.getContainer();
      editorContainerStyle = editorContainer.style;
      iframe = editor.getContentAreaContainer().firstChild;
      iframeStyle = iframe.style;

      if (!fullscreenInfo) {
        var newFullScreenInfo = {
          scrollPos: getScrollPos(),
          containerWidth: editorContainerStyle.width,
          containerHeight: editorContainerStyle.height,
          iframeWidth: iframeStyle.width,
          iframeHeight: iframeStyle.height,
          resizeHandler: resize,
          removeHandler: removeResize
        };

        iframeStyle.width = iframeStyle.height = '100%';
        editorContainerStyle.width = editorContainerStyle.height = '';

        DOM.addClass(body, 'mce-fullscreen');
        DOM.addClass(documentElement, 'mce-fullscreen');
        DOM.addClass(editorContainer, 'mce-fullscreen');

        DOM.bind(window, 'resize', resize);
        editor.on('remove', removeResize);

        resize();

        Events.fireFullscreenStateChanged(editor, true);

        return newFullScreenInfo;
      } else {
        iframeStyle.width = fullscreenInfo.iframeWidth;
        iframeStyle.height = fullscreenInfo.iframeHeight;

        if (fullscreenInfo.containerWidth) {
          editorContainerStyle.width = fullscreenInfo.containerWidth;
        }

        if (fullscreenInfo.containerHeight) {
          editorContainerStyle.height = fullscreenInfo.containerHeight;
        }

        DOM.removeClass(body, 'mce-fullscreen');
        DOM.removeClass(documentElement, 'mce-fullscreen');
        DOM.removeClass(editorContainer, 'mce-fullscreen');
        setScrollPos(fullscreenInfo.scrollPos);

        DOM.unbind(window, 'resize', fullscreenInfo.resizeHandler);
        editor.off('remove', fullscreenInfo.removeHandler);

        Events.fireFullscreenStateChanged(editor, false);

        return null;
      }
    };

    return {
      toggleFullscreen: toggleFullscreen
    };
  }
);
