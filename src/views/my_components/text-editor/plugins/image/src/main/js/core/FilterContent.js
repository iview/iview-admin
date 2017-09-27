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
  'tinymce.plugins.image.core.FilterContent',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var hasImageClass = function (node) {
      var className = node.attr('class');
      return className && /\bimage\b/.test(className);
    };

    var toggleContentEditableState = function (state) {
      return function (nodes) {
        var i = nodes.length, node;

        var toggleContentEditable = function (node) {
          node.attr('contenteditable', state ? 'true' : null);
        };

        while (i--) {
          node = nodes[i];

          if (hasImageClass(node)) {
            node.attr('contenteditable', state ? 'false' : null);
            Tools.each(node.getAll('figcaption'), toggleContentEditable);
            Tools.each(node.getAll('img'), toggleContentEditable);
          }
        }
      };
    };

    var setup = function (editor) {
      editor.on('preInit', function () {
        editor.parser.addNodeFilter('figure', toggleContentEditableState(true));
        editor.serializer.addNodeFilter('figure', toggleContentEditableState(false));
      });
    };

    return {
      setup: setup
    };
  }
);