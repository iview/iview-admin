/**
 * DetectProPlugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.core.DetectProPlugin',
  [
    'global!window',
    'tinymce.core.PluginManager'
  ],
  function (window, PluginManager) {
    var hasProPlugin = function (editor) {
      // draw back if power version is requested and registered
      if (/(^|[ ,])tinymcespellchecker([, ]|$)/.test(editor.settings.plugins) && PluginManager.get('tinymcespellchecker')) {
        /*eslint no-console:0 */
        if (typeof window.console !== "undefined" && window.console.log) {
          window.console.log(
            "Spell Checker Pro is incompatible with Spell Checker plugin! " +
            "Remove 'spellchecker' from the 'plugins' option."
          );
        }
        return true;
      } else {
        return false;
      }
    };

    return {
      hasProPlugin: hasProPlugin
    };
  }
);
