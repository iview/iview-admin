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
  'tinymce.plugins.fullpage.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.fullpage.api.Commands',
    'tinymce.plugins.fullpage.core.FilterContent',
    'tinymce.plugins.fullpage.ui.Buttons'
  ],
  function (Cell, PluginManager, Commands, FilterContent, Buttons) {
    PluginManager.add('fullpage', function (editor) {
      var headState = Cell(''), footState = Cell('');

      Commands.register(editor, headState);
      Buttons.register(editor);
      FilterContent.setup(editor, headState, footState);
    });

    return function () { };
  }
);