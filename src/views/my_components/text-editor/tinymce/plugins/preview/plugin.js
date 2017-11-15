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
["tinymce.plugins.preview.Plugin","tinymce.core.PluginManager","tinymce.plugins.preview.api.Commands","tinymce.plugins.preview.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.preview.ui.Dialog","tinymce.core.Env","tinymce.core.util.Tools","tinymce.plugins.preview.api.Settings","tinymce.plugins.preview.ui.IframeContent"]
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
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.preview.api.Settings',
  [
  ],
  function () {
    var getPreviewDialogWidth = function (editor) {
      return parseInt(editor.getParam('plugin_preview_width', '650'), 10);
    };

    var getPreviewDialogHeight = function (editor) {
      return parseInt(editor.getParam('plugin_preview_height', '500'), 10);
    };

    return {
      getPreviewDialogWidth: getPreviewDialogWidth,
      getPreviewDialogHeight: getPreviewDialogHeight
    };
  }
);
/**
 * IframeContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.preview.ui.IframeContent',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var injectIframeContent = function (editor, iframe, sandbox) {
      var previewHtml, headHtml = '', encode = editor.dom.encode;

      headHtml += '<base href="' + encode(editor.documentBaseURI.getURI()) + '">';

      Tools.each(editor.contentCSS, function (url) {
        headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '">';
      });

      var bodyId = editor.settings.body_id || 'tinymce';
      if (bodyId.indexOf('=') !== -1) {
        bodyId = editor.getParam('body_id', '', 'hash');
        bodyId = bodyId[editor.id] || bodyId;
      }

      var bodyClass = editor.settings.body_class || '';
      if (bodyClass.indexOf('=') !== -1) {
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
        var doc = iframe.contentWindow.document;
        doc.open();
        doc.write(previewHtml);
        doc.close();
      } else {
        iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
      }
    };

    return {
      injectIframeContent: injectIframeContent
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
  'tinymce.plugins.preview.ui.Dialog',
  [
    'tinymce.core.Env',
    'tinymce.core.util.Tools',
    'tinymce.plugins.preview.api.Settings',
    'tinymce.plugins.preview.ui.IframeContent'
  ],
  function (Env, Tools, Settings, IframeContent) {
    var open = function (editor) {
      var sandbox = !Env.ie;
      var dialogHtml = '<iframe src="javascript:\'\'" frameborder="0"' + (sandbox ? ' sandbox="allow-scripts"' : '') + '></iframe>';
      var dialogWidth = Settings.getPreviewDialogWidth(editor);
      var dialogHeight = Settings.getPreviewDialogHeight(editor);

      editor.windowManager.open({
        title: 'Preview',
        width: dialogWidth,
        height: dialogHeight,
        html: dialogHtml,
        buttons: {
          text: 'Close',
          onclick: function (e) {
            e.control.parent().parent().close();
          }
        },
        onPostRender: function (e) {
          var iframeElm = e.control.getEl('body').firstChild;
          IframeContent.injectIframeContent(editor, iframeElm, sandbox);
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
  'tinymce.plugins.preview.api.Commands',
  [
    'tinymce.plugins.preview.ui.Dialog'
  ],
  function (Dialog) {
    var register = function (editor) {
      editor.addCommand('mcePreview', function () {
        Dialog.open(editor);
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
  'tinymce.plugins.preview.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('preview', {
        title: 'Preview',
        cmd: 'mcePreview'
      });

      editor.addMenuItem('preview', {
        text: 'Preview',
        cmd: 'mcePreview',
        context: 'view'
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
  'tinymce.plugins.preview.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.preview.api.Commands',
    'tinymce.plugins.preview.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('preview', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);
dem('tinymce.plugins.preview.Plugin')();
})();
