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
["tinymce.plugins.preview.Plugin","tinymce.core.PluginManager","tinymce.core.Env","tinymce.core.util.Tools","global!tinymce.util.Tools.resolve"]
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
 * This class contains all core logic for the preview plugin.
 *
 * @class tinymce.preview.Plugin
 * @private
 */
define(
  'tinymce.plugins.preview.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.core.Env',
    'tinymce.core.util.Tools'
  ],
  function (PluginManager, Env, Tools) {
    PluginManager.add('preview', function (editor) {
      var settings = editor.settings, sandbox = !Env.ie;

      editor.addCommand('mcePreview', function () {
        editor.windowManager.open({
          title: 'Preview',
          width: parseInt(editor.getParam("plugin_preview_width", "650"), 10),
          height: parseInt(editor.getParam("plugin_preview_height", "500"), 10),
          html: '<iframe src="javascript:\'\'" frameborder="0"' + (sandbox ? ' sandbox="allow-scripts"' : '') + '></iframe>',
          buttons: {
            text: 'Close',
            onclick: function () {
              this.parent().parent().close();
            }
          },
          onPostRender: function () {
            var previewHtml, headHtml = '', encode = editor.dom.encode;

            headHtml += '<base href="' + encode(editor.documentBaseURI.getURI()) + '">';

            Tools.each(editor.contentCSS, function (url) {
              headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '">';
            });

            var bodyId = settings.body_id || 'tinymce';
            if (bodyId.indexOf('=') != -1) {
              bodyId = editor.getParam('body_id', '', 'hash');
              bodyId = bodyId[editor.id] || bodyId;
            }

            var bodyClass = settings.body_class || '';
            if (bodyClass.indexOf('=') != -1) {
              bodyClass = editor.getParam('body_class', '', 'hash');
              bodyClass = bodyClass[editor.id] || '';
            }

            var preventClicksOnLinksScript = (
              '<script>' +
              'document.addEventListener && document.addEventListener("click", function(e) {' +
              'for (var elm = e.target; elm; elm = elm.parentNode) {' +
              'if (elm.nodeName === "A") {' +
              'e.preventDefault();' +
              '}' +
              '}' +
              '}, false);' +
              '</script> '
            );

            var dirAttr = editor.settings.directionality ? ' dir="' + editor.settings.directionality + '"' : '';

            previewHtml = (
              '<!DOCTYPE html>' +
              '<html>' +
              '<head>' +
              headHtml +
              '</head>' +
              '<body id="' + encode(bodyId) + '" class="mce-content-body ' + encode(bodyClass) + '"' + encode(dirAttr) + '>' +
              editor.getContent() +
              preventClicksOnLinksScript +
              '</body>' +
              '</html>'
            );

            if (!sandbox) {
              // IE 6-11 doesn't support data uris on iframes
              // so I guess they will have to be less secure since we can't sandbox on those
              // TODO: Use sandbox if future versions of IE supports iframes with data: uris.
              var doc = this.getEl('body').firstChild.contentWindow.document;
              doc.open();
              doc.write(previewHtml);
              doc.close();
            } else {
              this.getEl('body').firstChild.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
            }
          }
        });
      });

      editor.addButton('preview', {
        title: 'Preview',
        cmd: 'mcePreview'
      });

      editor.addMenuItem('preview', {
        text: 'Preview',
        cmd: 'mcePreview',
        context: 'view'
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.preview.Plugin')();
})();
