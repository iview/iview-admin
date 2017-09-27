/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.lists.api.Api',
  [
    'tinymce.plugins.lists.core.Delete'
  ],
  function (Delete) {
    var get = function (editor) {
      return {
        backspaceDelete: function (isForward) {
          Delete.backspaceDelete(editor, isForward);
        }
      };
    };

    return {
      get: get
    };
  }
);

