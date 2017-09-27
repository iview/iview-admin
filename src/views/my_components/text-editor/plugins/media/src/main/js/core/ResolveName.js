/**
 * ResolveName.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.ResolveName',
  [
  ],
  function () {
    var setup = function (editor) {
      editor.on('ResolveName', function (e) {
        var name;

        if (e.target.nodeType === 1 && (name = e.target.getAttribute("data-mce-object"))) {
          e.name = name;
        }
      });
    };

    return {
      setup: setup
    };
  }
);

