/**
 * SplitCols.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Contains logic for handling splitting of merged rows.
 *
 * @class tinymce.table.model.SplitCols
 * @private
 */
define(
  'tinymce.plugins.table.model.SplitCols',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.table.util.Utils'
  ],
  function (Tools, Utils) {
    var getCellAt = function (grid, x, y) {
      return grid[y] ? grid[y][x] : null;
    };

    var getCellElmAt = function (grid, x, y) {
      var cell = getCellAt(grid, x, y);
      return cell ? cell.elm : null;
    };

    var countHoles = function (grid, x, y, delta) {
      var y2, cell, count = 0, elm = getCellElmAt(grid, x, y);

      for (y2 = y; delta > 0 ? y2 < grid.length : y2 >= 0; y2 += delta) {
        cell = getCellAt(grid, x, y2);
        if (elm !== cell.elm) {
          break;
        }

        count++;
      }

      return count;
    };

    var findRealElm = function (grid, x, y) {
      var cell, row = grid[y];

      for (var x2 = x; x2 < row.length; x2++) {
        cell = row[x2];
        if (cell.real) {
          return cell.elm;
        }
      }

      return null;
    };

    var getRowSplitInfo = function (grid, y) {
      var cell, result = [], row = grid[y];

      for (var x = 0; x < row.length; x++) {
        cell = row[x];
        result.push({
          elm: cell.elm,
          above: countHoles(grid, x, y, -1) - 1,
          below: countHoles(grid, x, y, 1) - 1
        });

        x += Utils.getColSpan(cell.elm) - 1;
      }

      return result;
    };

    var createCell = function (info, rowSpan) {
      var doc = info.elm.ownerDocument;
      var newCell = doc.createElement('td');

      Utils.setColSpan(newCell, Utils.getColSpan(info.elm));
      Utils.setRowSpan(newCell, rowSpan);
      Utils.paddCell(newCell);

      return newCell;
    };

    var insertOrAppendCell = function (grid, newCell, x, y) {
      var realCellElm = findRealElm(grid, x + 1, y);

      if (!realCellElm) {
        realCellElm = findRealElm(grid, 0, y);
        realCellElm.parentNode.appendChild(newCell);
      } else {
        realCellElm.parentNode.insertBefore(newCell, realCellElm);
      }
    };

    var splitAbove = function (grid, info, x, y) {
      if (info.above !== 0) {
        Utils.setRowSpan(info.elm, info.above);
        var cell = createCell(info, info.below + 1);
        insertOrAppendCell(grid, cell, x, y);
        return cell;
      }

      return null;
    };

    var splitBelow = function (grid, info, x, y) {
      if (info.below !== 0) {
        Utils.setRowSpan(info.elm, info.above + 1);
        var cell = createCell(info, info.below);
        insertOrAppendCell(grid, cell, x, y + 1);
        return cell;
      }

      return null;
    };

    var splitAt = function (grid, x, y, before) {
      var rowInfos = getRowSplitInfo(grid, y);
      var rowElm = getCellElmAt(grid, x, y).parentNode;
      var cells = [];

      Tools.each(rowInfos, function (info, x) {
        var cell = before ? splitAbove(grid, info, x, y) : splitBelow(grid, info, x, y);
        if (cell !== null) {
          cells.push(cells);
        }
      });

      return {
        cells: cells,
        row: rowElm
      };
    };

    return {
      splitAt: splitAt
    };
  }
);
