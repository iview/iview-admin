/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class contains all core logic for the autosave plugin.
 *
 * @class tinymce.autosave.Plugin
 * @private
 */
define(
  'tinymce.plugins.autosave.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.autosave.api.Api',
    'tinymce.plugins.autosave.core.BeforeUnload',
    'tinymce.plugins.autosave.ui.Buttons'
  ],
  function (Cell, PluginManager, Api, BeforeUnload, Buttons) {
    PluginManager.add('autosave', function (editor) {
      var started = Cell(false);

      BeforeUnload.setup(editor);
      Buttons.register(editor, started);

      return Api.get(editor);
    });

    return function () { };
  }
);