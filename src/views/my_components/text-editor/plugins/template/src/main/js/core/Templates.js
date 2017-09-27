/**
 * Templates.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.core.Templates',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.template.api.Settings',
    'tinymce.plugins.template.core.DateTimeHelper'
  ],
  function (Tools, XHR, Settings, DateTimeHelper) {
    var createTemplateList = function (editorSettings, callback) {
      return function () {
        var templateList = Settings.getTemplates(editorSettings);

        if (typeof templateList === 'function') {
          templateList(callback);
          return;
        }

        if (typeof templateList === 'string') {
          XHR.send({
            url: templateList,
            success: function (text) {
              callback(JSON.parse(text));
            }
          });
        } else {
          callback(templateList);
        }
      };
    };

    var replaceTemplateValues = function (editor, html, templateValues) {
      Tools.each(templateValues, function (v, k) {
        if (typeof v === 'function') {
          v = v(k);
        }

        html = html.replace(new RegExp('\\{\\$' + k + '\\}', 'g'), v);
      });

      return html;
    };

    var replaceVals = function (editor, e) {
      var dom = editor.dom, vl = Settings.getTemplateReplaceValues(editor);

      Tools.each(dom.select('*', e), function (e) {
        Tools.each(vl, function (v, k) {
          if (dom.hasClass(e, k)) {
            if (typeof vl[k] === 'function') {
              vl[k](e);
            }
          }
        });
      });
    };

    var hasClass = function (n, c) {
      return new RegExp('\\b' + c + '\\b', 'g').test(n.className);
    };

    var insertTemplate = function (editor, ui, html) {
      var el, n, dom = editor.dom, sel = editor.selection.getContent();

      html = replaceTemplateValues(editor, html, Settings.getTemplateReplaceValues(editor));
      el = dom.create('div', null, html);

        // Find template element within div
      n = dom.select('.mceTmpl', el);
      if (n && n.length > 0) {
        el = dom.create('div', null);
        el.appendChild(n[0].cloneNode(true));
      }

      Tools.each(dom.select('*', el), function (n) {
        // Replace cdate
        if (hasClass(n, Settings.getCreationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getCdateFormat(editor));
        }

        // Replace mdate
        if (hasClass(n, Settings.getModificationDateClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = DateTimeHelper.getDateTime(editor, Settings.getMdateFormat(editor));
        }

        // Replace selection
        if (hasClass(n, Settings.getSelectedContentClasses(editor).replace(/\s+/g, '|'))) {
          n.innerHTML = sel;
        }
      });

      replaceVals(editor, el);

      editor.execCommand('mceInsertContent', false, el.innerHTML);
      editor.addVisual();
    };

    return {
      createTemplateList: createTemplateList,
      replaceTemplateValues: replaceTemplateValues,
      replaceVals: replaceVals,
      insertTemplate: insertTemplate
    };
  }
);
