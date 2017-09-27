/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualblocks.api.Events',
  [
  ],
  function () {
    var fireVisualBlocks = function (editor, state) {
      editor.fire('VisualBlocks', { state: state });
    };

    return {
      fireVisualBlocks: fireVisualBlocks
    };
  }
);