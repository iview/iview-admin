/**
 * Menubar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.Menubar',
  [
    'tinymce.core.util.Tools',
    'tinymce.themes.modern.api.Settings'
  ],
  function (Tools, Settings) {
    var defaultMenus = {
      file: { title: 'File', items: 'newdocument' },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
      insert: { title: 'Insert', items: '|' },
      view: { title: 'View', items: 'visualaid |' },
      format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
      table: { title: 'Table' },
      tools: { title: 'Tools' }
    };

    var createMenuItem = function (menuItems, name) {
      var menuItem;

      if (name === '|') {
        return { text: '|' };
      }

      menuItem = menuItems[name];

      return menuItem;
    };

    var createMenu = function (editorMenuItems, menus, removedMenuItems, context) {
      var menuButton, menu, menuItems, isUserDefined;

      // User defined menu
      if (menus) {
        menu = menus[context];
        isUserDefined = true;
      } else {
        menu = defaultMenus[context];
      }

      if (menu) {
        menuButton = { text: menu.title };
        menuItems = [];

        // Default/user defined items
        Tools.each((menu.items || '').split(/[ ,]/), function (item) {
          var menuItem = createMenuItem(editorMenuItems, item);

          if (menuItem && !removedMenuItems[item]) {
            menuItems.push(createMenuItem(editorMenuItems, item));
          }
        });

        // Added though context
        if (!isUserDefined) {
          Tools.each(editorMenuItems, function (menuItem) {
            if (menuItem.context === context) {
              if (menuItem.separator === 'before') {
                menuItems.push({ text: '|' });
              }

              if (menuItem.prependToContext) {
                menuItems.unshift(menuItem);
              } else {
                menuItems.push(menuItem);
              }

              if (menuItem.separator === 'after') {
                menuItems.push({ text: '|' });
              }
            }
          });
        }

        for (var i = 0; i < menuItems.length; i++) {
          if (menuItems[i].text === '|') {
            if (i === 0 || i === menuItems.length - 1) {
              menuItems.splice(i, 1);
            }
          }
        }

        menuButton.menu = menuItems;

        if (!menuButton.menu.length) {
          return null;
        }
      }

      return menuButton;
    };

    var getDefaultMenubar = function (editor) {
      var name, defaultMenuBar = [];
      var menu = Settings.getMenu(editor);

      if (menu) {
        for (name in menu) {
          defaultMenuBar.push(name);
        }
      } else {
        for (name in defaultMenus) {
          defaultMenuBar.push(name);
        }
      }

      return defaultMenuBar;
    };

    var createMenuButtons = function (editor) {
      var menuButtons = [];
      var defaultMenuBar = getDefaultMenubar(editor);
      var removedMenuItems = Tools.makeMap(Settings.getRemovedMenuItems(editor).split(/[ ,]/));

      var menubar = Settings.getMenubar(editor);
      var enabledMenuNames = typeof menubar === "string" ? menubar.split(/[ ,]/) : defaultMenuBar;
      for (var i = 0; i < enabledMenuNames.length; i++) {
        var menuItems = enabledMenuNames[i];
        var menu = createMenu(editor.menuItems, Settings.getMenu(editor), removedMenuItems, menuItems);
        if (menu) {
          menuButtons.push(menu);
        }
      }

      return menuButtons;
    };

    return {
      createMenuButtons: createMenuButtons
    };
  }
);
