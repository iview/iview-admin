"use strict";

exports.__esModule = true;
exports.shareCommentsWithSiblings = shareCommentsWithSiblings;
exports.addComment = addComment;
exports.addComments = addComments;

function shareCommentsWithSiblings() {
  if (typeof this.key === "string") return;
  var node = this.node;
  if (!node) return;
  var trailing = node.trailingComments;
  var leading = node.leadingComments;
  if (!trailing && !leading) return;
  var prev = this.getSibling(this.key - 1);
  var next = this.getSibling(this.key + 1);
  var hasPrev = Boolean(prev.node);
  var hasNext = Boolean(next.node);

  if (hasPrev && hasNext) {} else if (hasPrev) {
    prev.addComments("trailing", trailing);
  } else if (hasNext) {
    next.addComments("leading", leading);
  }
}

function addComment(type, content, line) {
  this.addComments(type, [{
    type: line ? "CommentLine" : "CommentBlock",
    value: content
  }]);
}

function addComments(type, comments) {
  if (!comments) return;
  var node = this.node;
  if (!node) return;
  var key = type + "Comments";

  if (node[key]) {
    if (type === "leading") {
      node[key] = comments.concat(node[key]);
    } else {
      node[key] = node[key].concat(comments);
    }
  } else {
    node[key] = comments;
  }
}