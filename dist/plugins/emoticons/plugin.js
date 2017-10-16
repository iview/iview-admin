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
["tinymce.plugins.emoticons.Plugin","tinymce.core.PluginManager","tinymce.plugins.emoticons.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.emoticons.ui.PanelHtml","tinymce.core.util.Tools"]
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
 * PanelHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.emoticons.ui.PanelHtml',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var emoticons = [
      ["cool", "cry", "embarassed", "foot-in-mouth"],
      ["frown", "innocent", "kiss", "laughing"],
      ["money-mouth", "sealed", "smile", "surprised"],
      ["tongue-out", "undecided", "wink", "yell"]
    ];

    var getHtml = function (pluginUrl) {
      var emoticonsHtml;

      emoticonsHtml = '<table role="list" class="mce-grid">';

      Tools.each(emoticons, function (row) {
        emoticonsHtml += '<tr>';

        Tools.each(row, function (icon) {
          var emoticonUrl = pluginUrl + '/img/smiley-' + icon + '.gif';

          emoticonsHtml += '<td><a href="#" data-mce-url="' + emoticonUrl + '" data-mce-alt="' + icon + '" tabindex="-1" ' +
            'role="option" aria-label="' + icon + '"><img src="' +
            emoticonUrl + '" style="width: 18px; height: 18px" role="presentation" /></a></td>';
        });

        emoticonsHtml += '</tr>';
      });

      emoticonsHtml += '</table>';

      return emoticonsHtml;
    };

    return {
      getHtml: getHtml
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
  'tinymce.plugins.emoticons.ui.Buttons',
  [
    'tinymce.plugins.emoticons.ui.PanelHtml'
  ],
  function (PanelHtml) {
    var insertEmoticon = function (editor, src, alt) {
      editor.insertContent(editor.dom.createHTML('img', { src: src, alt: alt }));
    };

    var register = function (editor, pluginUrl) {
      var panelHtml = PanelHtml.getHtml(pluginUrl);

      editor.addButton('emoticons', {
        type: 'panelbutton',
        panel: {
          role: 'application',
          autohide: true,
          html: panelHtml,
          onclick: function (e) {
            var linkElm = editor.dom.getParent(e.target, 'a');
            if (linkElm) {
              insertEmoticon(editor, linkElm.getAttribute('data-mce-url'), linkElm.getAttribute('data-mce-alt'));
              this.hide();
            }
          }
        },
        tooltip: 'Emoticons'
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

/**
 * This class contains all core logic for the emoticons plugin.
 *
 * @class tinymce.emoticons.Plugin
 * @private
 */
define(
  'tinymce.plugins.emoticons.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.emoticons.ui.Buttons'
  ],
  function (PluginManager, Buttons) {
    PluginManager.add('emoticons', function (editor, pluginUrl) {
      Buttons.register(editor, pluginUrl);
    });

    return function () { };
  }
);
dem('tinymce.plugins.emoticons.Plugin')();
})();
