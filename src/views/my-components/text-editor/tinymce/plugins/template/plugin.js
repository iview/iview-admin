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
["tinymce.plugins.template.Plugin","tinymce.core.PluginManager","tinymce.plugins.template.api.Commands","tinymce.plugins.template.core.FilterContent","tinymce.plugins.template.ui.Buttons","global!tinymce.util.Tools.resolve","ephox.katamari.api.Fun","tinymce.plugins.template.core.Templates","tinymce.core.util.Tools","tinymce.plugins.template.api.Settings","tinymce.plugins.template.core.DateTimeHelper","tinymce.plugins.template.ui.Dialog","global!Array","global!Error","tinymce.core.util.XHR","tinymce.core.dom.DOMUtils"]
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

    defineGlobal('global!Array', Array);
    defineGlobal('global!Error', Error);
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

      var tripleEquals = function (a, b) {
          return a === b;
      };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
      var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
          var args = new Array(arguments.length - 1);
          for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];

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

      var call = function (f) {
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
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.template.api.Settings',
        [
            'tinymce.core.dom.DOMUtils'
        ],
  function (DOMUtils) {
      var getCreationDateClasses = function (editor) {
          return editor.getParam('template_cdate_classes', 'cdate');
      };

      var getModificationDateClasses = function (editor) {
          return editor.getParam('template_mdate_classes', 'mdate');
      };

      var getSelectedContentClasses = function (editor) {
          return editor.getParam('template_selected_content_classes', 'selcontent');
      };

      var getPreviewReplaceValues = function (editor) {
          return editor.getParam('template_preview_replace_values');
      };

      var getTemplateReplaceValues = function (editor) {
          return editor.getParam('template_replace_values');
      };

      var getTemplates = function (editorSettings) {
          return editorSettings.templates;
      };

      var getCdateFormat = function (editor) {
          return editor.getParam('template_cdate_format', editor.getLang('template.cdate_format'));
      };

      var getMdateFormat = function (editor) {
          return editor.getParam('template_mdate_format', editor.getLang('template.mdate_format'));
      };

      var getDialogWidth = function (editor) {
          return editor.getParam('template_popup_width', 600);
      };

      var getDialogHeight = function (editor) {
          return Math.min(DOMUtils.DOM.getViewPort().h, editor.getParam('template_popup_height', 500));
      };

      return {
          getCreationDateClasses: getCreationDateClasses,
          getModificationDateClasses: getModificationDateClasses,
          getSelectedContentClasses: getSelectedContentClasses,
          getPreviewReplaceValues: getPreviewReplaceValues,
          getTemplateReplaceValues: getTemplateReplaceValues,
          getTemplates: getTemplates,
          getCdateFormat: getCdateFormat,
          getMdateFormat: getMdateFormat,
          getDialogWidth: getDialogWidth,
          getDialogHeight: getDialogHeight
      };
  }
);

