/**
 * DataToHtml.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.media.core.DataToHtml',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.media.api.Settings',
    'tinymce.plugins.media.core.HtmlToData',
    'tinymce.plugins.media.core.Mime',
    'tinymce.plugins.media.core.UpdateHtml',
    'tinymce.plugins.media.core.UrlPatterns',
    'tinymce.plugins.media.core.VideoScript'
  ],
  function (Tools, Settings, HtmlToData, Mime, UpdateHtml, UrlPatterns, VideoScript) {
    var getIframeHtml = function (data) {
      var allowFullscreen = data.allowFullscreen ? ' allowFullscreen="1"' : '';
      return '<iframe src="' + data.source1 + '" width="' + data.width + '" height="' + data.height + '"' + allowFullscreen + '></iframe>';
    };

    var getFlashHtml = function (data) {
      var html = '<object data="' + data.source1 + '" width="' + data.width + '" height="' + data.height + '" type="application/x-shockwave-flash">';

      if (data.poster) {
        html += '<img src="' + data.poster + '" width="' + data.width + '" height="' + data.height + '" />';
      }

      html += '</object>';

      return html;
    };

    var getAudioHtml = function (data, audioTemplateCallback) {
      if (audioTemplateCallback) {
        return audioTemplateCallback(data);
      } else {
        return (
          '<audio controls="controls" src="' + data.source1 + '">' +
          (
            data.source2 ?
              '\n<source src="' + data.source2 + '"' +
              (data.source2mime ? ' type="' + data.source2mime + '"' : '') +
              ' />\n' : '') +
          '</audio>'
        );
      }
    };

    var getVideoHtml = function (data, videoTemplateCallback) {
      if (videoTemplateCallback) {
        return videoTemplateCallback(data);
      } else {
        return (
          '<video width="' + data.width +
          '" height="' + data.height + '"' +
          (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' +
          '<source src="' + data.source1 + '"' +
          (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' +
          (data.source2 ? '<source src="' + data.source2 + '"' +
            (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') +
          '</video>'
        );
      }
    };

    var getScriptHtml = function (data) {
      return '<script src="' + data.source1 + '"></script>';
    };

    var dataToHtml = function (editor, dataIn) {
      var data = Tools.extend({}, dataIn);

      if (!data.source1) {
        Tools.extend(data, HtmlToData.htmlToData(Settings.getScripts(editor), data.embed));
        if (!data.source1) {
          return '';
        }
      }

      if (!data.source2) {
        data.source2 = '';
      }

      if (!data.poster) {
        data.poster = '';
      }

      data.source1 = editor.convertURL(data.source1, "source");
      data.source2 = editor.convertURL(data.source2, "source");
      data.source1mime = Mime.guess(data.source1);
      data.source2mime = Mime.guess(data.source2);
      data.poster = editor.convertURL(data.poster, "poster");

      Tools.each(UrlPatterns.urlPatterns, function (pattern) {
        var i;
        var url;

        var match = pattern.regex.exec(data.source1);

        if (match) {
          url = pattern.url;

          for (i = 0; match[i]; i++) {
            /*jshint loopfunc:true*/
            /*eslint no-loop-func:0 */
            url = url.replace('$' + i, function () {
              return match[i];
            });
          }

          data.source1 = url;
          data.type = pattern.type;
          data.allowFullscreen = pattern.allowFullscreen;
          data.width = data.width || pattern.w;
          data.height = data.height || pattern.h;
        }
      });

      if (data.embed) {
        return UpdateHtml.updateHtml(data.embed, data, true);
      } else {
        var videoScript = VideoScript.getVideoScriptMatch(Settings.getScripts(editor), data.source1);
        if (videoScript) {
          data.type = 'script';
          data.width = videoScript.width;
          data.height = videoScript.height;
        }

        var audioTemplateCallback = Settings.getAudioTemplateCallback(editor);
        var videoTemplateCallback = Settings.getVideoTemplateCallback(editor);

        data.width = data.width || 300;
        data.height = data.height || 150;

        Tools.each(data, function (value, key) {
          data[key] = editor.dom.encode(value);
        });

        if (data.type === "iframe") {
          return getIframeHtml(data);
        } else if (data.source1mime === "application/x-shockwave-flash") {
          return getFlashHtml(data);
        } else if (data.source1mime.indexOf('audio') !== -1) {
          return getAudioHtml(data, audioTemplateCallback);
        } else if (data.type === "script") {
          return getScriptHtml(data);
        } else {
          return getVideoHtml(data, videoTemplateCallback);
        }
      }
    };

    return {
      dataToHtml: dataToHtml
    };
  }
);