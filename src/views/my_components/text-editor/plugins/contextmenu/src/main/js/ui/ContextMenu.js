/**
 * ContextMenu.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.contextmenu.ui.ContextMenu',
  [
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.plugins.contextmenu.api.Settings'
  ],
  function (Factory, Tools, Settings) {
    var renderMenu = function (editor, visibleState) {
      var menu, contextmenu, items = [];

      contextmenu = Settings.getContextMenu(editor);
      Tools.each(contextmenu.split(/[ ,]/), function (name) {
        var item = editor.menuItems[name];

        if (name === '|') {
          item = { text: name };
        }

        if (item) {
          item.shortcut = ''; // Hide shortcuts
          items.push(item);
        }
      });

      for (var i = 0; i < items.length; i++) {
        if (items[i].text === '|') {
          if (i === 0 || i === items.length - 1) {
            items.splice(i, 1);
          }
        }
      }

      menu = Factory.create('menu', {
        items: items,
        context: 'contextmenu',
        classes: 'contextmenu'
      }).renderTo();

      menu.on('hide', function (e) {
        if (e.control === this) {
          visibleState.set(false);
        }
      });

      editor.on('remove', function () {
        menu.remove();
        menu = null;
      });

      return menu;
    };

    var show = function (editor, x, y, visibleState, menu) {
      if (menu.get() === null) {
        menu.set(renderMenu(editor, visibleState));
      } else {
        menu.get().show();
      }

      menu.get().moveTo(x, y);
      visibleState.set(true);
    };

    return {
      show: show
    };
  }
);