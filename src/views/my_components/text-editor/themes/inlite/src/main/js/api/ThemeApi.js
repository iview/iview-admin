/**
 * ThemeApi.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.api.ThemeApi',
  [
    'tinymce.themes.inlite.core.Render',
    'tinymce.ui.NotificationManagerImpl',
    'tinymce.ui.WindowManagerImpl'
  ],
  function (Render, NotificationManagerImpl, WindowManagerImpl) {
    var get = function (editor, panel) {
      var renderUI = function () {
        return Render.renderUI(editor, panel);
      };

      return {
        renderUI: renderUI,
        getNotificationManagerImpl: function () {
          return NotificationManagerImpl(editor);
        },
        getWindowManagerImpl: function () {
          return WindowManagerImpl(editor);
        }
      };
    };

    return {
      get: get
    };
  }
);
