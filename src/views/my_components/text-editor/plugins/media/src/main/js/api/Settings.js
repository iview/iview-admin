/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.api.Settings',
  [
  ],
  function () {
    var getScripts = function (editor) {
      return editor.getParam('media_scripts');
    };

    var getAudioTemplateCallback = function (editor) {
      return editor.getParam('audio_template_callback');
    };

    var getVideoTemplateCallback = function (editor) {
      return editor.getParam('video_template_callback');
    };

    var hasLiveEmbeds = function (editor) {
      return editor.getParam('media_live_embeds', true);
    };

    var shouldFilterHtml = function (editor) {
      return editor.getParam('media_filter_html', true);
    };

    var getUrlResolver = function (editor) {
      return editor.getParam('media_url_resolver');
    };

    var hasAltSource = function (editor) {
      return editor.getParam('media_alt_source', true);
    };

    var hasPoster = function (editor) {
      return editor.getParam('media_poster', true);
    };

    var hasDimensions = function (editor) {
      return editor.getParam('media_dimensions', true);
    };

    return {
      getScripts: getScripts,
      getAudioTemplateCallback: getAudioTemplateCallback,
      getVideoTemplateCallback: getVideoTemplateCallback,
      hasLiveEmbeds: hasLiveEmbeds,
      shouldFilterHtml: shouldFilterHtml,
      getUrlResolver: getUrlResolver,
      hasAltSource: hasAltSource,
      hasPoster: hasPoster,
      hasDimensions: hasDimensions
    };
  }
);
