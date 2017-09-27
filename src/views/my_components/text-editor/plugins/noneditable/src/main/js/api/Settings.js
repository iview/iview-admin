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
  'tinymce.plugins.noneditable.api.Settings',
  [
  ],
  function () {
    var getNonEditableClass = function (editor) {
      return editor.getParam('noneditable_noneditable_class', 'mceNonEditable');
    };

    var getEditableClass = function (editor) {
      return editor.getParam('noneditable_editable_class', 'mceEditable');
    };

    var getNonEditableRegExps = function (editor) {
      var nonEditableRegExps = editor.getParam('noneditable_regexp', []);

      if (nonEditableRegExps && nonEditableRegExps.constructor === RegExp) {
        return [nonEditableRegExps];
      } else {
        return nonEditableRegExps;
      }
    };

    return {
      getNonEditableClass: getNonEditableClass,
      getEditableClass: getEditableClass,
      getNonEditableRegExps: getNonEditableRegExps
    };
  }
);