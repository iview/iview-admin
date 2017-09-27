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
  'tinymce.plugins.searchreplace.api.Api',
  [
    'tinymce.plugins.searchreplace.core.Actions'
  ],
  function (Actions) {
    var get = function (editor, currentIndexState) {
      var done = function (keepEditorSelection) {
        return Actions.done(editor, currentIndexState, keepEditorSelection);
      };

      var find = function (text, matchCase, wholeWord) {
        return Actions.find(editor, currentIndexState, text, matchCase, wholeWord);
      };

      var next = function () {
        return Actions.next(editor, currentIndexState);
      };

      var prev = function () {
        return Actions.prev(editor, currentIndexState);
      };

      var replace = function (text, forward, all) {
        return Actions.replace(editor, currentIndexState, text, forward, all);
      };

      return {
        done: done,
        find: find,
        next: next,
        prev: prev,
        replace: replace
      };
    };

    return {
      get: get
    };
  }
);