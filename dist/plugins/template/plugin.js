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
["tinymce.plugins.template.Plugin","ephox.katamari.api.Fun","tinymce.core.dom.DOMUtils","tinymce.core.PluginManager","tinymce.core.util.JSON","tinymce.core.util.Tools","tinymce.core.util.XHR","tinymce.plugins.template.core.DateTimeHelper","tinymce.plugins.template.core.Templates","global!Array","global!Error","global!tinymce.util.Tools.resolve"]
jsc*/
defineGlobal("global!Array", Array);
defineGlobal("global!Error", Error);
define(
  'ephox.katamari.api.Fun',

  [
    'global!Array',
    'global!Error'
  ],

  function (Array, Error) {

    var noop = function () { };

    var compose = function (fa, fb) {
      return function () {
        return fa(fb.apply(null, arguments));
      };
    };

    var constant = function (value) {
      return function () {
        return value;
      };
    };

    var identity = function (x) {
      return x;
    };

    var tripleEquals = function(a, b) {
      return a === b;
    };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
    var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++) args[i-1] = arguments[i];

      return function () {
        var newArgs = new Array(arguments.length);
        for (var j = 0; j < newArgs.length; j++) newArgs[j] = arguments[j];

        var all = args.concat(newArgs);
        return f.apply(null, all);
      };
    };

    var not = function (f) {
      return function () {
        return !f.apply(null, arguments);
      };
    };

    var die = function (msg) {
      return function () {
        throw new Error(msg);
      };
    };

    var apply = function (f) {
      return f();
    };

    var call = function(f) {
      f();
    };

    var never = constant(false);
    var always = constant(true);
    

    return {
      noop: noop,
      compose: compose,
      constant: constant,
      identity: identity,
      tripleEquals: tripleEquals,
      curry: curry,
      not: not,
      die: die,
      apply: apply,
      call: call,
      never: never,
      always: always
    };
  }
);

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
  'tinymce.core.util.JSON',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.JSON');
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
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.XHR',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.XHR');
  }
);

define(
  'tinymce.plugins.template.core.DateTimeHelper',

  [

  ],

  function () {
    var addZeros = function (value, len) {
      value = "" + value;

      if (value.length < len) {
        for (var i = 0; i < (len - value.length); i++) {
          value = "0" + value;
        }
      }

      return value;
    };

    var getDateTime = function (editor, fmt, date) {
      var daysShort = "Sun Mon Tue Wed Thu Fri Sat Sun".split(' ');
      var daysLong = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(' ');
      var monthsShort = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ');
      var monthsLong = "January February March April May June July August September October November December".split(' ');

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
    };

    return {
      getDateTime: getDateTime
    };
  }
);

