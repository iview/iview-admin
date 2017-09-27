/**
 * SkinLoaded.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.SkinLoaded', [
    'tinymce.themes.modern.api.Events'
  ],
  function (Events) {
    var fireSkinLoaded = function (editor) {
      var done = function () {
        editor._skinLoaded = true;
        Events.fireSkinLoaded(editor);
      };

      return function () {
        if (editor.initialized) {
          done();
        } else {
          editor.on('init', done);
        }
      };
    };

    return {
      fireSkinLoaded: fireSkinLoaded
    };
  }
);
