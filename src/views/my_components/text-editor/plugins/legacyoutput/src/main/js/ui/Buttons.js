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
  'tinymce.plugins.legacyoutput.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('fontsizeselect', function () {
        var items = [], defaultFontsizeFormats = '8pt=1 10pt=2 12pt=3 14pt=4 18pt=5 24pt=6 36pt=7';
        var fontsizeFormats = editor.settings.fontsizeFormats || defaultFontsizeFormats;

        editor.$.each(fontsizeFormats.split(' '), function (i, item) {
          var text = item, value = item;
          var values = item.split('=');

          if (values.length > 1) {
            text = values[0];
            value = values[1];
          }

          items.push({ text: text, value: value });
        });

        return {
          type: 'listbox',
          text: 'Font Sizes',
          tooltip: 'Font Sizes',
          values: items,
          fixedWidth: true,
          onPostRender: function () {
            var self = this;

            editor.on('NodeChange', function () {
              var fontElm;

              fontElm = editor.dom.getParent(editor.selection.getNode(), 'font');
              if (fontElm) {
                self.value(fontElm.size);
              } else {
                self.value('');
              }
            });
          },
          onclick: function (e) {
            if (e.control.settings.value) {
              editor.execCommand('FontSize', false, e.control.settings.value);
            }
          }
        };
      });

      editor.addButton('fontselect', function () {
        function createFormats(formats) {
          formats = formats.replace(/;$/, '').split(';');

          var i = formats.length;
          while (i--) {
            formats[i] = formats[i].split('=');
          }

          return formats;
        }

        var defaultFontsFormats =
          'Andale Mono=andale mono,monospace;' +
          'Arial=arial,helvetica,sans-serif;' +
          'Arial Black=arial black,sans-serif;' +
          'Book Antiqua=book antiqua,palatino,serif;' +
          'Comic Sans MS=comic sans ms,sans-serif;' +
          'Courier New=courier new,courier,monospace;' +
          'Georgia=georgia,palatino,serif;' +
          'Helvetica=helvetica,arial,sans-serif;' +
          'Impact=impact,sans-serif;' +
          'Symbol=symbol;' +
          'Tahoma=tahoma,arial,helvetica,sans-serif;' +
          'Terminal=terminal,monaco,monospace;' +
          'Times New Roman=times new roman,times,serif;' +
          'Trebuchet MS=trebuchet ms,geneva,sans-serif;' +
          'Verdana=verdana,geneva,sans-serif;' +
          'Webdings=webdings;' +
          'Wingdings=wingdings,zapf dingbats';

        var items = [], fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);

        editor.$.each(fonts, function (i, font) {
          items.push({
            text: { raw: font[0] },
            value: font[1],
            textStyle: font[1].indexOf('dings') === -1 ? 'font-family:' + font[1] : ''
          });
        });

        return {
          type: 'listbox',
          text: 'Font Family',
          tooltip: 'Font Family',
          values: items,
          fixedWidth: true,
          onPostRender: function () {
            var self = this;

            editor.on('NodeChange', function () {
              var fontElm;

              fontElm = editor.dom.getParent(editor.selection.getNode(), 'font');
              if (fontElm) {
                self.value(fontElm.face);
              } else {
                self.value('');
              }
            });
          },
          onselect: function (e) {
            if (e.control.settings.value) {
              editor.execCommand('FontName', false, e.control.settings.value);
            }
          }
        };
      });
    };

    return {
      register: register
    };
  }
);