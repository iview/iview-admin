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
    instances[i] = dem(ids[i]);
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
/*jsc
["tinymce.plugins.advlist.Plugin","tinymce.core.PluginManager","tinymce.core.util.Tools","tinymce.plugins.advlist.api.Commands","tinymce.plugins.advlist.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.advlist.core.Actions","tinymce.plugins.advlist.api.Settings","tinymce.plugins.advlist.core.ListUtils","tinymce.plugins.advlist.ui.ListStyles"]
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
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.core.Actions',
  [
  ],
  function () {
    var applyListFormat = function (editor, listName, styleValue) {
      var cmd = listName === 'UL' ? 'InsertUnorderedList' : 'InsertOrderedList';
      editor.execCommand(cmd, false, styleValue === false ? null : { 'list-style-type': styleValue });
    };

    return {
      applyListFormat: applyListFormat
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
  'tinymce.plugins.advlist.api.Commands',
  [
    'tinymce.plugins.advlist.core.Actions'
  ],
  function (Actions) {
    var register = function (editor) {
      editor.addCommand('ApplyUnorderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'UL', value['list-style-type']);
      });

      editor.addCommand('ApplyOrderedListStyle', function (ui, value) {
        Actions.applyListFormat(editor, 'OL', value['list-style-type']);
      });
    };

    return {
      register: register
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
  'tinymce.plugins.advlist.api.Settings',
  [
  ],
  function () {
    var getNumberStyles = function (editor) {
      var styles = editor.getParam('advlist_number_styles', 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman');
      return styles ? styles.split(/[ ,]/) : [];
    };

    var getBulletStyles = function (editor) {
      var styles = editor.getParam('advlist_bullet_styles', 'default,circle,disc,square');
      return styles ? styles.split(/[ ,]/) : [];
    };

    return {
      getNumberStyles: getNumberStyles,
      getBulletStyles: getBulletStyles
    };
  }
);
/**
 * ListUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.core.ListUtils',
  [
  ],
  function () {
    var isChildOfBody = function (editor, elm) {
      return editor.$.contains(editor.getBody(), elm);
    };

    var isListNode = function (editor) {
      return function (node) {
        return node && (/^(OL|UL|DL)$/).test(node.nodeName) && isChildOfBody(editor, node);
      };
    };

    var getSelectedStyleType = function (editor) {
      var listElm = editor.dom.getParent(editor.selection.getNode(), 'ol,ul');
      return editor.dom.getStyle(listElm, 'listStyleType') || '';
    };

    return {
      isListNode: isListNode,
      getSelectedStyleType: getSelectedStyleType
    };
  }
);
/**
 * ListStyles.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.advlist.ui.ListStyles',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var styleValueToText = function (styleValue) {
      return styleValue.replace(/\-/g, ' ').replace(/\b\w/g, function (chr) {
        return chr.toUpperCase();
      });
    };

    var toMenuItems = function (styles) {
      return Tools.map(styles, function (styleValue) {
        var text = styleValueToText(styleValue);
        var data = styleValue === 'default' ? '' : styleValue;

        return { text: text, data: data };
      });
    };

    return {
      toMenuItems: toMenuItems
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
  'tinymce.plugins.advlist.ui.Buttons',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.advlist.api.Settings',
    'tinymce.plugins.advlist.core.Actions',
    'tinymce.plugins.advlist.core.ListUtils',
    'tinymce.plugins.advlist.ui.ListStyles'
  ],
  function (Tools, Settings, Actions, ListUtils, ListStyles) {
    var listState = function (editor, listName) {
      return function (e) {
        var ctrl = e.control;

        editor.on('NodeChange', function (e) {
          var lists = Tools.grep(e.parents, ListUtils.isListNode(editor));
          ctrl.active(lists.length > 0 && lists[0].nodeName === listName);
        });
      };
    };

    var updateSelection = function (editor) {
      return function (e) {
        var listStyleType = ListUtils.getSelectedStyleType(editor);
        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === listStyleType);
        });
      };
    };

    var addSplitButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        type: 'splitbutton',
        tooltip: tooltip,
        menu: ListStyles.toMenuItems(styles),
        onPostRender: listState(editor, nodeName),
        onshow: updateSelection(editor),
        onselect: function (e) {
          Actions.applyListFormat(editor, nodeName, e.control.settings.data);
        },
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };

    var addButton = function (editor, id, tooltip, cmd, nodeName, styles) {
      editor.addButton(id, {
        type: 'button',
        tooltip: tooltip,
        onPostRender: listState(editor, nodeName),
        onclick: function () {
          editor.execCommand(cmd);
        }
      });
    };

    var addControl = function (editor, id, tooltip, cmd, nodeName, styles) {
      if (styles.length > 0) {
        addSplitButton(editor, id, tooltip, cmd, nodeName, styles);
      } else {
        addButton(editor, id, tooltip, cmd, nodeName, styles);
      }
    };

    var register = function (editor) {
      addControl(editor, 'numlist', 'Numbered list', 'InsertOrderedList', 'OL', Settings.getNumberStyles(editor));
      addControl(editor, 'bullist', 'Bullet list', 'InsertUnorderedList', 'UL', Settings.getBulletStyles(editor));
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
  'tinymce.plugins.advlist.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.util.Tools',
    'tinymce.plugins.advlist.api.Commands',
    'tinymce.plugins.advlist.ui.Buttons'
  ],
  function (PluginManager, Tools, Commands, Buttons) {
    PluginManager.add('advlist', function (editor) {
      var hasPlugin = function (editor, plugin) {
        var plugins = editor.settings.plugins ? editor.settings.plugins : '';
        return Tools.inArray(plugins.split(/[ ,]/), plugin) !== -1;
      };

      if (hasPlugin(editor, "lists")) {
        Buttons.register(editor);
        Commands.register(editor);
      }
    });

    return function () { };
  }
);
dem('tinymce.plugins.advlist.Plugin')();
})();
