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
  'tinymce.themes.inlite.ui.Toolbar',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.ui.Factory',
    'tinymce.themes.inlite.alien.Type'
  ],
  function (Tools, Factory, Type) {
    var getSelectorStateResult = function (itemName, item) {
      var result = function (selector, handler) {
        return {
          selector: selector,
          handler: handler
        };
      };

      var activeHandler = function (state) {
        item.active(state);
      };

      var disabledHandler = function (state) {
        item.disabled(state);
      };

      if (item.settings.stateSelector) {
        return result(item.settings.stateSelector, activeHandler);
      }

      if (item.settings.disabledStateSelector) {
        return result(item.settings.disabledStateSelector, disabledHandler);
      }

      return null;
    };

    var bindSelectorChanged = function (editor, itemName, item) {
      return function () {
        var result = getSelectorStateResult(itemName, item);
        if (result !== null) {
          editor.selection.selectorChanged(result.selector, result.handler);
        }
      };
    };

    var itemsToArray = function (items) {
      if (Type.isArray(items)) {
        return items;
      } else if (Type.isString(items)) {
        return items.split(/[ ,]/);
      }

      return [];
    };

    var create = function (editor, name, items) {
      var toolbarItems = [], buttonGroup;

      if (!items) {
        return;
      }

      Tools.each(itemsToArray(items), function (item) {
        var itemName;

        if (item == '|') {
          buttonGroup = null;
        } else {
          if (editor.buttons[item]) {
            if (!buttonGroup) {
              buttonGroup = { type: 'buttongroup', items: [] };
              toolbarItems.push(buttonGroup);
            }

            itemName = item;
            item = editor.buttons[itemName];

            if (typeof item == 'function') {
              item = item();
            }

            item.type = item.type || 'button';

            item = Factory.create(item);
            item.on('postRender', bindSelectorChanged(editor, itemName, item));
            buttonGroup.items.push(item);
          }
        }
      });

      return Factory.create({
        type: 'toolbar',
        layout: 'flow',
        name: name,
        items: toolbarItems
      });
    };

    return {
      create: create
    };
  }
);
