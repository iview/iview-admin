/**
 * Languages.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.Languages',
  [
    'tinymce.plugins.codesample.api.Settings',
    'tinymce.plugins.codesample.core.CodeSample'
  ],
  function (Settings, CodeSample) {
    var getLanguages = function (editor) {
      var defaultLanguages = [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' }
      ];

      var customLanguages = Settings.getLanguages(editor);
      return customLanguages ? customLanguages : defaultLanguages;
    };

    var getCurrentLanguage = function (editor) {
      var matches, node = CodeSample.getSelectedCodeSample(editor);

      if (node) {
        matches = node.className.match(/language-(\w+)/);
        return matches ? matches[1] : '';
      }

      return '';
    };

    return {
      getLanguages: getLanguages,
      getCurrentLanguage: getCurrentLanguage
    };
  }
);