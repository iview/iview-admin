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
  'tinymce.plugins.textpattern.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.textpattern.api.Api',
    'tinymce.plugins.textpattern.api.Settings',
    'tinymce.plugins.textpattern.core.Keyboard'
  ],
  function (Cell, PluginManager, Api, Settings, Keyboard) {
    PluginManager.add('textpattern', function (editor) {
      var patternsState = Cell(Settings.getPatterns(editor.settings));

      Keyboard.setup(editor, patternsState);

      return Api.get(patternsState);
    });

    return function () { };
  }
);