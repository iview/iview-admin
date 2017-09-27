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
  'tinymce.plugins.fullpage.core.FilterContent',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.fullpage.api.Settings',
    'tinymce.plugins.fullpage.core.Parser',
    'tinymce.plugins.fullpage.core.Protect'
  ],
  function (Tools, Settings, Parser, Protect) {
    var each = Tools.each;

    var low = function (s) {
      return s.replace(/<\/?[A-Z]+/g, function (a) {
        return a.toLowerCase();
      });
    };

    var handleSetContent = function (editor, headState, footState, evt) {
      var startPos, endPos, content, headerFragment, styles = '', dom = editor.dom, elm;

      if (evt.selection) {
        return;
      }

      content = Protect.protectHtml(editor.settings.protect, evt.content);

      // Ignore raw updated if we already have a head, this will fix issues with undo/redo keeping the head/foot separate
      if (evt.format === 'raw' && headState.get()) {
        return;
      }

      if (evt.source_view && Settings.shouldHideInSourceView(editor)) {
        return;
      }

      // Fixed so new document/setContent('') doesn't remove existing header/footer except when it's in source code view
      if (content.length === 0 && !evt.source_view) {
        content = Tools.trim(headState.get()) + '\n' + Tools.trim(content) + '\n' + Tools.trim(footState.get());
      }

      // Parse out head, body and footer
      content = content.replace(/<(\/?)BODY/gi, '<$1body');
      startPos = content.indexOf('<body');

      if (startPos !== -1) {
        startPos = content.indexOf('>', startPos);
        headState.set(low(content.substring(0, startPos + 1)));

        endPos = content.indexOf('</body', startPos);
        if (endPos === -1) {
          endPos = content.length;
        }

        evt.content = Tools.trim(content.substring(startPos + 1, endPos));
        footState.set(low(content.substring(endPos)));
      } else {
        headState.set(getDefaultHeader(editor));
        footState.set('\n</body>\n</html>');
      }

      // Parse header and update iframe
      headerFragment = Parser.parseHeader(headState.get());
      each(headerFragment.getAll('style'), function (node) {
        if (node.firstChild) {
          styles += node.firstChild.value;
        }
      });

      elm = headerFragment.getAll('body')[0];
      if (elm) {
        dom.setAttribs(editor.getBody(), {
          style: elm.attr('style') || '',
          dir: elm.attr('dir') || '',
          vLink: elm.attr('vlink') || '',
          link: elm.attr('link') || '',
          aLink: elm.attr('alink') || ''
        });
      }

      dom.remove('fullpage_styles');

      var headElm = editor.getDoc().getElementsByTagName('head')[0];

      if (styles) {
        dom.add(headElm, 'style', {
          id: 'fullpage_styles'
        }, styles);

        // Needed for IE 6/7
        elm = dom.get('fullpage_styles');
        if (elm.styleSheet) {
          elm.styleSheet.cssText = styles;
        }
      }

      var currentStyleSheetsMap = {};
      Tools.each(headElm.getElementsByTagName('link'), function (stylesheet) {
        if (stylesheet.rel === 'stylesheet' && stylesheet.getAttribute('data-mce-fullpage')) {
          currentStyleSheetsMap[stylesheet.href] = stylesheet;
        }
      });

      // Add new
      Tools.each(headerFragment.getAll('link'), function (stylesheet) {
        var href = stylesheet.attr('href');
        if (!href) {
          return true;
        }

        if (!currentStyleSheetsMap[href] && stylesheet.attr('rel') === 'stylesheet') {
          dom.add(headElm, 'link', {
            rel: 'stylesheet',
            text: 'text/css',
            href: href,
            'data-mce-fullpage': '1'
          });
        }

        delete currentStyleSheetsMap[href];
      });

      // Delete old
      Tools.each(currentStyleSheetsMap, function (stylesheet) {
        stylesheet.parentNode.removeChild(stylesheet);
      });
    };

    var getDefaultHeader = function (editor) {
      var header = '', value, styles = '';

      if (Settings.getDefaultXmlPi(editor)) {
        var piEncoding = Settings.getDefaultEncoding(editor);
        header += '<?xml version="1.0" encoding="' + (piEncoding ? piEncoding : 'ISO-8859-1') + '" ?>\n';
      }

      header += Settings.getDefaultDocType(editor);
      header += '\n<html>\n<head>\n';

      if ((value = Settings.getDefaultTitle(editor))) {
        header += '<title>' + value + '</title>\n';
      }

      if ((value = Settings.getDefaultEncoding(editor))) {
        header += '<meta http-equiv="Content-Type" content="text/html; charset=' + value + '" />\n';
      }

      if ((value = Settings.getDefaultFontFamily(editor))) {
        styles += 'font-family: ' + value + ';';
      }

      if ((value = Settings.getDefaultFontSize(editor))) {
        styles += 'font-size: ' + value + ';';
      }

      if ((value = Settings.getDefaultTextColor(editor))) {
        styles += 'color: ' + value + ';';
      }

      header += '</head>\n<body' + (styles ? ' style="' + styles + '"' : '') + '>\n';

      return header;
    };

    var handleGetContent = function (editor, head, foot, evt) {
      if (!evt.selection && (!evt.source_view || !Settings.shouldHideInSourceView(editor))) {
        evt.content = Protect.unprotectHtml(Tools.trim(head) + '\n' + Tools.trim(evt.content) + '\n' + Tools.trim(foot));
      }
    };

    var setup = function (editor, headState, footState) {
      editor.on('BeforeSetContent', function (evt) {
        handleSetContent(editor, headState, footState, evt);
      });
      editor.on('GetContent', function (evt) {
        handleGetContent(editor, headState.get(), footState.get(), evt);
      });
    };

    return {
      setup: setup
    };
  }
);