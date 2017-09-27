/**
 * DateTimeHelper.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.core.DateTimeHelper',
  [
  ],
  function () {
    var addZeros = function (value, len) {
      value = "" + value;

      if (value.length < len) {
        for (var i = 0; i < (len - value.length); i++) {
          value = "0" + value;
        }
      }

      return value;
    };

    var getDateTime = function (editor, fmt, date) {
      var daysShort = "Sun Mon Tue Wed Thu Fri Sat Sun".split(' ');
      var daysLong = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday".split(' ');
      var monthsShort = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ');
      var monthsLong = "January February March April May June July August September October November December".split(' ');

      date = date || new Date();

      fmt = fmt.replace("%D", "%m/%d/%Y");
      fmt = fmt.replace("%r", "%I:%M:%S %p");
      fmt = fmt.replace("%Y", "" + date.getFullYear());
      fmt = fmt.replace("%y", "" + date.getYear());
      fmt = fmt.replace("%m", addZeros(date.getMonth() + 1, 2));
      fmt = fmt.replace("%d", addZeros(date.getDate(), 2));
      fmt = fmt.replace("%H", "" + addZeros(date.getHours(), 2));
      fmt = fmt.replace("%M", "" + addZeros(date.getMinutes(), 2));
      fmt = fmt.replace("%S", "" + addZeros(date.getSeconds(), 2));
      fmt = fmt.replace("%I", "" + ((date.getHours() + 11) % 12 + 1));
      fmt = fmt.replace("%p", "" + (date.getHours() < 12 ? "AM" : "PM"));
      fmt = fmt.replace("%B", "" + editor.translate(monthsLong[date.getMonth()]));
      fmt = fmt.replace("%b", "" + editor.translate(monthsShort[date.getMonth()]));
      fmt = fmt.replace("%A", "" + editor.translate(daysLong[date.getDay()]));
      fmt = fmt.replace("%a", "" + editor.translate(daysShort[date.getDay()]));
      fmt = fmt.replace("%%", "%");

      return fmt;
    };

    return {
      getDateTime: getDateTime
    };
  }
);
