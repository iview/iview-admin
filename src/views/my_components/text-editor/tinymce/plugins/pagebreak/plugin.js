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
["tinymce.plugins.pagebreak.Plugin","tinymce.core.Env","tinymce.core.PluginManager","tinymce.plugins.pagebreak.api.Commands","tinymce.plugins.pagebreak.core.FilterContent","tinymce.plugins.pagebreak.core.ResolveName","tinymce.plugins.pagebreak.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.pagebreak.api.Settings"]
jsc */
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
  'tinymce.core.Env',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.Env');
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
  'tinymce.core.PluginManager',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.PluginManager');
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
  'tinymce.plugins.pagebreak.api.Settings',
        [
        ],
  function () {
      var getSeparatorHtml = function (editor) {
          return editor.getParam('pagebreak_separator', '<!-- pagebreak -->');
      };

      var shouldSplitBlock = function (editor) {
          return editor.getParam('pagebreak_split_block', false);
      };

      return {
          getSeparatorHtml: getSeparatorHtml,
          shouldSplitBlock: shouldSplitBlock
      };
  }
);

/**
 * FilterContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.pagebreak.core.FilterContent',
        [
            'tinymce.core.Env',
            'tinymce.plugins.pagebreak.api.Settings'
        ],
  function (Env, Settings) {
      var getPageBreakClass = function () {
          return 'mce-pagebreak';
      };

      var getPlaceholderHtml = function () {
          return '<img src="' + Env.transparentSrc + '" class="' + getPageBreakClass() + '" data-mce-resize="false" data-mce-placeholder />';
      };

      var setup = function (editor) {
          var separatorHtml = Settings.getSeparatorHtml(editor);

          var pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, function (a) {
              return '\\' + a;
          }), 'gi');

          editor.on('BeforeSetContent', function (e) {
              e.content = e.content.replace(pageBreakSeparatorRegExp, getPlaceholderHtml());
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
                          if (editor.schema.getBlockElements()[parentNode.name] && Settings.shouldSplitBlock(editor)) {
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
      };

      return {
          setup: setup,
          getPlaceholderHtml: getPlaceholderHtml,
          getPageBreakClass: getPageBreakClass
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
  'tinymce.plugins.pagebreak.api.Commands',
        [
            'tinymce.plugins.pagebreak.core.FilterContent'
        ],
  function (FilterContent) {
      var register = function (editor) {
          editor.addCommand('mcePageBreak', function () {
              if (editor.settings.pagebreak_split_block) {
                  editor.insertContent('<p>' + FilterContent.getPlaceholderHtml() + '</p>');
              } else {
                  editor.insertContent(FilterContent.getPlaceholderHtml());
              }
          });
      };

      return {
          register: register
      };
  }
);
/**
 * ResolveName.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.pagebreak.core.ResolveName',
        [
            'tinymce.plugins.pagebreak.core.FilterContent'
        ],
  function (FilterContent) {
      var setup = function (editor) {
          editor.on('ResolveName', function (e) {
              if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, FilterContent.getPageBreakClass())) {
                  e.name = 'pagebreak';
              }
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
  'tinymce.plugins.pagebreak.ui.Buttons',
        [
        ],
  function () {
      var register = function (editor) {
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
  'tinymce.plugins.pagebreak.Plugin',
        [
            'tinymce.core.Env',
            'tinymce.core.PluginManager',
            'tinymce.plugins.pagebreak.api.Commands',
            'tinymce.plugins.pagebreak.core.FilterContent',
            'tinymce.plugins.pagebreak.core.ResolveName',
            'tinymce.plugins.pagebreak.ui.Buttons'
        ],
  function (Env, PluginManager, Commands, FilterContent, ResolveName, Buttons) {
      PluginManager.add('pagebreak', function (editor) {
          Commands.register(editor);
          Buttons.register(editor);
          FilterContent.setup(editor);
          ResolveName.setup(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.pagebreak.Plugin')();
})();
