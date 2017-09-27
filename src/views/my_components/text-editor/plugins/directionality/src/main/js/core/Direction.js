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

