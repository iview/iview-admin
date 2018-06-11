(function () {
    var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
    var register_3795 = function (id) {
        var module = dem(id);
        var fragments = id.split('.');
        var target = Function('return this;')();
        for (var i = 0; i < fragments.length - 1; ++i) {
            if (target[fragments[i]] === undefined) { target[fragments[i]] = {}; }
            target = target[fragments[i]];
        }
        target[fragments[fragments.length - 1]] = module;
    };

    var instantiate = function (id) {
        var actual = defs[id];
        var dependencies = actual.deps;
        var definition = actual.defn;
        var len = dependencies.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(dependencies[i]); }
        var defResult = definition.apply(null, instances);
        if (defResult === undefined) { throw 'module [' + id + '] returned undefined'; }
        actual.instance = defResult;
    };

    var def = function (id, dependencies, definition) {
        if (typeof id !== 'string') { throw 'module id must be a string'; } else if (dependencies === undefined) { throw 'no dependencies for ' + id; } else if (definition === undefined) { throw 'no definition function for ' + id; }
        defs[id] = {
            deps: dependencies,
            defn: definition,
            instance: undefined
        };
    };

    var dem = function (id) {
        var actual = defs[id];
        if (actual === undefined) { throw 'module [' + id + '] was undefined'; } else if (actual.instance === undefined) { instantiate(id); }
        return actual.instance;
    };

    var req = function (ids, callback) {
        var len = ids.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(ids[i]); }
        callback.apply(null, instances);
    };

    var ephox = {};

    ephox.bolt = {
        module: {
            api: {
                define: def,
                require: req,
                demand: dem
            }
        }
    };

    var define = def;
    var require = req;
    var demand = dem;
// this helps with minification when using a lot of global references
    var defineGlobal = function (id, ref) {
        define(id, [], function () { return ref; });
    };
/* jsc
["tinymce.plugins.visualblocks.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.visualblocks.api.Commands","tinymce.plugins.visualblocks.core.Bindings","tinymce.plugins.visualblocks.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.visualblocks.core.VisualBlocks","tinymce.plugins.visualblocks.api.Settings","tinymce.plugins.visualblocks.api.Events","tinymce.plugins.visualblocks.core.LoadCss","tinymce.core.dom.DOMUtils","tinymce.core.util.Tools"]
jsc */
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

    defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
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
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.visualblocks.api.Events',
        [
        ],
  function () {
      var fireVisualBlocks = function (editor, state) {
          editor.fire('VisualBlocks', { state: state });
      };

      return {
          fireVisualBlocks: fireVisualBlocks
      };
  }
);
/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.visualblocks.api.Settings',
        [
        ],
  function () {
      var isEnabledByDefault = function (editor) {
          return editor.getParam('visualblocks_default_state', false);
      };

      var getContentCss = function (editor) {
          return editor.settings.visualblocks_content_css;
      };

      return {
          isEnabledByDefault: isEnabledByDefault,
          getContentCss: getContentCss
      };
  }
);
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
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Tools',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Tools');
  }
);

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
/**
 * VisualBlocks.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.visualblocks.core.VisualBlocks',
        [
            'tinymce.plugins.visualblocks.api.Events',
            'tinymce.plugins.visualblocks.api.Settings',
            'tinymce.plugins.visualblocks.core.LoadCss'
        ],
  function (Events, Settings, LoadCss) {
      var toggleVisualBlocks = function (editor, pluginUrl, enabledState) {
          var dom = editor.dom;
          var contentCss = Settings.getContentCss(editor);

          LoadCss.load(editor.getDoc(), contentCss || pluginUrl + '/css/visualblocks.css');
          dom.toggleClass(editor.getBody(), 'mce-visualblocks');
          enabledState.set(!enabledState.get());

          Events.fireVisualBlocks(editor, enabledState.get());
      };

      return {
          toggleVisualBlocks: toggleVisualBlocks
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
  'tinymce.plugins.visualblocks.api.Commands',
        [
            'tinymce.plugins.visualblocks.core.VisualBlocks'
        ],
  function (VisualBlocks) {
      var register = function (editor, pluginUrl, enabledState) {
          editor.addCommand('mceVisualBlocks', function () {
              VisualBlocks.toggleVisualBlocks(editor, pluginUrl, enabledState);
          });
      };

      return {
          register: register
      };
  }
);
/**
 * Bindings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.visualblocks.core.Bindings',
        [
            'tinymce.plugins.visualblocks.api.Settings',
            'tinymce.plugins.visualblocks.core.VisualBlocks'
        ],
  function (Settings, VisualBlocks) {
      var setup = function (editor, pluginUrl, enabledState) {
      // Prevents the visualblocks from being presented in the preview of formats when that is computed
          editor.on('PreviewFormats AfterPreviewFormats', function (e) {
              if (enabledState.get()) {
                  editor.dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type === 'afterpreviewformats');
              }
          });

          editor.on('init', function () {
              if (Settings.isEnabledByDefault(editor)) {
                  VisualBlocks.toggleVisualBlocks(editor, pluginUrl, enabledState);
              }
          });

          editor.on('remove', function () {
              editor.dom.removeClass(editor.getBody(), 'mce-visualblocks');
          });
      };

      return {
          setup: setup
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
  'tinymce.plugins.visualblocks.ui.Buttons',
        [
            'tinymce.plugins.visualblocks.core.VisualBlocks'
        ],
  function (VisualBlocks) {
      var toggleActiveState = function (editor, enabledState) {
          return function (e) {
              var ctrl = e.control;

              ctrl.active(enabledState.get());

              editor.on('VisualBlocks', function (e) {
                  ctrl.active(e.state);
              });
          };
      };

      var register = function (editor, enabledState) {
          editor.addButton('visualblocks', {
              title: 'Show blocks',
              cmd: 'mceVisualBlocks',
              onPostRender: toggleActiveState(editor, enabledState)
          });

          editor.addMenuItem('visualblocks', {
              text: 'Show blocks',
              cmd: 'mceVisualBlocks',
              onPostRender: toggleActiveState(editor, enabledState),
              selectable: true,
              context: 'view',
              prependToContext: true
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
  'tinymce.plugins.visualblocks.Plugin',
        [
            'ephox.katamari.api.Cell',
            'tinymce.core.PluginManager',
            'tinymce.plugins.visualblocks.api.Commands',
            'tinymce.plugins.visualblocks.core.Bindings',
            'tinymce.plugins.visualblocks.ui.Buttons'
        ],
  function (Cell, PluginManager, Commands, Bindings, Buttons) {
      PluginManager.add('visualblocks', function (editor, pluginUrl) {
          var enabledState = Cell(false);

          Commands.register(editor, pluginUrl, enabledState);
          Buttons.register(editor, enabledState);
          Bindings.setup(editor, pluginUrl, enabledState);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.visualblocks.Plugin')();
})();
