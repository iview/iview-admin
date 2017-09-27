/**
 * VisualChars.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.visualchars.core.VisualChars',
  [
    'tinymce.plugins.visualchars.core.Data',
    'tinymce.plugins.visualchars.core.Nodes',
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node'
  ],
  function (Data, Nodes, Arr, Element, Node) {
    var show = function (editor, rootElm) {
      var node, div;
      var nodeList = Nodes.filterDescendants(Element.fromDom(rootElm), Nodes.isMatch);

      Arr.each(nodeList, function (n) {
        var withSpans = Nodes.replaceWithSpans(Node.value(n));

        div = editor.dom.create('div', null, withSpans);
        while ((node = div.lastChild)) {
          editor.dom.insertAfter(node, n.dom());
        }

        editor.dom.remove(n.dom());
      });
    };

    var hide = function (editor, body) {
      var nodeList = editor.dom.select(Data.selector, body);

      Arr.each(nodeList, function (node) {
        editor.dom.remove(node, 1);
      });
    };

    var toggle = function (editor) {
      var body = editor.getBody();
      var bookmark = editor.selection.getBookmark();
      var parentNode = Nodes.findParentElm(editor.selection.getNode(), body);

      // if user does select all the parentNode will be undefined
      parentNode = parentNode !== undefined ? parentNode : body;

      hide(editor, parentNode);
      show(editor, parentNode);

      editor.selection.moveToBookmark(bookmark);
    };

    return {
      show: show,
      hide: hide,
      toggle: toggle
    };
  }
);