/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.template.ui.Dialog',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.template.api.Settings',
    'tinymce.plugins.template.core.Templates'
  ],
  function (DOMUtils, Tools, XHR, Settings, Templates) {
    var insertIframeHtml = function (editor, win, html) {
      if (html.indexOf('<html>') === -1) {
        var contentCssLinks = '';

        Tools.each(editor.contentCSS, function (url) {
          contentCssLinks += '<link type="text/css" rel="stylesheet" href="' +
                  editor.documentBaseURI.toAbsolute(url) +
                  '">';
        });

        var bodyClass = editor.settings.body_class || '';
        if (bodyClass.indexOf('=') !== -1) {
          bodyClass = editor.getParam('body_class', '', 'hash');
          bodyClass = bodyClass[editor.id] || '';
        }

        html = (
                '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                contentCssLinks +
                '</head>' +
                '<body class="' + bodyClass + '">' +
                html +
                '</body>' +
                '</html>'
              );
      }

      html = Templates.replaceTemplateValues(editor, html, Settings.getPreviewReplaceValues(editor));

      var doc = win.find('iframe')[0].getEl().contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    };

    var open = function (editor, templateList) {
      var win, values = [], templateHtml;

      if (!templateList || templateList.length === 0) {
        var message = editor.translate('No templates defined.');
        editor.notificationManager.open({ text: message, type: 'info' });
        return;
      }

      Tools.each(templateList, function (template) {
        values.push({
          selected: !values.length,
          text: template.title,
          value: {
            url: template.url,
            content: template.content,
            description: template.description
          }
        });
      });

      var onSelectTemplate = function (e) {
        var value = e.control.value();

        if (value.url) {
          XHR.send({
            url: value.url,
            success: function (html) {
              templateHtml = html;
              insertIframeHtml(editor, win, templateHtml);
            }
          });
        } else {
          templateHtml = value.content;
          insertIframeHtml(editor, win, templateHtml);
        }

        win.find('#description')[0].text(e.control.value().description);
      };

      win = editor.windowManager.open({
        title: 'Insert template',
        layout: 'flex',
        direction: 'column',
        align: 'stretch',
        padding: 15,
        spacing: 10,
        items: [
          {
            type: 'form',
            flex: 0,
            padding: 0,
            items: [
              {
                type: 'container',
                label: 'Templates',
                items: {
                  type: 'listbox',
                  label: 'Templates',
                  name: 'template',
                  values: values,
                  onselect: onSelectTemplate
                }
              }
            ]
          },
          {
            type: 'label',
            name: 'description',
            label: 'Description',
            text: '\u00a0'
          },
          {
            type: 'iframe',
            flex: 1,
            border: 1
          }
        ],

        onsubmit: function () {
          Templates.insertTemplate(editor, false, templateHtml);
        },

        minWidth: Settings.getDialogWidth(editor),
        minHeight: Settings.getDialogHeight(editor)
      });

      win.find('listbox')[0].fire('select');
    };

    return {
      open: open
    };
  }
);