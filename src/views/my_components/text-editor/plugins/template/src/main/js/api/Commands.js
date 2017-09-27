/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.api.Commands',
  [
    'ephox.katamari.api.Fun',
    'tinymce.plugins.template.core.Templates'
  ],
  function (Fun, Templates) {
    var register = function (editor) {
      editor.addCommand('mceInsertTemplate', Fun.curry(Templates.insertTemplate, editor));
    };

    return {
      register: register
    };
  }
);