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
  'tinymce.plugins.insertdatetime.api.Settings',
  [
  ],
  function () {
    var getDateFormat = function (editor) {
      return editor.getParam('insertdatetime_dateformat', editor.translate('%Y-%m-%d'));
    };

    var getTimeFormat = function (editor) {
      return editor.getParam('insertdatetime_timeformat', editor.translate('%H:%M:%S'));
    };

    var getFormats = function (editor) {
      return editor.getParam('insertdatetime_formats', ['%H:%M:%S', '%Y-%m-%d', '%I:%M:%S %p', '%D']);
    };

    var getDefaultDateTime = function (editor) {
      var formats = getFormats(editor);
      return formats.length > 0 ? formats[0] : getTimeFormat(editor);
    };

    var shouldInsertTimeElement = function (editor) {
      return editor.getParam('insertdatetime_element', false);
    };

    return {
      getDateFormat: getDateFormat,
      getTimeFormat: getTimeFormat,
      getFormats: getFormats,
      getDefaultDateTime: getDefaultDateTime,
      shouldInsertTimeElement: shouldInsertTimeElement
    };
  }
);
