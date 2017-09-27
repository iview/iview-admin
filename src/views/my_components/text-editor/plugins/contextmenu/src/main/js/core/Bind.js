/**
 * Bind.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.contextmenu.core.Bind',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.Env',
    'tinymce.plugins.contextmenu.api.Settings',
    'tinymce.plugins.contextmenu.core.RangePoint',
    'tinymce.plugins.contextmenu.ui.ContextMenu'
  ],
  function (DOMUtils, Env, Settings, RangePoint, ContextMenu) {
    var isNativeOverrideKeyEvent = function (editor, e) {
      return e.ctrlKey && !Settings.shouldNeverUseNative(editor);
    };

    var isMacWebKit = function () {
      return Env.mac && Env.webkit;
    };

    var isImage = function (elm) {
      return elm && elm.nodeName === 'IMG';
    };

    var isEventOnImageOutsideRange = function (evt, range) {
      return isImage(evt.target) && RangePoint.isXYWithinRange(evt.clientX, evt.clientY, range) === false;
    };

    var setup = function (editor, visibleState, menu) {
      /**
       * This takes care of a os x native issue where it expands the selection
       * to the word at the caret position to do "lookups". Since we are overriding
       * the context menu we also need to override this expanding so the behavior becomes
       * normalized. Firefox on os x doesn't expand to the word when using the context menu.
       */
      editor.on('mousedown', function (e) {
        if (isMacWebKit() && e.button === 2 && !isNativeOverrideKeyEvent(editor, e) && editor.selection.isCollapsed()) {
          editor.once('contextmenu', function (e2) {
            if (!isImage(e2.target)) {
              editor.selection.placeCaretAt(e2.clientX, e2.clientY);
            }
          });
        }
      });

      editor.on('contextmenu', function (e) {
        var x = e.pageX, y = e.pageY;

        if (!editor.inline) {
          var pos = DOMUtils.DOM.getPos(editor.getContentAreaContainer());
          x = pos.x + e.clientX;
          y = pos.y + e.clientY;
        }

        if (isNativeOverrideKeyEvent(editor, e)) {
          return;
        }

        if (isEventOnImageOutsideRange(e, editor.selection.getRng())) {
          editor.selection.select(e.target);
        }

        e.preventDefault();

        ContextMenu.show(editor, x, y, visibleState, menu);
      });
    };

    return {
      setup: setup
    };
  }
);