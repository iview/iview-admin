/**
 * Nodes.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualchars.core.Nodes',
  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'tinymce.plugins.visualchars.core.Data',
    'tinymce.plugins.visualchars.core.Html'
  ],
  function (Arr, Element, Node, Data, Html) {
    var isMatch = function (n) {
      return Node.isText(n) &&
        Node.value(n) !== undefined &&
        Data.regExp.test(Node.value(n));
    };

    // inlined sugars PredicateFilter.descendants for file size
    var filterDescendants = function (scope, predicate) {
      var result = [];
      var dom = scope.dom();
      var children = Arr.map(dom.childNodes, Element.fromDom);

      Arr.each(children, function (x) {
        if (predicate(x)) {
          result = result.concat([ x ]);
        }
        result = result.concat(filterDescendants(x, predicate));
      });
      return result;
    };

    var findParentElm = function (elm, rootElm) {
      while (elm.parentNode) {
        if (elm.parentNode === rootElm) {
          return elm;
        }
        elm = elm.parentNode;
      }
    };

    var replaceWithSpans = function (html) {
      return html.replace(Data.regExpGlobal, Html.wrapCharWithSpan);
    };

    return {
      isMatch: isMatch,
      filterDescendants: filterDescendants,
      findParentElm: findParentElm,
      replaceWithSpans: replaceWithSpans
    };
  }
);