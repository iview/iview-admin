/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the table plugin.
 *
 * @class tinymce.table.Plugin
 * @private
 */
define(
  'tinymce.plugins.table.Plugin',
  [
    'tinymce.core.dom.TreeWalker',
    'tinymce.core.Env',
    'tinymce.core.PluginManager',
    'tinymce.core.util.Tools',
    'tinymce.core.util.VK',
    'tinymce.plugins.table.model.TableGrid',
    'tinymce.plugins.table.selection.CellSelection',
    'tinymce.plugins.table.ui.Dialogs',
    'tinymce.plugins.table.ui.ResizeBars',
    'tinymce.plugins.table.util.Utils',
    'tinymce.plugins.table.util.Quirks'
  ],
  function (TreeWalker, Env, PluginManager, Tools, VK, TableGrid, CellSelection, Dialogs, ResizeBars, Utils, Quirks) {
    var each = Tools.each;

    function Plugin(editor) {
      var clipboardRows, self = this, dialogs = new Dialogs(editor), resizeBars;

      if (editor.settings.object_resizing && editor.settings.table_resize_bars !== false &&
        (editor.settings.object_resizing === true || editor.settings.object_resizing === 'table')) {
        resizeBars = ResizeBars(editor);
      }

      function cmd(command) {
        return function () {
          editor.execCommand(command);
        };
      }

      function insertTable(cols, rows) {
        var y, x, html, tableElm;

        html = '<table id="__mce"><tbody>';

        for (y = 0; y < rows; y++) {
          html += '<tr>';

          for (x = 0; x < cols; x++) {
            html += '<td>' + (Env.ie && Env.ie < 10 ? '&nbsp;' : '<br>') + '</td>';
          }

          html += '</tr>';
        }

        html += '</tbody></table>';

        editor.undoManager.transact(function () {
          editor.insertContent(html);

          tableElm = editor.dom.get('__mce');
          editor.dom.setAttrib(tableElm, 'id', null);

          editor.$('tr', tableElm).each(function (index, row) {
            editor.fire('newrow', {
              node: row
            });

            editor.$('th,td', row).each(function (index, cell) {
              editor.fire('newcell', {
                node: cell
              });
            });
          });

          editor.dom.setAttribs(tableElm, editor.settings.table_default_attributes || {});
          editor.dom.setStyles(tableElm, editor.settings.table_default_styles || {});
        });

        return tableElm;
      }

      function handleDisabledState(ctrl, selector, sameParts) {
        function bindStateListener() {
          var selectedElm, selectedCells, parts = {}, sum = 0, state;

          selectedCells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
          selectedElm = selectedCells[0];
          if (!selectedElm) {
            selectedElm = editor.selection.getStart();
          }

          // Make sure that we don't have a selection inside thead and tbody at the same time
          if (sameParts && selectedCells.length > 0) {
            each(selectedCells, function (cell) {
              return parts[cell.parentNode.parentNode.nodeName] = 1;
            });

            each(parts, function (value) {
              sum += value;
            });

            state = sum !== 1;
          } else {
            state = !editor.dom.getParent(selectedElm, selector);
          }

          ctrl.disabled(state);

          editor.selection.selectorChanged(selector, function (state) {
            ctrl.disabled(!state);
          });
        }

        if (editor.initialized) {
          bindStateListener();
        } else {
          editor.on('init', bindStateListener);
        }
      }

      function postRender() {
        /*jshint validthis:true*/
        handleDisabledState(this, 'table');
      }

      var hasMergedCellsSelected = function (node) {
        var cell = editor.dom.getParent(node, 'th,td');
        var selectedCells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]').concat(cell ? [cell] : []);
        var mergedCellsSelected = Tools.grep(selectedCells, function (elm) {
          return Utils.getColSpan(elm) > 1 || Utils.getRowSpan(elm) > 1;
        });

        return mergedCellsSelected.length > 0;
      };

      var postRenderSplitCell = function (e) {
        var ctrl = e.control;

        ctrl.disabled(!hasMergedCellsSelected(editor.selection.getStart()));
        editor.on('nodechange', function (e) {
          ctrl.disabled(!hasMergedCellsSelected(e.element));
        });
      };

      function postRenderCell() {
        /*jshint validthis:true*/
        handleDisabledState(this, 'td,th');
      }

      function postRenderMergeCell() {
        /*jshint validthis:true*/
        handleDisabledState(this, 'td,th', true);
      }

      function generateTableGrid() {
        var html = '';

        html = '<table role="grid" class="mce-grid mce-grid-border" aria-readonly="true">';

        for (var y = 0; y < 10; y++) {
          html += '<tr>';

          for (var x = 0; x < 10; x++) {
            html += '<td role="gridcell" tabindex="-1"><a id="mcegrid' + (y * 10 + x) + '" href="#" ' +
              'data-mce-x="' + x + '" data-mce-y="' + y + '"></a></td>';
          }

          html += '</tr>';
        }

        html += '</table>';

        html += '<div class="mce-text-center" role="presentation">1 x 1</div>';

        return html;
      }

      function selectGrid(tx, ty, control) {
        var table = control.getEl().getElementsByTagName('table')[0];
        var x, y, focusCell, cell, active;
        var rtl = control.isRtl() || control.parent().rel == 'tl-tr';

        table.nextSibling.innerHTML = (tx + 1) + ' x ' + (ty + 1);

        if (rtl) {
          tx = 9 - tx;
        }

        for (y = 0; y < 10; y++) {
          for (x = 0; x < 10; x++) {
            cell = table.rows[y].childNodes[x].firstChild;
            active = (rtl ? x >= tx : x <= tx) && y <= ty;

            editor.dom.toggleClass(cell, 'mce-active', active);

            if (active) {
              focusCell = cell;
            }
          }
        }

        return focusCell.parentNode;
      }

      if (editor.settings.table_grid === false) {
        editor.addMenuItem('inserttable', {
          text: 'Table',
          icon: 'table',
          context: 'table',
          onclick: dialogs.table
        });
      } else {
        editor.addMenuItem('inserttable', {
          text: 'Table',
          icon: 'table',
          context: 'table',
          ariaHideMenu: true,
          onclick: function (e) {
            if (e.aria) {
              this.parent().hideAll();
              e.stopImmediatePropagation();
              dialogs.table();
            }
          },
          onshow: function () {
            selectGrid(0, 0, this.menu.items()[0]);
          },
          onhide: function () {
            var elements = this.menu.items()[0].getEl().getElementsByTagName('a');
            editor.dom.removeClass(elements, 'mce-active');
            editor.dom.addClass(elements[0], 'mce-active');
          },
          menu: [
            {
              type: 'container',
              html: generateTableGrid(),

              onPostRender: function () {
                this.lastX = this.lastY = 0;
              },

              onmousemove: function (e) {
                var target = e.target, x, y;

                if (target.tagName.toUpperCase() == 'A') {
                  x = parseInt(target.getAttribute('data-mce-x'), 10);
                  y = parseInt(target.getAttribute('data-mce-y'), 10);

                  if (this.isRtl() || this.parent().rel == 'tl-tr') {
                    x = 9 - x;
                  }

                  if (x !== this.lastX || y !== this.lastY) {
                    selectGrid(x, y, e.control);

                    this.lastX = x;
                    this.lastY = y;
                  }
                }
              },

              onclick: function (e) {
                var self = this;

                if (e.target.tagName.toUpperCase() == 'A') {
                  e.preventDefault();
                  e.stopPropagation();
                  self.parent().cancel();

                  editor.undoManager.transact(function () {
                    insertTable(self.lastX + 1, self.lastY + 1);
                  });

                  editor.addVisual();
                }
              }
            }
          ]
        });
      }

      editor.addMenuItem('tableprops', {
        text: 'Table properties',
        context: 'table',
        onPostRender: postRender,
        onclick: dialogs.tableProps
      });

      editor.addMenuItem('deletetable', {
        text: 'Delete table',
        context: 'table',
        onPostRender: postRender,
        cmd: 'mceTableDelete'
      });

      editor.addMenuItem('cell', {
        separator: 'before',
        text: 'Cell',
        context: 'table',
        menu: [
          { text: 'Cell properties', onclick: cmd('mceTableCellProps'), onPostRender: postRenderCell },
          { text: 'Merge cells', onclick: cmd('mceTableMergeCells'), onPostRender: postRenderMergeCell },
          { text: 'Split cell', disabled: true, onclick: cmd('mceTableSplitCells'), onPostRender: postRenderSplitCell }
        ]
      });

      editor.addMenuItem('row', {
        text: 'Row',
        context: 'table',
        menu: [
          { text: 'Insert row before', onclick: cmd('mceTableInsertRowBefore'), onPostRender: postRenderCell },
          { text: 'Insert row after', onclick: cmd('mceTableInsertRowAfter'), onPostRender: postRenderCell },
          { text: 'Delete row', onclick: cmd('mceTableDeleteRow'), onPostRender: postRenderCell },
          { text: 'Row properties', onclick: cmd('mceTableRowProps'), onPostRender: postRenderCell },
          { text: '-' },
          { text: 'Cut row', onclick: cmd('mceTableCutRow'), onPostRender: postRenderCell },
          { text: 'Copy row', onclick: cmd('mceTableCopyRow'), onPostRender: postRenderCell },
          { text: 'Paste row before', onclick: cmd('mceTablePasteRowBefore'), onPostRender: postRenderCell },
          { text: 'Paste row after', onclick: cmd('mceTablePasteRowAfter'), onPostRender: postRenderCell }
        ]
      });

      editor.addMenuItem('column', {
        text: 'Column',
        context: 'table',
        menu: [
          { text: 'Insert column before', onclick: cmd('mceTableInsertColBefore'), onPostRender: postRenderCell },
          { text: 'Insert column after', onclick: cmd('mceTableInsertColAfter'), onPostRender: postRenderCell },
          { text: 'Delete column', onclick: cmd('mceTableDeleteCol'), onPostRender: postRenderCell }
        ]
      });

      var menuItems = [];
      each("inserttable tableprops deletetable | cell row column".split(' '), function (name) {
        if (name == '|') {
          menuItems.push({ text: '-' });
        } else {
          menuItems.push(editor.menuItems[name]);
        }
      });

      editor.addButton("table", {
        type: "menubutton",
        title: "Table",
        menu: menuItems
      });

      // Select whole table is a table border is clicked
      if (!Env.isIE) {
        editor.on('click', function (e) {
          e = e.target;

          if (e.nodeName === 'TABLE') {
            editor.selection.select(e);
            editor.nodeChanged();
          }
        });
      }

      self.quirks = new Quirks(editor);

      editor.on('Init', function () {
        self.cellSelection = new CellSelection(editor, function (selecting) {
          if (selecting && resizeBars) {
            resizeBars.clearBars();
          }
        });
        self.resizeBars = resizeBars;
      });

      editor.on('PreInit', function () {
        // Remove internal data attributes
        editor.serializer.addAttributeFilter(
          'data-mce-cell-padding,data-mce-border,data-mce-border-color',
          function (nodes, name) {

            var i = nodes.length;

            while (i--) {
              nodes[i].attr(name, null);
            }
          });
      });

      // Register action commands
      each({
        mceTableSplitCells: function (grid) {
          grid.split();
        },

        mceTableMergeCells: function (grid) {
          var cell;

          cell = editor.dom.getParent(editor.selection.getStart(), 'th,td');

          if (!editor.dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
            dialogs.merge(grid, cell);
          } else {
            grid.merge();
          }
        },

        mceTableInsertRowBefore: function (grid) {
          grid.insertRows(true);
        },

        mceTableInsertRowAfter: function (grid) {
          grid.insertRows();
        },

        mceTableInsertColBefore: function (grid) {
          grid.insertCols(true);
        },

        mceTableInsertColAfter: function (grid) {
          grid.insertCols();
        },

        mceTableDeleteCol: function (grid) {
          grid.deleteCols();
        },

        mceTableDeleteRow: function (grid) {
          grid.deleteRows();
        },

        mceTableCutRow: function (grid) {
          clipboardRows = grid.cutRows();
        },

        mceTableCopyRow: function (grid) {
          clipboardRows = grid.copyRows();
        },

        mceTablePasteRowBefore: function (grid) {
          grid.pasteRows(clipboardRows, true);
        },

        mceTablePasteRowAfter: function (grid) {
          grid.pasteRows(clipboardRows);
        },

        mceSplitColsBefore: function (grid) {
          grid.splitCols(true);
        },

        mceSplitColsAfter: function (grid) {
          grid.splitCols(false);
        },

        mceTableDelete: function (grid) {
          if (resizeBars) {
            resizeBars.clearBars();
          }
          grid.deleteTable();
        }
      }, function (func, name) {
        editor.addCommand(name, function () {
          var grid = new TableGrid(editor);

          if (grid) {
            func(grid);
            editor.execCommand('mceRepaint');
            self.cellSelection.clear();
          }
        });
      });

      // Register dialog commands
      each({
        mceInsertTable: dialogs.table,
        mceTableProps: function () {
          dialogs.table(true);
        },
        mceTableRowProps: dialogs.row,
        mceTableCellProps: dialogs.cell
      }, function (func, name) {
        editor.addCommand(name, function (ui, val) {
          func(val);
        });
      });

      function addButtons() {
        editor.addButton('tableprops', {
          title: 'Table properties',
          onclick: dialogs.tableProps,
          icon: 'table'
        });

        editor.addButton('tabledelete', {
          title: 'Delete table',
          onclick: cmd('mceTableDelete')
        });

        editor.addButton('tablecellprops', {
          title: 'Cell properties',
          onclick: cmd('mceTableCellProps')
        });

        editor.addButton('tablemergecells', {
          title: 'Merge cells',
          onclick: cmd('mceTableMergeCells')
        });

        editor.addButton('tablesplitcells', {
          title: 'Split cell',
          onclick: cmd('mceTableSplitCells')
        });

        editor.addButton('tableinsertrowbefore', {
          title: 'Insert row before',
          onclick: cmd('mceTableInsertRowBefore')
        });

        editor.addButton('tableinsertrowafter', {
          title: 'Insert row after',
          onclick: cmd('mceTableInsertRowAfter')
        });

        editor.addButton('tabledeleterow', {
          title: 'Delete row',
          onclick: cmd('mceTableDeleteRow')
        });

        editor.addButton('tablerowprops', {
          title: 'Row properties',
          onclick: cmd('mceTableRowProps')
        });

        editor.addButton('tablecutrow', {
          title: 'Cut row',
          onclick: cmd('mceTableCutRow')
        });

        editor.addButton('tablecopyrow', {
          title: 'Copy row',
          onclick: cmd('mceTableCopyRow')
        });

        editor.addButton('tablepasterowbefore', {
          title: 'Paste row before',
          onclick: cmd('mceTablePasteRowBefore')
        });

        editor.addButton('tablepasterowafter', {
          title: 'Paste row after',
          onclick: cmd('mceTablePasteRowAfter')
        });

        editor.addButton('tableinsertcolbefore', {
          title: 'Insert column before',
          onclick: cmd('mceTableInsertColBefore')
        });

        editor.addButton('tableinsertcolafter', {
          title: 'Insert column after',
          onclick: cmd('mceTableInsertColAfter')
        });

        editor.addButton('tabledeletecol', {
          title: 'Delete column',
          onclick: cmd('mceTableDeleteCol')
        });

      }

      function isTable(table) {

        var selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);

        return selectorMatched;
      }

      function addToolbars() {
        var toolbarItems = editor.settings.table_toolbar;

        if (toolbarItems === '' || toolbarItems === false) {
          return;
        }

        if (!toolbarItems) {
          toolbarItems = 'tableprops tabledelete | ' +
            'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' +
            'tableinsertcolbefore tableinsertcolafter tabledeletecol';
        }

        editor.addContextToolbar(
          isTable,
          toolbarItems
        );
      }

      function getClipboardRows() {
        return clipboardRows;
      }

      function setClipboardRows(rows) {
        clipboardRows = rows;
      }

      addButtons();
      addToolbars();

      // Enable tab key cell navigation
      if (editor.settings.table_tab_navigation !== false) {
        editor.on('keydown', function (e) {
          var cellElm, grid, delta;
          var selectionStart = editor.selection.getStart();

          if (e.keyCode === VK.TAB) {
            if (editor.dom.getParent(selectionStart, 'LI,DT,DD')) {
              return;
            }

            cellElm = editor.dom.getParent(selectionStart, 'th,td');

            if (cellElm) {
              e.preventDefault();

              grid = new TableGrid(editor);
              delta = e.shiftKey ? -1 : 1;

              editor.undoManager.transact(function () {
                if (!grid.moveRelIdx(cellElm, delta) && delta > 0) {
                  grid.insertRow();
                  grid.refresh();
                  grid.moveRelIdx(cellElm, delta);
                }
              });
            }
          }
        });
      }

      self.insertTable = insertTable;
      self.setClipboardRows = setClipboardRows;
      self.getClipboardRows = getClipboardRows;
    }

    PluginManager.add('table', Plugin);

    return function () { };
  }
);
