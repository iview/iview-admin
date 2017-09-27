/**
 * KeyboardShortcuts.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.help.data.KeyboardShortcuts',
  [
    'tinymce.core.Env'
  ],
  function (Env) {
    var meta = Env.mac ? '\u2318' : 'Ctrl';
    var access = Env.mac ? 'Ctrl + Alt' : 'Shift + Alt';

    var shortcuts = [
      { shortcut: meta + ' + B', action: 'Bold' },
      { shortcut: meta + ' + I', action: 'Italic' },
      { shortcut: meta + ' + U', action: 'Underline' },
      { shortcut: meta + ' + A', action: 'Select all' },
      { shortcut: meta + ' + Y or ' + meta + ' + Shift + Z', action: 'Redo' },
      { shortcut: meta + ' + Z', action: 'Undo' },
      { shortcut: access + ' + 1', action: 'Header 1' },
      { shortcut: access + ' + 2', action: 'Header 2' },
      { shortcut: access + ' + 3', action: 'Header 3' },
      { shortcut: access + ' + 4', action: 'Header 4' },
      { shortcut: access + ' + 5', action: 'Header 5' },
      { shortcut: access + ' + 6', action: 'Header 6' },
      { shortcut: access + ' + 7', action: 'Paragraph' },
      { shortcut: access + ' + 8', action: 'Div' },
      { shortcut: access + ' + 9', action: 'Address' },
      { shortcut: 'Alt + F9', action: 'Focus to menubar' },
      { shortcut: 'Alt + F10', action: 'Focus to toolbar' },
      { shortcut: 'Alt + F11', action: 'Focus to element path' },
      {
        shortcut: 'Ctrl + Shift + P > Ctrl + Shift + P',
        action: 'Focus to contextual toolbar'
      },
      { shortcut: meta + ' + K', action: 'Insert link (if link plugin activated)' },
      { shortcut: meta + ' + S', action: 'Save (if save plugin activated)' },
      { shortcut: meta + ' + F', action: 'Find (if searchreplace plugin activated)' }
    ];

    return {
      shortcuts: shortcuts
    };
  });
