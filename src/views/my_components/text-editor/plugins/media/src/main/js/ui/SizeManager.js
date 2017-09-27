/**
 * SizeManager.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.ui.SizeManager',
  [
  ],
  function () {
    var doSyncSize = function (widthCtrl, heightCtrl) {
      widthCtrl.state.set('oldVal', widthCtrl.value());
      heightCtrl.state.set('oldVal', heightCtrl.value());
    };
    var doSizeControls = function (win, f) {
      var widthCtrl = win.find('#width')[0];
      var heightCtrl = win.find('#height')[0];
      var constrained = win.find('#constrain')[0];
      if (widthCtrl && heightCtrl && constrained) {
        f(widthCtrl, heightCtrl, constrained.checked());
      }
    };

    var doUpdateSize = function (widthCtrl, heightCtrl, isContrained) {
      var oldWidth = widthCtrl.state.get('oldVal');
      var oldHeight = heightCtrl.state.get('oldVal');
      var newWidth = widthCtrl.value();
      var newHeight = heightCtrl.value();

      if (isContrained && oldWidth && oldHeight && newWidth && newHeight) {
        if (newWidth !== oldWidth) {
          newHeight = Math.round((newWidth / oldWidth) * newHeight);

          if (!isNaN(newHeight)) {
            heightCtrl.value(newHeight);
          }
        } else {
          newWidth = Math.round((newHeight / oldHeight) * newWidth);

          if (!isNaN(newWidth)) {
            widthCtrl.value(newWidth);
          }
        }
      }

      doSyncSize(widthCtrl, heightCtrl);
    };

    var syncSize = function (win) {
      doSizeControls(win, doSyncSize);
    };

    var updateSize = function (win) {
      doSizeControls(win, doUpdateSize);
    };

    var createUi = function (onChange) {
      var recalcSize = function () {
        onChange(function (win) {
          updateSize(win);
        });
      };

      return {
        type: 'container',
        label: 'Dimensions',
        layout: 'flex',
        align: 'center',
        spacing: 5,
        items: [
          {
            name: 'width', type: 'textbox', maxLength: 5, size: 5,
            onchange: recalcSize, ariaLabel: 'Width'
          },
          { type: 'label', text: 'x' },
          {
            name: 'height', type: 'textbox', maxLength: 5, size: 5,
            onchange: recalcSize, ariaLabel: 'Height'
          },
          { name: 'constrain', type: 'checkbox', checked: true, text: 'Constrain proportions' }
        ]
      };
    };

    return {
      createUi: createUi,
      syncSize: syncSize,
      updateSize: updateSize
    };
  }
);