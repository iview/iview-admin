(function () {

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
var register_3795 = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
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
  for (var i = 0; i < len; ++i)
    instances[i] = dem(dependencies[i]);
  var defResult = definition.apply(null, instances);
  if (defResult === undefined)
     throw 'module [' + id + '] returned undefined';
  actual.instance = defResult;
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var len = ids.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances[i] = dem(ids[i]);
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
/*jsc
["tinymce.plugins.spellchecker.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.spellchecker.alien.DetectProPlugin","tinymce.plugins.spellchecker.api.Api","tinymce.plugins.spellchecker.api.Commands","tinymce.plugins.spellchecker.api.Settings","tinymce.plugins.spellchecker.ui.Buttons","tinymce.plugins.spellchecker.ui.SuggestionsMenu","global!tinymce.util.Tools.resolve","global!window","tinymce.plugins.spellchecker.core.Actions","tinymce.core.util.Tools","global!document","tinymce.core.dom.DOMUtils","tinymce.core.ui.Factory","tinymce.core.util.URI","tinymce.core.util.XHR","tinymce.plugins.spellchecker.api.Events","tinymce.plugins.spellchecker.core.DomTextMatcher"]
jsc*/
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

defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);
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

defineGlobal("global!window", window);
/**
 * DetectProPlugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.alien.DetectProPlugin',
  [
    'global!window',
    'tinymce.core.PluginManager'
  ],
  function (window, PluginManager) {
    var hasProPlugin = function (editor) {
      // draw back if power version is requested and registered
      if (/(^|[ ,])tinymcespellchecker([, ]|$)/.test(editor.settings.plugins) && PluginManager.get('tinymcespellchecker')) {
        /*eslint no-console:0 */
        if (typeof window.console !== "undefined" && window.console.log) {
          window.console.log(
            "Spell Checker Pro is incompatible with Spell Checker plugin! " +
            "Remove 'spellchecker' from the 'plugins' option."
          );
        }
        return true;
      } else {
        return false;
      }
    };

    return {
      hasProPlugin: hasProPlugin
    };
  }
);

