/**
 * SkinLoader.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.core.SkinLoader',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.EditorManager',
    'tinymce.themes.inlite.api.Events',
    'tinymce.themes.inlite.api.Settings'
  ],
  function (DOMUtils, EditorManager, Events, Settings) {
    var fireSkinLoaded = function (editor, callback) {
      var done = function () {
        editor._skinLoaded = true;
        Events.fireSkinLoaded(editor);
        callback();
      };

      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };

    var load = function (editor, callback) {
      var skinUrl = Settings.getSkinUrl(editor);

      var done = function () {
        fireSkinLoaded(editor, callback);
      };

      DOMUtils.DOM.styleSheetLoader.load(skinUrl + '/skin.min.css', done);
      editor.contentCSS.push(skinUrl + '/content.inline.min.css');
    };

    return {
      load: load
    };
  }
);


