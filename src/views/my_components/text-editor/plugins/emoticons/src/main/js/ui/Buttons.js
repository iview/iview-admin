/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.emoticons.ui.Buttons',
  [
    'tinymce.plugins.emoticons.ui.PanelHtml'
  ],
  function (PanelHtml) {
    var insertEmoticon = function (editor, src, alt) {
      editor.insertContent(editor.dom.createHTML('img', { src: src, alt: alt }));
    };

    var register = function (editor, pluginUrl) {
      var panelHtml = PanelHtml.getHtml(pluginUrl);

      editor.addButton('emoticons', {
        type: 'panelbutton',
        panel: {
          role: 'application',
          autohide: true,
          html: panelHtml,
          onclick: function (e) {
            var linkElm = editor.dom.getParent(e.target, 'a');
            if (linkElm) {
              insertEmoticon(editor, linkElm.getAttribute('data-mce-url'), linkElm.getAttribute('data-mce-alt'));
              this.hide();
            }
          }
        },
        tooltip: 'Emoticons'
      });
    };

    return {
      register: register
    };
  }
);