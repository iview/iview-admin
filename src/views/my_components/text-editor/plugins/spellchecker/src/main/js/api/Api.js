/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.api.Api',
  [
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (Settings, Actions) {
    var get = function (editor, startedState, lastSuggestionsState, textMatcherState, url) {
      var getLanguage = function () {
        return Settings.getLanguage(editor);
      };

      var getWordCharPattern = function () {
        return Settings.getSpellcheckerWordcharPattern(editor);
      };

      var markErrors = function (data) {
        Actions.markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };

      var getTextMatcher = function () {
        return textMatcherState.get();
      };

      return {
        getTextMatcher: getTextMatcher,
        getWordCharPattern: getWordCharPattern,
        markErrors: markErrors,
        getLanguage: getLanguage
      };
    };

    return {
      get: get
    };
  }
);