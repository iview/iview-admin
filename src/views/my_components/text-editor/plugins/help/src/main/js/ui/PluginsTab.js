/**
 * PluginsTab.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.help.ui.PluginsTab',
  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Strings',
    'tinymce.core.EditorManager',
    'tinymce.core.util.I18n',
    'tinymce.plugins.help.data.PluginUrls'
  ],
  function (Arr, Fun, Obj, Strings, tinymce, I18n, PluginUrls) {
    var makeLink = Fun.curry(Strings.supplant, '<a href="${url}" target="_blank" rel="noopener">${name}</a>');

    var maybeUrlize = function (editor, key) {
      return Arr.find(PluginUrls.urls, function (x) {
        return x.key === key;
      }).fold(function () {
        var getMetadata = editor.plugins[key].getMetadata;
        return typeof getMetadata === 'function' ? makeLink(getMetadata()) : key;
      }, function (x) {
        return makeLink({ name: x.name, url: 'https://www.tinymce.com/docs/plugins/' + x.key });
      });
    };

    var getPluginKeys = function (editor) {
      var keys = Obj.keys(editor.plugins);
      return editor.settings.forced_plugins === undefined ?
        keys :
        Arr.filter(keys, Fun.not(Fun.curry(Arr.contains, editor.settings.forced_plugins)));
    };

    var pluginLister = function (editor) {
      var pluginKeys = getPluginKeys(editor);
      var pluginLis = Arr.map(pluginKeys, function (key) {
        return '<li>' + maybeUrlize(editor, key) + '</li>';
      });
      var count = pluginLis.length;
      var pluginsString = pluginLis.join('');

      return '<p><b>' + I18n.translate(['Plugins installed ({0}):', count ]) + '</b></p>' +
              '<ul>' + pluginsString + '</ul>';
    };

    var installedPlugins = function (editor) {
      return {
        type: 'container',
        html: '<div style="overflow-y: auto; overflow-x: hidden; max-height: 230px; height: 230px;" data-mce-tabstop="1" tabindex="-1">' +
                pluginLister(editor) +
              '</div>',
        flex: 1
      };
    };

    var availablePlugins = function () {
      return {
        type: 'container',
        html: '<div style="padding: 10px; background: #e3e7f4; height: 100%;" data-mce-tabstop="1" tabindex="-1">' +
                '<p><b>' + I18n.translate('Premium plugins:') + '</b></p>' +
                '<ul>' +
                  '<li>PowerPaste</li>' +
                  '<li>Spell Checker Pro</li>' +
                  '<li>Accessibility Checker</li>' +
                  '<li>Advanced Code Editor</li>' +
                  '<li>Enhanced Media Embed</li>' +
                  '<li>Link Checker</li>' +
                '</ul><br />' +
                '<p style="float: right;"><a href="https://www.tinymce.com/pricing/" target="_blank">' + I18n.translate('Learn more...') + '</a></p>' +
              '</div>',
        flex: 1
      };
    };

    var makeTab = function (editor) {
      return {
        title: 'Plugins',
        type: 'container',
        style: 'overflow-y: auto; overflow-x: hidden;',
        layout: 'flex',
        padding: 10,
        spacing: 10,
        items: [
          installedPlugins(editor),
          availablePlugins()
        ]
      };
    };

    return {
      makeTab: makeTab
    };
  }
);
