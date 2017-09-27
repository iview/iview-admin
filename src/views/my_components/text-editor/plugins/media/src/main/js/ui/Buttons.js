/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('media', {
        tooltip: 'Insert/edit media',
        cmd: 'mceMedia',
        stateSelector: ['img[data-mce-object]', 'span[data-mce-object]', 'div[data-ephox-embed-iri]']
      });

      editor.addMenuItem('media', {
        icon: 'media',
        text: 'Media',
        cmd: 'mceMedia',
        context: 'insert',
        prependToContext: true
      });
    };

    return {
      register: register
    };
  }
);

