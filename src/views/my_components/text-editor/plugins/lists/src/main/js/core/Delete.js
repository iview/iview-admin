/**
 * Delete.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.core.Delete',
  [
    'tinymce.core.dom.RangeUtils',
    'tinymce.core.dom.TreeWalker',
    'tinymce.core.util.VK',
    'tinymce.plugins.lists.actions.ToggleList',
    'tinymce.plugins.lists.core.Bookmark',
    'tinymce.plugins.lists.core.NodeType',
    'tinymce.plugins.lists.core.NormalizeLists',
    'tinymce.plugins.lists.core.Range',
    'tinymce.plugins.lists.core.Selection'
  ],
  function (RangeUtils, TreeWalker, VK, ToggleList, Bookmark, NodeType, NormalizeLists, Range, Selection) {
    var findNextCaretContainer = function (editor, rng, isForward) {
      var node = rng.startContainer, offset = rng.startOffset;
      var nonEmptyBlocks, walker;

      if (node.nodeType === 3 && (isForward ? offset < node.data.length : offset > 0)) {
        return node;
      }

      nonEmptyBlocks = editor.schema.getNonEmptyElements();
      if (node.nodeType === 1) {
        node = RangeUtils.getNode(node, offset);
      }

      walker = new TreeWalker(node, editor.getBody());

      // Delete at <li>|<br></li> then jump over the bogus br
      if (isForward) {
        if (NodeType.isBogusBr(editor.dom, node)) {
          walker.next();
        }
      }

      while ((node = walker[isForward ? 'next' : 'prev2']())) {
        if (node.nodeName === 'LI' && !node.hasChildNodes()) {
          return node;
        }

        if (nonEmptyBlocks[node.nodeName]) {
          return node;
        }

        if (node.nodeType === 3 && node.data.length > 0) {
          return node;
        }
      }
    };

    var hasOnlyOneBlockChild = function (dom, elm) {
      var childNodes = elm.childNodes;
      return childNodes.length === 1 && !NodeType.isListNode(childNodes[0]) && dom.isBlock(childNodes[0]);
    };

    var unwrapSingleBlockChild = function (dom, elm) {
      if (hasOnlyOneBlockChild(dom, elm)) {
        dom.remove(elm.firstChild, true);
      }
    };

    var moveChildren = function (dom, fromElm, toElm) {
      var node, targetElm;

      targetElm = hasOnlyOneBlockChild(dom, toElm) ? toElm.firstChild : toElm;
      unwrapSingleBlockChild(dom, fromElm);

      if (!NodeType.isEmpty(dom, fromElm, true)) {
        while ((node = fromElm.firstChild)) {
          targetElm.appendChild(node);
        }
      }
    };

    var mergeLiElements = function (dom, fromElm, toElm) {
      var node, listNode, ul = fromElm.parentNode;

      if (!NodeType.isChildOfBody(dom, fromElm) || !NodeType.isChildOfBody(dom, toElm)) {
        return;
      }

      if (NodeType.isListNode(toElm.lastChild)) {
        listNode = toElm.lastChild;
      }

      if (ul === toElm.lastChild) {
        if (NodeType.isBr(ul.previousSibling)) {
          dom.remove(ul.previousSibling);
        }
      }

      node = toElm.lastChild;
      if (node && NodeType.isBr(node) && fromElm.hasChildNodes()) {
        dom.remove(node);
      }

      if (NodeType.isEmpty(dom, toElm, true)) {
        dom.$(toElm).empty();
      }

      moveChildren(dom, fromElm, toElm);

      if (listNode) {
        toElm.appendChild(listNode);
      }

      dom.remove(fromElm);

      if (NodeType.isEmpty(dom, ul) && ul !== dom.getRoot()) {
        dom.remove(ul);
      }
    };

    var mergeIntoEmptyLi = function (editor, fromLi, toLi) {
      editor.dom.$(toLi).empty();
      mergeLiElements(editor.dom, fromLi, toLi);
      editor.selection.setCursorLocation(toLi);
    };

    var mergeForward = function (editor, rng, fromLi, toLi) {
      var dom = editor.dom;

      if (dom.isEmpty(toLi)) {
        mergeIntoEmptyLi(editor, fromLi, toLi);
      } else {
        var bookmark = Bookmark.createBookmark(rng);
        mergeLiElements(dom, fromLi, toLi);
        editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
      }
    };

    var mergeBackward = function (editor, rng, fromLi, toLi) {
      var bookmark = Bookmark.createBookmark(rng);
      mergeLiElements(editor.dom, fromLi, toLi);
      editor.selection.setRng(Bookmark.resolveBookmark(bookmark));
    };

    var backspaceDeleteFromListToListCaret = function (editor, isForward) {
      var dom = editor.dom, selection = editor.selection;
      var li = dom.getParent(selection.getStart(), 'LI'), ul, rng, otherLi;

      if (li) {
        ul = li.parentNode;
        if (ul === editor.getBody() && NodeType.isEmpty(dom, ul)) {
          return true;
        }

        rng = Range.normalizeRange(selection.getRng(true));
        otherLi = dom.getParent(findNextCaretContainer(editor, rng, isForward), 'LI');

        if (otherLi && otherLi !== li) {
          if (isForward) {
            mergeForward(editor, rng, otherLi, li);
          } else {
            mergeBackward(editor, rng, li, otherLi);
          }

          return true;
        } else if (!otherLi) {
          if (!isForward && ToggleList.removeList(editor, ul.nodeName)) {
            return true;
          }
        }
      }

      return false;
    };

    var removeBlock = function (dom, block) {
      var parentBlock = dom.getParent(block.parentNode, dom.isBlock);

      dom.remove(block);
      if (parentBlock && dom.isEmpty(parentBlock)) {
        dom.remove(parentBlock);
      }
    };

    var backspaceDeleteIntoListCaret = function (editor, isForward) {
      var dom = editor.dom;
      var block = dom.getParent(editor.selection.getStart(), dom.isBlock);

      if (block && dom.isEmpty(block)) {
        var rng = Range.normalizeRange(editor.selection.getRng(true));
        var otherLi = dom.getParent(findNextCaretContainer(editor, rng, isForward), 'LI');

        if (otherLi) {
          editor.undoManager.transact(function () {
            removeBlock(dom, block);
            ToggleList.mergeWithAdjacentLists(dom, otherLi.parentNode);
            editor.selection.select(otherLi, true);
            editor.selection.collapse(isForward);
          });

          return true;
        }
      }

      return false;
    };

    var backspaceDeleteCaret = function (editor, isForward) {
      return backspaceDeleteFromListToListCaret(editor, isForward) || backspaceDeleteIntoListCaret(editor, isForward);
    };

    var backspaceDeleteRange = function (editor) {
      var startListParent = editor.dom.getParent(editor.selection.getStart(), 'LI,DT,DD');

      if (startListParent || Selection.getSelectedListItems(editor).length > 0) {
        editor.undoManager.transact(function () {
          editor.execCommand('Delete');
          NormalizeLists.normalizeLists(editor.dom, editor.getBody());
        });

        return true;
      }

      return false;
    };

    var backspaceDelete = function (editor, isForward) {
      return editor.selection.isCollapsed() ? backspaceDeleteCaret(editor, isForward) : backspaceDeleteRange(editor);
    };

    var setup = function (editor) {
      editor.on('keydown', function (e) {
        if (e.keyCode === VK.BACKSPACE) {
          if (backspaceDelete(editor, false)) {
            e.preventDefault();
          }
        } else if (e.keyCode === VK.DELETE) {
          if (backspaceDelete(editor, true)) {
            e.preventDefault();
          }
        }
      });
    };

    return {
      setup: setup,
      backspaceDelete: backspaceDelete
    };
  }
);

