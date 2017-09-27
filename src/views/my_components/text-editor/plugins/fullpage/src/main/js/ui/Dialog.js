/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.fullpage.ui.Dialog',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.fullpage.core.Parser'
  ],
  function (Tools, Parser) {
    var open = function (editor, headState) {
      var data = Parser.htmlToData(editor, headState.get());

      editor.windowManager.open({
        title: 'Document properties',
        data: data,
        defaults: { type: 'textbox', size: 40 },
        body: [
          { name: 'title', label: 'Title' },
          { name: 'keywords', label: 'Keywords' },
          { name: 'description', label: 'Description' },
          { name: 'robots', label: 'Robots' },
          { name: 'author', label: 'Author' },
          { name: 'docencoding', label: 'Encoding' }
        ],
        onSubmit: function (e) {
          var headHtml = Parser.dataToHtml(editor, Tools.extend(data, e.data), headState.get());
          headState.set(headHtml);
        }
      });
    };

    return {
      open: open
    };
  }
);
