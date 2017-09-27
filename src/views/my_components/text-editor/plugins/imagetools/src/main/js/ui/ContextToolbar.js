/**
 * ContextToolbar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.ui.ContextToolbar',
  [
    'ephox.katamari.api.Fun',
    'tinymce.plugins.imagetools.api.Settings',
    'tinymce.plugins.imagetools.core.Actions'
  ],
  function (Fun, Settings, Actions) {
    var register = function (editor) {
      editor.addContextToolbar(
        Fun.curry(Actions.isEditableImage, editor),
        Settings.getToolbarItems(editor)
      );
    };

    return {
      register: register
    };
  }
);
