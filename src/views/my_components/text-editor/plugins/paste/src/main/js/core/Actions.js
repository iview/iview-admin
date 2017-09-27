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
  'tinymce.plugins.paste.core.Actions',
  [
    'tinymce.plugins.paste.api.Events',
    'tinymce.plugins.paste.api.Settings'
  ],
  function (Events, Settings) {
    var isUserInformedAboutPlainText = function (editor, userIsInformedState) {
      return userIsInformedState.get() || Settings.shouldPlainTextInform(editor);
    };

    var displayNotification = function (editor, message) {
      editor.notificationManager.open({
        text: editor.translate(message),
        type: 'info'
      });
    };

    var togglePlainTextPaste = function (editor, clipboard, userIsInformedState) {
      if (clipboard.pasteFormat === "text") {
        clipboard.pasteFormat = "html";
        Events.firePastePlainTextToggle(editor, false);
      } else {
        clipboard.pasteFormat = "text";
        Events.firePastePlainTextToggle(editor, true);

        if (!isUserInformedAboutPlainText(editor, userIsInformedState)) {
          displayNotification(editor, 'Paste is now in plain text mode. Contents will now be pasted as plain text until you toggle this option off.');
          userIsInformedState.set(true);
        }
      }

      editor.focus();
    };

    return {
      togglePlainTextPaste: togglePlainTextPaste
    };
  }
);