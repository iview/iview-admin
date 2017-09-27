/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.api.Events',
  [
  ],
  function () {
    var firePastePreProcess = function (editor, html, internal, isWordHtml) {
      return editor.fire('PastePreProcess', { content: html, internal: internal, wordContent: isWordHtml });
    };

    var firePastePostProcess = function (editor, node, internal, isWordHtml) {
      return editor.fire('PastePostProcess', { node: node, internal: internal, wordContent: isWordHtml });
    };

    var firePastePlainTextToggle = function (editor, state) {
      return editor.fire('PastePlainTextToggle', { state: state });
    };

    var firePaste = function (editor, ieFake) {
      return editor.fire('paste', { ieFake: ieFake });
    };

    return {
      firePastePreProcess: firePastePreProcess,
      firePastePostProcess: firePastePostProcess,
      firePastePlainTextToggle: firePastePlainTextToggle,
      firePaste: firePaste
    };
  }
);
