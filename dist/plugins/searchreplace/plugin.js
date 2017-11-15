(function () {
    var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
    var register_3795 = function (id) {
        var module = dem(id);
        var fragments = id.split('.');
        var target = Function('return this;')();
        for (var i = 0; i < fragments.length - 1; ++i) {
            if (target[fragments[i]] === undefined) { target[fragments[i]] = {}; }
            target = target[fragments[i]];
        }
        target[fragments[fragments.length - 1]] = module;
    };

    var instantiate = function (id) {
        var actual = defs[id];
        var dependencies = actual.deps;
        var definition = actual.defn;
        var len = dependencies.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(dependencies[i]); }
        var defResult = definition.apply(null, instances);
        if (defResult === undefined) { throw 'module [' + id + '] returned undefined'; }
        actual.instance = defResult;
    };

    var def = function (id, dependencies, definition) {
        if (typeof id !== 'string') { throw 'module id must be a string'; } else if (dependencies === undefined) { throw 'no dependencies for ' + id; } else if (definition === undefined) { throw 'no definition function for ' + id; }
        defs[id] = {
            deps: dependencies,
            defn: definition,
            instance: undefined
        };
    };

    var dem = function (id) {
        var actual = defs[id];
        if (actual === undefined) { throw 'module [' + id + '] was undefined'; } else if (actual.instance === undefined) { instantiate(id); }
        return actual.instance;
    };

    var req = function (ids, callback) {
        var len = ids.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(ids[i]); }
        callback.apply(null, instances);
    };

    var ephox = {};

    ephox.bolt = {
        module: {
            api: {
                define: def,
                require: req,
                demand: dem
            }
        }
    };

    var define = def;
    var require = req;
    var demand = dem;
// this helps with minification when using a lot of global references
    var defineGlobal = function (id, ref) {
        define(id, [], function () { return ref; });
    };
/* jsc
["tinymce.plugins.searchreplace.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.searchreplace.api.Api","tinymce.plugins.searchreplace.api.Commands","tinymce.plugins.searchreplace.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.searchreplace.core.Actions","tinymce.plugins.searchreplace.ui.Dialog","tinymce.core.util.Tools","tinymce.plugins.searchreplace.core.FindReplaceText"]
jsc */
    define(
  'ephox.katamari.api.Cell',

        [
        ],

  function () {
      var Cell = function (initial) {
          var value = initial;

          var get = function () {
              return value;
          };

          var set = function (v) {
              value = v;
          };

          var clone = function () {
              return Cell(get());
          };

          return {
              get: get,
              set: set,
              clone: clone
          };
      };

      return Cell;
  }
);

    defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
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
 * FindReplaceText.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/* jshint smarttabs:true, undef:true, unused:true, latedef:true, curly:true, bitwise:true */
