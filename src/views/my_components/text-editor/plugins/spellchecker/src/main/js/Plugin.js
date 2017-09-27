/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.spellchecker.api.Api',
    'tinymce.plugins.spellchecker.api.Commands',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.DetectProPlugin',
    'tinymce.plugins.spellchecker.ui.Buttons',
    'tinymce.plugins.spellchecker.ui.SuggestionsMenu'
  ],
  function (Cell, PluginManager, Api, Commands, Settings, DetectProPlugin, Buttons, SuggestionsMenu) {
    PluginManager.add('spellchecker', function (editor, pluginUrl) {
      var startedState = Cell(false);
      var currentLanguageState = Cell(Settings.getLanguage(editor));
      var textMatcherState = Cell(null);
      var lastSuggestionsState = Cell({});

      if (DetectProPlugin.hasProPlugin(editor) === false) {
        Buttons.register(editor, pluginUrl, startedState, textMatcherState, currentLanguageState, lastSuggestionsState);
        SuggestionsMenu.setup(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState);
        Commands.register(editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState);
      }

      return Api.get(editor, startedState, lastSuggestionsState, textMatcherState, pluginUrl);
    });

    return function () { };
  }
);