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
  'tinymce.plugins.preview.ui.Dialog',
  [
    'tinymce.core.Env',
    'tinymce.core.util.Tools',
    'tinymce.plugins.preview.api.Settings',
    'tinymce.plugins.preview.ui.IframeContent'
  ],
  function (Env, Tools, Settings, IframeContent) {
    var open = function (editor) {
      var sandbox = !Env.ie;
      var dialogHtml = '<iframe src="javascript:\'\'" frameborder="0"' + (sandbox ? ' sandbox="allow-scripts"' : '') + '></iframe>';
      var dialogWidth = Settings.getPreviewDialogWidth(editor);
      var dialogHeight = Settings.getPreviewDialogHeight(editor);

      editor.windowManager.open({
        title: 'Preview',
        width: dialogWidth,
        height: dialogHeight,
        html: dialogHtml,
        buttons: {
          text: 'Close',
          onclick: function (e) {
            e.control.parent().parent().close();
          }
        },
        onPostRender: function (e) {
          var iframeElm = e.control.getEl('body').firstChild;
          IframeContent.injectIframeContent(editor, iframeElm, sandbox);
        }
      });
    };

    return {
      open: open
    };
  }
);