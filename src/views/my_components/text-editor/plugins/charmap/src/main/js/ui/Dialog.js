/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.charmap.ui.Dialog',
  [
    'tinymce.plugins.charmap.core.Actions',
    'tinymce.plugins.charmap.core.CharMap',
    'tinymce.plugins.charmap.ui.GridHtml'
  ],
  function (Actions, CharMap, GridHtml) {
    var getParentTd = function (elm) {
      while (elm) {
        if (elm.nodeName === 'TD') {
          return elm;
        }

        elm = elm.parentNode;
      }
    };

    var open = function (editor) {
      var win;

      var charMapPanel = {
        type: 'container',
        html: GridHtml.getHtml(CharMap.getCharMap(editor)),
        onclick: function (e) {
          var target = e.target;

          if (/^(TD|DIV)$/.test(target.nodeName)) {
            var charDiv = getParentTd(target).firstChild;
            if (charDiv && charDiv.hasAttribute('data-chr')) {
              Actions.insertChar(editor, charDiv.getAttribute('data-chr'));

              if (!e.ctrlKey) {
                win.close();
              }
            }
          }
        },
        onmouseover: function (e) {
          var td = getParentTd(e.target);

          if (td && td.firstChild) {
            win.find('#preview').text(td.firstChild.firstChild.data);
            win.find('#previewTitle').text(td.title);
          } else {
            win.find('#preview').text(' ');
            win.find('#previewTitle').text(' ');
          }
        }
      };

      win = editor.windowManager.open({
        title: "Special character",
        spacing: 10,
        padding: 10,
        items: [
          charMapPanel,
          {
            type: 'container',
            layout: 'flex',
            direction: 'column',
            align: 'center',
            spacing: 5,
            minWidth: 160,
            minHeight: 160,
            items: [
              {
                type: 'label',
                name: 'preview',
                text: ' ',
                style: 'font-size: 40px; text-align: center',
                border: 1,
                minWidth: 140,
                minHeight: 80
              },
              {
                type: 'spacer',
                minHeight: 20
              },
              {
                type: 'label',
                name: 'previewTitle',
                text: ' ',
                style: 'white-space: pre-wrap;',
                border: 1,
                minWidth: 140
              }
            ]
          }
        ],
        buttons: [
          {
            text: "Close", onclick: function () {
              win.close();
            }
          }
        ]
      });
    };

    return {
      open: open
    };
  }
);