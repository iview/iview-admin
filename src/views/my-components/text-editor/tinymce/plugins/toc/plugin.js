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
["tinymce.plugins.toc.Plugin","tinymce.core.PluginManager","tinymce.plugins.toc.api.Commands","tinymce.plugins.toc.api.Settings","tinymce.plugins.toc.core.FilterContent","tinymce.plugins.toc.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.toc.core.Toc","tinymce.core.dom.DOMUtils","tinymce.core.util.I18n","tinymce.core.util.Tools","tinymce.plugins.toc.core.Guid"]
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
  'tinymce.core.util.I18n',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.I18n');
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
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.toc.api.Settings',
        [
        ],
  function () {
      var getTocClass = function (editor) {
          return editor.getParam('toc_class', 'mce-toc');
      };

      var getTocHeader = function (editor) {
          var tagName = editor.getParam('toc_header', 'h2');
          return /^h[1-6]$/.test(tagName) ? tagName : 'h2';
      };

      var getTocDepth = function (editor) {
          var depth = parseInt(editor.getParam('toc_depth', '3'), 10);
          return depth >= 1 && depth <= 9 ? depth : 3;
      };

      return {
          getTocClass: getTocClass,
          getTocHeader: getTocHeader,
          getTocDepth: getTocDepth
      };
  }
);

