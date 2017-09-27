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
  'tinymce.plugins.importcss.api.Settings',
  [
  ],
  function () {
    var shouldMergeClasses = function (editor) {
      return editor.getParam('importcss_merge_classes');
    };

    var shouldImportExclusive = function (editor) {
      return editor.getParam('importcss_exclusive');
    };

    var getSelectorConverter = function (editor) {
      return editor.getParam('importcss_selector_converter');
    };

    var getSelectorFilter = function (editor) {
      return editor.getParam('importcss_selector_filter');
    };

    var getCssGroups = function (editor) {
      return editor.getParam('importcss_groups');
    };

    var shouldAppend = function (editor) {
      return editor.getParam('importcss_append');
    };

    var getFileFilter = function (editor) {
      return editor.getParam('importcss_file_filter');
    };

    return {
      shouldMergeClasses: shouldMergeClasses,
      shouldImportExclusive: shouldImportExclusive,
      getSelectorConverter: getSelectorConverter,
      getSelectorFilter: getSelectorFilter,
      getCssGroups: getCssGroups,
      shouldAppend: shouldAppend,
      getFileFilter: getFileFilter
    };
  }
);