/**
 * DateTimeHelper.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.template.core.DateTimeHelper',
        [
        ],
  function () {
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
          var daysShort = 'Sun Mon Tue Wed Thu Fri Sat Sun'.split(' ');
          var daysLong = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
          var monthsShort = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
          var monthsLong = 'January February March April May June July August September October November December'.split(' ');

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

      return {
          getDateTime: getDateTime
      };
  }
);

/**
 * Templates.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.template.core.Templates',
        [
            'tinymce.core.util.Tools',
            'tinymce.core.util.XHR',
            'tinymce.plugins.template.api.Settings',
            'tinymce.plugins.template.core.DateTimeHelper'
        ],
  function (Tools, XHR, Settings, DateTimeHelper) {
      var createTemplateList = function (editorSettings, callback) {
          return function () {
              var templateList = Settings.getTemplates(editorSettings);

              if (typeof templateList === 'function') {
                  templateList(callback);
                  return;
              }

              if (typeof templateList === 'string') {
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

      var replaceTemplateValues = function (editor, html, templateValues) {
          Tools.each(templateValues, function (v, k) {
              if (typeof v === 'function') {
                  v = v(k);
              }

              html = html.replace(new RegExp('\\{\\$' + k + '\\}', 'g'), v);
          });

          return html;
      };

      var replaceVals = function (editor, e) {
          var dom = editor.dom, vl = Settings.getTemplateReplaceValues(editor);

          Tools.each(dom.select('*', e), function (e) {
              Tools.each(vl, function (v, k) {
                  if (dom.hasClass(e, k)) {
                      if (typeof vl[k] === 'function') {
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

          html = replaceTemplateValues(editor, html, Settings.getTemplateReplaceValues(editor));
          el = dom.create('div', null, html);

        // Find template element within div
          n = dom.select('.mceTmpl', el);
          if (n && n.length > 0) {
              el = dom.create('div', null);
              el.appendChild(n[0].cloneNode(true));
          }

          Tools.each(dom.select('*', el), function (n) {
        // Replace cdate
              if (hasClass(n, Settings.getCreationDateClasses(editor).replace(/\s+/g, '|'))) {
                  n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getCdateFormat(editor));
              }

        // Replace mdate
              if (hasClass(n, Settings.getModificationDateClasses(editor).replace(/\s+/g, '|'))) {
                  n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getMdateFormat(editor));
              }

        // Replace selection
              if (hasClass(n, Settings.getSelectedContentClasses(editor).replace(/\s+/g, '|'))) {
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
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.template.api.Commands',
        [
            'ephox.katamari.api.Fun',
            'tinymce.plugins.template.core.Templates'
        ],
  function (Fun, Templates) {
      var register = function (editor) {
          editor.addCommand('mceInsertTemplate', Fun.curry(Templates.insertTemplate, editor));
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
  'tinymce.plugins.template.core.FilterContent',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.template.api.Settings',
            'tinymce.plugins.template.core.DateTimeHelper',
            'tinymce.plugins.template.core.Templates'
        ],
  function (Tools, Settings, DateTimeHelper, Templates) {
      var setup = function (editor) {
          editor.on('PreProcess', function (o) {
              var dom = editor.dom, dateFormat = Settings.getMdateFormat(editor);

              Tools.each(dom.select('div', o.node), function (e) {
                  if (dom.hasClass(e, 'mceTmpl')) {
                      Tools.each(dom.select('*', e), function (e) {
                          if (dom.hasClass(e, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
                              e.innerHTML = DateTimeHelper.getDateTime(editor, dateFormat);
                          }
                      });

                      Templates.replaceVals(editor, e);
                  }
              });
          });
      };

      return {
          setup: setup
      };
  }
);
/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.template.ui.Dialog',
        [
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.util.Tools',
            'tinymce.core.util.XHR',
            'tinymce.plugins.template.api.Settings',
            'tinymce.plugins.template.core.Templates'
        ],
  function (DOMUtils, Tools, XHR, Settings, Templates) {
      var insertIframeHtml = function (editor, win, html) {
          if (html.indexOf('<html>') === -1) {
              var contentCssLinks = '';

              Tools.each(editor.contentCSS, function (url) {
                  contentCssLinks += '<link type="text/css" rel="stylesheet" href="' +
                  editor.documentBaseURI.toAbsolute(url) +
                  '">';
              });

              var bodyClass = editor.settings.body_class || '';
              if (bodyClass.indexOf('=') !== -1) {
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

          html = Templates.replaceTemplateValues(editor, html, Settings.getPreviewReplaceValues(editor));

          var doc = win.find('iframe')[0].getEl().contentWindow.document;
          doc.open();
          doc.write(html);
          doc.close();
      };

      var open = function (editor, templateList) {
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

              minWidth: Settings.getDialogWidth(editor),
              minHeight: Settings.getDialogHeight(editor)
          });

          win.find('listbox')[0].fire('select');
      };

      return {
          open: open
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
  'tinymce.plugins.template.ui.Buttons',
        [
            'tinymce.plugins.template.core.Templates',
            'tinymce.plugins.template.ui.Dialog'
        ],
  function (Templates, Dialog) {
      var showDialog = function (editor) {
          return function (templates) {
              Dialog.open(editor, templates);
          };
      };

      var register = function (editor) {
          editor.addButton('template', {
              title: 'Insert template',
              onclick: Templates.createTemplateList(editor.settings, showDialog(editor))
          });

          editor.addMenuItem('template', {
              text: 'Template',
              onclick: Templates.createTemplateList(editor.settings, showDialog(editor)),
              icon: 'template',
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
  'tinymce.plugins.template.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.template.api.Commands',
            'tinymce.plugins.template.core.FilterContent',
            'tinymce.plugins.template.ui.Buttons'
        ],
  function (PluginManager, Commands, FilterContent, Buttons) {
      PluginManager.add('template', function (editor) {
          Buttons.register(editor);
          Commands.register(editor);
          FilterContent.setup(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.template.Plugin')();
})();
