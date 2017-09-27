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
  'tinymce.plugins.media.core.Nodes',
  [
    'tinymce.core.Env',
    'tinymce.core.html.Node',
    'tinymce.plugins.media.api.Settings',
    'tinymce.plugins.media.core.Sanitize',
    'tinymce.plugins.media.core.VideoScript'
  ],
  function (Env, Node, Settings, Sanitize, VideoScript) {
    var createPlaceholderNode = function (editor, node) {
      var placeHolder;
      var name = node.name;

      placeHolder = new Node('img', 1);
      placeHolder.shortEnded = true;

      retainAttributesAndInnerHtml(editor, node, placeHolder);

      placeHolder.attr({
        width: node.attr('width') || "300",
        height: node.attr('height') || (name === "audio" ? "30" : "150"),
        style: node.attr('style'),
        src: Env.transparentSrc,
        "data-mce-object": name,
        "class": "mce-object mce-object-" + name
      });

      return placeHolder;
    };

    var createPreviewIframeNode = function (editor, node) {
      var previewWrapper;
      var previewNode;
      var shimNode;
      var name = node.name;

      previewWrapper = new Node('span', 1);
      previewWrapper.attr({
        contentEditable: 'false',
        style: node.attr('style'),
        "data-mce-object": name,
        "class": "mce-preview-object mce-object-" + name
      });

      retainAttributesAndInnerHtml(editor, node, previewWrapper);

      previewNode = new Node(name, 1);
      previewNode.attr({
        src: node.attr('src'),
        allowfullscreen: node.attr('allowfullscreen'),
        width: node.attr('width') || "300",
        height: node.attr('height') || (name === "audio" ? "30" : "150"),
        frameborder: '0'
      });

      shimNode = new Node('span', 1);
      shimNode.attr('class', 'mce-shim');

      previewWrapper.append(previewNode);
      previewWrapper.append(shimNode);

      return previewWrapper;
    };

    var retainAttributesAndInnerHtml = function (editor, sourceNode, targetNode) {
      var attrName;
      var attrValue;
      var attribs;
      var ai;
      var innerHtml;

      // Prefix all attributes except width, height and style since we
      // will add these to the placeholder
      attribs = sourceNode.attributes;
      ai = attribs.length;
      while (ai--) {
        attrName = attribs[ai].name;
        attrValue = attribs[ai].value;

        if (attrName !== "width" && attrName !== "height" && attrName !== "style") {
          if (attrName === "data" || attrName === "src") {
            attrValue = editor.convertURL(attrValue, attrName);
          }

          targetNode.attr('data-mce-p-' + attrName, attrValue);
        }
      }

      // Place the inner HTML contents inside an escaped attribute
      // This enables us to copy/paste the fake object
      innerHtml = sourceNode.firstChild && sourceNode.firstChild.value;
      if (innerHtml) {
        targetNode.attr("data-mce-html", escape(Sanitize.sanitize(editor, innerHtml)));
        targetNode.firstChild = null;
      }
    };

    var isWithinEphoxEmbed = function (node) {
      while ((node = node.parent)) {
        if (node.attr('data-ephox-embed-iri')) {
          return true;
        }
      }

      return false;
    };

    var placeHolderConverter = function (editor) {
      return function (nodes) {
        var i = nodes.length;
        var node;
        var videoScript;

        while (i--) {
          node = nodes[i];
          if (!node.parent) {
            continue;
          }

          if (node.parent.attr('data-mce-object')) {
            continue;
          }

          if (node.name === 'script') {
            videoScript = VideoScript.getVideoScriptMatch(Settings.getScripts(editor), node.attr('src'));
            if (!videoScript) {
              continue;
            }
          }

          if (videoScript) {
            if (videoScript.width) {
              node.attr('width', videoScript.width.toString());
            }

            if (videoScript.height) {
              node.attr('height', videoScript.height.toString());
            }
          }

          if (node.name === 'iframe' && Settings.hasLiveEmbeds(editor) && Env.ceFalse) {
            if (!isWithinEphoxEmbed(node)) {
              node.replace(createPreviewIframeNode(editor, node));
            }
          } else {
            if (!isWithinEphoxEmbed(node)) {
              node.replace(createPlaceholderNode(editor, node));
            }
          }
        }
      };
    };

    return {
      createPreviewIframeNode: createPreviewIframeNode,
      createPlaceholderNode: createPlaceholderNode,
      placeHolderConverter: placeHolderConverter
    };
  }
);