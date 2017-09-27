/**
 * Toc.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.toc.core.Toc',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.util.I18n',
    'tinymce.core.util.Tools',
    'tinymce.plugins.toc.api.Settings',
    'tinymce.plugins.toc.core.Guid'
  ],
  function (DOMUtils, I18n, Tools, Settings, Guid) {
    var tocId = Guid.create('mcetoc_');

    var generateSelector = function generateSelector(depth) {
      var i, selector = [];
      for (i = 1; i <= depth; i++) {
        selector.push('h' + i);
      }
      return selector.join(',');
    };

    var hasHeaders = function (editor) {
      return prepareHeaders(editor).length > 0;
    };

    var prepareHeaders = function (editor) {
      var tocClass = Settings.getTocClass(editor);
      var headerTag = Settings.getTocHeader(editor);
      var selector = generateSelector(Settings.getTocDepth(editor));
      var headers = editor.$(selector);

      // if headerTag is one of h1-9, we need to filter it out from the set
      if (headers.length && /^h[1-9]$/i.test(headerTag)) {
        headers = headers.filter(function (i, el) {
          return !editor.dom.hasClass(el.parentNode, tocClass);
        });
      }

      return Tools.map(headers, function (h) {
        if (!h.id) {
          h.id = tocId();
        }
        return {
          id: h.id,
          level: parseInt(h.nodeName.replace(/^H/i, ''), 10),
          title: editor.$.text(h)
        };
      });
    };

    var getMinLevel = function (headers) {
      var i, minLevel = 9;

      for (i = 0; i < headers.length; i++) {
        if (headers[i].level < minLevel) {
          minLevel = headers[i].level;
        }

        // do not proceed if we have reached absolute minimum
        if (minLevel === 1) {
          return minLevel;
        }
      }
      return minLevel;
    };

    var generateTitle = function (tag, title) {
      var openTag = '<' + tag + ' contenteditable="true">';
      var closeTag = '</' + tag + '>';
      return openTag + DOMUtils.DOM.encode(title) + closeTag;
    };

    var generateTocHtml = function (editor) {
      var html = generateTocContentHtml(editor);
      return '<div class="' + editor.dom.encode(Settings.getTocClass(editor)) + '" contenteditable="false">' + html + '</div>';
    };

    var generateTocContentHtml = function (editor) {
      var html = '';
      var headers = prepareHeaders(editor);
      var prevLevel = getMinLevel(headers) - 1;
      var i, ii, h, nextLevel;

      if (!headers.length) {
        return '';
      }

      html += generateTitle(Settings.getTocHeader(editor), I18n.translate('Table of Contents'));

      for (i = 0; i < headers.length; i++) {
        h = headers[i];
        nextLevel = headers[i + 1] && headers[i + 1].level;

        if (prevLevel === h.level) {
          html += '<li>';
        } else {
          for (ii = prevLevel; ii < h.level; ii++) {
            html += '<ul><li>';
          }
        }

        html += '<a href="#' + h.id + '">' + h.title + '</a>';

        if (nextLevel === h.level || !nextLevel) {
          html += '</li>';

          if (!nextLevel) {
            html += '</ul>';
          }
        } else {
          for (ii = h.level; ii > nextLevel; ii--) {
            html += '</li></ul><li>';
          }
        }

        prevLevel = h.level;
      }

      return html;
    };

    var isEmptyOrOffscren = function (editor, nodes) {
      return !nodes.length || editor.dom.getParents(nodes[0], '.mce-offscreen-selection').length > 0;
    };

    var insertToc = function (editor) {
      var tocClass = Settings.getTocClass(editor);
      var $tocElm = editor.$('.' + tocClass);

      if (isEmptyOrOffscren(editor, $tocElm)) {
        editor.insertContent(generateTocHtml(editor));
      } else {
        updateToc(editor);
      }
    };

    var updateToc = function (editor) {
      var tocClass = Settings.getTocClass(editor);
      var $tocElm = editor.$('.' + tocClass);

      if ($tocElm.length) {
        editor.undoManager.transact(function () {
          $tocElm.html(generateTocContentHtml(editor));
        });
      }
    };

    return {
      hasHeaders: hasHeaders,
      insertToc: insertToc,
      updateToc: updateToc
    };
  }
);