/* eslint no-labels:0, no-constant-condition: 0 */

    define(
  'tinymce.plugins.searchreplace.core.FindReplaceText',
        [
        ],
  function () {
      function isContentEditableFalse (node) {
          return node && node.nodeType === 1 && node.contentEditable === 'false';
      }

    // Based on work developed by: James Padolsey http://james.padolsey.com
    // released under UNLICENSE that is compatible with LGPL
    // TODO: Handle contentEditable edgecase:
    // <p>text<span contentEditable="false">text<span contentEditable="true">text</span>text</span>text</p>
      function findAndReplaceDOMText (regex, node, replacementNode, captureGroup, schema) {
          var m, matches = [], text, count = 0, doc;
          var blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap;

          doc = node.ownerDocument;
          blockElementsMap = schema.getBlockElements(); // H1-H6, P, TD etc
          hiddenTextElementsMap = schema.getWhiteSpaceElements(); // TEXTAREA, PRE, STYLE, SCRIPT
          shortEndedElementsMap = schema.getShortEndedElements(); // BR, IMG, INPUT

          function getMatchIndexes (m, captureGroup) {
              captureGroup = captureGroup || 0;

              if (!m[0]) {
                  throw 'findAndReplaceDOMText cannot handle zero-length matches';
              }

              var index = m.index;

              if (captureGroup > 0) {
                  var cg = m[captureGroup];

                  if (!cg) {
                      throw 'Invalid capture group';
                  }

                  index += m[0].indexOf(cg);
                  m[0] = cg;
              }

              return [index, index + m[0].length, [m[0]]];
          }

          function getText (node) {
              var txt;

              if (node.nodeType === 3) {
                  return node.data;
              }

              if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
                  return '';
              }

              txt = '';

              if (isContentEditableFalse(node)) {
                  return '\n';
              }

              if (blockElementsMap[node.nodeName] || shortEndedElementsMap[node.nodeName]) {
                  txt += '\n';
              }

              if ((node = node.firstChild)) {
                  do {
                      txt += getText(node);
                  } while ((node = node.nextSibling));
              }

              return txt;
          }

          function stepThroughMatches (node, matches, replaceFn) {
              var startNode, endNode, startNodeIndex,
                  endNodeIndex, innerNodes = [], atIndex = 0, curNode = node,
                  matchLocation = matches.shift(), matchIndex = 0;

              out: while (true) {
                  if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
                      atIndex++;
                  }

                  if (curNode.nodeType === 3) {
                      if (!endNode && curNode.length + atIndex >= matchLocation[1]) {
              // We've found the ending
                          endNode = curNode;
                          endNodeIndex = matchLocation[1] - atIndex;
                      } else if (startNode) {
              // Intersecting node
                          innerNodes.push(curNode);
                      }

                      if (!startNode && curNode.length + atIndex > matchLocation[0]) {
              // We've found the match start
                          startNode = curNode;
                          startNodeIndex = matchLocation[0] - atIndex;
                      }

                      atIndex += curNode.length;
                  }

                  if (startNode && endNode) {
                      curNode = replaceFn({
                          startNode: startNode,
                          startNodeIndex: startNodeIndex,
                          endNode: endNode,
                          endNodeIndex: endNodeIndex,
                          innerNodes: innerNodes,
                          match: matchLocation[2],
                          matchIndex: matchIndex
                      });

            // replaceFn has to return the node that replaced the endNode
            // and then we step back so we can continue from the end of the
            // match:
                      atIndex -= (endNode.length - endNodeIndex);
                      startNode = null;
                      endNode = null;
                      innerNodes = [];
                      matchLocation = matches.shift();
                      matchIndex++;

                      if (!matchLocation) {
                          break; // no more matches
                      }
                  } else if ((!hiddenTextElementsMap[curNode.nodeName] || blockElementsMap[curNode.nodeName]) && curNode.firstChild) {
                      if (!isContentEditableFalse(curNode)) {
              // Move down
                          curNode = curNode.firstChild;
                          continue;
                      }
                  } else if (curNode.nextSibling) {
            // Move forward:
                      curNode = curNode.nextSibling;
                      continue;
                  }

          // Move forward or up:
                  while (true) {
                      if (curNode.nextSibling) {
                          curNode = curNode.nextSibling;
                          break;
                      } else if (curNode.parentNode !== node) {
                          curNode = curNode.parentNode;
                      } else {
                          break out;
                      }
                  }
              }
          }

      /**
      * Generates the actual replaceFn which splits up text nodes
      * and inserts the replacement element.
      */
          function genReplacer (nodeName) {
              var makeReplacementNode;

              if (typeof nodeName !== 'function') {
                  var stencilNode = nodeName.nodeType ? nodeName : doc.createElement(nodeName);

                  makeReplacementNode = function (fill, matchIndex) {
                      var clone = stencilNode.cloneNode(false);

                      clone.setAttribute('data-mce-index', matchIndex);

                      if (fill) {
                          clone.appendChild(doc.createTextNode(fill));
                      }

                      return clone;
                  };
              } else {
                  makeReplacementNode = nodeName;
              }

              return function (range) {
                  var before, after, parentNode, startNode = range.startNode,
                      endNode = range.endNode, matchIndex = range.matchIndex;

                  if (startNode === endNode) {
                      var node = startNode;

                      parentNode = node.parentNode;
                      if (range.startNodeIndex > 0) {
              // Add `before` text node (before the match)
                          before = doc.createTextNode(node.data.substring(0, range.startNodeIndex));
                          parentNode.insertBefore(before, node);
                      }

            // Create the replacement node:
                      var el = makeReplacementNode(range.match[0], matchIndex);
                      parentNode.insertBefore(el, node);
                      if (range.endNodeIndex < node.length) {
              // Add `after` text node (after the match)
                          after = doc.createTextNode(node.data.substring(range.endNodeIndex));
                          parentNode.insertBefore(after, node);
                      }

                      node.parentNode.removeChild(node);

                      return el;
                  }

          // Replace startNode -> [innerNodes...] -> endNode (in that order)
                  before = doc.createTextNode(startNode.data.substring(0, range.startNodeIndex));
                  after = doc.createTextNode(endNode.data.substring(range.endNodeIndex));
                  var elA = makeReplacementNode(startNode.data.substring(range.startNodeIndex), matchIndex);
                  var innerEls = [];

                  for (var i = 0, l = range.innerNodes.length; i < l; ++i) {
                      var innerNode = range.innerNodes[i];
                      var innerEl = makeReplacementNode(innerNode.data, matchIndex);
                      innerNode.parentNode.replaceChild(innerEl, innerNode);
                      innerEls.push(innerEl);
                  }

                  var elB = makeReplacementNode(endNode.data.substring(0, range.endNodeIndex), matchIndex);

                  parentNode = startNode.parentNode;
                  parentNode.insertBefore(before, startNode);
                  parentNode.insertBefore(elA, startNode);
                  parentNode.removeChild(startNode);

                  parentNode = endNode.parentNode;
                  parentNode.insertBefore(elB, endNode);
                  parentNode.insertBefore(after, endNode);
                  parentNode.removeChild(endNode);

                  return elB;
              };
          }

          text = getText(node);
          if (!text) {
              return;
          }

          if (regex.global) {
              while ((m = regex.exec(text))) {
                  matches.push(getMatchIndexes(m, captureGroup));
              }
          } else {
              m = text.match(regex);
              matches.push(getMatchIndexes(m, captureGroup));
          }

          if (matches.length) {
              count = matches.length;
              stepThroughMatches(node, matches, genReplacer(replacementNode));
          }

          return count;
      }

      return {
          findAndReplaceDOMText: findAndReplaceDOMText
      };
  }
);
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

          if (typeof value === 'number') {
              return '' + value;
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
          text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
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
/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.searchreplace.api.Api',
        [
            'tinymce.plugins.searchreplace.core.Actions'
        ],
  function (Actions) {
      var get = function (editor, currentIndexState) {
          var done = function (keepEditorSelection) {
              return Actions.done(editor, currentIndexState, keepEditorSelection);
          };

          var find = function (text, matchCase, wholeWord) {
              return Actions.find(editor, currentIndexState, text, matchCase, wholeWord);
          };

          var next = function () {
              return Actions.next(editor, currentIndexState);
          };

          var prev = function () {
              return Actions.prev(editor, currentIndexState);
          };

          var replace = function (text, forward, all) {
              return Actions.replace(editor, currentIndexState, text, forward, all);
          };

          return {
              done: done,
              find: find,
              next: next,
              prev: prev,
              replace: replace
          };
      };

      return {
          get: get
      };
  }
);
/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.searchreplace.ui.Dialog',
        [
            'tinymce.core.util.Tools',
            'tinymce.plugins.searchreplace.core.Actions'
        ],
  function (Tools, Actions) {
      var open = function (editor, currentIndexState) {
          var last = {}, selectedText;

          selectedText = Tools.trim(editor.selection.getContent({ format: 'text' }));

          function updateButtonStates () {
              win.statusbar.find('#next').disabled(Actions.hasNext(editor, currentIndexState) === false);
              win.statusbar.find('#prev').disabled(Actions.hasPrev(editor, currentIndexState) === false);
          }

          function notFoundAlert () {
              editor.windowManager.alert('Could not find the specified string.', function () {
                  win.find('#find')[0].focus();
              });
          }

          var win = editor.windowManager.open({
              layout: 'flex',
              pack: 'center',
              align: 'center',
              onClose: function () {
                  editor.focus();
                  Actions.done(editor, currentIndexState);
              },
              onSubmit: function (e) {
                  var count, caseState, text, wholeWord;

                  e.preventDefault();

                  caseState = win.find('#case').checked();
                  wholeWord = win.find('#words').checked();

                  text = win.find('#find').value();
                  if (!text.length) {
                      Actions.done(editor, currentIndexState, false);
                      win.statusbar.items().slice(1).disabled(true);
                      return;
                  }

                  if (last.text === text && last.caseState === caseState && last.wholeWord === wholeWord) {
                      if (!Actions.hasNext(editor, currentIndexState)) {
                          notFoundAlert();
                          return;
                      }

                      Actions.next(editor, currentIndexState);
                      updateButtonStates();
                      return;
                  }

                  count = Actions.find(editor, currentIndexState, text, caseState, wholeWord);
                  if (!count) {
                      notFoundAlert();
                  }

                  win.statusbar.items().slice(1).disabled(count === 0);
                  updateButtonStates();

                  last = {
                      text: text,
                      caseState: caseState,
                      wholeWord: wholeWord
                  };
              },
              buttons: [
                  {
                      text: 'Find',
                      subtype: 'primary',
                      onclick: function () {
                          win.submit();
                      }
                  },
                  {
                      text: 'Replace',
                      disabled: true,
                      onclick: function () {
                          if (!Actions.replace(editor, currentIndexState, win.find('#replace').value())) {
                              win.statusbar.items().slice(1).disabled(true);
                              currentIndexState.set(-1);
                              last = {};
                          }
                      }
                  },
                  {
                      text: 'Replace all',
                      disabled: true,
                      onclick: function () {
                          Actions.replace(editor, currentIndexState, win.find('#replace').value(), true, true);
                          win.statusbar.items().slice(1).disabled(true);
                          last = {};
                      }
                  },
          { type: 'spacer', flex: 1 },
                  {
                      text: 'Prev',
                      name: 'prev',
                      disabled: true,
                      onclick: function () {
                          Actions.prev(editor, currentIndexState);
                          updateButtonStates();
                      }
                  },
                  {
                      text: 'Next',
                      name: 'next',
                      disabled: true,
                      onclick: function () {
                          Actions.next(editor, currentIndexState);
                          updateButtonStates();
                      }
                  }
              ],
              title: 'Find and replace',
              items: {
                  type: 'form',
                  padding: 20,
                  labelGap: 30,
                  spacing: 10,
                  items: [
            { type: 'textbox', name: 'find', size: 40, label: 'Find', value: selectedText },
            { type: 'textbox', name: 'replace', size: 40, label: 'Replace with' },
            { type: 'checkbox', name: 'case', text: 'Match case', label: ' ' },
            { type: 'checkbox', name: 'words', text: 'Whole words', label: ' ' }
                  ]
              }
          });
      };

      return {
          open: open
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
  'tinymce.plugins.searchreplace.api.Commands',
        [
            'tinymce.plugins.searchreplace.ui.Dialog'
        ],
  function (Dialog) {
      var register = function (editor, currentIndexState) {
          editor.addCommand('SearchReplace', function () {
              Dialog.open(editor, currentIndexState);
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
  'tinymce.plugins.searchreplace.ui.Buttons',
        [
            'tinymce.plugins.searchreplace.ui.Dialog'
        ],
  function (Dialog) {
      var showDialog = function (editor, currentIndexState) {
          return function () {
              Dialog.open(editor, currentIndexState);
          };
      };

      var register = function (editor, currentIndexState) {
          editor.addMenuItem('searchreplace', {
              text: 'Find and replace',
              shortcut: 'Meta+F',
              onclick: showDialog(editor, currentIndexState),
              separator: 'before',
              context: 'edit'
          });

          editor.addButton('searchreplace', {
              tooltip: 'Find and replace',
              shortcut: 'Meta+F',
              onclick: showDialog(editor, currentIndexState)
          });

          editor.shortcuts.add('Meta+F', '', showDialog(editor, currentIndexState));
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
  'tinymce.plugins.searchreplace.Plugin',
        [
            'ephox.katamari.api.Cell',
            'tinymce.core.PluginManager',
            'tinymce.plugins.searchreplace.api.Api',
            'tinymce.plugins.searchreplace.api.Commands',
            'tinymce.plugins.searchreplace.ui.Buttons'
        ],
  function (Cell, PluginManager, Api, Commands, Buttons) {
      PluginManager.add('searchreplace', function (editor) {
          var currentIndexState = Cell(-1);

          Commands.register(editor, currentIndexState);
          Buttons.register(editor, currentIndexState);

          return Api.get(editor, currentIndexState);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.searchreplace.Plugin')();
})();
