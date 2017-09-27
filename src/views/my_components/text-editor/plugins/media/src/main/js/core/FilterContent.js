/**
 * FilterContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.FilterContent',
  [
    'tinymce.core.html.Node',
    'tinymce.core.util.Tools',
    'tinymce.plugins.media.core.Nodes',
    'tinymce.plugins.media.core.Sanitize'
  ],
  function (Node, Tools, Nodes, Sanitize) {
    var setup = function (editor) {
      editor.on('preInit', function () {
        // Make sure that any messy HTML is retained inside these
        var specialElements = editor.schema.getSpecialElements();
        Tools.each('video audio iframe object'.split(' '), function (name) {
          specialElements[name] = new RegExp('<\/' + name + '[^>]*>', 'gi');
        });

        // Allow elements
        //editor.schema.addValidElements(
        //  'object[id|style|width|height|classid|codebase|*],embed[id|style|width|height|type|src|*],video[*],audio[*]'
        //);

        // Set allowFullscreen attribs as boolean
        var boolAttrs = editor.schema.getBoolAttrs();
        Tools.each('webkitallowfullscreen mozallowfullscreen allowfullscreen'.split(' '), function (name) {
          boolAttrs[name] = {};
        });

        // Converts iframe, video etc into placeholder images
        editor.parser.addNodeFilter('iframe,video,audio,object,embed,script',
          Nodes.placeHolderConverter(editor));

        // Replaces placeholder images with real elements for video, object, iframe etc
        editor.serializer.addAttributeFilter('data-mce-object', function (nodes, name) {
          var i = nodes.length;
          var node;
          var realElm;
          var ai;
          var attribs;
          var innerHtml;
          var innerNode;
          var realElmName;
          var className;

          while (i--) {
            node = nodes[i];
            if (!node.parent) {
              continue;
            }

            realElmName = node.attr(name);
            realElm = new Node(realElmName, 1);

            // Add width/height to everything but audio
            if (realElmName !== "audio" && realElmName !== "script") {
              className = node.attr('class');
              if (className && className.indexOf('mce-preview-object') !== -1) {
                realElm.attr({
                  width: node.firstChild.attr('width'),
                  height: node.firstChild.attr('height')
                });
              } else {
                realElm.attr({
                  width: node.attr('width'),
                  height: node.attr('height')
                });
              }
            }

            realElm.attr({
              style: node.attr('style')
            });

            // Unprefix all placeholder attributes
            attribs = node.attributes;
            ai = attribs.length;
            while (ai--) {
              var attrName = attribs[ai].name;

              if (attrName.indexOf('data-mce-p-') === 0) {
                realElm.attr(attrName.substr(11), attribs[ai].value);
              }
            }

            if (realElmName === "script") {
              realElm.attr('type', 'text/javascript');
            }

            // Inject innerhtml
            innerHtml = node.attr('data-mce-html');
            if (innerHtml) {
              innerNode = new Node('#text', 3);
              innerNode.raw = true;
              innerNode.value = Sanitize.sanitize(editor, unescape(innerHtml));
              realElm.append(innerNode);
            }

            node.replace(realElm);
          }
        });
      });

      editor.on('setContent', function () {
        // TODO: This shouldn't be needed there should be a way to mark bogus
        // elements so they are never removed except external save
        editor.$('span.mce-preview-object').each(function (index, elm) {
          var $elm = editor.$(elm);

          if ($elm.find('span.mce-shim', elm).length === 0) {
            $elm.append('<span class="mce-shim"></span>');
          }
        });
      });
    };

    return {
      setup: setup
    };
  }
);

