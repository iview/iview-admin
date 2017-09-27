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
  'tinymce.plugins.pagebreak.core.ResolveName',
  [
    'tinymce.plugins.pagebreak.core.FilterContent'
  ],
  function (FilterContent) {
    var setup = function (editor) {
      editor.on('ResolveName', function (e) {
        if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, FilterContent.getPageBreakClass())) {
          e.name = 'pagebreak';
        }
      });
    };

    return {
      setup: setup
    };
  }
);
