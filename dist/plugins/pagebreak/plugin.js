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
["tinymce.plugins.pagebreak.Plugin","tinymce.core.PluginManager","tinymce.core.Env","global!tinymce.util.Tools.resolve"]
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
  'tinymce.core.Env',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.Env');
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

/**
 * This class contains all core logic for the pagebreak plugin.
 *
 * @class tinymce.pagebreak.Plugin
 * @private
 */
define(
  'tinymce.plugins.pagebreak.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.Env'
  ],
  function (PluginManager, Env) {
    PluginManager.add('pagebreak', function (editor) {
      var pageBreakClass = 'mce-pagebreak', separatorHtml = editor.getParam('pagebreak_separator', '<!-- pagebreak -->');

      var pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, function (a) {
        return '\\' + a;
      }), 'gi');

      var pageBreakPlaceHolderHtml = '<img src="' + Env.transparentSrc + '" class="' +
        pageBreakClass + '" data-mce-resize="false" data-mce-placeholder />';

      // Register commands
      editor.addCommand('mcePageBreak', function () {
        if (editor.settings.pagebreak_split_block) {
          editor.insertContent('<p>' + pageBreakPlaceHolderHtml + '</p>');
        } else {
          editor.insertContent(pageBreakPlaceHolderHtml);
        }
      });

      // Register buttons
      editor.addButton('pagebreak', {
        title: 'Page break',
        cmd: 'mcePageBreak'
      });

      editor.addMenuItem('pagebreak', {
        text: 'Page break',
        icon: 'pagebreak',
        cmd: 'mcePageBreak',
        context: 'insert'
      });

      editor.on('ResolveName', function (e) {
        if (e.target.nodeName == 'IMG' && editor.dom.hasClass(e.target, pageBreakClass)) {
          e.name = 'pagebreak';
        }
      });

      editor.on('click', function (e) {
        e = e.target;

        if (e.nodeName === 'IMG' && editor.dom.hasClass(e, pageBreakClass)) {
          editor.selection.select(e);
        }
      });

      editor.on('BeforeSetContent', function (e) {
        e.content = e.content.replace(pageBreakSeparatorRegExp, pageBreakPlaceHolderHtml);
      });

      editor.on('PreInit', function () {
        editor.serializer.addNodeFilter('img', function (nodes) {
          var i = nodes.length, node, className;

          while (i--) {
            node = nodes[i];
            className = node.attr('class');
            if (className && className.indexOf('mce-pagebreak') !== -1) {
              // Replace parent block node if pagebreak_split_block is enabled
              var parentNode = node.parent;
              if (editor.schema.getBlockElements()[parentNode.name] && editor.settings.pagebreak_split_block) {
                parentNode.type = 3;
                parentNode.value = separatorHtml;
                parentNode.raw = true;
                node.remove();
                continue;
              }

              node.type = 3;
              node.value = separatorHtml;
              node.raw = true;
            }
          }
        });
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.pagebreak.Plugin')();
})();
