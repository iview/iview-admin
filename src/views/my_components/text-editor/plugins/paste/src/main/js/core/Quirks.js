/**
 * Quirks.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains various fixes for browsers. These issues can not be feature
 * detected since we have no direct control over the clipboard. However we might be able
 * to remove some of these fixes once the browsers gets updated/fixed.
 *
 * @class tinymce.pasteplugin.Quirks
 * @private
 */
define(
  'tinymce.plugins.paste.core.Quirks',
  [
    'tinymce.core.Env',
    'tinymce.core.util.Tools',
    'tinymce.plugins.paste.api.Settings',
    'tinymce.plugins.paste.core.Utils',
    'tinymce.plugins.paste.core.WordFilter'
  ],
  function (Env, Tools, Settings, Utils, WordFilter) {
    function addPreProcessFilter(editor, filterFunc) {
      editor.on('PastePreProcess', function (e) {
        e.content = filterFunc(editor, e.content, e.internal, e.wordContent);
      });
    }

    function addPostProcessFilter(editor, filterFunc) {
      editor.on('PastePostProcess', function (e) {
        filterFunc(editor, e.node);
      });
    }

    /**
     * Removes BR elements after block elements. IE9 has a nasty bug where it puts a BR element after each
     * block element when pasting from word. This removes those elements.
     *
     * This:
     *  <p>a</p><br><p>b</p>
     *
     * Becomes:
     *  <p>a</p><p>b</p>
     */
    function removeExplorerBrElementsAfterBlocks(editor, html) {
      // Only filter word specific content
      if (!WordFilter.isWordContent(html)) {
        return html;
      }

      // Produce block regexp based on the block elements in schema
      var blockElements = [];

      Tools.each(editor.schema.getBlockElements(), function (block, blockName) {
        blockElements.push(blockName);
      });

      var explorerBlocksRegExp = new RegExp(
        '(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*(<\\/?(' + blockElements.join('|') + ')[^>]*>)(?:<br>&nbsp;[\\s\\r\\n]+|<br>)*',
        'g'
      );

      // Remove BR:s from: <BLOCK>X</BLOCK><BR>
      html = Utils.filter(html, [
        [explorerBlocksRegExp, '$1']
      ]);

      // IE9 also adds an extra BR element for each soft-linefeed and it also adds a BR for each word wrap break
      html = Utils.filter(html, [
        [/<br><br>/g, '<BR><BR>'], // Replace multiple BR elements with uppercase BR to keep them intact
        [/<br>/g, ' '],            // Replace single br elements with space since they are word wrap BR:s
        [/<BR><BR>/g, '<br>']      // Replace back the double brs but into a single BR
      ]);

      return html;
    }

    /**
     * WebKit has a nasty bug where the all computed styles gets added to style attributes when copy/pasting contents.
     * This fix solves that by simply removing the whole style attribute.
     *
     * The paste_webkit_styles option can be set to specify what to keep:
     *  paste_webkit_styles: "none" // Keep no styles
     *  paste_webkit_styles: "all", // Keep all of them
     *  paste_webkit_styles: "font-weight color" // Keep specific ones
     */
    function removeWebKitStyles(editor, content, internal, isWordHtml) {
      // WordFilter has already processed styles at this point and internal doesn't need any processing
      if (isWordHtml || internal) {
        return content;
      }

      // Filter away styles that isn't matching the target node
      var webKitStyles = Settings.getWebkitStyles(editor);

      if (Settings.shouldRemoveWebKitStyles(editor) === false || webKitStyles === "all") {
        return content;
      }

      if (webKitStyles) {
        webKitStyles = webKitStyles.split(/[, ]/);
      }

      // Keep specific styles that doesn't match the current node computed style
      if (webKitStyles) {
        var dom = editor.dom, node = editor.selection.getNode();

        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, function (all, before, value, after) {
          var inputStyles = dom.parseStyle(dom.decode(value), 'span');
          var outputStyles = {};

          if (webKitStyles === "none") {
            return before + after;
          }

          for (var i = 0; i < webKitStyles.length; i++) {
            var inputValue = inputStyles[webKitStyles[i]], currentValue = dom.getStyle(node, webKitStyles[i], true);

            if (/color/.test(webKitStyles[i])) {
              inputValue = dom.toHex(inputValue);
              currentValue = dom.toHex(currentValue);
            }

            if (currentValue !== inputValue) {
              outputStyles[webKitStyles[i]] = inputValue;
            }
          }

          outputStyles = dom.serializeStyle(outputStyles, 'span');
          if (outputStyles) {
            return before + ' style="' + outputStyles + '"' + after;
          }

          return before + after;
        });
      } else {
        // Remove all external styles
        content = content.replace(/(<[^>]+) style="([^"]*)"([^>]*>)/gi, '$1$3');
      }

      // Keep internal styles
      content = content.replace(/(<[^>]+) data-mce-style="([^"]+)"([^>]*>)/gi, function (all, before, value, after) {
        return before + ' style="' + value + '"' + after;
      });

      return content;
    }

    function removeUnderlineAndFontInAnchor(editor, root) {
      editor.$('a', root).find('font,u').each(function (i, node) {
        editor.dom.remove(node, true);
      });
    }

    var setup = function (editor) {
      if (Env.webkit) {
        addPreProcessFilter(editor, removeWebKitStyles);
      }

      if (Env.ie) {
        addPreProcessFilter(editor, removeExplorerBrElementsAfterBlocks);
        addPostProcessFilter(editor, removeUnderlineAndFontInAnchor);
      }
    };

    return {
      setup: setup
    };
  }
);