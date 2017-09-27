/**
 * SuggestionsMenu.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.spellchecker.ui.SuggestionsMenu',
  [
    'global!document',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.plugins.spellchecker.api.Settings',
    'tinymce.plugins.spellchecker.core.Actions'
  ],
  function (document, DOMUtils, Factory, Tools, Settings, Actions) {
    var suggestionsMenu;

    var showSuggestions = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, word, spans) {
      var items = [], suggestions = lastSuggestionsState.get().suggestions[word];

      Tools.each(suggestions, function (suggestion) {
        items.push({
          text: suggestion,
          onclick: function () {
            editor.insertContent(editor.dom.encode(suggestion));
            editor.dom.remove(spans);
            Actions.checkIfFinished(editor, startedState, textMatcherState);
          }
        });
      });

      items.push({ text: '-' });

      var hasDictionarySupport = lastSuggestionsState.get().hasDictionarySupport;
      if (hasDictionarySupport) {
        items.push({
          text: 'Add to Dictionary', onclick: function () {
            Actions.addToDictionary(editor, pluginUrl, startedState, textMatcherState, word, spans);
          }
        });
      }

      items.push.apply(items, [
        {
          text: 'Ignore', onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans);
          }
        },

        {
          text: 'Ignore all', onclick: function () {
            Actions.ignoreWord(editor, startedState, textMatcherState, word, spans, true);
          }
        }
      ]);

      // Render menu
      suggestionsMenu = Factory.create('menu', {
        items: items,
        context: 'contextmenu',
        onautohide: function (e) {
          if (e.target.className.indexOf('spellchecker') !== -1) {
            e.preventDefault();
          }
        },
        onhide: function () {
          suggestionsMenu.remove();
          suggestionsMenu = null;
        }
      });

      suggestionsMenu.renderTo(document.body);

      // Position menu
      var pos = DOMUtils.DOM.getPos(editor.getContentAreaContainer());
      var targetPos = editor.dom.getPos(spans[0]);
      var root = editor.dom.getRoot();

      // Adjust targetPos for scrolling in the editor
      if (root.nodeName === 'BODY') {
        targetPos.x -= root.ownerDocument.documentElement.scrollLeft || root.scrollLeft;
        targetPos.y -= root.ownerDocument.documentElement.scrollTop || root.scrollTop;
      } else {
        targetPos.x -= root.scrollLeft;
        targetPos.y -= root.scrollTop;
      }

      pos.x += targetPos.x;
      pos.y += targetPos.y;

      suggestionsMenu.moveTo(pos.x, pos.y + spans[0].offsetHeight);
    };

    var setup = function (editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState) {
      editor.on('click', function (e) {
        var target = e.target;

        if (target.className === "mce-spellchecker-word") {
          e.preventDefault();

          var spans = Actions.findSpansByIndex(editor, Actions.getElmIndex(target));

          if (spans.length > 0) {
            var rng = editor.dom.createRng();
            rng.setStartBefore(spans[0]);
            rng.setEndAfter(spans[spans.length - 1]);
            editor.selection.setRng(rng);
            showSuggestions(editor, pluginUrl, lastSuggestionsState, startedState, textMatcherState, target.getAttribute('data-mce-word'), spans);
          }
        }
      });
    };

    return {
      setup: setup
    };
  }
);
