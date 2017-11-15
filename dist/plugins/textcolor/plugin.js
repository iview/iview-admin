(function () {
    var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
    var register_3795 = function (id) {
        var module = dem(id);
        var fragments = id.split('.');
        var target = Function('return this;')();
        for (var i = 0; i < fragments.length - 1; ++i) {
            if (target[fragments[i]] === undefined) { target[fragments[i]] = {}; }
            target = target[fragments[i]];
        }
        target[fragments[fragments.length - 1]] = module;
    };

    var instantiate = function (id) {
        var actual = defs[id];
        var dependencies = actual.deps;
        var definition = actual.defn;
        var len = dependencies.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(dependencies[i]); }
        var defResult = definition.apply(null, instances);
        if (defResult === undefined) { throw 'module [' + id + '] returned undefined'; }
        actual.instance = defResult;
    };

    var def = function (id, dependencies, definition) {
        if (typeof id !== 'string') { throw 'module id must be a string'; } else if (dependencies === undefined) { throw 'no dependencies for ' + id; } else if (definition === undefined) { throw 'no definition function for ' + id; }
        defs[id] = {
            deps: dependencies,
            defn: definition,
            instance: undefined
        };
    };

    var dem = function (id) {
        var actual = defs[id];
        if (actual === undefined) { throw 'module [' + id + '] was undefined'; } else if (actual.instance === undefined) { instantiate(id); }
        return actual.instance;
    };

    var req = function (ids, callback) {
        var len = ids.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(ids[i]); }
        callback.apply(null, instances);
    };

    var ephox = {};

    ephox.bolt = {
        module: {
            api: {
                define: def,
                require: req,
                demand: dem
            }
        }
    };

    var define = def;
    var require = req;
    var demand = dem;
// this helps with minification when using a lot of global references
    var defineGlobal = function (id, ref) {
        define(id, [], function () { return ref; });
    };
/* jsc
["tinymce.plugins.textcolor.Plugin","tinymce.core.PluginManager","tinymce.plugins.textcolor.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.core.dom.DOMUtils","tinymce.core.util.Tools","tinymce.plugins.textcolor.api.Settings","tinymce.plugins.textcolor.core.TextColor","tinymce.plugins.textcolor.ui.ColorPickerHtml","tinymce.core.util.I18n"]
jsc */
    defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.PluginManager',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.PluginManager');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.dom.DOMUtils',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Tools',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Tools');
  }
);

/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.textcolor.api.Settings',
        [
        ],
  function () {
      var defaultColorMap = [
          '000000', 'Black',
          '993300', 'Burnt orange',
          '333300', 'Dark olive',
          '003300', 'Dark green',
          '003366', 'Dark azure',
          '000080', 'Navy Blue',
          '333399', 'Indigo',
          '333333', 'Very dark gray',
          '800000', 'Maroon',
          'FF6600', 'Orange',
          '808000', 'Olive',
          '008000', 'Green',
          '008080', 'Teal',
          '0000FF', 'Blue',
          '666699', 'Grayish blue',
          '808080', 'Gray',
          'FF0000', 'Red',
          'FF9900', 'Amber',
          '99CC00', 'Yellow green',
          '339966', 'Sea green',
          '33CCCC', 'Turquoise',
          '3366FF', 'Royal blue',
          '800080', 'Purple',
          '999999', 'Medium gray',
          'FF00FF', 'Magenta',
          'FFCC00', 'Gold',
          'FFFF00', 'Yellow',
          '00FF00', 'Lime',
          '00FFFF', 'Aqua',
          '00CCFF', 'Sky blue',
          '993366', 'Red violet',
          'FFFFFF', 'White',
          'FF99CC', 'Pink',
          'FFCC99', 'Peach',
          'FFFF99', 'Light yellow',
          'CCFFCC', 'Pale green',
          'CCFFFF', 'Pale cyan',
          '99CCFF', 'Light sky blue',
          'CC99FF', 'Plum'
      ];

      var getTextColorMap = function (editor) {
          return editor.getParam('textcolor_map', defaultColorMap);
      };

      var getForeColorMap = function (editor) {
          return editor.getParam('forecolor_map', getTextColorMap(editor));
      };

      var getBackColorMap = function (editor) {
          return editor.getParam('backcolor_map', getTextColorMap(editor));
      };

      var getTextColorRows = function (editor) {
          return editor.getParam('textcolor_rows', 5);
      };

      var getTextColorCols = function (editor) {
          return editor.getParam('textcolor_cols', 8);
      };

      var getForeColorRows = function (editor) {
          return editor.getParam('forecolor_rows', getTextColorRows(editor));
      };

      var getBackColorRows = function (editor) {
          return editor.getParam('backcolor_rows', getTextColorRows(editor));
      };

      var getForeColorCols = function (editor) {
          return editor.getParam('forecolor_cols', getTextColorCols(editor));
      };

      var getBackColorCols = function (editor) {
          return editor.getParam('backcolor_cols', getTextColorCols(editor));
      };

      var getColorPickerCallback = function (editor) {
          return editor.getParam('color_picker_callback', null);
      };

      var hasColorPicker = function (editor) {
          return typeof getColorPickerCallback(editor) === 'function';
      };

      return {
          getForeColorMap: getForeColorMap,
          getBackColorMap: getBackColorMap,
          getForeColorRows: getForeColorRows,
          getBackColorRows: getBackColorRows,
          getForeColorCols: getForeColorCols,
          getBackColorCols: getBackColorCols,
          getColorPickerCallback: getColorPickerCallback,
          hasColorPicker: hasColorPicker
      };
  }
);

