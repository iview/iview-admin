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
  'tinymce.plugins.noneditable.core.FilterContent',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.noneditable.api.Settings'
  ],
  function (Tools, Settings) {
    var hasClass = function (checkClassName) {
      return function (node) {
        return (' ' + node.attr('class') + ' ').indexOf(checkClassName) !== -1;
      };
    };

    var replaceMatchWithSpan = function (editor, content, cls) {
      return function (match) {
        var args = arguments, index = args[args.length - 2];
        var prevChar = index > 0 ? content.charAt(index - 1) : '';

        // Is value inside an attribute then don't replace
        if (prevChar === '"') {
          return match;
        }

        // Is value inside a contentEditable='false' tag
        if (prevChar === '>') {
          var findStartTagIndex = content.lastIndexOf('<', index);
          if (findStartTagIndex !== -1) {
            var tagHtml = content.substring(findStartTagIndex, index);
            if (tagHtml.indexOf('contenteditable="false"') !== -1) {
              return match;
            }
          }
        }

        return (
          '<span class="' + cls + '" data-mce-content="' + editor.dom.encode(args[0]) + '">' +
          editor.dom.encode(typeof args[1] === 'string' ? args[1] : args[0]) + '</span>'
        );
      };
    };

    var convertRegExpsToNonEditable = function (editor, nonEditableRegExps, e) {
      var i = nonEditableRegExps.length, content = e.content;

      // Don't replace the variables when raw is used for example on undo/redo
      if (e.format === 'raw') {
        return;
      }

      while (i--) {
        content = content.replace(nonEditableRegExps[i], replaceMatchWithSpan(editor, content, Settings.getNonEditableClass(editor)));
      }

      e.content = content;
    };

    var setup = function (editor) {
      var editClass, nonEditClass, contentEditableAttrName = 'contenteditable';

      editClass = ' ' + Tools.trim(Settings.getEditableClass(editor)) + ' ';
      nonEditClass = ' ' + Tools.trim(Settings.getNonEditableClass(editor)) + ' ';

      var hasEditClass = hasClass(editClass);
      var hasNonEditClass = hasClass(nonEditClass);
      var nonEditableRegExps = Settings.getNonEditableRegExps(editor);

      editor.on('PreInit', function () {
        if (nonEditableRegExps.length > 0) {
          editor.on('BeforeSetContent', function (e) {
            convertRegExpsToNonEditable(editor, nonEditableRegExps, e);
          });
        }

        editor.parser.addAttributeFilter('class', function (nodes) {
          var i = nodes.length, node;

          while (i--) {
            node = nodes[i];

            if (hasEditClass(node)) {
              node.attr(contentEditableAttrName, 'true');
            } else if (hasNonEditClass(node)) {
              node.attr(contentEditableAttrName, 'false');
            }
          }
        });

        editor.serializer.addAttributeFilter(contentEditableAttrName, function (nodes) {
          var i = nodes.length, node;

          while (i--) {
            node = nodes[i];
            if (!hasEditClass(node) && !hasNonEditClass(node)) {
              continue;
            }

            if (nonEditableRegExps.length > 0 && node.attr('data-mce-content')) {
              node.name = '#text';
              node.type = 3;
              node.raw = true;
              node.value = node.attr('data-mce-content');
            } else {
              node.attr(contentEditableAttrName, null);
            }
          }
        });
      });
    };

    return {
      setup: setup
    };
  }
);