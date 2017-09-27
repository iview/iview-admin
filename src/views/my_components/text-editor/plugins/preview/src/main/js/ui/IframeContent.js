/**
 * IframeContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.preview.ui.IframeContent',
  [
    'tinymce.core.util.Tools'
  ],
  function (Tools) {
    var injectIframeContent = function (editor, iframe, sandbox) {
      var previewHtml, headHtml = '', encode = editor.dom.encode;

      headHtml += '<base href="' + encode(editor.documentBaseURI.getURI()) + '">';

      Tools.each(editor.contentCSS, function (url) {
        headHtml += '<link type="text/css" rel="stylesheet" href="' + encode(editor.documentBaseURI.toAbsolute(url)) + '">';
      });

      var bodyId = editor.settings.body_id || 'tinymce';
      if (bodyId.indexOf('=') !== -1) {
        bodyId = editor.getParam('body_id', '', 'hash');
        bodyId = bodyId[editor.id] || bodyId;
      }

      var bodyClass = editor.settings.body_class || '';
      if (bodyClass.indexOf('=') !== -1) {
        bodyClass = editor.getParam('body_class', '', 'hash');
        bodyClass = bodyClass[editor.id] || '';
      }

      var preventClicksOnLinksScript = (
        '<script>' +
        'document.addEventListener && document.addEventListener("click", function(e) {' +
        'for (var elm = e.target; elm; elm = elm.parentNode) {' +
        'if (elm.nodeName === "A") {' +
        'e.preventDefault();' +
        '}' +
        '}' +
        '}, false);' +
        '</script> '
      );

      var dirAttr = editor.settings.directionality ? ' dir="' + editor.settings.directionality + '"' : '';

      previewHtml = (
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        headHtml +
        '</head>' +
        '<body id="' + encode(bodyId) + '" class="mce-content-body ' + encode(bodyClass) + '"' + encode(dirAttr) + '>' +
        editor.getContent() +
        preventClicksOnLinksScript +
        '</body>' +
        '</html>'
      );

      if (!sandbox) {
        // IE 6-11 doesn't support data uris on iframes
        // so I guess they will have to be less secure since we can't sandbox on those
        // TODO: Use sandbox if future versions of IE supports iframes with data: uris.
        var doc = iframe.contentWindow.document;
        doc.open();
        doc.write(previewHtml);
        doc.close();
      } else {
        iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(previewHtml);
      }
    };

    return {
      injectIframeContent: injectIframeContent
    };
  }
);