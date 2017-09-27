/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * @class tinymce.image.ui.Dialog
 * @private
 */
define(
  'tinymce.plugins.image.ui.Dialog',
  [
    'ephox.sand.api.URL',
    'global!document',
    'global!Math',
    'global!RegExp',
    'tinymce.core.Env',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.JSON',
    'tinymce.core.util.Tools',
    'tinymce.core.util.XHR',
    'tinymce.plugins.image.api.Settings',
    'tinymce.plugins.image.core.Uploader',
    'tinymce.plugins.image.core.Utils'
  ],
  function (URL, document, Math, RegExp, Env, Factory, JSON, Tools, XHR, Settings, Uploader, Utils) {
    return function (editor) {
      function createImageList(callback) {
        var imageList = Settings.getImageList(editor);

        if (typeof imageList === "string") {
          XHR.send({
            url: imageList,
            success: function (text) {
              callback(JSON.parse(text));
            }
          });
        } else if (typeof imageList === "function") {
          imageList(callback);
        } else {
          callback(imageList);
        }
      }

      function showDialog(imageList) {
        var win, data = {}, imgElm, figureElm, dom = editor.dom, settings = editor.settings;
        var width, height, imageListCtrl, classListCtrl, imageDimensions = Settings.hasDimensions(editor);

        function onFileInput() {
          var Throbber = Factory.get('Throbber');
          var throbber = new Throbber(win.getEl());
          var file = this.value();

          var uploader = new Uploader({
            url: settings.images_upload_url,
            basePath: settings.images_upload_base_path,
            credentials: settings.images_upload_credentials,
            handler: settings.images_upload_handler
          });

          // we do not need to add this to editors blobCache, so we fake bare minimum
          var blobInfo = editor.editorUpload.blobCache.create({
            blob: file,
            name: file.name ? file.name.replace(/\.[^\.]+$/, '') : null, // strip extension
            base64: 'data:image/fake;base64,=' // without this create() will throw exception
          });

          var finalize = function () {
            throbber.hide();
            URL.revokeObjectURL(blobInfo.blobUri()); // in theory we could fake blobUri too, but until it's legitimate, we have too revoke it manually
          };

          throbber.show();

          return uploader.upload(blobInfo).then(function (url) {
            var src = win.find('#src');
            src.value(url);
            win.find('tabpanel')[0].activateTab(0); // switch to General tab
            src.fire('change'); // this will invoke onSrcChange (and any other handlers, if any).
            finalize();
            return url;
          }, function (err) {
            editor.windowManager.alert(err);
            finalize();
          });
        }

        function isTextBlock(node) {
          return editor.schema.getTextBlockElements()[node.nodeName];
        }

        function recalcSize() {
          var widthCtrl, heightCtrl, newWidth, newHeight;

          widthCtrl = win.find('#width')[0];
          heightCtrl = win.find('#height')[0];

          if (!widthCtrl || !heightCtrl) {
            return;
          }

          newWidth = widthCtrl.value();
          newHeight = heightCtrl.value();

          if (win.find('#constrain')[0].checked() && width && height && newWidth && newHeight) {
            if (width !== newWidth) {
              newHeight = Math.round((newWidth / width) * newHeight);

              if (!isNaN(newHeight)) {
                heightCtrl.value(newHeight);
              }
            } else {
              newWidth = Math.round((newHeight / height) * newWidth);

              if (!isNaN(newWidth)) {
                widthCtrl.value(newWidth);
              }
            }
          }

          width = newWidth;
          height = newHeight;
        }

        function updateStyle() {
          if (!Settings.hasAdvTab(editor)) {
            return;
          }

          var data = win.toJSON(),
            css = dom.parseStyle(data.style);

          css = Utils.mergeMargins(css);

          if (data.vspace) {
            css['margin-top'] = css['margin-bottom'] = Utils.addPixelSuffix(data.vspace);
          }
          if (data.hspace) {
            css['margin-left'] = css['margin-right'] = Utils.addPixelSuffix(data.hspace);
          }
          if (data.border) {
            css['border-width'] = Utils.addPixelSuffix(data.border);
          }

          win.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
        }

        function updateVSpaceHSpaceBorder() {
          if (!Settings.hasAdvTab(editor)) {
            return;
          }

          var data = win.toJSON(),
            css = dom.parseStyle(data.style);

          win.find('#vspace').value("");
          win.find('#hspace').value("");

          css = Utils.mergeMargins(css);

          //Move opposite equal margins to vspace/hspace field
          if ((css['margin-top'] && css['margin-bottom']) || (css['margin-right'] && css['margin-left'])) {
            if (css['margin-top'] === css['margin-bottom']) {
              win.find('#vspace').value(Utils.removePixelSuffix(css['margin-top']));
            } else {
              win.find('#vspace').value('');
            }
            if (css['margin-right'] === css['margin-left']) {
              win.find('#hspace').value(Utils.removePixelSuffix(css['margin-right']));
            } else {
              win.find('#hspace').value('');
            }
          }

          //Move border-width
          if (css['border-width']) {
            win.find('#border').value(Utils.removePixelSuffix(css['border-width']));
          }

          win.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
        }

        function waitLoad(imgElm) {
          function selectImage() {
            imgElm.onload = imgElm.onerror = null;

            if (editor.selection) {
              editor.selection.select(imgElm);
              editor.nodeChanged();
            }
          }

          imgElm.onload = function () {
            if (!data.width && !data.height && imageDimensions) {
              dom.setAttribs(imgElm, {
                width: imgElm.clientWidth,
                height: imgElm.clientHeight
              });
            }

            selectImage();
          };

          imgElm.onerror = selectImage;
        }

        function onSubmitForm() {
          var figureElm, oldImg;

          updateStyle();
          recalcSize();

          data = Tools.extend(data, win.toJSON());

          if (!data.alt) {
            data.alt = '';
          }

          if (!data.title) {
            data.title = '';
          }

          if (data.width === '') {
            data.width = null;
          }

          if (data.height === '') {
            data.height = null;
          }

          if (!data.style) {
            data.style = null;
          }

          // Setup new data excluding style properties
          /*eslint dot-notation: 0*/
          data = {
            src: data.src,
            alt: data.alt,
            title: data.title,
            width: data.width,
            height: data.height,
            style: data.style,
            caption: data.caption,
            "class": data["class"]
          };

          editor.undoManager.transact(function () {
            if (!data.src) {
              if (imgElm) {
                var elm = dom.is(imgElm.parentNode, 'figure.image') ? imgElm.parentNode : imgElm;
                dom.remove(elm);
                editor.focus();
                editor.nodeChanged();

                if (dom.isEmpty(editor.getBody())) {
                  editor.setContent('');
                  editor.selection.setCursorLocation();
                }
              }

              return;
            }

            if (data.title === "") {
              data.title = null;
            }

            if (!imgElm) {
              data.id = '__mcenew';
              editor.focus();
              editor.selection.setContent(dom.createHTML('img', data));
              imgElm = dom.get('__mcenew');
              dom.setAttrib(imgElm, 'id', null);
            } else {
              dom.setAttribs(imgElm, data);
            }

            editor.editorUpload.uploadImagesAuto();

            if (data.caption === false) {
              if (dom.is(imgElm.parentNode, 'figure.image')) {
                figureElm = imgElm.parentNode;
                dom.setAttrib(imgElm, 'contenteditable', null);
                dom.insertAfter(imgElm, figureElm);
                dom.remove(figureElm);
                editor.selection.select(imgElm);
                editor.nodeChanged();
              }
            }

            if (data.caption === true) {
              if (!dom.is(imgElm.parentNode, 'figure.image')) {
                oldImg = imgElm;
                imgElm = imgElm.cloneNode(true);
                imgElm.contentEditable = true;
                figureElm = dom.create('figure', { 'class': 'image' });
                figureElm.appendChild(imgElm);
                figureElm.appendChild(dom.create('figcaption', { contentEditable: true }, 'Caption'));
                figureElm.contentEditable = false;

                var textBlock = dom.getParent(oldImg, isTextBlock);
                if (textBlock) {
                  dom.split(textBlock, oldImg, figureElm);
                } else {
                  dom.replace(figureElm, oldImg);
                }

                editor.selection.select(figureElm);
              }

              return;
            }

            waitLoad(imgElm);
          });
        }

        function onSrcChange(e) {
          var srcURL, prependURL, absoluteURLPattern, meta = e.meta || {};

          if (imageListCtrl) {
            imageListCtrl.value(editor.convertURL(this.value(), 'src'));
          }

          Tools.each(meta, function (value, key) {
            win.find('#' + key).value(value);
          });

          if (!meta.width && !meta.height) {
            srcURL = editor.convertURL(this.value(), 'src');

            // Pattern test the src url and make sure we haven't already prepended the url
            prependURL = Settings.getPrependUrl(editor);
            absoluteURLPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
            if (prependURL && !absoluteURLPattern.test(srcURL) && srcURL.substring(0, prependURL.length) !== prependURL) {
              srcURL = prependURL + srcURL;
            }

            this.value(srcURL);

            Utils.getImageSize(editor.documentBaseURI.toAbsolute(this.value()), function (data) {
              if (data.width && data.height && imageDimensions) {
                width = data.width;
                height = data.height;

                win.find('#width').value(width);
                win.find('#height').value(height);
              }
            });
          }
        }

        function onBeforeCall(e) {
          e.meta = win.toJSON();
        }

        imgElm = editor.selection.getNode();
        figureElm = dom.getParent(imgElm, 'figure.image');
        if (figureElm) {
          imgElm = dom.select('img', figureElm)[0];
        }

        if (imgElm &&
          (imgElm.nodeName !== 'IMG' ||
            imgElm.getAttribute('data-mce-object') ||
            imgElm.getAttribute('data-mce-placeholder'))) {
          imgElm = null;
        }

        if (imgElm) {
          width = dom.getAttrib(imgElm, 'width');
          height = dom.getAttrib(imgElm, 'height');

          data = {
            src: dom.getAttrib(imgElm, 'src'),
            alt: dom.getAttrib(imgElm, 'alt'),
            title: dom.getAttrib(imgElm, 'title'),
            "class": dom.getAttrib(imgElm, 'class'),
            width: width,
            height: height,
            caption: !!figureElm
          };
        }

        if (imageList) {
          imageListCtrl = {
            type: 'listbox',
            label: 'Image list',
            values: Utils.buildListItems(
              imageList,
              function (item) {
                item.value = editor.convertURL(item.value || item.url, 'src');
              },
              [{ text: 'None', value: '' }]
            ),
            value: data.src && editor.convertURL(data.src, 'src'),
            onselect: function (e) {
              var altCtrl = win.find('#alt');

              if (!altCtrl.value() || (e.lastControl && altCtrl.value() === e.lastControl.text())) {
                altCtrl.value(e.control.text());
              }

              win.find('#src').value(e.control.value()).fire('change');
            },
            onPostRender: function () {
              /*eslint consistent-this: 0*/
              imageListCtrl = this;
            }
          };
        }

        if (Settings.getClassList(editor)) {
          classListCtrl = {
            name: 'class',
            type: 'listbox',
            label: 'Class',
            values: Utils.buildListItems(
              Settings.getClassList(editor),
              function (item) {
                if (item.value) {
                  item.textStyle = function () {
                    return editor.formatter.getCssText({ inline: 'img', classes: [item.value] });
                  };
                }
              }
            )
          };
        }

        // General settings shared between simple and advanced dialogs
        var generalFormItems = [
          {
            name: 'src',
            type: 'filepicker',
            filetype: 'image',
            label: 'Source',
            autofocus: true,
            onchange: onSrcChange,
            onbeforecall: onBeforeCall
          },
          imageListCtrl
        ];

        if (Settings.hasDescription(editor)) {
          generalFormItems.push({ name: 'alt', type: 'textbox', label: 'Image description' });
        }

        if (Settings.hasImageTitle(editor)) {
          generalFormItems.push({ name: 'title', type: 'textbox', label: 'Image Title' });
        }

        if (imageDimensions) {
          generalFormItems.push({
            type: 'container',
            label: 'Dimensions',
            layout: 'flex',
            direction: 'row',
            align: 'center',
            spacing: 5,
            items: [
              { name: 'width', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Width' },
              { type: 'label', text: 'x' },
              { name: 'height', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Height' },
              { name: 'constrain', type: 'checkbox', checked: true, text: 'Constrain proportions' }
            ]
          });
        }

        generalFormItems.push(classListCtrl);

        if (Settings.hasImageCaption(editor)) {
          generalFormItems.push({ name: 'caption', type: 'checkbox', label: 'Caption' });
        }

        if (Settings.hasAdvTab(editor) || editor.settings.images_upload_url) {
          var body = [
            {
              title: 'General',
              type: 'form',
              items: generalFormItems
            }
          ];

          if (Settings.hasAdvTab(editor)) {
            // Parse styles from img
            if (imgElm) {
              if (imgElm.style.marginLeft && imgElm.style.marginRight && imgElm.style.marginLeft === imgElm.style.marginRight) {
                data.hspace = Utils.removePixelSuffix(imgElm.style.marginLeft);
              }
              if (imgElm.style.marginTop && imgElm.style.marginBottom && imgElm.style.marginTop === imgElm.style.marginBottom) {
                data.vspace = Utils.removePixelSuffix(imgElm.style.marginTop);
              }
              if (imgElm.style.borderWidth) {
                data.border = Utils.removePixelSuffix(imgElm.style.borderWidth);
              }

              data.style = editor.dom.serializeStyle(editor.dom.parseStyle(editor.dom.getAttrib(imgElm, 'style')));
            }

            body.push({
              title: 'Advanced',
              type: 'form',
              pack: 'start',
              items: [
                {
                  label: 'Style',
                  name: 'style',
                  type: 'textbox',
                  onchange: updateVSpaceHSpaceBorder
                },
                {
                  type: 'form',
                  layout: 'grid',
                  packV: 'start',
                  columns: 2,
                  padding: 0,
                  alignH: ['left', 'right'],
                  defaults: {
                    type: 'textbox',
                    maxWidth: 50,
                    onchange: updateStyle
                  },
                  items: [
                    { label: 'Vertical space', name: 'vspace' },
                    { label: 'Horizontal space', name: 'hspace' },
                    { label: 'Border', name: 'border' }
                  ]
                }
              ]
            });
          }

          if (editor.settings.images_upload_url) {
            var acceptExts = '.jpg,.jpeg,.png,.gif';

            var uploadTab = {
              title: 'Upload',
              type: 'form',
              layout: 'flex',
              direction: 'column',
              align: 'stretch',
              padding: '20 20 20 20',
              items: [
                {
                  type: 'container',
                  layout: 'flex',
                  direction: 'column',
                  align: 'center',
                  spacing: 10,
                  items: [
                    {
                      text: "Browse for an image",
                      type: 'browsebutton',
                      accept: acceptExts,
                      onchange: onFileInput
                    },
                    {
                      text: 'OR',
                      type: 'label'
                    }
                  ]
                },
                {
                  text: "Drop an image here",
                  type: 'dropzone',
                  accept: acceptExts,
                  height: 100,
                  onchange: onFileInput
                }
              ]
            };

            body.push(uploadTab);
          }

          // Advanced dialog shows general+advanced tabs
          win = editor.windowManager.open({
            title: 'Insert/edit image',
            data: data,
            bodyType: 'tabpanel',
            body: body,
            onSubmit: onSubmitForm
          });
        } else {
          // Simple default dialog
          win = editor.windowManager.open({
            title: 'Insert/edit image',
            data: data,
            body: generalFormItems,
            onSubmit: onSubmitForm
          });
        }
      }

      function open() {
        createImageList(showDialog);
      }

      return {
        open: open
      };
    };
  }
);
