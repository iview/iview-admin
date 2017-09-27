/**
 * NormalizeLists.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.core.NormalizeLists',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.util.Tools',
    'tinymce.plugins.lists.core.NodeType'
  ],
  function (DOMUtils, Tools, NodeType) {
    var DOM = DOMUtils.DOM;

    var normalizeList = function (dom, ul) {
      var sibling, parentNode = ul.parentNode;

      // Move UL/OL to previous LI if it's the only child of a LI
      if (parentNode.nodeName === 'LI' && parentNode.firstChild === ul) {
        sibling = parentNode.previousSibling;
        if (sibling && sibling.nodeName === 'LI') {
          sibling.appendChild(ul);

          if (NodeType.isEmpty(dom, parentNode)) {
            DOM.remove(parentNode);
          }
        } else {
          DOM.setStyle(parentNode, 'listStyleType', 'none');
        }
      }

      // Append OL/UL to previous LI if it's in a parent OL/UL i.e. old HTML4
      if (NodeType.isListNode(parentNode)) {
        sibling = parentNode.previousSibling;
        if (sibling && sibling.nodeName === 'LI') {
          sibling.appendChild(ul);
        }
      }
    };

    var normalizeLists = function (dom, element) {
      Tools.each(Tools.grep(dom.select('ol,ul', element)), function (ul) {
        normalizeList(dom, ul);
      });
    };

    return {
      normalizeList: normalizeList,
      normalizeLists: normalizeLists
    };
  }
);

