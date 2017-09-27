/**
 * SmartPaste.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Tries to be smart depending on what the user pastes if it looks like an url
 * it will make a link out of the current selection. If it's an image url that looks
 * like an image it will check if it's an image and insert it as an image.
 *
 * @class tinymce.pasteplugin.SmartPaste
 * @private
 */
define(
  'tinymce.plugins.paste.core.SmartPaste',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.paste.api.Settings'
  ],
  function (Tools, Settings) {
    var isAbsoluteUrl = function (url) {
      return /^https?:\/\/[\w\?\-\/+=.&%@~#]+$/i.test(url);
    };

    var isImageUrl = function (url) {
      return isAbsoluteUrl(url) && /.(gif|jpe?g|png)$/.test(url);
    };

    var createImage = function (editor, url, pasteHtml) {
      editor.undoManager.extra(function () {
        pasteHtml(editor, url);
      }, function () {
        editor.insertContent('<img src="' + url + '">');
      });

      return true;
    };

    var createLink = function (editor, url, pasteHtml) {
      editor.undoManager.extra(function () {
        pasteHtml(editor, url);
      }, function () {
        editor.execCommand('mceInsertLink', false, url);
      });

      return true;
    };

    var linkSelection = function (editor, html, pasteHtml) {
      return editor.selection.isCollapsed() === false && isAbsoluteUrl(html) ? createLink(editor, html, pasteHtml) : false;
    };

    var insertImage = function (editor, html, pasteHtml) {
      return isImageUrl(html) ? createImage(editor, html, pasteHtml) : false;
    };

    var pasteHtml = function (editor, html) {
      editor.insertContent(html, {
        merge: Settings.shouldMergeFormats(editor),
        paste: true
      });

      return true;
    };

    var smartInsertContent = function (editor, html) {
      Tools.each([
        linkSelection,
        insertImage,
        pasteHtml
      ], function (action) {
        return action(editor, html, pasteHtml) !== true;
      });
    };

    var insertContent = function (editor, html) {
      if (Settings.isSmartPasteEnabled(editor) === false) {
        pasteHtml(editor, html);
      } else {
        smartInsertContent(editor, html);
      }
    };

    return {
      isImageUrl: isImageUrl,
      isAbsoluteUrl: isAbsoluteUrl,
      insertContent: insertContent
    };
  }
);
