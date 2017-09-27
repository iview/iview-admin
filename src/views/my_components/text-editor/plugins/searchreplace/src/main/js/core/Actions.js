/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.searchreplace.core.Actions',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.searchreplace.core.FindReplaceText'
  ],
  function (Tools, FindReplaceText) {
    var getElmIndex = function (elm) {
      var value = elm.getAttribute('data-mce-index');

      if (typeof value === "number") {
        return "" + value;
      }

      return value;
    };

    var markAllMatches = function (editor, currentIndexState, regex) {
      var node, marker;

      marker = editor.dom.create('span', {
        'data-mce-bogus': 1
      });

      marker.className = 'mce-match-marker'; // IE 7 adds class="mce-match-marker" and class=mce-match-marker
      node = editor.getBody();

      done(editor, currentIndexState, false);

      return FindReplaceText.findAndReplaceDOMText(regex, node, marker, false, editor.schema);
    };

    var unwrap = function (node) {
      var parentNode = node.parentNode;

      if (node.firstChild) {
        parentNode.insertBefore(node.firstChild, node);
      }

      node.parentNode.removeChild(node);
    };

    var findSpansByIndex = function (editor, index) {
      var nodes, spans = [];

      nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
      if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          var nodeIndex = getElmIndex(nodes[i]);

          if (nodeIndex === null || !nodeIndex.length) {
            continue;
          }

          if (nodeIndex === index.toString()) {
            spans.push(nodes[i]);
          }
        }
      }

      return spans;
    };

    var moveSelection = function (editor, currentIndexState, forward) {
      var testIndex = currentIndexState.get(), dom = editor.dom;

      forward = forward !== false;

      if (forward) {
        testIndex++;
      } else {
        testIndex--;
      }

      dom.removeClass(findSpansByIndex(editor, currentIndexState.get()), 'mce-match-marker-selected');

      var spans = findSpansByIndex(editor, testIndex);
      if (spans.length) {
        dom.addClass(findSpansByIndex(editor, testIndex), 'mce-match-marker-selected');
        editor.selection.scrollIntoView(spans[0]);
        return testIndex;
      }

      return -1;
    };

    var removeNode = function (dom, node) {
      var parent = node.parentNode;

      dom.remove(node);

      if (dom.isEmpty(parent)) {
        dom.remove(parent);
      }
    };

    var find = function (editor, currentIndexState, text, matchCase, wholeWord) {
      text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      text = text.replace(/\s/g, '\\s');
      text = wholeWord ? '\\b' + text + '\\b' : text;

      var count = markAllMatches(editor, currentIndexState, new RegExp(text, matchCase ? 'g' : 'gi'));

      if (count) {
        currentIndexState.set(-1);
        currentIndexState.set(moveSelection(editor, currentIndexState, true));
      }

      return count;
    };

    var next = function (editor, currentIndexState) {
      var index = moveSelection(editor, currentIndexState, true);

      if (index !== -1) {
        currentIndexState.set(index);
      }
    };

    var prev = function (editor, currentIndexState) {
      var index = moveSelection(editor, currentIndexState, false);

      if (index !== -1) {
        currentIndexState.set(index);
      }
    };

    var isMatchSpan = function (node) {
      var matchIndex = getElmIndex(node);

      return matchIndex !== null && matchIndex.length > 0;
    };

    var replace = function (editor, currentIndexState, text, forward, all) {
      var i, nodes, node, matchIndex, currentMatchIndex, nextIndex = currentIndexState.get(), hasMore;

      forward = forward !== false;

      node = editor.getBody();
      nodes = Tools.grep(Tools.toArray(node.getElementsByTagName('span')), isMatchSpan);
      for (i = 0; i < nodes.length; i++) {
        var nodeIndex = getElmIndex(nodes[i]);

        matchIndex = currentMatchIndex = parseInt(nodeIndex, 10);
        if (all || matchIndex === currentIndexState.get()) {
          if (text.length) {
            nodes[i].firstChild.nodeValue = text;
            unwrap(nodes[i]);
          } else {
            removeNode(editor.dom, nodes[i]);
          }

          while (nodes[++i]) {
            matchIndex = parseInt(getElmIndex(nodes[i]), 10);

            if (matchIndex === currentMatchIndex) {
              removeNode(editor.dom, nodes[i]);
            } else {
              i--;
              break;
            }
          }

          if (forward) {
            nextIndex--;
          }
        } else if (currentMatchIndex > currentIndexState.get()) {
          nodes[i].setAttribute('data-mce-index', currentMatchIndex - 1);
        }
      }

      editor.undoManager.add();
      currentIndexState.set(nextIndex);

      if (forward) {
        hasMore = hasNext(editor, currentIndexState);
        next(editor, currentIndexState);
      } else {
        hasMore = hasPrev(editor, currentIndexState);
        prev(editor, currentIndexState);
      }

      return !all && hasMore;
    };

    var done = function (editor, currentIndexState, keepEditorSelection) {
      var i, nodes, startContainer, endContainer;

      nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
      for (i = 0; i < nodes.length; i++) {
        var nodeIndex = getElmIndex(nodes[i]);

        if (nodeIndex !== null && nodeIndex.length) {
          if (nodeIndex === currentIndexState.get().toString()) {
            if (!startContainer) {
              startContainer = nodes[i].firstChild;
            }

            endContainer = nodes[i].firstChild;
          }

          unwrap(nodes[i]);
        }
      }

      if (startContainer && endContainer) {
        var rng = editor.dom.createRng();
        rng.setStart(startContainer, 0);
        rng.setEnd(endContainer, endContainer.data.length);

        if (keepEditorSelection !== false) {
          editor.selection.setRng(rng);
        }

        return rng;
      }
    };

    var hasNext = function (editor, currentIndexState) {
      return findSpansByIndex(editor, currentIndexState.get() + 1).length > 0;
    };

    var hasPrev = function (editor, currentIndexState) {
      return findSpansByIndex(editor, currentIndexState.get() - 1).length > 0;
    };

    return {
      done: done,
      find: find,
      next: next,
      prev: prev,
      replace: replace,
      hasNext: hasNext,
      hasPrev: hasPrev
    };
  }
);