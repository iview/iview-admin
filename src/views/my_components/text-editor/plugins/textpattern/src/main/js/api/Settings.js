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
  'tinymce.plugins.textpattern.api.Settings',
  [
  ],
  function () {
    var defaultPatterns = [
      { start: '*', end: '*', format: 'italic' },
      { start: '**', end: '**', format: 'bold' },
      { start: '#', format: 'h1' },
      { start: '##', format: 'h2' },
      { start: '###', format: 'h3' },
      { start: '####', format: 'h4' },
      { start: '#####', format: 'h5' },
      { start: '######', format: 'h6' },
      { start: '1. ', cmd: 'InsertOrderedList' },
      { start: '* ', cmd: 'InsertUnorderedList' },
      { start: '- ', cmd: 'InsertUnorderedList' }
    ];

    var getPatterns = function (editorSettings) {
      return editorSettings.textpattern_patterns !== undefined ?
        editorSettings.textpattern_patterns :
        defaultPatterns;
    };

    return {
      getPatterns: getPatterns
    };
  }
);
