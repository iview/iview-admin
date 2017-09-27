/**
 * ImportCss.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.importcss.core.ImportCss',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.EditorManager',
    'tinymce.core.Env',
    'tinymce.core.util.Tools',
    'tinymce.plugins.importcss.api.Settings'
  ],
  function (DOMUtils, EditorManager, Env, Tools, Settings) {
    var removeCacheSuffix = function (url) {
      var cacheSuffix = Env.cacheSuffix;

      if (typeof url === 'string') {
        url = url.replace('?' + cacheSuffix, '').replace('&' + cacheSuffix, '');
      }

      return url;
    };

    var isSkinContentCss = function (editor, href) {
      var settings = editor.settings, skin = settings.skin !== false ? settings.skin || 'lightgray' : false;

      if (skin) {
        var skinUrl = settings.skin_url ? editor.documentBaseURI.toAbsolute(settings.skin_url) : EditorManager.baseURL + '/skins/' + skin;
        return href === skinUrl + '/content' + (editor.inline ? '.inline' : '') + '.min.css';
      }

      return false;
    };

    var compileFilter = function (filter) {
      if (typeof filter === "string") {
        return function (value) {
          return value.indexOf(filter) !== -1;
        };
      } else if (filter instanceof RegExp) {
        return function (value) {
          return filter.test(value);
        };
      }

      return filter;
    };

    var getSelectors = function (editor, doc, fileFilter) {
      var selectors = [], contentCSSUrls = {};

      function append(styleSheet, imported) {
        var href = styleSheet.href, rules;

        href = removeCacheSuffix(href);

        if (!href || !fileFilter(href, imported) || isSkinContentCss(editor, href)) {
          return;
        }

        Tools.each(styleSheet.imports, function (styleSheet) {
          append(styleSheet, true);
        });

        try {
          rules = styleSheet.cssRules || styleSheet.rules;
        } catch (e) {
          // Firefox fails on rules to remote domain for example:
          // @import url(//fonts.googleapis.com/css?family=Pathway+Gothic+One);
        }

        Tools.each(rules, function (cssRule) {
          if (cssRule.styleSheet) {
            append(cssRule.styleSheet, true);
          } else if (cssRule.selectorText) {
            Tools.each(cssRule.selectorText.split(','), function (selector) {
              selectors.push(Tools.trim(selector));
            });
          }
        });
      }

      Tools.each(editor.contentCSS, function (url) {
        contentCSSUrls[url] = true;
      });

      if (!fileFilter) {
        fileFilter = function (href, imported) {
          return imported || contentCSSUrls[href];
        };
      }

      try {
        Tools.each(doc.styleSheets, function (styleSheet) {
          append(styleSheet);
        });
      } catch (e) {
        // Ignore
      }

      return selectors;
    };

    var defaultConvertSelectorToFormat = function (editor, selectorText) {
      var format;

      // Parse simple element.class1, .class1
      var selector = /^(?:([a-z0-9\-_]+))?(\.[a-z0-9_\-\.]+)$/i.exec(selectorText);
      if (!selector) {
        return;
      }

      var elementName = selector[1];
      var classes = selector[2].substr(1).split('.').join(' ');
      var inlineSelectorElements = Tools.makeMap('a,img');

      // element.class - Produce block formats
      if (selector[1]) {
        format = {
          title: selectorText
        };

        if (editor.schema.getTextBlockElements()[elementName]) {
          // Text block format ex: h1.class1
          format.block = elementName;
        } else if (editor.schema.getBlockElements()[elementName] || inlineSelectorElements[elementName.toLowerCase()]) {
          // Block elements such as table.class and special inline elements such as a.class or img.class
          format.selector = elementName;
        } else {
          // Inline format strong.class1
          format.inline = elementName;
        }
      } else if (selector[2]) {
        // .class - Produce inline span with classes
        format = {
          inline: 'span',
          title: selectorText.substr(1),
          classes: classes
        };
      }

      // Append to or override class attribute
      if (Settings.shouldMergeClasses(editor) !== false) {
        format.classes = classes;
      } else {
        format.attributes = { "class": classes };
      }

      return format;
    };

    var getGroupsBySelector = function (groups, selector) {
      return Tools.grep(groups, function (group) {
        return !group.filter || group.filter(selector);
      });
    };

    var compileUserDefinedGroups = function (groups) {
      return Tools.map(groups, function (group) {
        return Tools.extend({}, group, {
          original: group,
          selectors: {},
          filter: compileFilter(group.filter),
          item: {
            text: group.title,
            menu: []
          }
        });
      });
    };

    var isExclusiveMode = function (editor, group) {
      // Exclusive mode can only be disabled when there are groups allowing the same style to be present in multiple groups
      return group === null || Settings.shouldImportExclusive(editor) !== false;
    };

    var isUniqueSelector = function (editor, selector, group, globallyUniqueSelectors) {
      return !(isExclusiveMode(editor, group) ? selector in globallyUniqueSelectors : selector in group.selectors);
    };

    var markUniqueSelector = function (editor, selector, group, globallyUniqueSelectors) {
      if (isExclusiveMode(editor, group)) {
        globallyUniqueSelectors[selector] = true;
      } else {
        group.selectors[selector] = true;
      }
    };

    var convertSelectorToFormat = function (editor, plugin, selector, group) {
      var selectorConverter;

      if (group && group.selector_converter) {
        selectorConverter = group.selector_converter;
      } else if (Settings.getSelectorConverter(editor)) {
        selectorConverter = Settings.getSelectorConverter(editor);
      } else {
        selectorConverter = function () {
          return defaultConvertSelectorToFormat(editor, selector, group);
        };
      }

      return selectorConverter.call(plugin, selector, group);
    };

    var setup = function (editor) {
      editor.on('renderFormatsMenu', function (e) {
        var globallyUniqueSelectors = {};
        var selectorFilter = compileFilter(Settings.getSelectorFilter(editor)), ctrl = e.control;
        var groups = compileUserDefinedGroups(Settings.getCssGroups(editor));

        var processSelector = function (selector, group) {
          if (isUniqueSelector(editor, selector, group, globallyUniqueSelectors)) {
            markUniqueSelector(editor, selector, group, globallyUniqueSelectors);

            var format = convertSelectorToFormat(editor, editor.plugins.importcss, selector, group);
            if (format) {
              var formatName = format.name || DOMUtils.DOM.uniqueId();
              editor.formatter.register(formatName, format);

              return Tools.extend({}, ctrl.settings.itemDefaults, {
                text: format.title,
                format: formatName
              });
            }
          }

          return null;
        };

        if (!Settings.shouldAppend(editor)) {
          ctrl.items().remove();
        }

        Tools.each(getSelectors(editor, e.doc || editor.getDoc(), compileFilter(Settings.getFileFilter(editor))), function (selector) {
          if (selector.indexOf('.mce-') === -1) {
            if (!selectorFilter || selectorFilter(selector)) {
              var selectorGroups = getGroupsBySelector(groups, selector);

              if (selectorGroups.length > 0) {
                Tools.each(selectorGroups, function (group) {
                  var menuItem = processSelector(selector, group);
                  if (menuItem) {
                    group.item.menu.push(menuItem);
                  }
                });
              } else {
                var menuItem = processSelector(selector, null);
                if (menuItem) {
                  ctrl.add(menuItem);
                }
              }
            }
          }
        });

        Tools.each(groups, function (group) {
          if (group.item.menu.length > 0) {
            ctrl.add(group.item);
          }
        });

        e.control.renderNew();
      });
    };

    return {
      defaultConvertSelectorToFormat: defaultConvertSelectorToFormat,
      setup: setup
    };
  }
);