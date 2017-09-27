/**
 * Render.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.inlite.core.Render',
  [
    'tinymce.core.util.Delay',
    'tinymce.themes.inlite.alien.Arr',
    'tinymce.themes.inlite.core.ElementMatcher',
    'tinymce.themes.inlite.core.Matcher',
    'tinymce.themes.inlite.core.PredicateId',
    'tinymce.themes.inlite.core.SelectionMatcher',
    'tinymce.themes.inlite.core.SkinLoader'
  ],
  function (Delay, Arr, ElementMatcher, Matcher, PredicateId, SelectionMatcher, SkinLoader) {
    var getSelectionElements = function (editor) {
      var node = editor.selection.getNode();
      var elms = editor.dom.getParents(node);
      return elms;
    };

    var createToolbar = function (editor, selector, id, items) {
      var selectorPredicate = function (elm) {
        return editor.dom.is(elm, selector);
      };

      return {
        predicate: selectorPredicate,
        id: id,
        items: items
      };
    };

    var getToolbars = function (editor) {
      var contextToolbars = editor.contextToolbars;

      return Arr.flatten([
        contextToolbars ? contextToolbars : [],
        createToolbar(editor, 'img', 'image', 'alignleft aligncenter alignright')
      ]);
    };

    var findMatchResult = function (editor, toolbars) {
      var result, elements, contextToolbarsPredicateIds;

      elements = getSelectionElements(editor);
      contextToolbarsPredicateIds = PredicateId.fromContextToolbars(toolbars);

      result = Matcher.match(editor, [
        ElementMatcher.element(elements[0], contextToolbarsPredicateIds),
        SelectionMatcher.textSelection('text'),
        SelectionMatcher.emptyTextBlock(elements, 'insert'),
        ElementMatcher.parent(elements, contextToolbarsPredicateIds)
      ]);

      return result && result.rect ? result : null;
    };

    var togglePanel = function (editor, panel) {
      var toggle = function () {
        var toolbars = getToolbars(editor);
        var result = findMatchResult(editor, toolbars);

        if (result) {
          panel.show(editor, result.id, result.rect, toolbars);
        } else {
          panel.hide();
        }
      };

      return function () {
        if (!editor.removed) {
          toggle();
        }
      };
    };

    var repositionPanel = function (editor, panel) {
      return function () {
        var toolbars = getToolbars(editor);
        var result = findMatchResult(editor, toolbars);

        if (result) {
          panel.reposition(editor, result.id, result.rect);
        }
      };
    };

    var ignoreWhenFormIsVisible = function (editor, panel, f) {
      return function () {
        if (!editor.removed && !panel.inForm()) {
          f();
        }
      };
    };

    var bindContextualToolbarsEvents = function (editor, panel) {
      var throttledTogglePanel = Delay.throttle(togglePanel(editor, panel), 0);
      var throttledTogglePanelWhenNotInForm = Delay.throttle(ignoreWhenFormIsVisible(editor, panel, togglePanel(editor, panel)), 0);

      editor.on('blur hide ObjectResizeStart', panel.hide);
      editor.on('click', throttledTogglePanel);
      editor.on('nodeChange mouseup', throttledTogglePanelWhenNotInForm);
      editor.on('ResizeEditor keyup', throttledTogglePanel);
      editor.on('ResizeWindow', repositionPanel(editor, panel));
      editor.on('remove', panel.remove);

      editor.shortcuts.add('Alt+F10,F10', '', panel.focus);
    };

    var overrideLinkShortcut = function (editor, panel) {
      editor.shortcuts.remove('meta+k');
      editor.shortcuts.add('meta+k', '', function () {
        var toolbars = getToolbars(editor);
        var result = result = Matcher.match(editor, [
          SelectionMatcher.textSelection('quicklink')
        ]);

        if (result) {
          panel.show(editor, result.id, result.rect, toolbars);
        }
      });
    };

    var renderInlineUI = function (editor, panel) {
      SkinLoader.load(editor, function () {
        bindContextualToolbarsEvents(editor, panel);
        overrideLinkShortcut(editor, panel);
      });

      return {};
    };

    var fail = function (message) {
      throw new Error(message);
    };

    var renderUI = function (editor, panel) {
      return editor.inline ? renderInlineUI(editor, panel) : fail('inlite theme only supports inline mode.');
    };

    return {
      renderUI: renderUI
    };
  }
);
