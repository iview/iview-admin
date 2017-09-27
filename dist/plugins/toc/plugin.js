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
["tinymce.plugins.toc.Plugin","tinymce.core.PluginManager","tinymce.core.util.I18n","tinymce.core.util.Tools","global!tinymce.util.Tools.resolve"]
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
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the code plugin.
 *
 * @class tinymce.toc.Plugin
 * @private
 */
define(
  'tinymce.plugins.toc.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.util.I18n',
    'tinymce.core.util.Tools'
  ],
  function (PluginManager, I18n, Tools) {
    PluginManager.add('toc', function (editor) {
      var $ = editor.$;
      var opts;

      var defs = {
        depth: 3,
        headerTag: 'h2',
        className: 'mce-toc'
      };

      var guid = function (prefix) {
        var counter = 0;
        return function () {
          var guid = new Date().getTime().toString(32);
          return prefix + guid + (counter++).toString(32);
        };
      };

      var tocId = guid('mcetoc_');


      function isValidTag(tagName) {
        return tagName ? editor.schema.isValidChild('div', tagName) : false;
      }


      function isToc(elm) {
        return elm && editor.dom.is(elm, '.' + opts.className) && editor.getBody().contains(elm);
      }


      function toggleState() {
        var self = this;

        self.disabled(editor.readonly || !haveHeaders());

        editor.on('LoadContent SetContent change', function () {
          self.disabled(editor.readonly || !haveHeaders());
        });
      }


      function generateSelector(depth) {
        var i, selector = [];
        for (i = 1; i <= depth; i++) {
          selector.push('h' + i);
        }
        return selector.join(',');
      }


      function haveHeaders() {
        return !!(opts && prepareHeaders(opts).length);
      }


      function prepareHeaders(o) {
        var selector = generateSelector(o.depth);
        var headers = $(selector);

        // if headerTag is one of h1-9, we need to filter it out from the set
        if (headers.length && /^h[1-9]$/i.test(o.headerTag)) {
          headers = headers.filter(function (i, el) {
            return !editor.dom.hasClass(el.parentNode, o.className);
          });
        }

        return Tools.map(headers, function (h) {
          if (!h.id) {
            h.id = tocId();
          }
          return {
            id: h.id,
            level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
            title: $.text(h)
          };
        });
      }


      function getMinLevel(headers) {
        var i, minLevel = 9;

        for (i = 0; i < headers.length; i++) {
          if (headers[i].level < minLevel) {
            minLevel = headers[i].level;
          }

          // do not proceed if we have reached absolute minimum
          if (minLevel == 1) {
            return minLevel;
          }
        }
        return minLevel;
      }


      function generateTitle(tag, title) {
        var openTag = '<' + tag + ' contenteditable="true">';
        var closeTag = '</' + tag + '>';
        return openTag + editor.dom.encode(title) + closeTag;
      }


      function generateTocHtml(o) {
        var html = generateTocContentHtml(o);
        return '<div class="' + o.className + '" contenteditable="false">' + html + '</div>';
      }


      function generateTocContentHtml(o) {
        var html = '';
        var headers = prepareHeaders(o);
        var prevLevel = getMinLevel(headers) - 1;
        var i, ii, h, nextLevel;

        if (!headers.length) {
          return '';
        }

        html += generateTitle(o.headerTag, I18n.translate("Table of Contents"));

        for (i = 0; i < headers.length; i++) {
          h = headers[i];
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
      }


      editor.on('PreInit', function () {
        var s = editor.settings;
        var depth = parseInt(s.toc_depth, 10) || 0;

        opts = {
          depth: depth >= 1 && depth <= 9 ? depth : defs.depth,
          headerTag: isValidTag(s.toc_header) ? s.toc_header : defs.headerTag,
          className: s.toc_class ? editor.dom.encode(s.toc_class) : defs.className
        };
      });


      editor.on('PreProcess', function (e) {
        var $tocElm = $('.' + opts.className, e.node);
        if ($tocElm.length) {
          $tocElm.removeAttr('contentEditable');
          $tocElm.find('[contenteditable]').removeAttr('contentEditable');
        }
      });


      editor.on('SetContent', function () {
        var $tocElm = $('.' + opts.className);
        if ($tocElm.length) {
          $tocElm.attr('contentEditable', false);
          $tocElm.children(':first-child').attr('contentEditable', true);
        }
      });

      var isEmptyOrOffscren = function (nodes) {
        return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0;
      };

      editor.addCommand('mceInsertToc', function () {
        var $tocElm = $('.' + opts.className);

        if (isEmptyOrOffscren($tocElm)) {
          editor.insertContent(generateTocHtml(opts));
        } else {
          editor.execCommand('mceUpdateToc');
        }
      });


      editor.addCommand('mceUpdateToc', function () {
        var $tocElm = $('.' + opts.className);
        if ($tocElm.length) {
          editor.undoManager.transact(function () {
            $tocElm.html(generateTocContentHtml(opts));
          });
        }
      });


      editor.addButton('toc', {
        tooltip: 'Table of Contents',
        cmd: 'mceInsertToc',
        icon: 'toc',
        onPostRender: toggleState
      });

      editor.addButton('tocupdate', {
        tooltip: 'Update',
        cmd: 'mceUpdateToc',
        icon: 'reload'
      });

      editor.addContextToolbar(
        isToc,
        'tocupdate'
      );

      editor.addMenuItem('toc', {
        text: "Table of Contents",
        context: 'insert',
        cmd: 'mceInsertToc',
        onPostRender: toggleState
      });
    });


    return function () { };
  }
);
dem('tinymce.plugins.toc.Plugin')();
})();
