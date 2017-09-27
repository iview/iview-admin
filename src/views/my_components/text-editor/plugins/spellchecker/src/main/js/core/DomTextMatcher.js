/**
 * DomTextMatcher.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.core.DomTextMatcher',
  [
  ],
  function () {
    function isContentEditableFalse(node) {
      return node && node.nodeType === 1 && node.contentEditable === "false";
    }

    // Based on work developed by: James Padolsey http://james.padolsey.com
    // released under UNLICENSE that is compatible with LGPL
    // TODO: Handle contentEditable edgecase:
    // <p>text<span contentEditable="false">text<span contentEditable="true">text</span>text</span>text</p>
    return function (node, editor) {
      var m, matches = [], text, dom = editor.dom;
      var blockElementsMap, hiddenTextElementsMap, shortEndedElementsMap;

      blockElementsMap = editor.schema.getBlockElements(); // H1-H6, P, TD etc
      hiddenTextElementsMap = editor.schema.getWhiteSpaceElements(); // TEXTAREA, PRE, STYLE, SCRIPT
      shortEndedElementsMap = editor.schema.getShortEndedElements(); // BR, IMG, INPUT

      function createMatch(m, data) {
        if (!m[0]) {
          throw 'findAndReplaceDOMText cannot handle zero-length matches';
        }

        return {
          start: m.index,
          end: m.index + m[0].length,
          text: m[0],
          data: data
        };
      }

      function getText(node) {
        var txt;

        if (node.nodeType === 3) {
          return node.data;
        }

        if (hiddenTextElementsMap[node.nodeName] && !blockElementsMap[node.nodeName]) {
          return '';
        }

        if (isContentEditableFalse(node)) {
          return '\n';
        }

        txt = '';

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

      function stepThroughMatches(node, matches, replaceFn) {
        var startNode, endNode, startNodeIndex,
          endNodeIndex, innerNodes = [], atIndex = 0, curNode = node,
          matchLocation, matchIndex = 0;

        matches = matches.slice(0);
        matches.sort(function (a, b) {
          return a.start - b.start;
        });

        matchLocation = matches.shift();

        out: while (true) { //eslint-disable-line no-constant-condition
          if (blockElementsMap[curNode.nodeName] || shortEndedElementsMap[curNode.nodeName] || isContentEditableFalse(curNode)) {
            atIndex++;
          }

          if (curNode.nodeType === 3) {
            if (!endNode && curNode.length + atIndex >= matchLocation.end) {
              // We've found the ending
              endNode = curNode;
              endNodeIndex = matchLocation.end - atIndex;
            } else if (startNode) {
              // Intersecting node
              innerNodes.push(curNode);
            }

            if (!startNode && curNode.length + atIndex > matchLocation.start) {
              // We've found the match start
              startNode = curNode;
              startNodeIndex = matchLocation.start - atIndex;
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
              match: matchLocation.text,
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
          while (true) { //eslint-disable-line no-constant-condition
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
      function genReplacer(callback) {
        function makeReplacementNode(fill, matchIndex) {
          var match = matches[matchIndex];

          if (!match.stencil) {
            match.stencil = callback(match);
          }

          var clone = match.stencil.cloneNode(false);
          clone.setAttribute('data-mce-index', matchIndex);

          if (fill) {
            clone.appendChild(dom.doc.createTextNode(fill));
          }

          return clone;
        }

        return function (range) {
          var before, after, parentNode, startNode = range.startNode,
            endNode = range.endNode, matchIndex = range.matchIndex,
            doc = dom.doc;

          if (startNode === endNode) {
            var node = startNode;

            parentNode = node.parentNode;
            if (range.startNodeIndex > 0) {
              // Add "before" text node (before the match)
              before = doc.createTextNode(node.data.substring(0, range.startNodeIndex));
              parentNode.insertBefore(before, node);
            }

            // Create the replacement node:
            var el = makeReplacementNode(range.match, matchIndex);
            parentNode.insertBefore(el, node);
            if (range.endNodeIndex < node.length) {
              // Add "after" text node (after the match)
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

      function unwrapElement(element) {
        var parentNode = element.parentNode;
        parentNode.insertBefore(element.firstChild, element);
        element.parentNode.removeChild(element);
      }

      function hasClass(elm) {
        return elm.className.indexOf('mce-spellchecker-word') !== -1;
      }

      function getWrappersByIndex(index) {
        var elements = node.getElementsByTagName('*'), wrappers = [];

        index = typeof index === "number" ? "" + index : null;

        for (var i = 0; i < elements.length; i++) {
          var element = elements[i], dataIndex = element.getAttribute('data-mce-index');

          if (dataIndex !== null && dataIndex.length && hasClass(element)) {
            if (dataIndex === index || index === null) {
              wrappers.push(element);
            }
          }
        }

        return wrappers;
      }

      /**
      * Returns the index of a specific match object or -1 if it isn't found.
      *
      * @param  {Match} match Text match object.
      * @return {Number} Index of match or -1 if it isn't found.
      */
      function indexOf(match) {
        var i = matches.length;
        while (i--) {
          if (matches[i] === match) {
            return i;
          }
        }

        return -1;
      }

      /**
      * Filters the matches. If the callback returns true it stays if not it gets removed.
      *
      * @param {Function} callback Callback to execute for each match.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function filter(callback) {
        var filteredMatches = [];

        each(function (match, i) {
          if (callback(match, i)) {
            filteredMatches.push(match);
          }
        });

        matches = filteredMatches;

        /*jshint validthis:true*/
        return this;
      }

      /**
      * Executes the specified callback for each match.
      *
      * @param {Function} callback  Callback to execute for each match.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function each(callback) {
        for (var i = 0, l = matches.length; i < l; i++) {
          if (callback(matches[i], i) === false) {
            break;
          }
        }

        /*jshint validthis:true*/
        return this;
      }

      /**
      * Wraps the current matches with nodes created by the specified callback.
      * Multiple clones of these matches might occur on matches that are on multiple nodex.
      *
      * @param {Function} callback Callback to execute in order to create elements for matches.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function wrap(callback) {
        if (matches.length) {
          stepThroughMatches(node, matches, genReplacer(callback));
        }

        /*jshint validthis:true*/
        return this;
      }

      /**
      * Finds the specified regexp and adds them to the matches collection.
      *
      * @param {RegExp} regex Global regexp to search the current node by.
      * @param {Object} [data] Optional custom data element for the match.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function find(regex, data) {
        if (text && regex.global) {
          while ((m = regex.exec(text))) {
            matches.push(createMatch(m, data));
          }
        }

        return this;
      }

      /**
      * Unwraps the specified match object or all matches if unspecified.
      *
      * @param {Object} [match] Optional match object.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function unwrap(match) {
        var i, elements = getWrappersByIndex(match ? indexOf(match) : null);

        i = elements.length;
        while (i--) {
          unwrapElement(elements[i]);
        }

        return this;
      }

      /**
      * Returns a match object by the specified DOM element.
      *
      * @param {DOMElement} element Element to return match object for.
      * @return {Object} Match object for the specified element.
      */
      function matchFromElement(element) {
        return matches[element.getAttribute('data-mce-index')];
      }

      /**
      * Returns a DOM element from the specified match element. This will be the first element if it's split
      * on multiple nodes.
      *
      * @param {Object} match Match element to get first element of.
      * @return {DOMElement} DOM element for the specified match object.
      */
      function elementFromMatch(match) {
        return getWrappersByIndex(indexOf(match))[0];
      }

      /**
      * Adds match the specified range for example a grammar line.
      *
      * @param {Number} start Start offset.
      * @param {Number} length Length of the text.
      * @param {Object} data Custom data object for match.
      * @return {DomTextMatcher} Current DomTextMatcher instance.
      */
      function add(start, length, data) {
        matches.push({
          start: start,
          end: start + length,
          text: text.substr(start, length),
          data: data
        });

        return this;
      }

      /**
      * Returns a DOM range for the specified match.
      *
      * @param  {Object} match Match object to get range for.
      * @return {DOMRange} DOM Range for the specified match.
      */
      function rangeFromMatch(match) {
        var wrappers = getWrappersByIndex(indexOf(match));

        var rng = editor.dom.createRng();
        rng.setStartBefore(wrappers[0]);
        rng.setEndAfter(wrappers[wrappers.length - 1]);

        return rng;
      }

      /**
      * Replaces the specified match with the specified text.
      *
      * @param {Object} match Match object to replace.
      * @param {String} text Text to replace the match with.
      * @return {DOMRange} DOM range produced after the replace.
      */
      function replace(match, text) {
        var rng = rangeFromMatch(match);

        rng.deleteContents();

        if (text.length > 0) {
          rng.insertNode(editor.dom.doc.createTextNode(text));
        }

        return rng;
      }

      /**
      * Resets the DomTextMatcher instance. This will remove any wrapped nodes and remove any matches.
      *
      * @return {[type]} [description]
      */
      function reset() {
        matches.splice(0, matches.length);
        unwrap();

        return this;
      }

      text = getText(node);

      return {
        text: text,
        matches: matches,
        each: each,
        filter: filter,
        reset: reset,
        matchFromElement: matchFromElement,
        elementFromMatch: elementFromMatch,
        find: find,
        add: add,
        wrap: wrap,
        unwrap: unwrap,
        replace: replace,
        rangeFromMatch: rangeFromMatch,
        indexOf: indexOf
      };
    };
  }
);