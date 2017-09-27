/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.ui.Buttons',
  [
    'tinymce.plugins.template.core.Templates',
    'tinymce.plugins.template.ui.Dialog'
  ],
  function (Templates, Dialog) {
    var showDialog = function (editor) {
      return function (templates) {
        Dialog.open(editor, templates);
      };
    };

    var register = function (editor) {
      editor.addButton('template', {
        title: 'Insert template',
        onclick: Templates.createTemplateList(editor.settings, showDialog(editor))
      });

      editor.addMenuItem('template', {
        text: 'Template',
        onclick: Templates.createTemplateList(editor.settings, showDialog(editor)),
        context: 'insert'
      });
    };

    return {
      register: register
    };
  }
);