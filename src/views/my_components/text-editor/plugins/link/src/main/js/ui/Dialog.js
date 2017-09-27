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
  'tinymce.plugins.link.ui.Dialog',
  [
    'tinymce.core.util.Delay',
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.link.api.Settings',
    'tinymce.plugins.link.core.Utils'
  ],
  function (Delay, Tools, XHR, Settings, Utils) {
    var attachState = {};

    var createLinkList = function (editor, callback) {
      var linkList = Settings.getLinkList(editor.settings);

      if (typeof linkList === "string") {
        XHR.send({
          url: linkList,
          success: function (text) {
            callback(editor, JSON.parse(text));
          }
        });
      } else if (typeof linkList === "function") {
        linkList(function (list) {
          callback(editor, list);
        });
      } else {
        callback(editor, linkList);
      }
    };

    var buildListItems = function (inputList, itemCallback, startItems) {
      var appendItems = function (values, output) {
        output = output || [];

        Tools.each(values, function (item) {
          var menuItem = { text: item.text || item.title };

          if (item.menu) {
            menuItem.menu = appendItems(item.menu);
          } else {
            menuItem.value = item.value;

            if (itemCallback) {
              itemCallback(menuItem);
            }
          }

          output.push(menuItem);
        });

        return output;
      };

      return appendItems(inputList, startItems || []);
    };

    // Delay confirm since onSubmit will move focus
    var delayedConfirm = function (editor, message, callback) {
      var rng = editor.selection.getRng();

      Delay.setEditorTimeout(editor, function () {
        editor.windowManager.confirm(message, function (state) {
          editor.selection.setRng(rng);
          callback(state);
        });
      });
    };

    var showDialog = function (editor, linkList) {
      var data = {}, selection = editor.selection, dom = editor.dom, anchorElm, initialText;
      var win, onlyText, textListCtrl, linkListCtrl, relListCtrl, targetListCtrl, classListCtrl, linkTitleCtrl, value;

      var linkListChangeHandler = function (e) {
        var textCtrl = win.find('#text');

        if (!textCtrl.value() || (e.lastControl && textCtrl.value() === e.lastControl.text())) {
          textCtrl.value(e.control.text());
        }

        win.find('#href').value(e.control.value());
      };

      var buildAnchorListControl = function (url) {
        var anchorList = [];

        Tools.each(editor.dom.select('a:not([href])'), function (anchor) {
          var id = anchor.name || anchor.id;

          if (id) {
            anchorList.push({
              text: id,
              value: '#' + id,
              selected: url.indexOf('#' + id) !== -1
            });
          }
        });

        if (anchorList.length) {
          anchorList.unshift({ text: 'None', value: '' });

          return {
            name: 'anchor',
            type: 'listbox',
            label: 'Anchors',
            values: anchorList,
            onselect: linkListChangeHandler
          };
        }
      };

      var updateText = function () {
        if (!initialText && onlyText && !data.text) {
          this.parent().parent().find('#text')[0].value(this.value());
        }
      };

      var urlChange = function (e) {
        var meta = e.meta || {};

        if (linkListCtrl) {
          linkListCtrl.value(editor.convertURL(this.value(), 'href'));
        }

        Tools.each(e.meta, function (value, key) {
          var inp = win.find('#' + key);

          if (key === 'text') {
            if (initialText.length === 0) {
              inp.value(value);
              data.text = value;
            }
          } else {
            inp.value(value);
          }
        });

        if (meta.attach) {
          attachState = {
            href: this.value(),
            attach: meta.attach
          };
        }

        if (!meta.text) {
          updateText.call(this);
        }
      };

      var onBeforeCall = function (e) {
        e.meta = win.toJSON();
      };

      onlyText = Utils.isOnlyTextSelected(selection.getContent());
      anchorElm = Utils.getAnchorElement(editor);

      data.text = initialText = Utils.getAnchorText(editor.selection, anchorElm);
      data.href = anchorElm ? dom.getAttrib(anchorElm, 'href') : '';

      if (anchorElm) {
        data.target = dom.getAttrib(anchorElm, 'target');
      } else if (Settings.hasDefaultLinkTarget(editor.settings)) {
        data.target = Settings.getDefaultLinkTarget(editor.settings);
      }

      if ((value = dom.getAttrib(anchorElm, 'rel'))) {
        data.rel = value;
      }

      if ((value = dom.getAttrib(anchorElm, 'class'))) {
        data['class'] = value;
      }

      if ((value = dom.getAttrib(anchorElm, 'title'))) {
        data.title = value;
      }

      if (onlyText) {
        textListCtrl = {
          name: 'text',
          type: 'textbox',
          size: 40,
          label: 'Text to display',
          onchange: function () {
            data.text = this.value();
          }
        };
      }

      if (linkList) {
        linkListCtrl = {
          type: 'listbox',
          label: 'Link list',
          values: buildListItems(
            linkList,
            function (item) {
              item.value = editor.convertURL(item.value || item.url, 'href');
            },
            [{ text: 'None', value: '' }]
          ),
          onselect: linkListChangeHandler,
          value: editor.convertURL(data.href, 'href'),
          onPostRender: function () {
            /*eslint consistent-this:0*/
            linkListCtrl = this;
          }
        };
      }

      if (Settings.shouldShowTargetList(editor.settings)) {
        if (Settings.getTargetList(editor.settings) === undefined) {
          Settings.setTargetList(editor, [
            { text: 'None', value: '' },
            { text: 'New window', value: '_blank' }
          ]);
        }

        targetListCtrl = {
          name: 'target',
          type: 'listbox',
          label: 'Target',
          values: buildListItems(Settings.getTargetList(editor.settings))
        };
      }

      if (Settings.hasRelList(editor.settings)) {
        relListCtrl = {
          name: 'rel',
          type: 'listbox',
          label: 'Rel',
          values: buildListItems(
            Settings.getRelList(editor.settings),
            function (item) {
              if (Settings.allowUnsafeLinkTarget(editor.settings) === false) {
                item.value = Utils.toggleTargetRules(item.value, data.target === '_blank');
              }
            }
          )
        };
      }

      if (Settings.hasLinkClassList(editor.settings)) {
        classListCtrl = {
          name: 'class',
          type: 'listbox',
          label: 'Class',
          values: buildListItems(
            Settings.getLinkClassList(editor.settings),
            function (item) {
              if (item.value) {
                item.textStyle = function () {
                  return editor.formatter.getCssText({ inline: 'a', classes: [item.value] });
                };
              }
            }
          )
        };
      }

      if (Settings.shouldShowLinkTitle(editor.settings)) {
        linkTitleCtrl = {
          name: 'title',
          type: 'textbox',
          label: 'Title',
          value: data.title
        };
      }

      win = editor.windowManager.open({
        title: 'Insert link',
        data: data,
        body: [
          {
            name: 'href',
            type: 'filepicker',
            filetype: 'file',
            size: 40,
            autofocus: true,
            label: 'Url',
            onchange: urlChange,
            onkeyup: updateText,
            onbeforecall: onBeforeCall
          },
          textListCtrl,
          linkTitleCtrl,
          buildAnchorListControl(data.href),
          linkListCtrl,
          relListCtrl,
          targetListCtrl,
          classListCtrl
        ],
        onSubmit: function (e) {
          var assumeExternalTargets = Settings.assumeExternalTargets(editor.settings);
          var insertLink = Utils.link(editor, attachState);
          var removeLink = Utils.unlink(editor);

          var resultData = Tools.extend({}, data, e.data);
          /*eslint dot-notation: 0*/
          var href = resultData.href;

          if (!href) {
            removeLink();
            return;
          }

          if (!onlyText || resultData.text === initialText) {
            delete resultData.text;
          }

          // Is email and not //user@domain.com
          if (href.indexOf('@') > 0 && href.indexOf('//') === -1 && href.indexOf('mailto:') === -1) {
            delayedConfirm(
              editor,
              'The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?',
              function (state) {
                if (state) {
                  resultData.href = 'mailto:' + href;
                }
                insertLink(resultData);
              }
            );
            return;
          }

          // Is not protocol prefixed
          if ((assumeExternalTargets === true && !/^\w+:/i.test(href)) ||
            (assumeExternalTargets === false && /^\s*www[\.|\d\.]/i.test(href))) {
            delayedConfirm(
              editor,
              'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?',
              function (state) {
                if (state) {
                  resultData.href = 'http://' + href;
                }
                insertLink(resultData);
              }
            );
            return;
          }

          insertLink(resultData);
        }
      });
    };

    var open = function (editor) {
      createLinkList(editor, showDialog);
    };

    return {
      open: open
    };
  }
);