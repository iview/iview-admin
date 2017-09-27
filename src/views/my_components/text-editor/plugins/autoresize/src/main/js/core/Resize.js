/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the autoresize plugin.
 *
 * @class tinymce.autoresize.Plugin
 * @private
 */
define(
  'tinymce.plugins.autoresize.core.Resize',
  [
    'tinymce.core.Env',
    'tinymce.core.util.Delay',
    'tinymce.plugins.autoresize.api.Settings'
  ],
  function (Env, Delay, Settings) {
    var isFullscreen = function (editor) {
      return editor.plugins.fullscreen && editor.plugins.fullscreen.isFullscreen();
    };

    /**
     * Calls the resize x times in 100ms intervals. We can't wait for load events since
     * the CSS files might load async.
     */
    var wait = function (editor, oldSize, times, interval, callback) {
      Delay.setEditorTimeout(editor, function () {
        resize(editor, oldSize);

        if (times--) {
          wait(editor, oldSize, times, interval, callback);
        } else if (callback) {
          callback();
        }
      }, interval);
    };

    /**
     * This method gets executed each time the editor needs to resize.
     */
    var resize = function (editor, oldSize) {
      var deltaSize, doc, body, docElm, resizeHeight, myHeight;
      var marginTop, marginBottom, paddingTop, paddingBottom, borderTop, borderBottom;
      var dom = editor.dom;

      doc = editor.getDoc();
      if (!doc || isFullscreen(editor)) {
        return;
      }

      body = doc.body;
      docElm = doc.documentElement;
      resizeHeight = Settings.getAutoResizeMinHeight(editor);

      // Calculate outer height of the body element using CSS styles
      marginTop = dom.getStyle(body, 'margin-top', true);
      marginBottom = dom.getStyle(body, 'margin-bottom', true);
      paddingTop = dom.getStyle(body, 'padding-top', true);
      paddingBottom = dom.getStyle(body, 'padding-bottom', true);
      borderTop = dom.getStyle(body, 'border-top-width', true);
      borderBottom = dom.getStyle(body, 'border-bottom-width', true);
      myHeight = body.offsetHeight + parseInt(marginTop, 10) + parseInt(marginBottom, 10) +
        parseInt(paddingTop, 10) + parseInt(paddingBottom, 10) +
        parseInt(borderTop, 10) + parseInt(borderBottom, 10);

      // Make sure we have a valid height
      if (isNaN(myHeight) || myHeight <= 0) {
        // Get height differently depending on the browser used
        // eslint-disable-next-line no-nested-ternary
        myHeight = Env.ie ? body.scrollHeight : (Env.webkit && body.clientHeight === 0 ? 0 : body.offsetHeight);
      }

      // Don't make it smaller than the minimum height
      if (myHeight > Settings.getAutoResizeMinHeight(editor)) {
        resizeHeight = myHeight;
      }

      // If a maximum height has been defined don't exceed this height
      var maxHeight = Settings.getAutoResizeMaxHeight(editor);
      if (maxHeight && myHeight > maxHeight) {
        resizeHeight = maxHeight;
        body.style.overflowY = "auto";
        docElm.style.overflowY = "auto"; // Old IE
      } else {
        body.style.overflowY = "hidden";
        docElm.style.overflowY = "hidden"; // Old IE
        body.scrollTop = 0;
      }

      // Resize content element
      if (resizeHeight !== oldSize.get()) {
        deltaSize = resizeHeight - oldSize.get();
        dom.setStyle(editor.iframeElement, 'height', resizeHeight + 'px');
        oldSize.set(resizeHeight);

        // WebKit doesn't decrease the size of the body element until the iframe gets resized
        // So we need to continue to resize the iframe down until the size gets fixed
        if (Env.webKit && deltaSize < 0) {
          resize(editor);
        }
      }
    };

    var setup = function (editor, oldSize) {
      editor.on("init", function () {
        var overflowPadding, bottomMargin, dom = editor.dom;

        overflowPadding = Settings.getAutoResizeOverflowPadding(editor);
        bottomMargin = Settings.getAutoResizeBottomMargin(editor);

        if (overflowPadding !== false) {
          dom.setStyles(editor.getBody(), {
            paddingLeft: overflowPadding,
            paddingRight: overflowPadding
          });
        }

        if (bottomMargin !== false) {
          dom.setStyles(editor.getBody(), {
            paddingBottom: bottomMargin
          });
        }
      });

      editor.on("nodechange setcontent keyup FullscreenStateChanged", function () {
        resize(editor, oldSize);
      });

      if (Settings.shouldAutoResizeOnInit(editor)) {
        editor.on('init', function () {
          // Hit it 20 times in 100 ms intervals
          wait(editor, oldSize, 20, 100, function () {
            // Hit it 5 times in 1 sec intervals
            wait(editor, oldSize, 5, 1000);
          });
        });
      }
    };

    return {
      setup: setup,
      resize: resize
    };
  }
);