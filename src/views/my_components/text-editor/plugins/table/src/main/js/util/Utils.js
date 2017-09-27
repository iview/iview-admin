/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Various utility functions.
 *
 * @class tinymce.table.util.Utils
 * @private
 */
define(
  'tinymce.plugins.table.util.Utils',
  [
    'tinymce.core.Env'
  ],
  function (Env) {
    var setSpanVal = function (name) {
      return function (td, val) {
        if (td) {
          val = parseInt(val, 10);

          if (val === 1 || val === 0) {
            td.removeAttribute(name, 1);
          } else {
            td.setAttribute(name, val, 1);
          }
        }
      };
    };

    var getSpanVal = function (name) {
      return function (td) {
        return parseInt(td.getAttribute(name) || 1, 10);
      };
    };

    function paddCell(cell) {
      if (!Env.ie || Env.ie > 9) {
        if (!cell.hasChildNodes()) {
          cell.innerHTML = '<br data-mce-bogus="1" />';
        }
      }
    }

    return {
      setColSpan: setSpanVal('colSpan'),
      setRowSpan: setSpanVal('rowspan'),
      getColSpan: getSpanVal('colSpan'),
      getRowSpan: getSpanVal('rowSpan'),
      setSpanVal: function (td, name, value) {
        setSpanVal(name)(td, value);
      },
      getSpanVal: function (td, name) {
        return getSpanVal(name)(td);
      },
      paddCell: paddCell
    };
  }
);
