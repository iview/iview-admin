/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.link.core.Utils',
  [
    'global!RegExp',
    'tinymce.core.util.Tools',
    'tinymce.plugins.link.api.Settings'
  ],
  function (RegExp, Tools, Settings) {
    var toggleTargetRules = function (rel, isUnsafe) {
      var rules = ['noopener'];
      var newRel = rel ? rel.split(/\s+/) : [];

      var toString = function (rel) {
        return Tools.trim(rel.sort().join(' '));
      };

      var addTargetRules = function (rel) {
        rel = removeTargetRules(rel);
        return rel.length ? rel.concat(rules) : rules;
      };

      var removeTargetRules = function (rel) {
        return rel.filter(function (val) {
          return Tools.inArray(rules, val) === -1;
        });
      };

      newRel = isUnsafe ? addTargetRules(newRel) : removeTargetRules(newRel);
      return newRel.length ? toString(newRel) : null;
    };

    var trimCaretContainers = function (text) {
      return text.replace(/\uFEFF/g, '');
    };

    var getAnchorElement = function (editor, selectedElm) {
      selectedElm = selectedElm || editor.selection.getStart();
      if (isImageFigure(selectedElm)) {
        // for an image conained in a figure we look for a link inside the selected element
        return editor.dom.select('a[href]', selectedElm)[0];
      } else {
        return editor.dom.getParent(selectedElm, 'a[href]');
      }
    };

    var getAnchorText = function (selection, anchorElm) {
      var text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : selection.getContent({ format: 'text' });
      return trimCaretContainers(text);
    };

    var isLink = function (elm) {
      return elm && elm.nodeName === 'A' && elm.href;
    };

    var hasLinks = function (elements) {
      return Tools.grep(elements, isLink).length > 0;
    };

    var isOnlyTextSelected = function (html) {
      // Partial html and not a fully selected anchor element
      if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') === -1)) {
        return false;
      }

      return true;
    };

    var isImageFigure = function (node) {
      return node && node.nodeName === 'FIGURE' && /\bimage\b/i.test(node.className);
    };

    var link = function (editor, attachState) {
      return function (data) {
        editor.undoManager.transact(function () {
          var selectedElm = editor.selection.getNode();
          var anchorElm = getAnchorElement(editor, selectedElm);

          var linkAttrs = {
            href: data.href,
            target: data.target ? data.target : null,
            rel: data.rel ? data.rel : null,
            "class": data["class"] ? data["class"] : null,
            title: data.title ? data.title : null
          };

          if (!Settings.hasRelList(editor.settings) && Settings.allowUnsafeLinkTarget(editor.settings) === false) {
            linkAttrs.rel = toggleTargetRules(linkAttrs.rel, linkAttrs.target === '_blank');
          }

          if (data.href === attachState.href) {
            attachState.attach();
            attachState = {};
          }

          if (anchorElm) {
            editor.focus();

            if (data.hasOwnProperty('text')) {
              if ("innerText" in anchorElm) {
                anchorElm.innerText = data.text;
              } else {
                anchorElm.textContent = data.text;
              }
            }

            editor.dom.setAttribs(anchorElm, linkAttrs);

            editor.selection.select(anchorElm);
            editor.undoManager.add();
          } else {
            if (isImageFigure(selectedElm)) {
              linkImageFigure(editor, selectedElm, linkAttrs);
            } else if (data.hasOwnProperty('text')) {
              editor.insertContent(editor.dom.createHTML('a', linkAttrs, editor.dom.encode(data.text)));
            } else {
              editor.execCommand('mceInsertLink', false, linkAttrs);
            }
          }
        });
      };
    };

    var unlink = function (editor) {
      return function () {
        editor.undoManager.transact(function () {
          var node = editor.selection.getNode();
          if (isImageFigure(node)) {
            unlinkImageFigure(editor, node);
          } else {
            editor.execCommand('unlink');
          }
        });
      };
    };

    var unlinkImageFigure = function (editor, fig) {
      var a, img;
      img = editor.dom.select('img', fig)[0];
      if (img) {
        a = editor.dom.getParents(img, 'a[href]', fig)[0];
        if (a) {
          a.parentNode.insertBefore(img, a);
          editor.dom.remove(a);
        }
      }
    };

    var linkImageFigure = function (editor, fig, attrs) {
      var a, img;
      img = editor.dom.select('img', fig)[0];
      if (img) {
        a = editor.dom.create('a', attrs);
        img.parentNode.insertBefore(a, img);
        a.appendChild(img);
      }
    };

    return {
      link: link,
      unlink: unlink,
      isLink: isLink,
      hasLinks: hasLinks,
      isOnlyTextSelected: isOnlyTextSelected,
      getAnchorElement: getAnchorElement,
      getAnchorText: getAnchorText,
      toggleTargetRules: toggleTargetRules
    };
  }
);