define(
  'tinymce.plugins.template.core.Templates',

  [
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.template.core.DateTimeHelper'
  ],

  function (Tools, XHR, DateTimeHelper) {
    var createTemplateList = function (editorSettings, callback) {
      return function () {
        var templateList = editorSettings.templates;

        if (typeof templateList == "function") {
          templateList(callback);
          return;
        }

        if (typeof templateList == "string") {
          XHR.send({
            url: templateList,
            success: function (text) {
              callback(JSON.parse(text));
            }
          });
        } else {
          callback(templateList);
        }
      };
    };

    var replaceTemplateValues = function (editor, html, templateValuesOptionName) {
      Tools.each(editor.getParam(templateValuesOptionName), function (v, k) {
        if (typeof v === 'function') {
          v = v(k);
        }

        html = html.replace(new RegExp('\\{\\$' + k + '\\}', 'g'), v);
      });

      return html;
    };

    var replaceVals = function (editor, e) {
      var dom = editor.dom, vl = editor.getParam('template_replace_values');

      Tools.each(dom.select('*', e), function (e) {
        Tools.each(vl, function (v, k) {
          if (dom.hasClass(e, k)) {
            if (typeof vl[k] == 'function') {
              vl[k](e);
            }
          }
        });
      });
    };

    var hasClass = function (n, c) {
      return new RegExp('\\b' + c + '\\b', 'g').test(n.className);
    };

    var insertTemplate = function (editor, ui, html) {
      var el, n, dom = editor.dom, sel = editor.selection.getContent();

      html = replaceTemplateValues(editor, html, 'template_replace_values');
      el = dom.create('div', null, html);

        // Find template element within div
      n = dom.select('.mceTmpl', el);
      if (n && n.length > 0) {
        el = dom.create('div', null);
        el.appendChild(n[0].cloneNode(true));
      }

      Tools.each(dom.select('*', el), function (n) {
          // Replace cdate
        if (hasClass(n, editor.getParam('template_cdate_classes', 'cdate').replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, editor.getParam("template_cdate_format", editor.getLang("template.cdate_format")));
        }

          // Replace mdate
        if (hasClass(n, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, editor.getParam("template_mdate_format", editor.getLang("template.mdate_format")));
        }

          // Replace selection
        if (hasClass(n, editor.getParam('template_selected_content_classes', 'selcontent').replace(/\s+/g, '|'))) {
          n.innerHTML = sel;
        }
      });

      replaceVals(editor, el);

      editor.execCommand('mceInsertContent', false, el.innerHTML);
      editor.addVisual();
    };

    return {
      createTemplateList: createTemplateList,
      replaceTemplateValues: replaceTemplateValues,
      replaceVals: replaceVals,
      insertTemplate: insertTemplate
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
 * This class contains all core logic for the code plugin.
 *
 * @class tinymce.template.Plugin
 * @private
 */
define(
  'tinymce.plugins.template.Plugin',
  [
    'ephox.katamari.api.Fun',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.PluginManager',
    'tinymce.core.util.JSON',
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.template.core.DateTimeHelper',
    'tinymce.plugins.template.core.Templates'
  ],
  function (Fun, DOMUtils, PluginManager, JSON, Tools, XHR, DateTimeHelper, Templates) {

    var insertIframeHtml = function (editor, win, html) {
      if (html.indexOf('<html>') == -1) {
        var contentCssLinks = '';

        Tools.each(editor.contentCSS, function (url) {
          contentCssLinks += '<link type="text/css" rel="stylesheet" href="' +
                  editor.documentBaseURI.toAbsolute(url) +
                  '">';
        });

        var bodyClass = editor.settings.body_class || '';
        if (bodyClass.indexOf('=') != -1) {
          bodyClass = editor.getParam('body_class', '', 'hash');
          bodyClass = bodyClass[editor.id] || '';
        }

        html = (
                '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                contentCssLinks +
                '</head>' +
                '<body class="' + bodyClass + '">' +
                html +
                '</body>' +
                '</html>'
              );
      }

      html = Templates.replaceTemplateValues(editor, html, 'template_preview_replace_values');

      var doc = win.find('iframe')[0].getEl().contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    };

    PluginManager.add('template', function (editor) {
      function showDialog(templateList) {
        var win, values = [], templateHtml;

        if (!templateList || templateList.length === 0) {
          var message = editor.translate('No templates defined.');
          editor.notificationManager.open({ text: message, type: 'info' });
          return;
        }

        Tools.each(templateList, function (template) {
          values.push({
            selected: !values.length,
            text: template.title,
            value: {
              url: template.url,
              content: template.content,
              description: template.description
            }
          });
        });

        var onSelectTemplate = function (e) {
          var value = e.control.value();

          if (value.url) {
            XHR.send({
              url: value.url,
              success: function (html) {
                templateHtml = html;
                insertIframeHtml(editor, win, templateHtml);
              }
            });
          } else {
            templateHtml = value.content;
            insertIframeHtml(editor, win, templateHtml);
          }

          win.find('#description')[0].text(e.control.value().description);
        };

        win = editor.windowManager.open({
          title: 'Insert template',
          layout: 'flex',
          direction: 'column',
          align: 'stretch',
          padding: 15,
          spacing: 10,
          items: [
            {
              type: 'form',
              flex: 0,
              padding: 0,
              items: [
                {
                  type: 'container',
                  label: 'Templates',
                  items: {
                    type: 'listbox',
                    label: 'Templates',
                    name: 'template',
                    values: values,
                    onselect: onSelectTemplate
                  }
                }
              ]
            },
            {
              type: 'label',
              name: 'description',
              label: 'Description',
              text: '\u00a0'
            },
            {
              type: 'iframe',
              flex: 1,
              border: 1
            }
          ],

          onsubmit: function () {
            Templates.insertTemplate(editor, false, templateHtml);
          },

          minWidth: Math.min(DOMUtils.DOM.getViewPort().w, editor.getParam('template_popup_width', 600)),
          minHeight: Math.min(DOMUtils.DOM.getViewPort().h, editor.getParam('template_popup_height', 500))
        });

        win.find('listbox')[0].fire('select');
      }

      editor.addCommand('mceInsertTemplate', Fun.curry(Templates.insertTemplate, editor));

      editor.addButton('template', {
        title: 'Insert template',
        onclick: Templates.createTemplateList(editor.settings, showDialog)
      });

      editor.addMenuItem('template', {
        text: 'Template',
        onclick: Templates.createTemplateList(editor.settings, showDialog),
        context: 'insert'
      });

      editor.on('PreProcess', function (o) {
        var dom = editor.dom;

        Tools.each(dom.select('div', o.node), function (e) {
          if (dom.hasClass(e, 'mceTmpl')) {
            Tools.each(dom.select('*', e), function (e) {
              if (dom.hasClass(e, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
                e.innerHTML = DateTimeHelper.getDateTime(editor, editor.getParam("template_mdate_format", editor.getLang("template.mdate_format")));
              }
            });

            Templates.replaceVals(editor, e);
          }
        });
      });
    });


    return function () { };
  }
);
dem('tinymce.plugins.template.Plugin')();
})();
