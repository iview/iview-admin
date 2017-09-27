/**
 * Forms.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.ui.Forms',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Promise',
    'tinymce.themes.inlite.core.Actions',
    'tinymce.themes.inlite.core.UrlType'
  ],
  function (Tools, Factory, Promise, Actions, UrlType) {
    var focusFirstTextBox = function (form) {
      form.find('textbox').eq(0).each(function (ctrl) {
        ctrl.focus();
      });
    };

    var createForm = function (name, spec) {
      var form = Factory.create(
        Tools.extend({
          type: 'form',
          layout: 'flex',
          direction: 'row',
          padding: 5,
          name: name,
          spacing: 3
        }, spec)
      );

      form.on('show', function () {
        focusFirstTextBox(form);
      });

      return form;
    };

    var toggleVisibility = function (ctrl, state) {
      return state ? ctrl.show() : ctrl.hide();
    };

    var askAboutPrefix = function (editor, href) {
      return new Promise(function (resolve) {
        editor.windowManager.confirm(
          'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?',
          function (result) {
            var output = result === true ? 'http://' + href : href;
            resolve(output);
          }
        );
      });
    };

    var convertLinkToAbsolute = function (editor, href) {
      return !UrlType.isAbsolute(href) && UrlType.isDomainLike(href) ? askAboutPrefix(editor, href) : Promise.resolve(href);
    };

    var createQuickLinkForm = function (editor, hide) {
      var attachState = {};

      var unlink = function () {
        editor.focus();
        Actions.unlink(editor);
        hide();
      };

      var onChangeHandler = function (e) {
        var meta = e.meta;

        if (meta && meta.attach) {
          attachState = {
            href: this.value(),
            attach: meta.attach
          };
        }
      };

      var onShowHandler = function (e) {
        if (e.control === this) {
          var elm, linkurl = '';

          elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
          if (elm) {
            linkurl = editor.dom.getAttrib(elm, 'href');
          }

          this.fromJSON({
            linkurl: linkurl
          });

          toggleVisibility(this.find('#unlink'), elm);
          this.find('#linkurl')[0].focus();
        }
      };

      return createForm('quicklink', {
        items: [
          { type: 'button', name: 'unlink', icon: 'unlink', onclick: unlink, tooltip: 'Remove link' },
          { type: 'filepicker', name: 'linkurl', placeholder: 'Paste or type a link', filetype: 'file', onchange: onChangeHandler },
          { type: 'button', icon: 'checkmark', subtype: 'primary', tooltip: 'Ok', onclick: 'submit' }
        ],
        onshow: onShowHandler,
        onsubmit: function (e) {
          convertLinkToAbsolute(editor, e.data.linkurl).then(function (url) {
            editor.undoManager.transact(function () {
              if (url === attachState.href) {
                attachState.attach();
                attachState = {};
              }

              Actions.createLink(editor, url);
            });

            hide();
          });
        }
      });
    };

    return {
      createQuickLinkForm: createQuickLinkForm
    };
  }
);
