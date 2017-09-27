/**
 * Branding.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.Branding',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.themes.modern.api.Settings'
  ],
  function (DOMUtils, Settings) {
    var DOM = DOMUtils.DOM;

    var reposition = function (editor, poweredByElm, hasStatusbar) {
      return function () {
        var iframeWidth = editor.getContentAreaContainer().querySelector('iframe').offsetWidth;
        var scrollbarWidth = Math.max(iframeWidth - editor.getDoc().documentElement.offsetWidth, 0);

        DOM.setStyle(poweredByElm, 'right', scrollbarWidth + 'px');
        if (hasStatusbar) {
          DOM.setStyle(poweredByElm, 'top', '-16px');
        } else {
          DOM.setStyle(poweredByElm, 'bottom', '1px');
        }
      };
    };

    var hide = function (poweredByElm) {
      return function () {
        DOM.hide(poweredByElm);
      };
    };

    var setupReposition = function (editor, poweredByElm, hasStatusbar) {
      reposition(editor, poweredByElm, hasStatusbar)();
      editor.on('NodeChange ResizeEditor', reposition(editor, poweredByElm, hasStatusbar));
    };

    var appendToStatusbar = function (editor, poweredByElm, statusbarElm) {
      statusbarElm.appendChild(poweredByElm);
      setupReposition(editor, poweredByElm, true);
    };

    var appendToContainer = function (editor, poweredByElm) {
      editor.getContainer().appendChild(poweredByElm);
      setupReposition(editor, poweredByElm, false);
    };

    var setupEventListeners = function (editor) {
      editor.on('SkinLoaded', function () {
        var poweredByElm = DOM.create('div', { 'class': 'mce-branding-powered-by' });
        var statusbarElm = editor.getContainer().querySelector('.mce-statusbar');

        if (statusbarElm) {
          appendToStatusbar(editor, poweredByElm, statusbarElm);
        } else {
          appendToContainer(editor, poweredByElm);
        }

        DOM.bind(poweredByElm, 'click', hide(poweredByElm));
      });
    };

    var setup = function (editor) {
      if (Settings.isBrandingEnabled(editor)) {
        setupEventListeners(editor);
      }
    };

    return {
      setup: setup
    };
  }
);
