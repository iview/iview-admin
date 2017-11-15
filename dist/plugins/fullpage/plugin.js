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
["tinymce.plugins.fullpage.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.fullpage.api.Commands","tinymce.plugins.fullpage.core.FilterContent","tinymce.plugins.fullpage.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.fullpage.ui.Dialog","tinymce.core.util.Tools","tinymce.plugins.fullpage.api.Settings","tinymce.plugins.fullpage.core.Parser","tinymce.plugins.fullpage.core.Protect","tinymce.core.html.DomParser","tinymce.core.html.Node","tinymce.core.html.Serializer"]
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
  'tinymce.core.html.DomParser',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.html.DomParser');
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
  'tinymce.core.html.Node',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.html.Node');
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
  'tinymce.core.html.Serializer',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.html.Serializer');
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
 * Protect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.fullpage.core.Parser',
        [
            'tinymce.core.html.DomParser',
            'tinymce.core.html.Node',
            'tinymce.core.html.Serializer',
            'tinymce.core.util.Tools',
            'tinymce.plugins.fullpage.api.Settings'
        ],
  function (DomParser, Node, Serializer, Tools, Settings) {
      var parseHeader = function (head) {
      // Parse the contents with a DOM parser
          return new DomParser({
              validate: false,
              root_name: '#document'
          }).parse(head);
      };

      var htmlToData = function (editor, head) {
          var headerFragment = parseHeader(head), data = {}, elm, matches;

          function getAttr (elm, name) {
              var value = elm.attr(name);

              return value || '';
          }

      // Default some values
      // TODO: Not sure these are used anymore
          data.fontface = Settings.getDefaultFontFamily(editor);
          data.fontsize = Settings.getDefaultFontSize(editor);

      // Parse XML PI
          elm = headerFragment.firstChild;
          if (elm.type === 7) {
              data.xml_pi = true;
              matches = /encoding="([^"]+)"/.exec(elm.value);
              if (matches) {
                  data.docencoding = matches[1];
              }
          }

      // Parse doctype
          elm = headerFragment.getAll('#doctype')[0];
          if (elm) {
              data.doctype = '<!DOCTYPE' + elm.value + '>';
          }

      // Parse title element
          elm = headerFragment.getAll('title')[0];
          if (elm && elm.firstChild) {
              data.title = elm.firstChild.value;
          }

      // Parse meta elements
          Tools.each(headerFragment.getAll('meta'), function (meta) {
              var name = meta.attr('name'), httpEquiv = meta.attr('http-equiv'), matches;

              if (name) {
                  data[name.toLowerCase()] = meta.attr('content');
              } else if (httpEquiv === 'Content-Type') {
                  matches = /charset\s*=\s*(.*)\s*/gi.exec(meta.attr('content'));

                  if (matches) {
                      data.docencoding = matches[1];
                  }
              }
          });

      // Parse html attribs
          elm = headerFragment.getAll('html')[0];
          if (elm) {
              data.langcode = getAttr(elm, 'lang') || getAttr(elm, 'xml:lang');
          }

      // Parse stylesheets
          data.stylesheets = [];
          Tools.each(headerFragment.getAll('link'), function (link) {
              if (link.attr('rel') === 'stylesheet') {
                  data.stylesheets.push(link.attr('href'));
              }
          });

      // Parse body parts
          elm = headerFragment.getAll('body')[0];
          if (elm) {
              data.langdir = getAttr(elm, 'dir');
              data.style = getAttr(elm, 'style');
              data.visited_color = getAttr(elm, 'vlink');
              data.link_color = getAttr(elm, 'link');
              data.active_color = getAttr(elm, 'alink');
          }

          return data;
      };

      var dataToHtml = function (editor, data, head) {
          var headerFragment, headElement, html, elm, value, dom = editor.dom;

          function setAttr (elm, name, value) {
              elm.attr(name, value || undefined);
          }

          function addHeadNode (node) {
              if (headElement.firstChild) {
                  headElement.insert(node, headElement.firstChild);
              } else {
                  headElement.append(node);
              }
          }

          headerFragment = parseHeader(head);
          headElement = headerFragment.getAll('head')[0];
          if (!headElement) {
              elm = headerFragment.getAll('html')[0];
              headElement = new Node('head', 1);

              if (elm.firstChild) {
                  elm.insert(headElement, elm.firstChild, true);
              } else {
                  elm.append(headElement);
              }
          }

      // Add/update/remove XML-PI
          elm = headerFragment.firstChild;
          if (data.xml_pi) {
              value = 'version="1.0"';

              if (data.docencoding) {
                  value += ' encoding="' + data.docencoding + '"';
              }

              if (elm.type !== 7) {
                  elm = new Node('xml', 7);
                  headerFragment.insert(elm, headerFragment.firstChild, true);
              }

              elm.value = value;
          } else if (elm && elm.type === 7) {
              elm.remove();
          }

      // Add/update/remove doctype
          elm = headerFragment.getAll('#doctype')[0];
          if (data.doctype) {
              if (!elm) {
                  elm = new Node('#doctype', 10);

                  if (data.xml_pi) {
                      headerFragment.insert(elm, headerFragment.firstChild);
                  } else {
                      addHeadNode(elm);
                  }
              }

              elm.value = data.doctype.substring(9, data.doctype.length - 1);
          } else if (elm) {
              elm.remove();
          }

      // Add meta encoding
          elm = null;
          Tools.each(headerFragment.getAll('meta'), function (meta) {
              if (meta.attr('http-equiv') === 'Content-Type') {
                  elm = meta;
              }
          });

          if (data.docencoding) {
              if (!elm) {
                  elm = new Node('meta', 1);
                  elm.attr('http-equiv', 'Content-Type');
                  elm.shortEnded = true;
                  addHeadNode(elm);
              }

              elm.attr('content', 'text/html; charset=' + data.docencoding);
          } else if (elm) {
              elm.remove();
          }

      // Add/update/remove title
          elm = headerFragment.getAll('title')[0];
          if (data.title) {
              if (!elm) {
                  elm = new Node('title', 1);
                  addHeadNode(elm);
              } else {
                  elm.empty();
              }

              elm.append(new Node('#text', 3)).value = data.title;
          } else if (elm) {
              elm.remove();
          }

      // Add/update/remove meta
          Tools.each('keywords,description,author,copyright,robots'.split(','), function (name) {
              var nodes = headerFragment.getAll('meta'), i, meta, value = data[name];

              for (i = 0; i < nodes.length; i++) {
                  meta = nodes[i];

                  if (meta.attr('name') === name) {
                      if (value) {
                          meta.attr('content', value);
                      } else {
                          meta.remove();
                      }

                      return;
                  }
              }

              if (value) {
                  elm = new Node('meta', 1);
                  elm.attr('name', name);
                  elm.attr('content', value);
                  elm.shortEnded = true;

                  addHeadNode(elm);
              }
          });

          var currentStyleSheetsMap = {};
          Tools.each(headerFragment.getAll('link'), function (stylesheet) {
              if (stylesheet.attr('rel') === 'stylesheet') {
                  currentStyleSheetsMap[stylesheet.attr('href')] = stylesheet;
              }
          });

      // Add new
          Tools.each(data.stylesheets, function (stylesheet) {
              if (!currentStyleSheetsMap[stylesheet]) {
                  elm = new Node('link', 1);
                  elm.attr({
                      rel: 'stylesheet',
                      text: 'text/css',
                      href: stylesheet
                  });
                  elm.shortEnded = true;
                  addHeadNode(elm);
              }

              delete currentStyleSheetsMap[stylesheet];
          });

      // Delete old
          Tools.each(currentStyleSheetsMap, function (stylesheet) {
              stylesheet.remove();
          });

      // Update body attributes
          elm = headerFragment.getAll('body')[0];
          if (elm) {
              setAttr(elm, 'dir', data.langdir);
              setAttr(elm, 'style', data.style);
              setAttr(elm, 'vlink', data.visited_color);
              setAttr(elm, 'link', data.link_color);
              setAttr(elm, 'alink', data.active_color);

        // Update iframe body as well
              dom.setAttribs(editor.getBody(), {
                  style: data.style,
                  dir: data.dir,
                  vLink: data.visited_color,
                  link: data.link_color,
                  aLink: data.active_color
              });
          }

      // Set html attributes
          elm = headerFragment.getAll('html')[0];
          if (elm) {
              setAttr(elm, 'lang', data.langcode);
              setAttr(elm, 'xml:lang', data.langcode);
          }

      // No need for a head element
          if (!headElement.firstChild) {
              headElement.remove();
          }

      // Serialize header fragment and crop away body part
          html = new Serializer({
              validate: false,
              indent: true,
              apply_source_formatting: true,
              indent_before: 'head,html,body,meta,title,script,link,style',
              indent_after: 'head,html,body,meta,title,script,link,style'
          }).serialize(headerFragment);

          return html.substring(0, html.indexOf('</body>'));
      };

      return {
          parseHeader: parseHeader,
          htmlToData: htmlToData,
          dataToHtml: dataToHtml
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
  'tinymce.plugins.fullpage.ui.Dialog',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.fullpage.core.Parser'
        ],
  function (Tools, Parser) {
      var open = function (editor, headState) {
          var data = Parser.htmlToData(editor, headState.get());

          editor.windowManager.open({
              title: 'Document properties',
              data: data,
              defaults: { type: 'textbox', size: 40 },
              body: [
          { name: 'title', label: 'Title' },
          { name: 'keywords', label: 'Keywords' },
          { name: 'description', label: 'Description' },
          { name: 'robots', label: 'Robots' },
          { name: 'author', label: 'Author' },
          { name: 'docencoding', label: 'Encoding' }
              ],
              onSubmit: function (e) {
                  var headHtml = Parser.dataToHtml(editor, Tools.extend(data, e.data), headState.get());
                  headState.set(headHtml);
              }
          });
      };

      return {
          open: open
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
  'tinymce.plugins.fullpage.api.Commands',
        [
            'tinymce.plugins.fullpage.ui.Dialog'
        ],
  function (Dialog) {
      var register = function (editor, headState) {
          editor.addCommand('mceFullPageProperties', function () {
              Dialog.open(editor, headState);
          });
      };

      return {
          register: register
      };
  }
);
/**
 * Protect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.fullpage.core.Protect',
        [
            'tinymce.core.util.Tools'
        ],
  function (Tools) {
      var protectHtml = function (protect, html) {
          Tools.each(protect, function (pattern) {
              html = html.replace(pattern, function (str) {
                  return '<!--mce:protected ' + escape(str) + '-->';
              });
          });

          return html;
      };

      var unprotectHtml = function (html) {
          return html.replace(/<!--mce:protected ([\s\S]*?)-->/g, function (a, m) {
              return unescape(m);
          });
      };

      return {
          protectHtml: protectHtml,
          unprotectHtml: unprotectHtml
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
  'tinymce.plugins.fullpage.core.FilterContent',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.fullpage.api.Settings',
            'tinymce.plugins.fullpage.core.Parser',
            'tinymce.plugins.fullpage.core.Protect'
        ],
  function (Tools, Settings, Parser, Protect) {
      var each = Tools.each;

      var low = function (s) {
          return s.replace(/<\/?[A-Z]+/g, function (a) {
              return a.toLowerCase();
          });
      };

      var handleSetContent = function (editor, headState, footState, evt) {
          var startPos, endPos, content, headerFragment, styles = '', dom = editor.dom, elm;

          if (evt.selection) {
              return;
          }

          content = Protect.protectHtml(editor.settings.protect, evt.content);

      // Ignore raw updated if we already have a head, this will fix issues with undo/redo keeping the head/foot separate
          if (evt.format === 'raw' && headState.get()) {
              return;
          }

          if (evt.source_view && Settings.shouldHideInSourceView(editor)) {
              return;
          }

      // Fixed so new document/setContent('') doesn't remove existing header/footer except when it's in source code view
          if (content.length === 0 && !evt.source_view) {
              content = Tools.trim(headState.get()) + '\n' + Tools.trim(content) + '\n' + Tools.trim(footState.get());
          }

      // Parse out head, body and footer
          content = content.replace(/<(\/?)BODY/gi, '<$1body');
          startPos = content.indexOf('<body');

          if (startPos !== -1) {
              startPos = content.indexOf('>', startPos);
              headState.set(low(content.substring(0, startPos + 1)));

              endPos = content.indexOf('</body', startPos);
              if (endPos === -1) {
                  endPos = content.length;
              }

              evt.content = Tools.trim(content.substring(startPos + 1, endPos));
              footState.set(low(content.substring(endPos)));
          } else {
              headState.set(getDefaultHeader(editor));
              footState.set('\n</body>\n</html>');
          }

      // Parse header and update iframe
          headerFragment = Parser.parseHeader(headState.get());
          each(headerFragment.getAll('style'), function (node) {
              if (node.firstChild) {
                  styles += node.firstChild.value;
              }
          });

          elm = headerFragment.getAll('body')[0];
          if (elm) {
              dom.setAttribs(editor.getBody(), {
                  style: elm.attr('style') || '',
                  dir: elm.attr('dir') || '',
                  vLink: elm.attr('vlink') || '',
                  link: elm.attr('link') || '',
                  aLink: elm.attr('alink') || ''
              });
          }

          dom.remove('fullpage_styles');

          var headElm = editor.getDoc().getElementsByTagName('head')[0];

          if (styles) {
              dom.add(headElm, 'style', {
                  id: 'fullpage_styles'
              }, styles);

        // Needed for IE 6/7
              elm = dom.get('fullpage_styles');
              if (elm.styleSheet) {
                  elm.styleSheet.cssText = styles;
              }
          }

          var currentStyleSheetsMap = {};
          Tools.each(headElm.getElementsByTagName('link'), function (stylesheet) {
              if (stylesheet.rel === 'stylesheet' && stylesheet.getAttribute('data-mce-fullpage')) {
                  currentStyleSheetsMap[stylesheet.href] = stylesheet;
              }
          });

      // Add new
          Tools.each(headerFragment.getAll('link'), function (stylesheet) {
              var href = stylesheet.attr('href');
              if (!href) {
                  return true;
              }

              if (!currentStyleSheetsMap[href] && stylesheet.attr('rel') === 'stylesheet') {
                  dom.add(headElm, 'link', {
                      rel: 'stylesheet',
                      text: 'text/css',
                      href: href,
                      'data-mce-fullpage': '1'
                  });
              }

              delete currentStyleSheetsMap[href];
          });

      // Delete old
          Tools.each(currentStyleSheetsMap, function (stylesheet) {
              stylesheet.parentNode.removeChild(stylesheet);
          });
      };

      var getDefaultHeader = function (editor) {
          var header = '', value, styles = '';

          if (Settings.getDefaultXmlPi(editor)) {
              var piEncoding = Settings.getDefaultEncoding(editor);
              header += '<?xml version="1.0" encoding="' + (piEncoding || 'ISO-8859-1') + '" ?>\n';
          }

          header += Settings.getDefaultDocType(editor);
          header += '\n<html>\n<head>\n';

          if ((value = Settings.getDefaultTitle(editor))) {
              header += '<title>' + value + '</title>\n';
          }

          if ((value = Settings.getDefaultEncoding(editor))) {
              header += '<meta http-equiv="Content-Type" content="text/html; charset=' + value + '" />\n';
          }

          if ((value = Settings.getDefaultFontFamily(editor))) {
              styles += 'font-family: ' + value + ';';
          }

          if ((value = Settings.getDefaultFontSize(editor))) {
              styles += 'font-size: ' + value + ';';
          }

          if ((value = Settings.getDefaultTextColor(editor))) {
              styles += 'color: ' + value + ';';
          }

          header += '</head>\n<body' + (styles ? ' style="' + styles + '"' : '') + '>\n';

          return header;
      };

      var handleGetContent = function (editor, head, foot, evt) {
          if (!evt.selection && (!evt.source_view || !Settings.shouldHideInSourceView(editor))) {
              evt.content = Protect.unprotectHtml(Tools.trim(head) + '\n' + Tools.trim(evt.content) + '\n' + Tools.trim(foot));
          }
      };

      var setup = function (editor, headState, footState) {
          editor.on('BeforeSetContent', function (evt) {
              handleSetContent(editor, headState, footState, evt);
          });
          editor.on('GetContent', function (evt) {
              handleGetContent(editor, headState.get(), footState.get(), evt);
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
  'tinymce.plugins.fullpage.ui.Buttons',
        [
        ],
  function () {
      var register = function (editor) {
          editor.addButton('fullpage', {
              title: 'Document properties',
              cmd: 'mceFullPageProperties'
          });

          editor.addMenuItem('fullpage', {
              text: 'Document properties',
              cmd: 'mceFullPageProperties',
              context: 'file'
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
  'tinymce.plugins.fullpage.Plugin',
        [
            'ephox.katamari.api.Cell',
            'tinymce.core.PluginManager',
            'tinymce.plugins.fullpage.api.Commands',
            'tinymce.plugins.fullpage.core.FilterContent',
            'tinymce.plugins.fullpage.ui.Buttons'
        ],
  function (Cell, PluginManager, Commands, FilterContent, Buttons) {
      PluginManager.add('fullpage', function (editor) {
          var headState = Cell(''), footState = Cell('');

          Commands.register(editor, headState);
          Buttons.register(editor);
          FilterContent.setup(editor, headState, footState);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.fullpage.Plugin')();
})();
