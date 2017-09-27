/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.api.Settings',
  [
  ],
  function () {
    var getLanguages = function (editor) {
      var defaultLanguages = 'English=en,Danish=da,Dutch=nl,Finnish=fi,French=fr_FR,German=de,Italian=it,Polish=pl,Portuguese=pt_BR,Spanish=es,Swedish=sv';
      return editor.getParam('spellchecker_languages', defaultLanguages);
    };

    var getLanguage = function (editor) {
      var defaultLanguage = editor.getParam('language', 'en');
      return editor.getParam('spellchecker_language', defaultLanguage);
    };

    var getRpcUrl = function (editor) {
      return editor.getParam('spellchecker_rpc_url');
    };

    var getSpellcheckerCallback = function (editor) {
      return editor.getParam('spellchecker_callback');
    };

    var getSpellcheckerWordcharPattern = function (editor) {
      var defaultPattern = new RegExp("[^" +
      "\\s!\"#$%&()*+,-./:;<=>?@[\\]^_{|}`" +
      "\u00a7\u00a9\u00ab\u00ae\u00b1\u00b6\u00b7\u00b8\u00bb" +
      "\u00bc\u00bd\u00be\u00bf\u00d7\u00f7\u00a4\u201d\u201c\u201e\u00a0\u2002\u2003\u2009" +
      "]+", "g");
      return editor.getParam('spellchecker_wordchar_pattern', defaultPattern);
    };

    return {
      getLanguages: getLanguages,
      getLanguage: getLanguage,
      getRpcUrl: getRpcUrl,
      getSpellcheckerCallback: getSpellcheckerCallback,
      getSpellcheckerWordcharPattern: getSpellcheckerWordcharPattern
    };
  }
);