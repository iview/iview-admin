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
["tinymce.plugins.insertdatetime.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.insertdatetime.api.Commands","tinymce.plugins.insertdatetime.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.fullpage.api.Settings","tinymce.plugins.insertdatetime.core.Actions","tinymce.core.util.Tools","tinymce.plugins.insertdatetime.api.Settings"]
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
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.fullpage.api.Settings',
        [
        ],
  function () {
      var shouldHideInSourceView = function (editor) {
          return editor.getParam('fullpage_hide_in_source_view');
      };

      var getDefaultXmlPi = function (editor) {
          return editor.getParam('fullpage_default_xml_pi');
      };

      var getDefaultEncoding = function (editor) {
          return editor.getParam('fullpage_default_encoding');
      };

      var getDefaultFontFamily = function (editor) {
          return editor.getParam('fullpage_default_font_family');
      };

      var getDefaultFontSize = function (editor) {
          return editor.getParam('fullpage_default_font_size');
      };

      var getDefaultTextColor = function (editor) {
          return editor.getParam('fullpage_default_text_color');
      };

      var getDefaultTitle = function (editor) {
          return editor.getParam('fullpage_default_title');
      };

      var getDefaultDocType = function (editor) {
          return editor.getParam('fullpage_default_doctype', '<!DOCTYPE html>');
      };

      return {
          shouldHideInSourceView: shouldHideInSourceView,
          getDefaultXmlPi: getDefaultXmlPi,
          getDefaultEncoding: getDefaultEncoding,
          getDefaultFontFamily: getDefaultFontFamily,
          getDefaultFontSize: getDefaultFontSize,
          getDefaultTextColor: getDefaultTextColor,
          getDefaultTitle: getDefaultTitle,
          getDefaultDocType: getDefaultDocType
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
  'tinymce.plugins.insertdatetime.api.Settings',
        [
        ],
  function () {
      var getDateFormat = function (editor) {
          return editor.getParam('insertdatetime_dateformat', editor.translate('%Y-%m-%d'));
      };

      var getTimeFormat = function (editor) {
          return editor.getParam('insertdatetime_timeformat', editor.translate('%H:%M:%S'));
      };

      var getFormats = function (editor) {
          return editor.getParam('insertdatetime_formats', ['%H:%M:%S', '%Y-%m-%d', '%I:%M:%S %p', '%D']);
      };

      var getDefaultDateTime = function (editor) {
          var formats = getFormats(editor);
          return formats.length > 0 ? formats[0] : getTimeFormat(editor);
      };

      var shouldInsertTimeElement = function (editor) {
          return editor.getParam('insertdatetime_element', false);
      };

      return {
          getDateFormat: getDateFormat,
          getTimeFormat: getTimeFormat,
          getFormats: getFormats,
          getDefaultDateTime: getDefaultDateTime,
          shouldInsertTimeElement: shouldInsertTimeElement
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
  'tinymce.plugins.insertdatetime.core.Actions',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.insertdatetime.api.Settings'
        ],
  function (Tools, Settings) {
      var daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ');
      var daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
      var monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
      var monthsLong = 'January February March April May June July August September October November December'.split(' ');

      var addZeros = function (value, len) {
          value = '' + value;

          if (value.length < len) {
              for (var i = 0; i < (len - value.length); i++) {
                  value = '0' + value;
              }
          }

          return value;
      };

      var getDateTime = function (editor, fmt, date) {
          date = date || new Date();

          fmt = fmt.replace('%D', '%m/%d/%Y');
          fmt = fmt.replace('%r', '%I:%M:%S %p');
          fmt = fmt.replace('%Y', '' + date.getFullYear());
          fmt = fmt.replace('%y', '' + date.getYear());
          fmt = fmt.replace('%m', addZeros(date.getMonth() + 1, 2));
          fmt = fmt.replace('%d', addZeros(date.getDate(), 2));
          fmt = fmt.replace('%H', '' + addZeros(date.getHours(), 2));
          fmt = fmt.replace('%M', '' + addZeros(date.getMinutes(), 2));
          fmt = fmt.replace('%S', '' + addZeros(date.getSeconds(), 2));
          fmt = fmt.replace('%I', '' + ((date.getHours() + 11) % 12 + 1));
          fmt = fmt.replace('%p', '' + (date.getHours() < 12 ? 'AM' : 'PM'));
          fmt = fmt.replace('%B', '' + editor.translate(monthsLong[date.getMonth()]));
          fmt = fmt.replace('%b', '' + editor.translate(monthsShort[date.getMonth()]));
          fmt = fmt.replace('%A', '' + editor.translate(daysLong[date.getDay()]));
          fmt = fmt.replace('%a', '' + editor.translate(daysShort[date.getDay()]));
          fmt = fmt.replace('%%', '%');

          return fmt;
      };

      var updateElement = function (editor, timeElm, computerTime, userTime) {
          var newTimeElm = editor.dom.create('time', { datetime: computerTime }, userTime);
          timeElm.parentNode.insertBefore(newTimeElm, timeElm);
          editor.dom.remove(timeElm);
          editor.selection.select(newTimeElm, true);
          editor.selection.collapse(false);
      };

      var insertDateTime = function (editor, format) {
          if (Settings.shouldInsertTimeElement(editor)) {
              var userTime = getDateTime(editor, format);
              var computerTime;

              if (/%[HMSIp]/.test(format)) {
                  computerTime = getDateTime(editor, '%Y-%m-%dT%H:%M');
              } else {
                  computerTime = getDateTime(editor, '%Y-%m-%d');
              }

              var timeElm = editor.dom.getParent(editor.selection.getStart(), 'time');

              if (timeElm) {
                  updateElement(editor, timeElm, computerTime, userTime);
              } else {
                  editor.insertContent('<time datetime="' + computerTime + '">' + userTime + '</time>');
              }
          } else {
              editor.insertContent(getDateTime(editor, format));
          }
      };

      return {
          insertDateTime: insertDateTime,
          getDateTime: getDateTime
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
  'tinymce.plugins.insertdatetime.api.Commands',
        [
            'tinymce.plugins.fullpage.api.Settings',
            'tinymce.plugins.insertdatetime.core.Actions'
        ],
  function (Settings, Actions) {
      var register = function (editor) {
          editor.addCommand('mceInsertDate', function () {
              Actions.insertDateTime(editor, Settings.getDateFormat());
          });

          editor.addCommand('mceInsertTime', function () {
              Actions.insertDateTime(editor, Settings.getTimeFormat());
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
  'tinymce.plugins.insertdatetime.ui.Buttons',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.insertdatetime.api.Settings',
            'tinymce.plugins.insertdatetime.core.Actions'
        ],
  function (Tools, Settings, Actions) {
      var createMenuItems = function (editor, lastFormatState) {
          var formats = Settings.getFormats(editor);

          return Tools.map(formats, function (fmt) {
              return {
                  text: Actions.getDateTime(editor, fmt),
                  onclick: function () {
                      lastFormatState.set(fmt);
                      Actions.insertDateTime(editor, fmt);
                  }
              };
          });
      };

      var register = function (editor, lastFormatState) {
          var menuItems = createMenuItems(editor, lastFormatState);

          editor.addButton('insertdatetime', {
              type: 'splitbutton',
              title: 'Insert date/time',
              menu: menuItems,
              onclick: function () {
                  var lastFormat = lastFormatState.get();
                  Actions.insertDateTime(editor, lastFormat || Settings.getDefaultDateTime(editor));
              }
          });

          editor.addMenuItem('insertdatetime', {
              icon: 'date',
              text: 'Date/time',
              menu: menuItems,
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
  'tinymce.plugins.insertdatetime.Plugin',
        [
            'ephox.katamari.api.Cell',
            'tinymce.core.PluginManager',
            'tinymce.plugins.insertdatetime.api.Commands',
            'tinymce.plugins.insertdatetime.ui.Buttons'
        ],
  function (Cell, PluginManager, Commands, Buttons) {
      PluginManager.add('insertdatetime', function (editor) {
          var lastFormatState = Cell(null);

          Commands.register(editor);
          Buttons.register(editor, lastFormatState);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.insertdatetime.Plugin')();
})();
