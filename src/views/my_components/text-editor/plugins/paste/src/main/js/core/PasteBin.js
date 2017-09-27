/**
 * PasteBin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * @class tinymce.pasteplugin.PasteBin
 * @private
 */
define(
  'tinymce.plugins.paste.core.PasteBin',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.Env'
  ],
  function (Tools, Env) {
    return function (editor) {
      var lastRng;
      var pasteBinDefaultContent = '%MCEPASTEBIN%';

      /**
       * Creates a paste bin element as close as possible to the current caret location and places the focus inside that element
       * so that when the real paste event occurs the contents gets inserted into this element
       * instead of the current editor selection element.
       */
      var create = function () {
        var dom = editor.dom, body = editor.getBody();
        var viewport = editor.dom.getViewPort(editor.getWin()), scrollTop = viewport.y, top = 20;
        var pasteBinElm;
        var scrollContainer;

        lastRng = editor.selection.getRng();

        if (editor.inline) {
          scrollContainer = editor.selection.getScrollContainer();

          // Can't always rely on scrollTop returning a useful value.
          // It returns 0 if the browser doesn't support scrollTop for the element or is non-scrollable
          if (scrollContainer && scrollContainer.scrollTop > 0) {
            scrollTop = scrollContainer.scrollTop;
          }
        }

        /**
         * Returns the rect of the current caret if the caret is in an empty block before a
         * BR we insert a temporary invisible character that we get the rect this way we always get a proper rect.
         *
         * TODO: This might be useful in core.
         */
        function getCaretRect(rng) {
          var rects, textNode, node, container = rng.startContainer;

          rects = rng.getClientRects();
          if (rects.length) {
            return rects[0];
          }

          if (!rng.collapsed || container.nodeType !== 1) {
            return;
          }

          node = container.childNodes[lastRng.startOffset];

          // Skip empty whitespace nodes
          while (node && node.nodeType === 3 && !node.data.length) {
            node = node.nextSibling;
          }

          if (!node) {
            return;
          }

          // Check if the location is |<br>
          // TODO: Might need to expand this to say |<table>
          if (node.tagName === 'BR') {
            textNode = dom.doc.createTextNode('\uFEFF');
            node.parentNode.insertBefore(textNode, node);

            rng = dom.createRng();
            rng.setStartBefore(textNode);
            rng.setEndAfter(textNode);

            rects = rng.getClientRects();
            dom.remove(textNode);
          }

          if (rects.length) {
            return rects[0];
          }
        }

        // Calculate top cordinate this is needed to avoid scrolling to top of document
        // We want the paste bin to be as close to the caret as possible to avoid scrolling
        if (lastRng.getClientRects) {
          var rect = getCaretRect(lastRng);

          if (rect) {
            // Client rects gets us closes to the actual
            // caret location in for example a wrapped paragraph block
            top = scrollTop + (rect.top - dom.getPos(body).y);
          } else {
            top = scrollTop;

            // Check if we can find a closer location by checking the range element
            var container = lastRng.startContainer;
            if (container) {
              if (container.nodeType === 3 && container.parentNode !== body) {
                container = container.parentNode;
              }

              if (container.nodeType === 1) {
                top = dom.getPos(container, scrollContainer || body).y;
              }
            }
          }
        }

        // Create a pastebin
        pasteBinElm = editor.dom.add(editor.getBody(), 'div', {
          id: "mcepastebin",
          contentEditable: true,
          "data-mce-bogus": "all",
          style: 'position: absolute; top: ' + top + 'px; width: 10px; height: 10px; overflow: hidden; opacity: 0'
        }, pasteBinDefaultContent);

        // Move paste bin out of sight since the controlSelection rect gets displayed otherwise on IE and Gecko
        if (Env.ie || Env.gecko) {
          dom.setStyle(pasteBinElm, 'left', dom.getStyle(body, 'direction', true) === 'rtl' ? 0xFFFF : -0xFFFF);
        }

        // Prevent focus events from bubbeling fixed FocusManager issues
        dom.bind(pasteBinElm, 'beforedeactivate focusin focusout', function (e) {
          e.stopPropagation();
        });

        pasteBinElm.focus();
        editor.selection.select(pasteBinElm, true);
      };

      /**
       * Removes the paste bin if it exists.
       */
      var remove = function () {
        if (getEl()) {
          var pasteBinClone;

          // WebKit/Blink might clone the div so
          // lets make sure we remove all clones
          // TODO: Man o man is this ugly. WebKit is the new IE! Remove this if they ever fix it!
          while ((pasteBinClone = editor.dom.get('mcepastebin'))) {
            editor.dom.remove(pasteBinClone);
            editor.dom.unbind(pasteBinClone);
          }

          if (lastRng) {
            editor.selection.setRng(lastRng);
          }
        }

        lastRng = null;
      };


      var getEl = function () {
        return editor.dom.get('mcepastebin');
      };

      /**
       * Returns the contents of the paste bin as a HTML string.
       *
       * @return {String} Get the contents of the paste bin.
       */
      var getHtml = function () {
        var pasteBinElm, pasteBinClones, i, dirtyWrappers, cleanWrapper;

        // Since WebKit/Chrome might clone the paste bin when pasting
        // for example: <img style="float: right"> we need to check if any of them contains some useful html.
        // TODO: Man o man is this ugly. WebKit is the new IE! Remove this if they ever fix it!

        var copyAndRemove = function (toElm, fromElm) {
          toElm.appendChild(fromElm);
          editor.dom.remove(fromElm, true); // remove, but keep children
        };

        // find only top level elements (there might be more nested inside them as well, see TINY-1162)
        pasteBinClones = Tools.grep(editor.getBody().childNodes, function (elm) {
          return elm.id === 'mcepastebin';
        });
        pasteBinElm = pasteBinClones.shift();

        // if clones were found, move their content into the first bin
        Tools.each(pasteBinClones, function (pasteBinClone) {
          copyAndRemove(pasteBinElm, pasteBinClone);
        });

        // TINY-1162: when copying plain text (from notepad for example) WebKit clones
        // paste bin (with styles and attributes) and uses it as a default  wrapper for
        // the chunks of the content, here we cycle over the whole paste bin and replace
        // those wrappers with a basic div
        dirtyWrappers = editor.dom.select('div[id=mcepastebin]', pasteBinElm);
        for (i = dirtyWrappers.length - 1; i >= 0; i--) {
          cleanWrapper = editor.dom.create('div');
          pasteBinElm.insertBefore(cleanWrapper, dirtyWrappers[i]);
          copyAndRemove(cleanWrapper, dirtyWrappers[i]);
        }

        return pasteBinElm ? pasteBinElm.innerHTML : '';
      };


      var getLastRng = function () {
        return lastRng;
      };


      var isDefaultContent = function (content) {
        return content === pasteBinDefaultContent;
      };


      var isPasteBin = function (elm) {
        return elm && elm.id === 'mcepastebin';
      };


      var isDefault = function () {
        var pasteBinElm = getEl();
        return isPasteBin(pasteBinElm) && isDefaultContent(pasteBinElm.innerHTML);
      };

      return {
        create: create,
        remove: remove,
        getEl: getEl,
        getHtml: getHtml,
        getLastRng: getLastRng,
        isDefault: isDefault,
        isDefaultContent: isDefaultContent
      };
    };
  }
);
