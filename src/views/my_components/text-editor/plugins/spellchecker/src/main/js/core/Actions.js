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
  'tinymce.plugins.spellchecker.core.Actions',
  [
    'tinymce.core.util.Tools',
    'tinymce.core.util.URI',
    'tinymce.core.util.XHR',
    'tinymce.plugins.spellchecker.api.Events',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.DomTextMatcher'
  ],
  function (Tools, URI, XHR, Events, Settings, DomTextMatcher) {
    var getTextMatcher = function (editor, textMatcherState) {
      if (!textMatcherState.get()) {
        var textMatcher = new DomTextMatcher(editor.getBody(), editor);
        textMatcherState.set(textMatcher);
      }

      return textMatcherState.get();
    };

    var isEmpty = function (obj) {
      for (var name in obj) {
        return false;
      }

      return true;
    };

    var defaultSpellcheckCallback = function (editor, pluginUrl, currentLanguageState) {
      return function (method, text, doneCallback, errorCallback) {
        var data = { method: method, lang: currentLanguageState.get() }, postData = '';

        data[method === "addToDictionary" ? "word" : "text"] = text;

        Tools.each(data, function (value, key) {
          if (postData) {
            postData += '&';
          }

          postData += key + '=' + encodeURIComponent(value);
        });

        XHR.send({
          url: new URI(pluginUrl).toAbsolute(Settings.getRpcUrl(editor)),
          type: "post",
          content_type: 'application/x-www-form-urlencoded',
          data: postData,
          success: function (result) {
            result = JSON.parse(result);

            if (!result) {
              var message = editor.translate("Server response wasn't proper JSON.");
              errorCallback(message);
            } else if (result.error) {
              errorCallback(result.error);
            } else {
              doneCallback(result);
            }
          },
          error: function () {
            var message = editor.translate("The spelling service was not found: (") +
              Settings.getRpcUrl(editor) +
              editor.translate(")");
            errorCallback(message);
          }
        });
      };
    };

    var sendRpcCall = function (editor, pluginUrl, currentLanguageState, name, data, successCallback, errorCallback) {
      var userSpellcheckCallback = Settings.getSpellcheckerCallback(editor);
      var spellCheckCallback = userSpellcheckCallback ? userSpellcheckCallback : defaultSpellcheckCallback(editor, pluginUrl, currentLanguageState);
      spellCheckCallback.call(editor.plugins.spellchecker, name, data, successCallback, errorCallback);
    };

    var spellcheck = function (editor, pluginUrl, startedState, textMatcherState, lastSuggestionsState, currentLanguageState) {
      if (finish(editor, startedState, textMatcherState)) {
        return;
      }

      var errorCallback = function (message) {
        editor.notificationManager.open({ text: message, type: 'error' });
        editor.setProgressState(false);
        finish(editor, startedState, textMatcherState);
      };

      var successCallback = function (data) {
        markErrors(editor, startedState, textMatcherState, lastSuggestionsState, data);
      };

      editor.setProgressState(true);
      sendRpcCall(editor, pluginUrl, currentLanguageState, "spellcheck", getTextMatcher(editor, textMatcherState).text, successCallback, errorCallback);
      editor.focus();
    };

    var checkIfFinished = function (editor, startedState, textMatcherState) {
      if (!editor.dom.select('span.mce-spellchecker-word').length) {
        finish(editor, startedState, textMatcherState);
      }
    };

    var addToDictionary = function (editor, pluginUrl, startedState, textMatcherState, word, spans) {
      editor.setProgressState(true);

      sendRpcCall(editor, pluginUrl, 'addToDictionary', word, function () {
        editor.setProgressState(false);
        editor.dom.remove(spans, true);
        checkIfFinished(editor, startedState, textMatcherState);
      }, function (message) {
        editor.notificationManager.open({ text: message, type: 'error' });
        editor.setProgressState(false);
      });
    };

    var ignoreWord = function (editor, startedState, textMatcherState, word, spans, all) {
      editor.selection.collapse();

      if (all) {
        Tools.each(editor.dom.select('span.mce-spellchecker-word'), function (span) {
          if (span.getAttribute('data-mce-word') === word) {
            editor.dom.remove(span, true);
          }
        });
      } else {
        editor.dom.remove(spans, true);
      }

      checkIfFinished(editor, startedState, textMatcherState);
    };

    var finish = function (editor, startedState, textMatcherState) {
      getTextMatcher(editor, textMatcherState).reset();
      textMatcherState.set(null);

      if (startedState.get()) {
        startedState.set(false);
        Events.fireSpellcheckEnd(editor);
        return true;
      }
    };

    var getElmIndex = function (elm) {
      var value = elm.getAttribute('data-mce-index');

      if (typeof value === "number") {
        return "" + value;
      }

      return value;
    };

    var findSpansByIndex = function (editor, index) {
      var nodes, spans = [];

      nodes = Tools.toArray(editor.getBody().getElementsByTagName('span'));
      if (nodes.length) {
        for (var i = 0; i < nodes.length; i++) {
          var nodeIndex = getElmIndex(nodes[i]);

          if (nodeIndex === null || !nodeIndex.length) {
            continue;
          }

          if (nodeIndex === index.toString()) {
            spans.push(nodes[i]);
          }
        }
      }

      return spans;
    };

    var markErrors = function (editor, startedState, textMatcherState, lastSuggestionsState, data) {
      var suggestions, hasDictionarySupport;

      if (data.words) {
        hasDictionarySupport = !!data.dictionary;
        suggestions = data.words;
      } else {
        // Fallback to old format
        suggestions = data;
      }

      editor.setProgressState(false);

      if (isEmpty(suggestions)) {
        var message = editor.translate('No misspellings found.');
        editor.notificationManager.open({ text: message, type: 'info' });
        startedState.set(false);
        return;
      }

      lastSuggestionsState.set({
        suggestions: suggestions,
        hasDictionarySupport: hasDictionarySupport
      });

      getTextMatcher(editor, textMatcherState).find(Settings.getSpellcheckerWordcharPattern(editor)).filter(function (match) {
        return !!suggestions[match.text];
      }).wrap(function (match) {
        return editor.dom.create('span', {
          "class": 'mce-spellchecker-word',
          "data-mce-bogus": 1,
          "data-mce-word": match.text
        });
      });

      startedState.set(true);
      Events.fireSpellcheckStart(editor);
    };

    return {
      spellcheck: spellcheck,
      checkIfFinished: checkIfFinished,
      addToDictionary: addToDictionary,
      ignoreWord: ignoreWord,
      findSpansByIndex: findSpansByIndex,
      getElmIndex: getElmIndex,
      markErrors: markErrors
    };
  }
);