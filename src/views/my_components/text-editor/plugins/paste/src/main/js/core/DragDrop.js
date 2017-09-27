/**
 * DragDrop.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.paste.core.DragDrop',
  [
    'tinymce.core.dom.RangeUtils',
    'tinymce.core.util.Delay',
    'tinymce.plugins.paste.api.Settings',
    'tinymce.plugins.paste.core.InternalHtml',
    'tinymce.plugins.paste.core.Utils'
  ],
  function (RangeUtils, Delay, Settings, InternalHtml, Utils) {
    var getCaretRangeFromEvent = function (editor, e) {
      return RangeUtils.getCaretRangeFromPoint(e.clientX, e.clientY, editor.getDoc());
    };

    var isPlainTextFileUrl = function (content) {
      var plainTextContent = content['text/plain'];
      return plainTextContent ? plainTextContent.indexOf('file://') === 0 : false;
    };

    var setup = function (editor, clipboard, draggingInternallyState) {
      // Block all drag/drop events
      if (Settings.shouldBlockDrop(editor)) {
        editor.on('dragend dragover draggesture dragdrop drop drag', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }

      // Prevent users from dropping data images on Gecko
      if (!Settings.shouldPasteDataImages(editor)) {
        editor.on('drop', function (e) {
          var dataTransfer = e.dataTransfer;

          if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
            e.preventDefault();
          }
        });
      }

      editor.on('dragstart dragend', function (e) {
        draggingInternallyState.set(e.type === 'dragstart');
      });

      editor.on('drop', function (e) {
        var dropContent, rng;

        rng = getCaretRangeFromEvent(editor, e);

        if (e.isDefaultPrevented() || draggingInternallyState.get()) {
          return;
        }

        dropContent = clipboard.getDataTransferItems(e.dataTransfer);
        var internal = clipboard.hasContentType(dropContent, InternalHtml.internalHtmlMime());

        if ((!clipboard.hasHtmlOrText(dropContent) || isPlainTextFileUrl(dropContent)) && clipboard.pasteImageData(e, rng)) {
          return;
        }

        if (rng && Settings.shouldFilterDrop(editor)) {
          var content = dropContent['mce-internal'] || dropContent['text/html'] || dropContent['text/plain'];

          if (content) {
            e.preventDefault();

            // FF 45 doesn't paint a caret when dragging in text in due to focus call by execCommand
            Delay.setEditorTimeout(editor, function () {
              editor.undoManager.transact(function () {
                if (dropContent['mce-internal']) {
                  editor.execCommand('Delete');
                }

                editor.selection.setRng(rng);

                content = Utils.trimHtml(content);

                if (!dropContent['text/html']) {
                  clipboard.pasteText(content);
                } else {
                  clipboard.pasteHtml(content, internal);
                }
              });
            });
          }
        }
      });

      editor.on('dragover dragend', function (e) {
        if (Settings.shouldPasteDataImages(editor)) {
          e.preventDefault();
        }
      });
    };

    return {
      setup: setup
    };
  }
);