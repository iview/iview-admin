/**
 * UrlPatterns.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.UrlPatterns',
  [
  ],
  function () {
    var urlPatterns = [
      {
        regex: /youtu\.be\/([\w\-.]+)/,
        type: 'iframe', w: 560, h: 314,
        url: '//www.youtube.com/embed/$1',
        allowFullscreen: true
      },
      {
        regex: /youtube\.com(.+)v=([^&]+)/,
        type: 'iframe', w: 560, h: 314,
        url: '//www.youtube.com/embed/$2',
        allowFullscreen: true
      },
      {
        regex: /youtube.com\/embed\/([a-z0-9\-_]+(?:\?.+)?)/i,
        type: 'iframe', w: 560, h: 314,
        url: '//www.youtube.com/embed/$1',
        allowFullscreen: true
      },
      {
        regex: /vimeo\.com\/([0-9]+)/,
        type: 'iframe', w: 425, h: 350,
        url: '//player.vimeo.com/video/$1?title=0&byline=0&portrait=0&color=8dc7dc',
        allowfullscreen: true
      },
      {
        regex: /vimeo\.com\/(.*)\/([0-9]+)/,
        type: "iframe", w: 425, h: 350,
        url: "//player.vimeo.com/video/$2?title=0&amp;byline=0",
        allowfullscreen: true
      },
      {
        regex: /maps\.google\.([a-z]{2,3})\/maps\/(.+)msid=(.+)/,
        type: 'iframe', w: 425, h: 350,
        url: '//maps.google.com/maps/ms?msid=$2&output=embed"',
        allowFullscreen: false
      },
      {
        regex: /dailymotion\.com\/video\/([^_]+)/,
        type: 'iframe', w: 480, h: 270,
        url: '//www.dailymotion.com/embed/video/$1',
        allowFullscreen: true
      }
    ];

    return {
      urlPatterns: urlPatterns
    };
  }
);