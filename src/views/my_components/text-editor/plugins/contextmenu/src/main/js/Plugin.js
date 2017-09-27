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
  'tinymce.plugins.contextmenu.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.contextmenu.api.Api',
    'tinymce.plugins.contextmenu.core.Bind'
  ],
  function (Cell, PluginManager, Api, Bind) {
    PluginManager.add('contextmenu', function (editor) {
      var menu = Cell(null), visibleState = Cell(false);

      Bind.setup(editor, visibleState, menu);

      return Api.get(visibleState);
    });

    return function () { };
  }
);