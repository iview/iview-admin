/**
 * Sidebar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.themes.modern.ui.Sidebar',
  [
    'tinymce.core.Env',
    'tinymce.core.ui.Factory',
    'tinymce.core.util.Tools',
    'tinymce.themes.modern.api.Events'
  ],
  function (Env, Factory, Tools, Events) {
    var api = function (elm) {
      return {
        element: function () {
          return elm;
        }
      };
    };

    var trigger = function (sidebar, panel, callbackName) {
      var callback = sidebar.settings[callbackName];
      if (callback) {
        callback(api(panel.getEl('body')));
      }
    };

    var hidePanels = function (name, container, sidebars) {
      Tools.each(sidebars, function (sidebar) {
        var panel = container.items().filter('#' + sidebar.name)[0];

        if (panel && panel.visible() && sidebar.name !== name) {
          trigger(sidebar, panel, 'onhide');
          panel.visible(false);
        }
      });
    };

    var deactivateButtons = function (toolbar) {
      toolbar.items().each(function (ctrl) {
        ctrl.active(false);
      });
    };

    var findSidebar = function (sidebars, name) {
      return Tools.grep(sidebars, function (sidebar) {
        return sidebar.name === name;
      })[0];
    };

    var showPanel = function (editor, name, sidebars) {
      return function (e) {
        var btnCtrl = e.control;
        var container = btnCtrl.parents().filter('panel')[0];
        var panel = container.find('#' + name)[0];
        var sidebar = findSidebar(sidebars, name);

        hidePanels(name, container, sidebars);
        deactivateButtons(btnCtrl.parent());

        if (panel && panel.visible()) {
          trigger(sidebar, panel, 'onhide');
          panel.hide();
          btnCtrl.active(false);
        } else {
          if (panel) {
            panel.show();
            trigger(sidebar, panel, 'onshow');
          } else {
            panel = Factory.create({
              type: 'container',
              name: name,
              layout: 'stack',
              classes: 'sidebar-panel',
              html: ''
            });

            container.prepend(panel);
            trigger(sidebar, panel, 'onrender');
            trigger(sidebar, panel, 'onshow');
          }

          btnCtrl.active(true);
        }

        Events.fireResizeEditor(editor);
      };
    };

    var isModernBrowser = function () {
      return !Env.ie || Env.ie >= 11;
    };

    var hasSidebar = function (editor) {
      return isModernBrowser() && editor.sidebars ? editor.sidebars.length > 0 : false;
    };

    var createSidebar = function (editor) {
      var buttons = Tools.map(editor.sidebars, function (sidebar) {
        var settings = sidebar.settings;

        return {
          type: 'button',
          icon: settings.icon,
          image: settings.image,
          tooltip: settings.tooltip,
          onclick: showPanel(editor, sidebar.name, editor.sidebars)
        };
      });

      return {
        type: 'panel',
        name: 'sidebar',
        layout: 'stack',
        classes: 'sidebar',
        items: [
          {
            type: 'toolbar',
            layout: 'stack',
            classes: 'sidebar-toolbar',
            items: buttons
          }
        ]
      };
    };

    return {
      hasSidebar: hasSidebar,
      createSidebar: createSidebar
    };
  }
);