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
  'tinymce.themes.modern.Theme',
  [
    'global!window',
    'tinymce.core.ThemeManager',
    'tinymce.themes.modern.api.ThemeApi',
    'tinymce.ui.Api',
    'tinymce.ui.FormatControls'
  ],
  function (window, ThemeManager, ThemeApi, Api, FormatControls) {
    Api.registerToFactory();
    Api.appendTo(window.tinymce ? window.tinymce : {});

    ThemeManager.add('modern', function (editor) {
      FormatControls.setup(editor);
      return ThemeApi.get(editor);
    });

    return function () { };
  }
);
