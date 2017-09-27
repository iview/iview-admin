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
  'tinymce.plugins.toc.ui.Buttons',
  [
    'tinymce.plugins.toc.api.Settings',
    'tinymce.plugins.toc.core.Toc'
  ],
  function (Settings, Toc) {
    var toggleState = function (editor) {
      return function (e) {
        var ctrl = e.control;

        ctrl.disabled(editor.readonly || !Toc.hasHeaders(editor));

        editor.on('LoadContent SetContent change', function () {
          ctrl.disabled(editor.readonly || !Toc.hasHeaders(editor));
        });
      };
    };

    var isToc = function (editor) {
      return function (elm) {
        return elm && editor.dom.is(elm, '.' + Settings.getTocClass(editor)) && editor.getBody().contains(elm);
      };
    };

    var register = function (editor) {
      editor.addButton('toc', {
        tooltip: 'Table of Contents',
        cmd: 'mceInsertToc',
        icon: 'toc',
        onPostRender: toggleState(editor)
      });

      editor.addButton('tocupdate', {
        tooltip: 'Update',
        cmd: 'mceUpdateToc',
        icon: 'reload'
      });

      editor.addMenuItem('toc', {
        text: "Table of Contents",
        context: 'insert',
        cmd: 'mceInsertToc',
        onPostRender: toggleState(editor)
      });

      editor.addContextToolbar(isToc(editor), 'tocupdate');
    };

    return {
      register: register
    };
  }
);