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
  'tinymce.plugins.pagebreak.core.FilterContent',
  [
    'tinymce.core.Env',
    'tinymce.plugins.pagebreak.api.Settings'
  ],
  function (Env, Settings) {
    var getPageBreakClass = function () {
      return 'mce-pagebreak';
    };

    var getPlaceholderHtml = function () {
      return '<img src="' + Env.transparentSrc + '" class="' + getPageBreakClass() + '" data-mce-resize="false" data-mce-placeholder />';
    };

    var setup = function (editor) {
      var separatorHtml = Settings.getSeparatorHtml(editor);

      var pageBreakSeparatorRegExp = new RegExp(separatorHtml.replace(/[\?\.\*\[\]\(\)\{\}\+\^\$\:]/g, function (a) {
        return '\\' + a;
      }), 'gi');

      editor.on('BeforeSetContent', function (e) {
        e.content = e.content.replace(pageBreakSeparatorRegExp, getPlaceholderHtml());
      });

      editor.on('PreInit', function () {
        editor.serializer.addNodeFilter('img', function (nodes) {
          var i = nodes.length, node, className;

          while (i--) {
            node = nodes[i];
            className = node.attr('class');
            if (className && className.indexOf('mce-pagebreak') !== -1) {
              // Replace parent block node if pagebreak_split_block is enabled
              var parentNode = node.parent;
              if (editor.schema.getBlockElements()[parentNode.name] && Settings.shouldSplitBlock(editor)) {
                parentNode.type = 3;
                parentNode.value = separatorHtml;
                parentNode.raw = true;
                node.remove();
                continue;
              }

              node.type = 3;
              node.value = separatorHtml;
              node.raw = true;
            }
          }
        });
      });
    };

    return {
      setup: setup,
      getPlaceholderHtml: getPlaceholderHtml,
      getPageBreakClass: getPageBreakClass
    };
  }
);