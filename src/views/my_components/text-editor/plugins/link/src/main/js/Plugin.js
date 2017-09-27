/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.link.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.link.api.Commands',
    'tinymce.plugins.link.core.Actions',
    'tinymce.plugins.link.core.Keyboard',
    'tinymce.plugins.link.ui.Controls'
  ],
  function (PluginManager, Commands, Actions, Keyboard, Controls) {
    PluginManager.add('link', function (editor) {
      Controls.setupButtons(editor);
      Controls.setupMenuItems(editor);
      Controls.setupContextToolbars(editor);
      Actions.setupGotoLinks(editor);
      Commands.register(editor);
      Keyboard.setup(editor);
    });

    return function () { };
  }
);