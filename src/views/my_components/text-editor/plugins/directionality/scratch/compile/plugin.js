/*jsc
["tinymce.plugins.directionality.Plugin","tinymce.core.PluginManager","tinymce.plugins.directionality.api.Commands","tinymce.plugins.directionality.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.directionality.core.Direction","tinymce.core.util.Tools"]
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
 * Direction.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.directionality.core.Direction',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var setDir = function (editor, dir) {
      var dom = editor.dom, curDir, blocks = editor.selection.getSelectedBlocks();

      if (blocks.length) {
        curDir = dom.getAttrib(blocks[0], 'dir');

        Tools.each(blocks, function (block) {
          // Add dir to block if the parent block doesn't already have that dir
          if (!dom.getParent(block.parentNode, '*[dir="' + dir + '"]', dom.getRoot())) {
            dom.setAttrib(block, 'dir', curDir !== dir ? dir : null);
          }
        });

        editor.nodeChanged();
      }
    };

    return {
      setDir: setDir
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
  'tinymce.plugins.directionality.api.Commands',
  [
    'tinymce.plugins.directionality.core.Direction'
  ],
  function (Direction) {
    var register = function (editor) {
      editor.addCommand('mceDirectionLTR', function () {
        Direction.setDir(editor, 'ltr');
      });

      editor.addCommand('mceDirectionRTL', function () {
        Direction.setDir(editor, 'rtl');
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
  'tinymce.plugins.directionality.ui.Buttons',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var generateSelector = function (dir) {
      var selector = [];

      Tools.each('h1 h2 h3 h4 h5 h6 div p'.split(' '), function (name) {
        selector.push(name + '[dir=' + dir + ']');
      });

      return selector.join(',');
    };

    var register = function (editor) {
      editor.addButton('ltr', {
        title: 'Left to right',
        cmd: 'mceDirectionLTR',
        stateSelector: generateSelector('ltr')
      });

      editor.addButton('rtl', {
        title: 'Right to left',
        cmd: 'mceDirectionRTL',
        stateSelector: generateSelector('rtl')
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
  'tinymce.plugins.directionality.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.directionality.api.Commands',
    'tinymce.plugins.directionality.ui.Buttons'
  ],
  function (PluginManager, Commands, Buttons) {
    PluginManager.add('directionality', function (editor) {
      Commands.register(editor);
      Buttons.register(editor);
    });

    return function () { };
  }
);