/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.api.Settings',
  [
  ],
  function () {
    var getLanguages = function (editor) {
      var defaultLanguages = 'English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv';
      return editor.getParam('spellchecker_languages', defaultLanguages);
    };

    var getLanguage = function (editor) {
      var defaultLanguage = editor.getParam('language', 'en');
      return editor.getParam('spellchecker_language', defaultLanguage);
    };

    var getRpcUrl = function (editor) {
      return editor.getParam('spellchecker_rpc_url');
    };

    var getSpellcheckerCallback = function (editor) {
      return editor.getParam('spellchecker_callback');
    };

    var getSpellcheckerWordcharPattern = function (editor) {
      var defaultPattern = new RegExp("[^" +
      "\\s!\"#$%&()*+,-./:;<=>?@[\\]^_{|}`" +
      "\u00a7\u00a9\u00ab\u00ae\u00b1\u00b6\u00b7\u00b8\u00bb" +
      "\u00bc\u00bd\u00be\u00bf\u00d7\u00f7\u00a4\u201d\u201c\u201e\u00a0\u2002\u2003\u2009" +
      "]+", "g");
      return editor.getParam('spellchecker_wordchar_pattern', defaultPattern);
    };

    return {
      getLanguages: getLanguages,
      getLanguage: getLanguage,
      getRpcUrl: getRpcUrl,
      getSpellcheckerCallback: getSpellcheckerCallback,
      getSpellcheckerWordcharPattern: getSpellcheckerWordcharPattern
    };
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
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.core.util.URI',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.URI');
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
  'tinymce.core.util.XHR',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.XHR');
  }
);

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
  'tinymce.plugins.spellchecker.api.Events',
  [
  ],
  function () {
    var fireSpellcheckStart = function (editor) {
      return editor.fire('SpellcheckStart');
    };

    var fireSpellcheckEnd = function (editor) {
      return editor.fire('SpellcheckEnd');
    };

    return {
      fireSpellcheckStart: fireSpellcheckStart,
      fireSpellcheckEnd: fireSpellcheckEnd
    };
  }
);
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
  'tinymce.plugins.spellchecker.core.Actions',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.util.URI',
    'tinymce.core.util.XHR',
    'tinymce.plugins.spellchecker.api.Events',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.DomTextMatcher'
  ],
  function (Tools, URI, XHR, Events, Settings, DomTextMatcher) {
    var getTextMatcher = function (editor, textMatcherState) {
      if (!textMatcherState.get()) {
        var textMatcher = new DomTextMatcher(editor.getBody(), editor);
        textMatcherState.set(textMatcher);
      }

      return textMatcherState.get();
    };

    var isEmpty = function (obj) {
      for (var name in obj) {
        return false;
      }

      return true;
    };

    var defaultSpellcheckCallback = function (editor, pluginUrl, currentLanguageState) {
      return function (method, text, doneCallback, errorCallback) {
        var data = { method: method, lang: currentLanguageState.get() }, postData = '';

        data[method === "addToDictionary" ? "word" : "text"] = text;

        Tools.each(data, function (value, key) {
          if (postData) {
            postData += '&';
          }

          postData += key + '=' + encodeURIComponent(value);
        });

        XHR.send({
          url: new URI(pluginUrl).toAbsolute(Settings.getRpcUrl(editor)),
          type: "post",
          content_type: 'application/x-www-form-urlencoded',
          data: postData,
          success: function (result) {
            result = JSON.parse(result);

            if (!result) {
              var message = editor.translate("Server response wasn't proper JSON.");
              errorCallback(message);
            } else if (result.error) {
              errorCallback(result.error);
            } else {
              doneCallback(result);
            }
          },
          error: function () {
            var message = editor.translate("The spelling service was not found: (") +
              Settings.getRpcUrl(editor) +
              editor.translate(")");
            errorCallback(message);
          }
        });
      };
    };

    var sendRpcCall = function (editor, pluginUrl, currentLanguageState, name, data, successCallback, errorCallback) {
      var userSpellcheckCallback = Settings.getSpellcheckerCallback(editor);
      var spellCheckCallback = userSpellcheckCallback ? userSpellcheckCallback : defaultSpellcheckCallback(editor, pluginUrl, currentLanguageState);
      spellCheckCallback.call(editor.plugins.spellchecker, name, data, successCallback, errorCallback);
    };

    var spellcheck = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      if (finish(editor, startedState, textMatcherState)) {
        return;
      }

      var errorCallback = function (message) {
        editor.notificationManager.open({ text: message, type: 'error' });
        editor.setProgressState(false);
        finish(editor, startedState, textMatcherState);
      };

      var successCallback = function (data) {
        markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };

      editor.setProgressState(true);
      sendRpcCall(editor, pluginUrl, currentLanguageState, "spellcheck", getTextMatcher(editor, textMatcherState).text, successCallback, errorCallback);
      editor.focus();
    };

    var checkIfFinished = function (editor, startedState, textMatcherState) {
      if (!editor.dom.select('span.mce-spellchecker-word').length) {
        finish(editor, startedState, textMatcherState);
      }
    };

    var addToDictionary = function (editor, pluginUrl, startedState, textMatcherState, word, spans) {
      editor.setProgressState(true);

      sendRpcCall(editor, pluginUrl, 'addToDictionary', word, function () {
        editor.setProgressState(false);
        editor.dom.remove(spans, true);
        checkIfFinished(editor, startedState, textMatcherState);
      }, function (message) {
        editor.notificationManager.open({ text: message, type: 'error' });
        editor.setProgressState(false);
      });
    };

    var ignoreWord = function (editor, startedState, textMatcherState, word, spans, all) {
      editor.selection.collapse();

      if (all) {
        Tools.each(editor.dom.select('span.mce-spellchecker-word'), function (span) {
          if (span.getAttribute('data-mce-word') === word) {
            editor.dom.remove(span, true);
          }
        });
      } else {
        editor.dom.remove(spans, true);
      }

      checkIfFinished(editor, startedState, textMatcherState);
    };

    var finish = function (editor, startedState, textMatcherState) {
      getTextMatcher(editor, textMatcherState).reset();
      textMatcherState.set(null);

      if (startedState.get()) {
        startedState.set(false);
        Events.fireSpellcheckEnd(editor);
        return true;
      }
    };

    var getElmIndex = function (elm) {
      var value = elm.getAttribute('data-mce-index');

      if (typeof value === "number") {
        return "" + value;
      }

      return value;
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

    var markErrors = function (editor, startedState, textMatcherState, lastSuggestionsState, data) {
      var suggestions, hasDictionarySupport;

      if (data.words) {
        hasDictionarySupport = !!data.dictionary;
        suggestions = data.words;
      } else {
        // Fallback to old format
        suggestions = data;
      }

      editor.setProgressState(false);

      if (isEmpty(suggestions)) {
        var message = editor.translate('No misspellings found.');
        editor.notificationManager.open({ text: message, type: 'info' });
        startedState.set(false);
        return;
      }

      lastSuggestionsState.set({
        suggestions: suggestions,
        hasDictionarySupport: hasDictionarySupport
      });

      getTextMatcher(editor, textMatcherState).find(Settings.getSpellcheckerWordcharPattern(editor)).filter(function (match) {
        return !!suggestions[match.text];
      }).wrap(function (match) {
        return editor.dom.create('span', {
          "class": 'mce-spellchecker-word',
          "data-mce-bogus": 1,
          "data-mce-word": match.text
        });
      });

      startedState.set(true);
      Events.fireSpellcheckStart(editor);
    };

    return {
      spellcheck: spellcheck,
      checkIfFinished: checkIfFinished,
      addToDictionary: addToDictionary,
      ignoreWord: ignoreWord,
      findSpansByIndex: findSpansByIndex,
      getElmIndex: getElmIndex,
      markErrors: markErrors
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
  'tinymce.plugins.spellchecker.api.Api',
  [
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (Settings, Actions) {
    var get = function (editor, startedState, lastSuggestionsState, textMatcherState, url) {
      var getLanguage = function () {
        return Settings.getLanguage(editor);
      };

      var getWordCharPattern = function () {
        return Settings.getSpellcheckerWordcharPattern(editor);
      };

      var markErrors = function (data) {
        Actions.markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };

      var getTextMatcher = function () {
        return textMatcherState.get();
      };

      return {
        getTextMatcher: getTextMatcher,
        getWordCharPattern: getWordCharPattern,
        markErrors: markErrors,
        getLanguage: getLanguage
      };
    };

    return {
      get: get
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
  'tinymce.plugins.spellchecker.api.Commands',
  [
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (Actions) {
    var register = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      editor.addCommand('mceSpellCheck', function () {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
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
  'tinymce.plugins.spellchecker.ui.Buttons',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (Tools, Settings, Actions) {
    var buildMenuItems = function (listName, languageValues) {
      var items = [];

      Tools.each(languageValues, function (languageValue) {
        items.push({
          selectable: true,
          text: languageValue.name,
          data: languageValue.value
        });
      });

      return items;
    };

    var updateSelection = function (editor) {
      return function (e) {
        var selectedLanguage = Settings.getLanguage(editor);

        e.control.items().each(function (ctrl) {
          ctrl.active(ctrl.settings.data === selectedLanguage);
        });
      };
    };

    var getItems = function (editor) {
      return Tools.map(Settings.getLanguages(editor).split(','), function (langPair) {
        langPair = langPair.split('=');

        return {
          name: langPair[0],
          value: langPair[1]
        };
      });
    };

    var register = function (editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState) {
      var languageMenuItems = buildMenuItems('Language', getItems(editor));
      var startSpellchecking = function () {
        Actions.spellcheck(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
      };

      var buttonArgs = {
        tooltip: 'Spellcheck',
        onclick: startSpellchecking,
        onPostRender: function (e) {
          var ctrl = e.control;

          editor.on('SpellcheckStart SpellcheckEnd', function () {
            ctrl.active(startedState.get());
          });
        }
      };

      if (languageMenuItems.length > 1) {
        buttonArgs.type = 'splitbutton';
        buttonArgs.menu = languageMenuItems;
        buttonArgs.onshow = updateSelection(editor);
        buttonArgs.onselect = function (e) {
          currentLanguageState.set(e.control.settings.data);
        };
      }

      editor.addButton('spellchecker', buttonArgs);

      editor.addMenuItem('spellchecker', {
        text: 'Spellcheck',
        context: 'tools',
        onclick: startSpellchecking,
        selectable: true,
        onPostRender: function () {
          var self = this;

          self.active(startedState.get());

          editor.on('SpellcheckStart SpellcheckEnd', function () {
            self.active(startedState.get());
          });
        }
      });
    };

    return {
      register: register
    };
  }
);
defineGlobal("global!document", document);
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
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
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
  'tinymce.core.ui.Factory',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.ui.Factory');
  }
);

/**
 * SuggestionsMenu.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.ui.SuggestionsMenu',
  [
    'global!document',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (document, DOMUtils, Factory, Tools, Settings, Actions) {
    var suggestionsMenu;

    var showSuggestions = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, word, spans) {
      var items = [], suggestions = lastSuggestionsState.get().suggestions[word];

      Tools.each(suggestions, function (suggestion) {
        items.push({
          text: suggestion,
          onclick: function () {
            editor.insertContent(editor.dom.encode(suggestion));
            editor.dom.remove(spans);
            Actions.checkIfFinished(editor, startedState, textMatcherState);
          }
        });
      });

      items.push({ text: '-' });

      var hasDictionarySupport = lastSuggestionsState.get().hasDictionarySupport;
      if (hasDictionarySupport) {
        items.push({
          text: 'Add to Dictionary', onclick: function () {
            Actions.addToDictionary(editor, pluginUrl, startedState, textMatcherState, word, spans);
          }
        });
      }

      items.push.apply(items, [
        {
          text: 'Ignore', onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans);
          }
        },

        {
          text: 'Ignore all', onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans, true);
          }
        }
      ]);

      // Render menu
      suggestionsMenu = Factory.create('menu', {
        items: items,
        context: 'contextmenu',
        onautohide: function (e) {
          if (e.target.className.indexOf('spellchecker') !== -1) {
            e.preventDefault();
          }
        },
        onhide: function () {
          suggestionsMenu.remove();
          suggestionsMenu = null;
        }
      });

      suggestionsMenu.renderTo(document.body);

      // Position menu
      var pos = DOMUtils.DOM.getPos(editor.getContentAreaContainer());
      var targetPos = editor.dom.getPos(spans[0]);
      var root = editor.dom.getRoot();

      // Adjust targetPos for scrolling in the editor
      if (root.nodeName === 'BODY') {
        targetPos.x -= root.ownerDocument.documentElement.scrollLeft || root.scrollLeft;
        targetPos.y -= root.ownerDocument.documentElement.scrollTop || root.scrollTop;
      } else {
        targetPos.x -= root.scrollLeft;
        targetPos.y -= root.scrollTop;
      }

      pos.x += targetPos.x;
      pos.y += targetPos.y;

      suggestionsMenu.moveTo(pos.x, pos.y + spans[0].offsetHeight);
    };

    var setup = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState) {
      editor.on('click', function (e) {
        var target = e.target;

        if (target.className === "mce-spellchecker-word") {
          e.preventDefault();

          var spans = Actions.findSpansByIndex(editor, Actions.getElmIndex(target));

          if (spans.length > 0) {
            var rng = editor.dom.createRng();
            rng.setStartBefore(spans[0]);
            rng.setEndAfter(spans[spans.length - 1]);
            editor.selection.setRng(rng);
            showSuggestions(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, target.getAttribute('data-mce-word'), spans);
          }
        }
      });
    };

    return {
      setup: setup
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
  'tinymce.plugins.spellchecker.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.spellchecker.alien.DetectProPlugin',
    'tinymce.plugins.spellchecker.api.Api',
    'tinymce.plugins.spellchecker.api.Commands',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.ui.Buttons',
    'tinymce.plugins.spellchecker.ui.SuggestionsMenu'
  ],
  function (Cell, PluginManager, DetectProPlugin, Api, Commands, Settings, Buttons, SuggestionsMenu) {
    PluginManager.add('spellchecker', function (editor, pluginUrl) {
      var startedState = Cell(false);
      var currentLanguageState = Cell(Settings.getLanguage(editor));
      var textMatcherState = Cell(null);
      var lastSuggestionsState = Cell({});

      if (DetectProPlugin.hasProPlugin(editor) === false) {
        Buttons.register(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState);
        SuggestionsMenu.setup(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState);
        Commands.register(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
      }

      return Api.get(editor, startedState, lastSuggestionsState, textMatcherState, pluginUrl);
    });

    return function () { };
  }
);
dem('tinymce.plugins.spellchecker.Plugin')();
})();
