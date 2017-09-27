/**
 * Dialog.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.searchreplace.ui.Dialog',
  [
    'tinymce.core.util.Tools',
    'tinymce.plugins.searchreplace.core.Actions'
  ],
  function (Tools, Actions) {
    var open = function (editor, currentIndexState) {
      var last = {}, selectedText;

      selectedText = Tools.trim(editor.selection.getContent({ format: 'text' }));

      function updateButtonStates() {
        win.statusbar.find('#next').disabled(Actions.hasNext(editor, currentIndexState) === false);
        win.statusbar.find('#prev').disabled(Actions.hasPrev(editor, currentIndexState) === false);
      }

      function notFoundAlert() {
        editor.windowManager.alert('Could not find the specified string.', function () {
          win.find('#find')[0].focus();
        });
      }

      var win = editor.windowManager.open({
        layout: "flex",
        pack: "center",
        align: "center",
        onClose: function () {
          editor.focus();
          Actions.done(editor, currentIndexState);
        },
        onSubmit: function (e) {
          var count, caseState, text, wholeWord;

          e.preventDefault();

          caseState = win.find('#case').checked();
          wholeWord = win.find('#words').checked();

          text = win.find('#find').value();
          if (!text.length) {
            Actions.done(editor, currentIndexState, false);
            win.statusbar.items().slice(1).disabled(true);
            return;
          }

          if (last.text === text && last.caseState === caseState && last.wholeWord === wholeWord) {
            if (!Actions.hasNext(editor, currentIndexState)) {
              notFoundAlert();
              return;
            }

            Actions.next(editor, currentIndexState);
            updateButtonStates();
            return;
          }

          count = Actions.find(editor, currentIndexState, text, caseState, wholeWord);
          if (!count) {
            notFoundAlert();
          }

          win.statusbar.items().slice(1).disabled(count === 0);
          updateButtonStates();

          last = {
            text: text,
            caseState: caseState,
            wholeWord: wholeWord
          };
        },
        buttons: [
          {
            text: "Find", subtype: 'primary', onclick: function () {
              win.submit();
            }
          },
          {
            text: "Replace", disabled: true, onclick: function () {
              if (!Actions.replace(editor, currentIndexState, win.find('#replace').value())) {
                win.statusbar.items().slice(1).disabled(true);
                currentIndexState.set(-1);
                last = {};
              }
            }
          },
          {
            text: "Replace all", disabled: true, onclick: function () {
              Actions.replace(editor, currentIndexState, win.find('#replace').value(), true, true);
              win.statusbar.items().slice(1).disabled(true);
              last = {};
            }
          },
          { type: "spacer", flex: 1 },
          {
            text: "Prev", name: 'prev', disabled: true, onclick: function () {
              Actions.prev(editor, currentIndexState);
              updateButtonStates();
            }
          },
          {
            text: "Next", name: 'next', disabled: true, onclick: function () {
              Actions.next(editor, currentIndexState);
              updateButtonStates();
            }
          }
        ],
        title: "Find and replace",
        items: {
          type: "form",
          padding: 20,
          labelGap: 30,
          spacing: 10,
          items: [
            { type: 'textbox', name: 'find', size: 40, label: 'Find', value: selectedText },
            { type: 'textbox', name: 'replace', size: 40, label: 'Replace with' },
            { type: 'checkbox', name: 'case', text: 'Match case', label: ' ' },
            { type: 'checkbox', name: 'words', text: 'Whole words', label: ' ' }
          ]
        }
      });
    };

    return {
      open: open
    };
  }
);