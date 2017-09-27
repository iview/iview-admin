/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contails various utility functions for the paste plugin.
 *
 * @class tinymce.pasteplugin.Utils
 */
define(
  'tinymce.plugins.paste.core.Utils',
  [
    'global!navigator',
    'tinymce.core.html.DomParser',
    'tinymce.core.html.Schema',
    'tinymce.core.util.Tools'
  ],
  function (navigator, DomParser, Schema, Tools) {
    function filter(content, items) {
      Tools.each(items, function (v) {
        if (v.constructor === RegExp) {
          content = content.replace(v, '');
        } else {
          content = content.replace(v[0], v[1]);
        }
      });

      return content;
    }

    /**
     * Gets the innerText of the specified element. It will handle edge cases
     * and works better than textContent on Gecko.
     *
     * @param {String} html HTML string to get text from.
     * @return {String} String of text with line feeds.
     */
    function innerText(html) {
      var schema = new Schema(), domParser = new DomParser({}, schema), text = '';
      var shortEndedElements = schema.getShortEndedElements();
      var ignoreElements = Tools.makeMap('script noscript style textarea video audio iframe object', ' ');
      var blockElements = schema.getBlockElements();

      function walk(node) {
        var name = node.name, currentNode = node;

        if (name === 'br') {
          text += '\n';
          return;
        }

        // img/input/hr
        if (shortEndedElements[name]) {
          text += ' ';
        }

        // Ingore script, video contents
        if (ignoreElements[name]) {
          text += ' ';
          return;
        }

        if (node.type === 3) {
          text += node.value;
        }

        // Walk all children
        if (!node.shortEnded) {
          if ((node = node.firstChild)) {
            do {
              walk(node);
            } while ((node = node.next));
          }
        }

        // Add \n or \n\n for blocks or P
        if (blockElements[name] && currentNode.next) {
          text += '\n';

          if (name === 'p') {
            text += '\n';
          }
        }
      }

      html = filter(html, [
        /<!\[[^\]]+\]>/g // Conditional comments
      ]);

      walk(domParser.parse(html));

      return text;
    }

    /**
     * Trims the specified HTML by removing all WebKit fragments, all elements wrapping the body trailing BR elements etc.
     *
     * @param {String} html Html string to trim contents on.
     * @return {String} Html contents that got trimmed.
     */
    function trimHtml(html) {
      function trimSpaces(all, s1, s2) {
        // WebKit &nbsp; meant to preserve multiple spaces but instead inserted around all inline tags,
        // including the spans with inline styles created on paste
        if (!s1 && !s2) {
          return ' ';
        }

        return '\u00a0';
      }

      html = filter(html, [
        /^[\s\S]*<body[^>]*>\s*|\s*<\/body[^>]*>[\s\S]*$/ig, // Remove anything but the contents within the BODY element
        /<!--StartFragment-->|<!--EndFragment-->/g, // Inner fragments (tables from excel on mac)
        [/( ?)<span class="Apple-converted-space">\u00a0<\/span>( ?)/g, trimSpaces],
        /<br class="Apple-interchange-newline">/g,
        /<br>$/i // Trailing BR elements
      ]);

      return html;
    }

    // TODO: Should be in some global class
    function createIdGenerator(prefix) {
      var count = 0;

      return function () {
        return prefix + (count++);
      };
    }

    var isMsEdge = function () {
      return navigator.userAgent.indexOf(' Edge/') !== -1;
    };

    return {
      filter: filter,
      innerText: innerText,
      trimHtml: trimHtml,
      createIdGenerator: createIdGenerator,
      isMsEdge: isMsEdge
    };
  }
);