/**
 * Guid.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.toc.core.Guid',
        [
        ],
  function () {
      var create = function (prefix) {
          var counter = 0;

          return function () {
              var guid = new Date().getTime().toString(32);
              return prefix + guid + (counter++).toString(32);
          };
      };

      return {
          create: create
      };
  }
);
/**
 * Toc.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.toc.core.Toc',
        [
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.util.I18n',
            'tinymce.core.util.Tools',
            'tinymce.plugins.toc.api.Settings',
            'tinymce.plugins.toc.core.Guid'
        ],
  function (DOMUtils, I18n, Tools, Settings, Guid) {
      var tocId = Guid.create('mcetoc_');

      var generateSelector = function generateSelector (depth) {
          var i, selector = [];
          for (i = 1; i <= depth; i++) {
              selector.push('h' + i);
          }
          return selector.join(',');
      };

      var hasHeaders = function (editor) {
          return readHeaders(editor).length > 0;
      };

      var readHeaders = function (editor) {
          var tocClass = Settings.getTocClass(editor);
          var headerTag = Settings.getTocHeader(editor);
          var selector = generateSelector(Settings.getTocDepth(editor));
          var headers = editor.$(selector);

      // if headerTag is one of h1-9, we need to filter it out from the set
          if (headers.length && /^h[1-9]$/i.test(headerTag)) {
              headers = headers.filter(function (i, el) {
                  return !editor.dom.hasClass(el.parentNode, tocClass);
              });
          }

          return Tools.map(headers, function (h) {
              return {
                  id: h.id ? h.id : tocId(),
                  level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
                  title: editor.$.text(h),
                  element: h
              };
          });
      };

      var getMinLevel = function (headers) {
          var i, minLevel = 9;

          for (i = 0; i < headers.length; i++) {
              if (headers[i].level < minLevel) {
                  minLevel = headers[i].level;
              }

        // do not proceed if we have reached absolute minimum
              if (minLevel === 1) {
                  return minLevel;
              }
          }
          return minLevel;
      };

      var generateTitle = function (tag, title) {
          var openTag = '<' + tag + ' contenteditable="true">';
          var closeTag = '</' + tag + '>';
          return openTag + DOMUtils.DOM.encode(title) + closeTag;
      };

      var generateTocHtml = function (editor) {
          var html = generateTocContentHtml(editor);
          return '<div class="' + editor.dom.encode(Settings.getTocClass(editor)) + '" contenteditable="false">' + html + '</div>';
      };

      var generateTocContentHtml = function (editor) {
          var html = '';
          var headers = readHeaders(editor);
          var prevLevel = getMinLevel(headers) - 1;
          var i, ii, h, nextLevel;

          if (!headers.length) {
              return '';
          }

          html += generateTitle(Settings.getTocHeader(editor), I18n.translate('Table of Contents'));

          for (i = 0; i < headers.length; i++) {
              h = headers[i];
              h.element.id = h.id;
              nextLevel = headers[i + 1] && headers[i + 1].level;

              if (prevLevel === h.level) {
                  html += '<li>';
              } else {
                  for (ii = prevLevel; ii < h.level; ii++) {
                      html += '<ul><li>';
                  }
              }

              html += '<a href="#' + h.id + '">' + h.title + '</a>';

              if (nextLevel === h.level || !nextLevel) {
                  html += '</li>';

                  if (!nextLevel) {
                      html += '</ul>';
                  }
              } else {
                  for (ii = h.level; ii > nextLevel; ii--) {
                      html += '</li></ul><li>';
                  }
              }

              prevLevel = h.level;
          }

          return html;
      };

      var isEmptyOrOffscren = function (editor, nodes) {
          return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0;
      };

      var insertToc = function (editor) {
          var tocClass = Settings.getTocClass(editor);
          var $tocElm = editor.$('.' + tocClass);

          if (isEmptyOrOffscren(editor, $tocElm)) {
              editor.insertContent(generateTocHtml(editor));
          } else {
              updateToc(editor);
          }
      };

      var updateToc = function (editor) {
          var tocClass = Settings.getTocClass(editor);
          var $tocElm = editor.$('.' + tocClass);

          if ($tocElm.length) {
              editor.undoManager.transact(function () {
                  $tocElm.html(generateTocContentHtml(editor));
              });
          }
      };

      return {
          hasHeaders: hasHeaders,
          insertToc: insertToc,
          updateToc: updateToc
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
  'tinymce.plugins.toc.api.Commands',
        [
            'tinymce.plugins.toc.core.Toc'
        ],
  function (Toc) {
      var register = function (editor) {
          editor.addCommand('mceInsertToc', function () {
              Toc.insertToc(editor);
          });

          editor.addCommand('mceUpdateToc', function () {
              Toc.updateToc(editor);
          });
      };

      return {
          register: register
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
  'tinymce.plugins.toc.core.FilterContent',
        [
            'tinymce.plugins.toc.api.Settings'
        ],
  function (Settings) {
      var setup = function (editor) {
          var $ = editor.$, tocClass = Settings.getTocClass(editor);

          editor.on('PreProcess', function (e) {
              var $tocElm = $('.' + tocClass, e.node);
              if ($tocElm.length) {
                  $tocElm.removeAttr('contentEditable');
                  $tocElm.find('[contenteditable]').removeAttr('contentEditable');
              }
          });

          editor.on('SetContent', function () {
              var $tocElm = $('.' + tocClass);
              if ($tocElm.length) {
                  $tocElm.attr('contentEditable', false);
                  $tocElm.children(':first-child').attr('contentEditable', true);
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
  'tinymce.plugins.toc.ui.Buttons',
        [
            'tinymce.plugins.toc.api.Settings',
            'tinymce.plugins.toc.core.Toc'
        ],
  function (Settings, Toc) {
      var toggleState = function (editor) {
          return function (e) {
              var ctrl = e.control;

              editor.on('LoadContent SetContent change', function () {
                  ctrl.disabled(editor.readonly || !Toc.hasHeaders(editor));
              });
          };
      };

      var isToc = function (editor) {
          return function (elm) {
              return elm && editor.dom.is(elm, '.' + Settings.getTocClass(editor)) && editor.getBody().contains(elm);
          };
      };

      var register = function (editor) {
          editor.addButton('toc', {
              tooltip: 'Table of Contents',
              cmd: 'mceInsertToc',
              icon: 'toc',
              onPostRender: toggleState(editor)
          });

          editor.addButton('tocupdate', {
              tooltip: 'Update',
              cmd: 'mceUpdateToc',
              icon: 'reload'
          });

          editor.addMenuItem('toc', {
              text: 'Table of Contents',
              context: 'insert',
              cmd: 'mceInsertToc',
              onPostRender: toggleState(editor)
          });

          editor.addContextToolbar(isToc(editor), 'tocupdate');
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
  'tinymce.plugins.toc.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.toc.api.Commands',
            'tinymce.plugins.toc.api.Settings',
            'tinymce.plugins.toc.core.FilterContent',
            'tinymce.plugins.toc.ui.Buttons'
        ],
  function (PluginManager, Commands, Settings, FilterContent, Buttons) {
      PluginManager.add('toc', function (editor) {
          Commands.register(editor);
          Buttons.register(editor);
          FilterContent.setup(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.toc.Plugin')();
})();
