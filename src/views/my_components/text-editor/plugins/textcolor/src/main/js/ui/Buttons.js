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
  'tinymce.plugins.textcolor.ui.Buttons',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.util.Tools',
    'tinymce.plugins.textcolor.api.Settings',
    'tinymce.plugins.textcolor.core.TextColor',
    'tinymce.plugins.textcolor.ui.ColorPickerHtml'
  ],
  function (DOMUtils, Tools, Settings, TextColor, ColorPickerHtml) {
    var setDivColor = function setDivColor(div, value) {
      div.style.background = value;
      div.setAttribute('data-mce-color', value);
    };

    var onButtonClick = function (editor) {
      return function (e) {
        var ctrl = e.control;

        if (ctrl._color) {
          TextColor.applyFormat(editor, ctrl.settings.format, ctrl._color);
        } else {
          TextColor.removeFormat(editor, ctrl.settings.format);
        }
      };
    };

    var onPanelClick = function (editor, cols) {
      return function (e) {
        var buttonCtrl = this.parent(), value;
        var currentColor = TextColor.getCurrentColor(editor, buttonCtrl.settings.format);

        var selectColor = function (value) {
          buttonCtrl.hidePanel();
          buttonCtrl.color(value);
          TextColor.applyFormat(editor, buttonCtrl.settings.format, value);
        };

        var resetColor = function () {
          buttonCtrl.hidePanel();
          buttonCtrl.resetColor();
          TextColor.removeFormat(editor, buttonCtrl.settings.format);
        };

        if (DOMUtils.DOM.getParent(e.target, '.mce-custom-color-btn')) {
          buttonCtrl.hidePanel();

          var colorPickerCallback = Settings.getColorPickerCallback(editor);

          colorPickerCallback.call(editor, function (value) {
            var tableElm = buttonCtrl.panel.getEl().getElementsByTagName('table')[0];
            var customColorCells, div, i;

            customColorCells = Tools.map(tableElm.rows[tableElm.rows.length - 1].childNodes, function (elm) {
              return elm.firstChild;
            });

            for (i = 0; i < customColorCells.length; i++) {
              div = customColorCells[i];
              if (!div.getAttribute('data-mce-color')) {
                break;
              }
            }

            // Shift colors to the right
            // TODO: Might need to be the left on RTL
            if (i === cols) {
              for (i = 0; i < cols - 1; i++) {
                setDivColor(customColorCells[i], customColorCells[i + 1].getAttribute('data-mce-color'));
              }
            }

            setDivColor(div, value);
            selectColor(value);
          }, currentColor);
        }

        value = e.target.getAttribute('data-mce-color');
        if (value) {
          if (this.lastId) {
            DOMUtils.DOM.get(this.lastId).setAttribute('aria-selected', false);
          }

          e.target.setAttribute('aria-selected', true);
          this.lastId = e.target.id;

          if (value === 'transparent') {
            resetColor();
          } else {
            selectColor(value);
          }
        } else if (value !== null) {
          buttonCtrl.hidePanel();
        }
      };
    };

    var renderColorPicker = function (editor, foreColor) {
      return function () {
        var cols = foreColor ? Settings.getForeColorCols(editor) : Settings.getBackColorCols(editor);
        var rows = foreColor ? Settings.getForeColorRows(editor) : Settings.getBackColorRows(editor);
        var colorMap = foreColor ? Settings.getForeColorMap(editor) : Settings.getBackColorMap(editor);
        var hasColorPicker = Settings.hasColorPicker(editor);

        return ColorPickerHtml.getHtml(cols, rows, colorMap, hasColorPicker);
      };
    };

    var register = function (editor) {
      editor.addButton('forecolor', {
        type: 'colorbutton',
        tooltip: 'Text color',
        format: 'forecolor',
        panel: {
          role: 'application',
          ariaRemember: true,
          html: renderColorPicker(editor, true),
          onclick: onPanelClick(editor, Settings.getForeColorCols(editor))
        },
        onclick: onButtonClick(editor)
      });

      editor.addButton('backcolor', {
        type: 'colorbutton',
        tooltip: 'Background color',
        format: 'hilitecolor',
        panel: {
          role: 'application',
          ariaRemember: true,
          html: renderColorPicker(editor, false),
          onclick: onPanelClick(editor, Settings.getBackColorCols(editor))
        },
        onclick: onButtonClick(editor)
      });
    };

    return {
      register: register
    };
  }
);