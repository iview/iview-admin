/**
 * FilterContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.core.FilterContent',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.template.api.Settings',
    'tinymce.plugins.template.core.DateTimeHelper',
    'tinymce.plugins.template.core.Templates'
  ],
  function (Tools, Settings, DateTimeHelper, Templates) {
    var setup = function (editor) {
      editor.on('PreProcess', function (o) {
        var dom = editor.dom, dateFormat = Settings.getMdateFormat(editor);

        Tools.each(dom.select('div', o.node), function (e) {
          if (dom.hasClass(e, 'mceTmpl')) {
            Tools.each(dom.select('*', e), function (e) {
              if (dom.hasClass(e, editor.getParam('template_mdate_classes', 'mdate').replace(/\s+/g, '|'))) {
                e.innerHTML = DateTimeHelper.getDateTime(editor, dateFormat);
              }
            });

            Templates.replaceVals(editor, e);
          }
        });
      });
    };

    return {
      setup: setup
    };
  }
);