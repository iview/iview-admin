/**
 * Inline.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.modes.Inline',
  [
    'global!document',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ui.Factory',
    'tinymce.themes.modern.api.Events',
    'tinymce.themes.modern.api.Settings',
    'tinymce.themes.modern.ui.A11y',
    'tinymce.themes.modern.ui.ContextToolbars',
    'tinymce.themes.modern.ui.Menubar',
    'tinymce.themes.modern.ui.SkinLoaded',
    'tinymce.themes.modern.ui.Toolbar',
    'tinymce.ui.FloatPanel'
  ],
  function (document, DOMUtils, Factory, Events, Settings, A11y, ContextToolbars, Menubar, SkinLoaded, Toolbar, FloatPanel) {
    var render = function (editor, theme, args) {
      var panel, inlineToolbarContainer;
      var DOM = DOMUtils.DOM;

      var fixedToolbarContainer = Settings.getFixedToolbarContainer(editor);
      if (fixedToolbarContainer) {
        inlineToolbarContainer = DOM.select(fixedToolbarContainer)[0];
      }

      var reposition = function () {
        if (panel && panel.moveRel && panel.visible() && !panel._fixed) {
          // TODO: This is kind of ugly and doesn't handle multiple scrollable elements
          var scrollContainer = editor.selection.getScrollContainer(), body = editor.getBody();
          var deltaX = 0, deltaY = 0;

          if (scrollContainer) {
            var bodyPos = DOM.getPos(body), scrollContainerPos = DOM.getPos(scrollContainer);

            deltaX = Math.max(0, scrollContainerPos.x - bodyPos.x);
            deltaY = Math.max(0, scrollContainerPos.y - bodyPos.y);
          }

          panel.fixed(false).moveRel(body, editor.rtl ? ['tr-br', 'br-tr'] : ['tl-bl', 'bl-tl', 'tr-br']).moveBy(deltaX, deltaY);
        }
      };

      var show = function () {
        if (panel) {
          panel.show();
          reposition();
          DOM.addClass(editor.getBody(), 'mce-edit-focus');
        }
      };

      var hide = function () {
        if (panel) {
          // We require two events as the inline float panel based toolbar does not have autohide=true
          panel.hide();

          // All other autohidden float panels will be closed below.
          FloatPanel.hideAll();

          DOM.removeClass(editor.getBody(), 'mce-edit-focus');
        }
      };

      var render = function () {
        if (panel) {
          if (!panel.visible()) {
            show();
          }

          return;
        }

        // Render a plain panel inside the inlineToolbarContainer if it's defined
        panel = theme.panel = Factory.create({
          type: inlineToolbarContainer ? 'panel' : 'floatpanel',
          role: 'application',
          classes: 'tinymce tinymce-inline',
          layout: 'flex',
          direction: 'column',
          align: 'stretch',
          autohide: false,
          autofix: true,
          fixed: !!inlineToolbarContainer,
          border: 1,
          items: [
            Settings.hasMenubar(editor) === false ? null : { type: 'menubar', border: '0 0 1 0', items: Menubar.createMenuButtons(editor) },
            Toolbar.createToolbars(editor, Settings.getToolbarSize(editor))
          ]
        });

        // Add statusbar
        /*if (settings.statusbar !== false) {
          panel.add({type: 'panel', classes: 'statusbar', layout: 'flow', border: '1 0 0 0', items: [
            {type: 'elementpath'}
          ]});
        }*/

        Events.fireBeforeRenderUI(editor);
        panel.renderTo(inlineToolbarContainer || document.body).reflow();

        A11y.addKeys(editor, panel);
        show();
        ContextToolbars.addContextualToolbars(editor);

        editor.on('nodeChange', reposition);
        editor.on('activate', show);
        editor.on('deactivate', hide);

        editor.nodeChanged();
      };

      editor.settings.content_editable = true;

      editor.on('focus', function () {
        // Render only when the CSS file has been loaded
        if (args.skinUiCss) {
          DOM.styleSheetLoader.load(args.skinUiCss, render, render);
        } else {
          render();
        }
      });

      editor.on('blur hide', hide);

      // Remove the panel when the editor is removed
      editor.on('remove', function () {
        if (panel) {
          panel.remove();
          panel = null;
        }
      });

      // Preload skin css
      if (args.skinUiCss) {
        DOM.styleSheetLoader.load(args.skinUiCss, SkinLoaded.fireSkinLoaded(editor));
      }

      return {};
    };

    return {
      render: render
    };
  }
);
