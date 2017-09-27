/**
 * Formatter.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.textpattern.core.Formatter',
  [
    'tinymce.core.dom.TreeWalker',
    'tinymce.core.util.Tools',
    'tinymce.plugins.textpattern.core.Patterns'
  ],
  function (TreeWalker, Tools, Patterns) {
    var splitContainer = function (container, pattern, offset, startOffset, delta) {

      // Split text node and remove start/end from text node
      container = startOffset > 0 ? container.splitText(startOffset) : container;
      container.splitText(offset - startOffset - delta);
      container.deleteData(0, pattern.start.length);
      container.deleteData(container.data.length - pattern.end.length, pattern.end.length);

      return container;
    };

    // Handles inline formats like *abc* and **abc**
    var applyInlineFormat = function (editor, patterns, space) {
      var selection, dom, rng, container, offset, startOffset, text, patternRng, pattern, delta, format;

      selection = editor.selection;
      dom = editor.dom;

      if (!selection.isCollapsed()) {
        return;
      }

      rng = selection.getRng(true);
      container = rng.startContainer;
      offset = rng.startOffset;
      text = container.data;
      delta = space === true ? 1 : 0;

      if (container.nodeType !== 3) {
        return;
      }

      // Find best matching end
      pattern = Patterns.findEndPattern(patterns, text, offset, delta);
      if (pattern === undefined) {
        return;
      }

      // Find start of matched pattern
      // TODO: Might need to improve this if there is nested formats
      startOffset = Math.max(0, offset - delta);
      startOffset = text.lastIndexOf(pattern.start, startOffset - pattern.end.length - 1);

      if (startOffset === -1) {
        return;
      }

      // Setup a range for the matching word
      patternRng = dom.createRng();
      patternRng.setStart(container, startOffset);
      patternRng.setEnd(container, offset - delta);
      pattern = Patterns.findPattern(patterns, patternRng.toString());

      if (!pattern || !pattern.end) {
        return;
      }

      // If container match doesn't have anything between start/end then do nothing
      if (container.data.length <= pattern.start.length + pattern.end.length) {
        return;
      }

      format = editor.formatter.get(pattern.format);
      if (format && format[0].inline) {
        editor.undoManager.transact(function () {
          container = splitContainer(container, pattern, offset, startOffset, delta);
          editor.formatter.apply(pattern.format, {}, container);
        });

        return container;
      }
    };

    // Handles block formats like ##abc or 1. abc
    var applyBlockFormat = function (editor, patterns) {
      var selection, dom, container, firstTextNode, node, format, textBlockElm, pattern, walker, rng, offset;

      selection = editor.selection;
      dom = editor.dom;

      if (!selection.isCollapsed()) {
        return;
      }

      textBlockElm = dom.getParent(selection.getStart(), 'p');
      if (textBlockElm) {
        walker = new TreeWalker(textBlockElm, textBlockElm);
        while ((node = walker.next())) {
          if (node.nodeType === 3) {
            firstTextNode = node;
            break;
          }
        }

        if (firstTextNode) {
          pattern = Patterns.findPattern(patterns, firstTextNode.data);
          if (!pattern) {
            return;
          }

          rng = selection.getRng(true);
          container = rng.startContainer;
          offset = rng.startOffset;

          if (firstTextNode === container) {
            offset = Math.max(0, offset - pattern.start.length);
          }

          if (Tools.trim(firstTextNode.data).length === pattern.start.length) {
            return;
          }

          if (pattern.format) {
            format = editor.formatter.get(pattern.format);
            if (format && format[0].block) {
              firstTextNode.deleteData(0, pattern.start.length);
              editor.formatter.apply(pattern.format, {}, firstTextNode);

              rng.setStart(container, offset);
              rng.collapse(true);
              selection.setRng(rng);
            }
          }

          if (pattern.cmd) {
            editor.undoManager.transact(function () {
              firstTextNode.deleteData(0, pattern.start.length);
              editor.execCommand(pattern.cmd);
            });
          }
        }
      }
    };

    return {
      applyInlineFormat: applyInlineFormat,
      applyBlockFormat: applyBlockFormat
    };
  }
);
