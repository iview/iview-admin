/**
 * NotificationDemo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*eslint no-console:0 */

define(
  'tinymce.themes.modern.demo.NotificationDemo',
  [
    'ephox.katamari.api.Arr',
    'global!console',
    'global!document',
    'global!setTimeout',
    'tinymce.core.EditorManager',
    'tinymce.themes.modern.Theme'
  ],
  function (Arr, console, document, setTimeout, EditorManager, ModernTheme) {
    ModernTheme();

    var notifyShort = function (type) {
      var notification = EditorManager.activeEditor.notificationManager.open({
        type: type,
        text: 'This is an example ' + (type ? type : 'blank') + ' message.'
      });

      setTimeout(function () {
        notification.text('Message changed.');
      }, 5000);
      console.log(notification);
    };

    var notifyLong = function (len) {
      var longTextMessage = [];

      for (var i = 0; i < len; i++) {
        longTextMessage.push('bla');
      }

      var notification = EditorManager.activeEditor.notificationManager.open({
        text: longTextMessage.join(' ')
      });
      console.log(notification);
    };

    var notifyExtraLong = function (len) {
      var longTextMessage = ['this is text '];

      for (var i = 0; i < len; i++) {
        longTextMessage.push('bla');
      }

      var notification = EditorManager.activeEditor.notificationManager.open({
        text: longTextMessage.join('')
      });
      console.log(notification);
    };

    var notifyProgress = function (percent) {
      var notification = EditorManager.activeEditor.notificationManager.open({
        text: 'Progress text',
        progressBar: true
      });

      notification.progressBar.value(percent);

      setTimeout(function () {
        notification.progressBar.value(90);
      }, 5000);
      console.log(notification);
    };

    var notifyTimeout = function (time) {
      var notification = EditorManager.activeEditor.notificationManager.open({
        text: 'Timeout: ' + time,
        timeout: time
      });
      console.log(notification);
    };

    var notifyIcon = function () {
      var notification = EditorManager.activeEditor.notificationManager.open({
        text: 'Text',
        icon: 'bold'
      });
      console.log(notification);
    };

    Arr.each([
      { title: 'success', action: notifyShort, value: 'success' },
      { title: 'error', action: notifyShort, value: 'error' },
      { title: 'warn', action: notifyShort, value: 'warning' },
      { title: 'info', action: notifyShort, value: 'info' },
      { title: 'blank', action: notifyShort },
      { title: 'notifyLong', action: notifyLong, value: 100 },
      { title: 'notifyExtraLong', action: notifyExtraLong, value: 100 },
      { title: 'notifyProgress', action: notifyProgress, value: 50 },
      { title: 'notifyTimeout', action: notifyTimeout, value: 3000 },
      { title: 'notifyIcon', action: notifyIcon }
    ], function (notification) {
      var btn = document.createElement('button');
      btn.innerHTML = notification.title;
      btn.onclick = function () {
        notification.action(notification.value);
      };
      document.querySelector('#ephox-ui').appendChild(btn);
    });

    EditorManager.init({
      selector: 'textarea.tinymce',
      skin_url: '../../../../../skins/lightgray/dist/lightgray',
      codesample_content_css: '../../../../../plugins/codesample/dist/codesample/css/prism.css'
    });

    EditorManager.init({
      selector: 'div.tinymce',
      inline: true,
      skin_url: '../../../../../skins/lightgray/dist/lightgray',
      codesample_content_css: '../../../../../plugins/codesample/dist/codesample/css/prism.css'
    });

    return function () {
    };
  }
);
