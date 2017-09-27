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
  'tinymce.plugins.paste.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.paste.api.Api',
    'tinymce.plugins.paste.api.Commands',
    'tinymce.plugins.paste.core.Clipboard',
    'tinymce.plugins.paste.core.CutCopy',
    'tinymce.plugins.paste.core.DragDrop',
    'tinymce.plugins.paste.core.PrePostProcess',
    'tinymce.plugins.paste.core.Quirks',
    'tinymce.plugins.paste.ui.Buttons',
    'tinymce.plugins.spellchecker.core.DetectProPlugin'
  ],
  function (Cell, PluginManager, Api, Commands, Clipboard, CutCopy, DragDrop, PrePostProcess, Quirks, Buttons, DetectProPlugin) {
    var userIsInformedState = Cell(false);

    PluginManager.add('paste', function (editor) {
      var clipboard = new Clipboard(editor);
      var quirks = Quirks.setup(editor);
      var draggingInternallyState = Cell(false);

      if (DetectProPlugin.hasProPlugin(editor) === false) {
        Buttons.register(editor, clipboard);
        Commands.register(editor, clipboard, userIsInformedState);
        PrePostProcess.setup(editor);
        CutCopy.register(editor);
        DragDrop.setup(editor, clipboard, draggingInternallyState);
      }

      return Api.get(clipboard, quirks);
    });

    return function () { };
  }
);