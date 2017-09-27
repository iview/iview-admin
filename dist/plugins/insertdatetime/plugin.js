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
["tinymce.plugins.insertdatetime.Plugin","tinymce.core.PluginManager","tinymce.core.util.Tools","global!tinymce.util.Tools.resolve"]
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
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the insertdatetime plugin.
 *
 * @class tinymce.insertdatetime.Plugin
 * @private
 */
define(
  'tinymce.plugins.insertdatetime.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.util.Tools'
  ],
  function (PluginManager, Tools) {
    PluginManager.add('insertdatetime', function (editor) {
      var daysShort = "Sun Mon Tue Wed Thu Fri Sat Sun".split(' ');
      var daysLong = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(' ');
      var monthsShort = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ');
      var monthsLong = "January February March April May June July August September October November December".split(' ');
      var menuItems = [], lastFormat, defaultButtonTimeFormat;

      function getDateTime(fmt, date) {
        function addZeros(value, len) {
          value = "" + value;

          if (value.length < len) {
            for (var i = 0; i < (len - value.length); i++) {
              value = "0" + value;
            }
          }

          return value;
        }

        date = date || new Date();

        fmt = fmt.replace("%D", "%m/%d/%Y");
        fmt = fmt.replace("%r", "%I:%M:%S %p");
        fmt = fmt.replace("%Y", "" + date.getFullYear());
        fmt = fmt.replace("%y", "" + date.getYear());
        fmt = fmt.replace("%m", addZeros(date.getMonth() + 1, 2));
        fmt = fmt.replace("%d", addZeros(date.getDate(), 2));
        fmt = fmt.replace("%H", "" + addZeros(date.getHours(), 2));
        fmt = fmt.replace("%M", "" + addZeros(date.getMinutes(), 2));
        fmt = fmt.replace("%S", "" + addZeros(date.getSeconds(), 2));
        fmt = fmt.replace("%I", "" + ((date.getHours() + 11) % 12 + 1));
        fmt = fmt.replace("%p", "" + (date.getHours() < 12 ? "AM" : "PM"));
        fmt = fmt.replace("%B", "" + editor.translate(monthsLong[date.getMonth()]));
        fmt = fmt.replace("%b", "" + editor.translate(monthsShort[date.getMonth()]));
        fmt = fmt.replace("%A", "" + editor.translate(daysLong[date.getDay()]));
        fmt = fmt.replace("%a", "" + editor.translate(daysShort[date.getDay()]));
        fmt = fmt.replace("%%", "%");

        return fmt;
      }

      function insertDateTime(format) {
        var html = getDateTime(format);

        if (editor.settings.insertdatetime_element) {
          var computerTime;

          if (/%[HMSIp]/.test(format)) {
            computerTime = getDateTime("%Y-%m-%dT%H:%M");
          } else {
            computerTime = getDateTime("%Y-%m-%d");
          }

          html = '<time datetime="' + computerTime + '">' + html + '</time>';

          var timeElm = editor.dom.getParent(editor.selection.getStart(), 'time');
          if (timeElm) {
            editor.dom.setOuterHTML(timeElm, html);
            return;
          }
        }

        editor.insertContent(html);
      }

      editor.addCommand('mceInsertDate', function () {
        insertDateTime(editor.getParam("insertdatetime_dateformat", editor.translate("%Y-%m-%d")));
      });

      editor.addCommand('mceInsertTime', function () {
        insertDateTime(editor.getParam("insertdatetime_timeformat", editor.translate('%H:%M:%S')));
      });

      editor.addButton('insertdatetime', {
        type: 'splitbutton',
        title: 'Insert date/time',
        onclick: function () {
          insertDateTime(lastFormat || defaultButtonTimeFormat);
        },
        menu: menuItems
      });

      Tools.each(editor.settings.insertdatetime_formats || [
        "%H:%M:%S",
        "%Y-%m-%d",
        "%I:%M:%S %p",
        "%D"
      ], function (fmt) {
        if (!defaultButtonTimeFormat) {
          defaultButtonTimeFormat = fmt;
        }

        menuItems.push({
          text: getDateTime(fmt),
          onclick: function () {
            lastFormat = fmt;
            insertDateTime(fmt);
          }
        });
      });

      editor.addMenuItem('insertdatetime', {
        icon: 'date',
        text: 'Date/time',
        menu: menuItems,
        context: 'insert'
      });
    });
    return function () { };
  }
);
dem('tinymce.plugins.insertdatetime.Plugin')();
})();
