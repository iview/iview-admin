'use strict';

/* eslint import/no-extraneous-dependencies: off, global-require: off */

const $ = require('jquery');
const stripAnsi = require('strip-ansi');
const socket = require('./socket');
require('./style.css');

let hot = false;
let currentHash = '';

$(function ready() {
  $('body').html(require('./page.pug')());
  const status = $('#status');
  const okness = $('#okness');
  const $errors = $('#errors');
  const iframe = $('#iframe');
  const header = $('.header');

  const contentPage = window.location.pathname.substr('/webpack-dev-server'.length) + window.location.search;

  status.text('Connecting to sockjs server...');
  $errors.hide();
  iframe.hide();
  header.css({
    borderColor: '#96b5b4'
  });

  const onSocketMsg = {
    hot: function msgHot() {
      hot = true;
      iframe.attr('src', contentPage + window.location.hash);
    },
    invalid: function msgInvalid() {
      okness.text('');
      status.text('App updated. Recompiling...');
      header.css({
        borderColor: '#96b5b4'
      });
      $errors.hide();
      if (!hot) iframe.hide();
    },
    hash: function msgHash(hash) {
      currentHash = hash;
    },
    'still-ok': function stillOk() {
      okness.text('');
      status.text('App ready.');
      header.css({
        borderColor: ''
      });
      $errors.hide();
      if (!hot) iframe.show();
    },
    ok: function msgOk() {
      okness.text('');
      $errors.hide();
      reloadApp();
    },
    warnings: function msgWarnings() {
      okness.text('Warnings while compiling.');
      $errors.hide();
      reloadApp();
    },
    errors: function msgErrors(errors) {
      status.text('App updated with errors. No reload!');
      okness.text('Errors while compiling.');
      $errors.text('\n' + stripAnsi(errors.join('\n\n\n')) + '\n\n');
      header.css({
        borderColor: '#ebcb8b'
      });
      $errors.show();
      iframe.hide();
    },
    close: function msgClose() {
      status.text('');
      okness.text('Disconnected.');
      $errors.text('\n\n\n  Lost connection to webpack-dev-server.\n  Please restart the server to reestablish connection...\n\n\n\n');
      header.css({
        borderColor: '#ebcb8b'
      });
      $errors.show();
      iframe.hide();
    }
  };

  socket('/sockjs-node', onSocketMsg);

  iframe.on('load', function load() {
    status.text('App ready.');
    header.css({
      borderColor: ''
    });
    iframe.show();
  });

  function reloadApp() {
    if (hot) {
      status.text('App hot update.');
      try {
        iframe[0].contentWindow.postMessage('webpackHotUpdate' + currentHash, '*');
      } catch (e) {
        console.warn(e); // eslint-disable-line
      }
      iframe.show();
    } else {
      status.text('App updated. Reloading app...');
      header.css({
        borderColor: '#96b5b4'
      });
      try {
        let old = iframe[0].contentWindow.location + '';
        if (old.indexOf('about') === 0) old = null;
        iframe.attr('src', old || (contentPage + window.location.hash));
        if (old) {
          iframe[0].contentWindow.location.reload();
        }
      } catch (e) {
        iframe.attr('src', contentPage + window.location.hash);
      }
    }
  }
});
