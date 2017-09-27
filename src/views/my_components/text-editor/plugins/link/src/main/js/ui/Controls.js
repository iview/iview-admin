/**
 * Controls.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.link.ui.Controls',
  [
    'tinymce.plugins.link.core.Actions',
    'tinymce.plugins.link.core.Utils'
  ],
  function (Actions, Utils) {

    var setupButtons = function (editor) {
      editor.addButton('link', {
        icon: 'link',
        tooltip: 'Insert/edit link',
        shortcut: 'Meta+K',
        onclick: Actions.openDialog(editor),
        onpostrender: Actions.toggleActiveState(editor)
      });

      editor.addButton('unlink', {
        icon: 'unlink',
        tooltip: 'Remove link',
        onclick: Utils.unlink(editor),
        onpostrender: Actions.toggleActiveState(editor)
      });

      if (editor.addContextToolbar) {
        editor.addButton('openlink', {
          icon: 'newtab',
          tooltip: 'Open link',
          onclick: Actions.gotoSelectedLink(editor)
        });
      }
    };

    var setupMenuItems = function (editor) {
      editor.addMenuItem('openlink', {
        text: 'Open link',
        icon: 'newtab',
        onclick: Actions.gotoSelectedLink(editor),
        onPostRender: Actions.toggleViewLinkState(editor),
        prependToContext: true
      });

      editor.addMenuItem('link', {
        icon: 'link',
        text: 'Link',
        shortcut: 'Meta+K',
        onclick: Actions.openDialog(editor),
        stateSelector: 'a[href]',
        context: 'insert',
        prependToContext: true
      });
    };

    var setupContextToolbars = function (editor) {
      if (editor.addContextToolbar) {
        editor.addContextToolbar(
          Actions.leftClickedOnAHref(editor),
          'openlink | link unlink'
        );
      }
    };

    return {
      setupButtons: setupButtons,
      setupMenuItems: setupMenuItems,
      setupContextToolbars: setupContextToolbars
    };
  }
);