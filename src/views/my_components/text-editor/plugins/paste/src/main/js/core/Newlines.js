/**
 * Newlines.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Newlines class contains utilities to convert newlines (\n or \r\n) tp BRs or to a combination of the specified block element and BRs
 *
 * @class tinymce.Newlines
 * @private
 */
define(
  'tinymce.plugins.paste.core.Newlines',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.html.Entities'
  ],
  function (Tools, Entities) {

    var isPlainText = function (text) {
      // so basically any tag that is not one of the "p, div, span, br", or is one of them, but is followed
      // by some additional characters qualifies the text as not a plain text (having some HTML tags)
      // <span style="white-space:pre"> and <br /> are added as separate exceptions to the rule
      return !/<(?:\/?(?!(?:div|p|br|span)>)\w+|(?:(?!(?:span style="white-space:\s?pre;?">)|br\s?\/>))\w+\s[^>]+)>/i.test(text);
    };


    var toBRs = function (text) {
      return text.replace(/\r?\n/g, '<br>');
    };


    var openContainer = function (rootTag, rootAttrs) {
      var key, attrs = [];
      var tag = '<' + rootTag;

      if (typeof rootAttrs === 'object') {
        for (key in rootAttrs) {
          if (rootAttrs.hasOwnProperty(key)) {
            attrs.push(key + '="' + Entities.encodeAllRaw(rootAttrs[key]) + '"');
          }
        }

        if (attrs.length) {
          tag += ' ' + attrs.join(' ');
        }
      }
      return tag + '>';
    };


    var toBlockElements = function (text, rootTag, rootAttrs) {
      var blocks = text.split(/\n\n/);
      var tagOpen = openContainer(rootTag, rootAttrs);
      var tagClose = '</' + rootTag + '>';

      var paragraphs = Tools.map(blocks, function (p) {
        return p.split(/\n/).join('<br />');
      });

      var stitch = function (p) {
        return tagOpen + p + tagClose;
      };

      return paragraphs.length === 1 ? paragraphs[0] : Tools.map(paragraphs, stitch).join('');
    };


    var convert = function (text, rootTag, rootAttrs) {
      return rootTag ? toBlockElements(text, rootTag, rootAttrs) : toBRs(text);
    };


    return {
      isPlainText: isPlainText,
      convert: convert,
      toBRs: toBRs,
      toBlockElements: toBlockElements
    };
  }
);