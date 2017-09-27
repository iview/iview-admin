/*jsc
["tinymce.plugins.fullscreen.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.fullscreen.api.Api","tinymce.plugins.fullscreen.api.Commands","tinymce.plugins.fullscreen.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.fullscreen.core.Actions","global!document","global!window","tinymce.core.dom.DOMUtils","tinymce.plugins.fullscreen.api.Events"]
jsc*/
define(
  'ephox.katamari.api.Cell',

  [
  ],

  function () {
    var Cell = function (initial) {
      var value = initial;

      var get = function () {
        return value;
      };

      var set = function (v) {
        value = v;
      };

      var clone = function () {
        return Cell(get());
      };

      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    return Cell;
  }
);

defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.PluginManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.PluginManager');
  }
);

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
  'tinymce.plugins.fullscreen.api.Api',
  [
  ],
  function () {
    var get = function (fullscreenState) {
      return {
        isFullscreen: function () {
          return fullscreenState.get() !== null;
        }
      };
    };

    return {
      get: get
    };
  }
);

defineGlobal("global!document", document);
defineGlobal("global!window", window);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.api.Events',
  [
  ],
  function () {
    var fireFullscreenStateChanged = function (editor, state) {
      editor.fire('FullscreenStateChanged', { state: state });
    };

    return {
      fireFullscreenStateChanged: fireFullscreenStateChanged
    };
  }
);

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

/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.api.Commands',
  [
    'tinymce.plugins.fullscreen.core.Actions'
  ],
  function (Actions) {
    var register = function (editor, fullscreenState) {
      editor.addCommand('mceFullScreen', function () {
        fullscreenState.set(Actions.toggleFullscreen(editor, fullscreenState.get()));
      });
    };

    return {
      register: register
    };
  }
);

/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.ui.Buttons',
  [
  ],
  function () {
    var postRender = function (editor) {
      return function (e) {
        var ctrl = e.control;

        editor.on('FullscreenStateChanged', function (e) {
          ctrl.active(e.state);
        });
      };
    };

    var register = function (editor) {
      editor.addMenuItem('fullscreen', {
        text: 'Fullscreen',
        shortcut: 'Ctrl+Shift+F',
        selectable: true,
        cmd: 'mceFullScreen',
        onPostRender: postRender(editor),
        context: 'view'
      });

      editor.addButton('fullscreen', {
        tooltip: 'Fullscreen',
        shortcut: 'Ctrl+Shift+F',
        cmd: 'mceFullScreen',
        onPostRender: postRender(editor)
      });
    };

    return {
      register: register
    };
  }
);
/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullscreen.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.fullscreen.api.Api',
    'tinymce.plugins.fullscreen.api.Commands',
    'tinymce.plugins.fullscreen.ui.Buttons'
  ],
  function (Cell, PluginManager, Api, Commands, Buttons) {
    PluginManager.add('fullscreen', function (editor) {
      var fullscreenState = Cell(null);

      Commands.register(editor, fullscreenState);
      Buttons.register(editor);

      editor.addShortcut('Ctrl+Shift+F', '', 'mceFullScreen');

      return Api.get(fullscreenState);
    });

    return function () { };
  }
);