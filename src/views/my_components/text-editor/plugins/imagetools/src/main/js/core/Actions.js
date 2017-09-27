/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.imagetools.core.Actions',
  [
    'ephox.imagetools.api.BlobConversions',
    'ephox.imagetools.api.ImageTransformations',
    'ephox.katamari.api.Fun',
    'ephox.sand.api.URL',
    'global!clearTimeout',
    'tinymce.core.util.Delay',
    'tinymce.core.util.Promise',
    'tinymce.core.util.Tools',
    'tinymce.core.util.URI',
    'tinymce.plugins.imagetools.api.Settings',
    'tinymce.plugins.imagetools.core.ImageSize',
    'tinymce.plugins.imagetools.core.Proxy',
    'tinymce.plugins.imagetools.ui.Dialog'
  ],
  function (BlobConversions, ImageTransformations, Fun, URL, clearTimeout, Delay, Promise, Tools, URI, Settings, ImageSize, Proxy, Dialog) {
    var count = 0;

    var isEditableImage = function (editor, img) {
      var selectorMatched = editor.dom.is(img, 'img:not([data-mce-object],[data-mce-placeholder])');

      return selectorMatched && (isLocalImage(editor, img) || isCorsImage(editor, img) || editor.settings.imagetools_proxy);
    };

    var displayError = function (editor, error) {
      editor.notificationManager.open({
        text: error,
        type: 'error'
      });
    };

    var getSelectedImage = function (editor) {
      return editor.selection.getNode();
    };

    var extractFilename = function (editor, url) {
      var m = url.match(/\/([^\/\?]+)?\.(?:jpeg|jpg|png|gif)(?:\?|$)/i);
      if (m) {
        return editor.dom.encode(m[1]);
      }
      return null;
    };

    var createId = function () {
      return 'imagetools' + count++;
    };

    var isLocalImage = function (editor, img) {
      var url = img.src;

      return url.indexOf('data:') === 0 || url.indexOf('blob:') === 0 || new URI(url).host === editor.documentBaseURI.host;
    };

    var isCorsImage = function (editor, img) {
      return Tools.inArray(editor.settings.imagetools_cors_hosts, new URI(img.src).host) !== -1;
    };

    var getApiKey = function (editor) {
      return editor.settings.api_key || editor.settings.imagetools_api_key;
    };

    var imageToBlob = function (editor, img) {
      var src = img.src, apiKey;

      if (isCorsImage(editor, img)) {
        return Proxy.getUrl(img.src, null);
      }

      if (!isLocalImage(editor, img)) {
        src = Settings.getProxyUrl(editor);
        src += (src.indexOf('?') === -1 ? '?' : '&') + 'url=' + encodeURIComponent(img.src);
        apiKey = getApiKey(editor);
        return Proxy.getUrl(src, apiKey);
      }

      return BlobConversions.imageToBlob(img);
    };

    var findSelectedBlob = function (editor) {
      var blobInfo;
      blobInfo = editor.editorUpload.blobCache.getByUri(getSelectedImage(editor).src);
      if (blobInfo) {
        return Promise.resolve(blobInfo.blob());
      }

      return imageToBlob(editor, getSelectedImage(editor));
    };

    var startTimedUpload = function (editor, imageUploadTimerState) {
      var imageUploadTimer = Delay.setEditorTimeout(editor, function () {
        editor.editorUpload.uploadImagesAuto();
      }, editor.settings.images_upload_timeout || 30000);

      imageUploadTimerState.set(imageUploadTimer);
    };

    var cancelTimedUpload = function (imageUploadTimerState) {
      clearTimeout(imageUploadTimerState.get());
    };

    var updateSelectedImage = function (editor, ir, uploadImmediately, imageUploadTimerState) {
      return ir.toBlob().then(function (blob) {
        var uri, name, blobCache, blobInfo, selectedImage;

        blobCache = editor.editorUpload.blobCache;
        selectedImage = getSelectedImage(editor);
        uri = selectedImage.src;

        if (editor.settings.images_reuse_filename) {
          blobInfo = blobCache.getByUri(uri);
          if (blobInfo) {
            uri = blobInfo.uri();
            name = blobInfo.name();
          } else {
            name = extractFilename(editor, uri);
          }
        }

        blobInfo = blobCache.create({
          id: createId(),
          blob: blob,
          base64: ir.toBase64(),
          uri: uri,
          name: name
        });

        blobCache.add(blobInfo);

        editor.undoManager.transact(function () {
          function imageLoadedHandler() {
            editor.$(selectedImage).off('load', imageLoadedHandler);
            editor.nodeChanged();

            if (uploadImmediately) {
              editor.editorUpload.uploadImagesAuto();
            } else {
              cancelTimedUpload(imageUploadTimerState);
              startTimedUpload(editor, imageUploadTimerState);
            }
          }

          editor.$(selectedImage).on('load', imageLoadedHandler);

          editor.$(selectedImage).attr({
            src: blobInfo.blobUri()
          }).removeAttr('data-mce-src');
        });

        return blobInfo;
      });
    };

    var selectedImageOperation = function (editor, imageUploadTimerState, fn) {
      return function () {
        return editor._scanForImages().
          then(Fun.curry(findSelectedBlob, editor)).
          then(BlobConversions.blobToImageResult).
          then(fn).
          then(function (imageResult) {
            return updateSelectedImage(editor, imageResult, false, imageUploadTimerState);
          }, function (error) {
            displayError(editor, error);
          });
      };
    };

    var rotate = function (editor, imageUploadTimerState, angle) {
      return function () {
        return selectedImageOperation(editor, imageUploadTimerState, function (imageResult) {
          var size = ImageSize.getImageSize(getSelectedImage(editor));

          if (size) {
            ImageSize.setImageSize(getSelectedImage(editor), {
              w: size.h,
              h: size.w
            });
          }

          return ImageTransformations.rotate(imageResult, angle);
        })();
      };
    };

    var flip = function (editor, imageUploadTimerState, axis) {
      return function () {
        return selectedImageOperation(editor, imageUploadTimerState, function (imageResult) {
          return ImageTransformations.flip(imageResult, axis);
        })();
      };
    };

    var editImageDialog = function (editor, imageUploadTimerState) {
      return function () {
        var img = getSelectedImage(editor), originalSize = ImageSize.getNaturalImageSize(img);

        var handleDialogBlob = function (blob) {
          return new Promise(function (resolve) {
            BlobConversions.blobToImage(blob).
              then(function (newImage) {
                var newSize = ImageSize.getNaturalImageSize(newImage);

                if (originalSize.w !== newSize.w || originalSize.h !== newSize.h) {
                  if (ImageSize.getImageSize(img)) {
                    ImageSize.setImageSize(img, newSize);
                  }
                }

                URL.revokeObjectURL(newImage.src);
                resolve(blob);
              });
          });
        };

        var openDialog = function (editor, imageResult) {
          return Dialog.edit(editor, imageResult).then(handleDialogBlob).
            then(BlobConversions.blobToImageResult).
            then(function (imageResult) {
              return updateSelectedImage(editor, imageResult, true, imageUploadTimerState);
            }, function () {
              // Close dialog
            });
        };

        findSelectedBlob(editor).
          then(BlobConversions.blobToImageResult).
          then(Fun.curry(openDialog, editor), function (error) {
            displayError(editor, error);
          });
      };
    };

    return {
      rotate: rotate,
      flip: flip,
      editImageDialog: editImageDialog,
      isEditableImage: isEditableImage,
      cancelTimedUpload: cancelTimedUpload
    };
  }
);
