/**
 * Range.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.core.Range',
  [
    'tinymce.core.dom.RangeUtils',
    'tinymce.plugins.lists.core.NodeType'
  ],
  function (RangeUtils, NodeType) {
    var getNormalizedEndPoint = function (container, offset) {
      var node = RangeUtils.getNode(container, offset);

      if (NodeType.isListItemNode(container) && NodeType.isTextNode(node)) {
        var textNodeOffset = offset >= container.childNodes.length ? node.data.length : 0;
        return { container: node, offset: textNodeOffset };
      }

      return { container: container, offset: offset };
    };

    var normalizeRange = function (rng) {
      var outRng = rng.cloneRange();

      var rangeStart = getNormalizedEndPoint(rng.startContainer, rng.startOffset);
      outRng.setStart(rangeStart.container, rangeStart.offset);

      var rangeEnd = getNormalizedEndPoint(rng.endContainer, rng.endOffset);
      outRng.setEnd(rangeEnd.container, rangeEnd.offset);

      return outRng;
    };

    return {
      getNormalizedEndPoint: getNormalizedEndPoint,
      normalizeRange: normalizeRange
    };
  }
);

