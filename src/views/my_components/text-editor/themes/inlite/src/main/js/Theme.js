/**
 * Theme.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.Theme',
  [
    'global!window',
    'tinymce.core.ThemeManager',
    'tinymce.themes.inlite.api.ThemeApi',
    'tinymce.themes.inlite.ui.Buttons',
    'tinymce.themes.inlite.ui.Panel',
    'tinymce.ui.Api',
    'tinymce.ui.FormatControls'
  ],
  function (window, ThemeManager, ThemeApi, Buttons, Panel, Api, FormatControls) {
    Api.registerToFactory();
    Api.appendTo(window.tinymce ? window.tinymce : {});

    ThemeManager.add('inlite', function (editor) {
      var panel = new Panel();

      FormatControls.setup(editor);
      Buttons.addToEditor(editor, panel);

      return ThemeApi.get(editor, panel);
    });

    return function () { };
  }
);
