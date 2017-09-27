/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.charmap.core.Actions',
  [
    'tinymce.plugins.charmap.api.Events'
  ],
  function (Events) {
    var insertChar = function (editor, chr) {
      var evtChr = Events.fireInsertCustomChar(editor, chr).chr;
      editor.execCommand('mceInsertContent', false, evtChr);
    };

    return {
      insertChar: insertChar
    };
  }
);