/**
 * Toolbar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.Toolbar',
  [
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.themes.modern.api.Settings'
  ],
  function (Factory, Tools, Settings) {
    var createToolbar = function (editor, items, size) {
      var toolbarItems = [], buttonGroup;

      if (!items) {
        return;
      }

      Tools.each(items.split(/[ ,]/), function (item) {
        var itemName;

        var bindSelectorChanged = function () {
          var selection = editor.selection;

          if (item.settings.stateSelector) {
            selection.selectorChanged(item.settings.stateSelector, function (state) {
              item.active(state);
            }, true);
          }

          if (item.settings.disabledStateSelector) {
            selection.selectorChanged(item.settings.disabledStateSelector, function (state) {
              item.disabled(state);
            });
          }
        };

        if (item === "|") {
          buttonGroup = null;
        } else {
          if (!buttonGroup) {
            buttonGroup = { type: 'buttongroup', items: [] };
            toolbarItems.push(buttonGroup);
          }

          if (editor.buttons[item]) {
            // TODO: Move control creation to some UI class
            itemName = item;
            item = editor.buttons[itemName];

            if (typeof item === "function") {
              item = item();
            }

            item.type = item.type || 'button';
            item.size = size;

            item = Factory.create(item);
            buttonGroup.items.push(item);

            if (editor.initialized) {
              bindSelectorChanged();
            } else {
              editor.on('init', bindSelectorChanged);
            }
          }
        }
      });

      return {
        type: 'toolbar',
        layout: 'flow',
        items: toolbarItems
      };
    };

    /**
     * Creates the toolbars from config and returns a toolbar array.
     *
     * @param {String} size Optional toolbar item size.
     * @return {Array} Array with toolbars.
     */
    var createToolbars = function (editor, size) {
      var toolbars = [];

      var addToolbar = function (items) {
        if (items) {
          toolbars.push(createToolbar(editor, items, size));
        }
      };

      Tools.each(Settings.getToolbars(editor), function (toolbar) {
        addToolbar(toolbar);
      });

      if (toolbars.length) {
        return {
          type: 'panel',
          layout: 'stack',
          classes: "toolbar-grp",
          ariaRoot: true,
          ariaRemember: true,
          items: toolbars
        };
      }
    };

    return {
      createToolbar: createToolbar,
      createToolbars: createToolbars
    };
  }
);
