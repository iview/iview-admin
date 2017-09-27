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
  'tinymce.plugins.colorpicker.ui.Dialog',
  [
    'tinymce.core.util.Color'
  ],
  function (Color) {
    var showPreview = function (win, hexColor) {
      win.find('#preview')[0].getEl().style.background = hexColor;
    };

    var setColor = function (win, value) {
      var color = new Color(value), rgb = color.toRgb();

      win.fromJSON({
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        hex: color.toHex().substr(1)
      });

      showPreview(win, color.toHex());
    };

    var open = function (editor, callback, value) {
      var win = editor.windowManager.open({
        title: 'Color',
        items: {
          type: 'container',
          layout: 'flex',
          direction: 'row',
          align: 'stretch',
          padding: 5,
          spacing: 10,
          items: [
            {
              type: 'colorpicker',
              value: value,
              onchange: function () {
                var rgb = this.rgb();

                if (win) {
                  win.find('#r').value(rgb.r);
                  win.find('#g').value(rgb.g);
                  win.find('#b').value(rgb.b);
                  win.find('#hex').value(this.value().substr(1));
                  showPreview(win, this.value());
                }
              }
            },
            {
              type: 'form',
              padding: 0,
              labelGap: 5,
              defaults: {
                type: 'textbox',
                size: 7,
                value: '0',
                flex: 1,
                spellcheck: false,
                onchange: function () {
                  var colorPickerCtrl = win.find('colorpicker')[0];
                  var name, value;

                  name = this.name();
                  value = this.value();

                  if (name === "hex") {
                    value = '#' + value;
                    setColor(win, value);
                    colorPickerCtrl.value(value);
                    return;
                  }

                  value = {
                    r: win.find('#r').value(),
                    g: win.find('#g').value(),
                    b: win.find('#b').value()
                  };

                  colorPickerCtrl.value(value);
                  setColor(win, value);
                }
              },
              items: [
                { name: 'r', label: 'R', autofocus: 1 },
                { name: 'g', label: 'G' },
                { name: 'b', label: 'B' },
                { name: 'hex', label: '#', value: '000000' },
                { name: 'preview', type: 'container', border: 1 }
              ]
            }
          ]
        },
        onSubmit: function () {
          callback('#' + win.toJSON().hex);
        }
      });

      setColor(win, value);
    };

    return {
      open: open
    };
  }
);