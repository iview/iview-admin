/**
 * EditorSettings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.alien.EditorSettings',
  [
    'tinymce.themes.inlite.alien.Type'
  ],
  function (Type) {
    var validDefaultOrDie = function (value, predicate) {
      if (predicate(value)) {
        return true;
      }

      throw new Error('Default value doesn\'t match requested type.');
    };

    var getByTypeOr = function (predicate) {
      return function (editor, name, defaultValue) {
        var settings = editor.settings;
        validDefaultOrDie(defaultValue, predicate);
        return name in settings && predicate(settings[name]) ? settings[name] : defaultValue;
      };
    };

    var splitNoEmpty = function (str, delim) {
      return str.split(delim).filter(function (item) {
        return item.length > 0;
      });
    };

    var itemsToArray = function (value, defaultValue) {
      var stringToItemsArray = function (value) {
        return typeof value === 'string' ? splitNoEmpty(value, /[ ,]/) : value;
      };

      var boolToItemsArray = function (value, defaultValue) {
        return value === false ? [] : defaultValue;
      };

      if (Type.isArray(value)) {
        return value;
      } else if (Type.isString(value)) {
        return stringToItemsArray(value);
      } else if (Type.isBoolean(value)) {
        return boolToItemsArray(value, defaultValue);
      }

      return defaultValue;
    };

    var getToolbarItemsOr = function (predicate) {
      return function (editor, name, defaultValue) {
        var value = name in editor.settings ? editor.settings[name] : defaultValue;
        validDefaultOrDie(defaultValue, predicate);
        return itemsToArray(value, defaultValue);
      };
    };

    return {
      // TODO: Add Option based getString, getBool if merged with core
      getStringOr: getByTypeOr(Type.isString),
      getBoolOr: getByTypeOr(Type.isBoolean),
      getNumberOr: getByTypeOr(Type.isNumber),
      getHandlerOr: getByTypeOr(Type.isFunction),
      getToolbarItemsOr: getToolbarItemsOr(Type.isArray)
    };
  }
);
