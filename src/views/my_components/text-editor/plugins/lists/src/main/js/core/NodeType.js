/**
 * NodeType.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.core.NodeType',
  [
  ],
  function () {
    var isTextNode = function (node) {
      return node && node.nodeType === 3;
    };

    var isListNode = function (node) {
      return node && (/^(OL|UL|DL)$/).test(node.nodeName);
    };

    var isListItemNode = function (node) {
      return node && /^(LI|DT|DD)$/.test(node.nodeName);
    };

    var isBr = function (node) {
      return node && node.nodeName === 'BR';
    };

    var isFirstChild = function (node) {
      return node.parentNode.firstChild === node;
    };

    var isLastChild = function (node) {
      return node.parentNode.lastChild === node;
    };

    var isTextBlock = function (editor, node) {
      return node && !!editor.schema.getTextBlockElements()[node.nodeName];
    };

    var isBlock = function (node, blockElements) {
      return node && node.nodeName in blockElements;
    };

    var isBogusBr = function (dom, node) {
      if (!isBr(node)) {
        return false;
      }

      if (dom.isBlock(node.nextSibling) && !isBr(node.previousSibling)) {
        return true;
      }

      return false;
    };

    var isEmpty = function (dom, elm, keepBookmarks) {
      var empty = dom.isEmpty(elm);

      if (keepBookmarks && dom.select('span[data-mce-type=bookmark]', elm).length > 0) {
        return false;
      }

      return empty;
    };

    var isChildOfBody = function (dom, elm) {
      return dom.isChildOf(elm, dom.getRoot());
    };

    return {
      isTextNode: isTextNode,
      isListNode: isListNode,
      isListItemNode: isListItemNode,
      isBr: isBr,
      isFirstChild: isFirstChild,
      isLastChild: isLastChild,
      isTextBlock: isTextBlock,
      isBlock: isBlock,
      isBogusBr: isBogusBr,
      isEmpty: isEmpty,
      isChildOfBody: isChildOfBody
    };
  }
);

