(function () {

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
var register_3795 = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
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
  for (var i = 0; i < len; ++i)
    instances[i] = dem(dependencies[i]);
  var defResult = definition.apply(null, instances);
  if (defResult === undefined)
     throw 'module [' + id + '] returned undefined';
  actual.instance = defResult;
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var len = ids.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
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
// this helps with minificiation when using a lot of global references
var defineGlobal = function (id, ref) {
  define(id, [], function () { return ref; });
};
/*jsc
["tinymce.plugins.visualblocks.Plugin","tinymce.core.PluginManager","tinymce.plugins.visualblocks.api.Commands","tinymce.plugins.visualblocks.core.Bindings","tinymce.plugins.visualblocks.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.visualblocks.core.VisualBlocks","tinymce.plugins.visualblocks.api.Settings","tinymce.plugins.visualblocks.api.Events","tinymce.plugins.visualblocks.core.LoadCss","tinymce.core.dom.DOMUtils","tinymce.core.util.Tools"]
jsc*/
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
    var isEnabled = function (editor) {
      return editor.dom ? editor.dom.hasClass(editor.getBody(), 'mce-visualblocks') : false;
    };

    var toggleVisualBlocks = function (editor, pluginUrl) {
      var dom = editor.dom;
      var contentCss = Settings.getContentCss(editor);

      LoadCss.load(editor.getDoc(), contentCss ? contentCss : pluginUrl + '/css/visualblocks.css');
      dom.toggleClass(editor.getBody(), 'mce-visualblocks');

      Events.fireVisualBlocks(editor, isEnabled(editor));
    };

    return {
      toggleVisualBlocks: toggleVisualBlocks,
      isEnabled: isEnabled
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
    var register = function (editor, pluginUrl) {
      editor.addCommand('mceVisualBlocks', function () {
        VisualBlocks.toggleVisualBlocks(editor, pluginUrl);
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
    var setup = function (editor, pluginUrl) {
      editor.on('PreviewFormats AfterPreviewFormats', function (e) {
        if (VisualBlocks.isEnabled(editor)) {
          editor.dom.toggleClass(editor.getBody(), 'mce-visualblocks', e.type === 'afterpreviewformats');
        }
      });

      editor.on('init', function () {
        if (Settings.isEnabledByDefault(editor)) {
          VisualBlocks.toggleVisualBlocks(editor, pluginUrl);
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
    var toggleActiveState = function (editor) {
      return function (e) {
        var ctrl = e.control;

        ctrl.active(VisualBlocks.isEnabled(editor));

        editor.on('VisualBlocks', function (e) {
          ctrl.active(e.state);
        });
      };
    };

    var register = function (editor) {
      editor.addButton('visualblocks', {
        title: 'Show blocks',
        cmd: 'mceVisualBlocks',
        onPostRender: toggleActiveState(editor)
      });

      editor.addMenuItem('visualblocks', {
        text: 'Show blocks',
        cmd: 'mceVisualBlocks',
        onPostRender: toggleActiveState(editor),
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
    'tinymce.core.PluginManager',
    'tinymce.plugins.visualblocks.api.Commands',
    'tinymce.plugins.visualblocks.core.Bindings',
    'tinymce.plugins.visualblocks.ui.Buttons'
  ],
  function (PluginManager, Commands, Bindings, Buttons) {
    PluginManager.add('visualblocks', function (editor, pluginUrl) {
      Commands.register(editor, pluginUrl);
      Buttons.register(editor);
      Bindings.setup(editor, pluginUrl);
    });

    return function () { };
  }
);
dem('tinymce.plugins.visualblocks.Plugin')();
})();
