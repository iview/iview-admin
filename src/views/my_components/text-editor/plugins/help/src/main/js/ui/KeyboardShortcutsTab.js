/**
 * KeyboardShortcutsTab.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.help.ui.KeyboardShortcutsTab',
  [
    'ephox.katamari.api.Arr',
    'tinymce.core.util.I18n',
    'tinymce.plugins.help.data.KeyboardShortcuts'
  ],
  function (Arr, I18n, KeyboardShortcuts) {
    var makeTab = function () {
      var makeAriaLabel = function (shortcut) {
        return 'aria-label="Action: ' + shortcut.action + ', Shortcut: ' + shortcut.shortcut.replace(/Ctrl/g, 'Control') + '"';
      };
      var shortcutLisString = Arr.map(KeyboardShortcuts.shortcuts, function (shortcut) {
        return '<tr data-mce-tabstop="1" tabindex="-1" ' + makeAriaLabel(shortcut) + '>' +
                  '<td>' + I18n.translate(shortcut.action) + '</td>' +
                  '<td>' + shortcut.shortcut + '</td>' +
                '</tr>';
      }).join('');

      return {
        title: 'Handy Shortcuts',
        type: 'container',
        style: 'overflow-y: auto; overflow-x: hidden; max-height: 250px',
        items: [
          {
            type: 'container',
            html: '<div>' +
                    '<table class="mce-table-striped">' +
                      '<thead>' +
                        '<th>' + I18n.translate('Action') + '</th>' +
                        '<th>' + I18n.translate('Shortcut') + '</th>' +
                      '</thead>' +
                      shortcutLisString +
                    '</table>' +
                  '</div>'
          }
        ]
      };
    };

    return {
      makeTab: makeTab
    };
  });