/**
 * TextColor.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.textcolor.core.TextColor',
        [
        ],
  function () {
      var getCurrentColor = function (editor, format) {
          var color;

          editor.dom.getParents(editor.selection.getStart(), function (elm) {
              var value;

              if ((value = elm.style[format === 'forecolor' ? 'color' : 'background-color'])) {
                  color = value;
              }
          });

          return color;
      };

      var mapColors = function (colorMap) {
          var i, colors = [];

          for (i = 0; i < colorMap.length; i += 2) {
              colors.push({
                  text: colorMap[i + 1],
                  color: '#' + colorMap[i]
              });
          }

          return colors;
      };

      var applyFormat = function (editor, format, value) {
          editor.undoManager.transact(function () {
              editor.focus();
              editor.formatter.apply(format, { value: value });
              editor.nodeChanged();
          });
      };

      var removeFormat = function (editor, format) {
          editor.undoManager.transact(function () {
              editor.focus();
              editor.formatter.remove(format, { value: null }, null, true);
              editor.nodeChanged();
          });
      };

      return {
          getCurrentColor: getCurrentColor,
          mapColors: mapColors,
          applyFormat: applyFormat,
          removeFormat: removeFormat
      };
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.I18n',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.I18n');
  }
);

/**
 * ColorPickerHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.textcolor.ui.ColorPickerHtml',
        [
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.util.I18n',
            'tinymce.plugins.textcolor.api.Settings',
            'tinymce.plugins.textcolor.core.TextColor'
        ],
  function (DOMUtils, I18n, Settings, TextColor) {
      var getHtml = function (cols, rows, colorMap, hasColorPicker) {
          var colors, color, html, last, x, y, i, count = 0, id = DOMUtils.DOM.uniqueId('mcearia');

          var getColorCellHtml = function (color, title) {
              var isNoColor = color === 'transparent';

              return (
          '<td class="mce-grid-cell' + (isNoColor ? ' mce-colorbtn-trans' : '') + '">' +
          '<div id="' + id + '-' + (count++) + '"' +
          ' data-mce-color="' + (color || '') + '"' +
          ' role="option"' +
          ' tabIndex="-1"' +
          ' style="' + (color ? 'background-color: ' + color : '') + '"' +
          ' title="' + I18n.translate(title) + '">' +
          (isNoColor ? '&#215;' : '') +
          '</div>' +
          '</td>'
              );
          };

          colors = TextColor.mapColors(colorMap);
          colors.push({
              text: I18n.translate('No color'),
              color: 'transparent'
          });

          html = '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';
          last = colors.length - 1;

          for (y = 0; y < rows; y++) {
              html += '<tr>';

              for (x = 0; x < cols; x++) {
                  i = y * cols + x;

                  if (i > last) {
                      html += '<td></td>';
                  } else {
                      color = colors[i];
                      html += getColorCellHtml(color.color, color.text);
                  }
              }

              html += '</tr>';
          }

          if (hasColorPicker) {
              html += (
          '<tr>' +
          '<td colspan="' + cols + '" class="mce-custom-color-btn">' +
          '<div id="' + id + '-c" class="mce-widget mce-btn mce-btn-small mce-btn-flat" ' +
          'role="button" tabindex="-1" aria-labelledby="' + id + '-c" style="width: 100%">' +
          '<button type="button" role="presentation" tabindex="-1">' + I18n.translate('Custom...') + '</button>' +
          '</div>' +
          '</td>' +
          '</tr>'
        );

              html += '<tr>';

              for (x = 0; x < cols; x++) {
                  html += getColorCellHtml('', 'Custom color');
              }

              html += '</tr>';
          }

          html += '</tbody></table>';

          return html;
      };

      return {
          getHtml: getHtml
      };
  }
);
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
      var setDivColor = function setDivColor (div, value) {
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
/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.plugins.textcolor.Plugin',
        [
            'tinymce.core.PluginManager',
            'tinymce.plugins.textcolor.ui.Buttons'
        ],
  function (PluginManager, Buttons) {
      PluginManager.add('textcolor', function (editor) {
          Buttons.register(editor);
      });

      return function () { };
  }
);
    dem('tinymce.plugins.textcolor.Plugin')();
})();
