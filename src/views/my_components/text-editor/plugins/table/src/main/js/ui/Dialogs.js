/**
 * Dialogs.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint dot-notation:0*/

/**
 * ...
 *
 * @class tinymce.table.ui.Dialogs
 * @private
 */
define(
  'tinymce.plugins.table.ui.Dialogs',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.Env'
  ],
  function (Tools, Env) {
    var each = Tools.each;

    return function (editor) {
      var self = this;

      function createColorPickAction() {
        var colorPickerCallback = editor.settings.color_picker_callback;

        if (colorPickerCallback) {
          return function () {
            var self = this;

            colorPickerCallback.call(
              editor,
              function (value) {
                self.value(value).fire('change');
              },
              self.value()
            );
          };
        }
      }

      function createStyleForm(dom) {
        return {
          title: 'Advanced',
          type: 'form',
          defaults: {
            onchange: function () {
              updateStyle(dom, this.parents().reverse()[0], this.name() == "style");
            }
          },
          items: [
            {
              label: 'Style',
              name: 'style',
              type: 'textbox'
            },

            {
              type: 'form',
              padding: 0,
              formItemDefaults: {
                layout: 'grid',
                alignH: ['start', 'right']
              },
              defaults: {
                size: 7
              },
              items: [
                {
                  label: 'Border color',
                  type: 'colorbox',
                  name: 'borderColor',
                  onaction: createColorPickAction()
                },

                {
                  label: 'Background color',
                  type: 'colorbox',
                  name: 'backgroundColor',
                  onaction: createColorPickAction()
                }
              ]
            }
          ]
        };
      }

      function removePxSuffix(size) {
        return size ? size.replace(/px$/, '') : "";
      }

      function addSizeSuffix(size) {
        if (/^[0-9]+$/.test(size)) {
          size += "px";
        }

        return size;
      }

      function unApplyAlign(elm) {
        each('left center right'.split(' '), function (name) {
          editor.formatter.remove('align' + name, {}, elm);
        });
      }

      function unApplyVAlign(elm) {
        each('top middle bottom'.split(' '), function (name) {
          editor.formatter.remove('valign' + name, {}, elm);
        });
      }

      function buildListItems(inputList, itemCallback, startItems) {
        function appendItems(values, output) {
          output = output || [];

          Tools.each(values, function (item) {
            var menuItem = { text: item.text || item.title };

            if (item.menu) {
              menuItem.menu = appendItems(item.menu);
            } else {
              menuItem.value = item.value;

              if (itemCallback) {
                itemCallback(menuItem);
              }
            }

            output.push(menuItem);
          });

          return output;
        }

        return appendItems(inputList, startItems || []);
      }

      function updateStyle(dom, win, isStyleCtrl) {
        var data = win.toJSON();
        var css = dom.parseStyle(data.style);

        if (isStyleCtrl) {
          win.find('#borderColor').value(css["border-color"] || '')[0].fire('change');
          win.find('#backgroundColor').value(css["background-color"] || '')[0].fire('change');
        } else {
          css["border-color"] = data.borderColor;
          css["background-color"] = data.backgroundColor;
        }

        win.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
      }

      function appendStylesToData(dom, data, elm) {
        var css = dom.parseStyle(dom.getAttrib(elm, 'style'));

        if (css["border-color"]) {
          data.borderColor = css["border-color"];
        }

        if (css["background-color"]) {
          data.backgroundColor = css["background-color"];
        }

        data.style = dom.serializeStyle(css);
      }

      function mergeStyles(dom, elm, styles) {
        var css = dom.parseStyle(dom.getAttrib(elm, 'style'));

        each(styles, function (style) {
          css[style.name] = style.value;
        });

        dom.setAttrib(elm, 'style', dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
      }

      self.tableProps = function () {
        self.table(true);
      };

      self.table = function (isProps) {
        var dom = editor.dom, tableElm, colsCtrl, rowsCtrl, classListCtrl, data = {}, generalTableForm, stylesToMerge;

        function onSubmitTableForm() {

          //Explore the layers of the table till we find the first layer of tds or ths
          function styleTDTH(elm, name, value) {
            if (elm.tagName === "TD" || elm.tagName === "TH") {
              dom.setStyle(elm, name, value);
            } else {
              if (elm.children) {
                for (var i = 0; i < elm.children.length; i++) {
                  styleTDTH(elm.children[i], name, value);
                }
              }
            }
          }

          var captionElm;

          updateStyle(dom, this);
          data = Tools.extend(data, this.toJSON());

          if (data["class"] === false) {
            delete data["class"];
          }

          editor.undoManager.transact(function () {
            if (!tableElm) {
              tableElm = editor.plugins.table.insertTable(data.cols || 1, data.rows || 1);
            }

            editor.dom.setAttribs(tableElm, {
              style: data.style,
              'class': data['class']
            });

            if (editor.settings.table_style_by_css) {
              stylesToMerge = [];
              stylesToMerge.push({ name: 'border', value: data.border });
              stylesToMerge.push({ name: 'border-spacing', value: addSizeSuffix(data.cellspacing) });
              mergeStyles(dom, tableElm, stylesToMerge);
              dom.setAttribs(tableElm, {
                'data-mce-border-color': data.borderColor,
                'data-mce-cell-padding': data.cellpadding,
                'data-mce-border': data.border
              });
              if (tableElm.children) {
                for (var i = 0; i < tableElm.children.length; i++) {
                  styleTDTH(tableElm.children[i], 'border', data.border);
                  styleTDTH(tableElm.children[i], 'padding', addSizeSuffix(data.cellpadding));
                }
              }
            } else {
              editor.dom.setAttribs(tableElm, {
                border: data.border,
                cellpadding: data.cellpadding,
                cellspacing: data.cellspacing
              });
            }

            if (dom.getAttrib(tableElm, 'width') && !editor.settings.table_style_by_css) {
              dom.setAttrib(tableElm, 'width', removePxSuffix(data.width));
            } else {
              dom.setStyle(tableElm, 'width', addSizeSuffix(data.width));
            }

            dom.setStyle(tableElm, 'height', addSizeSuffix(data.height));

            // Toggle caption on/off
            captionElm = dom.select('caption', tableElm)[0];

            if (captionElm && !data.caption) {
              dom.remove(captionElm);
            }

            if (!captionElm && data.caption) {
              captionElm = dom.create('caption');
              captionElm.innerHTML = !Env.ie ? '<br data-mce-bogus="1"/>' : '\u00a0';
              tableElm.insertBefore(captionElm, tableElm.firstChild);
            }
            unApplyAlign(tableElm);
            if (data.align) {
              editor.formatter.apply('align' + data.align, {}, tableElm);
            }

            editor.focus();
            editor.addVisual();
          });
        }

        function getTDTHOverallStyle(elm, name) {
          var cells = editor.dom.select("td,th", elm), firstChildStyle;

          function checkChildren(firstChildStyle, elms) {

            for (var i = 0; i < elms.length; i++) {
              var currentStyle = dom.getStyle(elms[i], name);
              if (typeof firstChildStyle === "undefined") {
                firstChildStyle = currentStyle;
              }
              if (firstChildStyle != currentStyle) {
                return "";
              }
            }

            return firstChildStyle;

          }

          firstChildStyle = checkChildren(firstChildStyle, cells);

          return firstChildStyle;
        }

        if (isProps === true) {
          tableElm = dom.getParent(editor.selection.getStart(), 'table');

          if (tableElm) {
            data = {
              width: removePxSuffix(dom.getStyle(tableElm, 'width') || dom.getAttrib(tableElm, 'width')),
              height: removePxSuffix(dom.getStyle(tableElm, 'height') || dom.getAttrib(tableElm, 'height')),
              cellspacing: removePxSuffix(dom.getStyle(tableElm, 'border-spacing') ||
                dom.getAttrib(tableElm, 'cellspacing')),
              cellpadding: dom.getAttrib(tableElm, 'data-mce-cell-padding') || dom.getAttrib(tableElm, 'cellpadding') ||
              getTDTHOverallStyle(tableElm, 'padding'),
              border: dom.getAttrib(tableElm, 'data-mce-border') || dom.getAttrib(tableElm, 'border') ||
              getTDTHOverallStyle(tableElm, 'border'),
              borderColor: dom.getAttrib(tableElm, 'data-mce-border-color'),
              caption: !!dom.select('caption', tableElm)[0],
              'class': dom.getAttrib(tableElm, 'class')
            };

            each('left center right'.split(' '), function (name) {
              if (editor.formatter.matchNode(tableElm, 'align' + name)) {
                data.align = name;
              }
            });
          }
        } else {
          colsCtrl = { label: 'Cols', name: 'cols' };
          rowsCtrl = { label: 'Rows', name: 'rows' };
        }

        if (editor.settings.table_class_list) {
          if (data["class"]) {
            data["class"] = data["class"].replace(/\s*mce\-item\-table\s*/g, '');
          }

          classListCtrl = {
            name: 'class',
            type: 'listbox',
            label: 'Class',
            values: buildListItems(
              editor.settings.table_class_list,
              function (item) {
                if (item.value) {
                  item.textStyle = function () {
                    return editor.formatter.getCssText({ block: 'table', classes: [item.value] });
                  };
                }
              }
            )
          };
        }

        generalTableForm = {
          type: 'form',
          layout: 'flex',
          direction: 'column',
          labelGapCalc: 'children',
          padding: 0,
          items: [
            {
              type: 'form',
              labelGapCalc: false,
              padding: 0,
              layout: 'grid',
              columns: 2,
              defaults: {
                type: 'textbox',
                maxWidth: 50
              },
              items: (editor.settings.table_appearance_options !== false) ? [
                colsCtrl,
                rowsCtrl,
                { label: 'Width', name: 'width' },
                { label: 'Height', name: 'height' },
                { label: 'Cell spacing', name: 'cellspacing' },
                { label: 'Cell padding', name: 'cellpadding' },
                { label: 'Border', name: 'border' },
                { label: 'Caption', name: 'caption', type: 'checkbox' }
              ] : [
                colsCtrl,
                rowsCtrl,
                  { label: 'Width', name: 'width' },
                  { label: 'Height', name: 'height' }
              ]
            },

            {
              label: 'Alignment',
              name: 'align',
              type: 'listbox',
              text: 'None',
              values: [
                { text: 'None', value: '' },
                { text: 'Left', value: 'left' },
                { text: 'Center', value: 'center' },
                { text: 'Right', value: 'right' }
              ]
            },

            classListCtrl
          ]
        };

        if (editor.settings.table_advtab !== false) {
          appendStylesToData(dom, data, tableElm);

          editor.windowManager.open({
            title: "Table properties",
            data: data,
            bodyType: 'tabpanel',
            body: [
              {
                title: 'General',
                type: 'form',
                items: generalTableForm
              },
              createStyleForm(dom)
            ],

            onsubmit: onSubmitTableForm
          });
        } else {
          editor.windowManager.open({
            title: "Table properties",
            data: data,
            body: generalTableForm,
            onsubmit: onSubmitTableForm
          });
        }
      };

      self.merge = function (grid, cell) {
        editor.windowManager.open({
          title: "Merge cells",
          body: [
            { label: 'Cols', name: 'cols', type: 'textbox', value: '1', size: 10 },
            { label: 'Rows', name: 'rows', type: 'textbox', value: '1', size: 10 }
          ],
          onsubmit: function () {
            var data = this.toJSON();

            editor.undoManager.transact(function () {
              grid.merge(cell, data.cols, data.rows);
            });
          }
        });
      };

      self.cell = function () {
        var dom = editor.dom, cellElm, data, classListCtrl, cells = [];

        function setAttrib(elm, name, value) {
          if (cells.length === 1 || value) {
            dom.setAttrib(elm, name, value);
          }
        }

        function setStyle(elm, name, value) {
          if (cells.length === 1 || value) {
            dom.setStyle(elm, name, value);
          }
        }

        function onSubmitCellForm() {
          updateStyle(dom, this);
          data = Tools.extend(data, this.toJSON());

          editor.undoManager.transact(function () {
            each(cells, function (cellElm) {
              setAttrib(cellElm, 'scope', data.scope);
              setAttrib(cellElm, 'style', data.style);
              setAttrib(cellElm, 'class', data['class']);
              setStyle(cellElm, 'width', addSizeSuffix(data.width));
              setStyle(cellElm, 'height', addSizeSuffix(data.height));

              // Switch cell type
              if (data.type && cellElm.nodeName.toLowerCase() !== data.type) {
                cellElm = dom.rename(cellElm, data.type);
              }

              // Remove alignment
              if (cells.length === 1) {
                unApplyAlign(cellElm);
                unApplyVAlign(cellElm);
              }

              // Apply alignment
              if (data.align) {
                editor.formatter.apply('align' + data.align, {}, cellElm);
              }

              // Apply vertical alignment
              if (data.valign) {
                editor.formatter.apply('valign' + data.valign, {}, cellElm);
              }
            });

            editor.focus();
          });
        }

        // Get selected cells or the current cell
        cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
        cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
        if (!cells.length && cellElm) {
          cells.push(cellElm);
        }

        cellElm = cellElm || cells[0];

        if (!cellElm) {
          // If this element is null, return now to avoid crashing.
          return;
        }

        if (cells.length > 1) {
          data = {
            width: '',
            height: '',
            scope: '',
            'class': '',
            align: '',
            style: '',
            type: cellElm.nodeName.toLowerCase()
          };
        } else {
          data = {
            width: removePxSuffix(dom.getStyle(cellElm, 'width') || dom.getAttrib(cellElm, 'width')),
            height: removePxSuffix(dom.getStyle(cellElm, 'height') || dom.getAttrib(cellElm, 'height')),
            scope: dom.getAttrib(cellElm, 'scope'),
            'class': dom.getAttrib(cellElm, 'class')
          };

          data.type = cellElm.nodeName.toLowerCase();

          each('left center right'.split(' '), function (name) {
            if (editor.formatter.matchNode(cellElm, 'align' + name)) {
              data.align = name;
            }
          });

          each('top middle bottom'.split(' '), function (name) {
            if (editor.formatter.matchNode(cellElm, 'valign' + name)) {
              data.valign = name;
            }
          });

          appendStylesToData(dom, data, cellElm);
        }

        if (editor.settings.table_cell_class_list) {
          classListCtrl = {
            name: 'class',
            type: 'listbox',
            label: 'Class',
            values: buildListItems(
              editor.settings.table_cell_class_list,
              function (item) {
                if (item.value) {
                  item.textStyle = function () {
                    return editor.formatter.getCssText({ block: 'td', classes: [item.value] });
                  };
                }
              }
            )
          };
        }

        var generalCellForm = {
          type: 'form',
          layout: 'flex',
          direction: 'column',
          labelGapCalc: 'children',
          padding: 0,
          items: [
            {
              type: 'form',
              layout: 'grid',
              columns: 2,
              labelGapCalc: false,
              padding: 0,
              defaults: {
                type: 'textbox',
                maxWidth: 50
              },
              items: [
                { label: 'Width', name: 'width' },
                { label: 'Height', name: 'height' },
                {
                  label: 'Cell type',
                  name: 'type',
                  type: 'listbox',
                  text: 'None',
                  minWidth: 90,
                  maxWidth: null,
                  values: [
                    { text: 'Cell', value: 'td' },
                    { text: 'Header cell', value: 'th' }
                  ]
                },
                {
                  label: 'Scope',
                  name: 'scope',
                  type: 'listbox',
                  text: 'None',
                  minWidth: 90,
                  maxWidth: null,
                  values: [
                    { text: 'None', value: '' },
                    { text: 'Row', value: 'row' },
                    { text: 'Column', value: 'col' },
                    { text: 'Row group', value: 'rowgroup' },
                    { text: 'Column group', value: 'colgroup' }
                  ]
                },
                {
                  label: 'H Align',
                  name: 'align',
                  type: 'listbox',
                  text: 'None',
                  minWidth: 90,
                  maxWidth: null,
                  values: [
                    { text: 'None', value: '' },
                    { text: 'Left', value: 'left' },
                    { text: 'Center', value: 'center' },
                    { text: 'Right', value: 'right' }
                  ]
                },
                {
                  label: 'V Align',
                  name: 'valign',
                  type: 'listbox',
                  text: 'None',
                  minWidth: 90,
                  maxWidth: null,
                  values: [
                    { text: 'None', value: '' },
                    { text: 'Top', value: 'top' },
                    { text: 'Middle', value: 'middle' },
                    { text: 'Bottom', value: 'bottom' }
                  ]
                }
              ]
            },

            classListCtrl
          ]
        };

        if (editor.settings.table_cell_advtab !== false) {
          editor.windowManager.open({
            title: "Cell properties",
            bodyType: 'tabpanel',
            data: data,
            body: [
              {
                title: 'General',
                type: 'form',
                items: generalCellForm
              },

              createStyleForm(dom)
            ],

            onsubmit: onSubmitCellForm
          });
        } else {
          editor.windowManager.open({
            title: "Cell properties",
            data: data,
            body: generalCellForm,
            onsubmit: onSubmitCellForm
          });
        }
      };

      self.row = function () {
        var dom = editor.dom, tableElm, cellElm, rowElm, classListCtrl, data, rows = [], generalRowForm;

        function setAttrib(elm, name, value) {
          if (rows.length === 1 || value) {
            dom.setAttrib(elm, name, value);
          }
        }

        function setStyle(elm, name, value) {
          if (rows.length === 1 || value) {
            dom.setStyle(elm, name, value);
          }
        }

        function onSubmitRowForm() {
          var tableElm, oldParentElm, parentElm;

          updateStyle(dom, this);
          data = Tools.extend(data, this.toJSON());

          editor.undoManager.transact(function () {
            var toType = data.type;

            each(rows, function (rowElm) {
              setAttrib(rowElm, 'scope', data.scope);
              setAttrib(rowElm, 'style', data.style);
              setAttrib(rowElm, 'class', data['class']);
              setStyle(rowElm, 'height', addSizeSuffix(data.height));

              if (toType !== rowElm.parentNode.nodeName.toLowerCase()) {
                tableElm = dom.getParent(rowElm, 'table');

                oldParentElm = rowElm.parentNode;
                parentElm = dom.select(toType, tableElm)[0];
                if (!parentElm) {
                  parentElm = dom.create(toType);
                  if (tableElm.firstChild) {
                    // caption tag should be the first descendant of the table tag (see TINY-1167)
                    if (tableElm.firstChild.nodeName === 'CAPTION') {
                      dom.insertAfter(parentElm, tableElm.firstChild);
                    } else {
                      tableElm.insertBefore(parentElm, tableElm.firstChild);
                    }
                  } else {
                    tableElm.appendChild(parentElm);
                  }
                }

                parentElm.appendChild(rowElm);

                if (!oldParentElm.hasChildNodes()) {
                  dom.remove(oldParentElm);
                }
              }

              // Apply/remove alignment
              if (rows.length === 1) {
                unApplyAlign(rowElm);
              }

              if (data.align) {
                editor.formatter.apply('align' + data.align, {}, rowElm);
              }
            });

            editor.focus();
          });
        }

        tableElm = editor.dom.getParent(editor.selection.getStart(), 'table');
        cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');

        each(tableElm.rows, function (row) {
          each(row.cells, function (cell) {
            if (dom.getAttrib(cell, 'data-mce-selected') || cell == cellElm) {
              rows.push(row);
              return false;
            }
          });
        });

        rowElm = rows[0];
        if (!rowElm) {
          // If this element is null, return now to avoid crashing.
          return;
        }

        if (rows.length > 1) {
          data = {
            height: '',
            scope: '',
            'class': '',
            align: '',
            type: rowElm.parentNode.nodeName.toLowerCase()
          };
        } else {
          data = {
            height: removePxSuffix(dom.getStyle(rowElm, 'height') || dom.getAttrib(rowElm, 'height')),
            scope: dom.getAttrib(rowElm, 'scope'),
            'class': dom.getAttrib(rowElm, 'class')
          };

          data.type = rowElm.parentNode.nodeName.toLowerCase();

          each('left center right'.split(' '), function (name) {
            if (editor.formatter.matchNode(rowElm, 'align' + name)) {
              data.align = name;
            }
          });

          appendStylesToData(dom, data, rowElm);
        }

        if (editor.settings.table_row_class_list) {
          classListCtrl = {
            name: 'class',
            type: 'listbox',
            label: 'Class',
            values: buildListItems(
              editor.settings.table_row_class_list,
              function (item) {
                if (item.value) {
                  item.textStyle = function () {
                    return editor.formatter.getCssText({ block: 'tr', classes: [item.value] });
                  };
                }
              }
            )
          };
        }

        generalRowForm = {
          type: 'form',
          columns: 2,
          padding: 0,
          defaults: {
            type: 'textbox'
          },
          items: [
            {
              type: 'listbox',
              name: 'type',
              label: 'Row type',
              text: 'Header',
              maxWidth: null,
              values: [
                { text: 'Header', value: 'thead' },
                { text: 'Body', value: 'tbody' },
                { text: 'Footer', value: 'tfoot' }
              ]
            },
            {
              type: 'listbox',
              name: 'align',
              label: 'Alignment',
              text: 'None',
              maxWidth: null,
              values: [
                { text: 'None', value: '' },
                { text: 'Left', value: 'left' },
                { text: 'Center', value: 'center' },
                { text: 'Right', value: 'right' }
              ]
            },
            { label: 'Height', name: 'height' },
            classListCtrl
          ]
        };

        if (editor.settings.table_row_advtab !== false) {
          editor.windowManager.open({
            title: "Row properties",
            data: data,
            bodyType: 'tabpanel',
            body: [
              {
                title: 'General',
                type: 'form',
                items: generalRowForm
              },
              createStyleForm(dom)
            ],

            onsubmit: onSubmitRowForm
          });
        } else {
          editor.windowManager.open({
            title: "Row properties",
            data: data,
            body: generalRowForm,
            onsubmit: onSubmitRowForm
          });
        }
      };
    };
  }
);
