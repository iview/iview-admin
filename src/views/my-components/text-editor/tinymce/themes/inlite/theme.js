(function () {
    var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
    var register_3795 = function (id) {
        var module = dem(id);
        var fragments = id.split('.');
        var target = Function('return this;')();
        for (var i = 0; i < fragments.length - 1; ++i) {
            if (target[fragments[i]] === undefined) { target[fragments[i]] = {}; }
            target = target[fragments[i]];
        }
        target[fragments[fragments.length - 1]] = module;
    };

    var instantiate = function (id) {
        var actual = defs[id];
        var dependencies = actual.deps;
        var definition = actual.defn;
        var len = dependencies.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(dependencies[i]); }
        var defResult = definition.apply(null, instances);
        if (defResult === undefined) { throw 'module [' + id + '] returned undefined'; }
        actual.instance = defResult;
    };

    var def = function (id, dependencies, definition) {
        if (typeof id !== 'string') { throw 'module id must be a string'; } else if (dependencies === undefined) { throw 'no dependencies for ' + id; } else if (definition === undefined) { throw 'no definition function for ' + id; }
        defs[id] = {
            deps: dependencies,
            defn: definition,
            instance: undefined
        };
    };

    var dem = function (id) {
        var actual = defs[id];
        if (actual === undefined) { throw 'module [' + id + '] was undefined'; } else if (actual.instance === undefined) { instantiate(id); }
        return actual.instance;
    };

    var req = function (ids, callback) {
        var len = ids.length;
        var instances = new Array(len);
        for (var i = 0; i < len; ++i) { instances[i] = dem(ids[i]); }
        callback.apply(null, instances);
    };

    var ephox = {};

    ephox.bolt = {
        module: {
            api: {
                define: def,
                require: req,
                demand: dem
            }
        }
    };

    var define = def;
    var require = req;
    var demand = dem;
// this helps with minification when using a lot of global references
    var defineGlobal = function (id, ref) {
        define(id, [], function () { return ref; });
    };
/* jsc
["tinymce.themes.inlite.Theme","global!window","tinymce.core.ThemeManager","tinymce.themes.inlite.api.ThemeApi","tinymce.themes.inlite.ui.Buttons","tinymce.themes.inlite.ui.Panel","tinymce.ui.Api","tinymce.ui.FormatControls","global!tinymce.util.Tools.resolve","tinymce.themes.inlite.core.Render","tinymce.ui.NotificationManagerImpl","tinymce.ui.WindowManagerImpl","global!document","tinymce.core.dom.DOMUtils","tinymce.core.ui.Factory","tinymce.core.util.Tools","tinymce.themes.inlite.api.Events","tinymce.themes.inlite.api.Settings","tinymce.themes.inlite.core.Layout","tinymce.themes.inlite.core.Measure","tinymce.themes.inlite.ui.Forms","tinymce.themes.inlite.ui.Toolbar","tinymce.themes.inlite.file.Conversions","tinymce.themes.inlite.file.Picker","tinymce.themes.inlite.core.Actions","tinymce.ui.AbsoluteLayout","tinymce.ui.BrowseButton","tinymce.ui.Button","tinymce.ui.ButtonGroup","tinymce.ui.Checkbox","tinymce.ui.Collection","tinymce.ui.ColorBox","tinymce.ui.ColorButton","tinymce.ui.ColorPicker","tinymce.ui.ComboBox","tinymce.ui.Container","tinymce.ui.Control","tinymce.ui.DragHelper","tinymce.ui.DropZone","tinymce.ui.ElementPath","tinymce.ui.FieldSet","tinymce.ui.FilePicker","tinymce.ui.FitLayout","tinymce.ui.FlexLayout","tinymce.ui.FloatPanel","tinymce.ui.FlowLayout","tinymce.ui.Form","ephox.katamari.api.Fun","ephox.sugar.api.node.Element","ephox.sugar.api.search.SelectorFind","tinymce.core.EditorManager","tinymce.core.Env","tinymce.ui.Widget","tinymce.ui.editorui.Align","tinymce.ui.editorui.FontSelect","tinymce.ui.editorui.FontSizeSelect","tinymce.ui.editorui.FormatSelect","tinymce.ui.editorui.Formats","tinymce.ui.editorui.InsertButton","tinymce.ui.editorui.SimpleControls","tinymce.ui.editorui.UndoRedo","tinymce.ui.editorui.VisualAid","tinymce.ui.FormItem","tinymce.ui.GridLayout","tinymce.ui.Iframe","tinymce.ui.InfoBox","tinymce.ui.KeyboardNavigation","tinymce.ui.Label","tinymce.ui.Layout","tinymce.ui.ListBox","tinymce.ui.Menu","tinymce.ui.MenuBar","tinymce.ui.MenuButton","tinymce.ui.MenuItem","tinymce.ui.MessageBox","tinymce.ui.Movable","tinymce.ui.Notification","tinymce.ui.Panel","tinymce.ui.PanelButton","tinymce.ui.Path","tinymce.ui.Progress","tinymce.ui.Radio","tinymce.ui.ReflowQueue","tinymce.ui.Resizable","tinymce.ui.ResizeHandle","tinymce.ui.Scrollable","tinymce.ui.SelectBox","tinymce.ui.Selector","tinymce.ui.Slider","tinymce.ui.Spacer","tinymce.ui.SplitButton","tinymce.ui.StackLayout","tinymce.ui.TabPanel","tinymce.ui.TextBox","tinymce.ui.Throbber","tinymce.ui.Toolbar","tinymce.ui.Tooltip","tinymce.ui.Window","tinymce.core.util.Delay","tinymce.themes.inlite.alien.Arr","tinymce.themes.inlite.core.ElementMatcher","tinymce.themes.inlite.core.Matcher","tinymce.themes.inlite.core.PredicateId","tinymce.themes.inlite.core.SelectionMatcher","tinymce.themes.inlite.core.SkinLoader","ephox.katamari.api.Arr","global!setTimeout","tinymce.ui.DomUtils","tinymce.core.dom.DomQuery","tinymce.core.util.Class","tinymce.core.util.EventDispatcher","tinymce.ui.BoxUtils","tinymce.ui.ClassList","tinymce.ui.data.ObservableObject","tinymce.themes.inlite.alien.EditorSettings","tinymce.core.geom.Rect","tinymce.themes.inlite.core.Convert","tinymce.core.util.Promise","tinymce.themes.inlite.alien.Uuid","tinymce.themes.inlite.alien.Unlink","tinymce.themes.inlite.core.UrlType","tinymce.themes.inlite.alien.Type","ephox.sand.api.FileReader","global!RegExp","tinymce.core.util.VK","tinymce.core.util.Color","global!Array","global!Error","tinymce.ui.content.LinkTargets","global!console","ephox.sugar.api.search.PredicateFind","ephox.sugar.api.search.Selectors","ephox.sugar.impl.ClosestOrAncestor","tinymce.ui.editorui.FormatUtils","tinymce.ui.fmt.FontInfo","ephox.katamari.api.Option","global!String","tinymce.ui.data.Binding","tinymce.core.util.Observable","tinymce.themes.inlite.alien.Bookmark","tinymce.core.dom.TreeWalker","tinymce.core.dom.RangeUtils","ephox.sand.util.Global","ephox.katamari.api.Id","ephox.sugar.api.search.SelectorFilter","ephox.katamari.api.Type","ephox.sugar.api.node.Body","ephox.sugar.api.dom.Compare","ephox.sugar.api.node.NodeTypes","ephox.sugar.api.node.Node","global!Object","ephox.katamari.api.Resolve","global!Date","global!Math","ephox.sugar.api.search.PredicateFilter","ephox.katamari.api.Thunk","ephox.sand.api.Node","ephox.sand.api.PlatformDetection","ephox.katamari.api.Global","ephox.sugar.api.search.Traverse","ephox.sand.core.PlatformDetection","global!navigator","ephox.katamari.api.Struct","ephox.sugar.alien.Recurse","ephox.sand.core.Browser","ephox.sand.core.OperatingSystem","ephox.sand.detect.DeviceType","ephox.sand.detect.UaString","ephox.sand.info.PlatformInfo","ephox.katamari.data.Immutable","ephox.katamari.data.MixedBag","ephox.sand.detect.Version","ephox.katamari.api.Strings","ephox.katamari.api.Obj","ephox.katamari.util.BagUtils","global!Number","ephox.katamari.str.StrAppend","ephox.katamari.str.StringParts"]
jsc */
    defineGlobal('global!window', window);
    defineGlobal('global!tinymce.util.Tools.resolve', tinymce.util.Tools.resolve);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.ThemeManager',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.ThemeManager');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Delay',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Delay');
  }
);

/**
 * Arr.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.alien.Arr',
        [
        ],
  function () {
      var flatten = function (arr) {
          return arr.reduce(function (results, item) {
              return Array.isArray(item) ? results.concat(flatten(item)) : results.concat(item);
          }, []);
      };

      return {
          flatten: flatten
      };
  }
);

/**
 * Matcher.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.Matcher',
        [
        ],
  function () {
    // result :: String, Rect -> Matcher.result
      var result = function (id, rect) {
          return {
              id: id,
              rect: rect
          };
      };

    // match :: Editor, [(Editor -> Matcher.result | Null)] -> Matcher.result | Null
      var match = function (editor, matchers) {
          for (var i = 0; i < matchers.length; i++) {
              var f = matchers[i];
              var result = f(editor);

              if (result) {
                  return result;
              }
          }

          return null;
      };

      return {
          match: match,
          result: result
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.dom.DOMUtils',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * Convert.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.Convert',
        [
        ],
  function () {
      var fromClientRect = function (clientRect) {
          return {
              x: clientRect.left,
              y: clientRect.top,
              w: clientRect.width,
              h: clientRect.height
          };
      };

      var toClientRect = function (geomRect) {
          return {
              left: geomRect.x,
              top: geomRect.y,
              width: geomRect.w,
              height: geomRect.h,
              right: geomRect.x + geomRect.w,
              bottom: geomRect.y + geomRect.h
          };
      };

      return {
          fromClientRect: fromClientRect,
          toClientRect: toClientRect
      };
  }
);

/**
 * Measure.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.Measure',
        [
            'tinymce.core.dom.DOMUtils',
            'tinymce.themes.inlite.core.Convert'
        ],
  function (DOMUtils, Convert) {
      var toAbsolute = function (rect) {
          var vp = DOMUtils.DOM.getViewPort();

          return {
              x: rect.x + vp.x,
              y: rect.y + vp.y,
              w: rect.w,
              h: rect.h
          };
      };

      var measureElement = function (elm) {
          var clientRect = elm.getBoundingClientRect();

          return toAbsolute({
              x: clientRect.left,
              y: clientRect.top,
              w: Math.max(elm.clientWidth, elm.offsetWidth),
              h: Math.max(elm.clientHeight, elm.offsetHeight)
          });
      };

      var getElementRect = function (editor, elm) {
          return measureElement(elm);
      };

      var getPageAreaRect = function (editor) {
          return measureElement(editor.getElement().ownerDocument.body);
      };

      var getContentAreaRect = function (editor) {
          return measureElement(editor.getContentAreaContainer() || editor.getBody());
      };

      var getSelectionRect = function (editor) {
          var clientRect = editor.selection.getBoundingClientRect();
          return clientRect ? toAbsolute(Convert.fromClientRect(clientRect)) : null;
      };

      return {
          getElementRect: getElementRect,
          getPageAreaRect: getPageAreaRect,
          getContentAreaRect: getContentAreaRect,
          getSelectionRect: getSelectionRect
      };
  }
);

/**
 * ElementMatcher.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.ElementMatcher',
        [
            'tinymce.themes.inlite.core.Matcher',
            'tinymce.themes.inlite.core.Measure'
        ],
  function (Matcher, Measure) {
    // element :: Element, [PredicateId] -> (Editor -> Matcher.result | Null)
      var element = function (element, predicateIds) {
          return function (editor) {
              for (var i = 0; i < predicateIds.length; i++) {
                  if (predicateIds[i].predicate(element)) {
                      return Matcher.result(predicateIds[i].id, Measure.getElementRect(editor, element));
                  }
              }

              return null;
          };
      };

    // parent :: [Elements], [PredicateId] -> (Editor -> Matcher.result | Null)
      var parent = function (elements, predicateIds) {
          return function (editor) {
              for (var i = 0; i < elements.length; i++) {
                  for (var x = 0; x < predicateIds.length; x++) {
                      if (predicateIds[x].predicate(elements[i])) {
                          return Matcher.result(predicateIds[x].id, Measure.getElementRect(editor, elements[i]));
                      }
                  }
              }

              return null;
          };
      };

      return {
          element: element,
          parent: parent
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Tools',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Tools');
  }
);

/**
 * PredicateId.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.PredicateId',
        [
            'tinymce.core.util.Tools'
        ],
  function (Tools) {
      var create = function (id, predicate) {
          return {
              id: id,
              predicate: predicate
          };
      };

    // fromContextToolbars :: [ContextToolbar] -> [PredicateId]
      var fromContextToolbars = function (toolbars) {
          return Tools.map(toolbars, function (toolbar) {
              return create(toolbar.id, toolbar.predicate);
          });
      };

      return {
          create: create,
          fromContextToolbars: fromContextToolbars
      };
  }
);

/**
 * SelectionMatcher.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.SelectionMatcher',
        [
            'tinymce.themes.inlite.core.Matcher',
            'tinymce.themes.inlite.core.Measure'
        ],
  function (Matcher, Measure) {
    // textSelection :: String -> (Editor -> Matcher.result | Null)
      var textSelection = function (id) {
          return function (editor) {
              if (!editor.selection.isCollapsed()) {
                  return Matcher.result(id, Measure.getSelectionRect(editor));
              }

              return null;
          };
      };

    // emptyTextBlock :: [Elements], String -> (Editor -> Matcher.result | Null)
      var emptyTextBlock = function (elements, id) {
          return function (editor) {
              var i, textBlockElementsMap = editor.schema.getTextBlockElements();

              for (i = 0; i < elements.length; i++) {
                  if (elements[i].nodeName === 'TABLE') {
                      return null;
                  }
              }

              for (i = 0; i < elements.length; i++) {
                  if (elements[i].nodeName in textBlockElementsMap) {
                      if (editor.dom.isEmpty(elements[i])) {
                          return Matcher.result(id, Measure.getSelectionRect(editor));
                      }

                      return null;
                  }
              }

              return null;
          };
      };

      return {
          textSelection: textSelection,
          emptyTextBlock: emptyTextBlock
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.EditorManager',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.EditorManager');
  }
);

/**
 * Events.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.api.Events',
        [
        ],
  function () {
      var fireSkinLoaded = function (editor) {
          editor.fire('SkinLoaded');
      };

      var fireBeforeRenderUI = function (editor) {
          return editor.fire('BeforeRenderUI');
      };

      return {
          fireSkinLoaded: fireSkinLoaded,
          fireBeforeRenderUI: fireBeforeRenderUI
      };
  }
);

/**
 * Type.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.alien.Type',
        [
        ],
  function () {
      var isType = function (type) {
          return function (value) {
              return typeof value === type;
          };
      };

      var isArray = function (value) {
          return Array.isArray(value);
      };

      var isNull = function (value) {
          return value === null;
      };

      var isObject = function (predicate) {
          return function (value) {
              return !isNull(value) && !isArray(value) && predicate(value);
          };
      };

      return {
          isString: isType('string'),
          isNumber: isType('number'),
          isBoolean: isType('boolean'),
          isFunction: isType('function'),
          isObject: isObject(isType('object')),
          isNull: isNull,
          isArray: isArray
      };
  }
);

/**
 * EditorSettings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.alien.EditorSettings',
        [
            'tinymce.themes.inlite.alien.Type'
        ],
  function (Type) {
      var validDefaultOrDie = function (value, predicate) {
          if (predicate(value)) {
              return true;
          }

          throw new Error('Default value doesn\'t match requested type.');
      };

      var getByTypeOr = function (predicate) {
          return function (editor, name, defaultValue) {
              var settings = editor.settings;
              validDefaultOrDie(defaultValue, predicate);
              return name in settings && predicate(settings[name]) ? settings[name] : defaultValue;
          };
      };

      var splitNoEmpty = function (str, delim) {
          return str.split(delim).filter(function (item) {
              return item.length > 0;
          });
      };

      var itemsToArray = function (value, defaultValue) {
          var stringToItemsArray = function (value) {
              return typeof value === 'string' ? splitNoEmpty(value, /[ ,]/) : value;
          };

          var boolToItemsArray = function (value, defaultValue) {
              return value === false ? [] : defaultValue;
          };

          if (Type.isArray(value)) {
              return value;
          } else if (Type.isString(value)) {
              return stringToItemsArray(value);
          } else if (Type.isBoolean(value)) {
              return boolToItemsArray(value, defaultValue);
          }

          return defaultValue;
      };

      var getToolbarItemsOr = function (predicate) {
          return function (editor, name, defaultValue) {
              var value = name in editor.settings ? editor.settings[name] : defaultValue;
              validDefaultOrDie(defaultValue, predicate);
              return itemsToArray(value, defaultValue);
          };
      };

      return {
      // TODO: Add Option based getString, getBool if merged with core
          getStringOr: getByTypeOr(Type.isString),
          getBoolOr: getByTypeOr(Type.isBoolean),
          getNumberOr: getByTypeOr(Type.isNumber),
          getHandlerOr: getByTypeOr(Type.isFunction),
          getToolbarItemsOr: getToolbarItemsOr(Type.isArray)
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.geom.Rect',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.geom.Rect');
  }
);

/**
 * Layout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.Layout',
        [
            'tinymce.core.geom.Rect',
            'tinymce.themes.inlite.core.Convert'
        ],
  function (Rect, Convert) {
      var result = function (rect, position) {
          return {
              rect: rect,
              position: position
          };
      };

      var moveTo = function (rect, toRect) {
          return { x: toRect.x, y: toRect.y, w: rect.w, h: rect.h };
      };

      var calcByPositions = function (testPositions1, testPositions2, targetRect, contentAreaRect, panelRect) {
          var relPos, relRect, outputPanelRect;

          var paddedContentRect = {
              x: contentAreaRect.x,
              y: contentAreaRect.y,
              w: contentAreaRect.w + (contentAreaRect.w < (panelRect.w + targetRect.w) ? panelRect.w : 0),
              h: contentAreaRect.h + (contentAreaRect.h < (panelRect.h + targetRect.h) ? panelRect.h : 0)
          };

          relPos = Rect.findBestRelativePosition(panelRect, targetRect, paddedContentRect, testPositions1);
          targetRect = Rect.clamp(targetRect, paddedContentRect);

          if (relPos) {
              relRect = Rect.relativePosition(panelRect, targetRect, relPos);
              outputPanelRect = moveTo(panelRect, relRect);
              return result(outputPanelRect, relPos);
          }

          targetRect = Rect.intersect(paddedContentRect, targetRect);
          if (targetRect) {
              relPos = Rect.findBestRelativePosition(panelRect, targetRect, paddedContentRect, testPositions2);

              if (relPos) {
                  relRect = Rect.relativePosition(panelRect, targetRect, relPos);
                  outputPanelRect = moveTo(panelRect, relRect);
                  return result(outputPanelRect, relPos);
              }

              outputPanelRect = moveTo(panelRect, targetRect);
              return result(outputPanelRect, relPos);
          }

          return null;
      };

      var calcInsert = function (targetRect, contentAreaRect, panelRect) {
          return calcByPositions(
        ['cr-cl', 'cl-cr'],
        ['bc-tc', 'bl-tl', 'br-tr'],
        targetRect,
        contentAreaRect,
        panelRect
      );
      };

      var calc = function (targetRect, contentAreaRect, panelRect) {
          return calcByPositions(
        ['tc-bc', 'bc-tc', 'tl-bl', 'bl-tl', 'tr-br', 'br-tr', 'cr-cl', 'cl-cr'],
        ['bc-tc', 'bl-tl', 'br-tr', 'cr-cl'],
        targetRect,
        contentAreaRect,
        panelRect
      );
      };

      var userConstrain = function (handler, targetRect, contentAreaRect, panelRect) {
          var userConstrainedPanelRect;

          if (typeof handler === 'function') {
              userConstrainedPanelRect = handler({
                  elementRect: Convert.toClientRect(targetRect),
                  contentAreaRect: Convert.toClientRect(contentAreaRect),
                  panelRect: Convert.toClientRect(panelRect)
              });

              return Convert.fromClientRect(userConstrainedPanelRect);
          }

          return panelRect;
      };

      var defaultHandler = function (rects) {
          return rects.panelRect;
      };

      return {
          calcInsert: calcInsert,
          calc: calc,
          userConstrain: userConstrain,
          defaultHandler: defaultHandler
      };
  }
);

/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.api.Settings',
        [
            'tinymce.core.EditorManager',
            'tinymce.themes.inlite.alien.EditorSettings',
            'tinymce.themes.inlite.core.Layout'
        ],
  function (EditorManager, EditorSettings, Layout) {
      var toAbsoluteUrl = function (editor, url) {
          return editor.documentBaseURI.toAbsolute(url);
      };

      var urlFromName = function (name) {
          var prefix = EditorManager.baseURL + '/skins/';
          return name ? prefix + name : prefix + 'lightgray';
      };

      var getTextSelectionToolbarItems = function (editor) {
          return EditorSettings.getToolbarItemsOr(editor, 'selection_toolbar', ['bold', 'italic', '|', 'quicklink', 'h2', 'h3', 'blockquote']);
      };

      var getInsertToolbarItems = function (editor) {
          return EditorSettings.getToolbarItemsOr(editor, 'insert_toolbar', ['quickimage', 'quicktable']);
      };

      var getPositionHandler = function (editor) {
          return EditorSettings.getHandlerOr(editor, 'inline_toolbar_position_handler', Layout.defaultHandler);
      };

      var getSkinUrl = function (editor) {
          var settings = editor.settings;
          return settings.skin_url ? toAbsoluteUrl(editor, settings.skin_url) : urlFromName(settings.skin);
      };

      return {
          getTextSelectionToolbarItems: getTextSelectionToolbarItems,
          getInsertToolbarItems: getInsertToolbarItems,
          getPositionHandler: getPositionHandler,
          getSkinUrl: getSkinUrl
      };
  }
);

/**
 * SkinLoader.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.SkinLoader',
        [
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.EditorManager',
            'tinymce.themes.inlite.api.Events',
            'tinymce.themes.inlite.api.Settings'
        ],
  function (DOMUtils, EditorManager, Events, Settings) {
      var fireSkinLoaded = function (editor, callback) {
          var done = function () {
              editor._skinLoaded = true;
              Events.fireSkinLoaded(editor);
              callback();
          };

          if (editor.initialized) {
              done();
          } else {
              editor.on('init', done);
          }
      };

      var load = function (editor, callback) {
          var skinUrl = Settings.getSkinUrl(editor);

          var done = function () {
              fireSkinLoaded(editor, callback);
          };

          DOMUtils.DOM.styleSheetLoader.load(skinUrl + '/skin.min.css', done);
          editor.contentCSS.push(skinUrl + '/content.inline.min.css');
      };

      return {
          load: load
      };
  }
);

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
              contextToolbars || [],
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

    defineGlobal('global!Array', Array);
    defineGlobal('global!Error', Error);
    define(
  'ephox.katamari.api.Fun',

        [
            'global!Array',
            'global!Error'
        ],

  function (Array, Error) {
      var noop = function () { };

      var compose = function (fa, fb) {
          return function () {
              return fa(fb.apply(null, arguments));
          };
      };

      var constant = function (value) {
          return function () {
              return value;
          };
      };

      var identity = function (x) {
          return x;
      };

      var tripleEquals = function (a, b) {
          return a === b;
      };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
      var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
          var args = new Array(arguments.length - 1);
          for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];

          return function () {
              var newArgs = new Array(arguments.length);
              for (var j = 0; j < newArgs.length; j++) newArgs[j] = arguments[j];

              var all = args.concat(newArgs);
              return f.apply(null, all);
          };
      };

      var not = function (f) {
          return function () {
              return !f.apply(null, arguments);
          };
      };

      var die = function (msg) {
          return function () {
              throw new Error(msg);
          };
      };

      var apply = function (f) {
          return f();
      };

      var call = function (f) {
          f();
      };

      var never = constant(false);
      var always = constant(true);

      return {
          noop: noop,
          compose: compose,
          constant: constant,
          identity: identity,
          tripleEquals: tripleEquals,
          curry: curry,
          not: not,
          die: die,
          apply: apply,
          call: call,
          never: never,
          always: always
      };
  }
);

    defineGlobal('global!Object', Object);
    define(
  'ephox.katamari.api.Option',

        [
            'ephox.katamari.api.Fun',
            'global!Object'
        ],

  function (Fun, Object) {
      var never = Fun.never;
      var always = Fun.always;

    /**
      Option objects support the following methods:

      fold :: this Option a -> ((() -> b, a -> b)) -> Option b

      is :: this Option a -> a -> Boolean

      isSome :: this Option a -> () -> Boolean

      isNone :: this Option a -> () -> Boolean

      getOr :: this Option a -> a -> a

      getOrThunk :: this Option a -> (() -> a) -> a

      getOrDie :: this Option a -> String -> a

      or :: this Option a -> Option a -> Option a
        - if some: return self
        - if none: return opt

      orThunk :: this Option a -> (() -> Option a) -> Option a
        - Same as "or", but uses a thunk instead of a value

      map :: this Option a -> (a -> b) -> Option b
        - "fmap" operation on the Option Functor.
        - same as 'each'

      ap :: this Option a -> Option (a -> b) -> Option b
        - "apply" operation on the Option Apply/Applicative.
        - Equivalent to <*> in Haskell/PureScript.

      each :: this Option a -> (a -> b) -> Option b
        - same as 'map'

      bind :: this Option a -> (a -> Option b) -> Option b
        - "bind"/"flatMap" operation on the Option Bind/Monad.
        - Equivalent to >>= in Haskell/PureScript; flatMap in Scala.

      flatten :: {this Option (Option a))} -> () -> Option a
        - "flatten"/"join" operation on the Option Monad.

      exists :: this Option a -> (a -> Boolean) -> Boolean

      forall :: this Option a -> (a -> Boolean) -> Boolean

      filter :: this Option a -> (a -> Boolean) -> Option a

      equals :: this Option a -> Option a -> Boolean

      equals_ :: this Option a -> (Option a, a -> Boolean) -> Boolean

      toArray :: this Option a -> () -> [a]

    */

      var none = function () { return NONE; };

      var NONE = (function () {
          var eq = function (o) {
              return o.isNone();
          };

      // inlined from peanut, maybe a micro-optimisation?
          var call = function (thunk) { return thunk(); };
          var id = function (n) { return n; };
          var noop = function () { };

          var me = {
              fold: function (n, s) { return n(); },
              is: never,
              isSome: never,
              isNone: always,
              getOr: id,
              getOrThunk: call,
              getOrDie: function (msg) {
                  throw new Error(msg || 'error: getOrDie called on none.');
              },
              or: id,
              orThunk: call,
              map: none,
              ap: none,
              each: noop,
              bind: none,
              flatten: none,
              exists: never,
              forall: always,
              filter: none,
              equals: eq,
              equals_: eq,
              toArray: function () { return []; },
              toString: Fun.constant('none()')
          };
          if (Object.freeze) Object.freeze(me);
          return me;
      })();

    /** some :: a -> Option a */
      var some = function (a) {
      // inlined from peanut, maybe a micro-optimisation?
          var constant_a = function () { return a; };

          var self = function () {
        // can't Fun.constant this one
              return me;
          };

          var map = function (f) {
              return some(f(a));
          };

          var bind = function (f) {
              return f(a);
          };

          var me = {
              fold: function (n, s) { return s(a); },
              is: function (v) { return a === v; },
              isSome: always,
              isNone: never,
              getOr: constant_a,
              getOrThunk: constant_a,
              getOrDie: constant_a,
              or: self,
              orThunk: self,
              map: map,
              ap: function (optfab) {
                  return optfab.fold(none, function (fab) {
                      return some(fab(a));
                  });
              },
              each: function (f) {
                  f(a);
              },
              bind: bind,
              flatten: constant_a,
              exists: bind,
              forall: bind,
              filter: function (f) {
                  return f(a) ? me : NONE;
              },
              equals: function (o) {
                  return o.is(a);
              },
              equals_: function (o, elementEq) {
                  return o.fold(
            never,
            function (b) { return elementEq(a, b); }
          );
              },
              toArray: function () {
                  return [a];
              },
              toString: function () {
                  return 'some(' + a + ')';
              }
          };
          return me;
      };

    /** from :: undefined|null|a -> Option a */
      var from = function (value) {
          return value === null || value === undefined ? NONE : some(value);
      };

      return {
          some: some,
          none: none,
          from: from
      };
  }
);

    defineGlobal('global!String', String);
    define(
  'ephox.katamari.api.Arr',

        [
            'ephox.katamari.api.Option',
            'global!Array',
            'global!Error',
            'global!String'
        ],

  function (Option, Array, Error, String) {
    // Use the native Array.indexOf if it is available (IE9+) otherwise fall back to manual iteration
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
      var rawIndexOf = (function () {
          var pIndexOf = Array.prototype.indexOf;

          var fastIndex = function (xs, x) { return pIndexOf.call(xs, x); };

          var slowIndex = function (xs, x) { return slowIndexOf(xs, x); };

          return pIndexOf === undefined ? slowIndex : fastIndex;
      })();

      var indexOf = function (xs, x) {
      // The rawIndexOf method does not wrap up in an option. This is for performance reasons.
          var r = rawIndexOf(xs, x);
          return r === -1 ? Option.none() : Option.some(r);
      };

      var contains = function (xs, x) {
          return rawIndexOf(xs, x) > -1;
      };

    // Using findIndex is likely less optimal in Chrome (dynamic return type instead of bool)
    // but if we need that micro-optimisation we can inline it later.
      var exists = function (xs, pred) {
          return findIndex(xs, pred).isSome();
      };

      var range = function (num, f) {
          var r = [];
          for (var i = 0; i < num; i++) {
              r.push(f(i));
          }
          return r;
      };

    // It's a total micro optimisation, but these do make some difference.
    // Particularly for browsers other than Chrome.
    // - length caching
    // http://jsperf.com/browser-diet-jquery-each-vs-for-loop/69
    // - not using push
    // http://jsperf.com/array-direct-assignment-vs-push/2

      var chunk = function (array, size) {
          var r = [];
          for (var i = 0; i < array.length; i += size) {
              var s = array.slice(i, i + size);
              r.push(s);
          }
          return r;
      };

      var map = function (xs, f) {
      // pre-allocating array size when it's guaranteed to be known
      // http://jsperf.com/push-allocated-vs-dynamic/22
          var len = xs.length;
          var r = new Array(len);
          for (var i = 0; i < len; i++) {
              var x = xs[i];
              r[i] = f(x, i, xs);
          }
          return r;
      };

    // Unwound implementing other functions in terms of each.
    // The code size is roughly the same, and it should allow for better optimisation.
      var each = function (xs, f) {
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              f(x, i, xs);
          }
      };

      var eachr = function (xs, f) {
          for (var i = xs.length - 1; i >= 0; i--) {
              var x = xs[i];
              f(x, i, xs);
          }
      };

      var partition = function (xs, pred) {
          var pass = [];
          var fail = [];
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              var arr = pred(x, i, xs) ? pass : fail;
              arr.push(x);
          }
          return { pass: pass, fail: fail };
      };

      var filter = function (xs, pred) {
          var r = [];
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              if (pred(x, i, xs)) {
                  r.push(x);
              }
          }
          return r;
      };

    /*
     * Groups an array into contiguous arrays of like elements. Whether an element is like or not depends on f.
     *
     * f is a function that derives a value from an element - e.g. true or false, or a string.
     * Elements are like if this function generates the same value for them (according to ===).
     *
     *
     * Order of the elements is preserved. Arr.flatten() on the result will return the original list, as with Haskell groupBy function.
     *  For a good explanation, see the group function (which is a special case of groupBy)
     *  http://hackage.haskell.org/package/base-4.7.0.0/docs/Data-List.html#v:group
     */
      var groupBy = function (xs, f) {
          if (xs.length === 0) {
              return [];
          } else {
              var wasType = f(xs[0]); // initial case for matching
              var r = [];
              var group = [];

              for (var i = 0, len = xs.length; i < len; i++) {
                  var x = xs[i];
                  var type = f(x);
                  if (type !== wasType) {
                      r.push(group);
                      group = [];
                  }
                  wasType = type;
                  group.push(x);
              }
              if (group.length !== 0) {
                  r.push(group);
              }
              return r;
          }
      };

      var foldr = function (xs, f, acc) {
          eachr(xs, function (x) {
              acc = f(acc, x);
          });
          return acc;
      };

      var foldl = function (xs, f, acc) {
          each(xs, function (x) {
              acc = f(acc, x);
          });
          return acc;
      };

      var find = function (xs, pred) {
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              if (pred(x, i, xs)) {
                  return Option.some(x);
              }
          }
          return Option.none();
      };

      var findIndex = function (xs, pred) {
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              if (pred(x, i, xs)) {
                  return Option.some(i);
              }
          }

          return Option.none();
      };

      var slowIndexOf = function (xs, x) {
          for (var i = 0, len = xs.length; i < len; ++i) {
              if (xs[i] === x) {
                  return i;
              }
          }

          return -1;
      };

      var push = Array.prototype.push;
      var flatten = function (xs) {
      // Note, this is possible because push supports multiple arguments:
      // http://jsperf.com/concat-push/6
      // Note that in the past, concat() would silently work (very slowly) for array-like objects.
      // With this change it will throw an error.
          var r = [];
          for (var i = 0, len = xs.length; i < len; ++i) {
        // Ensure that each value is an array itself
              if (!Array.prototype.isPrototypeOf(xs[i])) throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
              push.apply(r, xs[i]);
          }
          return r;
      };

      var bind = function (xs, f) {
          var output = map(xs, f);
          return flatten(output);
      };

      var forall = function (xs, pred) {
          for (var i = 0, len = xs.length; i < len; ++i) {
              var x = xs[i];
              if (pred(x, i, xs) !== true) {
                  return false;
              }
          }
          return true;
      };

      var equal = function (a1, a2) {
          return a1.length === a2.length && forall(a1, function (x, i) {
              return x === a2[i];
          });
      };

      var slice = Array.prototype.slice;
      var reverse = function (xs) {
          var r = slice.call(xs, 0);
          r.reverse();
          return r;
      };

      var difference = function (a1, a2) {
          return filter(a1, function (x) {
              return !contains(a2, x);
          });
      };

      var mapToObject = function (xs, f) {
          var r = {};
          for (var i = 0, len = xs.length; i < len; i++) {
              var x = xs[i];
              r[String(x)] = f(x, i);
          }
          return r;
      };

      var pure = function (x) {
          return [x];
      };

      var sort = function (xs, comparator) {
          var copy = slice.call(xs, 0);
          copy.sort(comparator);
          return copy;
      };

      var head = function (xs) {
          return xs.length === 0 ? Option.none() : Option.some(xs[0]);
      };

      var last = function (xs) {
          return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1]);
      };

      return {
          map: map,
          each: each,
          eachr: eachr,
          partition: partition,
          filter: filter,
          groupBy: groupBy,
          indexOf: indexOf,
          foldr: foldr,
          foldl: foldl,
          find: find,
          findIndex: findIndex,
          flatten: flatten,
          bind: bind,
          forall: forall,
          exists: exists,
          contains: contains,
          equal: equal,
          reverse: reverse,
          chunk: chunk,
          difference: difference,
          mapToObject: mapToObject,
          pure: pure,
          sort: sort,
          range: range,
          head: head,
          last: last
      };
  }
);
    defineGlobal('global!setTimeout', setTimeout);
    defineGlobal('global!document', document);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.Env',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.Env');
  }
);

/**
 * DomUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Private UI DomUtils proxy.
 *
 * @private
 * @class tinymce.ui.DomUtils
 */
    define(
  'tinymce.ui.DomUtils',
        [
            'global!document',
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.Env',
            'tinymce.core.util.Tools'
        ],
  function (document, DOMUtils, Env, Tools) {
      'use strict';

      var count = 0;

      var funcs = {
          id: function () {
              return 'mceu_' + (count++);
          },

          create: function (name, attrs, children) {
              var elm = document.createElement(name);

              DOMUtils.DOM.setAttribs(elm, attrs);

              if (typeof children === 'string') {
                  elm.innerHTML = children;
              } else {
                  Tools.each(children, function (child) {
                      if (child.nodeType) {
                          elm.appendChild(child);
                      }
                  });
              }

              return elm;
          },

          createFragment: function (html) {
              return DOMUtils.DOM.createFragment(html);
          },

          getWindowSize: function () {
              return DOMUtils.DOM.getViewPort();
          },

          getSize: function (elm) {
              var width, height;

              if (elm.getBoundingClientRect) {
                  var rect = elm.getBoundingClientRect();

                  width = Math.max(rect.width || (rect.right - rect.left), elm.offsetWidth);
                  height = Math.max(rect.height || (rect.bottom - rect.bottom), elm.offsetHeight);
              } else {
                  width = elm.offsetWidth;
                  height = elm.offsetHeight;
              }

              return { width: width, height: height };
          },

          getPos: function (elm, root) {
              return DOMUtils.DOM.getPos(elm, root || funcs.getContainer());
          },

          getContainer: function () {
              return Env.container ? Env.container : document.body;
          },

          getViewPort: function (win) {
              return DOMUtils.DOM.getViewPort(win);
          },

          get: function (id) {
              return document.getElementById(id);
          },

          addClass: function (elm, cls) {
              return DOMUtils.DOM.addClass(elm, cls);
          },

          removeClass: function (elm, cls) {
              return DOMUtils.DOM.removeClass(elm, cls);
          },

          hasClass: function (elm, cls) {
              return DOMUtils.DOM.hasClass(elm, cls);
          },

          toggleClass: function (elm, cls, state) {
              return DOMUtils.DOM.toggleClass(elm, cls, state);
          },

          css: function (elm, name, value) {
              return DOMUtils.DOM.setStyle(elm, name, value);
          },

          getRuntimeStyle: function (elm, name) {
              return DOMUtils.DOM.getStyle(elm, name, true);
          },

          on: function (target, name, callback, scope) {
              return DOMUtils.DOM.bind(target, name, callback, scope);
          },

          off: function (target, name, callback) {
              return DOMUtils.DOM.unbind(target, name, callback);
          },

          fire: function (target, name, args) {
              return DOMUtils.DOM.fire(target, name, args);
          },

          innerHtml: function (elm, html) {
        // Workaround for <div> in <p> bug on IE 8 #6178
              DOMUtils.DOM.setHTML(elm, html);
          }
      };

      return funcs;
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.dom.DomQuery',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.DomQuery');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Class',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Class');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.EventDispatcher',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.EventDispatcher');
  }
);

/**
 * BoxUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Utility class for box parsing and measuring.
 *
 * @private
 * @class tinymce.ui.BoxUtils
 */
    define(
  'tinymce.ui.BoxUtils',
        [
            'global!document'
        ],
  function (document) {
      'use strict';

      return {
      /**
       * Parses the specified box value. A box value contains 1-4 properties in clockwise order.
       *
       * @method parseBox
       * @param {String/Number} value Box value "0 1 2 3" or "0" etc.
       * @return {Object} Object with top/right/bottom/left properties.
       * @private
       */
          parseBox: function (value) {
              var len, radix = 10;

              if (!value) {
                  return;
              }

              if (typeof value === 'number') {
                  value = value || 0;

                  return {
                      top: value,
                      left: value,
                      bottom: value,
                      right: value
                  };
              }

              value = value.split(' ');
              len = value.length;

              if (len === 1) {
                  value[1] = value[2] = value[3] = value[0];
              } else if (len === 2) {
                  value[2] = value[0];
                  value[3] = value[1];
              } else if (len === 3) {
                  value[3] = value[1];
              }

              return {
                  top: parseInt(value[0], radix) || 0,
                  right: parseInt(value[1], radix) || 0,
                  bottom: parseInt(value[2], radix) || 0,
                  left: parseInt(value[3], radix) || 0
              };
          },

          measureBox: function (elm, prefix) {
              function getStyle (name) {
                  var defaultView = document.defaultView;

                  if (defaultView) {
            // Remove camelcase
                      name = name.replace(/[A-Z]/g, function (a) {
                          return '-' + a;
                      });

                      return defaultView.getComputedStyle(elm, null).getPropertyValue(name);
                  }

                  return elm.currentStyle[name];
              }

              function getSide (name) {
                  var val = parseFloat(getStyle(name), 10);

                  return isNaN(val) ? 0 : val;
              }

              return {
                  top: getSide(prefix + 'TopWidth'),
                  right: getSide(prefix + 'RightWidth'),
                  bottom: getSide(prefix + 'BottomWidth'),
                  left: getSide(prefix + 'LeftWidth')
              };
          }
      };
  }
);

/**
 * ClassList.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Handles adding and removal of classes.
 *
 * @private
 * @class tinymce.ui.ClassList
 */
    define(
  'tinymce.ui.ClassList',
        [
            'tinymce.core.util.Tools'
        ],
  function (Tools) {
      'use strict';

      function noop () {
      }

    /**
     * Constructs a new class list the specified onchange
     * callback will be executed when the class list gets modifed.
     *
     * @constructor ClassList
     * @param {function} onchange Onchange callback to be executed.
     */
      function ClassList (onchange) {
          this.cls = [];
          this.cls._map = {};
          this.onchange = onchange || noop;
          this.prefix = '';
      }

      Tools.extend(ClassList.prototype, {
      /**
       * Adds a new class to the class list.
       *
       * @method add
       * @param {String} cls Class to be added.
       * @return {tinymce.ui.ClassList} Current class list instance.
       */
          add: function (cls) {
              if (cls && !this.contains(cls)) {
                  this.cls._map[cls] = true;
                  this.cls.push(cls);
                  this._change();
              }

              return this;
          },

      /**
       * Removes the specified class from the class list.
       *
       * @method remove
       * @param {String} cls Class to be removed.
       * @return {tinymce.ui.ClassList} Current class list instance.
       */
          remove: function (cls) {
              if (this.contains(cls)) {
                  for (var i = 0; i < this.cls.length; i++) {
                      if (this.cls[i] === cls) {
                          break;
                      }
                  }

                  this.cls.splice(i, 1);
                  delete this.cls._map[cls];
                  this._change();
              }

              return this;
          },

      /**
       * Toggles a class in the class list.
       *
       * @method toggle
       * @param {String} cls Class to be added/removed.
       * @param {Boolean} state Optional state if it should be added/removed.
       * @return {tinymce.ui.ClassList} Current class list instance.
       */
          toggle: function (cls, state) {
              var curState = this.contains(cls);

              if (curState !== state) {
                  if (curState) {
                      this.remove(cls);
                  } else {
                      this.add(cls);
                  }

                  this._change();
              }

              return this;
          },

      /**
       * Returns true if the class list has the specified class.
       *
       * @method contains
       * @param {String} cls Class to look for.
       * @return {Boolean} true/false if the class exists or not.
       */
          contains: function (cls) {
              return !!this.cls._map[cls];
          },

      /**
       * Returns a space separated list of classes.
       *
       * @method toString
       * @return {String} Space separated list of classes.
       */

          _change: function () {
              delete this.clsValue;
              this.onchange.call(this);
          }
      });

    // IE 8 compatibility
      ClassList.prototype.toString = function () {
          var value;

          if (this.clsValue) {
              return this.clsValue;
          }

          value = '';
          for (var i = 0; i < this.cls.length; i++) {
              if (i > 0) {
                  value += ' ';
              }

              value += this.prefix + this.cls[i];
          }

          return value;
      };

      return ClassList;
  }
);
/**
 * Selector.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/* eslint no-nested-ternary:0 */

/**
 * Selector engine, enables you to select controls by using CSS like expressions.
 * We currently only support basic CSS expressions to reduce the size of the core
 * and the ones we support should be enough for most cases.
 *
 * @example
 * Supported expressions:
 *  element
 *  element#name
 *  element.class
 *  element[attr]
 *  element[attr*=value]
 *  element[attr~=value]
 *  element[attr!=value]
 *  element[attr^=value]
 *  element[attr$=value]
 *  element:<state>
 *  element:not(<expression>)
 *  element:first
 *  element:last
 *  element:odd
 *  element:even
 *  element element
 *  element > element
 *
 * @class tinymce.ui.Selector
 */
    define(
  'tinymce.ui.Selector',
        [
            'tinymce.core.util.Class'
        ],
  function (Class) {
      'use strict';

    /**
     * Produces an array with a unique set of objects. It will not compare the values
     * but the references of the objects.
     *
     * @private
     * @method unqiue
     * @param {Array} array Array to make into an array with unique items.
     * @return {Array} Array with unique items.
     */
      function unique (array) {
          var uniqueItems = [], i = array.length, item;

          while (i--) {
              item = array[i];

              if (!item.__checked) {
                  uniqueItems.push(item);
                  item.__checked = 1;
              }
          }

          i = uniqueItems.length;
          while (i--) {
              delete uniqueItems[i].__checked;
          }

          return uniqueItems;
      }

      var expression = /^([\w\\*]+)?(?:#([\w\-\\]+))?(?:\.([\w\\\.]+))?(?:\[\@?([\w\\]+)([\^\$\*!~]?=)([\w\\]+)\])?(?:\:(.+))?/i;

    /* jshint maxlen:255 */
    /* eslint max-len:0 */
      var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
          whiteSpace = /^\s*|\s*$/g,
          Collection;

      var Selector = Class.extend({
      /**
       * Constructs a new Selector instance.
       *
       * @constructor
       * @method init
       * @param {String} selector CSS like selector expression.
       */
          init: function (selector) {
              var match = this.match;

              function compileNameFilter (name) {
                  if (name) {
                      name = name.toLowerCase();

                      return function (item) {
                          return name === '*' || item.type === name;
                      };
                  }
              }

              function compileIdFilter (id) {
                  if (id) {
                      return function (item) {
                          return item._name === id;
                      };
                  }
              }

              function compileClassesFilter (classes) {
                  if (classes) {
                      classes = classes.split('.');

                      return function (item) {
                          var i = classes.length;

                          while (i--) {
                              if (!item.classes.contains(classes[i])) {
                                  return false;
                              }
                          }

                          return true;
                      };
                  }
              }

              function compileAttrFilter (name, cmp, check) {
                  if (name) {
                      return function (item) {
                          var value = item[name] ? item[name]() : '';

                          return !cmp ? !!check
                : cmp === '=' ? value === check
                  : cmp === '*=' ? value.indexOf(check) >= 0
                    : cmp === '~=' ? (' ' + value + ' ').indexOf(' ' + check + ' ') >= 0
                      : cmp === '!=' ? value != check
                        : cmp === '^=' ? value.indexOf(check) === 0
                          : cmp === '$=' ? value.substr(value.length - check.length) === check
                            : false;
                      };
                  }
              }

              function compilePsuedoFilter (name) {
                  var notSelectors;

                  if (name) {
                      name = /(?:not\((.+)\))|(.+)/i.exec(name);

                      if (!name[1]) {
                          name = name[2];

                          return function (item, index, length) {
                              return name === 'first' ? index === 0
                  : name === 'last' ? index === length - 1
                    : name === 'even' ? index % 2 === 0
                      : name === 'odd' ? index % 2 === 1
                        : item[name] ? item[name]()
                          : false;
                          };
                      }

            // Compile not expression
                      notSelectors = parseChunks(name[1], []);

                      return function (item) {
                          return !match(item, notSelectors);
                      };
                  }
              }

              function compile (selector, filters, direct) {
                  var parts;

                  function add (filter) {
                      if (filter) {
                          filters.push(filter);
                      }
                  }

          // Parse expression into parts
                  parts = expression.exec(selector.replace(whiteSpace, ''));

                  add(compileNameFilter(parts[1]));
                  add(compileIdFilter(parts[2]));
                  add(compileClassesFilter(parts[3]));
                  add(compileAttrFilter(parts[4], parts[5], parts[6]));
                  add(compilePsuedoFilter(parts[7]));

          // Mark the filter with pseudo for performance
                  filters.pseudo = !!parts[7];
                  filters.direct = direct;

                  return filters;
              }

        // Parser logic based on Sizzle by John Resig
              function parseChunks (selector, selectors) {
                  var parts = [], extra, matches, i;

                  do {
                      chunker.exec('');
                      matches = chunker.exec(selector);

                      if (matches) {
                          selector = matches[3];
                          parts.push(matches[1]);

                          if (matches[2]) {
                              extra = matches[3];
                              break;
                          }
                      }
                  } while (matches);

                  if (extra) {
                      parseChunks(extra, selectors);
                  }

                  selector = [];
                  for (i = 0; i < parts.length; i++) {
                      if (parts[i] != '>') {
                          selector.push(compile(parts[i], [], parts[i - 1] === '>'));
                      }
                  }

                  selectors.push(selector);

                  return selectors;
              }

              this._selectors = parseChunks(selector, []);
          },

      /**
       * Returns true/false if the selector matches the specified control.
       *
       * @method match
       * @param {tinymce.ui.Control} control Control to match against the selector.
       * @param {Array} selectors Optional array of selectors, mostly used internally.
       * @return {Boolean} true/false state if the control matches or not.
       */
          match: function (control, selectors) {
              var i, l, si, sl, selector, fi, fl, filters, index, length, siblings, count, item;

              selectors = selectors || this._selectors;
              for (i = 0, l = selectors.length; i < l; i++) {
                  selector = selectors[i];
                  sl = selector.length;
                  item = control;
                  count = 0;

                  for (si = sl - 1; si >= 0; si--) {
                      filters = selector[si];

                      while (item) {
              // Find the index and length since a pseudo filter like :first needs it
                          if (filters.pseudo) {
                              siblings = item.parent().items();
                              index = length = siblings.length;
                              while (index--) {
                                  if (siblings[index] === item) {
                                      break;
                                  }
                              }
                          }

                          for (fi = 0, fl = filters.length; fi < fl; fi++) {
                              if (!filters[fi](item, index, length)) {
                                  fi = fl + 1;
                                  break;
                              }
                          }

                          if (fi === fl) {
                              count++;
                              break;
                          } else {
                // If it didn't match the right most expression then
                // break since it's no point looking at the parents
                              if (si === sl - 1) {
                                  break;
                              }
                          }

                          item = item.parent();
                      }
                  }

          // If we found all selectors then return true otherwise continue looking
                  if (count === sl) {
                      return true;
                  }
              }

              return false;
          },

      /**
       * Returns a tinymce.ui.Collection with matches of the specified selector inside the specified container.
       *
       * @method find
       * @param {tinymce.ui.Control} container Container to look for items in.
       * @return {tinymce.ui.Collection} Collection with matched elements.
       */
          find: function (container) {
              var matches = [], i, l, selectors = this._selectors;

              function collect (items, selector, index) {
                  var i, l, fi, fl, item, filters = selector[index];

                  for (i = 0, l = items.length; i < l; i++) {
                      item = items[i];

            // Run each filter against the item
                      for (fi = 0, fl = filters.length; fi < fl; fi++) {
                          if (!filters[fi](item, i, l)) {
                              fi = fl + 1;
                              break;
                          }
                      }

            // All filters matched the item
                      if (fi === fl) {
              // Matched item is on the last expression like: panel toolbar [button]
                          if (index == selector.length - 1) {
                              matches.push(item);
                          } else {
                // Collect next expression type
                              if (item.items) {
                                  collect(item.items(), selector, index + 1);
                              }
                          }
                      } else if (filters.direct) {
                          return;
                      }

            // Collect child items
                      if (item.items) {
                          collect(item.items(), selector, index);
                      }
                  }
              }

              if (container.items) {
                  for (i = 0, l = selectors.length; i < l; i++) {
                      collect(container.items(), selectors[i], 0);
                  }

          // Unique the matches if needed
                  if (l > 1) {
                      matches = unique(matches);
                  }
              }

        // Fix for circular reference
              if (!Collection) {
          // TODO: Fix me!
                  Collection = Selector.Collection;
              }

              return new Collection(matches);
          }
      });

      return Selector;
  }
);

/**
 * Collection.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Control collection, this class contains control instances and it enables you to
 * perform actions on all the contained items. This is very similar to how jQuery works.
 *
 * @example
 * someCollection.show().disabled(true);
 *
 * @class tinymce.ui.Collection
 */
    define(
  'tinymce.ui.Collection',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.Selector',
            'tinymce.core.util.Class'
        ],
  function (Tools, Selector, Class) {
      'use strict';

      var Collection, proto, push = Array.prototype.push, slice = Array.prototype.slice;

      proto = {
      /**
       * Current number of contained control instances.
       *
       * @field length
       * @type Number
       */
          length: 0,

      /**
       * Constructor for the collection.
       *
       * @constructor
       * @method init
       * @param {Array} items Optional array with items to add.
       */
          init: function (items) {
              if (items) {
                  this.add(items);
              }
          },

      /**
       * Adds new items to the control collection.
       *
       * @method add
       * @param {Array} items Array if items to add to collection.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
          add: function (items) {
              var self = this;

        // Force single item into array
              if (!Tools.isArray(items)) {
                  if (items instanceof Collection) {
                      self.add(items.toArray());
                  } else {
                      push.call(self, items);
                  }
              } else {
                  push.apply(self, items);
              }

              return self;
          },

      /**
       * Sets the contents of the collection. This will remove any existing items
       * and replace them with the ones specified in the input array.
       *
       * @method set
       * @param {Array} items Array with items to set into the Collection.
       * @return {tinymce.ui.Collection} Collection instance.
       */
          set: function (items) {
              var self = this, len = self.length, i;

              self.length = 0;
              self.add(items);

        // Remove old entries
              for (i = self.length; i < len; i++) {
                  delete self[i];
              }

              return self;
          },

      /**
       * Filters the collection item based on the specified selector expression or selector function.
       *
       * @method filter
       * @param {String} selector Selector expression to filter items by.
       * @return {tinymce.ui.Collection} Collection containing the filtered items.
       */
          filter: function (selector) {
              var self = this, i, l, matches = [], item, match;

        // Compile string into selector expression
              if (typeof selector === 'string') {
                  selector = new Selector(selector);

                  match = function (item) {
                      return selector.match(item);
                  };
              } else {
          // Use selector as matching function
                  match = selector;
              }

              for (i = 0, l = self.length; i < l; i++) {
                  item = self[i];

                  if (match(item)) {
                      matches.push(item);
                  }
              }

              return new Collection(matches);
          },

      /**
       * Slices the items within the collection.
       *
       * @method slice
       * @param {Number} index Index to slice at.
       * @param {Number} len Optional length to slice.
       * @return {tinymce.ui.Collection} Current collection.
       */
          slice: function () {
              return new Collection(slice.apply(this, arguments));
          },

      /**
       * Makes the current collection equal to the specified index.
       *
       * @method eq
       * @param {Number} index Index of the item to set the collection to.
       * @return {tinymce.ui.Collection} Current collection.
       */
          eq: function (index) {
              return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
          },

      /**
       * Executes the specified callback on each item in collection.
       *
       * @method each
       * @param {function} callback Callback to execute for each item in collection.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
          each: function (callback) {
              Tools.each(this, callback);

              return this;
          },

      /**
       * Returns an JavaScript array object of the contents inside the collection.
       *
       * @method toArray
       * @return {Array} Array with all items from collection.
       */
          toArray: function () {
              return Tools.toArray(this);
          },

      /**
       * Finds the index of the specified control or return -1 if it isn't in the collection.
       *
       * @method indexOf
       * @param {Control} ctrl Control instance to look for.
       * @return {Number} Index of the specified control or -1.
       */
          indexOf: function (ctrl) {
              var self = this, i = self.length;

              while (i--) {
                  if (self[i] === ctrl) {
                      break;
                  }
              }

              return i;
          },

      /**
       * Returns a new collection of the contents in reverse order.
       *
       * @method reverse
       * @return {tinymce.ui.Collection} Collection instance with reversed items.
       */
          reverse: function () {
              return new Collection(Tools.toArray(this).reverse());
          },

      /**
       * Returns true/false if the class exists or not.
       *
       * @method hasClass
       * @param {String} cls Class to check for.
       * @return {Boolean} true/false state if the class exists or not.
       */
          hasClass: function (cls) {
              return this[0] ? this[0].classes.contains(cls) : false;
          },

      /**
       * Sets/gets the specific property on the items in the collection. The same as executing control.<property>(<value>);
       *
       * @method prop
       * @param {String} name Property name to get/set.
       * @param {Object} value Optional object value to set.
       * @return {tinymce.ui.Collection} Current collection instance or value of the first item on a get operation.
       */
          prop: function (name, value) {
              var self = this, undef, item;

              if (value !== undef) {
                  self.each(function (item) {
                      if (item[name]) {
                          item[name](value);
                      }
                  });

                  return self;
              }

              item = self[0];

              if (item && item[name]) {
                  return item[name]();
              }
          },

      /**
       * Executes the specific function name with optional arguments an all items in collection if it exists.
       *
       * @example collection.exec("myMethod", arg1, arg2, arg3);
       * @method exec
       * @param {String} name Name of the function to execute.
       * @param {Object} ... Multiple arguments to pass to each function.
       * @return {tinymce.ui.Collection} Current collection.
       */
          exec: function (name) {
              var self = this, args = Tools.toArray(arguments).slice(1);

              self.each(function (item) {
                  if (item[name]) {
                      item[name].apply(item, args);
                  }
              });

              return self;
          },

      /**
       * Remove all items from collection and DOM.
       *
       * @method remove
       * @return {tinymce.ui.Collection} Current collection.
       */
          remove: function () {
              var i = this.length;

              while (i--) {
                  this[i].remove();
              }

              return this;
          },

      /**
       * Adds a class to all items in the collection.
       *
       * @method addClass
       * @param {String} cls Class to add to each item.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
          addClass: function (cls) {
              return this.each(function (item) {
                  item.classes.add(cls);
              });
          },

      /**
       * Removes the specified class from all items in collection.
       *
       * @method removeClass
       * @param {String} cls Class to remove from each item.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
          removeClass: function (cls) {
              return this.each(function (item) {
                  item.classes.remove(cls);
              });
          }

      /**
       * Fires the specified event by name and arguments on the control. This will execute all
       * bound event handlers.
       *
       * @method fire
       * @param {String} name Name of the event to fire.
       * @param {Object} args Optional arguments to pass to the event.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
      // fire: function(event, args) {}, -- Generated by code below

      /**
       * Binds a callback to the specified event. This event can both be
       * native browser events like "click" or custom ones like PostRender.
       *
       * The callback function will have two parameters the first one being the control that received the event
       * the second one will be the event object either the browsers native event object or a custom JS object.
       *
       * @method on
       * @param {String} name Name of the event to bind. For example "click".
       * @param {String/function} callback Callback function to execute ones the event occurs.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
      // on: function(name, callback) {}, -- Generated by code below

      /**
       * Unbinds the specified event and optionally a specific callback. If you omit the name
       * parameter all event handlers will be removed. If you omit the callback all event handles
       * by the specified name will be removed.
       *
       * @method off
       * @param {String} name Optional name for the event to unbind.
       * @param {function} callback Optional callback function to unbind.
       * @return {tinymce.ui.Collection} Current collection instance.
       */
      // off: function(name, callback) {}, -- Generated by code below

      /**
       * Shows the items in the current collection.
       *
       * @method show
       * @return {tinymce.ui.Collection} Current collection instance.
       */
      // show: function() {}, -- Generated by code below

      /**
       * Hides the items in the current collection.
       *
       * @method hide
       * @return {tinymce.ui.Collection} Current collection instance.
       */
      // hide: function() {}, -- Generated by code below

      /**
       * Sets/gets the text contents of the items in the current collection.
       *
       * @method text
       * @return {tinymce.ui.Collection} Current collection instance or text value of the first item on a get operation.
       */
      // text: function(value) {}, -- Generated by code below

      /**
       * Sets/gets the name contents of the items in the current collection.
       *
       * @method name
       * @return {tinymce.ui.Collection} Current collection instance or name value of the first item on a get operation.
       */
      // name: function(value) {}, -- Generated by code below

      /**
       * Sets/gets the disabled state on the items in the current collection.
       *
       * @method disabled
       * @return {tinymce.ui.Collection} Current collection instance or disabled state of the first item on a get operation.
       */
      // disabled: function(state) {}, -- Generated by code below

      /**
       * Sets/gets the active state on the items in the current collection.
       *
       * @method active
       * @return {tinymce.ui.Collection} Current collection instance or active state of the first item on a get operation.
       */
      // active: function(state) {}, -- Generated by code below

      /**
       * Sets/gets the selected state on the items in the current collection.
       *
       * @method selected
       * @return {tinymce.ui.Collection} Current collection instance or selected state of the first item on a get operation.
       */
      // selected: function(state) {}, -- Generated by code below

      /**
       * Sets/gets the selected state on the items in the current collection.
       *
       * @method visible
       * @return {tinymce.ui.Collection} Current collection instance or visible state of the first item on a get operation.
       */
      // visible: function(state) {}, -- Generated by code below
      };

    // Extend tinymce.ui.Collection prototype with some generated control specific methods
      Tools.each('fire on off show hide append prepend before after reflow'.split(' '), function (name) {
          proto[name] = function () {
              var args = Tools.toArray(arguments);

              this.each(function (ctrl) {
                  if (name in ctrl) {
                      ctrl[name].apply(ctrl, args);
                  }
              });

              return this;
          };
      });

    // Extend tinymce.ui.Collection prototype with some property methods
      Tools.each('text name disabled active selected checked visible parent value data'.split(' '), function (name) {
          proto[name] = function (value) {
              return this.prop(name, value);
          };
      });

    // Create class based on the new prototype
      Collection = Class.extend(proto);

    // Stick Collection into Selector to prevent circual references
      Selector.Collection = Collection;

      return Collection;
  }
);
/**
 * Binding.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class gets dynamically extended to provide a binding between two models. This makes it possible to
 * sync the state of two properties in two models by a layer of abstraction.
 *
 * @private
 * @class tinymce.data.Binding
 */
    define(
  'tinymce.ui.data.Binding',
        [
        ],
  function () {
    /**
     * Constructs a new bidning.
     *
     * @constructor
     * @method Binding
     * @param {Object} settings Settings to the binding.
     */
      function Binding (settings) {
          this.create = settings.create;
      }

    /**
     * Creates a binding for a property on a model.
     *
     * @method create
     * @param {tinymce.data.ObservableObject} model Model to create binding to.
     * @param {String} name Name of property to bind.
     * @return {tinymce.data.Binding} Binding instance.
     */
      Binding.create = function (model, name) {
          return new Binding({
              create: function (otherModel, otherName) {
                  var bindings;

                  function fromSelfToOther (e) {
                      otherModel.set(otherName, e.value);
                  }

                  function fromOtherToSelf (e) {
                      model.set(name, e.value);
                  }

                  otherModel.on('change:' + otherName, fromOtherToSelf);
                  model.on('change:' + name, fromSelfToOther);

          // Keep track of the bindings
                  bindings = otherModel._bindings;

                  if (!bindings) {
                      bindings = otherModel._bindings = [];

                      otherModel.on('destroy', function () {
                          var i = bindings.length;

                          while (i--) {
                              bindings[i]();
                          }
                      });
                  }

                  bindings.push(function () {
                      model.off('change:' + name, fromSelfToOther);
                  });

                  return model.get(name);
              }
          });
      };

      return Binding;
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Observable',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Observable');
  }
);

/**
 * ObservableObject.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class is a object that is observable when properties changes a change event gets emitted.
 *
 * @private
 * @class tinymce.data.ObservableObject
 */
    define(
  'tinymce.ui.data.ObservableObject',
        [
            'tinymce.ui.data.Binding',
            'tinymce.core.util.Class',
            'tinymce.core.util.Observable',
            'tinymce.core.util.Tools'
        ], function (Binding, Class, Observable, Tools) {
            function isNode (node) {
                return node.nodeType > 0;
            }

    // Todo: Maybe this should be shallow compare since it might be huge object references
            function isEqual (a, b) {
                var k, checked;

      // Strict equals
                if (a === b) {
                    return true;
                }

      // Compare null
                if (a === null || b === null) {
                    return a === b;
                }

      // Compare number, boolean, string, undefined
                if (typeof a !== 'object' || typeof b !== 'object') {
                    return a === b;
                }

      // Compare arrays
                if (Tools.isArray(b)) {
                    if (a.length !== b.length) {
                        return false;
                    }

                    k = a.length;
                    while (k--) {
                        if (!isEqual(a[k], b[k])) {
                            return false;
                        }
                    }
                }

      // Shallow compare nodes
                if (isNode(a) || isNode(b)) {
                    return a === b;
                }

      // Compare objects
                checked = {};
                for (k in b) {
                    if (!isEqual(a[k], b[k])) {
                        return false;
                    }

                    checked[k] = true;
                }

                for (k in a) {
                    if (!checked[k] && !isEqual(a[k], b[k])) {
                        return false;
                    }
                }

                return true;
            }

            return Class.extend({
                Mixins: [Observable],

      /**
       * Constructs a new observable object instance.
       *
       * @constructor
       * @param {Object} data Initial data for the object.
       */
                init: function (data) {
                    var name, value;

                    data = data || {};

                    for (name in data) {
                        value = data[name];

                        if (value instanceof Binding) {
                            data[name] = value.create(this, name);
                        }
                    }

                    this.data = data;
                },

      /**
       * Sets a property on the value this will call
       * observers if the value is a change from the current value.
       *
       * @method set
       * @param {String/object} name Name of the property to set or a object of items to set.
       * @param {Object} value Value to set for the property.
       * @return {tinymce.data.ObservableObject} Observable object instance.
       */
                set: function (name, value) {
                    var key, args, oldValue = this.data[name];

                    if (value instanceof Binding) {
                        value = value.create(this, name);
                    }

                    if (typeof name === 'object') {
                        for (key in name) {
                            this.set(key, name[key]);
                        }

                        return this;
                    }

                    if (!isEqual(oldValue, value)) {
                        this.data[name] = value;

                        args = {
                            target: this,
                            name: name,
                            value: value,
                            oldValue: oldValue
                        };

                        this.fire('change:' + name, args);
                        this.fire('change', args);
                    }

                    return this;
                },

      /**
       * Gets a property by name.
       *
       * @method get
       * @param {String} name Name of the property to get.
       * @return {Object} Object value of propery.
       */
                get: function (name) {
                    return this.data[name];
                },

      /**
       * Returns true/false if the specified property exists.
       *
       * @method has
       * @param {String} name Name of the property to check for.
       * @return {Boolean} true/false if the item exists.
       */
                has: function (name) {
                    return name in this.data;
                },

      /**
       * Returns a dynamic property binding for the specified property name. This makes
       * it possible to sync the state of two properties in two ObservableObject instances.
       *
       * @method bind
       * @param {String} name Name of the property to sync with the property it's inserted to.
       * @return {tinymce.data.Binding} Data binding instance.
       */
                bind: function (name) {
                    return Binding.create(this, name);
                },

      /**
       * Destroys the observable object and fires the "destroy"
       * event and clean up any internal resources.
       *
       * @method destroy
       */
                destroy: function () {
                    this.fire('destroy');
                }
            });
        }
);
/**
 * ReflowQueue.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class will automatically reflow controls on the next animation frame within a few milliseconds on older browsers.
 * If the user manually reflows then the automatic reflow will be cancelled. This class is used internally when various control states
 * changes that triggers a reflow.
 *
 * @class tinymce.ui.ReflowQueue
 * @static
 */
    define(
  'tinymce.ui.ReflowQueue',
        [
            'global!document',
            'tinymce.core.util.Delay'
        ],
  function (document, Delay) {
      var dirtyCtrls = {}, animationFrameRequested;

      return {
      /**
       * Adds a control to the next automatic reflow call. This is the control that had a state
       * change for example if the control was hidden/shown.
       *
       * @method add
       * @param {tinymce.ui.Control} ctrl Control to add to queue.
       */
          add: function (ctrl) {
              var parent = ctrl.parent();

              if (parent) {
                  if (!parent._layout || parent._layout.isNative()) {
                      return;
                  }

                  if (!dirtyCtrls[parent._id]) {
                      dirtyCtrls[parent._id] = parent;
                  }

                  if (!animationFrameRequested) {
                      animationFrameRequested = true;

                      Delay.requestAnimationFrame(function () {
                          var id, ctrl;

                          animationFrameRequested = false;

                          for (id in dirtyCtrls) {
                              ctrl = dirtyCtrls[id];

                              if (ctrl.state.get('rendered')) {
                                  ctrl.reflow();
                              }
                          }

                          dirtyCtrls = {};
                      }, document.body);
                  }
              }
          },

      /**
       * Removes the specified control from the automatic reflow. This will happen when for example the user
       * manually triggers a reflow.
       *
       * @method remove
       * @param {tinymce.ui.Control} ctrl Control to remove from queue.
       */
          remove: function (ctrl) {
              if (dirtyCtrls[ctrl._id]) {
                  delete dirtyCtrls[ctrl._id];
              }
          }
      };
  }
);

/**
 * Control.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/* eslint consistent-this:0 */

/**
 * This is the base class for all controls and containers. All UI control instances inherit
 * from this one as it has the base logic needed by all of them.
 *
 * @class tinymce.ui.Control
 */
    define(
  'tinymce.ui.Control',
        [
            'global!document',
            'tinymce.core.dom.DomQuery',
            'tinymce.core.util.Class',
            'tinymce.core.util.EventDispatcher',
            'tinymce.core.util.Tools',
            'tinymce.ui.BoxUtils',
            'tinymce.ui.ClassList',
            'tinymce.ui.Collection',
            'tinymce.ui.data.ObservableObject',
            'tinymce.ui.DomUtils',
            'tinymce.ui.ReflowQueue'
        ],
  function (document, DomQuery, Class, EventDispatcher, Tools, BoxUtils, ClassList, Collection, ObservableObject, DomUtils, ReflowQueue) {
      'use strict';

      var hasMouseWheelEventSupport = 'onmousewheel' in document;
      var hasWheelEventSupport = false;
      var classPrefix = 'mce-';
      var Control, idCounter = 0;

      var proto = {
          Statics: {
              classPrefix: classPrefix
          },

          isRtl: function () {
              return Control.rtl;
          },

      /**
       * Class/id prefix to use for all controls.
       *
       * @final
       * @field {String} classPrefix
       */
          classPrefix: classPrefix,

      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} style Style CSS properties to add.
       * @setting {String} border Border box values example: 1 1 1 1
       * @setting {String} padding Padding box values example: 1 1 1 1
       * @setting {String} margin Margin box values example: 1 1 1 1
       * @setting {Number} minWidth Minimal width for the control.
       * @setting {Number} minHeight Minimal height for the control.
       * @setting {String} classes Space separated list of classes to add.
       * @setting {String} role WAI-ARIA role to use for control.
       * @setting {Boolean} hidden Is the control hidden by default.
       * @setting {Boolean} disabled Is the control disabled by default.
       * @setting {String} name Name of the control instance.
       */
          init: function (settings) {
              var self = this, classes, defaultClasses;

              function applyClasses (classes) {
                  var i;

                  classes = classes.split(' ');
                  for (i = 0; i < classes.length; i++) {
                      self.classes.add(classes[i]);
                  }
              }

              self.settings = settings = Tools.extend({}, self.Defaults, settings);

        // Initial states
              self._id = settings.id || ('mceu_' + (idCounter++));
              self._aria = { role: settings.role };
              self._elmCache = {};
              self.$ = DomQuery;

              self.state = new ObservableObject({
                  visible: true,
                  active: false,
                  disabled: false,
                  value: ''
              });

              self.data = new ObservableObject(settings.data);

              self.classes = new ClassList(function () {
                  if (self.state.get('rendered')) {
                      self.getEl().className = this.toString();
                  }
              });
              self.classes.prefix = self.classPrefix;

        // Setup classes
              classes = settings.classes;
              if (classes) {
                  if (self.Defaults) {
                      defaultClasses = self.Defaults.classes;

                      if (defaultClasses && classes != defaultClasses) {
                          applyClasses(defaultClasses);
                      }
                  }

                  applyClasses(classes);
              }

              Tools.each('title text name visible disabled active value'.split(' '), function (name) {
                  if (name in settings) {
                      self[name](settings[name]);
                  }
              });

              self.on('click', function () {
                  if (self.disabled()) {
                      return false;
                  }
              });

        /**
         * Name/value object with settings for the current control.
         *
         * @field {Object} settings
         */
              self.settings = settings;

              self.borderBox = BoxUtils.parseBox(settings.border);
              self.paddingBox = BoxUtils.parseBox(settings.padding);
              self.marginBox = BoxUtils.parseBox(settings.margin);

              if (settings.hidden) {
                  self.hide();
              }
          },

      // Will generate getter/setter methods for these properties
          Properties: 'parent,name',

      /**
       * Returns the root element to render controls into.
       *
       * @method getContainerElm
       * @return {Element} HTML DOM element to render into.
       */
          getContainerElm: function () {
              return DomUtils.getContainer();
          },

      /**
       * Returns a control instance for the current DOM element.
       *
       * @method getParentCtrl
       * @param {Element} elm HTML dom element to get parent control from.
       * @return {tinymce.ui.Control} Control instance or undefined.
       */
          getParentCtrl: function (elm) {
              var ctrl, lookup = this.getRoot().controlIdLookup;

              while (elm && lookup) {
                  ctrl = lookup[elm.id];
                  if (ctrl) {
                      break;
                  }

                  elm = elm.parentNode;
              }

              return ctrl;
          },

      /**
       * Initializes the current controls layout rect.
       * This will be executed by the layout managers to determine the
       * default minWidth/minHeight etc.
       *
       * @method initLayoutRect
       * @return {Object} Layout rect instance.
       */
          initLayoutRect: function () {
              var self = this, settings = self.settings, borderBox, layoutRect;
              var elm = self.getEl(), width, height, minWidth, minHeight, autoResize;
              var startMinWidth, startMinHeight, initialSize;

        // Measure the current element
              borderBox = self.borderBox = self.borderBox || BoxUtils.measureBox(elm, 'border');
              self.paddingBox = self.paddingBox || BoxUtils.measureBox(elm, 'padding');
              self.marginBox = self.marginBox || BoxUtils.measureBox(elm, 'margin');
              initialSize = DomUtils.getSize(elm);

        // Setup minWidth/minHeight and width/height
              startMinWidth = settings.minWidth;
              startMinHeight = settings.minHeight;
              minWidth = startMinWidth || initialSize.width;
              minHeight = startMinHeight || initialSize.height;
              width = settings.width;
              height = settings.height;
              autoResize = settings.autoResize;
              autoResize = typeof autoResize !== 'undefined' ? autoResize : !width && !height;

              width = width || minWidth;
              height = height || minHeight;

              var deltaW = borderBox.left + borderBox.right;
              var deltaH = borderBox.top + borderBox.bottom;

              var maxW = settings.maxWidth || 0xFFFF;
              var maxH = settings.maxHeight || 0xFFFF;

        // Setup initial layout rect
              self._layoutRect = layoutRect = {
                  x: settings.x || 0,
                  y: settings.y || 0,
                  w: width,
                  h: height,
                  deltaW: deltaW,
                  deltaH: deltaH,
                  contentW: width - deltaW,
                  contentH: height - deltaH,
                  innerW: width - deltaW,
                  innerH: height - deltaH,
                  startMinWidth: startMinWidth || 0,
                  startMinHeight: startMinHeight || 0,
                  minW: Math.min(minWidth, maxW),
                  minH: Math.min(minHeight, maxH),
                  maxW: maxW,
                  maxH: maxH,
                  autoResize: autoResize,
                  scrollW: 0
              };

              self._lastLayoutRect = {};

              return layoutRect;
          },

      /**
       * Getter/setter for the current layout rect.
       *
       * @method layoutRect
       * @param {Object} [newRect] Optional new layout rect.
       * @return {tinymce.ui.Control/Object} Current control or rect object.
       */
          layoutRect: function (newRect) {
              var self = this, curRect = self._layoutRect, lastLayoutRect, size, deltaWidth, deltaHeight, undef, repaintControls;

        // Initialize default layout rect
              if (!curRect) {
                  curRect = self.initLayoutRect();
              }

        // Set new rect values
              if (newRect) {
          // Calc deltas between inner and outer sizes
                  deltaWidth = curRect.deltaW;
                  deltaHeight = curRect.deltaH;

          // Set x position
                  if (newRect.x !== undef) {
                      curRect.x = newRect.x;
                  }

          // Set y position
                  if (newRect.y !== undef) {
                      curRect.y = newRect.y;
                  }

          // Set minW
                  if (newRect.minW !== undef) {
                      curRect.minW = newRect.minW;
                  }

          // Set minH
                  if (newRect.minH !== undef) {
                      curRect.minH = newRect.minH;
                  }

          // Set new width and calculate inner width
                  size = newRect.w;
                  if (size !== undef) {
                      size = size < curRect.minW ? curRect.minW : size;
                      size = size > curRect.maxW ? curRect.maxW : size;
                      curRect.w = size;
                      curRect.innerW = size - deltaWidth;
                  }

          // Set new height and calculate inner height
                  size = newRect.h;
                  if (size !== undef) {
                      size = size < curRect.minH ? curRect.minH : size;
                      size = size > curRect.maxH ? curRect.maxH : size;
                      curRect.h = size;
                      curRect.innerH = size - deltaHeight;
                  }

          // Set new inner width and calculate width
                  size = newRect.innerW;
                  if (size !== undef) {
                      size = size < curRect.minW - deltaWidth ? curRect.minW - deltaWidth : size;
                      size = size > curRect.maxW - deltaWidth ? curRect.maxW - deltaWidth : size;
                      curRect.innerW = size;
                      curRect.w = size + deltaWidth;
                  }

          // Set new height and calculate inner height
                  size = newRect.innerH;
                  if (size !== undef) {
                      size = size < curRect.minH - deltaHeight ? curRect.minH - deltaHeight : size;
                      size = size > curRect.maxH - deltaHeight ? curRect.maxH - deltaHeight : size;
                      curRect.innerH = size;
                      curRect.h = size + deltaHeight;
                  }

          // Set new contentW
                  if (newRect.contentW !== undef) {
                      curRect.contentW = newRect.contentW;
                  }

          // Set new contentH
                  if (newRect.contentH !== undef) {
                      curRect.contentH = newRect.contentH;
                  }

          // Compare last layout rect with the current one to see if we need to repaint or not
                  lastLayoutRect = self._lastLayoutRect;
                  if (lastLayoutRect.x !== curRect.x || lastLayoutRect.y !== curRect.y ||
            lastLayoutRect.w !== curRect.w || lastLayoutRect.h !== curRect.h) {
                      repaintControls = Control.repaintControls;

                      if (repaintControls) {
                          if (repaintControls.map && !repaintControls.map[self._id]) {
                              repaintControls.push(self);
                              repaintControls.map[self._id] = true;
                          }
                      }

                      lastLayoutRect.x = curRect.x;
                      lastLayoutRect.y = curRect.y;
                      lastLayoutRect.w = curRect.w;
                      lastLayoutRect.h = curRect.h;
                  }

                  return self;
              }

              return curRect;
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, style, bodyStyle, bodyElm, rect, borderBox;
              var borderW, borderH, lastRepaintRect, round, value;

        // Use Math.round on all values on IE < 9
              round = !document.createRange ? Math.round : function (value) {
                  return value;
              };

              style = self.getEl().style;
              rect = self._layoutRect;
              lastRepaintRect = self._lastRepaintRect || {};

              borderBox = self.borderBox;
              borderW = borderBox.left + borderBox.right;
              borderH = borderBox.top + borderBox.bottom;

              if (rect.x !== lastRepaintRect.x) {
                  style.left = round(rect.x) + 'px';
                  lastRepaintRect.x = rect.x;
              }

              if (rect.y !== lastRepaintRect.y) {
                  style.top = round(rect.y) + 'px';
                  lastRepaintRect.y = rect.y;
              }

              if (rect.w !== lastRepaintRect.w) {
                  value = round(rect.w - borderW);
                  style.width = (value >= 0 ? value : 0) + 'px';
                  lastRepaintRect.w = rect.w;
              }

              if (rect.h !== lastRepaintRect.h) {
                  value = round(rect.h - borderH);
                  style.height = (value >= 0 ? value : 0) + 'px';
                  lastRepaintRect.h = rect.h;
              }

        // Update body if needed
              if (self._hasBody && rect.innerW !== lastRepaintRect.innerW) {
                  value = round(rect.innerW);

                  bodyElm = self.getEl('body');
                  if (bodyElm) {
                      bodyStyle = bodyElm.style;
                      bodyStyle.width = (value >= 0 ? value : 0) + 'px';
                  }

                  lastRepaintRect.innerW = rect.innerW;
              }

              if (self._hasBody && rect.innerH !== lastRepaintRect.innerH) {
                  value = round(rect.innerH);

                  bodyElm = bodyElm || self.getEl('body');
                  if (bodyElm) {
                      bodyStyle = bodyStyle || bodyElm.style;
                      bodyStyle.height = (value >= 0 ? value : 0) + 'px';
                  }

                  lastRepaintRect.innerH = rect.innerH;
              }

              self._lastRepaintRect = lastRepaintRect;
              self.fire('repaint', {}, false);
          },

      /**
       * Updates the controls layout rect by re-measuing it.
       */
          updateLayoutRect: function () {
              var self = this;

              self.parent()._lastRect = null;

              DomUtils.css(self.getEl(), { width: '', height: '' });

              self._layoutRect = self._lastRepaintRect = self._lastLayoutRect = null;
              self.initLayoutRect();
          },

      /**
       * Binds a callback to the specified event. This event can both be
       * native browser events like "click" or custom ones like PostRender.
       *
       * The callback function will be passed a DOM event like object that enables yout do stop propagation.
       *
       * @method on
       * @param {String} name Name of the event to bind. For example "click".
       * @param {String/function} callback Callback function to execute ones the event occurs.
       * @return {tinymce.ui.Control} Current control object.
       */
          on: function (name, callback) {
              var self = this;

              function resolveCallbackName (name) {
                  var callback, scope;

                  if (typeof name !== 'string') {
                      return name;
                  }

                  return function (e) {
                      if (!callback) {
                          self.parentsAndSelf().each(function (ctrl) {
                              var callbacks = ctrl.settings.callbacks;

                              if (callbacks && (callback = callbacks[name])) {
                                  scope = ctrl;
                                  return false;
                              }
                          });
                      }

                      if (!callback) {
                          e.action = name;
                          this.fire('execute', e);
                          return;
                      }

                      return callback.call(scope, e);
                  };
              }

              getEventDispatcher(self).on(name, resolveCallbackName(callback));

              return self;
          },

      /**
       * Unbinds the specified event and optionally a specific callback. If you omit the name
       * parameter all event handlers will be removed. If you omit the callback all event handles
       * by the specified name will be removed.
       *
       * @method off
       * @param {String} [name] Name for the event to unbind.
       * @param {function} [callback] Callback function to unbind.
       * @return {tinymce.ui.Control} Current control object.
       */
          off: function (name, callback) {
              getEventDispatcher(this).off(name, callback);
              return this;
          },

      /**
       * Fires the specified event by name and arguments on the control. This will execute all
       * bound event handlers.
       *
       * @method fire
       * @param {String} name Name of the event to fire.
       * @param {Object} [args] Arguments to pass to the event.
       * @param {Boolean} [bubble] Value to control bubbling. Defaults to true.
       * @return {Object} Current arguments object.
       */
          fire: function (name, args, bubble) {
              var self = this;

              args = args || {};

              if (!args.control) {
                  args.control = self;
              }

              args = getEventDispatcher(self).fire(name, args);

        // Bubble event up to parents
              if (bubble !== false && self.parent) {
                  var parent = self.parent();
                  while (parent && !args.isPropagationStopped()) {
                      parent.fire(name, args, false);
                      parent = parent.parent();
                  }
              }

              return args;
          },

      /**
       * Returns true/false if the specified event has any listeners.
       *
       * @method hasEventListeners
       * @param {String} name Name of the event to check for.
       * @return {Boolean} True/false state if the event has listeners.
       */
          hasEventListeners: function (name) {
              return getEventDispatcher(this).has(name);
          },

      /**
       * Returns a control collection with all parent controls.
       *
       * @method parents
       * @param {String} selector Optional selector expression to find parents.
       * @return {tinymce.ui.Collection} Collection with all parent controls.
       */
          parents: function (selector) {
              var self = this, ctrl, parents = new Collection();

        // Add each parent to collection
              for (ctrl = self.parent(); ctrl; ctrl = ctrl.parent()) {
                  parents.add(ctrl);
              }

        // Filter away everything that doesn't match the selector
              if (selector) {
                  parents = parents.filter(selector);
              }

              return parents;
          },

      /**
       * Returns the current control and it's parents.
       *
       * @method parentsAndSelf
       * @param {String} selector Optional selector expression to find parents.
       * @return {tinymce.ui.Collection} Collection with all parent controls.
       */
          parentsAndSelf: function (selector) {
              return new Collection(this).add(this.parents(selector));
          },

      /**
       * Returns the control next to the current control.
       *
       * @method next
       * @return {tinymce.ui.Control} Next control instance.
       */
          next: function () {
              var parentControls = this.parent().items();

              return parentControls[parentControls.indexOf(this) + 1];
          },

      /**
       * Returns the control previous to the current control.
       *
       * @method prev
       * @return {tinymce.ui.Control} Previous control instance.
       */
          prev: function () {
              var parentControls = this.parent().items();

              return parentControls[parentControls.indexOf(this) - 1];
          },

      /**
       * Sets the inner HTML of the control element.
       *
       * @method innerHtml
       * @param {String} html Html string to set as inner html.
       * @return {tinymce.ui.Control} Current control object.
       */
          innerHtml: function (html) {
              this.$el.html(html);
              return this;
          },

      /**
       * Returns the control DOM element or sub element.
       *
       * @method getEl
       * @param {String} [suffix] Suffix to get element by.
       * @return {Element} HTML DOM element for the current control or it's children.
       */
          getEl: function (suffix) {
              var id = suffix ? this._id + '-' + suffix : this._id;

              if (!this._elmCache[id]) {
                  this._elmCache[id] = DomQuery('#' + id)[0];
              }

              return this._elmCache[id];
          },

      /**
       * Sets the visible state to true.
       *
       * @method show
       * @return {tinymce.ui.Control} Current control instance.
       */
          show: function () {
              return this.visible(true);
          },

      /**
       * Sets the visible state to false.
       *
       * @method hide
       * @return {tinymce.ui.Control} Current control instance.
       */
          hide: function () {
              return this.visible(false);
          },

      /**
       * Focuses the current control.
       *
       * @method focus
       * @return {tinymce.ui.Control} Current control instance.
       */
          focus: function () {
              try {
                  this.getEl().focus();
              } catch (ex) {
          // Ignore IE error
              }

              return this;
          },

      /**
       * Blurs the current control.
       *
       * @method blur
       * @return {tinymce.ui.Control} Current control instance.
       */
          blur: function () {
              this.getEl().blur();

              return this;
          },

      /**
       * Sets the specified aria property.
       *
       * @method aria
       * @param {String} name Name of the aria property to set.
       * @param {String} value Value of the aria property.
       * @return {tinymce.ui.Control} Current control instance.
       */
          aria: function (name, value) {
              var self = this, elm = self.getEl(self.ariaTarget);

              if (typeof value === 'undefined') {
                  return self._aria[name];
              }

              self._aria[name] = value;

              if (self.state.get('rendered')) {
                  elm.setAttribute(name == 'role' ? name : 'aria-' + name, value);
              }

              return self;
          },

      /**
       * Encodes the specified string with HTML entities. It will also
       * translate the string to different languages.
       *
       * @method encode
       * @param {String/Object/Array} text Text to entity encode.
       * @param {Boolean} [translate=true] False if the contents shouldn't be translated.
       * @return {String} Encoded and possible traslated string.
       */
          encode: function (text, translate) {
              if (translate !== false) {
                  text = this.translate(text);
              }

              return (text || '').replace(/[&<>"]/g, function (match) {
                  return '&#' + match.charCodeAt(0) + ';';
              });
          },

      /**
       * Returns the translated string.
       *
       * @method translate
       * @param {String} text Text to translate.
       * @return {String} Translated string or the same as the input.
       */
          translate: function (text) {
              return Control.translate ? Control.translate(text) : text;
          },

      /**
       * Adds items before the current control.
       *
       * @method before
       * @param {Array/tinymce.ui.Collection} items Array of items to prepend before this control.
       * @return {tinymce.ui.Control} Current control instance.
       */
          before: function (items) {
              var self = this, parent = self.parent();

              if (parent) {
                  parent.insert(items, parent.items().indexOf(self), true);
              }

              return self;
          },

      /**
       * Adds items after the current control.
       *
       * @method after
       * @param {Array/tinymce.ui.Collection} items Array of items to append after this control.
       * @return {tinymce.ui.Control} Current control instance.
       */
          after: function (items) {
              var self = this, parent = self.parent();

              if (parent) {
                  parent.insert(items, parent.items().indexOf(self));
              }

              return self;
          },

      /**
       * Removes the current control from DOM and from UI collections.
       *
       * @method remove
       * @return {tinymce.ui.Control} Current control instance.
       */
          remove: function () {
              var self = this, elm = self.getEl(), parent = self.parent(), newItems, i;

              if (self.items) {
                  var controls = self.items().toArray();
                  i = controls.length;
                  while (i--) {
                      controls[i].remove();
                  }
              }

              if (parent && parent.items) {
                  newItems = [];

                  parent.items().each(function (item) {
                      if (item !== self) {
                          newItems.push(item);
                      }
                  });

                  parent.items().set(newItems);
                  parent._lastRect = null;
              }

              if (self._eventsRoot && self._eventsRoot == self) {
                  DomQuery(elm).off();
              }

              var lookup = self.getRoot().controlIdLookup;
              if (lookup) {
                  delete lookup[self._id];
              }

              if (elm && elm.parentNode) {
                  elm.parentNode.removeChild(elm);
              }

              self.state.set('rendered', false);
              self.state.destroy();

              self.fire('remove');

              return self;
          },

      /**
       * Renders the control before the specified element.
       *
       * @method renderBefore
       * @param {Element} elm Element to render before.
       * @return {tinymce.ui.Control} Current control instance.
       */
          renderBefore: function (elm) {
              DomQuery(elm).before(this.renderHtml());
              this.postRender();
              return this;
          },

      /**
       * Renders the control to the specified element.
       *
       * @method renderBefore
       * @param {Element} elm Element to render to.
       * @return {tinymce.ui.Control} Current control instance.
       */
          renderTo: function (elm) {
              DomQuery(elm || this.getContainerElm()).append(this.renderHtml());
              this.postRender();
              return this;
          },

          preRender: function () {
          },

          render: function () {
          },

          renderHtml: function () {
              return '<div id="' + this._id + '" class="' + this.classes + '"></div>';
          },

      /**
       * Post render method. Called after the control has been rendered to the target.
       *
       * @method postRender
       * @return {tinymce.ui.Control} Current control instance.
       */
          postRender: function () {
              var self = this, settings = self.settings, elm, box, parent, name, parentEventsRoot;

              self.$el = DomQuery(self.getEl());
              self.state.set('rendered', true);

        // Bind on<event> settings
              for (name in settings) {
                  if (name.indexOf('on') === 0) {
                      self.on(name.substr(2), settings[name]);
                  }
              }

              if (self._eventsRoot) {
                  for (parent = self.parent(); !parentEventsRoot && parent; parent = parent.parent()) {
                      parentEventsRoot = parent._eventsRoot;
                  }

                  if (parentEventsRoot) {
                      for (name in parentEventsRoot._nativeEvents) {
                          self._nativeEvents[name] = true;
                      }
                  }
              }

              bindPendingEvents(self);

              if (settings.style) {
                  elm = self.getEl();
                  if (elm) {
                      elm.setAttribute('style', settings.style);
                      elm.style.cssText = settings.style;
                  }
              }

              if (self.settings.border) {
                  box = self.borderBox;
                  self.$el.css({
                      'border-top-width': box.top,
                      'border-right-width': box.right,
                      'border-bottom-width': box.bottom,
                      'border-left-width': box.left
                  });
              }

        // Add instance to lookup
              var root = self.getRoot();
              if (!root.controlIdLookup) {
                  root.controlIdLookup = {};
              }

              root.controlIdLookup[self._id] = self;

              for (var key in self._aria) {
                  self.aria(key, self._aria[key]);
              }

              if (self.state.get('visible') === false) {
                  self.getEl().style.display = 'none';
              }

              self.bindStates();

              self.state.on('change:visible', function (e) {
                  var state = e.value, parentCtrl;

                  if (self.state.get('rendered')) {
                      self.getEl().style.display = state === false ? 'none' : '';

            // Need to force a reflow here on IE 8
                      self.getEl().getBoundingClientRect();
                  }

          // Parent container needs to reflow
                  parentCtrl = self.parent();
                  if (parentCtrl) {
                      parentCtrl._lastRect = null;
                  }

                  self.fire(state ? 'show' : 'hide');

                  ReflowQueue.add(self);
              });

              self.fire('postrender', {}, false);
          },

          bindStates: function () {
          },

      /**
       * Scrolls the current control into view.
       *
       * @method scrollIntoView
       * @param {String} align Alignment in view top|center|bottom.
       * @return {tinymce.ui.Control} Current control instance.
       */
          scrollIntoView: function (align) {
              function getOffset (elm, rootElm) {
                  var x, y, parent = elm;

                  x = y = 0;
                  while (parent && parent != rootElm && parent.nodeType) {
                      x += parent.offsetLeft || 0;
                      y += parent.offsetTop || 0;
                      parent = parent.offsetParent;
                  }

                  return { x: x, y: y };
              }

              var elm = this.getEl(), parentElm = elm.parentNode;
              var x, y, width, height, parentWidth, parentHeight;
              var pos = getOffset(elm, parentElm);

              x = pos.x;
              y = pos.y;
              width = elm.offsetWidth;
              height = elm.offsetHeight;
              parentWidth = parentElm.clientWidth;
              parentHeight = parentElm.clientHeight;

              if (align == 'end') {
                  x -= parentWidth - width;
                  y -= parentHeight - height;
              } else if (align == 'center') {
                  x -= (parentWidth / 2) - (width / 2);
                  y -= (parentHeight / 2) - (height / 2);
              }

              parentElm.scrollLeft = x;
              parentElm.scrollTop = y;

              return this;
          },

          getRoot: function () {
              var ctrl = this, rootControl, parents = [];

              while (ctrl) {
                  if (ctrl.rootControl) {
                      rootControl = ctrl.rootControl;
                      break;
                  }

                  parents.push(ctrl);
                  rootControl = ctrl;
                  ctrl = ctrl.parent();
              }

              if (!rootControl) {
                  rootControl = this;
              }

              var i = parents.length;
              while (i--) {
                  parents[i].rootControl = rootControl;
              }

              return rootControl;
          },

      /**
       * Reflows the current control and it's parents.
       * This should be used after you for example append children to the current control so
       * that the layout managers know that they need to reposition everything.
       *
       * @example
       * container.append({type: 'button', text: 'My button'}).reflow();
       *
       * @method reflow
       * @return {tinymce.ui.Control} Current control instance.
       */
          reflow: function () {
              ReflowQueue.remove(this);

              var parent = this.parent();
              if (parent && parent._layout && !parent._layout.isNative()) {
                  parent.reflow();
              }

              return this;
          }

      /**
       * Sets/gets the parent container for the control.
       *
       * @method parent
       * @param {tinymce.ui.Container} parent Optional parent to set.
       * @return {tinymce.ui.Control} Parent control or the current control on a set action.
       */
      // parent: function(parent) {} -- Generated

      /**
       * Sets/gets the text for the control.
       *
       * @method text
       * @param {String} value Value to set to control.
       * @return {String/tinymce.ui.Control} Current control on a set operation or current value on a get.
       */
      // text: function(value) {} -- Generated

      /**
       * Sets/gets the disabled state on the control.
       *
       * @method disabled
       * @param {Boolean} state Value to set to control.
       * @return {Boolean/tinymce.ui.Control} Current control on a set operation or current state on a get.
       */
      // disabled: function(state) {} -- Generated

      /**
       * Sets/gets the active for the control.
       *
       * @method active
       * @param {Boolean} state Value to set to control.
       * @return {Boolean/tinymce.ui.Control} Current control on a set operation or current state on a get.
       */
      // active: function(state) {} -- Generated

      /**
       * Sets/gets the name for the control.
       *
       * @method name
       * @param {String} value Value to set to control.
       * @return {String/tinymce.ui.Control} Current control on a set operation or current value on a get.
       */
      // name: function(value) {} -- Generated

      /**
       * Sets/gets the title for the control.
       *
       * @method title
       * @param {String} value Value to set to control.
       * @return {String/tinymce.ui.Control} Current control on a set operation or current value on a get.
       */
      // title: function(value) {} -- Generated

      /**
       * Sets/gets the visible for the control.
       *
       * @method visible
       * @param {Boolean} state Value to set to control.
       * @return {Boolean/tinymce.ui.Control} Current control on a set operation or current state on a get.
       */
      // visible: function(value) {} -- Generated
      };

    /**
     * Setup state properties.
     */
      Tools.each('text title visible disabled active value'.split(' '), function (name) {
          proto[name] = function (value) {
              if (arguments.length === 0) {
                  return this.state.get(name);
              }

              if (typeof value !== 'undefined') {
                  this.state.set(name, value);
              }

              return this;
          };
      });

      Control = Class.extend(proto);

      function getEventDispatcher (obj) {
          if (!obj._eventDispatcher) {
              obj._eventDispatcher = new EventDispatcher({
                  scope: obj,
                  toggleEvent: function (name, state) {
                      if (state && EventDispatcher.isNative(name)) {
                          if (!obj._nativeEvents) {
                              obj._nativeEvents = {};
                          }

                          obj._nativeEvents[name] = true;

                          if (obj.state.get('rendered')) {
                              bindPendingEvents(obj);
                          }
                      }
                  }
              });
          }

          return obj._eventDispatcher;
      }

      function bindPendingEvents (eventCtrl) {
          var i, l, parents, eventRootCtrl, nativeEvents, name;

          function delegate (e) {
              var control = eventCtrl.getParentCtrl(e.target);

              if (control) {
                  control.fire(e.type, e);
              }
          }

          function mouseLeaveHandler () {
              var ctrl = eventRootCtrl._lastHoverCtrl;

              if (ctrl) {
                  ctrl.fire('mouseleave', { target: ctrl.getEl() });

                  ctrl.parents().each(function (ctrl) {
                      ctrl.fire('mouseleave', { target: ctrl.getEl() });
                  });

                  eventRootCtrl._lastHoverCtrl = null;
              }
          }

          function mouseEnterHandler (e) {
              var ctrl = eventCtrl.getParentCtrl(e.target), lastCtrl = eventRootCtrl._lastHoverCtrl, idx = 0, i, parents, lastParents;

        // Over on a new control
              if (ctrl !== lastCtrl) {
                  eventRootCtrl._lastHoverCtrl = ctrl;

                  parents = ctrl.parents().toArray().reverse();
                  parents.push(ctrl);

                  if (lastCtrl) {
                      lastParents = lastCtrl.parents().toArray().reverse();
                      lastParents.push(lastCtrl);

                      for (idx = 0; idx < lastParents.length; idx++) {
                          if (parents[idx] !== lastParents[idx]) {
                              break;
                          }
                      }

                      for (i = lastParents.length - 1; i >= idx; i--) {
                          lastCtrl = lastParents[i];
                          lastCtrl.fire('mouseleave', {
                              target: lastCtrl.getEl()
                          });
                      }
                  }

                  for (i = idx; i < parents.length; i++) {
                      ctrl = parents[i];
                      ctrl.fire('mouseenter', {
                          target: ctrl.getEl()
                      });
                  }
              }
          }

          function fixWheelEvent (e) {
              e.preventDefault();

              if (e.type == 'mousewheel') {
                  e.deltaY = -1 / 40 * e.wheelDelta;

                  if (e.wheelDeltaX) {
                      e.deltaX = -1 / 40 * e.wheelDeltaX;
                  }
              } else {
                  e.deltaX = 0;
                  e.deltaY = e.detail;
              }

              e = eventCtrl.fire('wheel', e);
          }

          nativeEvents = eventCtrl._nativeEvents;
          if (nativeEvents) {
        // Find event root element if it exists
              parents = eventCtrl.parents().toArray();
              parents.unshift(eventCtrl);
              for (i = 0, l = parents.length; !eventRootCtrl && i < l; i++) {
                  eventRootCtrl = parents[i]._eventsRoot;
              }

        // Event root wasn't found the use the root control
              if (!eventRootCtrl) {
                  eventRootCtrl = parents[parents.length - 1] || eventCtrl;
              }

        // Set the eventsRoot property on children that didn't have it
              eventCtrl._eventsRoot = eventRootCtrl;
              for (l = i, i = 0; i < l; i++) {
                  parents[i]._eventsRoot = eventRootCtrl;
              }

              var eventRootDelegates = eventRootCtrl._delegates;
              if (!eventRootDelegates) {
                  eventRootDelegates = eventRootCtrl._delegates = {};
              }

        // Bind native event delegates
              for (name in nativeEvents) {
                  if (!nativeEvents) {
                      return false;
                  }

                  if (name === 'wheel' && !hasWheelEventSupport) {
                      if (hasMouseWheelEventSupport) {
                          DomQuery(eventCtrl.getEl()).on('mousewheel', fixWheelEvent);
                      } else {
                          DomQuery(eventCtrl.getEl()).on('DOMMouseScroll', fixWheelEvent);
                      }

                      continue;
                  }

          // Special treatment for mousenter/mouseleave since these doesn't bubble
                  if (name === 'mouseenter' || name === 'mouseleave') {
            // Fake mousenter/mouseleave
                      if (!eventRootCtrl._hasMouseEnter) {
                          DomQuery(eventRootCtrl.getEl()).on('mouseleave', mouseLeaveHandler).on('mouseover', mouseEnterHandler);
                          eventRootCtrl._hasMouseEnter = 1;
                      }
                  } else if (!eventRootDelegates[name]) {
                      DomQuery(eventRootCtrl.getEl()).on(name, delegate);
                      eventRootDelegates[name] = true;
                  }

          // Remove the event once it's bound
                  nativeEvents[name] = false;
              }
          }
      }

      return Control;
  }
);

/**
 * Movable.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Movable mixin. Makes controls movable absolute and relative to other elements.
 *
 * @mixin tinymce.ui.Movable
 */
    define(
  'tinymce.ui.Movable',
        [
            'global!document',
            'global!window',
            'tinymce.ui.DomUtils'
        ],
  function (document, window, DomUtils) {
      'use strict';

      function calculateRelativePosition (ctrl, targetElm, rel) {
          var ctrlElm, pos, x, y, selfW, selfH, targetW, targetH, viewport, size;

          viewport = DomUtils.getViewPort();

      // Get pos of target
          pos = DomUtils.getPos(targetElm);
          x = pos.x;
          y = pos.y;

          if (ctrl.state.get('fixed') && DomUtils.getRuntimeStyle(document.body, 'position') == 'static') {
              x -= viewport.x;
              y -= viewport.y;
          }

      // Get size of self
          ctrlElm = ctrl.getEl();
          size = DomUtils.getSize(ctrlElm);
          selfW = size.width;
          selfH = size.height;

      // Get size of target
          size = DomUtils.getSize(targetElm);
          targetW = size.width;
          targetH = size.height;

      // Parse align string
          rel = (rel || '').split('');

      // Target corners
          if (rel[0] === 'b') {
              y += targetH;
          }

          if (rel[1] === 'r') {
              x += targetW;
          }

          if (rel[0] === 'c') {
              y += Math.round(targetH / 2);
          }

          if (rel[1] === 'c') {
              x += Math.round(targetW / 2);
          }

      // Self corners
          if (rel[3] === 'b') {
              y -= selfH;
          }

          if (rel[4] === 'r') {
              x -= selfW;
          }

          if (rel[3] === 'c') {
              y -= Math.round(selfH / 2);
          }

          if (rel[4] === 'c') {
              x -= Math.round(selfW / 2);
          }

          return {
              x: x,
              y: y,
              w: selfW,
              h: selfH
          };
      }

      return {
      /**
       * Tests various positions to get the most suitable one.
       *
       * @method testMoveRel
       * @param {DOMElement} elm Element to position against.
       * @param {Array} rels Array with relative positions.
       * @return {String} Best suitable relative position.
       */
          testMoveRel: function (elm, rels) {
              var viewPortRect = DomUtils.getViewPort();

              for (var i = 0; i < rels.length; i++) {
                  var pos = calculateRelativePosition(this, elm, rels[i]);

                  if (this.state.get('fixed')) {
                      if (pos.x > 0 && pos.x + pos.w < viewPortRect.w && pos.y > 0 && pos.y + pos.h < viewPortRect.h) {
                          return rels[i];
                      }
                  } else {
                      if (pos.x > viewPortRect.x && pos.x + pos.w < viewPortRect.w + viewPortRect.x &&
              pos.y > viewPortRect.y && pos.y + pos.h < viewPortRect.h + viewPortRect.y) {
                          return rels[i];
                      }
                  }
              }

              return rels[0];
          },

      /**
       * Move relative to the specified element.
       *
       * @method moveRel
       * @param {Element} elm Element to move relative to.
       * @param {String} rel Relative mode. For example: br-tl.
       * @return {tinymce.ui.Control} Current control instance.
       */
          moveRel: function (elm, rel) {
              if (typeof rel !== 'string') {
                  rel = this.testMoveRel(elm, rel);
              }

              var pos = calculateRelativePosition(this, elm, rel);
              return this.moveTo(pos.x, pos.y);
          },

      /**
       * Move by a relative x, y values.
       *
       * @method moveBy
       * @param {Number} dx Relative x position.
       * @param {Number} dy Relative y position.
       * @return {tinymce.ui.Control} Current control instance.
       */
          moveBy: function (dx, dy) {
              var self = this, rect = self.layoutRect();

              self.moveTo(rect.x + dx, rect.y + dy);

              return self;
          },

      /**
       * Move to absolute position.
       *
       * @method moveTo
       * @param {Number} x Absolute x position.
       * @param {Number} y Absolute y position.
       * @return {tinymce.ui.Control} Current control instance.
       */
          moveTo: function (x, y) {
              var self = this;

        // TODO: Move this to some global class
              function constrain (value, max, size) {
                  if (value < 0) {
                      return 0;
                  }

                  if (value + size > max) {
                      value = max - size;
                      return value < 0 ? 0 : value;
                  }

                  return value;
              }

              if (self.settings.constrainToViewport) {
                  var viewPortRect = DomUtils.getViewPort(window);
                  var layoutRect = self.layoutRect();

                  x = constrain(x, viewPortRect.w + viewPortRect.x, layoutRect.w);
                  y = constrain(y, viewPortRect.h + viewPortRect.y, layoutRect.h);
              }

              if (self.state.get('rendered')) {
                  self.layoutRect({ x: x, y: y }).repaint();
              } else {
                  self.settings.x = x;
                  self.settings.y = y;
              }

              self.fire('move', { x: x, y: y });

              return self;
          }
      };
  }
);
/**
 * Tooltip.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a tooltip instance.
 *
 * @-x-less ToolTip.less
 * @class tinymce.ui.ToolTip
 * @extends tinymce.ui.Control
 * @mixes tinymce.ui.Movable
 */
    define(
  'tinymce.ui.Tooltip',
        [
            'tinymce.ui.Control',
            'tinymce.ui.Movable'
        ],
  function (Control, Movable) {
      return Control.extend({
          Mixins: [Movable],

          Defaults: {
              classes: 'widget tooltip tooltip-n'
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, prefix = self.classPrefix;

              return (
          '<div id="' + self._id + '" class="' + self.classes + '" role="presentation">' +
          '<div class="' + prefix + 'tooltip-arrow"></div>' +
          '<div class="' + prefix + 'tooltip-inner">' + self.encode(self.state.get('text')) + '</div>' +
          '</div>'
              );
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:text', function (e) {
                  self.getEl().lastChild.innerHTML = self.encode(e.value);
              });

              return self._super();
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, style, rect;

              style = self.getEl().style;
              rect = self._layoutRect;

              style.left = rect.x + 'px';
              style.top = rect.y + 'px';
              style.zIndex = 0xFFFF + 0xFFFF;
          }
      });
  }
);
/**
 * Widget.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Widget base class a widget is a control that has a tooltip and some basic states.
 *
 * @class tinymce.ui.Widget
 * @extends tinymce.ui.Control
 */
    define(
  'tinymce.ui.Widget',
        [
            'tinymce.ui.Control',
            'tinymce.ui.Tooltip'
        ],
  function (Control, Tooltip) {
      'use strict';

      var tooltip;

      var Widget = Control.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} tooltip Tooltip text to display when hovering.
       * @setting {Boolean} autofocus True if the control should be focused when rendered.
       * @setting {String} text Text to display inside widget.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              settings = self.settings;
              self.canFocus = true;

              if (settings.tooltip && Widget.tooltips !== false) {
                  self.on('mouseenter', function (e) {
                      var tooltip = self.tooltip().moveTo(-0xFFFF);

                      if (e.control == self) {
                          var rel = tooltip.text(settings.tooltip).show().testMoveRel(self.getEl(), ['bc-tc', 'bc-tl', 'bc-tr']);

                          tooltip.classes.toggle('tooltip-n', rel == 'bc-tc');
                          tooltip.classes.toggle('tooltip-nw', rel == 'bc-tl');
                          tooltip.classes.toggle('tooltip-ne', rel == 'bc-tr');

                          tooltip.moveRel(self.getEl(), rel);
                      } else {
                          tooltip.hide();
                      }
                  });

                  self.on('mouseleave mousedown click', function () {
                      self.tooltip().hide();
                  });
              }

              self.aria('label', settings.ariaLabel || settings.tooltip);
          },

      /**
       * Returns the current tooltip instance.
       *
       * @method tooltip
       * @return {tinymce.ui.Tooltip} Tooltip instance.
       */
          tooltip: function () {
              if (!tooltip) {
                  tooltip = new Tooltip({ type: 'tooltip' });
                  tooltip.renderTo();
              }

              return tooltip;
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this, settings = self.settings;

              self._super();

              if (!self.parent() && (settings.width || settings.height)) {
                  self.initLayoutRect();
                  self.repaint();
              }

              if (settings.autofocus) {
                  self.focus();
              }
          },

          bindStates: function () {
              var self = this;

              function disable (state) {
                  self.aria('disabled', state);
                  self.classes.toggle('disabled', state);
              }

              function active (state) {
                  self.aria('pressed', state);
                  self.classes.toggle('active', state);
              }

              self.state.on('change:disabled', function (e) {
                  disable(e.value);
              });

              self.state.on('change:active', function (e) {
                  active(e.value);
              });

              if (self.state.get('disabled')) {
                  disable(true);
              }

              if (self.state.get('active')) {
                  active(true);
              }

              return self._super();
          },

      /**
       * Removes the current control from DOM and from UI collections.
       *
       * @method remove
       * @return {tinymce.ui.Control} Current control instance.
       */
          remove: function () {
              this._super();

              if (tooltip) {
                  tooltip.remove();
                  tooltip = null;
              }
          }
      });

      return Widget;
  }
);

/**
 * Progress.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Progress control.
 *
 * @-x-less Progress.less
 * @class tinymce.ui.Progress
 * @extends tinymce.ui.Control
 */
    define(
  'tinymce.ui.Progress',
        [
            'tinymce.ui.Widget'
        ],
  function (Widget) {
      'use strict';

      return Widget.extend({
          Defaults: {
              value: 0
          },

          init: function (settings) {
              var self = this;

              self._super(settings);
              self.classes.add('progress');

              if (!self.settings.filter) {
                  self.settings.filter = function (value) {
                      return Math.round(value);
                  };
              }
          },

          renderHtml: function () {
              var self = this, id = self._id, prefix = this.classPrefix;

              return (
          '<div id="' + id + '" class="' + self.classes + '">' +
          '<div class="' + prefix + 'bar-container">' +
          '<div class="' + prefix + 'bar"></div>' +
          '</div>' +
          '<div class="' + prefix + 'text">0%</div>' +
          '</div>'
              );
          },

          postRender: function () {
              var self = this;

              self._super();
              self.value(self.settings.value);

              return self;
          },

          bindStates: function () {
              var self = this;

              function setValue (value) {
                  value = self.settings.filter(value);
                  self.getEl().lastChild.innerHTML = value + '%';
                  self.getEl().firstChild.firstChild.style.width = value + '%';
              }

              self.state.on('change:value', function (e) {
                  setValue(e.value);
              });

              setValue(self.state.get('value'));

              return self._super();
          }
      });
  }
);
/**
 * Notification.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a notification instance.
 *
 * @-x-less Notification.less
 * @class tinymce.ui.Notification
 * @extends tinymce.ui.Container
 * @mixes tinymce.ui.Movable
 */
    define(
  'tinymce.ui.Notification',
        [
            'tinymce.ui.Control',
            'tinymce.ui.Movable',
            'tinymce.ui.Progress',
            'tinymce.core.util.Delay'
        ],
  function (Control, Movable, Progress, Delay) {
      var updateLiveRegion = function (ctx, text) {
          ctx.getEl().lastChild.textContent = text + (ctx.progressBar ? ' ' + ctx.progressBar.value() + '%' : '');
      };

      return Control.extend({
          Mixins: [Movable],

          Defaults: {
              classes: 'widget notification'
          },

          init: function (settings) {
              var self = this;

              self._super(settings);

              self.maxWidth = settings.maxWidth;

              if (settings.text) {
                  self.text(settings.text);
              }

              if (settings.icon) {
                  self.icon = settings.icon;
              }

              if (settings.color) {
                  self.color = settings.color;
              }

              if (settings.type) {
                  self.classes.add('notification-' + settings.type);
              }

              if (settings.timeout && (settings.timeout < 0 || settings.timeout > 0) && !settings.closeButton) {
                  self.closeButton = false;
              } else {
                  self.classes.add('has-close');
                  self.closeButton = true;
              }

              if (settings.progressBar) {
                  self.progressBar = new Progress();
              }

              self.on('click', function (e) {
                  if (e.target.className.indexOf(self.classPrefix + 'close') != -1) {
                      self.close();
                  }
              });
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, prefix = self.classPrefix, icon = '', closeButton = '', progressBar = '', notificationStyle = '';

              if (self.icon) {
                  icon = '<i class="' + prefix + 'ico' + ' ' + prefix + 'i-' + self.icon + '"></i>';
              }

              notificationStyle = ' style="max-width: ' + self.maxWidth + 'px;' + (self.color ? 'background-color: ' + self.color + ';"' : '"');

              if (self.closeButton) {
                  closeButton = '<button type="button" class="' + prefix + 'close" aria-hidden="true">\u00d7</button>';
              }

              if (self.progressBar) {
                  progressBar = self.progressBar.renderHtml();
              }

              return (
          '<div id="' + self._id + '" class="' + self.classes + '"' + notificationStyle + ' role="presentation">' +
          icon +
          '<div class="' + prefix + 'notification-inner">' + self.state.get('text') + '</div>' +
          progressBar +
          closeButton +
          '<div style="clip: rect(1px, 1px, 1px, 1px);height: 1px;overflow: hidden;position: absolute;width: 1px;"' +
          ' aria-live="assertive" aria-relevant="additions" aria-atomic="true"></div>' +
          '</div>'
              );
          },

          postRender: function () {
              var self = this;

              Delay.setTimeout(function () {
                  self.$el.addClass(self.classPrefix + 'in');
                  updateLiveRegion(self, self.state.get('text'));
              }, 100);

              return self._super();
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:text', function (e) {
                  self.getEl().firstChild.innerHTML = e.value;
                  updateLiveRegion(self, e.value);
              });
              if (self.progressBar) {
                  self.progressBar.bindStates();
                  self.progressBar.state.on('change:value', function (e) {
                      updateLiveRegion(self, self.state.get('text'));
                  });
              }
              return self._super();
          },

          close: function () {
              var self = this;

              if (!self.fire('close').isDefaultPrevented()) {
                  self.remove();
              }

              return self;
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, style, rect;

              style = self.getEl().style;
              rect = self._layoutRect;

              style.left = rect.x + 'px';
              style.top = rect.y + 'px';

        // Hardcoded arbitrary z-value because we want the
        // notifications under the other windows
              style.zIndex = 0xFFFF - 1;
          }
      });
  }
);
/**
 * NotificationManagerImpl.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.NotificationManagerImpl',
        [
            'ephox.katamari.api.Arr',
            'global!setTimeout',
            'tinymce.core.util.Tools',
            'tinymce.ui.DomUtils',
            'tinymce.ui.Notification'
        ],
  function (Arr, setTimeout, Tools, DomUtils, Notification) {
      return function (editor) {
          var getEditorContainer = function (editor) {
              return editor.inline ? editor.getElement() : editor.getContentAreaContainer();
          };

          var getContainerWidth = function () {
              var container = getEditorContainer(editor);
              return DomUtils.getSize(container).width;
          };

      // Since the viewport will change based on the present notifications, we need to move them all to the
      // top left of the viewport to give an accurate size measurement so we can position them later.
          var prePositionNotifications = function (notifications) {
              Arr.each(notifications, function (notification) {
                  notification.moveTo(0, 0);
              });
          };

          var positionNotifications = function (notifications) {
              if (notifications.length > 0) {
                  var firstItem = notifications.slice(0, 1)[0];
                  var container = getEditorContainer(editor);
                  firstItem.moveRel(container, 'tc-tc');
                  Arr.each(notifications, function (notification, index) {
                      if (index > 0) {
                          notification.moveRel(notifications[index - 1].getEl(), 'bc-tc');
                      }
                  });
              }
          };

          var reposition = function (notifications) {
              prePositionNotifications(notifications);
              positionNotifications(notifications);
          };

          var open = function (args, closeCallback) {
              var extendedArgs = Tools.extend(args, { maxWidth: getContainerWidth() });
              var notif = new Notification(extendedArgs);
              notif.args = extendedArgs;

        // If we have a timeout value
              if (extendedArgs.timeout > 0) {
                  notif.timer = setTimeout(function () {
                      notif.close();
                      closeCallback();
                  }, extendedArgs.timeout);
              }

              notif.on('close', function () {
                  closeCallback();
              });

              notif.renderTo();

              return notif;
          };

          var close = function (notification) {
              notification.close();
          };

          var getArgs = function (notification) {
              return notification.args;
          };

          return {
              open: open,
              close: close,
              reposition: reposition,
              getArgs: getArgs
          };
      };
  }
);

/**
 * DragHelper.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Drag/drop helper class.
 *
 * @example
 * var dragHelper = new tinymce.ui.DragHelper('mydiv', {
 *     start: function(document, window, evt) {
 *     },
 *
 *     drag: function(evt) {
 *     },
 *
 *     end: function(evt) {
 *     }
 * });
 *
 * @class tinymce.ui.DragHelper
 */
    define(
  'tinymce.ui.DragHelper',
        [
            'global!document',
            'global!window',
            'tinymce.core.dom.DomQuery'
        ],
  function (document, window, DomQuery) {
      'use strict';

      function getDocumentSize (doc) {
          var documentElement, body, scrollWidth, clientWidth;
          var offsetWidth, scrollHeight, clientHeight, offsetHeight, max = Math.max;

          documentElement = doc.documentElement;
          body = doc.body;

          scrollWidth = max(documentElement.scrollWidth, body.scrollWidth);
          clientWidth = max(documentElement.clientWidth, body.clientWidth);
          offsetWidth = max(documentElement.offsetWidth, body.offsetWidth);

          scrollHeight = max(documentElement.scrollHeight, body.scrollHeight);
          clientHeight = max(documentElement.clientHeight, body.clientHeight);
          offsetHeight = max(documentElement.offsetHeight, body.offsetHeight);

          return {
              width: scrollWidth < offsetWidth ? clientWidth : scrollWidth,
              height: scrollHeight < offsetHeight ? clientHeight : scrollHeight
          };
      }

      function updateWithTouchData (e) {
          var keys, i;

          if (e.changedTouches) {
              keys = 'screenX screenY pageX pageY clientX clientY'.split(' ');
              for (i = 0; i < keys.length; i++) {
                  e[keys[i]] = e.changedTouches[0][keys[i]];
              }
          }
      }

      return function (id, settings) {
          var $eventOverlay, doc = settings.document || document, downButton, start, stop, drag, startX, startY;

          settings = settings || {};

          function getHandleElm () {
              return doc.getElementById(settings.handle || id);
          }

          start = function (e) {
              var docSize = getDocumentSize(doc), handleElm, cursor;

              updateWithTouchData(e);

              e.preventDefault();
              downButton = e.button;
              handleElm = getHandleElm();
              startX = e.screenX;
              startY = e.screenY;

        // Grab cursor from handle so we can place it on overlay
              if (window.getComputedStyle) {
                  cursor = window.getComputedStyle(handleElm, null).getPropertyValue('cursor');
              } else {
                  cursor = handleElm.runtimeStyle.cursor;
              }

              $eventOverlay = DomQuery('<div></div>').css({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: docSize.width,
                  height: docSize.height,
                  zIndex: 0x7FFFFFFF,
                  opacity: 0.0001,
                  cursor: cursor
              }).appendTo(doc.body);

              DomQuery(doc).on('mousemove touchmove', drag).on('mouseup touchend', stop);

              settings.start(e);
          };

          drag = function (e) {
              updateWithTouchData(e);

              if (e.button !== downButton) {
                  return stop(e);
              }

              e.deltaX = e.screenX - startX;
              e.deltaY = e.screenY - startY;

              e.preventDefault();
              settings.drag(e);
          };

          stop = function (e) {
              updateWithTouchData(e);

              DomQuery(doc).off('mousemove touchmove', drag).off('mouseup touchend', stop);

              $eventOverlay.remove();

              if (settings.stop) {
                  settings.stop(e);
              }
          };

      /**
       * Destroys the drag/drop helper instance.
       *
       * @method destroy
       */
          this.destroy = function () {
              DomQuery(getHandleElm()).off();
          };

          DomQuery(getHandleElm()).on('mousedown touchstart', start);
      };
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.ui.Factory',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.ui.Factory');
  }
);

/**
 * KeyboardNavigation.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class handles keyboard navigation of controls and elements.
 *
 * @class tinymce.ui.KeyboardNavigation
 */
    define(
  'tinymce.ui.KeyboardNavigation',
        [
            'global!document'
        ],
  function (document) {
      'use strict';

      var hasTabstopData = function (elm) {
          return !!elm.getAttribute('data-mce-tabstop');
      };

    /**
     * This class handles all keyboard navigation for WAI-ARIA support. Each root container
     * gets an instance of this class.
     *
     * @constructor
     */
      return function (settings) {
          var root = settings.root, focusedElement, focusedControl;

          function isElement (node) {
              return node && node.nodeType === 1;
          }

          try {
              focusedElement = document.activeElement;
          } catch (ex) {
        // IE sometimes fails to return a proper element
              focusedElement = document.body;
          }

          focusedControl = root.getParentCtrl(focusedElement);

      /**
       * Returns the currently focused elements wai aria role of the currently
       * focused element or specified element.
       *
       * @private
       * @param {Element} elm Optional element to get role from.
       * @return {String} Role of specified element.
       */
          function getRole (elm) {
              elm = elm || focusedElement;

              if (isElement(elm)) {
                  return elm.getAttribute('role');
              }

              return null;
          }

      /**
       * Returns the wai role of the parent element of the currently
       * focused element or specified element.
       *
       * @private
       * @param {Element} elm Optional element to get parent role from.
       * @return {String} Role of the first parent that has a role.
       */
          function getParentRole (elm) {
              var role, parent = elm || focusedElement;

              while ((parent = parent.parentNode)) {
                  if ((role = getRole(parent))) {
                      return role;
                  }
              }
          }

      /**
       * Returns a wai aria property by name for example aria-selected.
       *
       * @private
       * @param {String} name Name of the aria property to get for example "disabled".
       * @return {String} Aria property value.
       */
          function getAriaProp (name) {
              var elm = focusedElement;

              if (isElement(elm)) {
                  return elm.getAttribute('aria-' + name);
              }
          }

      /**
       * Is the element a text input element or not.
       *
       * @private
       * @param {Element} elm Element to check if it's an text input element or not.
       * @return {Boolean} True/false if the element is a text element or not.
       */
          function isTextInputElement (elm) {
              var tagName = elm.tagName.toUpperCase();

        // Notice: since type can be "email" etc we don't check the type
        // So all input elements gets treated as text input elements
              return tagName == 'INPUT' || tagName == 'TEXTAREA' || tagName == 'SELECT';
          }

      /**
       * Returns true/false if the specified element can be focused or not.
       *
       * @private
       * @param {Element} elm DOM element to check if it can be focused or not.
       * @return {Boolean} True/false if the element can have focus.
       */
          function canFocus (elm) {
              if (isTextInputElement(elm) && !elm.hidden) {
                  return true;
              }

              if (hasTabstopData(elm)) {
                  return true;
              }

              if (/^(button|menuitem|checkbox|tab|menuitemcheckbox|option|gridcell|slider)$/.test(getRole(elm))) {
                  return true;
              }

              return false;
          }

      /**
       * Returns an array of focusable visible elements within the specified container element.
       *
       * @private
       * @param {Element} elm DOM element to find focusable elements within.
       * @return {Array} Array of focusable elements.
       */
          function getFocusElements (elm) {
              var elements = [];

              function collect (elm) {
                  if (elm.nodeType != 1 || elm.style.display == 'none' || elm.disabled) {
                      return;
                  }

                  if (canFocus(elm)) {
                      elements.push(elm);
                  }

                  for (var i = 0; i < elm.childNodes.length; i++) {
                      collect(elm.childNodes[i]);
                  }
              }

              collect(elm || root.getEl());

              return elements;
          }

      /**
       * Returns the navigation root control for the specified control. The navigation root
       * is the control that the keyboard navigation gets scoped to for example a menubar or toolbar group.
       * It will look for parents of the specified target control or the currently focused control if this option is omitted.
       *
       * @private
       * @param {tinymce.ui.Control} targetControl Optional target control to find root of.
       * @return {tinymce.ui.Control} Navigation root control.
       */
          function getNavigationRoot (targetControl) {
              var navigationRoot, controls;

              targetControl = targetControl || focusedControl;
              controls = targetControl.parents().toArray();
              controls.unshift(targetControl);

              for (var i = 0; i < controls.length; i++) {
                  navigationRoot = controls[i];

                  if (navigationRoot.settings.ariaRoot) {
                      break;
                  }
              }

              return navigationRoot;
          }

      /**
       * Focuses the first item in the specified targetControl element or the last aria index if the
       * navigation root has the ariaRemember option enabled.
       *
       * @private
       * @param {tinymce.ui.Control} targetControl Target control to focus the first item in.
       */
          function focusFirst (targetControl) {
              var navigationRoot = getNavigationRoot(targetControl);
              var focusElements = getFocusElements(navigationRoot.getEl());

              if (navigationRoot.settings.ariaRemember && 'lastAriaIndex' in navigationRoot) {
                  moveFocusToIndex(navigationRoot.lastAriaIndex, focusElements);
              } else {
                  moveFocusToIndex(0, focusElements);
              }
          }

      /**
       * Moves the focus to the specified index within the elements list.
       * This will scope the index to the size of the element list if it changed.
       *
       * @private
       * @param {Number} idx Specified index to move to.
       * @param {Array} elements Array with dom elements to move focus within.
       * @return {Number} Input index or a changed index if it was out of range.
       */
          function moveFocusToIndex (idx, elements) {
              if (idx < 0) {
                  idx = elements.length - 1;
              } else if (idx >= elements.length) {
                  idx = 0;
              }

              if (elements[idx]) {
                  elements[idx].focus();
              }

              return idx;
          }

      /**
       * Moves the focus forwards or backwards.
       *
       * @private
       * @param {Number} dir Direction to move in positive means forward, negative means backwards.
       * @param {Array} elements Optional array of elements to move within defaults to the current navigation roots elements.
       */
          function moveFocus (dir, elements) {
              var idx = -1, navigationRoot = getNavigationRoot();

              elements = elements || getFocusElements(navigationRoot.getEl());

              for (var i = 0; i < elements.length; i++) {
                  if (elements[i] === focusedElement) {
                      idx = i;
                  }
              }

              idx += dir;
              navigationRoot.lastAriaIndex = moveFocusToIndex(idx, elements);
          }

      /**
       * Moves the focus to the left this is called by the left key.
       *
       * @private
       */
          function left () {
              var parentRole = getParentRole();

              if (parentRole == 'tablist') {
                  moveFocus(-1, getFocusElements(focusedElement.parentNode));
              } else if (focusedControl.parent().submenu) {
                  cancel();
              } else {
                  moveFocus(-1);
              }
          }

      /**
       * Moves the focus to the right this is called by the right key.
       *
       * @private
       */
          function right () {
              var role = getRole(), parentRole = getParentRole();

              if (parentRole == 'tablist') {
                  moveFocus(1, getFocusElements(focusedElement.parentNode));
              } else if (role == 'menuitem' && parentRole == 'menu' && getAriaProp('haspopup')) {
                  enter();
              } else {
                  moveFocus(1);
              }
          }

      /**
       * Moves the focus to the up this is called by the up key.
       *
       * @private
       */
          function up () {
              moveFocus(-1);
          }

      /**
       * Moves the focus to the up this is called by the down key.
       *
       * @private
       */
          function down () {
              var role = getRole(), parentRole = getParentRole();

              if (role == 'menuitem' && parentRole == 'menubar') {
                  enter();
              } else if (role == 'button' && getAriaProp('haspopup')) {
                  enter({ key: 'down' });
              } else {
                  moveFocus(1);
              }
          }

      /**
       * Moves the focus to the next item or previous item depending on shift key.
       *
       * @private
       * @param {DOMEvent} e DOM event object.
       */
          function tab (e) {
              var parentRole = getParentRole();

              if (parentRole == 'tablist') {
                  var elm = getFocusElements(focusedControl.getEl('body'))[0];

                  if (elm) {
                      elm.focus();
                  }
              } else {
                  moveFocus(e.shiftKey ? -1 : 1);
              }
          }

      /**
       * Calls the cancel event on the currently focused control. This is normally done using the Esc key.
       *
       * @private
       */
          function cancel () {
              focusedControl.fire('cancel');
          }

      /**
       * Calls the click event on the currently focused control. This is normally done using the Enter/Space keys.
       *
       * @private
       * @param {Object} aria Optional aria data to pass along with the enter event.
       */
          function enter (aria) {
              aria = aria || {};
              focusedControl.fire('click', { target: focusedElement, aria: aria });
          }

          root.on('keydown', function (e) {
              function handleNonTabOrEscEvent (e, handler) {
          // Ignore non tab keys for text elements
                  if (isTextInputElement(focusedElement) || hasTabstopData(focusedElement)) {
                      return;
                  }

                  if (getRole(focusedElement) === 'slider') {
                      return;
                  }

                  if (handler(e) !== false) {
                      e.preventDefault();
                  }
              }

              if (e.isDefaultPrevented()) {
                  return;
              }

              switch (e.keyCode) {
                  case 37: // DOM_VK_LEFT
                      handleNonTabOrEscEvent(e, left);
                      break;

                  case 39: // DOM_VK_RIGHT
                      handleNonTabOrEscEvent(e, right);
                      break;

                  case 38: // DOM_VK_UP
                      handleNonTabOrEscEvent(e, up);
                      break;

                  case 40: // DOM_VK_DOWN
                      handleNonTabOrEscEvent(e, down);
                      break;

                  case 27: // DOM_VK_ESCAPE
                      cancel();
                      break;

                  case 14: // DOM_VK_ENTER
                  case 13: // DOM_VK_RETURN
                  case 32: // DOM_VK_SPACE
                      handleNonTabOrEscEvent(e, enter);
                      break;

                  case 9: // DOM_VK_TAB
                      if (tab(e) !== false) {
                          e.preventDefault();
                      }
                      break;
              }
          });

          root.on('focusin', function (e) {
              focusedElement = e.target;
              focusedControl = e.control;
          });

          return {
              focusFirst: focusFirst
          };
      };
  }
);
/**
 * Container.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Container control. This is extended by all controls that can have
 * children such as panels etc. You can also use this class directly as an
 * generic container instance. The container doesn't have any specific role or style.
 *
 * @-x-less Container.less
 * @class tinymce.ui.Container
 * @extends tinymce.ui.Control
 */
    define(
  'tinymce.ui.Container',
        [
            'tinymce.ui.Control',
            'tinymce.ui.Collection',
            'tinymce.ui.Selector',
            'tinymce.core.ui.Factory',
            'tinymce.ui.KeyboardNavigation',
            'tinymce.core.util.Tools',
            'tinymce.core.dom.DomQuery',
            'tinymce.ui.ClassList',
            'tinymce.ui.ReflowQueue'
        ],
  function (Control, Collection, Selector, Factory, KeyboardNavigation, Tools, $, ClassList, ReflowQueue) {
      'use strict';

      var selectorCache = {};

      return Control.extend({
      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Array} items Items to add to container in JSON format or control instances.
       * @setting {String} layout Layout manager by name to use.
       * @setting {Object} defaults Default settings to apply to all items.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              settings = self.settings;

              if (settings.fixed) {
                  self.state.set('fixed', true);
              }

              self._items = new Collection();

              if (self.isRtl()) {
                  self.classes.add('rtl');
              }

              self.bodyClasses = new ClassList(function () {
                  if (self.state.get('rendered')) {
                      self.getEl('body').className = this.toString();
                  }
              });
              self.bodyClasses.prefix = self.classPrefix;

              self.classes.add('container');
              self.bodyClasses.add('container-body');

              if (settings.containerCls) {
                  self.classes.add(settings.containerCls);
              }

              self._layout = Factory.create((settings.layout || '') + 'layout');

              if (self.settings.items) {
                  self.add(self.settings.items);
              } else {
                  self.add(self.render());
              }

        // TODO: Fix this!
              self._hasBody = true;
          },

      /**
       * Returns a collection of child items that the container currently have.
       *
       * @method items
       * @return {tinymce.ui.Collection} Control collection direct child controls.
       */
          items: function () {
              return this._items;
          },

      /**
       * Find child controls by selector.
       *
       * @method find
       * @param {String} selector Selector CSS pattern to find children by.
       * @return {tinymce.ui.Collection} Control collection with child controls.
       */
          find: function (selector) {
              selector = selectorCache[selector] = selectorCache[selector] || new Selector(selector);

              return selector.find(this);
          },

      /**
       * Adds one or many items to the current container. This will create instances of
       * the object representations if needed.
       *
       * @method add
       * @param {Array/Object/tinymce.ui.Control} items Array or item that will be added to the container.
       * @return {tinymce.ui.Collection} Current collection control.
       */
          add: function (items) {
              var self = this;

              self.items().add(self.create(items)).parent(self);

              return self;
          },

      /**
       * Focuses the current container instance. This will look
       * for the first control in the container and focus that.
       *
       * @method focus
       * @param {Boolean} keyboard Optional true/false if the focus was a keyboard focus or not.
       * @return {tinymce.ui.Collection} Current instance.
       */
          focus: function (keyboard) {
              var self = this, focusCtrl, keyboardNav, items;

              if (keyboard) {
                  keyboardNav = self.keyboardNav || self.parents().eq(-1)[0].keyboardNav;

                  if (keyboardNav) {
                      keyboardNav.focusFirst(self);
                      return;
                  }
              }

              items = self.find('*');

        // TODO: Figure out a better way to auto focus alert dialog buttons
              if (self.statusbar) {
                  items.add(self.statusbar.items());
              }

              items.each(function (ctrl) {
                  if (ctrl.settings.autofocus) {
                      focusCtrl = null;
                      return false;
                  }

                  if (ctrl.canFocus) {
                      focusCtrl = focusCtrl || ctrl;
                  }
              });

              if (focusCtrl) {
                  focusCtrl.focus();
              }

              return self;
          },

      /**
       * Replaces the specified child control with a new control.
       *
       * @method replace
       * @param {tinymce.ui.Control} oldItem Old item to be replaced.
       * @param {tinymce.ui.Control} newItem New item to be inserted.
       */
          replace: function (oldItem, newItem) {
              var ctrlElm, items = this.items(), i = items.length;

        // Replace the item in collection
              while (i--) {
                  if (items[i] === oldItem) {
                      items[i] = newItem;
                      break;
                  }
              }

              if (i >= 0) {
          // Remove new item from DOM
                  ctrlElm = newItem.getEl();
                  if (ctrlElm) {
                      ctrlElm.parentNode.removeChild(ctrlElm);
                  }

          // Remove old item from DOM
                  ctrlElm = oldItem.getEl();
                  if (ctrlElm) {
                      ctrlElm.parentNode.removeChild(ctrlElm);
                  }
              }

        // Adopt the item
              newItem.parent(this);
          },

      /**
       * Creates the specified items. If any of the items is plain JSON style objects
       * it will convert these into real tinymce.ui.Control instances.
       *
       * @method create
       * @param {Array} items Array of items to convert into control instances.
       * @return {Array} Array with control instances.
       */
          create: function (items) {
              var self = this, settings, ctrlItems = [];

        // Non array structure, then force it into an array
              if (!Tools.isArray(items)) {
                  items = [items];
              }

        // Add default type to each child control
              Tools.each(items, function (item) {
                  if (item) {
            // Construct item if needed
                      if (!(item instanceof Control)) {
              // Name only then convert it to an object
                          if (typeof item === 'string') {
                              item = { type: item };
                          }

              // Create control instance based on input settings and default settings
                          settings = Tools.extend({}, self.settings.defaults, item);
                          item.type = settings.type = settings.type || item.type || self.settings.defaultType ||
                (settings.defaults ? settings.defaults.type : null);
                          item = Factory.create(settings);
                      }

                      ctrlItems.push(item);
                  }
              });

              return ctrlItems;
          },

      /**
       * Renders new control instances.
       *
       * @private
       */
          renderNew: function () {
              var self = this;

        // Render any new items
              self.items().each(function (ctrl, index) {
                  var containerElm;

                  ctrl.parent(self);

                  if (!ctrl.state.get('rendered')) {
                      containerElm = self.getEl('body');

            // Insert or append the item
                      if (containerElm.hasChildNodes() && index <= containerElm.childNodes.length - 1) {
                          $(containerElm.childNodes[index]).before(ctrl.renderHtml());
                      } else {
                          $(containerElm).append(ctrl.renderHtml());
                      }

                      ctrl.postRender();
                      ReflowQueue.add(ctrl);
                  }
              });

              self._layout.applyClasses(self.items().filter(':visible'));
              self._lastRect = null;

              return self;
          },

      /**
       * Appends new instances to the current container.
       *
       * @method append
       * @param {Array/tinymce.ui.Collection} items Array if controls to append.
       * @return {tinymce.ui.Container} Current container instance.
       */
          append: function (items) {
              return this.add(items).renderNew();
          },

      /**
       * Prepends new instances to the current container.
       *
       * @method prepend
       * @param {Array/tinymce.ui.Collection} items Array if controls to prepend.
       * @return {tinymce.ui.Container} Current container instance.
       */
          prepend: function (items) {
              var self = this;

              self.items().set(self.create(items).concat(self.items().toArray()));

              return self.renderNew();
          },

      /**
       * Inserts an control at a specific index.
       *
       * @method insert
       * @param {Array/tinymce.ui.Collection} items Array if controls to insert.
       * @param {Number} index Index to insert controls at.
       * @param {Boolean} [before=false] Inserts controls before the index.
       */
          insert: function (items, index, before) {
              var self = this, curItems, beforeItems, afterItems;

              items = self.create(items);
              curItems = self.items();

              if (!before && index < curItems.length - 1) {
                  index += 1;
              }

              if (index >= 0 && index < curItems.length) {
                  beforeItems = curItems.slice(0, index).toArray();
                  afterItems = curItems.slice(index).toArray();
                  curItems.set(beforeItems.concat(items, afterItems));
              }

              return self.renderNew();
          },

      /**
       * Populates the form fields from the specified JSON data object.
       *
       * Control items in the form that matches the data will have it's value set.
       *
       * @method fromJSON
       * @param {Object} data JSON data object to set control values by.
       * @return {tinymce.ui.Container} Current form instance.
       */
          fromJSON: function (data) {
              var self = this;

              for (var name in data) {
                  self.find('#' + name).value(data[name]);
              }

              return self;
          },

      /**
       * Serializes the form into a JSON object by getting all items
       * that has a name and a value.
       *
       * @method toJSON
       * @return {Object} JSON object with form data.
       */
          toJSON: function () {
              var self = this, data = {};

              self.find('*').each(function (ctrl) {
                  var name = ctrl.name(), value = ctrl.value();

                  if (name && typeof value !== 'undefined') {
                      data[name] = value;
                  }
              });

              return data;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, role = this.settings.role;

              self.preRender();
              layout.preRender(self);

              return (
          '<div id="' + self._id + '" class="' + self.classes + '"' + (role ? ' role="' + this.settings.role + '"' : '') + '>' +
          '<div id="' + self._id + '-body" class="' + self.bodyClasses + '">' +
          (self.settings.html || '') + layout.renderHtml(self) +
          '</div>' +
          '</div>'
              );
          },

      /**
       * Post render method. Called after the control has been rendered to the target.
       *
       * @method postRender
       * @return {tinymce.ui.Container} Current combobox instance.
       */
          postRender: function () {
              var self = this, box;

              self.items().exec('postRender');
              self._super();

              self._layout.postRender(self);
              self.state.set('rendered', true);

              if (self.settings.style) {
                  self.$el.css(self.settings.style);
              }

              if (self.settings.border) {
                  box = self.borderBox;
                  self.$el.css({
                      'border-top-width': box.top,
                      'border-right-width': box.right,
                      'border-bottom-width': box.bottom,
                      'border-left-width': box.left
                  });
              }

              if (!self.parent()) {
                  self.keyboardNav = new KeyboardNavigation({
                      root: self
                  });
              }

              return self;
          },

      /**
       * Initializes the current controls layout rect.
       * This will be executed by the layout managers to determine the
       * default minWidth/minHeight etc.
       *
       * @method initLayoutRect
       * @return {Object} Layout rect instance.
       */
          initLayoutRect: function () {
              var self = this, layoutRect = self._super();

        // Recalc container size by asking layout manager
              self._layout.recalc(self);

              return layoutRect;
          },

      /**
       * Recalculates the positions of the controls in the current container.
       * This is invoked by the reflow method and shouldn't be called directly.
       *
       * @method recalc
       */
          recalc: function () {
              var self = this, rect = self._layoutRect, lastRect = self._lastRect;

              if (!lastRect || lastRect.w != rect.w || lastRect.h != rect.h) {
                  self._layout.recalc(self);
                  rect = self.layoutRect();
                  self._lastRect = { x: rect.x, y: rect.y, w: rect.w, h: rect.h };
                  return true;
              }
          },

      /**
       * Reflows the current container and it's children and possible parents.
       * This should be used after you for example append children to the current control so
       * that the layout managers know that they need to reposition everything.
       *
       * @example
       * container.append({type: 'button', text: 'My button'}).reflow();
       *
       * @method reflow
       * @return {tinymce.ui.Container} Current container instance.
       */
          reflow: function () {
              var i;

              ReflowQueue.remove(this);

              if (this.visible()) {
                  Control.repaintControls = [];
                  Control.repaintControls.map = {};

                  this.recalc();
                  i = Control.repaintControls.length;

                  while (i--) {
                      Control.repaintControls[i].repaint();
                  }

          // TODO: Fix me!
                  if (this.settings.layout !== 'flow' && this.settings.layout !== 'stack') {
                      this.repaint();
                  }

                  Control.repaintControls = [];
              }

              return this;
          }
      });
  }
);
/**
 * Scrollable.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This mixin makes controls scrollable using custom scrollbars.
 *
 * @-x-less Scrollable.less
 * @mixin tinymce.ui.Scrollable
 */
    define(
  'tinymce.ui.Scrollable',
        [
            'tinymce.core.dom.DomQuery',
            'tinymce.ui.DragHelper'
        ],
  function ($, DragHelper) {
      'use strict';

      return {
          init: function () {
              var self = this;
              self.on('repaint', self.renderScroll);
          },

          renderScroll: function () {
              var self = this, margin = 2;

              function repaintScroll () {
                  var hasScrollH, hasScrollV, bodyElm;

                  function repaintAxis (axisName, posName, sizeName, contentSizeName, hasScroll, ax) {
                      var containerElm, scrollBarElm, scrollThumbElm;
                      var containerSize, scrollSize, ratio, rect;
                      var posNameLower, sizeNameLower;

                      scrollBarElm = self.getEl('scroll' + axisName);
                      if (scrollBarElm) {
                          posNameLower = posName.toLowerCase();
                          sizeNameLower = sizeName.toLowerCase();

                          $(self.getEl('absend')).css(posNameLower, self.layoutRect()[contentSizeName] - 1);

                          if (!hasScroll) {
                              $(scrollBarElm).css('display', 'none');
                              return;
                          }

                          $(scrollBarElm).css('display', 'block');
                          containerElm = self.getEl('body');
                          scrollThumbElm = self.getEl('scroll' + axisName + 't');
                          containerSize = containerElm['client' + sizeName] - (margin * 2);
                          containerSize -= hasScrollH && hasScrollV ? scrollBarElm['client' + ax] : 0;
                          scrollSize = containerElm['scroll' + sizeName];
                          ratio = containerSize / scrollSize;

                          rect = {};
                          rect[posNameLower] = containerElm['offset' + posName] + margin;
                          rect[sizeNameLower] = containerSize;
                          $(scrollBarElm).css(rect);

                          rect = {};
                          rect[posNameLower] = containerElm['scroll' + posName] * ratio;
                          rect[sizeNameLower] = containerSize * ratio;
                          $(scrollThumbElm).css(rect);
                      }
                  }

                  bodyElm = self.getEl('body');
                  hasScrollH = bodyElm.scrollWidth > bodyElm.clientWidth;
                  hasScrollV = bodyElm.scrollHeight > bodyElm.clientHeight;

                  repaintAxis('h', 'Left', 'Width', 'contentW', hasScrollH, 'Height');
                  repaintAxis('v', 'Top', 'Height', 'contentH', hasScrollV, 'Width');
              }

              function addScroll () {
                  function addScrollAxis (axisName, posName, sizeName, deltaPosName, ax) {
                      var scrollStart, axisId = self._id + '-scroll' + axisName, prefix = self.classPrefix;

                      $(self.getEl()).append(
              '<div id="' + axisId + '" class="' + prefix + 'scrollbar ' + prefix + 'scrollbar-' + axisName + '">' +
              '<div id="' + axisId + 't" class="' + prefix + 'scrollbar-thumb"></div>' +
              '</div>'
            );

                      self.draghelper = new DragHelper(axisId + 't', {
                          start: function () {
                              scrollStart = self.getEl('body')['scroll' + posName];
                              $('#' + axisId).addClass(prefix + 'active');
                          },

                          drag: function (e) {
                              var ratio, hasScrollH, hasScrollV, containerSize, layoutRect = self.layoutRect();

                              hasScrollH = layoutRect.contentW > layoutRect.innerW;
                              hasScrollV = layoutRect.contentH > layoutRect.innerH;
                              containerSize = self.getEl('body')['client' + sizeName] - (margin * 2);
                              containerSize -= hasScrollH && hasScrollV ? self.getEl('scroll' + axisName)['client' + ax] : 0;

                              ratio = containerSize / self.getEl('body')['scroll' + sizeName];
                              self.getEl('body')['scroll' + posName] = scrollStart + (e['delta' + deltaPosName] / ratio);
                          },

                          stop: function () {
                              $('#' + axisId).removeClass(prefix + 'active');
                          }
                      });
                  }

                  self.classes.add('scroll');

                  addScrollAxis('v', 'Top', 'Height', 'Y', 'Width');
                  addScrollAxis('h', 'Left', 'Width', 'X', 'Height');
              }

              if (self.settings.autoScroll) {
                  if (!self._hasScroll) {
                      self._hasScroll = true;
                      addScroll();

                      self.on('wheel', function (e) {
                          var bodyEl = self.getEl('body');

                          bodyEl.scrollLeft += (e.deltaX || 0) * 10;
                          bodyEl.scrollTop += e.deltaY * 10;

                          repaintScroll();
                      });

                      $(self.getEl('body')).on('scroll', repaintScroll);
                  }

                  repaintScroll();
              }
          }
      };
  }
);
/**
 * Panel.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new panel.
 *
 * @-x-less Panel.less
 * @class tinymce.ui.Panel
 * @extends tinymce.ui.Container
 * @mixes tinymce.ui.Scrollable
 */
    define(
  'tinymce.ui.Panel',
        [
            'tinymce.ui.Container',
            'tinymce.ui.Scrollable'
        ],
  function (Container, Scrollable) {
      'use strict';

      return Container.extend({
          Defaults: {
              layout: 'fit',
              containerCls: 'panel'
          },

          Mixins: [Scrollable],

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, innerHtml = self.settings.html;

              self.preRender();
              layout.preRender(self);

              if (typeof innerHtml === 'undefined') {
                  innerHtml = (
            '<div id="' + self._id + '-body" class="' + self.bodyClasses + '">' +
            layout.renderHtml(self) +
            '</div>'
          );
              } else {
                  if (typeof innerHtml === 'function') {
                      innerHtml = innerHtml.call(self);
                  }

                  self._hasBody = false;
              }

              return (
          '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1" role="group">' +
          (self._preBodyHtml || '') +
          innerHtml +
          '</div>'
              );
          }
      });
  }
);

/**
 * Resizable.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Resizable mixin. Enables controls to be resized.
 *
 * @mixin tinymce.ui.Resizable
 */
    define(
  'tinymce.ui.Resizable',
        [
            'tinymce.ui.DomUtils'
        ],
  function (DomUtils) {
      'use strict';

      return {
      /**
       * Resizes the control to contents.
       *
       * @method resizeToContent
       */
          resizeToContent: function () {
              this._layoutRect.autoResize = true;
              this._lastRect = null;
              this.reflow();
          },

      /**
       * Resizes the control to a specific width/height.
       *
       * @method resizeTo
       * @param {Number} w Control width.
       * @param {Number} h Control height.
       * @return {tinymce.ui.Control} Current control instance.
       */
          resizeTo: function (w, h) {
        // TODO: Fix hack
              if (w <= 1 || h <= 1) {
                  var rect = DomUtils.getWindowSize();

                  w = w <= 1 ? w * rect.w : w;
                  h = h <= 1 ? h * rect.h : h;
              }

              this._layoutRect.autoResize = false;
              return this.layoutRect({ minW: w, minH: h, w: w, h: h }).reflow();
          },

      /**
       * Resizes the control to a specific relative width/height.
       *
       * @method resizeBy
       * @param {Number} dw Relative control width.
       * @param {Number} dh Relative control height.
       * @return {tinymce.ui.Control} Current control instance.
       */
          resizeBy: function (dw, dh) {
              var self = this, rect = self.layoutRect();

              return self.resizeTo(rect.w + dw, rect.h + dh);
          }
      };
  }
);
/**
 * FloatPanel.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a floating panel.
 *
 * @-x-less FloatPanel.less
 * @class tinymce.ui.FloatPanel
 * @extends tinymce.ui.Panel
 * @mixes tinymce.ui.Movable
 * @mixes tinymce.ui.Resizable
 */
    define(
  'tinymce.ui.FloatPanel',
        [
            'global!document',
            'global!window',
            'tinymce.core.dom.DomQuery',
            'tinymce.core.util.Delay',
            'tinymce.ui.DomUtils',
            'tinymce.ui.Movable',
            'tinymce.ui.Panel',
            'tinymce.ui.Resizable'
        ],
  function (document, window, DomQuery, Delay, DomUtils, Movable, Panel, Resizable) {
      'use strict';

      var documentClickHandler, documentScrollHandler, windowResizeHandler, visiblePanels = [];
      var zOrder = [], hasModal;

      function isChildOf (ctrl, parent) {
          while (ctrl) {
              if (ctrl == parent) {
                  return true;
              }

              ctrl = ctrl.parent();
          }
      }

      function skipOrHidePanels (e) {
      // Hide any float panel when a click/focus out is out side that float panel and the
      // float panels direct parent for example a click on a menu button
          var i = visiblePanels.length;

          while (i--) {
              var panel = visiblePanels[i], clickCtrl = panel.getParentCtrl(e.target);

              if (panel.settings.autohide) {
                  if (clickCtrl) {
                      if (isChildOf(clickCtrl, panel) || panel.parent() === clickCtrl) {
                          continue;
                      }
                  }

                  e = panel.fire('autohide', { target: e.target });
                  if (!e.isDefaultPrevented()) {
                      panel.hide();
                  }
              }
          }
      }

      function bindDocumentClickHandler () {
          if (!documentClickHandler) {
              documentClickHandler = function (e) {
          // Gecko fires click event and in the wrong order on Mac so lets normalize
                  if (e.button == 2) {
                      return;
                  }

                  skipOrHidePanels(e);
              };

              DomQuery(document).on('click touchstart', documentClickHandler);
          }
      }

      function bindDocumentScrollHandler () {
          if (!documentScrollHandler) {
              documentScrollHandler = function () {
                  var i;

                  i = visiblePanels.length;
                  while (i--) {
                      repositionPanel(visiblePanels[i]);
                  }
              };

              DomQuery(window).on('scroll', documentScrollHandler);
          }
      }

      function bindWindowResizeHandler () {
          if (!windowResizeHandler) {
              var docElm = document.documentElement, clientWidth = docElm.clientWidth, clientHeight = docElm.clientHeight;

              windowResizeHandler = function () {
          // Workaround for #7065 IE 7 fires resize events event though the window wasn't resized
                  if (!document.all || clientWidth != docElm.clientWidth || clientHeight != docElm.clientHeight) {
                      clientWidth = docElm.clientWidth;
                      clientHeight = docElm.clientHeight;
                      FloatPanel.hideAll();
                  }
              };

              DomQuery(window).on('resize', windowResizeHandler);
          }
      }

    /**
     * Repositions the panel to the top of page if the panel is outside of the visual viewport. It will
     * also reposition all child panels of the current panel.
     */
      function repositionPanel (panel) {
          var scrollY = DomUtils.getViewPort().y;

          function toggleFixedChildPanels (fixed, deltaY) {
              var parent;

              for (var i = 0; i < visiblePanels.length; i++) {
                  if (visiblePanels[i] != panel) {
                      parent = visiblePanels[i].parent();

                      while (parent && (parent = parent.parent())) {
                          if (parent == panel) {
                              visiblePanels[i].fixed(fixed).moveBy(0, deltaY).repaint();
                          }
                      }
                  }
              }
          }

          if (panel.settings.autofix) {
              if (!panel.state.get('fixed')) {
                  panel._autoFixY = panel.layoutRect().y;

                  if (panel._autoFixY < scrollY) {
                      panel.fixed(true).layoutRect({ y: 0 }).repaint();
                      toggleFixedChildPanels(true, scrollY - panel._autoFixY);
                  }
              } else {
                  if (panel._autoFixY > scrollY) {
                      panel.fixed(false).layoutRect({ y: panel._autoFixY }).repaint();
                      toggleFixedChildPanels(false, panel._autoFixY - scrollY);
                  }
              }
          }
      }

      function addRemove (add, ctrl) {
          var i, zIndex = FloatPanel.zIndex || 0xFFFF, topModal;

          if (add) {
              zOrder.push(ctrl);
          } else {
              i = zOrder.length;

              while (i--) {
                  if (zOrder[i] === ctrl) {
                      zOrder.splice(i, 1);
                  }
              }
          }

          if (zOrder.length) {
              for (i = 0; i < zOrder.length; i++) {
                  if (zOrder[i].modal) {
                      zIndex++;
                      topModal = zOrder[i];
                  }

                  zOrder[i].getEl().style.zIndex = zIndex;
                  zOrder[i].zIndex = zIndex;
                  zIndex++;
              }
          }

          var modalBlockEl = DomQuery('#' + ctrl.classPrefix + 'modal-block', ctrl.getContainerElm())[0];

          if (topModal) {
              DomQuery(modalBlockEl).css('z-index', topModal.zIndex - 1);
          } else if (modalBlockEl) {
              modalBlockEl.parentNode.removeChild(modalBlockEl);
              hasModal = false;
          }

          FloatPanel.currentZIndex = zIndex;
      }

      var FloatPanel = Panel.extend({
          Mixins: [Movable, Resizable],

      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} autohide Automatically hide the panel.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              self._eventsRoot = self;

              self.classes.add('floatpanel');

        // Hide floatpanes on click out side the root button
              if (settings.autohide) {
                  bindDocumentClickHandler();
                  bindWindowResizeHandler();
                  visiblePanels.push(self);
              }

              if (settings.autofix) {
                  bindDocumentScrollHandler();

                  self.on('move', function () {
                      repositionPanel(this);
                  });
              }

              self.on('postrender show', function (e) {
                  if (e.control == self) {
                      var $modalBlockEl, prefix = self.classPrefix;

                      if (self.modal && !hasModal) {
                          $modalBlockEl = DomQuery('#' + prefix + 'modal-block', self.getContainerElm());
                          if (!$modalBlockEl[0]) {
                              $modalBlockEl = DomQuery(
                  '<div id="' + prefix + 'modal-block" class="' + prefix + 'reset ' + prefix + 'fade"></div>'
                ).appendTo(self.getContainerElm());
                          }

                          Delay.setTimeout(function () {
                              $modalBlockEl.addClass(prefix + 'in');
                              DomQuery(self.getEl()).addClass(prefix + 'in');
                          });

                          hasModal = true;
                      }

                      addRemove(true, self);
                  }
              });

              self.on('show', function () {
                  self.parents().each(function (ctrl) {
                      if (ctrl.state.get('fixed')) {
                          self.fixed(true);
                          return false;
                      }
                  });
              });

              if (settings.popover) {
                  self._preBodyHtml = '<div class="' + self.classPrefix + 'arrow"></div>';
                  self.classes.add('popover').add('bottom').add(self.isRtl() ? 'end' : 'start');
              }

              self.aria('label', settings.ariaLabel);
              self.aria('labelledby', self._id);
              self.aria('describedby', self.describedBy || self._id + '-none');
          },

          fixed: function (state) {
              var self = this;

              if (self.state.get('fixed') != state) {
                  if (self.state.get('rendered')) {
                      var viewport = DomUtils.getViewPort();

                      if (state) {
                          self.layoutRect().y -= viewport.y;
                      } else {
                          self.layoutRect().y += viewport.y;
                      }
                  }

                  self.classes.toggle('fixed', state);
                  self.state.set('fixed', state);
              }

              return self;
          },

      /**
       * Shows the current float panel.
       *
       * @method show
       * @return {tinymce.ui.FloatPanel} Current floatpanel instance.
       */
          show: function () {
              var self = this, i, state = self._super();

              i = visiblePanels.length;
              while (i--) {
                  if (visiblePanels[i] === self) {
                      break;
                  }
              }

              if (i === -1) {
                  visiblePanels.push(self);
              }

              return state;
          },

      /**
       * Hides the current float panel.
       *
       * @method hide
       * @return {tinymce.ui.FloatPanel} Current floatpanel instance.
       */
          hide: function () {
              removeVisiblePanel(this);
              addRemove(false, this);

              return this._super();
          },

      /**
       * Hide all visible float panels with he autohide setting enabled. This is for
       * manually hiding floating menus or panels.
       *
       * @method hideAll
       */
          hideAll: function () {
              FloatPanel.hideAll();
          },

      /**
       * Closes the float panel. This will remove the float panel from page and fire the close event.
       *
       * @method close
       */
          close: function () {
              var self = this;

              if (!self.fire('close').isDefaultPrevented()) {
                  self.remove();
                  addRemove(false, self);
              }

              return self;
          },

      /**
       * Removes the float panel from page.
       *
       * @method remove
       */
          remove: function () {
              removeVisiblePanel(this);
              this._super();
          },

          postRender: function () {
              var self = this;

              if (self.settings.bodyRole) {
                  this.getEl('body').setAttribute('role', self.settings.bodyRole);
              }

              return self._super();
          }
      });

    /**
     * Hide all visible float panels with he autohide setting enabled. This is for
     * manually hiding floating menus or panels.
     *
     * @static
     * @method hideAll
     */
      FloatPanel.hideAll = function () {
          var i = visiblePanels.length;

          while (i--) {
              var panel = visiblePanels[i];

              if (panel && panel.settings.autohide) {
                  panel.hide();
                  visiblePanels.splice(i, 1);
              }
          }
      };

      function removeVisiblePanel (panel) {
          var i;

          i = visiblePanels.length;
          while (i--) {
              if (visiblePanels[i] === panel) {
                  visiblePanels.splice(i, 1);
              }
          }

          i = zOrder.length;
          while (i--) {
              if (zOrder[i] === panel) {
                  zOrder.splice(i, 1);
              }
          }
      }

      return FloatPanel;
  }
);

/**
 * Window.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new window.
 *
 * @-x-less Window.less
 * @class tinymce.ui.Window
 * @extends tinymce.ui.FloatPanel
 */
    define(
  'tinymce.ui.Window',
        [
            'global!document',
            'global!setTimeout',
            'global!window',
            'tinymce.core.dom.DomQuery',
            'tinymce.core.Env',
            'tinymce.core.util.Delay',
            'tinymce.ui.BoxUtils',
            'tinymce.ui.DomUtils',
            'tinymce.ui.DragHelper',
            'tinymce.ui.FloatPanel',
            'tinymce.ui.Panel'
        ],
  function (document, setTimeout, window, DomQuery, Env, Delay, BoxUtils, DomUtils, DragHelper, FloatPanel, Panel) {
      'use strict';

      var windows = [], oldMetaValue = '';

      function toggleFullScreenState (state) {
          var noScaleMetaValue = 'width=device-width,initial-scale=1.0,user-scalable=0,minimum-scale=1.0,maximum-scale=1.0',
              viewport = DomQuery('meta[name=viewport]')[0],
              contentValue;

          if (Env.overrideViewPort === false) {
              return;
          }

          if (!viewport) {
              viewport = document.createElement('meta');
              viewport.setAttribute('name', 'viewport');
              document.getElementsByTagName('head')[0].appendChild(viewport);
          }

          contentValue = viewport.getAttribute('content');
          if (contentValue && typeof oldMetaValue !== 'undefined') {
              oldMetaValue = contentValue;
          }

          viewport.setAttribute('content', state ? noScaleMetaValue : oldMetaValue);
      }

      function toggleBodyFullScreenClasses (classPrefix, state) {
          if (checkFullscreenWindows() && state === false) {
              DomQuery([document.documentElement, document.body]).removeClass(classPrefix + 'fullscreen');
          }
      }

      function checkFullscreenWindows () {
          for (var i = 0; i < windows.length; i++) {
              if (windows[i]._fullscreen) {
                  return true;
              }
          }
          return false;
      }

      function handleWindowResize () {
          if (!Env.desktop) {
              var lastSize = {
                  w: window.innerWidth,
                  h: window.innerHeight
              };

              Delay.setInterval(function () {
                  var w = window.innerWidth,
                      h = window.innerHeight;

                  if (lastSize.w != w || lastSize.h != h) {
                      lastSize = {
                          w: w,
                          h: h
                      };

                      DomQuery(window).trigger('resize');
                  }
              }, 100);
          }

          function reposition () {
              var i, rect = DomUtils.getWindowSize(), layoutRect;

              for (i = 0; i < windows.length; i++) {
                  layoutRect = windows[i].layoutRect();

                  windows[i].moveTo(
            windows[i].settings.x || Math.max(0, rect.w / 2 - layoutRect.w / 2),
            windows[i].settings.y || Math.max(0, rect.h / 2 - layoutRect.h / 2)
          );
              }
          }

          DomQuery(window).on('resize', reposition);
      }

      var Window = FloatPanel.extend({
          modal: true,

          Defaults: {
              border: 1,
              layout: 'flex',
              containerCls: 'panel',
              role: 'dialog',
              callbacks: {
                  submit: function () {
                      this.fire('submit', { data: this.toJSON() });
                  },

                  close: function () {
                      this.close();
                  }
              }
          },

      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);

              if (self.isRtl()) {
                  self.classes.add('rtl');
              }

              self.classes.add('window');
              self.bodyClasses.add('window-body');
              self.state.set('fixed', true);

        // Create statusbar
              if (settings.buttons) {
                  self.statusbar = new Panel({
                      layout: 'flex',
                      border: '1 0 0 0',
                      spacing: 3,
                      padding: 10,
                      align: 'center',
                      pack: self.isRtl() ? 'start' : 'end',
                      defaults: {
                          type: 'button'
                      },
                      items: settings.buttons
                  });

                  self.statusbar.classes.add('foot');
                  self.statusbar.parent(self);
              }

              self.on('click', function (e) {
                  var closeClass = self.classPrefix + 'close';

                  if (DomUtils.hasClass(e.target, closeClass) || DomUtils.hasClass(e.target.parentNode, closeClass)) {
                      self.close();
                  }
              });

              self.on('cancel', function () {
                  self.close();
              });

              self.aria('describedby', self.describedBy || self._id + '-none');
              self.aria('label', settings.title);
              self._fullscreen = false;
          },

      /**
       * Recalculates the positions of the controls in the current container.
       * This is invoked by the reflow method and shouldn't be called directly.
       *
       * @method recalc
       */
          recalc: function () {
              var self = this, statusbar = self.statusbar, layoutRect, width, x, needsRecalc;

              if (self._fullscreen) {
                  self.layoutRect(DomUtils.getWindowSize());
                  self.layoutRect().contentH = self.layoutRect().innerH;
              }

              self._super();

              layoutRect = self.layoutRect();

        // Resize window based on title width
              if (self.settings.title && !self._fullscreen) {
                  width = layoutRect.headerW;
                  if (width > layoutRect.w) {
                      x = layoutRect.x - Math.max(0, width / 2);
                      self.layoutRect({ w: width, x: x });
                      needsRecalc = true;
                  }
              }

        // Resize window based on statusbar width
              if (statusbar) {
                  statusbar.layoutRect({ w: self.layoutRect().innerW }).recalc();

                  width = statusbar.layoutRect().minW + layoutRect.deltaW;
                  if (width > layoutRect.w) {
                      x = layoutRect.x - Math.max(0, width - layoutRect.w);
                      self.layoutRect({ w: width, x: x });
                      needsRecalc = true;
                  }
              }

        // Recalc body and disable auto resize
              if (needsRecalc) {
                  self.recalc();
              }
          },

      /**
       * Initializes the current controls layout rect.
       * This will be executed by the layout managers to determine the
       * default minWidth/minHeight etc.
       *
       * @method initLayoutRect
       * @return {Object} Layout rect instance.
       */
          initLayoutRect: function () {
              var self = this, layoutRect = self._super(), deltaH = 0, headEl;

        // Reserve vertical space for title
              if (self.settings.title && !self._fullscreen) {
                  headEl = self.getEl('head');

                  var size = DomUtils.getSize(headEl);

                  layoutRect.headerW = size.width;
                  layoutRect.headerH = size.height;

                  deltaH += layoutRect.headerH;
              }

        // Reserve vertical space for statusbar
              if (self.statusbar) {
                  deltaH += self.statusbar.layoutRect().h;
              }

              layoutRect.deltaH += deltaH;
              layoutRect.minH += deltaH;
        // layoutRect.innerH -= deltaH;
              layoutRect.h += deltaH;

              var rect = DomUtils.getWindowSize();

              layoutRect.x = self.settings.x || Math.max(0, rect.w / 2 - layoutRect.w / 2);
              layoutRect.y = self.settings.y || Math.max(0, rect.h / 2 - layoutRect.h / 2);

              return layoutRect;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, id = self._id, prefix = self.classPrefix;
              var settings = self.settings, headerHtml = '', footerHtml = '', html = settings.html;

              self.preRender();
              layout.preRender(self);

              if (settings.title) {
                  headerHtml = (
            '<div id="' + id + '-head" class="' + prefix + 'window-head">' +
            '<div id="' + id + '-title" class="' + prefix + 'title">' + self.encode(settings.title) + '</div>' +
            '<div id="' + id + '-dragh" class="' + prefix + 'dragh"></div>' +
            '<button type="button" class="' + prefix + 'close" aria-hidden="true">' +
            '<i class="mce-ico mce-i-remove"></i>' +
            '</button>' +
            '</div>'
          );
              }

              if (settings.url) {
                  html = '<iframe src="' + settings.url + '" tabindex="-1"></iframe>';
              }

              if (typeof html === 'undefined') {
                  html = layout.renderHtml(self);
              }

              if (self.statusbar) {
                  footerHtml = self.statusbar.renderHtml();
              }

              return (
          '<div id="' + id + '" class="' + self.classes + '" hidefocus="1">' +
          '<div class="' + self.classPrefix + 'reset" role="application">' +
          headerHtml +
          '<div id="' + id + '-body" class="' + self.bodyClasses + '">' +
          html +
          '</div>' +
          footerHtml +
          '</div>' +
          '</div>'
              );
          },

      /**
       * Switches the window fullscreen mode.
       *
       * @method fullscreen
       * @param {Boolean} state True/false state.
       * @return {tinymce.ui.Window} Current window instance.
       */
          fullscreen: function (state) {
              var self = this, documentElement = document.documentElement, slowRendering, prefix = self.classPrefix, layoutRect;

              if (state != self._fullscreen) {
                  DomQuery(window).on('resize', function () {
                      var time;

                      if (self._fullscreen) {
              // Time the layout time if it's to slow use a timeout to not hog the CPU
                          if (!slowRendering) {
                              time = new Date().getTime();

                              var rect = DomUtils.getWindowSize();
                              self.moveTo(0, 0).resizeTo(rect.w, rect.h);

                              if ((new Date().getTime()) - time > 50) {
                                  slowRendering = true;
                              }
                          } else {
                              if (!self._timer) {
                                  self._timer = Delay.setTimeout(function () {
                                      var rect = DomUtils.getWindowSize();
                                      self.moveTo(0, 0).resizeTo(rect.w, rect.h);

                                      self._timer = 0;
                                  }, 50);
                              }
                          }
                      }
                  });

                  layoutRect = self.layoutRect();
                  self._fullscreen = state;

                  if (!state) {
                      self.borderBox = BoxUtils.parseBox(self.settings.border);
                      self.getEl('head').style.display = '';
                      layoutRect.deltaH += layoutRect.headerH;
                      DomQuery([documentElement, document.body]).removeClass(prefix + 'fullscreen');
                      self.classes.remove('fullscreen');
                      self.moveTo(self._initial.x, self._initial.y).resizeTo(self._initial.w, self._initial.h);
                  } else {
                      self._initial = { x: layoutRect.x, y: layoutRect.y, w: layoutRect.w, h: layoutRect.h };

                      self.borderBox = BoxUtils.parseBox('0');
                      self.getEl('head').style.display = 'none';
                      layoutRect.deltaH -= layoutRect.headerH + 2;
                      DomQuery([documentElement, document.body]).addClass(prefix + 'fullscreen');
                      self.classes.add('fullscreen');

                      var rect = DomUtils.getWindowSize();
                      self.moveTo(0, 0).resizeTo(rect.w, rect.h);
                  }
              }

              return self.reflow();
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this, startPos;

              setTimeout(function () {
                  self.classes.add('in');
                  self.fire('open');
              }, 0);

              self._super();

              if (self.statusbar) {
                  self.statusbar.postRender();
              }

              self.focus();

              this.dragHelper = new DragHelper(self._id + '-dragh', {
                  start: function () {
                      startPos = {
                          x: self.layoutRect().x,
                          y: self.layoutRect().y
                      };
                  },

                  drag: function (e) {
                      self.moveTo(startPos.x + e.deltaX, startPos.y + e.deltaY);
                  }
              });

              self.on('submit', function (e) {
                  if (!e.isDefaultPrevented()) {
                      self.close();
                  }
              });

              windows.push(self);
              toggleFullScreenState(true);
          },

      /**
       * Fires a submit event with the serialized form.
       *
       * @method submit
       * @return {Object} Event arguments object.
       */
          submit: function () {
              return this.fire('submit', { data: this.toJSON() });
          },

      /**
       * Removes the current control from DOM and from UI collections.
       *
       * @method remove
       * @return {tinymce.ui.Control} Current control instance.
       */
          remove: function () {
              var self = this, i;

              self.dragHelper.destroy();
              self._super();

              if (self.statusbar) {
                  this.statusbar.remove();
              }

              toggleBodyFullScreenClasses(self.classPrefix, false);

              i = windows.length;
              while (i--) {
                  if (windows[i] === self) {
                      windows.splice(i, 1);
                  }
              }

              toggleFullScreenState(windows.length > 0);
          },

      /**
       * Returns the contentWindow object of the iframe if it exists.
       *
       * @method getContentWindow
       * @return {Window} window object or null.
       */
          getContentWindow: function () {
              var ifr = this.getEl().getElementsByTagName('iframe')[0];
              return ifr ? ifr.contentWindow : null;
          }
      });

      handleWindowResize();

      return Window;
  }
);
/**
 * MessageBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class is used to create MessageBoxes like alerts/confirms etc.
 *
 * @class tinymce.ui.MessageBox
 * @extends tinymce.ui.FloatPanel
 */
    define(
  'tinymce.ui.MessageBox',
        [
            'global!document',
            'tinymce.ui.Window'
        ],
  function (document, Window) {
      'use strict';

      var MessageBox = Window.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              settings = {
                  border: 1,
                  padding: 20,
                  layout: 'flex',
                  pack: 'center',
                  align: 'center',
                  containerCls: 'panel',
                  autoScroll: true,
                  buttons: { type: 'button', text: 'Ok', action: 'ok' },
                  items: {
                      type: 'label',
                      multiline: true,
                      maxWidth: 500,
                      maxHeight: 200
                  }
              };

              this._super(settings);
          },

          Statics: {
        /**
         * Ok buttons constant.
         *
         * @static
         * @final
         * @field {Number} OK
         */
              OK: 1,

        /**
         * Ok/cancel buttons constant.
         *
         * @static
         * @final
         * @field {Number} OK_CANCEL
         */
              OK_CANCEL: 2,

        /**
         * yes/no buttons constant.
         *
         * @static
         * @final
         * @field {Number} YES_NO
         */
              YES_NO: 3,

        /**
         * yes/no/cancel buttons constant.
         *
         * @static
         * @final
         * @field {Number} YES_NO_CANCEL
         */
              YES_NO_CANCEL: 4,

        /**
         * Constructs a new message box and renders it to the body element.
         *
         * @static
         * @method msgBox
         * @param {Object} settings Name/value object with settings.
         */
              msgBox: function (settings) {
                  var buttons, callback = settings.callback || function () { };

                  function createButton (text, status, primary) {
                      return {
                          type: 'button',
                          text: text,
                          subtype: primary ? 'primary' : '',
                          onClick: function (e) {
                              e.control.parents()[1].close();
                              callback(status);
                          }
                      };
                  }

                  switch (settings.buttons) {
                      case MessageBox.OK_CANCEL:
                          buttons = [
                              createButton('Ok', true, true),
                              createButton('Cancel', false)
                          ];
                          break;

                      case MessageBox.YES_NO:
                      case MessageBox.YES_NO_CANCEL:
                          buttons = [
                              createButton('Yes', 1, true),
                              createButton('No', 0)
                          ];

                          if (settings.buttons == MessageBox.YES_NO_CANCEL) {
                              buttons.push(createButton('Cancel', -1));
                          }
                          break;

                      default:
                          buttons = [
                              createButton('Ok', true, true)
                          ];
                          break;
                  }

                  return new Window({
                      padding: 20,
                      x: settings.x,
                      y: settings.y,
                      minWidth: 300,
                      minHeight: 100,
                      layout: 'flex',
                      pack: 'center',
                      align: 'center',
                      buttons: buttons,
                      title: settings.title,
                      role: 'alertdialog',
                      items: {
                          type: 'label',
                          multiline: true,
                          maxWidth: 500,
                          maxHeight: 200,
                          text: settings.text
                      },
                      onPostRender: function () {
                          this.aria('describedby', this.items()[0]._id);
                      },
                      onClose: settings.onClose,
                      onCancel: function () {
                          callback(false);
                      }
                  }).renderTo(document.body).reflow();
              },

        /**
         * Creates a new alert dialog.
         *
         * @method alert
         * @param {Object} settings Settings for the alert dialog.
         * @param {function} [callback] Callback to execute when the user makes a choice.
         */
              alert: function (settings, callback) {
                  if (typeof settings === 'string') {
                      settings = { text: settings };
                  }

                  settings.callback = callback;
                  return MessageBox.msgBox(settings);
              },

        /**
         * Creates a new confirm dialog.
         *
         * @method confirm
         * @param {Object} settings Settings for the confirm dialog.
         * @param {function} [callback] Callback to execute when the user makes a choice.
         */
              confirm: function (settings, callback) {
                  if (typeof settings === 'string') {
                      settings = { text: settings };
                  }

                  settings.callback = callback;
                  settings.buttons = MessageBox.OK_CANCEL;

                  return MessageBox.msgBox(settings);
              }
          }
      });

      return MessageBox;
  }
);

/**
 * WindowManagerImpl.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.WindowManagerImpl',
        [
            'tinymce.ui.Window',
            'tinymce.ui.MessageBox'
        ],
  function (Window, MessageBox) {
      return function (editor) {
          var open = function (args, params, closeCallback) {
              var win;

              args.title = args.title || ' ';

        // Handle URL
              args.url = args.url || args.file; // Legacy
              if (args.url) {
                  args.width = parseInt(args.width || 320, 10);
                  args.height = parseInt(args.height || 240, 10);
              }

        // Handle body
              if (args.body) {
                  args.items = {
                      defaults: args.defaults,
                      type: args.bodyType || 'form',
                      items: args.body,
                      data: args.data,
                      callbacks: args.commands
                  };
              }

              if (!args.url && !args.buttons) {
                  args.buttons = [
                      {
                          text: 'Ok',
                          subtype: 'primary',
                          onclick: function () {
                              win.find('form')[0].submit();
                          }
                      },

                      {
                          text: 'Cancel',
                          onclick: function () {
                              win.close();
                          }
                      }
                  ];
              }

              win = new Window(args);

              win.on('close', function () {
                  closeCallback(win);
              });

        // Handle data
              if (args.data) {
                  win.on('postRender', function () {
                      this.find('*').each(function (ctrl) {
                          var name = ctrl.name();

                          if (name in args.data) {
                              ctrl.value(args.data[name]);
                          }
                      });
                  });
              }

        // store args and parameters
              win.features = args || {};
              win.params = params || {};

              win = win.renderTo().reflow();

              return win;
          };

          var alert = function (message, choiceCallback, closeCallback) {
              var win;

              win = MessageBox.alert(message, function () {
                  choiceCallback();
              });

              win.on('close', function () {
                  closeCallback(win);
              });

              return win;
          };

          var confirm = function (message, choiceCallback, closeCallback) {
              var win;

              win = MessageBox.confirm(message, function (state) {
                  choiceCallback(state);
              });

              win.on('close', function () {
                  closeCallback(win);
              });

              return win;
          };

          var close = function (window) {
              window.close();
          };

          var getParams = function (window) {
              return window.params;
          };

          var setParams = function (window, params) {
              window.params = params;
          };

          return {
              open: open,
              alert: alert,
              confirm: confirm,
              close: close,
              getParams: getParams,
              setParams: setParams
          };
      };
  }
);

/**
 * ThemeApi.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.api.ThemeApi',
        [
            'tinymce.themes.inlite.core.Render',
            'tinymce.ui.NotificationManagerImpl',
            'tinymce.ui.WindowManagerImpl'
        ],
  function (Render, NotificationManagerImpl, WindowManagerImpl) {
      var get = function (editor, panel) {
          var renderUI = function () {
              return Render.renderUI(editor, panel);
          };

          return {
              renderUI: renderUI,
              getNotificationManagerImpl: function () {
                  return NotificationManagerImpl(editor);
              },
              getWindowManagerImpl: function () {
                  return WindowManagerImpl(editor);
              }
          };
      };

      return {
          get: get
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Promise',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Promise');
  }
);

/**
 * Uuid.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Generates unique ids this is the same as in core but since
 * it's not exposed as a global we can't access it.
 */
    define(
  'tinymce.themes.inlite.alien.Uuid',
        [
        ],
  function () {
      var count = 0;

      var seed = function () {
          var rnd = function () {
              return Math.round(Math.random() * 0xFFFFFFFF).toString(36);
          };

          return 's' + Date.now().toString(36) + rnd() + rnd() + rnd();
      };

      var uuid = function (prefix) {
          return prefix + (count++) + seed();
      };

      return {
          uuid: uuid
      };
  }
);

/**
 * Bookmark.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.alien.Bookmark',
        [
        ],
  function () {
    /**
     * Returns a range bookmark. This will convert indexed bookmarks into temporary span elements with
     * index 0 so that they can be restored properly after the DOM has been modified. Text bookmarks will not have spans
     * added to them since they can be restored after a dom operation.
     *
     * So this: <p><b>|</b><b>|</b></p>
     * becomes: <p><b><span data-mce-type="bookmark">|</span></b><b data-mce-type="bookmark">|</span></b></p>
     *
     * @param  {DOMRange} rng DOM Range to get bookmark on.
     * @return {Object} Bookmark object.
     */
      var create = function (dom, rng) {
          var bookmark = {};

          function setupEndPoint (start) {
              var offsetNode, container, offset;

              container = rng[start ? 'startContainer' : 'endContainer'];
              offset = rng[start ? 'startOffset' : 'endOffset'];

              if (container.nodeType == 1) {
                  offsetNode = dom.create('span', { 'data-mce-type': 'bookmark' });

                  if (container.hasChildNodes()) {
                      offset = Math.min(offset, container.childNodes.length - 1);

                      if (start) {
                          container.insertBefore(offsetNode, container.childNodes[offset]);
                      } else {
                          dom.insertAfter(offsetNode, container.childNodes[offset]);
                      }
                  } else {
                      container.appendChild(offsetNode);
                  }

                  container = offsetNode;
                  offset = 0;
              }

              bookmark[start ? 'startContainer' : 'endContainer'] = container;
              bookmark[start ? 'startOffset' : 'endOffset'] = offset;
          }

          setupEndPoint(true);

          if (!rng.collapsed) {
              setupEndPoint();
          }

          return bookmark;
      };

    /**
     * Moves the selection to the current bookmark and removes any selection container wrappers.
     *
     * @param {Object} bookmark Bookmark object to move selection to.
     */
      var resolve = function (dom, bookmark) {
          function restoreEndPoint (start) {
              var container, offset, node;

              function nodeIndex (container) {
                  var node = container.parentNode.firstChild, idx = 0;

                  while (node) {
                      if (node == container) {
                          return idx;
                      }

            // Skip data-mce-type=bookmark nodes
                      if (node.nodeType != 1 || node.getAttribute('data-mce-type') != 'bookmark') {
                          idx++;
                      }

                      node = node.nextSibling;
                  }

                  return -1;
              }

              container = node = bookmark[start ? 'startContainer' : 'endContainer'];
              offset = bookmark[start ? 'startOffset' : 'endOffset'];

              if (!container) {
                  return;
              }

              if (container.nodeType == 1) {
                  offset = nodeIndex(container);
                  container = container.parentNode;
                  dom.remove(node);
              }

              bookmark[start ? 'startContainer' : 'endContainer'] = container;
              bookmark[start ? 'startOffset' : 'endOffset'] = offset;
          }

          restoreEndPoint(true);
          restoreEndPoint();

          var rng = dom.createRng();

          rng.setStart(bookmark.startContainer, bookmark.startOffset);

          if (bookmark.endContainer) {
              rng.setEnd(bookmark.endContainer, bookmark.endOffset);
          }

          return rng;
      };

      return {
          create: create,
          resolve: resolve
      };
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.dom.TreeWalker',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.TreeWalker');
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.dom.RangeUtils',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.dom.RangeUtils');
  }
);

/**
 * Unlink.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Unlink implementation that doesn't leave partial links for example it would produce:
 *  a[b<a href="x">c]d</a>e -> a[bc]de
 * instead of:
 *  a[b<a href="x">c]d</a>e -> a[bc]<a href="x">d</a>e
 */
    define(
  'tinymce.themes.inlite.alien.Unlink',
        [
            'tinymce.themes.inlite.alien.Bookmark',
            'tinymce.core.util.Tools',
            'tinymce.core.dom.TreeWalker',
            'tinymce.core.dom.RangeUtils'
        ],
  function (Bookmark, Tools, TreeWalker, RangeUtils) {
      var getSelectedElements = function (rootElm, startNode, endNode) {
          var walker, node, elms = [];

          walker = new TreeWalker(startNode, rootElm);
          for (node = startNode; node; node = walker.next()) {
              if (node.nodeType === 1) {
                  elms.push(node);
              }

              if (node === endNode) {
                  break;
              }
          }

          return elms;
      };

      var unwrapElements = function (editor, elms) {
          var bookmark, dom, selection;

          dom = editor.dom;
          selection = editor.selection;
          bookmark = Bookmark.create(dom, selection.getRng());

          Tools.each(elms, function (elm) {
              editor.dom.remove(elm, true);
          });

          selection.setRng(Bookmark.resolve(dom, bookmark));
      };

      var isLink = function (elm) {
          return elm.nodeName === 'A' && elm.hasAttribute('href');
      };

      var getParentAnchorOrSelf = function (dom, elm) {
          var anchorElm = dom.getParent(elm, isLink);
          return anchorElm || elm;
      };

      var getSelectedAnchors = function (editor) {
          var startElm, endElm, rootElm, anchorElms, selection, dom, rng;

          selection = editor.selection;
          dom = editor.dom;
          rng = selection.getRng();
          startElm = getParentAnchorOrSelf(dom, RangeUtils.getNode(rng.startContainer, rng.startOffset));
          endElm = RangeUtils.getNode(rng.endContainer, rng.endOffset);
          rootElm = editor.getBody();
          anchorElms = Tools.grep(getSelectedElements(rootElm, startElm, endElm), isLink);

          return anchorElms;
      };

      var unlinkSelection = function (editor) {
          unwrapElements(editor, getSelectedAnchors(editor));
      };

      return {
          unlinkSelection: unlinkSelection
      };
  }
);

/**
 * Actions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.Actions',
        [
            'tinymce.themes.inlite.alien.Uuid',
            'tinymce.themes.inlite.alien.Unlink'
        ],
  function (Uuid, Unlink) {
      var createTableHtml = function (cols, rows) {
          var x, y, html;

          html = '<table data-mce-id="mce" style="width: 100%">';
          html += '<tbody>';

          for (y = 0; y < rows; y++) {
              html += '<tr>';

              for (x = 0; x < cols; x++) {
                  html += '<td><br></td>';
              }

              html += '</tr>';
          }

          html += '</tbody>';
          html += '</table>';

          return html;
      };

      var getInsertedElement = function (editor) {
          var elms = editor.dom.select('*[data-mce-id]');
          return elms[0];
      };

      var insertTable = function (editor, cols, rows) {
          editor.undoManager.transact(function () {
              var tableElm, cellElm;

              editor.insertContent(createTableHtml(cols, rows));

              tableElm = getInsertedElement(editor);
              tableElm.removeAttribute('data-mce-id');
              cellElm = editor.dom.select('td,th', tableElm);
              editor.selection.setCursorLocation(cellElm[0], 0);
          });
      };

      var formatBlock = function (editor, formatName) {
          editor.execCommand('FormatBlock', false, formatName);
      };

      var insertBlob = function (editor, base64, blob) {
          var blobCache, blobInfo;

          blobCache = editor.editorUpload.blobCache;
          blobInfo = blobCache.create(Uuid.uuid('mceu'), blob, base64);
          blobCache.add(blobInfo);

          editor.insertContent(editor.dom.createHTML('img', { src: blobInfo.blobUri() }));
      };

      var collapseSelectionToEnd = function (editor) {
          editor.selection.collapse(false);
      };

      var unlink = function (editor) {
          editor.focus();
          Unlink.unlinkSelection(editor);
          collapseSelectionToEnd(editor);
      };

      var changeHref = function (editor, elm, url) {
          editor.focus();
          editor.dom.setAttrib(elm, 'href', url);
          collapseSelectionToEnd(editor);
      };

      var insertLink = function (editor, url) {
          editor.execCommand('mceInsertLink', false, { href: url });
          collapseSelectionToEnd(editor);
      };

      var updateOrInsertLink = function (editor, url) {
          var elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
          elm ? changeHref(editor, elm, url) : insertLink(editor, url);
      };

      var createLink = function (editor, url) {
          url.trim().length === 0 ? unlink(editor) : updateOrInsertLink(editor, url);
      };

      return {
          insertTable: insertTable,
          formatBlock: formatBlock,
          insertBlob: insertBlob,
          createLink: createLink,
          unlink: unlink
      };
  }
);

/**
 * UrlType.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.core.UrlType',
        [
        ],
  function () {
      var isDomainLike = function (href) {
          return /^www\.|\.(com|org|edu|gov|uk|net|ca|de|jp|fr|au|us|ru|ch|it|nl|se|no|es|mil)$/i.test(href.trim());
      };

      var isAbsolute = function (href) {
          return /^https?:\/\//.test(href.trim());
      };

      return {
          isDomainLike: isDomainLike,
          isAbsolute: isAbsolute
      };
  }
);

/**
 * Forms.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.ui.Forms',
        [
            'tinymce.core.util.Tools',
            'tinymce.core.ui.Factory',
            'tinymce.core.util.Promise',
            'tinymce.themes.inlite.core.Actions',
            'tinymce.themes.inlite.core.UrlType'
        ],
  function (Tools, Factory, Promise, Actions, UrlType) {
      var focusFirstTextBox = function (form) {
          form.find('textbox').eq(0).each(function (ctrl) {
              ctrl.focus();
          });
      };

      var createForm = function (name, spec) {
          var form = Factory.create(
        Tools.extend({
            type: 'form',
            layout: 'flex',
            direction: 'row',
            padding: 5,
            name: name,
            spacing: 3
        }, spec)
      );

          form.on('show', function () {
              focusFirstTextBox(form);
          });

          return form;
      };

      var toggleVisibility = function (ctrl, state) {
          return state ? ctrl.show() : ctrl.hide();
      };

      var askAboutPrefix = function (editor, href) {
          return new Promise(function (resolve) {
              editor.windowManager.confirm(
          'The URL you entered seems to be an external link. Do you want to add the required http:// prefix?',
          function (result) {
              var output = result === true ? 'http://' + href : href;
              resolve(output);
          }
        );
          });
      };

      var convertLinkToAbsolute = function (editor, href) {
          return !UrlType.isAbsolute(href) && UrlType.isDomainLike(href) ? askAboutPrefix(editor, href) : Promise.resolve(href);
      };

      var createQuickLinkForm = function (editor, hide) {
          var attachState = {};

          var unlink = function () {
              editor.focus();
              Actions.unlink(editor);
              hide();
          };

          var onChangeHandler = function (e) {
              var meta = e.meta;

              if (meta && meta.attach) {
                  attachState = {
                      href: this.value(),
                      attach: meta.attach
                  };
              }
          };

          var onShowHandler = function (e) {
              if (e.control === this) {
                  var elm, linkurl = '';

                  elm = editor.dom.getParent(editor.selection.getStart(), 'a[href]');
                  if (elm) {
                      linkurl = editor.dom.getAttrib(elm, 'href');
                  }

                  this.fromJSON({
                      linkurl: linkurl
                  });

                  toggleVisibility(this.find('#unlink'), elm);
                  this.find('#linkurl')[0].focus();
              }
          };

          return createForm('quicklink', {
              items: [
          { type: 'button', name: 'unlink', icon: 'unlink', onclick: unlink, tooltip: 'Remove link' },
          { type: 'filepicker', name: 'linkurl', placeholder: 'Paste or type a link', filetype: 'file', onchange: onChangeHandler },
          { type: 'button', icon: 'checkmark', subtype: 'primary', tooltip: 'Ok', onclick: 'submit' }
              ],
              onshow: onShowHandler,
              onsubmit: function (e) {
                  convertLinkToAbsolute(editor, e.data.linkurl).then(function (url) {
                      editor.undoManager.transact(function () {
                          if (url === attachState.href) {
                              attachState.attach();
                              attachState = {};
                          }

                          Actions.createLink(editor, url);
                      });

                      hide();
                  });
              }
          });
      };

      return {
          createQuickLinkForm: createQuickLinkForm
      };
  }
);

/**
 * Toolbar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.ui.Toolbar',
        [
            'tinymce.core.util.Tools',
            'tinymce.core.ui.Factory',
            'tinymce.themes.inlite.alien.Type'
        ],
  function (Tools, Factory, Type) {
      var getSelectorStateResult = function (itemName, item) {
          var result = function (selector, handler) {
              return {
                  selector: selector,
                  handler: handler
              };
          };

          var activeHandler = function (state) {
              item.active(state);
          };

          var disabledHandler = function (state) {
              item.disabled(state);
          };

          if (item.settings.stateSelector) {
              return result(item.settings.stateSelector, activeHandler);
          }

          if (item.settings.disabledStateSelector) {
              return result(item.settings.disabledStateSelector, disabledHandler);
          }

          return null;
      };

      var bindSelectorChanged = function (editor, itemName, item) {
          return function () {
              var result = getSelectorStateResult(itemName, item);
              if (result !== null) {
                  editor.selection.selectorChanged(result.selector, result.handler);
              }
          };
      };

      var itemsToArray = function (items) {
          if (Type.isArray(items)) {
              return items;
          } else if (Type.isString(items)) {
              return items.split(/[ ,]/);
          }

          return [];
      };

      var create = function (editor, name, items) {
          var toolbarItems = [], buttonGroup;

          if (!items) {
              return;
          }

          Tools.each(itemsToArray(items), function (item) {
              var itemName;

              if (item == '|') {
                  buttonGroup = null;
              } else {
                  if (editor.buttons[item]) {
                      if (!buttonGroup) {
                          buttonGroup = { type: 'buttongroup', items: [] };
                          toolbarItems.push(buttonGroup);
                      }

                      itemName = item;
                      item = editor.buttons[itemName];

                      if (typeof item === 'function') {
                          item = item();
                      }

                      item.type = item.type || 'button';

                      item = Factory.create(item);
                      item.on('postRender', bindSelectorChanged(editor, itemName, item));
                      buttonGroup.items.push(item);
                  }
              }
          });

          return Factory.create({
              type: 'toolbar',
              layout: 'flow',
              name: name,
              items: toolbarItems
          });
      };

      return {
          create: create
      };
  }
);

/**
 * Panel.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.ui.Panel',
        [
            'global!document',
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.ui.Factory',
            'tinymce.core.util.Tools',
            'tinymce.themes.inlite.api.Events',
            'tinymce.themes.inlite.api.Settings',
            'tinymce.themes.inlite.core.Layout',
            'tinymce.themes.inlite.core.Measure',
            'tinymce.themes.inlite.ui.Forms',
            'tinymce.themes.inlite.ui.Toolbar'
        ],
  function (document, DOMUtils, Factory, Tools, Events, Settings, Layout, Measure, Forms, Toolbar) {
      return function () {
          var panel, currentRect;

          var createToolbars = function (editor, toolbars) {
              return Tools.map(toolbars, function (toolbar) {
                  return Toolbar.create(editor, toolbar.id, toolbar.items);
              });
          };

          var hasToolbarItems = function (toolbar) {
              return toolbar.items().length > 0;
          };

          var create = function (editor, toolbars) {
              var items = createToolbars(editor, toolbars).concat([
                  Toolbar.create(editor, 'text', Settings.getTextSelectionToolbarItems(editor)),
                  Toolbar.create(editor, 'insert', Settings.getInsertToolbarItems(editor)),
                  Forms.createQuickLinkForm(editor, hide)
              ]);

              return Factory.create({
                  type: 'floatpanel',
                  role: 'dialog',
                  classes: 'tinymce tinymce-inline arrow',
                  ariaLabel: 'Inline toolbar',
                  layout: 'flex',
                  direction: 'column',
                  align: 'stretch',
                  autohide: false,
                  autofix: true,
                  fixed: true,
                  border: 1,
                  items: Tools.grep(items, hasToolbarItems),
                  oncancel: function () {
                      editor.focus();
                  }
              });
          };

          var showPanel = function (panel) {
              if (panel) {
                  panel.show();
              }
          };

          var movePanelTo = function (panel, pos) {
              panel.moveTo(pos.x, pos.y);
          };

          var togglePositionClass = function (panel, relPos) {
              relPos = relPos ? relPos.substr(0, 2) : '';

              Tools.each({
                  t: 'down',
                  b: 'up',
                  c: 'center'
              }, function (cls, pos) {
                  panel.classes.toggle('arrow-' + cls, pos === relPos.substr(0, 1));
              });

              if (relPos === 'cr') {
                  panel.classes.toggle('arrow-left', true);
                  panel.classes.toggle('arrow-right', false);
              } else if (relPos === 'cl') {
                  panel.classes.toggle('arrow-left', true);
                  panel.classes.toggle('arrow-right', true);
              } else {
                  Tools.each({
                      l: 'left',
                      r: 'right'
                  }, function (cls, pos) {
                      panel.classes.toggle('arrow-' + cls, pos === relPos.substr(1, 1));
                  });
              }
          };

          var showToolbar = function (panel, id) {
              var toolbars = panel.items().filter('#' + id);

              if (toolbars.length > 0) {
                  toolbars[0].show();
                  panel.reflow();
                  return true;
              }

              return false;
          };

          var repositionPanelAt = function (panel, id, editor, targetRect) {
              var contentAreaRect, panelRect, result, userConstainHandler;

              userConstainHandler = Settings.getPositionHandler(editor);
              contentAreaRect = Measure.getContentAreaRect(editor);
              panelRect = DOMUtils.DOM.getRect(panel.getEl());

              if (id === 'insert') {
                  result = Layout.calcInsert(targetRect, contentAreaRect, panelRect);
              } else {
                  result = Layout.calc(targetRect, contentAreaRect, panelRect);
              }

              if (result) {
                  panelRect = result.rect;
                  currentRect = targetRect;
                  movePanelTo(panel, Layout.userConstrain(userConstainHandler, targetRect, contentAreaRect, panelRect));
                  togglePositionClass(panel, result.position);
                  return true;
              } else {
                  return false;
              }
          };

          var showPanelAt = function (panel, id, editor, targetRect) {
              showPanel(panel);
              panel.items().hide();

              if (!showToolbar(panel, id)) {
                  hide(panel);
                  return;
              }

              if (repositionPanelAt(panel, id, editor, targetRect) === false) {
                  hide(panel);
              }
          };

          var hasFormVisible = function () {
              return panel.items().filter('form:visible').length > 0;
          };

          var showForm = function (editor, id) {
              if (panel) {
                  panel.items().hide();

                  if (!showToolbar(panel, id)) {
                      hide(panel);
                      return;
                  }

                  var contentAreaRect, panelRect, result, userConstainHandler;

                  showPanel(panel);
                  panel.items().hide();
                  showToolbar(panel, id);

                  userConstainHandler = Settings.getPositionHandler(editor);
                  contentAreaRect = Measure.getContentAreaRect(editor);
                  panelRect = DOMUtils.DOM.getRect(panel.getEl());

                  result = Layout.calc(currentRect, contentAreaRect, panelRect);

                  if (result) {
                      panelRect = result.rect;
                      movePanelTo(panel, Layout.userConstrain(userConstainHandler, currentRect, contentAreaRect, panelRect));
                      togglePositionClass(panel, result.position);
                  }
              }
          };

          var show = function (editor, id, targetRect, toolbars) {
              if (!panel) {
                  Events.fireBeforeRenderUI(editor);
                  panel = create(editor, toolbars);
                  panel.renderTo(document.body).reflow().moveTo(targetRect.x, targetRect.y);
                  editor.nodeChanged();
              }

              showPanelAt(panel, id, editor, targetRect);
          };

          var reposition = function (editor, id, targetRect) {
              if (panel) {
                  repositionPanelAt(panel, id, editor, targetRect);
              }
          };

          var hide = function () {
              if (panel) {
                  panel.hide();
              }
          };

          var focus = function () {
              if (panel) {
                  panel.find('toolbar:visible').eq(0).each(function (item) {
                      item.focus(true);
                  });
              }
          };

          var remove = function () {
              if (panel) {
                  panel.remove();
                  panel = null;
              }
          };

          var inForm = function () {
              return panel && panel.visible() && hasFormVisible();
          };

          return {
              show: show,
              showForm: showForm,
              reposition: reposition,
              inForm: inForm,
              hide: hide,
              focus: focus,
              remove: remove
          };
      };
  }
);

    define(
  'ephox.katamari.api.Global',

        [
        ],

  function () {
    // Use window object as the global if it's available since CSP will block script evals
      if (typeof window !== 'undefined') {
          return window;
      } else {
          return Function('return this;')();
      }
  }
);

    define(
  'ephox.katamari.api.Resolve',

        [
            'ephox.katamari.api.Global'
        ],

  function (Global) {
    /** path :: ([String], JsObj?) -> JsObj */
      var path = function (parts, scope) {
          var o = scope !== undefined ? scope : Global;
          for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i) { o = o[parts[i]]; }
          return o;
      };

    /** resolve :: (String, JsObj?) -> JsObj */
      var resolve = function (p, scope) {
          var parts = p.split('.');
          return path(parts, scope);
      };

    /** step :: (JsObj, String) -> JsObj */
      var step = function (o, part) {
          if (o[part] === undefined || o[part] === null) { o[part] = {}; }
          return o[part];
      };

    /** forge :: ([String], JsObj?) -> JsObj */
      var forge = function (parts, target) {
          var o = target !== undefined ? target : Global;
          for (var i = 0; i < parts.length; ++i) { o = step(o, parts[i]); }
          return o;
      };

    /** namespace :: (String, JsObj?) -> JsObj */
      var namespace = function (name, target) {
          var parts = name.split('.');
          return forge(parts, target);
      };

      return {
          path: path,
          resolve: resolve,
          forge: forge,
          namespace: namespace
      };
  }
);

    define(
  'ephox.sand.util.Global',

        [
            'ephox.katamari.api.Resolve'
        ],

  function (Resolve) {
      var unsafe = function (name, scope) {
          return Resolve.resolve(name, scope);
      };

      var getOrDie = function (name, scope) {
          var actual = unsafe(name, scope);

          if (actual === undefined) throw name + ' not available on this browser';
          return actual;
      };

      return {
          getOrDie: getOrDie
      };
  }
);
    define(
  'ephox.sand.api.FileReader',

        [
            'ephox.sand.util.Global'
        ],

  function (Global) {
    /*
     * IE10 and above per
     * https://developer.mozilla.org/en-US/docs/Web/API/FileReader
     */
      return function () {
          var f = Global.getOrDie('FileReader');
          return new f();
      };
  }
);
/**
 * Conversions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.file.Conversions',
        [
            'ephox.sand.api.FileReader',
            'tinymce.core.util.Promise'
        ],
  function (FileReader, Promise) {
      var blobToBase64 = function (blob) {
          return new Promise(function (resolve) {
              var reader = new FileReader();

              reader.onloadend = function () {
                  resolve(reader.result.split(',')[1]);
              };

              reader.readAsDataURL(blob);
          });
      };

      return {
          blobToBase64: blobToBase64
      };
  }
);

/**
 * Picker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.file.Picker',
        [
            'global!document',
            'tinymce.core.util.Promise'
        ],
  function (document, Promise) {
      var pickFile = function () {
          return new Promise(function (resolve) {
              var fileInput;

              fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.style.position = 'fixed';
              fileInput.style.left = 0;
              fileInput.style.top = 0;
              fileInput.style.opacity = 0.001;
              document.body.appendChild(fileInput);

              fileInput.onchange = function (e) {
                  resolve(Array.prototype.slice.call(e.target.files));
              };

              fileInput.click();
              fileInput.parentNode.removeChild(fileInput);
          });
      };

      return {
          pickFile: pickFile
      };
  }
);

/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.ui.Buttons',
        [
            'tinymce.themes.inlite.ui.Panel',
            'tinymce.themes.inlite.file.Conversions',
            'tinymce.themes.inlite.file.Picker',
            'tinymce.themes.inlite.core.Actions'
        ],
  function (Panel, Conversions, Picker, Actions) {
      var addHeaderButtons = function (editor) {
          var formatBlock = function (name) {
              return function () {
                  Actions.formatBlock(editor, name);
              };
          };

          for (var i = 1; i < 6; i++) {
              var name = 'h' + i;

              editor.addButton(name, {
                  text: name.toUpperCase(),
                  tooltip: 'Heading ' + i,
                  stateSelector: name,
                  onclick: formatBlock(name),
                  onPostRender: function () {
            // TODO: Remove this hack that produces bold H1-H6 when we have proper icons
                      var span = this.getEl().firstChild.firstChild;
                      span.style.fontWeight = 'bold';
                  }
              });
          }
      };

      var addToEditor = function (editor, panel) {
          editor.addButton('quicklink', {
              icon: 'link',
              tooltip: 'Insert/Edit link',
              stateSelector: 'a[href]',
              onclick: function () {
                  panel.showForm(editor, 'quicklink');
              }
          });

          editor.addButton('quickimage', {
              icon: 'image',
              tooltip: 'Insert image',
              onclick: function () {
                  Picker.pickFile().then(function (files) {
                      var blob = files[0];

                      Conversions.blobToBase64(blob).then(function (base64) {
                          Actions.insertBlob(editor, base64, blob);
                      });
                  });
              }
          });

          editor.addButton('quicktable', {
              icon: 'table',
              tooltip: 'Insert table',
              onclick: function () {
                  panel.hide();
                  Actions.insertTable(editor, 2, 2);
              }
          });

          addHeaderButtons(editor);
      };

      return {
          addToEditor: addToEditor
      };
  }
);

/**
 * Layout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Base layout manager class.
 *
 * @class tinymce.ui.Layout
 */
    define(
  'tinymce.ui.Layout',
        [
            'tinymce.core.util.Class',
            'tinymce.core.util.Tools'
        ],
  function (Class, Tools) {
      'use strict';

      return Class.extend({
          Defaults: {
              firstControlClass: 'first',
              lastControlClass: 'last'
          },

      /**
       * Constructs a layout instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              this.settings = Tools.extend({}, this.Defaults, settings);
          },

      /**
       * This method gets invoked before the layout renders the controls.
       *
       * @method preRender
       * @param {tinymce.ui.Container} container Container instance to preRender.
       */
          preRender: function (container) {
              container.bodyClasses.add(this.settings.containerClass);
          },

      /**
       * Applies layout classes to the container.
       *
       * @private
       */
          applyClasses: function (items) {
              var self = this, settings = self.settings, firstClass, lastClass, firstItem, lastItem;

              firstClass = settings.firstControlClass;
              lastClass = settings.lastControlClass;

              items.each(function (item) {
                  item.classes.remove(firstClass).remove(lastClass).add(settings.controlClass);

                  if (item.visible()) {
                      if (!firstItem) {
                          firstItem = item;
                      }

                      lastItem = item;
                  }
              });

              if (firstItem) {
                  firstItem.classes.add(firstClass);
              }

              if (lastItem) {
                  lastItem.classes.add(lastClass);
              }
          },

      /**
       * Renders the specified container and any layout specific HTML.
       *
       * @method renderHtml
       * @param {tinymce.ui.Container} container Container to render HTML for.
       */
          renderHtml: function (container) {
              var self = this, html = '';

              self.applyClasses(container.items());

              container.items().each(function (item) {
                  html += item.renderHtml();
              });

              return html;
          },

      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function () {
          },

      /**
       * This method gets invoked after the layout renders the controls.
       *
       * @method postRender
       * @param {tinymce.ui.Container} container Container instance to postRender.
       */
          postRender: function () {
          },

          isNative: function () {
              return false;
          }
      });
  }
);
/**
 * AbsoluteLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * LayoutManager for absolute positioning. This layout manager is more of
 * a base class for other layouts but can be created and used directly.
 *
 * @-x-less AbsoluteLayout.less
 * @class tinymce.ui.AbsoluteLayout
 * @extends tinymce.ui.Layout
 */
    define(
  'tinymce.ui.AbsoluteLayout',
        [
            'tinymce.ui.Layout'
        ],
  function (Layout) {
      'use strict';

      return Layout.extend({
          Defaults: {
              containerClass: 'abs-layout',
              controlClass: 'abs-layout-item'
          },

      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function (container) {
              container.items().filter(':visible').each(function (ctrl) {
                  var settings = ctrl.settings;

                  ctrl.layoutRect({
                      x: settings.x,
                      y: settings.y,
                      w: settings.w,
                      h: settings.h
                  });

                  if (ctrl.recalc) {
                      ctrl.recalc();
                  }
              });
          },

      /**
       * Renders the specified container and any layout specific HTML.
       *
       * @method renderHtml
       * @param {tinymce.ui.Container} container Container to render HTML for.
       */
          renderHtml: function (container) {
              return '<div id="' + container._id + '-absend" class="' + container.classPrefix + 'abs-end"></div>' + this._super(container);
          }
      });
  }
);
/**
 * Button.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class is used to create buttons. You can create them directly or through the Factory.
 *
 * @example
 * // Create and render a button to the body element
 * tinymce.ui.Factory.create({
 *     type: 'button',
 *     text: 'My button'
 * }).renderTo(document.body);
 *
 * @-x-less Button.less
 * @class tinymce.ui.Button
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Button',
        [
            'global!document',
            'global!window',
            'tinymce.ui.Widget'
        ],
  function (document, window, Widget) {
      'use strict';

      return Widget.extend({
          Defaults: {
              classes: 'widget btn',
              role: 'button'
          },

      /**
       * Constructs a new button instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} size Size of the button small|medium|large.
       * @setting {String} image Image to use for icon.
       * @setting {String} icon Icon to use for button.
       */
          init: function (settings) {
              var self = this, size;

              self._super(settings);
              settings = self.settings;

              size = self.settings.size;

              self.on('click mousedown', function (e) {
                  e.preventDefault();
              });

              self.on('touchstart', function (e) {
                  self.fire('click', e);
                  e.preventDefault();
              });

              if (settings.subtype) {
                  self.classes.add(settings.subtype);
              }

              if (size) {
                  self.classes.add('btn-' + size);
              }

              if (settings.icon) {
                  self.icon(settings.icon);
              }
          },

      /**
       * Sets/gets the current button icon.
       *
       * @method icon
       * @param {String} [icon] New icon identifier.
       * @return {String|tinymce.ui.MenuButton} Current icon or current MenuButton instance.
       */
          icon: function (icon) {
              if (!arguments.length) {
                  return this.state.get('icon');
              }

              this.state.set('icon', icon);

              return this;
          },

      /**
       * Repaints the button for example after it's been resizes by a layout engine.
       *
       * @method repaint
       */
          repaint: function () {
              var btnElm = this.getEl().firstChild,
                  btnStyle;

              if (btnElm) {
                  btnStyle = btnElm.style;
                  btnStyle.width = btnStyle.height = '100%';
              }

              this._super();
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix;
              var icon = self.state.get('icon'), image, text = self.state.get('text'), textHtml = '';

              image = self.settings.image;
              if (image) {
                  icon = 'none';

          // Support for [high dpi, low dpi] image sources
                  if (typeof image !== 'string') {
                      image = window.getSelection ? image[0] : image[1];
                  }

                  image = ' style="background-image: url(\'' + image + '\')"';
              } else {
                  image = '';
              }

              if (text) {
                  self.classes.add('btn-has-text');
                  textHtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
              }

              icon = icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';

              return (
          '<div id="' + id + '" class="' + self.classes + '" tabindex="-1">' +
          '<button id="' + id + '-button" role="presentation" type="button" tabindex="-1">' +
          (icon ? '<i class="' + icon + '"' + image + '></i>' : '') +
          textHtml +
          '</button>' +
          '</div>'
              );
          },

          bindStates: function () {
              var self = this, $ = self.$, textCls = self.classPrefix + 'txt';

              function setButtonText (text) {
                  var $span = $('span.' + textCls, self.getEl());

                  if (text) {
                      if (!$span[0]) {
                          $('button:first', self.getEl()).append('<span class="' + textCls + '"></span>');
                          $span = $('span.' + textCls, self.getEl());
                      }

                      $span.html(self.encode(text));
                  } else {
                      $span.remove();
                  }

                  self.classes.toggle('btn-has-text', !!text);
              }

              self.state.on('change:text', function (e) {
                  setButtonText(e.value);
              });

              self.state.on('change:icon', function (e) {
                  var icon = e.value, prefix = self.classPrefix;

                  self.settings.icon = icon;
                  icon = icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';

                  var btnElm = self.getEl().firstChild, iconElm = btnElm.getElementsByTagName('i')[0];

                  if (icon) {
                      if (!iconElm || iconElm != btnElm.firstChild) {
                          iconElm = document.createElement('i');
                          btnElm.insertBefore(iconElm, btnElm.firstChild);
                      }

                      iconElm.className = icon;
                  } else if (iconElm) {
                      btnElm.removeChild(iconElm);
                  }

                  setButtonText(self.state.get('text'));
              });

              return self._super();
          }
      });
  }
);

    defineGlobal('global!RegExp', RegExp);
/**
 * BrowseButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new browse button.
 *
 * @-x-less BrowseButton.less
 * @class tinymce.ui.BrowseButton
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.BrowseButton',
        [
            'tinymce.ui.Button',
            'tinymce.core.util.Tools',
            'tinymce.ui.DomUtils',
            'tinymce.core.dom.DomQuery',
            'global!RegExp'
        ],
  function (Button, Tools, DomUtils, $, RegExp) {
      return Button.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} multiple True if the dropzone is a multiple control.
       * @setting {Number} maxLength Max length for the dropzone.
       * @setting {Number} size Size of the dropzone in characters.
       */
          init: function (settings) {
              var self = this;

              settings = Tools.extend({
                  text: 'Browse...',
                  multiple: false,
                  accept: null // by default accept any files
              }, settings);

              self._super(settings);

              self.classes.add('browsebutton');

              if (settings.multiple) {
                  self.classes.add('multiple');
              }
          },

       /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              var input = DomUtils.create('input', {
                  type: 'file',
                  id: self._id + '-browse',
                  accept: self.settings.accept
              });

              self._super();

              $(input).on('change', function (e) {
                  var files = e.target.files;

                  self.value = function () {
                      if (!files.length) {
                          return null;
                      } else if (self.settings.multiple) {
                          return files;
                      } else {
                          return files[0];
                      }
                  };

                  e.preventDefault();

                  if (files.length) {
                      self.fire('change', e);
                  }
              });

        // ui.Button prevents default on click, so we shouldn't let the click to propagate up to it
              $(input).on('click', function (e) {
                  e.stopPropagation();
              });

              $(self.getEl('button')).on('click', function (e) {
                  e.stopPropagation();
                  input.click();
              });

        // in newer browsers input doesn't have to be attached to dom to trigger browser dialog
        // however older IE11 (< 11.1358.14393.0) still requires this
              self.getEl().appendChild(input);
          },

          remove: function () {
              $(this.getEl('button')).off();
              $(this.getEl('input')).off();

              this._super();
          }
      });
  }
);

/**
 * ButtonGroup.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This control enables you to put multiple buttons into a group. This is
 * useful when you want to combine similar toolbar buttons into a group.
 *
 * @example
 * // Create and render a buttongroup with two buttons to the body element
 * tinymce.ui.Factory.create({
 *     type: 'buttongroup',
 *     items: [
 *         {text: 'Button A'},
 *         {text: 'Button B'}
 *     ]
 * }).renderTo(document.body);
 *
 * @-x-less ButtonGroup.less
 * @class tinymce.ui.ButtonGroup
 * @extends tinymce.ui.Container
 */
    define(
  'tinymce.ui.ButtonGroup',
        [
            'tinymce.ui.Container'
        ],
  function (Container) {
      'use strict';

      return Container.extend({
          Defaults: {
              defaultType: 'button',
              role: 'group'
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout;

              self.classes.add('btn-group');
              self.preRender();
              layout.preRender(self);

              return (
          '<div id="' + self._id + '" class="' + self.classes + '">' +
          '<div id="' + self._id + '-body">' +
          (self.settings.html || '') + layout.renderHtml(self) +
          '</div>' +
          '</div>'
              );
          }
      });
  }
);
/**
 * Checkbox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This control creates a custom checkbox.
 *
 * @example
 * // Create and render a checkbox to the body element
 * tinymce.core.ui.Factory.create({
 *     type: 'checkbox',
 *     checked: true,
 *     text: 'My checkbox'
 * }).renderTo(document.body);
 *
 * @-x-less Checkbox.less
 * @class tinymce.ui.Checkbox
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Checkbox',
        [
            'global!document',
            'tinymce.ui.Widget'
        ],
  function (document, Widget) {
      'use strict';

      return Widget.extend({
          Defaults: {
              classes: 'checkbox',
              role: 'checkbox',
              checked: false
          },

      /**
       * Constructs a new Checkbox instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} checked True if the checkbox should be checked by default.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);

              self.on('click mousedown', function (e) {
                  e.preventDefault();
              });

              self.on('click', function (e) {
                  e.preventDefault();

                  if (!self.disabled()) {
                      self.checked(!self.checked());
                  }
              });

              self.checked(self.settings.checked);
          },

      /**
       * Getter/setter function for the checked state.
       *
       * @method checked
       * @param {Boolean} [state] State to be set.
       * @return {Boolean|tinymce.ui.Checkbox} True/false or checkbox if it's a set operation.
       */
          checked: function (state) {
              if (!arguments.length) {
                  return this.state.get('checked');
              }

              this.state.set('checked', state);

              return this;
          },

      /**
       * Getter/setter function for the value state.
       *
       * @method value
       * @param {Boolean} [state] State to be set.
       * @return {Boolean|tinymce.ui.Checkbox} True/false or checkbox if it's a set operation.
       */
          value: function (state) {
              if (!arguments.length) {
                  return this.checked();
              }

              return this.checked(state);
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix;

              return (
          '<div id="' + id + '" class="' + self.classes + '" unselectable="on" aria-labelledby="' + id + '-al" tabindex="-1">' +
          '<i class="' + prefix + 'ico ' + prefix + 'i-checkbox"></i>' +
          '<span id="' + id + '-al" class="' + prefix + 'label">' + self.encode(self.state.get('text')) + '</span>' +
          '</div>'
              );
          },

          bindStates: function () {
              var self = this;

              function checked (state) {
                  self.classes.toggle('checked', state);
                  self.aria('checked', state);
              }

              self.state.on('change:text', function (e) {
                  self.getEl('al').firstChild.data = self.translate(e.value);
              });

              self.state.on('change:checked change:value', function (e) {
                  self.fire('change');
                  checked(e.value);
              });

              self.state.on('change:icon', function (e) {
                  var icon = e.value, prefix = self.classPrefix;

                  if (typeof icon === 'undefined') {
                      return self.settings.icon;
                  }

                  self.settings.icon = icon;
                  icon = icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';

                  var btnElm = self.getEl().firstChild, iconElm = btnElm.getElementsByTagName('i')[0];

                  if (icon) {
                      if (!iconElm || iconElm != btnElm.firstChild) {
                          iconElm = document.createElement('i');
                          btnElm.insertBefore(iconElm, btnElm.firstChild);
                      }

                      iconElm.className = icon;
                  } else if (iconElm) {
                      btnElm.removeChild(iconElm);
                  }
              });

              if (self.state.get('checked')) {
                  checked(true);
              }

              return self._super();
          }
      });
  }
);
/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.VK',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.VK');
  }
);

/**
 * ComboBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a combobox control. Select box that you select a value from or
 * type a value into.
 *
 * @-x-less ComboBox.less
 * @class tinymce.ui.ComboBox
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.ComboBox',
        [
            'global!document',
            'tinymce.core.dom.DomQuery',
            'tinymce.core.ui.Factory',
            'tinymce.core.util.Tools',
            'tinymce.core.util.VK',
            'tinymce.ui.DomUtils',
            'tinymce.ui.Widget'
        ],
  function (document, DomQuery, Factory, Tools, VK, DomUtils, Widget) {
      'use strict';

      return Widget.extend({
      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} placeholder Placeholder text to display.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              settings = self.settings;

              self.classes.add('combobox');
              self.subinput = true;
              self.ariaTarget = 'inp'; // TODO: Figure out a better way

              settings.menu = settings.menu || settings.values;

              if (settings.menu) {
                  settings.icon = 'caret';
              }

              self.on('click', function (e) {
                  var elm = e.target, root = self.getEl();

                  if (!DomQuery.contains(root, elm) && elm != root) {
                      return;
                  }

                  while (elm && elm != root) {
                      if (elm.id && elm.id.indexOf('-open') != -1) {
                          self.fire('action');

                          if (settings.menu) {
                              self.showMenu();

                              if (e.aria) {
                                  self.menu.items()[0].focus();
                              }
                          }
                      }

                      elm = elm.parentNode;
                  }
              });

        // TODO: Rework this
              self.on('keydown', function (e) {
                  var rootControl;

                  if (e.keyCode == 13 && e.target.nodeName === 'INPUT') {
                      e.preventDefault();

            // Find root control that we can do toJSON on
                      self.parents().reverse().each(function (ctrl) {
                          if (ctrl.toJSON) {
                              rootControl = ctrl;
                              return false;
                          }
                      });

            // Fire event on current text box with the serialized data of the whole form
                      self.fire('submit', { data: rootControl.toJSON() });
                  }
              });

              self.on('keyup', function (e) {
                  if (e.target.nodeName == 'INPUT') {
                      var oldValue = self.state.get('value');
                      var newValue = e.target.value;

                      if (newValue !== oldValue) {
                          self.state.set('value', newValue);
                          self.fire('autocomplete', e);
                      }
                  }
              });

              self.on('mouseover', function (e) {
                  var tooltip = self.tooltip().moveTo(-0xFFFF);

                  if (self.statusLevel() && e.target.className.indexOf(self.classPrefix + 'status') !== -1) {
                      var statusMessage = self.statusMessage() || 'Ok';
                      var rel = tooltip.text(statusMessage).show().testMoveRel(e.target, ['bc-tc', 'bc-tl', 'bc-tr']);

                      tooltip.classes.toggle('tooltip-n', rel == 'bc-tc');
                      tooltip.classes.toggle('tooltip-nw', rel == 'bc-tl');
                      tooltip.classes.toggle('tooltip-ne', rel == 'bc-tr');

                      tooltip.moveRel(e.target, rel);
                  }
              });
          },

          statusLevel: function (value) {
              if (arguments.length > 0) {
                  this.state.set('statusLevel', value);
              }

              return this.state.get('statusLevel');
          },

          statusMessage: function (value) {
              if (arguments.length > 0) {
                  this.state.set('statusMessage', value);
              }

              return this.state.get('statusMessage');
          },

          showMenu: function () {
              var self = this, settings = self.settings, menu;

              if (!self.menu) {
                  menu = settings.menu || [];

          // Is menu array then auto constuct menu control
                  if (menu.length) {
                      menu = {
                          type: 'menu',
                          items: menu
                      };
                  } else {
                      menu.type = menu.type || 'menu';
                  }

                  self.menu = Factory.create(menu).parent(self).renderTo(self.getContainerElm());
                  self.fire('createmenu');
                  self.menu.reflow();
                  self.menu.on('cancel', function (e) {
                      if (e.control === self.menu) {
                          self.focus();
                      }
                  });

                  self.menu.on('show hide', function (e) {
                      e.control.items().each(function (ctrl) {
                          ctrl.active(ctrl.value() == self.value());
                      });
                  }).fire('show');

                  self.menu.on('select', function (e) {
                      self.value(e.control.value());
                  });

                  self.on('focusin', function (e) {
                      if (e.target.tagName.toUpperCase() == 'INPUT') {
                          self.menu.hide();
                      }
                  });

                  self.aria('expanded', true);
              }

              self.menu.show();
              self.menu.layoutRect({ w: self.layoutRect().w });
              self.menu.moveRel(self.getEl(), self.isRtl() ? ['br-tr', 'tr-br'] : ['bl-tl', 'tl-bl']);
          },

      /**
       * Focuses the input area of the control.
       *
       * @method focus
       */
          focus: function () {
              this.getEl('inp').focus();
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, elm = self.getEl(), openElm = self.getEl('open'), rect = self.layoutRect();
              var width, lineHeight, innerPadding = 0, inputElm = elm.firstChild;

              if (self.statusLevel() && self.statusLevel() !== 'none') {
                  innerPadding = (
            parseInt(DomUtils.getRuntimeStyle(inputElm, 'padding-right'), 10) -
            parseInt(DomUtils.getRuntimeStyle(inputElm, 'padding-left'), 10)
          );
              }

              if (openElm) {
                  width = rect.w - DomUtils.getSize(openElm).width - 10;
              } else {
                  width = rect.w - 10;
              }

        // Detect old IE 7+8 add lineHeight to align caret vertically in the middle
              var doc = document;
              if (doc.all && (!doc.documentMode || doc.documentMode <= 8)) {
                  lineHeight = (self.layoutRect().h - 2) + 'px';
              }

              DomQuery(inputElm).css({
                  width: width - innerPadding,
                  lineHeight: lineHeight
              });

              self._super();

              return self;
          },

      /**
       * Post render method. Called after the control has been rendered to the target.
       *
       * @method postRender
       * @return {tinymce.ui.ComboBox} Current combobox instance.
       */
          postRender: function () {
              var self = this;

              DomQuery(this.getEl('inp')).on('change', function (e) {
                  self.state.set('value', e.target.value);
                  self.fire('change', e);
              });

              return self._super();
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, settings = self.settings, prefix = self.classPrefix;
              var value = self.state.get('value') || '';
              var icon, text, openBtnHtml = '', extraAttrs = '', statusHtml = '';

              if ('spellcheck' in settings) {
                  extraAttrs += ' spellcheck="' + settings.spellcheck + '"';
              }

              if (settings.maxLength) {
                  extraAttrs += ' maxlength="' + settings.maxLength + '"';
              }

              if (settings.size) {
                  extraAttrs += ' size="' + settings.size + '"';
              }

              if (settings.subtype) {
                  extraAttrs += ' type="' + settings.subtype + '"';
              }

              statusHtml = '<i id="' + id + '-status" class="mce-status mce-ico" style="display: none"></i>';

              if (self.disabled()) {
                  extraAttrs += ' disabled="disabled"';
              }

              icon = settings.icon;
              if (icon && icon != 'caret') {
                  icon = prefix + 'ico ' + prefix + 'i-' + settings.icon;
              }

              text = self.state.get('text');

              if (icon || text) {
                  openBtnHtml = (
            '<div id="' + id + '-open" class="' + prefix + 'btn ' + prefix + 'open" tabIndex="-1" role="button">' +
            '<button id="' + id + '-action" type="button" hidefocus="1" tabindex="-1">' +
            (icon != 'caret' ? '<i class="' + icon + '"></i>' : '<i class="' + prefix + 'caret"></i>') +
            (text ? (icon ? ' ' : '') + text : '') +
            '</button>' +
            '</div>'
          );

                  self.classes.add('has-open');
              }

              return (
          '<div id="' + id + '" class="' + self.classes + '">' +
          '<input id="' + id + '-inp" class="' + prefix + 'textbox" value="' +
          self.encode(value, false) + '" hidefocus="1"' + extraAttrs + ' placeholder="' +
          self.encode(settings.placeholder) + '" />' +
          statusHtml +
          openBtnHtml +
          '</div>'
              );
          },

          value: function (value) {
              if (arguments.length) {
                  this.state.set('value', value);
                  return this;
              }

        // Make sure the real state is in sync
              if (this.state.get('rendered')) {
                  this.state.set('value', this.getEl('inp').value);
              }

              return this.state.get('value');
          },

          showAutoComplete: function (items, term) {
              var self = this;

              if (items.length === 0) {
                  self.hideMenu();
                  return;
              }

              var insert = function (value, title) {
                  return function () {
                      self.fire('selectitem', {
                          title: title,
                          value: value
                      });
                  };
              };

              if (self.menu) {
                  self.menu.items().remove();
              } else {
                  self.menu = Factory.create({
                      type: 'menu',
                      classes: 'combobox-menu',
                      layout: 'flow'
                  }).parent(self).renderTo();
              }

              Tools.each(items, function (item) {
                  self.menu.add({
                      text: item.title,
                      url: item.previewUrl,
                      match: term,
                      classes: 'menu-item-ellipsis',
                      onclick: insert(item.value, item.title)
                  });
              });

              self.menu.renderNew();
              self.hideMenu();

              self.menu.on('cancel', function (e) {
                  if (e.control.parent() === self.menu) {
                      e.stopPropagation();
                      self.focus();
                      self.hideMenu();
                  }
              });

              self.menu.on('select', function () {
                  self.focus();
              });

              var maxW = self.layoutRect().w;
              self.menu.layoutRect({ w: maxW, minW: 0, maxW: maxW });
              self.menu.reflow();
              self.menu.show();
              self.menu.moveRel(self.getEl(), self.isRtl() ? ['br-tr', 'tr-br'] : ['bl-tl', 'tl-bl']);
          },

          hideMenu: function () {
              if (this.menu) {
                  this.menu.hide();
              }
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:value', function (e) {
                  if (self.getEl('inp').value != e.value) {
                      self.getEl('inp').value = e.value;
                  }
              });

              self.state.on('change:disabled', function (e) {
                  self.getEl('inp').disabled = e.value;
              });

              self.state.on('change:statusLevel', function (e) {
                  var statusIconElm = self.getEl('status');
                  var prefix = self.classPrefix, value = e.value;

                  DomUtils.css(statusIconElm, 'display', value === 'none' ? 'none' : '');
                  DomUtils.toggleClass(statusIconElm, prefix + 'i-checkmark', value === 'ok');
                  DomUtils.toggleClass(statusIconElm, prefix + 'i-warning', value === 'warn');
                  DomUtils.toggleClass(statusIconElm, prefix + 'i-error', value === 'error');
                  self.classes.toggle('has-status', value !== 'none');
                  self.repaint();
              });

              DomUtils.on(self.getEl('status'), 'mouseleave', function () {
                  self.tooltip().hide();
              });

              self.on('cancel', function (e) {
                  if (self.menu && self.menu.visible()) {
                      e.stopPropagation();
                      self.hideMenu();
                  }
              });

              var focusIdx = function (idx, menu) {
                  if (menu && menu.items().length > 0) {
                      menu.items().eq(idx)[0].focus();
                  }
              };

              self.on('keydown', function (e) {
                  var keyCode = e.keyCode;

                  if (e.target.nodeName === 'INPUT') {
                      if (keyCode === VK.DOWN) {
                          e.preventDefault();
                          self.fire('autocomplete');
                          focusIdx(0, self.menu);
                      } else if (keyCode === VK.UP) {
                          e.preventDefault();
                          focusIdx(-1, self.menu);
                      }
                  }
              });

              return self._super();
          },

          remove: function () {
              DomQuery(this.getEl('inp')).off();

              if (this.menu) {
                  this.menu.remove();
              }

              this._super();
          }
      });
  }
);
/**
 * ColorBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This widget lets you enter colors and browse for colors by pressing the color button. It also displays
 * a preview of the current color.
 *
 * @-x-less ColorBox.less
 * @class tinymce.ui.ColorBox
 * @extends tinymce.ui.ComboBox
 */
    define(
  'tinymce.ui.ColorBox',
        [
            'tinymce.ui.ComboBox'
        ],
  function (ComboBox) {
      'use strict';

      return ComboBox.extend({
      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this;

              settings.spellcheck = false;

              if (settings.onaction) {
                  settings.icon = 'none';
              }

              self._super(settings);

              self.classes.add('colorbox');
              self.on('change keyup postrender', function () {
                  self.repaintColor(self.value());
              });
          },

          repaintColor: function (value) {
              var openElm = this.getEl('open');
              var elm = openElm ? openElm.getElementsByTagName('i')[0] : null;

              if (elm) {
                  try {
                      elm.style.background = value;
                  } catch (ex) {
            // Ignore
                  }
              }
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:value', function (e) {
                  if (self.state.get('rendered')) {
                      self.repaintColor(e.value);
                  }
              });

              return self._super();
          }
      });
  }
);
/**
 * PanelButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new panel button.
 *
 * @class tinymce.ui.PanelButton
 * @extends tinymce.ui.Button
 */
    define(
  'tinymce.ui.PanelButton',
        [
            'tinymce.ui.Button',
            'tinymce.ui.FloatPanel'
        ],
  function (Button, FloatPanel) {
      'use strict';

      return Button.extend({
      /**
       * Shows the panel for the button.
       *
       * @method showPanel
       */
          showPanel: function () {
              var self = this, settings = self.settings;

              self.classes.add('opened');

              if (!self.panel) {
                  var panelSettings = settings.panel;

          // Wrap panel in grid layout if type if specified
          // This makes it possible to add forms or other containers directly in the panel option
                  if (panelSettings.type) {
                      panelSettings = {
                          layout: 'grid',
                          items: panelSettings
                      };
                  }

                  panelSettings.role = panelSettings.role || 'dialog';
                  panelSettings.popover = true;
                  panelSettings.autohide = true;
                  panelSettings.ariaRoot = true;

                  self.panel = new FloatPanel(panelSettings).on('hide', function () {
                      self.classes.remove('opened');
                  }).on('cancel', function (e) {
                      e.stopPropagation();
                      self.focus();
                      self.hidePanel();
                  }).parent(self).renderTo(self.getContainerElm());

                  self.panel.fire('show');
                  self.panel.reflow();
              } else {
                  self.panel.show();
              }

              var rel = self.panel.testMoveRel(self.getEl(), settings.popoverAlign || (self.isRtl() ? ['bc-tc', 'bc-tl', 'bc-tr'] : ['bc-tc', 'bc-tr', 'bc-tl']));

              self.panel.classes.toggle('start', rel === 'bc-tl');
              self.panel.classes.toggle('end', rel === 'bc-tr');

              self.panel.moveRel(self.getEl(), rel);
          },

      /**
       * Hides the panel for the button.
       *
       * @method hidePanel
       */
          hidePanel: function () {
              var self = this;

              if (self.panel) {
                  self.panel.hide();
              }
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self.aria('haspopup', true);

              self.on('click', function (e) {
                  if (e.control === self) {
                      if (self.panel && self.panel.visible()) {
                          self.hidePanel();
                      } else {
                          self.showPanel();
                          self.panel.focus(!!e.aria);
                      }
                  }
              });

              return self._super();
          },

          remove: function () {
              if (this.panel) {
                  this.panel.remove();
                  this.panel = null;
              }

              return this._super();
          }
      });
  }
);
/**
 * ColorButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a color button control. This is a split button in which the main
 * button has a visual representation of the currently selected color. When clicked
 * the caret button displays a color picker, allowing the user to select a new color.
 *
 * @-x-less ColorButton.less
 * @class tinymce.ui.ColorButton
 * @extends tinymce.ui.PanelButton
 */
    define(
  'tinymce.ui.ColorButton',
        [
            'tinymce.ui.PanelButton',
            'tinymce.core.dom.DOMUtils'
        ],
  function (PanelButton, DomUtils) {
      'use strict';

      var DOM = DomUtils.DOM;

      return PanelButton.extend({
      /**
       * Constructs a new ColorButton instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              this._super(settings);
              this.classes.add('splitbtn');
              this.classes.add('colorbutton');
          },

      /**
       * Getter/setter for the current color.
       *
       * @method color
       * @param {String} [color] Color to set.
       * @return {String|tinymce.ui.ColorButton} Current color or current instance.
       */
          color: function (color) {
              if (color) {
                  this._color = color;
                  this.getEl('preview').style.backgroundColor = color;
                  return this;
              }

              return this._color;
          },

      /**
       * Resets the current color.
       *
       * @method resetColor
       * @return {tinymce.ui.ColorButton} Current instance.
       */
          resetColor: function () {
              this._color = null;
              this.getEl('preview').style.backgroundColor = null;
              return this;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix, text = self.state.get('text');
              var icon = self.settings.icon ? prefix + 'ico ' + prefix + 'i-' + self.settings.icon : '';
              var image = self.settings.image ? ' style="background-image: url(\'' + self.settings.image + '\')"' : '',
                  textHtml = '';

              if (text) {
                  self.classes.add('btn-has-text');
                  textHtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
              }

              return (
          '<div id="' + id + '" class="' + self.classes + '" role="button" tabindex="-1" aria-haspopup="true">' +
          '<button role="presentation" hidefocus="1" type="button" tabindex="-1">' +
          (icon ? '<i class="' + icon + '"' + image + '></i>' : '') +
          '<span id="' + id + '-preview" class="' + prefix + 'preview"></span>' +
          textHtml +
          '</button>' +
          '<button type="button" class="' + prefix + 'open" hidefocus="1" tabindex="-1">' +
          ' <i class="' + prefix + 'caret"></i>' +
          '</button>' +
          '</div>'
              );
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this, onClickHandler = self.settings.onclick;

              self.on('click', function (e) {
                  if (e.aria && e.aria.key === 'down') {
                      return;
                  }

                  if (e.control == self && !DOM.getParent(e.target, '.' + self.classPrefix + 'open')) {
                      e.stopImmediatePropagation();
                      onClickHandler.call(self, e);
                  }
              });

              delete self.settings.onclick;

              return self._super();
          }
      });
  }
);

/**
 * ResolveGlobal.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.core.util.Color',
        [
            'global!tinymce.util.Tools.resolve'
        ],
  function (resolve) {
      return resolve('tinymce.util.Color');
  }
);

/**
 * ColorPicker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Color picker widget lets you select colors.
 *
 * @-x-less ColorPicker.less
 * @class tinymce.ui.ColorPicker
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.ColorPicker',
        [
            'tinymce.ui.Widget',
            'tinymce.ui.DragHelper',
            'tinymce.ui.DomUtils',
            'tinymce.core.util.Color'
        ],
  function (Widget, DragHelper, DomUtils, Color) {
      'use strict';

      return Widget.extend({
          Defaults: {
              classes: 'widget colorpicker'
          },

      /**
       * Constructs a new colorpicker instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} color Initial color value.
       */
          init: function (settings) {
              this._super(settings);
          },

          postRender: function () {
              var self = this, color = self.color(), hsv, hueRootElm, huePointElm, svRootElm, svPointElm;

              hueRootElm = self.getEl('h');
              huePointElm = self.getEl('hp');
              svRootElm = self.getEl('sv');
              svPointElm = self.getEl('svp');

              function getPos (elm, event) {
                  var pos = DomUtils.getPos(elm), x, y;

                  x = event.pageX - pos.x;
                  y = event.pageY - pos.y;

                  x = Math.max(0, Math.min(x / elm.clientWidth, 1));
                  y = Math.max(0, Math.min(y / elm.clientHeight, 1));

                  return {
                      x: x,
                      y: y
                  };
              }

              function updateColor (hsv, hueUpdate) {
                  var hue = (360 - hsv.h) / 360;

                  DomUtils.css(huePointElm, {
                      top: (hue * 100) + '%'
                  });

                  if (!hueUpdate) {
                      DomUtils.css(svPointElm, {
                          left: hsv.s + '%',
                          top: (100 - hsv.v) + '%'
                      });
                  }

                  svRootElm.style.background = new Color({ s: 100, v: 100, h: hsv.h }).toHex();
                  self.color().parse({ s: hsv.s, v: hsv.v, h: hsv.h });
              }

              function updateSaturationAndValue (e) {
                  var pos;

                  pos = getPos(svRootElm, e);
                  hsv.s = pos.x * 100;
                  hsv.v = (1 - pos.y) * 100;

                  updateColor(hsv);
                  self.fire('change');
              }

              function updateHue (e) {
                  var pos;

                  pos = getPos(hueRootElm, e);
                  hsv = color.toHsv();
                  hsv.h = (1 - pos.y) * 360;
                  updateColor(hsv, true);
                  self.fire('change');
              }

              self._repaint = function () {
                  hsv = color.toHsv();
                  updateColor(hsv);
              };

              self._super();

              self._svdraghelper = new DragHelper(self._id + '-sv', {
                  start: updateSaturationAndValue,
                  drag: updateSaturationAndValue
              });

              self._hdraghelper = new DragHelper(self._id + '-h', {
                  start: updateHue,
                  drag: updateHue
              });

              self._repaint();
          },

          rgb: function () {
              return this.color().toRgb();
          },

          value: function (value) {
              var self = this;

              if (arguments.length) {
                  self.color().parse(value);

                  if (self._rendered) {
                      self._repaint();
                  }
              } else {
                  return self.color().toHex();
              }
          },

          color: function () {
              if (!this._color) {
                  this._color = new Color();
              }

              return this._color;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix, hueHtml;
              var stops = '#ff0000,#ff0080,#ff00ff,#8000ff,#0000ff,#0080ff,#00ffff,#00ff80,#00ff00,#80ff00,#ffff00,#ff8000,#ff0000';

              function getOldIeFallbackHtml () {
                  var i, l, html = '', gradientPrefix, stopsList;

                  gradientPrefix = 'filter:progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=';
                  stopsList = stops.split(',');
                  for (i = 0, l = stopsList.length - 1; i < l; i++) {
                      html += (
              '<div class="' + prefix + 'colorpicker-h-chunk" style="' +
              'height:' + (100 / l) + '%;' +
              gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ');' +
              '-ms-' + gradientPrefix + stopsList[i] + ',endColorstr=' + stopsList[i + 1] + ')' +
              '"></div>'
            );
                  }

                  return html;
              }

              var gradientCssText = (
          'background: -ms-linear-gradient(top,' + stops + ');' +
          'background: linear-gradient(to bottom,' + stops + ');'
        );

              hueHtml = (
          '<div id="' + id + '-h" class="' + prefix + 'colorpicker-h" style="' + gradientCssText + '">' +
          getOldIeFallbackHtml() +
          '<div id="' + id + '-hp" class="' + prefix + 'colorpicker-h-marker"></div>' +
          '</div>'
        );

              return (
          '<div id="' + id + '" class="' + self.classes + '">' +
          '<div id="' + id + '-sv" class="' + prefix + 'colorpicker-sv">' +
          '<div class="' + prefix + 'colorpicker-overlay1">' +
          '<div class="' + prefix + 'colorpicker-overlay2">' +
          '<div id="' + id + '-svp" class="' + prefix + 'colorpicker-selector1">' +
          '<div class="' + prefix + 'colorpicker-selector2"></div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          hueHtml +
          '</div>'
              );
          }
      });
  }
);
/**
 * DropZone.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new dropzone.
 *
 * @-x-less DropZone.less
 * @class tinymce.ui.DropZone
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.DropZone',
        [
            'tinymce.ui.Widget',
            'tinymce.core.util.Tools',
            'tinymce.ui.DomUtils',
            'global!RegExp'
        ],
  function (Widget, Tools, DomUtils, RegExp) {
      return Widget.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} multiple True if the dropzone is a multiple control.
       * @setting {Number} maxLength Max length for the dropzone.
       * @setting {Number} size Size of the dropzone in characters.
       */
          init: function (settings) {
              var self = this;

              settings = Tools.extend({
                  height: 100,
                  text: 'Drop an image here',
                  multiple: false,
                  accept: null // by default accept any files
              }, settings);

              self._super(settings);

              self.classes.add('dropzone');

              if (settings.multiple) {
                  self.classes.add('multiple');
              }
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, attrs, elm;
              var cfg = self.settings;

              attrs = {
                  id: self._id,
                  hidefocus: '1'
              };

              elm = DomUtils.create('div', attrs, '<span>' + this.translate(cfg.text) + '</span>');

              if (cfg.height) {
                  DomUtils.css(elm, 'height', cfg.height + 'px');
              }

              if (cfg.width) {
                  DomUtils.css(elm, 'width', cfg.width + 'px');
              }

              elm.className = self.classes;

              return elm.outerHTML;
          },

        /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              var toggleDragClass = function (e) {
                  e.preventDefault();
                  self.classes.toggle('dragenter');
                  self.getEl().className = self.classes;
              };

              var filter = function (files) {
                  var accept = self.settings.accept;
                  if (typeof accept !== 'string') {
                      return files;
                  }

                  var re = new RegExp('(' + accept.split(/\s*,\s*/).join('|') + ')$', 'i');
                  return Tools.grep(files, function (file) {
                      return re.test(file.name);
                  });
              };

              self._super();

              self.$el.on('dragover', function (e) {
                  e.preventDefault();
              });

              self.$el.on('dragenter', toggleDragClass);
              self.$el.on('dragleave', toggleDragClass);

              self.$el.on('drop', function (e) {
                  e.preventDefault();

                  if (self.state.get('disabled')) {
                      return;
                  }

                  var files = filter(e.dataTransfer.files);

                  self.value = function () {
                      if (!files.length) {
                          return null;
                      } else if (self.settings.multiple) {
                          return files;
                      } else {
                          return files[0];
                      }
                  };

                  if (files.length) {
                      self.fire('change', e);
                  }
              });
          },

          remove: function () {
              this.$el.off();
              this._super();
          }
      });
  }
);

/**
 * Path.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new path control.
 *
 * @-x-less Path.less
 * @class tinymce.ui.Path
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Path',
        [
            'tinymce.ui.Widget'
        ],
  function (Widget) {
      'use strict';

      return Widget.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {String} delimiter Delimiter to display between row in path.
       */
          init: function (settings) {
              var self = this;

              if (!settings.delimiter) {
                  settings.delimiter = '\u00BB';
              }

              self._super(settings);
              self.classes.add('path');
              self.canFocus = true;

              self.on('click', function (e) {
                  var index, target = e.target;

                  if ((index = target.getAttribute('data-index'))) {
                      self.fire('select', { value: self.row()[index], index: index });
                  }
              });

              self.row(self.settings.row);
          },

      /**
       * Focuses the current control.
       *
       * @method focus
       * @return {tinymce.ui.Control} Current control instance.
       */
          focus: function () {
              var self = this;

              self.getEl().firstChild.focus();

              return self;
          },

      /**
       * Sets/gets the data to be used for the path.
       *
       * @method row
       * @param {Array} row Array with row name is rendered to path.
       */
          row: function (row) {
              if (!arguments.length) {
                  return this.state.get('row');
              }

              this.state.set('row', row);

              return this;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this;

              return (
          '<div id="' + self._id + '" class="' + self.classes + '">' +
          self._getDataPathHtml(self.state.get('row')) +
          '</div>'
              );
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:row', function (e) {
                  self.innerHtml(self._getDataPathHtml(e.value));
              });

              return self._super();
          },

          _getDataPathHtml: function (data) {
              var self = this, parts = data || [], i, l, html = '', prefix = self.classPrefix;

              for (i = 0, l = parts.length; i < l; i++) {
                  html += (
            (i > 0 ? '<div class="' + prefix + 'divider" aria-hidden="true"> ' + self.settings.delimiter + ' </div>' : '') +
            '<div role="button" class="' + prefix + 'path-item' + (i == l - 1 ? ' ' + prefix + 'last' : '') + '" data-index="' +
            i + '" tabindex="-1" id="' + self._id + '-' + i + '" aria-level="' + (i + 1) + '">' + parts[i].name + '</div>'
          );
              }

              if (!html) {
                  html = '<div class="' + prefix + 'path-item">\u00a0</div>';
              }

              return html;
          }
      });
  }
);

/**
 * ElementPath.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This control creates an path for the current selections parent elements in TinyMCE.
 *
 * @class tinymce.ui.ElementPath
 * @extends tinymce.ui.Path
 */
    define(
  'tinymce.ui.ElementPath',
        [
            'tinymce.ui.Path'
        ],
  function (Path) {
      return Path.extend({
      /**
       * Post render method. Called after the control has been rendered to the target.
       *
       * @method postRender
       * @return {tinymce.ui.ElementPath} Current combobox instance.
       */
          postRender: function () {
              var self = this, editor = self.settings.editor;

              function isHidden (elm) {
                  if (elm.nodeType === 1) {
                      if (elm.nodeName == 'BR' || !!elm.getAttribute('data-mce-bogus')) {
                          return true;
                      }

                      if (elm.getAttribute('data-mce-type') === 'bookmark') {
                          return true;
                      }
                  }

                  return false;
              }

              if (editor.settings.elementpath !== false) {
                  self.on('select', function (e) {
                      editor.focus();
                      editor.selection.select(this.row()[e.index].element);
                      editor.nodeChanged();
                  });

                  editor.on('nodeChange', function (e) {
                      var outParents = [], parents = e.parents, i = parents.length;

                      while (i--) {
                          if (parents[i].nodeType == 1 && !isHidden(parents[i])) {
                              var args = editor.fire('ResolveName', {
                                  name: parents[i].nodeName.toLowerCase(),
                                  target: parents[i]
                              });

                              if (!args.isDefaultPrevented()) {
                                  outParents.push({ name: args.name, element: parents[i] });
                              }

                              if (args.isPropagationStopped()) {
                                  break;
                              }
                          }
                      }

                      self.row(outParents);
                  });
              }

              return self._super();
          }
      });
  }
);
/**
 * FormItem.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class is a container created by the form element with
 * a label and control item.
 *
 * @class tinymce.ui.FormItem
 * @extends tinymce.ui.Container
 * @setting {String} label Label to display for the form item.
 */
    define(
  'tinymce.ui.FormItem',
        [
            'tinymce.ui.Container'
        ],
  function (Container) {
      'use strict';

      return Container.extend({
          Defaults: {
              layout: 'flex',
              align: 'center',
              defaults: {
                  flex: 1
              }
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, prefix = self.classPrefix;

              self.classes.add('formitem');
              layout.preRender(self);

              return (
          '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' +
          (self.settings.title ? ('<div id="' + self._id + '-title" class="' + prefix + 'title">' +
            self.settings.title + '</div>') : '') +
          '<div id="' + self._id + '-body" class="' + self.bodyClasses + '">' +
          (self.settings.html || '') + layout.renderHtml(self) +
          '</div>' +
          '</div>'
              );
          }
      });
  }
);
/**
 * Form.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a form container. A form container has the ability
 * to automatically wrap items in tinymce.ui.FormItem instances.
 *
 * Each FormItem instance is a container for the label and the item.
 *
 * @example
 * tinymce.core.ui.Factory.create({
 *     type: 'form',
 *     items: [
 *         {type: 'textbox', label: 'My text box'}
 *     ]
 * }).renderTo(document.body);
 *
 * @class tinymce.ui.Form
 * @extends tinymce.ui.Container
 */
    define(
  'tinymce.ui.Form',
        [
            'tinymce.ui.Container',
            'tinymce.ui.FormItem',
            'tinymce.core.util.Tools'
        ],
  function (Container, FormItem, Tools) {
      'use strict';

      return Container.extend({
          Defaults: {
              containerCls: 'form',
              layout: 'flex',
              direction: 'column',
              align: 'stretch',
              flex: 1,
              padding: 15,
              labelGap: 30,
              spacing: 10,
              callbacks: {
                  submit: function () {
                      this.submit();
                  }
              }
          },

      /**
       * This method gets invoked before the control is rendered.
       *
       * @method preRender
       */
          preRender: function () {
              var self = this, items = self.items();

              if (!self.settings.formItemDefaults) {
                  self.settings.formItemDefaults = {
                      layout: 'flex',
                      autoResize: 'overflow',
                      defaults: { flex: 1 }
                  };
              }

        // Wrap any labeled items in FormItems
              items.each(function (ctrl) {
                  var formItem, label = ctrl.settings.label;

                  if (label) {
                      formItem = new FormItem(Tools.extend({
                          items: {
                              type: 'label',
                              id: ctrl._id + '-l',
                              text: label,
                              flex: 0,
                              forId: ctrl._id,
                              disabled: ctrl.disabled()
                          }
                      }, self.settings.formItemDefaults));

                      formItem.type = 'formitem';
                      ctrl.aria('labelledby', ctrl._id + '-l');

                      if (typeof ctrl.settings.flex === 'undefined') {
                          ctrl.settings.flex = 1;
                      }

                      self.replace(ctrl, formItem);
                      formItem.add(ctrl);
                  }
              });
          },

      /**
       * Fires a submit event with the serialized form.
       *
       * @method submit
       * @return {Object} Event arguments object.
       */
          submit: function () {
              return this.fire('submit', { data: this.toJSON() });
          },

      /**
       * Post render method. Called after the control has been rendered to the target.
       *
       * @method postRender
       * @return {tinymce.ui.ComboBox} Current combobox instance.
       */
          postRender: function () {
              var self = this;

              self._super();
              self.fromJSON(self.settings.data);
          },

          bindStates: function () {
              var self = this;

              self._super();

              function recalcLabels () {
                  var maxLabelWidth = 0, labels = [], i, labelGap, items;

                  if (self.settings.labelGapCalc === false) {
                      return;
                  }

                  if (self.settings.labelGapCalc == 'children') {
                      items = self.find('formitem');
                  } else {
                      items = self.items();
                  }

                  items.filter('formitem').each(function (item) {
                      var labelCtrl = item.items()[0], labelWidth = labelCtrl.getEl().clientWidth;

                      maxLabelWidth = labelWidth > maxLabelWidth ? labelWidth : maxLabelWidth;
                      labels.push(labelCtrl);
                  });

                  labelGap = self.settings.labelGap || 0;

                  i = labels.length;
                  while (i--) {
                      labels[i].settings.minWidth = maxLabelWidth + labelGap;
                  }
              }

              self.on('show', recalcLabels);
              recalcLabels();
          }
      });
  }
);
/**
 * FieldSet.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates fieldset containers.
 *
 * @-x-less FieldSet.less
 * @class tinymce.ui.FieldSet
 * @extends tinymce.ui.Form
 */
    define(
  'tinymce.ui.FieldSet',
        [
            'tinymce.ui.Form'
        ],
  function (Form) {
      'use strict';

      return Form.extend({
          Defaults: {
              containerCls: 'fieldset',
              layout: 'flex',
              direction: 'column',
              align: 'stretch',
              flex: 1,
              padding: '25 15 5 15',
              labelGap: 30,
              spacing: 10,
              border: 1
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, prefix = self.classPrefix;

              self.preRender();
              layout.preRender(self);

              return (
          '<fieldset id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' +
          (self.settings.title ? ('<legend id="' + self._id + '-title" class="' + prefix + 'fieldset-title">' +
            self.settings.title + '</legend>') : '') +
          '<div id="' + self._id + '-body" class="' + self.bodyClasses + '">' +
          (self.settings.html || '') + layout.renderHtml(self) +
          '</div>' +
          '</fieldset>'
              );
          }
      });
  }
);
    defineGlobal('global!Date', Date);
    defineGlobal('global!Math', Math);
    define(
  'ephox.katamari.api.Id',
        [
            'global!Date',
            'global!Math',
            'global!String'
        ],

  function (Date, Math, String) {
    /**
     * Generate a unique identifier.
     *
     * The unique portion of the identifier only contains an underscore
     * and digits, so that it may safely be used within HTML attributes.
     *
     * The chance of generating a non-unique identifier has been minimized
     * by combining the current time, a random number and a one-up counter.
     *
     * generate :: String -> String
     */
      var unique = 0;

      var generate = function (prefix) {
          var date = new Date();
          var time = date.getTime();
          var random = Math.floor(Math.random() * 1000000000);

          unique++;

          return prefix + '_' + random + unique + String(time);
      };

      return {
          generate: generate
      };
  }
);

    define('global!console', [], function () { if (typeof console === 'undefined') console = { log: function () {} }; return console; });
    define(
  'ephox.sugar.api.node.Element',

        [
            'ephox.katamari.api.Fun',
            'global!Error',
            'global!console',
            'global!document'
        ],

  function (Fun, Error, console, document) {
      var fromHtml = function (html, scope) {
          var doc = scope || document;
          var div = doc.createElement('div');
          div.innerHTML = html;
          if (!div.hasChildNodes() || div.childNodes.length > 1) {
              console.error('HTML does not have a single root node', html);
              throw 'HTML must have a single root node';
          }
          return fromDom(div.childNodes[0]);
      };

      var fromTag = function (tag, scope) {
          var doc = scope || document;
          var node = doc.createElement(tag);
          return fromDom(node);
      };

      var fromText = function (text, scope) {
          var doc = scope || document;
          var node = doc.createTextNode(text);
          return fromDom(node);
      };

      var fromDom = function (node) {
          if (node === null || node === undefined) throw new Error('Node cannot be null or undefined');
          return {
              dom: Fun.constant(node)
          };
      };

      return {
          fromHtml: fromHtml,
          fromTag: fromTag,
          fromText: fromText,
          fromDom: fromDom
      };
  }
);

    define(
  'ephox.katamari.api.Thunk',

        [
        ],

  function () {
      var cached = function (f) {
          var called = false;
          var r;
          return function () {
              if (!called) {
                  called = true;
                  r = f.apply(null, arguments);
              }
              return r;
          };
      };

      return {
          cached: cached
      };
  }
);

    define(
  'ephox.sugar.api.node.NodeTypes',

        [

        ],

  function () {
      return {
          ATTRIBUTE: 2,
          CDATA_SECTION: 4,
          COMMENT: 8,
          DOCUMENT: 9,
          DOCUMENT_TYPE: 10,
          DOCUMENT_FRAGMENT: 11,
          ELEMENT: 1,
          TEXT: 3,
          PROCESSING_INSTRUCTION: 7,
          ENTITY_REFERENCE: 5,
          ENTITY: 6,
          NOTATION: 12
      };
  }
);
    define(
  'ephox.sugar.api.node.Node',

        [
            'ephox.sugar.api.node.NodeTypes'
        ],

  function (NodeTypes) {
      var name = function (element) {
          var r = element.dom().nodeName;
          return r.toLowerCase();
      };

      var type = function (element) {
          return element.dom().nodeType;
      };

      var value = function (element) {
          return element.dom().nodeValue;
      };

      var isType = function (t) {
          return function (element) {
              return type(element) === t;
          };
      };

      var isComment = function (element) {
          return type(element) === NodeTypes.COMMENT || name(element) === '#comment';
      };

      var isElement = isType(NodeTypes.ELEMENT);
      var isText = isType(NodeTypes.TEXT);
      var isDocument = isType(NodeTypes.DOCUMENT);

      return {
          name: name,
          type: type,
          value: value,
          isElement: isElement,
          isText: isText,
          isDocument: isDocument,
          isComment: isComment
      };
  }
);

    define(
  'ephox.sugar.api.node.Body',

        [
            'ephox.katamari.api.Thunk',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.api.node.Node',
            'global!document'
        ],

  function (Thunk, Element, Node, document) {
    // Node.contains() is very, very, very good performance
    // http://jsperf.com/closest-vs-contains/5
      var inBody = function (element) {
      // Technically this is only required on IE, where contains() returns false for text nodes.
      // But it's cheap enough to run everywhere and Sugar doesn't have platform detection (yet).
          var dom = Node.isText(element) ? element.dom().parentNode : element.dom();

      // use ownerDocument.body to ensure this works inside iframes.
      // Normally contains is bad because an element "contains" itself, but here we want that.
          return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
      };

      var body = Thunk.cached(function () {
          return getBody(Element.fromDom(document));
      });

      var getBody = function (doc) {
          var body = doc.dom().body;
          if (body === null || body === undefined) throw 'Body is not available yet';
          return Element.fromDom(body);
      };

      return {
          body: body,
          getBody: getBody,
          inBody: inBody
      };
  }
);

    define(
  'ephox.katamari.api.Type',

        [
            'global!Array',
            'global!String'
        ],

  function (Array, String) {
      var typeOf = function (x) {
          if (x === null) return 'null';
          var t = typeof x;
          if (t === 'object' && Array.prototype.isPrototypeOf(x)) return 'array';
          if (t === 'object' && String.prototype.isPrototypeOf(x)) return 'string';
          return t;
      };

      var isType = function (type) {
          return function (value) {
              return typeOf(value) === type;
          };
      };

      return {
          isString: isType('string'),
          isObject: isType('object'),
          isArray: isType('array'),
          isNull: isType('null'),
          isBoolean: isType('boolean'),
          isUndefined: isType('undefined'),
          isFunction: isType('function'),
          isNumber: isType('number')
      };
  }
);

    define(
  'ephox.katamari.data.Immutable',

        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'global!Array',
            'global!Error'
        ],

  function (Arr, Fun, Array, Error) {
      return function () {
          var fields = arguments;
          return function (/* values */) {
        //  Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
              var values = new Array(arguments.length);
              for (var i = 0; i < values.length; i++) values[i] = arguments[i];

              if (fields.length !== values.length) { throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments'); }

              var struct = {};
              Arr.each(fields, function (name, i) {
                  struct[name] = Fun.constant(values[i]);
              });
              return struct;
          };
      };
  }
);

    define(
  'ephox.katamari.api.Obj',

        [
            'ephox.katamari.api.Option',
            'global!Object'
        ],

  function (Option, Object) {
    // There are many variations of Object iteration that are faster than the 'for-in' style:
    // http://jsperf.com/object-keys-iteration/107
    //
    // Use the native keys if it is available (IE9+), otherwise fall back to manually filtering
      var keys = (function () {
          var fastKeys = Object.keys;

      // This technically means that 'each' and 'find' on IE8 iterate through the object twice.
      // This code doesn't run on IE8 much, so it's an acceptable tradeoff.
      // If it becomes a problem we can always duplicate the feature detection inside each and find as well.
          var slowKeys = function (o) {
              var r = [];
              for (var i in o) {
                  if (o.hasOwnProperty(i)) {
                      r.push(i);
                  }
              }
              return r;
          };

          return fastKeys === undefined ? slowKeys : fastKeys;
      })();

      var each = function (obj, f) {
          var props = keys(obj);
          for (var k = 0, len = props.length; k < len; k++) {
              var i = props[k];
              var x = obj[i];
              f(x, i, obj);
          }
      };

    /** objectMap :: (JsObj(k, v), (v, k, JsObj(k, v) -> x)) -> JsObj(k, x) */
      var objectMap = function (obj, f) {
          return tupleMap(obj, function (x, i, obj) {
              return {
                  k: i,
                  v: f(x, i, obj)
              };
          });
      };

    /** tupleMap :: (JsObj(k, v), (v, k, JsObj(k, v) -> { k: x, v: y })) -> JsObj(x, y) */
      var tupleMap = function (obj, f) {
          var r = {};
          each(obj, function (x, i) {
              var tuple = f(x, i, obj);
              r[tuple.k] = tuple.v;
          });
          return r;
      };

    /** bifilter :: (JsObj(k, v), (v, k -> Bool)) -> { t: JsObj(k, v), f: JsObj(k, v) } */
      var bifilter = function (obj, pred) {
          var t = {};
          var f = {};
          each(obj, function (x, i) {
              var branch = pred(x, i) ? t : f;
              branch[i] = x;
          });
          return {
              t: t,
              f: f
          };
      };

    /** mapToArray :: (JsObj(k, v), (v, k -> a)) -> [a] */
      var mapToArray = function (obj, f) {
          var r = [];
          each(obj, function (value, name) {
              r.push(f(value, name));
          });
          return r;
      };

    /** find :: (JsObj(k, v), (v, k, JsObj(k, v) -> Bool)) -> Option v */
      var find = function (obj, pred) {
          var props = keys(obj);
          for (var k = 0, len = props.length; k < len; k++) {
              var i = props[k];
              var x = obj[i];
              if (pred(x, i, obj)) {
                  return Option.some(x);
              }
          }
          return Option.none();
      };

    /** values :: JsObj(k, v) -> [v] */
      var values = function (obj) {
          return mapToArray(obj, function (v) {
              return v;
          });
      };

      var size = function (obj) {
          return values(obj).length;
      };

      return {
          bifilter: bifilter,
          each: each,
          map: objectMap,
          mapToArray: mapToArray,
          tupleMap: tupleMap,
          find: find,
          keys: keys,
          values: values,
          size: size
      };
  }
);
    define(
  'ephox.katamari.util.BagUtils',

        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Type',
            'global!Error'
        ],

  function (Arr, Type, Error) {
      var sort = function (arr) {
          return arr.slice(0).sort();
      };

      var reqMessage = function (required, keys) {
          throw new Error('All required keys (' + sort(required).join(', ') + ') were not specified. Specified keys were: ' + sort(keys).join(', ') + '.');
      };

      var unsuppMessage = function (unsupported) {
          throw new Error('Unsupported keys for object: ' + sort(unsupported).join(', '));
      };

      var validateStrArr = function (label, array) {
          if (!Type.isArray(array)) throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
          Arr.each(array, function (a) {
              if (!Type.isString(a)) throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
          });
      };

      var invalidTypeMessage = function (incorrect, type) {
          throw new Error('All values need to be of type: ' + type + '. Keys (' + sort(incorrect).join(', ') + ') were not.');
      };

      var checkDupes = function (everything) {
          var sorted = sort(everything);
          var dupe = Arr.find(sorted, function (s, i) {
              return i < sorted.length - 1 && s === sorted[i + 1];
          });

          dupe.each(function (d) {
              throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
          });
      };

      return {
          sort: sort,
          reqMessage: reqMessage,
          unsuppMessage: unsuppMessage,
          validateStrArr: validateStrArr,
          invalidTypeMessage: invalidTypeMessage,
          checkDupes: checkDupes
      };
  }
);
    define(
  'ephox.katamari.data.MixedBag',

        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Obj',
            'ephox.katamari.api.Option',
            'ephox.katamari.util.BagUtils',
            'global!Error',
            'global!Object'
        ],

  function (Arr, Fun, Obj, Option, BagUtils, Error, Object) {
      return function (required, optional) {
          var everything = required.concat(optional);
          if (everything.length === 0) throw new Error('You must specify at least one required or optional field.');

          BagUtils.validateStrArr('required', required);
          BagUtils.validateStrArr('optional', optional);

          BagUtils.checkDupes(everything);

          return function (obj) {
              var keys = Obj.keys(obj);

        // Ensure all required keys are present.
              var allReqd = Arr.forall(required, function (req) {
                  return Arr.contains(keys, req);
              });

              if (!allReqd) BagUtils.reqMessage(required, keys);

              var unsupported = Arr.filter(keys, function (key) {
                  return !Arr.contains(everything, key);
              });

              if (unsupported.length > 0) BagUtils.unsuppMessage(unsupported);

              var r = {};
              Arr.each(required, function (req) {
                  r[req] = Fun.constant(obj[req]);
              });

              Arr.each(optional, function (opt) {
                  r[opt] = Fun.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]) : Option.none());
              });

              return r;
          };
      };
  }
);
    define(
  'ephox.katamari.api.Struct',

        [
            'ephox.katamari.data.Immutable',
            'ephox.katamari.data.MixedBag'
        ],

  function (Immutable, MixedBag) {
      return {
          immutable: Immutable,
          immutableBag: MixedBag
      };
  }
);

    define(
  'ephox.sugar.alien.Recurse',

        [

        ],

  function () {
    /**
     * Applies f repeatedly until it completes (by returning Option.none()).
     *
     * Normally would just use recursion, but JavaScript lacks tail call optimisation.
     *
     * This is what recursion looks like when manually unravelled :)
     */
      var toArray = function (target, f) {
          var r = [];

          var recurse = function (e) {
              r.push(e);
              return f(e);
          };

          var cur = f(target);
          do {
              cur = cur.bind(recurse);
          } while (cur.isSome());

          return r;
      };

      return {
          toArray: toArray
      };
  }
);
    define(
  'ephox.sand.api.Node',

        [
            'ephox.sand.util.Global'
        ],

  function (Global) {
    /*
     * MDN says (yes) for IE, but it's undefined on IE8
     */
      var node = function () {
          var f = Global.getOrDie('Node');
          return f;
      };

    /*
     * Most of numerosity doesn't alter the methods on the object.
     * We're making an exception for Node, because bitwise and is so easy to get wrong.
     *
     * Might be nice to ADT this at some point instead of having individual methods.
     */

      var compareDocumentPosition = function (a, b, match) {
      // Returns: 0 if e1 and e2 are the same node, or a bitmask comparing the positions
      // of nodes e1 and e2 in their documents. See the URL below for bitmask interpretation
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition
          return (a.compareDocumentPosition(b) & match) !== 0;
      };

      var documentPositionPreceding = function (a, b) {
          return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
      };

      var documentPositionContainedBy = function (a, b) {
          return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
      };

      return {
          documentPositionPreceding: documentPositionPreceding,
          documentPositionContainedBy: documentPositionContainedBy
      };
  }
);
    defineGlobal('global!Number', Number);
    define(
  'ephox.sand.detect.Version',

        [
            'ephox.katamari.api.Arr',
            'global!Number',
            'global!String'
        ],

  function (Arr, Number, String) {
      var firstMatch = function (regexes, s) {
          for (var i = 0; i < regexes.length; i++) {
              var x = regexes[i];
              if (x.test(s)) return x;
          }
          return undefined;
      };

      var find = function (regexes, agent) {
          var r = firstMatch(regexes, agent);
          if (!r) return { major: 0, minor: 0 };
          var group = function (i) {
              return Number(agent.replace(r, '$' + i));
          };
          return nu(group(1), group(2));
      };

      var detect = function (versionRegexes, agent) {
          var cleanedAgent = String(agent).toLowerCase();

          if (versionRegexes.length === 0) return unknown();
          return find(versionRegexes, cleanedAgent);
      };

      var unknown = function () {
          return nu(0, 0);
      };

      var nu = function (major, minor) {
          return { major: major, minor: minor };
      };

      return {
          nu: nu,
          detect: detect,
          unknown: unknown
      };
  }
);
    define(
  'ephox.sand.core.Browser',

        [
            'ephox.katamari.api.Fun',
            'ephox.sand.detect.Version'
        ],

  function (Fun, Version) {
      var edge = 'Edge';
      var chrome = 'Chrome';
      var ie = 'IE';
      var opera = 'Opera';
      var firefox = 'Firefox';
      var safari = 'Safari';

      var isBrowser = function (name, current) {
          return function () {
              return current === name;
          };
      };

      var unknown = function () {
          return nu({
              current: undefined,
              version: Version.unknown()
          });
      };

      var nu = function (info) {
          var current = info.current;
          var version = info.version;

          return {
              current: current,
              version: version,

        // INVESTIGATE: Rename to Edge ?
              isEdge: isBrowser(edge, current),
              isChrome: isBrowser(chrome, current),
        // NOTE: isIe just looks too weird
              isIE: isBrowser(ie, current),
              isOpera: isBrowser(opera, current),
              isFirefox: isBrowser(firefox, current),
              isSafari: isBrowser(safari, current)
          };
      };

      return {
          unknown: unknown,
          nu: nu,
          edge: Fun.constant(edge),
          chrome: Fun.constant(chrome),
          ie: Fun.constant(ie),
          opera: Fun.constant(opera),
          firefox: Fun.constant(firefox),
          safari: Fun.constant(safari)
      };
  }
);
    define(
  'ephox.sand.core.OperatingSystem',

        [
            'ephox.katamari.api.Fun',
            'ephox.sand.detect.Version'
        ],

  function (Fun, Version) {
      var windows = 'Windows';
      var ios = 'iOS';
      var android = 'Android';
      var linux = 'Linux';
      var osx = 'OSX';
      var solaris = 'Solaris';
      var freebsd = 'FreeBSD';

    // Though there is a bit of dupe with this and Browser, trying to
    // reuse code makes it much harder to follow and change.
      var isOS = function (name, current) {
          return function () {
              return current === name;
          };
      };

      var unknown = function () {
          return nu({
              current: undefined,
              version: Version.unknown()
          });
      };

      var nu = function (info) {
          var current = info.current;
          var version = info.version;

          return {
              current: current,
              version: version,

              isWindows: isOS(windows, current),
        // TODO: Fix capitalisation
              isiOS: isOS(ios, current),
              isAndroid: isOS(android, current),
              isOSX: isOS(osx, current),
              isLinux: isOS(linux, current),
              isSolaris: isOS(solaris, current),
              isFreeBSD: isOS(freebsd, current)
          };
      };

      return {
          unknown: unknown,
          nu: nu,

          windows: Fun.constant(windows),
          ios: Fun.constant(ios),
          android: Fun.constant(android),
          linux: Fun.constant(linux),
          osx: Fun.constant(osx),
          solaris: Fun.constant(solaris),
          freebsd: Fun.constant(freebsd)
      };
  }
);
    define(
  'ephox.sand.detect.DeviceType',

        [
            'ephox.katamari.api.Fun'
        ],

  function (Fun) {
      return function (os, browser, userAgent) {
          var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
          var isiPhone = os.isiOS() && !isiPad;
          var isAndroid3 = os.isAndroid() && os.version.major === 3;
          var isAndroid4 = os.isAndroid() && os.version.major === 4;
          var isTablet = isiPad || isAndroid3 || (isAndroid4 && /mobile/i.test(userAgent) === true);
          var isTouch = os.isiOS() || os.isAndroid();
          var isPhone = isTouch && !isTablet;

          var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;

          return {
              isiPad: Fun.constant(isiPad),
              isiPhone: Fun.constant(isiPhone),
              isTablet: Fun.constant(isTablet),
              isPhone: Fun.constant(isPhone),
              isTouch: Fun.constant(isTouch),
              isAndroid: os.isAndroid,
              isiOS: os.isiOS,
              isWebView: Fun.constant(iOSwebview)
          };
      };
  }
);
    define(
  'ephox.sand.detect.UaString',

        [
            'ephox.katamari.api.Arr',
            'ephox.sand.detect.Version',
            'global!String'
        ],

  function (Arr, Version, String) {
      var detect = function (candidates, userAgent) {
          var agent = String(userAgent).toLowerCase();
          return Arr.find(candidates, function (candidate) {
              return candidate.search(agent);
          });
      };

    // They (browser and os) are the same at the moment, but they might
    // not stay that way.
      var detectBrowser = function (browsers, userAgent) {
          return detect(browsers, userAgent).map(function (browser) {
              var version = Version.detect(browser.versionRegexes, userAgent);
              return {
                  current: browser.name,
                  version: version
              };
          });
      };

      var detectOs = function (oses, userAgent) {
          return detect(oses, userAgent).map(function (os) {
              var version = Version.detect(os.versionRegexes, userAgent);
              return {
                  current: os.name,
                  version: version
              };
          });
      };

      return {
          detectBrowser: detectBrowser,
          detectOs: detectOs
      };
  }
);
    define(
  'ephox.katamari.str.StrAppend',

        [

        ],

  function () {
      var addToStart = function (str, prefix) {
          return prefix + str;
      };

      var addToEnd = function (str, suffix) {
          return str + suffix;
      };

      var removeFromStart = function (str, numChars) {
          return str.substring(numChars);
      };

      var removeFromEnd = function (str, numChars) {
          return str.substring(0, str.length - numChars);
      };

      return {
          addToStart: addToStart,
          addToEnd: addToEnd,
          removeFromStart: removeFromStart,
          removeFromEnd: removeFromEnd
      };
  }
);
    define(
  'ephox.katamari.str.StringParts',

        [
            'ephox.katamari.api.Option',
            'global!Error'
        ],

  function (Option, Error) {
    /** Return the first 'count' letters from 'str'.
-     *  e.g. first("abcde", 2) === "ab"
-     */
      var first = function (str, count) {
          return str.substr(0, count);
      };

    /** Return the last 'count' letters from 'str'.
    *  e.g. last("abcde", 2) === "de"
    */
      var last = function (str, count) {
          return str.substr(str.length - count, str.length);
      };

      var head = function (str) {
          return str === '' ? Option.none() : Option.some(str.substr(0, 1));
      };

      var tail = function (str) {
          return str === '' ? Option.none() : Option.some(str.substring(1));
      };

      return {
          first: first,
          last: last,
          head: head,
          tail: tail
      };
  }
);
    define(
  'ephox.katamari.api.Strings',

        [
            'ephox.katamari.str.StrAppend',
            'ephox.katamari.str.StringParts',
            'global!Error'
        ],

  function (StrAppend, StringParts, Error) {
      var checkRange = function (str, substr, start) {
          if (substr === '') return true;
          if (str.length < substr.length) return false;
          var x = str.substr(start, start + substr.length);
          return x === substr;
      };

    /** Given a string and object, perform template-replacements on the string, as specified by the object.
     * Any template fields of the form ${name} are replaced by the string or number specified as obj["name"]
     * Based on Douglas Crockford's 'supplant' method for template-replace of strings. Uses different template format.
     */
      var supplant = function (str, obj) {
          var isStringOrNumber = function (a) {
              var t = typeof a;
              return t === 'string' || t === 'number';
          };

          return str.replace(/\${([^{}]*)}/g,
        function (a, b) {
            var value = obj[b];
            return isStringOrNumber(value) ? value : a;
        }
      );
      };

      var removeLeading = function (str, prefix) {
          return startsWith(str, prefix) ? StrAppend.removeFromStart(str, prefix.length) : str;
      };

      var removeTrailing = function (str, prefix) {
          return endsWith(str, prefix) ? StrAppend.removeFromEnd(str, prefix.length) : str;
      };

      var ensureLeading = function (str, prefix) {
          return startsWith(str, prefix) ? str : StrAppend.addToStart(str, prefix);
      };

      var ensureTrailing = function (str, prefix) {
          return endsWith(str, prefix) ? str : StrAppend.addToEnd(str, prefix);
      };

      var contains = function (str, substr) {
          return str.indexOf(substr) !== -1;
      };

      var capitalize = function (str) {
          return StringParts.head(str).bind(function (head) {
              return StringParts.tail(str).map(function (tail) {
                  return head.toUpperCase() + tail;
              });
          }).getOr(str);
      };

    /** Does 'str' start with 'prefix'?
     *  Note: all strings start with the empty string.
     *        More formally, for all strings x, startsWith(x, "").
     *        This is so that for all strings x and y, startsWith(y + x, y)
     */
      var startsWith = function (str, prefix) {
          return checkRange(str, prefix, 0);
      };

    /** Does 'str' end with 'suffix'?
     *  Note: all strings end with the empty string.
     *        More formally, for all strings x, endsWith(x, "").
     *        This is so that for all strings x and y, endsWith(x + y, y)
     */
      var endsWith = function (str, suffix) {
          return checkRange(str, suffix, str.length - suffix.length);
      };

    /** removes all leading and trailing spaces */
      var trim = function (str) {
          return str.replace(/^\s+|\s+$/g, '');
      };

      var lTrim = function (str) {
          return str.replace(/^\s+/g, '');
      };

      var rTrim = function (str) {
          return str.replace(/\s+$/g, '');
      };

      return {
          supplant: supplant,
          startsWith: startsWith,
          removeLeading: removeLeading,
          removeTrailing: removeTrailing,
          ensureLeading: ensureLeading,
          ensureTrailing: ensureTrailing,
          endsWith: endsWith,
          contains: contains,
          trim: trim,
          lTrim: lTrim,
          rTrim: rTrim,
          capitalize: capitalize
      };
  }
);

    define(
  'ephox.sand.info.PlatformInfo',

        [
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Strings'
        ],

  function (Fun, Strings) {
      var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;

      var checkContains = function (target) {
          return function (uastring) {
              return Strings.contains(uastring, target);
          };
      };

      var browsers = [
          {
              name: 'Edge',
              versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
              search: function (uastring) {
                  var monstrosity = Strings.contains(uastring, 'edge/') && Strings.contains(uastring, 'chrome') && Strings.contains(uastring, 'safari') && Strings.contains(uastring, 'applewebkit');
                  return monstrosity;
              }
          },
          {
              name: 'Chrome',
              versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
              search: function (uastring) {
                  return Strings.contains(uastring, 'chrome') && !Strings.contains(uastring, 'chromeframe');
              }
          },
          {
              name: 'IE',
              versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
              search: function (uastring) {
                  return Strings.contains(uastring, 'msie') || Strings.contains(uastring, 'trident');
              }
          },
      // INVESTIGATE: Is this still the Opera user agent?
          {
              name: 'Opera',
              versionRegexes: [normalVersionRegex, /.*?opera\/([0-9]+)\.([0-9]+).*/],
              search: checkContains('opera')
          },
          {
              name: 'Firefox',
              versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
              search: checkContains('firefox')
          },
          {
              name: 'Safari',
              versionRegexes: [normalVersionRegex, /.*?cpu os ([0-9]+)_([0-9]+).*/],
              search: function (uastring) {
                  return (Strings.contains(uastring, 'safari') || Strings.contains(uastring, 'mobile/')) && Strings.contains(uastring, 'applewebkit');
              }
          }
      ];

      var oses = [
          {
              name: 'Windows',
              search: checkContains('win'),
              versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
          },
          {
              name: 'iOS',
              search: function (uastring) {
                  return Strings.contains(uastring, 'iphone') || Strings.contains(uastring, 'ipad');
              },
              versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
          },
          {
              name: 'Android',
              search: checkContains('android'),
              versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
          },
          {
              name: 'OSX',
              search: checkContains('os x'),
              versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
          },
          {
              name: 'Linux',
              search: checkContains('linux'),
              versionRegexes: [ ]
          },
          { name: 'Solaris',
              search: checkContains('sunos'),
              versionRegexes: [ ]
          },
          {
              name: 'FreeBSD',
              search: checkContains('freebsd'),
              versionRegexes: [ ]
          }
      ];

      return {
          browsers: Fun.constant(browsers),
          oses: Fun.constant(oses)
      };
  }
);
    define(
  'ephox.sand.core.PlatformDetection',

        [
            'ephox.sand.core.Browser',
            'ephox.sand.core.OperatingSystem',
            'ephox.sand.detect.DeviceType',
            'ephox.sand.detect.UaString',
            'ephox.sand.info.PlatformInfo'
        ],

  function (Browser, OperatingSystem, DeviceType, UaString, PlatformInfo) {
      var detect = function (userAgent) {
          var browsers = PlatformInfo.browsers();
          var oses = PlatformInfo.oses();

          var browser = UaString.detectBrowser(browsers, userAgent).fold(
        Browser.unknown,
        Browser.nu
      );
          var os = UaString.detectOs(oses, userAgent).fold(
        OperatingSystem.unknown,
        OperatingSystem.nu
      );
          var deviceType = DeviceType(os, browser, userAgent);

          return {
              browser: browser,
              os: os,
              deviceType: deviceType
          };
      };

      return {
          detect: detect
      };
  }
);
    defineGlobal('global!navigator', navigator);
    define(
  'ephox.sand.api.PlatformDetection',

        [
            'ephox.katamari.api.Thunk',
            'ephox.sand.core.PlatformDetection',
            'global!navigator'
        ],

  function (Thunk, PlatformDetection, navigator) {
      var detect = Thunk.cached(function () {
          var userAgent = navigator.userAgent;
          return PlatformDetection.detect(userAgent);
      });

      return {
          detect: detect
      };
  }
);
    define(
  'ephox.sugar.api.search.Selectors',

        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Option',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.api.node.NodeTypes',
            'global!Error',
            'global!document'
        ],

  function (Arr, Option, Element, NodeTypes, Error, document) {
    /*
     * There's a lot of code here; the aim is to allow the browser to optimise constant comparisons,
     * instead of doing object lookup feature detection on every call
     */
      var STANDARD = 0;
      var MSSTANDARD = 1;
      var WEBKITSTANDARD = 2;
      var FIREFOXSTANDARD = 3;

      var selectorType = (function () {
          var test = document.createElement('span');
      // As of Chrome 34 / Safari 7.1 / FireFox 34, everyone except IE has the unprefixed function.
      // Still check for the others, but do it last.
          return test.matches !== undefined ? STANDARD
             : test.msMatchesSelector !== undefined ? MSSTANDARD
             : test.webkitMatchesSelector !== undefined ? WEBKITSTANDARD
             : test.mozMatchesSelector !== undefined ? FIREFOXSTANDARD
             : -1;
      })();

      var ELEMENT = NodeTypes.ELEMENT;
      var DOCUMENT = NodeTypes.DOCUMENT;

      var is = function (element, selector) {
          var elem = element.dom();
          if (elem.nodeType !== ELEMENT) return false; // documents have querySelector but not matches

      // As of Chrome 34 / Safari 7.1 / FireFox 34, everyone except IE has the unprefixed function.
      // Still check for the others, but do it last.
          else if (selectorType === STANDARD) return elem.matches(selector);
          else if (selectorType === MSSTANDARD) return elem.msMatchesSelector(selector);
          else if (selectorType === WEBKITSTANDARD) return elem.webkitMatchesSelector(selector);
          else if (selectorType === FIREFOXSTANDARD) return elem.mozMatchesSelector(selector);
          else throw new Error('Browser lacks native selectors'); // unfortunately we can't throw this on startup :(
      };

      var bypassSelector = function (dom) {
      // Only elements and documents support querySelector
          return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT ||
              // IE fix for complex queries on empty nodes: http://jsfiddle.net/spyder/fv9ptr5L/
              dom.childElementCount === 0;
      };

      var all = function (selector, scope) {
          var base = scope === undefined ? document : scope.dom();
          return bypassSelector(base) ? [] : Arr.map(base.querySelectorAll(selector), Element.fromDom);
      };

      var one = function (selector, scope) {
          var base = scope === undefined ? document : scope.dom();
          return bypassSelector(base) ? Option.none() : Option.from(base.querySelector(selector)).map(Element.fromDom);
      };

      return {
          all: all,
          is: is,
          one: one
      };
  }
);

    define(
  'ephox.sugar.api.dom.Compare',

        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'ephox.sand.api.Node',
            'ephox.sand.api.PlatformDetection',
            'ephox.sugar.api.search.Selectors'
        ],

  function (Arr, Fun, Node, PlatformDetection, Selectors) {
      var eq = function (e1, e2) {
          return e1.dom() === e2.dom();
      };

      var isEqualNode = function (e1, e2) {
          return e1.dom().isEqualNode(e2.dom());
      };

      var member = function (element, elements) {
          return Arr.exists(elements, Fun.curry(eq, element));
      };

    // DOM contains() method returns true if e1===e2, we define our contains() to return false (a node does not contain itself).
      var regularContains = function (e1, e2) {
          var d1 = e1.dom(), d2 = e2.dom();
          return d1 === d2 ? false : d1.contains(d2);
      };

      var ieContains = function (e1, e2) {
      // IE only implements the contains() method for Element nodes.
      // It fails for Text nodes, so implement it using compareDocumentPosition()
      // https://connect.microsoft.com/IE/feedback/details/780874/node-contains-is-incorrect
      // Note that compareDocumentPosition returns CONTAINED_BY if 'e2 *is_contained_by* e1':
      // Also, compareDocumentPosition defines a node containing itself as false.
          return Node.documentPositionContainedBy(e1.dom(), e2.dom());
      };

      var browser = PlatformDetection.detect().browser;

    // Returns: true if node e1 contains e2, otherwise false.
    // (returns false if e1===e2: A node does not contain itself).
      var contains = browser.isIE() ? ieContains : regularContains;

      return {
          eq: eq,
          isEqualNode: isEqualNode,
          member: member,
          contains: contains,

      // Only used by DomUniverse. Remove (or should Selectors.is move here?)
          is: Selectors.is
      };
  }
);

    define(
  'ephox.sugar.api.search.Traverse',

        [
            'ephox.katamari.api.Type',
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Option',
            'ephox.katamari.api.Struct',
            'ephox.sugar.alien.Recurse',
            'ephox.sugar.api.dom.Compare',
            'ephox.sugar.api.node.Element'
        ],

  function (Type, Arr, Fun, Option, Struct, Recurse, Compare, Element) {
    // The document associated with the current element
      var owner = function (element) {
          return Element.fromDom(element.dom().ownerDocument);
      };

      var documentElement = function (element) {
      // TODO: Avoid unnecessary wrap/unwrap here
          var doc = owner(element);
          return Element.fromDom(doc.dom().documentElement);
      };

    // The window element associated with the element
      var defaultView = function (element) {
          var el = element.dom();
          var defaultView = el.ownerDocument.defaultView;
          return Element.fromDom(defaultView);
      };

      var parent = function (element) {
          var dom = element.dom();
          return Option.from(dom.parentNode).map(Element.fromDom);
      };

      var findIndex = function (element) {
          return parent(element).bind(function (p) {
        // TODO: Refactor out children so we can avoid the constant unwrapping
              var kin = children(p);
              return Arr.findIndex(kin, function (elem) {
                  return Compare.eq(element, elem);
              });
          });
      };

      var parents = function (element, isRoot) {
          var stop = Type.isFunction(isRoot) ? isRoot : Fun.constant(false);

      // This is used a *lot* so it needs to be performant, not recursive
          var dom = element.dom();
          var ret = [];

          while (dom.parentNode !== null && dom.parentNode !== undefined) {
              var rawParent = dom.parentNode;
              var parent = Element.fromDom(rawParent);
              ret.push(parent);

              if (stop(parent) === true) break;
              else dom = rawParent;
          }
          return ret;
      };

      var siblings = function (element) {
      // TODO: Refactor out children so we can just not add self instead of filtering afterwards
          var filterSelf = function (elements) {
              return Arr.filter(elements, function (x) {
                  return !Compare.eq(element, x);
              });
          };

          return parent(element).map(children).map(filterSelf).getOr([]);
      };

      var offsetParent = function (element) {
          var dom = element.dom();
          return Option.from(dom.offsetParent).map(Element.fromDom);
      };

      var prevSibling = function (element) {
          var dom = element.dom();
          return Option.from(dom.previousSibling).map(Element.fromDom);
      };

      var nextSibling = function (element) {
          var dom = element.dom();
          return Option.from(dom.nextSibling).map(Element.fromDom);
      };

      var prevSiblings = function (element) {
      // This one needs to be reversed, so they're still in DOM order
          return Arr.reverse(Recurse.toArray(element, prevSibling));
      };

      var nextSiblings = function (element) {
          return Recurse.toArray(element, nextSibling);
      };

      var children = function (element) {
          var dom = element.dom();
          return Arr.map(dom.childNodes, Element.fromDom);
      };

      var child = function (element, index) {
          var children = element.dom().childNodes;
          return Option.from(children[index]).map(Element.fromDom);
      };

      var firstChild = function (element) {
          return child(element, 0);
      };

      var lastChild = function (element) {
          return child(element, element.dom().childNodes.length - 1);
      };

      var childNodesCount = function (element, index) {
          return element.dom().childNodes.length;
      };

      var spot = Struct.immutable('element', 'offset');
      var leaf = function (element, offset) {
          var cs = children(element);
          return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
      };

      return {
          owner: owner,
          defaultView: defaultView,
          documentElement: documentElement,
          parent: parent,
          findIndex: findIndex,
          parents: parents,
          siblings: siblings,
          prevSibling: prevSibling,
          offsetParent: offsetParent,
          prevSiblings: prevSiblings,
          nextSibling: nextSibling,
          nextSiblings: nextSiblings,
          children: children,
          child: child,
          firstChild: firstChild,
          lastChild: lastChild,
          childNodesCount: childNodesCount,
          leaf: leaf
      };
  }
);

    define(
  'ephox.sugar.api.search.PredicateFilter',

        [
            'ephox.katamari.api.Arr',
            'ephox.sugar.api.node.Body',
            'ephox.sugar.api.search.Traverse'
        ],

  function (Arr, Body, Traverse) {
    // maybe TraverseWith, similar to traverse but with a predicate?

      var all = function (predicate) {
          return descendants(Body.body(), predicate);
      };

      var ancestors = function (scope, predicate, isRoot) {
          return Arr.filter(Traverse.parents(scope, isRoot), predicate);
      };

      var siblings = function (scope, predicate) {
          return Arr.filter(Traverse.siblings(scope), predicate);
      };

      var children = function (scope, predicate) {
          return Arr.filter(Traverse.children(scope), predicate);
      };

      var descendants = function (scope, predicate) {
          var result = [];

      // Recurse.toArray() might help here
          Arr.each(Traverse.children(scope), function (x) {
              if (predicate(x)) {
                  result = result.concat([ x ]);
              }
              result = result.concat(descendants(x, predicate));
          });
          return result;
      };

      return {
          all: all,
          ancestors: ancestors,
          siblings: siblings,
          children: children,
          descendants: descendants
      };
  }
);

    define(
  'ephox.sugar.api.search.SelectorFilter',

        [
            'ephox.sugar.api.search.PredicateFilter',
            'ephox.sugar.api.search.Selectors'
        ],

  function (PredicateFilter, Selectors) {
      var all = function (selector) {
          return Selectors.all(selector);
      };

    // For all of the following:
    //
    // jQuery does siblings of firstChild. IE9+ supports scope.dom().children (similar to Traverse.children but elements only).
    // Traverse should also do this (but probably not by default).
    //

      var ancestors = function (scope, selector, isRoot) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all this wrapping and unwrapping
          return PredicateFilter.ancestors(scope, function (e) {
              return Selectors.is(e, selector);
          }, isRoot);
      };

      var siblings = function (scope, selector) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all the wrapping and unwrapping
          return PredicateFilter.siblings(scope, function (e) {
              return Selectors.is(e, selector);
          });
      };

      var children = function (scope, selector) {
      // It may surprise you to learn this is exactly what JQuery does
      // TODO: Avoid all the wrapping and unwrapping
          return PredicateFilter.children(scope, function (e) {
              return Selectors.is(e, selector);
          });
      };

      var descendants = function (scope, selector) {
          return Selectors.all(selector, scope);
      };

      return {
          all: all,
          ancestors: ancestors,
          siblings: siblings,
          children: children,
          descendants: descendants
      };
  }
);

/**
 * LinkTargets.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This module is enables you to get anything that you can link to in a element.
 *
 * @private
 * @class tinymce.ui.LinkTargets
 */
    define(
  'tinymce.ui.content.LinkTargets',
        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Id',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.api.search.SelectorFilter',
            'tinymce.core.dom.DOMUtils',
            'tinymce.core.util.Tools'
        ],
  function (Arr, Fun, Id, Element, SelectorFilter, DOMUtils, Tools) {
      var trim = Tools.trim;
      var hasContentEditableState = function (value) {
          return function (node) {
              if (node && node.nodeType === 1) {
                  if (node.contentEditable === value) {
                      return true;
                  }

                  if (node.getAttribute('data-mce-contenteditable') === value) {
                      return true;
                  }
              }

              return false;
          };
      };

      var isContentEditableTrue = hasContentEditableState('true');
      var isContentEditableFalse = hasContentEditableState('false');

      var create = function (type, title, url, level, attach) {
          return {
              type: type,
              title: title,
              url: url,
              level: level,
              attach: attach
          };
      };

      var isChildOfContentEditableTrue = function (node) {
          while ((node = node.parentNode)) {
              var value = node.contentEditable;
              if (value && value !== 'inherit') {
                  return isContentEditableTrue(node);
              }
          }

          return false;
      };

      var select = function (selector, root) {
          return Arr.map(SelectorFilter.descendants(Element.fromDom(root), selector), function (element) {
              return element.dom();
          });
      };

      var getElementText = function (elm) {
          return elm.innerText || elm.textContent;
      };

      var getOrGenerateId = function (elm) {
          return elm.id ? elm.id : Id.generate('h');
      };

      var isAnchor = function (elm) {
          return elm && elm.nodeName === 'A' && (elm.id || elm.name);
      };

      var isValidAnchor = function (elm) {
          return isAnchor(elm) && isEditable(elm);
      };

      var isHeader = function (elm) {
          return elm && /^(H[1-6])$/.test(elm.nodeName);
      };

      var isEditable = function (elm) {
          return isChildOfContentEditableTrue(elm) && !isContentEditableFalse(elm);
      };

      var isValidHeader = function (elm) {
          return isHeader(elm) && isEditable(elm);
      };

      var getLevel = function (elm) {
          return isHeader(elm) ? parseInt(elm.nodeName.substr(1), 10) : 0;
      };

      var headerTarget = function (elm) {
          var headerId = getOrGenerateId(elm);

          var attach = function () {
              elm.id = headerId;
          };

          return create('header', getElementText(elm), '#' + headerId, getLevel(elm), attach);
      };

      var anchorTarget = function (elm) {
          var anchorId = elm.id || elm.name;
          var anchorText = getElementText(elm);

          return create('anchor', anchorText || '#' + anchorId, '#' + anchorId, 0, Fun.noop);
      };

      var getHeaderTargets = function (elms) {
          return Arr.map(Arr.filter(elms, isValidHeader), headerTarget);
      };

      var getAnchorTargets = function (elms) {
          return Arr.map(Arr.filter(elms, isValidAnchor), anchorTarget);
      };

      var getTargetElements = function (elm) {
          var elms = select('h1,h2,h3,h4,h5,h6,a:not([href])', elm);
          return elms;
      };

      var hasTitle = function (target) {
          return trim(target.title).length > 0;
      };

      var find = function (elm) {
          var elms = getTargetElements(elm);
          return Arr.filter(getHeaderTargets(elms).concat(getAnchorTargets(elms)), hasTitle);
      };

      return {
          find: find
      };
  }
);

/**
 * FilePicker.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a file picker control.
 *
 * @class tinymce.ui.FilePicker
 * @extends tinymce.ui.ComboBox
 */
    define(
  'tinymce.ui.FilePicker',
        [
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'global!window',
            'tinymce.ui.content.LinkTargets',
            'tinymce.core.EditorManager',
            'tinymce.ui.ComboBox',
            'tinymce.core.util.Tools'
        ],
  function (Arr, Fun, window, LinkTargets, EditorManager, ComboBox, Tools) {
      'use strict';

      var getActiveEditor = function () {
          return window.tinymce ? window.tinymce.activeEditor : EditorManager.activeEditor;
      };

      var history = {};
      var HISTORY_LENGTH = 5;

      var clearHistory = function () {
          history = {};
      };

      var toMenuItem = function (target) {
          return {
              title: target.title,
              value: {
                  title: { raw: target.title },
                  url: target.url,
                  attach: target.attach
              }
          };
      };

      var toMenuItems = function (targets) {
          return Tools.map(targets, toMenuItem);
      };

      var staticMenuItem = function (title, url) {
          return {
              title: title,
              value: {
                  title: title,
                  url: url,
                  attach: Fun.noop
              }
          };
      };

      var isUniqueUrl = function (url, targets) {
          var foundTarget = Arr.exists(targets, function (target) {
              return target.url === url;
          });

          return !foundTarget;
      };

      var getSetting = function (editorSettings, name, defaultValue) {
          var value = name in editorSettings ? editorSettings[name] : defaultValue;
          return value === false ? null : value;
      };

      var createMenuItems = function (term, targets, fileType, editorSettings) {
          var separator = { title: '-' };

          var fromHistoryMenuItems = function (history) {
              var historyItems = history.hasOwnProperty(fileType) ? history[fileType] : [ ];
              var uniqueHistory = Arr.filter(historyItems, function (url) {
                  return isUniqueUrl(url, targets);
              });

              return Tools.map(uniqueHistory, function (url) {
                  return {
                      title: url,
                      value: {
                          title: url,
                          url: url,
                          attach: Fun.noop
                      }
                  };
              });
          };

          var fromMenuItems = function (type) {
              var filteredTargets = Arr.filter(targets, function (target) {
                  return target.type === type;
              });

              return toMenuItems(filteredTargets);
          };

          var anchorMenuItems = function () {
              var anchorMenuItems = fromMenuItems('anchor');
              var topAnchor = getSetting(editorSettings, 'anchor_top', '#top');
              var bottomAchor = getSetting(editorSettings, 'anchor_bottom', '#bottom');

              if (topAnchor !== null) {
                  anchorMenuItems.unshift(staticMenuItem('<top>', topAnchor));
              }

              if (bottomAchor !== null) {
                  anchorMenuItems.push(staticMenuItem('<bottom>', bottomAchor));
              }

              return anchorMenuItems;
          };

          var join = function (items) {
              return Arr.foldl(items, function (a, b) {
                  var bothEmpty = a.length === 0 || b.length === 0;
                  return bothEmpty ? a.concat(b) : a.concat(separator, b);
              }, []);
          };

          if (editorSettings.typeahead_urls === false) {
              return [];
          }

          return fileType === 'file' ? join([
              filterByQuery(term, fromHistoryMenuItems(history)),
              filterByQuery(term, fromMenuItems('header')),
              filterByQuery(term, anchorMenuItems())
          ]) : filterByQuery(term, fromHistoryMenuItems(history));
      };

      var addToHistory = function (url, fileType) {
          var items = history[fileType];

          if (!/^https?/.test(url)) {
              return;
          }

          if (items) {
              if (Arr.indexOf(items, url) === -1) {
                  history[fileType] = items.slice(0, HISTORY_LENGTH).concat(url);
              }
          } else {
              history[fileType] = [url];
          }
      };

      var filterByQuery = function (term, menuItems) {
          var lowerCaseTerm = term.toLowerCase();
          var result = Tools.grep(menuItems, function (item) {
              return item.title.toLowerCase().indexOf(lowerCaseTerm) !== -1;
          });

          return result.length === 1 && result[0].title === term ? [] : result;
      };

      var getTitle = function (linkDetails) {
          var title = linkDetails.title;
          return title.raw ? title.raw : title;
      };

      var setupAutoCompleteHandler = function (ctrl, editorSettings, bodyElm, fileType) {
          var autocomplete = function (term) {
              var linkTargets = LinkTargets.find(bodyElm);
              var menuItems = createMenuItems(term, linkTargets, fileType, editorSettings);
              ctrl.showAutoComplete(menuItems, term);
          };

          ctrl.on('autocomplete', function () {
              autocomplete(ctrl.value());
          });

          ctrl.on('selectitem', function (e) {
              var linkDetails = e.value;

              ctrl.value(linkDetails.url);
              var title = getTitle(linkDetails);

              if (fileType === 'image') {
                  ctrl.fire('change', { meta: { alt: title, attach: linkDetails.attach } });
              } else {
                  ctrl.fire('change', { meta: { text: title, attach: linkDetails.attach } });
              }

              ctrl.focus();
          });

          ctrl.on('click', function (e) {
              if (ctrl.value().length === 0 && e.target.nodeName === 'INPUT') {
                  autocomplete('');
              }
          });

          ctrl.on('PostRender', function () {
              ctrl.getRoot().on('submit', function (e) {
                  if (!e.isDefaultPrevented()) {
                      addToHistory(ctrl.value(), fileType);
                  }
              });
          });
      };

      var statusToUiState = function (result) {
          var status = result.status, message = result.message;

          if (status === 'valid') {
              return { status: 'ok', message: message };
          } else if (status === 'unknown') {
              return { status: 'warn', message: message };
          } else if (status === 'invalid') {
              return { status: 'warn', message: message };
          } else {
              return { status: 'none', message: '' };
          }
      };

      var setupLinkValidatorHandler = function (ctrl, editorSettings, fileType) {
          var validatorHandler = editorSettings.filepicker_validator_handler;
          if (validatorHandler) {
              var validateUrl = function (url) {
                  if (url.length === 0) {
                      ctrl.statusLevel('none');
                      return;
                  }

                  validatorHandler({
                      url: url,
                      type: fileType
                  }, function (result) {
                      var uiState = statusToUiState(result);

                      ctrl.statusMessage(uiState.message);
                      ctrl.statusLevel(uiState.status);
                  });
              };

              ctrl.state.on('change:value', function (e) {
                  validateUrl(e.value);
              });
          }
      };

      return ComboBox.extend({
          Statics: {
              clearHistory: clearHistory
          },

      /**
       * Constructs a new control instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this, editor = getActiveEditor(), editorSettings = editor.settings;
              var actionCallback, fileBrowserCallback, fileBrowserCallbackTypes;
              var fileType = settings.filetype;

              settings.spellcheck = false;

              fileBrowserCallbackTypes = editorSettings.file_picker_types || editorSettings.file_browser_callback_types;
              if (fileBrowserCallbackTypes) {
                  fileBrowserCallbackTypes = Tools.makeMap(fileBrowserCallbackTypes, /[, ]/);
              }

              if (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[fileType]) {
                  fileBrowserCallback = editorSettings.file_picker_callback;
                  if (fileBrowserCallback && (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[fileType])) {
                      actionCallback = function () {
                          var meta = self.fire('beforecall').meta;

                          meta = Tools.extend({ filetype: fileType }, meta);

              // file_picker_callback(callback, currentValue, metaData)
                          fileBrowserCallback.call(
                editor,
                function (value, meta) {
                    self.value(value).fire('change', { meta: meta });
                },
                self.value(),
                meta
              );
                      };
                  } else {
            // Legacy callback: file_picker_callback(id, currentValue, filetype, window)
                      fileBrowserCallback = editorSettings.file_browser_callback;
                      if (fileBrowserCallback && (!fileBrowserCallbackTypes || fileBrowserCallbackTypes[fileType])) {
                          actionCallback = function () {
                              fileBrowserCallback(
                  self.getEl('inp').id,
                  self.value(),
                  fileType,
                  window
                );
                          };
                      }
                  }
              }

              if (actionCallback) {
                  settings.icon = 'browse';
                  settings.onaction = actionCallback;
              }

              self._super(settings);

              setupAutoCompleteHandler(self, editorSettings, editor.getBody(), fileType);
              setupLinkValidatorHandler(self, editorSettings, fileType);
          }
      });
  }
);
/**
 * FitLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This layout manager will resize the control to be the size of it's parent container.
 * In other words width: 100% and height: 100%.
 *
 * @-x-less FitLayout.less
 * @class tinymce.ui.FitLayout
 * @extends tinymce.ui.AbsoluteLayout
 */
    define(
  'tinymce.ui.FitLayout',
        [
            'tinymce.ui.AbsoluteLayout'
        ],
  function (AbsoluteLayout) {
      'use strict';

      return AbsoluteLayout.extend({
      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function (container) {
              var contLayoutRect = container.layoutRect(), paddingBox = container.paddingBox;

              container.items().filter(':visible').each(function (ctrl) {
                  ctrl.layoutRect({
                      x: paddingBox.left,
                      y: paddingBox.top,
                      w: contLayoutRect.innerW - paddingBox.right - paddingBox.left,
                      h: contLayoutRect.innerH - paddingBox.top - paddingBox.bottom
                  });

                  if (ctrl.recalc) {
                      ctrl.recalc();
                  }
              });
          }
      });
  }
);
/**
 * FlexLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This layout manager works similar to the CSS flex box.
 *
 * @setting {String} direction row|row-reverse|column|column-reverse
 * @setting {Number} flex A positive-number to flex by.
 * @setting {String} align start|end|center|stretch
 * @setting {String} pack start|end|justify
 *
 * @class tinymce.ui.FlexLayout
 * @extends tinymce.ui.AbsoluteLayout
 */
    define(
  'tinymce.ui.FlexLayout',
        [
            'tinymce.ui.AbsoluteLayout'
        ],
  function (AbsoluteLayout) {
      'use strict';

      return AbsoluteLayout.extend({
      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function (container) {
        // A ton of variables, needs to be in the same scope for performance
              var i, l, items, contLayoutRect, contPaddingBox, contSettings, align, pack, spacing, totalFlex, availableSpace, direction;
              var ctrl, ctrlLayoutRect, ctrlSettings, flex, maxSizeItems = [], size, maxSize, ratio, rect, pos, maxAlignEndPos;
              var sizeName, minSizeName, posName, maxSizeName, beforeName, innerSizeName, deltaSizeName, contentSizeName;
              var alignAxisName, alignInnerSizeName, alignSizeName, alignMinSizeName, alignBeforeName, alignAfterName;
              var alignDeltaSizeName, alignContentSizeName;
              var max = Math.max, min = Math.min;

        // Get container items, properties and settings
              items = container.items().filter(':visible');
              contLayoutRect = container.layoutRect();
              contPaddingBox = container.paddingBox;
              contSettings = container.settings;
              direction = container.isRtl() ? (contSettings.direction || 'row-reversed') : contSettings.direction;
              align = contSettings.align;
              pack = container.isRtl() ? (contSettings.pack || 'end') : contSettings.pack;
              spacing = contSettings.spacing || 0;

              if (direction == 'row-reversed' || direction == 'column-reverse') {
                  items = items.set(items.toArray().reverse());
                  direction = direction.split('-')[0];
              }

        // Setup axis variable name for row/column direction since the calculations is the same
              if (direction == 'column') {
                  posName = 'y';
                  sizeName = 'h';
                  minSizeName = 'minH';
                  maxSizeName = 'maxH';
                  innerSizeName = 'innerH';
                  beforeName = 'top';
                  deltaSizeName = 'deltaH';
                  contentSizeName = 'contentH';

                  alignBeforeName = 'left';
                  alignSizeName = 'w';
                  alignAxisName = 'x';
                  alignInnerSizeName = 'innerW';
                  alignMinSizeName = 'minW';
                  alignAfterName = 'right';
                  alignDeltaSizeName = 'deltaW';
                  alignContentSizeName = 'contentW';
              } else {
                  posName = 'x';
                  sizeName = 'w';
                  minSizeName = 'minW';
                  maxSizeName = 'maxW';
                  innerSizeName = 'innerW';
                  beforeName = 'left';
                  deltaSizeName = 'deltaW';
                  contentSizeName = 'contentW';

                  alignBeforeName = 'top';
                  alignSizeName = 'h';
                  alignAxisName = 'y';
                  alignInnerSizeName = 'innerH';
                  alignMinSizeName = 'minH';
                  alignAfterName = 'bottom';
                  alignDeltaSizeName = 'deltaH';
                  alignContentSizeName = 'contentH';
              }

        // Figure out total flex, availableSpace and collect any max size elements
              availableSpace = contLayoutRect[innerSizeName] - contPaddingBox[beforeName] - contPaddingBox[beforeName];
              maxAlignEndPos = totalFlex = 0;
              for (i = 0, l = items.length; i < l; i++) {
                  ctrl = items[i];
                  ctrlLayoutRect = ctrl.layoutRect();
                  ctrlSettings = ctrl.settings;
                  flex = ctrlSettings.flex;
                  availableSpace -= (i < l - 1 ? spacing : 0);

                  if (flex > 0) {
                      totalFlex += flex;

            // Flexed item has a max size then we need to check if we will hit that size
                      if (ctrlLayoutRect[maxSizeName]) {
                          maxSizeItems.push(ctrl);
                      }

                      ctrlLayoutRect.flex = flex;
                  }

                  availableSpace -= ctrlLayoutRect[minSizeName];

          // Calculate the align end position to be used to check for overflow/underflow
                  size = contPaddingBox[alignBeforeName] + ctrlLayoutRect[alignMinSizeName] + contPaddingBox[alignAfterName];
                  if (size > maxAlignEndPos) {
                      maxAlignEndPos = size;
                  }
              }

        // Calculate minW/minH
              rect = {};
              if (availableSpace < 0) {
                  rect[minSizeName] = contLayoutRect[minSizeName] - availableSpace + contLayoutRect[deltaSizeName];
              } else {
                  rect[minSizeName] = contLayoutRect[innerSizeName] - availableSpace + contLayoutRect[deltaSizeName];
              }

              rect[alignMinSizeName] = maxAlignEndPos + contLayoutRect[alignDeltaSizeName];

              rect[contentSizeName] = contLayoutRect[innerSizeName] - availableSpace;
              rect[alignContentSizeName] = maxAlignEndPos;
              rect.minW = min(rect.minW, contLayoutRect.maxW);
              rect.minH = min(rect.minH, contLayoutRect.maxH);
              rect.minW = max(rect.minW, contLayoutRect.startMinWidth);
              rect.minH = max(rect.minH, contLayoutRect.startMinHeight);

        // Resize container container if minSize was changed
              if (contLayoutRect.autoResize && (rect.minW != contLayoutRect.minW || rect.minH != contLayoutRect.minH)) {
                  rect.w = rect.minW;
                  rect.h = rect.minH;

                  container.layoutRect(rect);
                  this.recalc(container);

          // Forced recalc for example if items are hidden/shown
                  if (container._lastRect === null) {
                      var parentCtrl = container.parent();
                      if (parentCtrl) {
                          parentCtrl._lastRect = null;
                          parentCtrl.recalc();
                      }
                  }

                  return;
              }

        // Handle max size elements, check if they will become to wide with current options
              ratio = availableSpace / totalFlex;
              for (i = 0, l = maxSizeItems.length; i < l; i++) {
                  ctrl = maxSizeItems[i];
                  ctrlLayoutRect = ctrl.layoutRect();
                  maxSize = ctrlLayoutRect[maxSizeName];
                  size = ctrlLayoutRect[minSizeName] + ctrlLayoutRect.flex * ratio;

                  if (size > maxSize) {
                      availableSpace -= (ctrlLayoutRect[maxSizeName] - ctrlLayoutRect[minSizeName]);
                      totalFlex -= ctrlLayoutRect.flex;
                      ctrlLayoutRect.flex = 0;
                      ctrlLayoutRect.maxFlexSize = maxSize;
                  } else {
                      ctrlLayoutRect.maxFlexSize = 0;
                  }
              }

        // Setup new ratio, target layout rect, start position
              ratio = availableSpace / totalFlex;
              pos = contPaddingBox[beforeName];
              rect = {};

        // Handle pack setting moves the start position to end, center
              if (totalFlex === 0) {
                  if (pack == 'end') {
                      pos = availableSpace + contPaddingBox[beforeName];
                  } else if (pack == 'center') {
                      pos = Math.round(
              (contLayoutRect[innerSizeName] / 2) - ((contLayoutRect[innerSizeName] - availableSpace) / 2)
            ) + contPaddingBox[beforeName];

                      if (pos < 0) {
                          pos = contPaddingBox[beforeName];
                      }
                  } else if (pack == 'justify') {
                      pos = contPaddingBox[beforeName];
                      spacing = Math.floor(availableSpace / (items.length - 1));
                  }
              }

        // Default aligning (start) the other ones needs to be calculated while doing the layout
              rect[alignAxisName] = contPaddingBox[alignBeforeName];

        // Start laying out controls
              for (i = 0, l = items.length; i < l; i++) {
                  ctrl = items[i];
                  ctrlLayoutRect = ctrl.layoutRect();
                  size = ctrlLayoutRect.maxFlexSize || ctrlLayoutRect[minSizeName];

          // Align the control on the other axis
                  if (align === 'center') {
                      rect[alignAxisName] = Math.round((contLayoutRect[alignInnerSizeName] / 2) - (ctrlLayoutRect[alignSizeName] / 2));
                  } else if (align === 'stretch') {
                      rect[alignSizeName] = max(
              ctrlLayoutRect[alignMinSizeName] || 0,
              contLayoutRect[alignInnerSizeName] - contPaddingBox[alignBeforeName] - contPaddingBox[alignAfterName]
            );
                      rect[alignAxisName] = contPaddingBox[alignBeforeName];
                  } else if (align === 'end') {
                      rect[alignAxisName] = contLayoutRect[alignInnerSizeName] - ctrlLayoutRect[alignSizeName] - contPaddingBox.top;
                  }

          // Calculate new size based on flex
                  if (ctrlLayoutRect.flex > 0) {
                      size += ctrlLayoutRect.flex * ratio;
                  }

                  rect[sizeName] = size;
                  rect[posName] = pos;
                  ctrl.layoutRect(rect);

          // Recalculate containers
                  if (ctrl.recalc) {
                      ctrl.recalc();
                  }

          // Move x/y position
                  pos += size + spacing;
              }
          }
      });
  }
);
/**
 * FlowLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This layout manager will place the controls by using the browsers native layout.
 *
 * @-x-less FlowLayout.less
 * @class tinymce.ui.FlowLayout
 * @extends tinymce.ui.Layout
 */
    define(
  'tinymce.ui.FlowLayout',
        [
            'tinymce.ui.Layout'
        ],
  function (Layout) {
      return Layout.extend({
          Defaults: {
              containerClass: 'flow-layout',
              controlClass: 'flow-layout-item',
              endClass: 'break'
          },

      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function (container) {
              container.items().filter(':visible').each(function (ctrl) {
                  if (ctrl.recalc) {
                      ctrl.recalc();
                  }
              });
          },

          isNative: function () {
              return true;
          }
      });
  }
);
    define(
  'ephox.sugar.impl.ClosestOrAncestor',

        [
            'ephox.katamari.api.Type',
            'ephox.katamari.api.Option'
        ],

  function (Type, Option) {
      return function (is, ancestor, scope, a, isRoot) {
          return is(scope, a)
              ? Option.some(scope)
              : Type.isFunction(isRoot) && isRoot(scope)
                  ? Option.none()
                  : ancestor(scope, a, isRoot);
      };
  }
);
    define(
  'ephox.sugar.api.search.PredicateFind',

        [
            'ephox.katamari.api.Type',
            'ephox.katamari.api.Arr',
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Option',
            'ephox.sugar.api.node.Body',
            'ephox.sugar.api.dom.Compare',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.impl.ClosestOrAncestor'
        ],

  function (Type, Arr, Fun, Option, Body, Compare, Element, ClosestOrAncestor) {
      var first = function (predicate) {
          return descendant(Body.body(), predicate);
      };

      var ancestor = function (scope, predicate, isRoot) {
          var element = scope.dom();
          var stop = Type.isFunction(isRoot) ? isRoot : Fun.constant(false);

          while (element.parentNode) {
              element = element.parentNode;
              var el = Element.fromDom(element);

              if (predicate(el)) return Option.some(el);
              else if (stop(el)) break;
          }
          return Option.none();
      };

      var closest = function (scope, predicate, isRoot) {
      // This is required to avoid ClosestOrAncestor passing the predicate to itself
          var is = function (scope) {
              return predicate(scope);
          };
          return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
      };

      var sibling = function (scope, predicate) {
          var element = scope.dom();
          if (!element.parentNode) return Option.none();

          return child(Element.fromDom(element.parentNode), function (x) {
              return !Compare.eq(scope, x) && predicate(x);
          });
      };

      var child = function (scope, predicate) {
          var result = Arr.find(scope.dom().childNodes,
        Fun.compose(predicate, Element.fromDom));
          return result.map(Element.fromDom);
      };

      var descendant = function (scope, predicate) {
          var descend = function (element) {
              for (var i = 0; i < element.childNodes.length; i++) {
                  if (predicate(Element.fromDom(element.childNodes[i]))) { return Option.some(Element.fromDom(element.childNodes[i])); }

                  var res = descend(element.childNodes[i]);
                  if (res.isSome()) { return res; }
              }

              return Option.none();
          };

          return descend(scope.dom());
      };

      return {
          first: first,
          ancestor: ancestor,
          closest: closest,
          sibling: sibling,
          child: child,
          descendant: descendant
      };
  }
);

    define(
  'ephox.sugar.api.search.SelectorFind',

        [
            'ephox.sugar.api.search.PredicateFind',
            'ephox.sugar.api.search.Selectors',
            'ephox.sugar.impl.ClosestOrAncestor'
        ],

  function (PredicateFind, Selectors, ClosestOrAncestor) {
    // TODO: An internal SelectorFilter module that doesn't Element.fromDom() everything

      var first = function (selector) {
          return Selectors.one(selector);
      };

      var ancestor = function (scope, selector, isRoot) {
          return PredicateFind.ancestor(scope, function (e) {
              return Selectors.is(e, selector);
          }, isRoot);
      };

      var sibling = function (scope, selector) {
          return PredicateFind.sibling(scope, function (e) {
              return Selectors.is(e, selector);
          });
      };

      var child = function (scope, selector) {
          return PredicateFind.child(scope, function (e) {
              return Selectors.is(e, selector);
          });
      };

      var descendant = function (scope, selector) {
          return Selectors.one(selector, scope);
      };

    // Returns Some(closest ancestor element (sugared)) matching 'selector' up to isRoot, or None() otherwise
      var closest = function (scope, selector, isRoot) {
          return ClosestOrAncestor(Selectors.is, ancestor, scope, selector, isRoot);
      };

      return {
          first: first,
          ancestor: ancestor,
          sibling: sibling,
          child: child,
          descendant: descendant,
          closest: closest
      };
  }
);

/**
 * FormatUtils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.FormatUtils',
        [
        ],
  function () {
      var toggleFormat = function (editor, fmt) {
          return function () {
              editor.execCommand('mceToggleFormat', false, fmt);
          };
      };

      var postRenderFormat = function (editor, name) {
          return function () {
              var self = this;

        // TODO: Fix this
              if (editor.formatter) {
                  editor.formatter.formatChanged(name, function (state) {
                      self.active(state);
                  });
              } else {
                  editor.on('init', function () {
                      editor.formatter.formatChanged(name, function (state) {
                          self.active(state);
                      });
                  });
              }
          };
      };

      return {
          toggleFormat: toggleFormat,
          postRenderFormat: postRenderFormat
      };
  }
);

/**
 * Align.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.Align',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.editorui.FormatUtils'
        ],
  function (Tools, FormatUtils) {
      var register = function (editor) {
          editor.addMenuItem('align', {
              text: 'Align',
              menu: [
          { text: 'Left', icon: 'alignleft', onclick: FormatUtils.toggleFormat(editor, 'alignleft') },
          { text: 'Center', icon: 'aligncenter', onclick: FormatUtils.toggleFormat(editor, 'aligncenter') },
          { text: 'Right', icon: 'alignright', onclick: FormatUtils.toggleFormat(editor, 'alignright') },
          { text: 'Justify', icon: 'alignjustify', onclick: FormatUtils.toggleFormat(editor, 'alignjustify') }
              ]
          });

          Tools.each({
              alignleft: ['Align left', 'JustifyLeft'],
              aligncenter: ['Align center', 'JustifyCenter'],
              alignright: ['Align right', 'JustifyRight'],
              alignjustify: ['Justify', 'JustifyFull'],
              alignnone: ['No alignment', 'JustifyNone']
          }, function (item, name) {
              editor.addButton(name, {
                  tooltip: item[0],
                  cmd: item[1],
                  onPostRender: FormatUtils.postRenderFormat(editor, name)
              });
          });
      };

      return {
          register: register
      };
  }
);

/**
 * FontInfo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Internal class for computing font size for elements.
 *
 * @private
 * @class tinymce.fmt.FontInfo
 */
    define(
  'tinymce.ui.fmt.FontInfo',
        [
            'ephox.katamari.api.Fun',
            'ephox.katamari.api.Option',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.api.node.Node',
            'tinymce.core.dom.DOMUtils'
        ],
  function (Fun, Option, Element, Node, DOMUtils) {
      var getSpecifiedFontProp = function (propName, rootElm, elm) {
          while (elm !== rootElm) {
              if (elm.style[propName]) {
                  var foundStyle = elm.style[propName];
                  return foundStyle !== '' ? Option.some(foundStyle) : Option.none();
              }
              elm = elm.parentNode;
          }
          return Option.none();
      };

      var toPt = function (fontSize) {
          if (/[0-9.]+px$/.test(fontSize)) {
              return Math.round(parseInt(fontSize, 10) * 72 / 96) + 'pt';
          }

          return fontSize;
      };

      var normalizeFontFamily = function (fontFamily) {
      // 'Font name', Font -> Font name,Font
          return fontFamily.replace(/[\'\"]/g, '').replace(/,\s+/g, ',');
      };

      var getComputedFontProp = function (propName, elm) {
          return Option.from(DOMUtils.DOM.getStyle(elm, propName, true));
      };

      var getFontProp = function (propName) {
          return function (rootElm, elm) {
              return Option.from(elm)
          .map(Element.fromDom)
          .filter(Node.isElement)
          .bind(function (element) {
              return getSpecifiedFontProp(propName, rootElm, element.dom())
              .or(getComputedFontProp(propName, element.dom()));
          })
          .getOr('');
          };
      };

      return {
          getFontSize: getFontProp('fontSize'),
          getFontFamily: Fun.compose(normalizeFontFamily, getFontProp('fontFamily')),
          toPt: toPt
      };
  }
);

/**
 * FontSelect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.FontSelect',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.fmt.FontInfo'
        ],
  function (Tools, FontInfo) {
      var getFirstFont = function (fontFamily) {
          return fontFamily ? fontFamily.split(',')[0] : '';
      };

      var findMatchingValue = function (items, fontFamily) {
          var value;

          Tools.each(items, function (item) {
              if (item.value.toLowerCase() === fontFamily.toLowerCase()) {
                  value = item.value;
              }
          });

          Tools.each(items, function (item) {
              if (!value && getFirstFont(item.value).toLowerCase() === getFirstFont(fontFamily).toLowerCase()) {
                  value = item.value;
              }
          });

          return value;
      };

      var createFontNameListBoxChangeHandler = function (editor, items) {
          return function () {
              var self = this;

              editor.on('init nodeChange', function (e) {
                  var fontFamily = FontInfo.getFontFamily(editor.getBody(), e.element);
                  var match = findMatchingValue(items, fontFamily);

                  self.value(match || null);

                  if (!match && fontFamily) {
                      self.text(getFirstFont(fontFamily));
                  }
              });
          };
      };

      var createFormats = function (formats) {
          formats = formats.replace(/;$/, '').split(';');

          var i = formats.length;
          while (i--) {
              formats[i] = formats[i].split('=');
          }

          return formats;
      };

      var getFontItems = function (editor) {
          var defaultFontsFormats = (
        'Andale Mono=andale mono,monospace;' +
        'Arial=arial,helvetica,sans-serif;' +
        'Arial Black=arial black,sans-serif;' +
        'Book Antiqua=book antiqua,palatino,serif;' +
        'Comic Sans MS=comic sans ms,sans-serif;' +
        'Courier New=courier new,courier,monospace;' +
        'Georgia=georgia,palatino,serif;' +
        'Helvetica=helvetica,arial,sans-serif;' +
        'Impact=impact,sans-serif;' +
        'Symbol=symbol;' +
        'Tahoma=tahoma,arial,helvetica,sans-serif;' +
        'Terminal=terminal,monaco,monospace;' +
        'Times New Roman=times new roman,times,serif;' +
        'Trebuchet MS=trebuchet ms,geneva,sans-serif;' +
        'Verdana=verdana,geneva,sans-serif;' +
        'Webdings=webdings;' +
        'Wingdings=wingdings,zapf dingbats'
      );

          var fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);

          return Tools.map(fonts, function (font) {
              return {
                  text: { raw: font[0] },
                  value: font[1],
                  textStyle: font[1].indexOf('dings') === -1 ? 'font-family:' + font[1] : ''
              };
          });
      };

      var registerButtons = function (editor) {
          editor.addButton('fontselect', function () {
              var items = getFontItems(editor);

              return {
                  type: 'listbox',
                  text: 'Font Family',
                  tooltip: 'Font Family',
                  values: items,
                  fixedWidth: true,
                  onPostRender: createFontNameListBoxChangeHandler(editor, items),
                  onselect: function (e) {
                      if (e.control.settings.value) {
                          editor.execCommand('FontName', false, e.control.settings.value);
                      }
                  }
              };
          });
      };

      var register = function (editor) {
          registerButtons(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * FontSizeSelect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.FontSizeSelect',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.fmt.FontInfo'
        ],
  function (Tools, FontInfo) {
      var findMatchingValue = function (items, pt, px) {
          var value;

          Tools.each(items, function (item) {
              if (item.value === px) {
                  value = px;
              } else if (item.value === pt) {
                  value = pt;
              }
          });

          return value;
      };

      var createFontSizeListBoxChangeHandler = function (editor, items) {
          return function () {
              var self = this;

              editor.on('init nodeChange', function (e) {
                  var px, pt;

                  px = FontInfo.getFontSize(editor.getBody(), e.element);
                  pt = FontInfo.toPt(px);

                  var match = findMatchingValue(items, pt, px);
                  self.value(match || null);

                  if (!match) {
                      self.text(pt);
                  }
              });
          };
      };

      var getFontSizeItems = function (editor) {
          var defaultFontsizeFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
          var fontsizeFormats = editor.settings.fontsize_formats || defaultFontsizeFormats;

          return Tools.map(fontsizeFormats.split(' '), function (item) {
              var text = item, value = item;
        // Allow text=value font sizes.
              var values = item.split('=');
              if (values.length > 1) {
                  text = values[0];
                  value = values[1];
              }

              return { text: text, value: value };
          });
      };

      var registerButtons = function (editor) {
          editor.addButton('fontsizeselect', function () {
              var items = getFontSizeItems(editor);

              return {
                  type: 'listbox',
                  text: 'Font Sizes',
                  tooltip: 'Font Sizes',
                  values: items,
                  fixedWidth: true,
                  onPostRender: createFontSizeListBoxChangeHandler(editor, items),
                  onclick: function (e) {
                      if (e.control.settings.value) {
                          editor.execCommand('FontSize', false, e.control.settings.value);
                      }
                  }
              };
          });
      };

      var register = function (editor) {
          registerButtons(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * FormatSelect.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.FormatSelect',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.editorui.FormatUtils'
        ],
  function (Tools, FormatUtils) {
      var defaultBlocks = (
      'Paragraph=p;' +
      'Heading 1=h1;' +
      'Heading 2=h2;' +
      'Heading 3=h3;' +
      'Heading 4=h4;' +
      'Heading 5=h5;' +
      'Heading 6=h6;' +
      'Preformatted=pre'
    );

      var createFormats = function (formats) {
          formats = formats.replace(/;$/, '').split(';');

          var i = formats.length;
          while (i--) {
              formats[i] = formats[i].split('=');
          }

          return formats;
      };

      var createListBoxChangeHandler = function (editor, items, formatName) {
          return function () {
              var self = this;

              editor.on('nodeChange', function (e) {
                  var formatter = editor.formatter;
                  var value = null;

                  Tools.each(e.parents, function (node) {
                      Tools.each(items, function (item) {
                          if (formatName) {
                              if (formatter.matchNode(node, formatName, { value: item.value })) {
                                  value = item.value;
                              }
                          } else {
                              if (formatter.matchNode(node, item.value)) {
                                  value = item.value;
                              }
                          }

                          if (value) {
                              return false;
                          }
                      });

                      if (value) {
                          return false;
                      }
                  });

                  self.value(value);
              });
          };
      };

      var lazyFormatSelectBoxItems = function (editor, blocks) {
          return function () {
              var items = [];

              Tools.each(blocks, function (block) {
                  items.push({
                      text: block[0],
                      value: block[1],
                      textStyle: function () {
                          return editor.formatter.getCssText(block[1]);
                      }
                  });
              });

              return {
                  type: 'listbox',
                  text: blocks[0][0],
                  values: items,
                  fixedWidth: true,
                  onselect: function (e) {
                      if (e.control) {
                          var fmt = e.control.value();
                          FormatUtils.toggleFormat(editor, fmt)();
                      }
                  },
                  onPostRender: createListBoxChangeHandler(editor, items)
              };
          };
      };

      var buildMenuItems = function (editor, blocks) {
          return Tools.map(blocks, function (block) {
              return {
                  text: block[0],
                  onclick: FormatUtils.toggleFormat(editor, block[1]),
                  textStyle: function () {
                      return editor.formatter.getCssText(block[1]);
                  }
              };
          });
      };

      var register = function (editor) {
          var blocks = createFormats(editor.settings.block_formats || defaultBlocks);

          editor.addMenuItem('blockformats', {
              text: 'Blocks',
              menu: buildMenuItems(editor, blocks)
          });

          editor.addButton('formatselect', lazyFormatSelectBoxItems(editor, blocks));
      };

      return {
          register: register
      };
  }
);

/**
 * Formats.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.Formats',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.editorui.FormatUtils'
        ],
  function (Tools, FormatUtils) {
      var hideMenuObjects = function (editor, menu) {
          var count = menu.length;

          Tools.each(menu, function (item) {
              if (item.menu) {
                  item.hidden = hideMenuObjects(editor, item.menu) === 0;
              }

              var formatName = item.format;
              if (formatName) {
                  item.hidden = !editor.formatter.canApply(formatName);
              }

              if (item.hidden) {
                  count--;
              }
          });

          return count;
      };

      var hideFormatMenuItems = function (editor, menu) {
          var count = menu.items().length;

          menu.items().each(function (item) {
              if (item.menu) {
                  item.visible(hideFormatMenuItems(editor, item.menu) > 0);
              }

              if (!item.menu && item.settings.menu) {
                  item.visible(hideMenuObjects(editor, item.settings.menu) > 0);
              }

              var formatName = item.settings.format;
              if (formatName) {
                  item.visible(editor.formatter.canApply(formatName));
              }

              if (!item.visible()) {
                  count--;
              }
          });

          return count;
      };

      var createFormatMenu = function (editor) {
          var count = 0, newFormats = [];

          var defaultStyleFormats = [
              {
                  title: 'Headings',
                  items: [
            { title: 'Heading 1', format: 'h1' },
            { title: 'Heading 2', format: 'h2' },
            { title: 'Heading 3', format: 'h3' },
            { title: 'Heading 4', format: 'h4' },
            { title: 'Heading 5', format: 'h5' },
            { title: 'Heading 6', format: 'h6' }
                  ]
              },

              {
                  title: 'Inline',
                  items: [
            { title: 'Bold', icon: 'bold', format: 'bold' },
            { title: 'Italic', icon: 'italic', format: 'italic' },
            { title: 'Underline', icon: 'underline', format: 'underline' },
            { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' },
            { title: 'Superscript', icon: 'superscript', format: 'superscript' },
            { title: 'Subscript', icon: 'subscript', format: 'subscript' },
            { title: 'Code', icon: 'code', format: 'code' }
                  ]
              },

              {
                  title: 'Blocks',
                  items: [
            { title: 'Paragraph', format: 'p' },
            { title: 'Blockquote', format: 'blockquote' },
            { title: 'Div', format: 'div' },
            { title: 'Pre', format: 'pre' }
                  ]
              },

              {
                  title: 'Alignment',
                  items: [
            { title: 'Left', icon: 'alignleft', format: 'alignleft' },
            { title: 'Center', icon: 'aligncenter', format: 'aligncenter' },
            { title: 'Right', icon: 'alignright', format: 'alignright' },
            { title: 'Justify', icon: 'alignjustify', format: 'alignjustify' }
                  ]
              }
          ];

          var createMenu = function (formats) {
              var menu = [];

              if (!formats) {
                  return;
              }

              Tools.each(formats, function (format) {
                  var menuItem = {
                      text: format.title,
                      icon: format.icon
                  };

                  if (format.items) {
                      menuItem.menu = createMenu(format.items);
                  } else {
                      var formatName = format.format || 'custom' + count++;

                      if (!format.format) {
                          format.name = formatName;
                          newFormats.push(format);
                      }

                      menuItem.format = formatName;
                      menuItem.cmd = format.cmd;
                  }

                  menu.push(menuItem);
              });

              return menu;
          };

          var createStylesMenu = function () {
              var menu;

              if (editor.settings.style_formats_merge) {
                  if (editor.settings.style_formats) {
                      menu = createMenu(defaultStyleFormats.concat(editor.settings.style_formats));
                  } else {
                      menu = createMenu(defaultStyleFormats);
                  }
              } else {
                  menu = createMenu(editor.settings.style_formats || defaultStyleFormats);
              }

              return menu;
          };

          editor.on('init', function () {
              Tools.each(newFormats, function (format) {
                  editor.formatter.register(format.name, format);
              });
          });

          return {
              type: 'menu',
              items: createStylesMenu(),
              onPostRender: function (e) {
                  editor.fire('renderFormatsMenu', { control: e.control });
              },
              itemDefaults: {
                  preview: true,

                  textStyle: function () {
                      if (this.settings.format) {
                          return editor.formatter.getCssText(this.settings.format);
                      }
                  },

                  onPostRender: function () {
                      var self = this;

                      self.parent().on('show', function () {
                          var formatName, command;

                          formatName = self.settings.format;
                          if (formatName) {
                              self.disabled(!editor.formatter.canApply(formatName));
                              self.active(editor.formatter.match(formatName));
                          }

                          command = self.settings.cmd;
                          if (command) {
                              self.active(editor.queryCommandState(command));
                          }
                      });
                  },

                  onclick: function () {
                      if (this.settings.format) {
                          FormatUtils.toggleFormat(editor, this.settings.format)();
                      }

                      if (this.settings.cmd) {
                          editor.execCommand(this.settings.cmd);
                      }
                  }
              }
          };
      };

      var registerMenuItems = function (editor, formatMenu) {
          editor.addMenuItem('formats', {
              text: 'Formats',
              menu: formatMenu
          });
      };

      var registerButtons = function (editor, formatMenu) {
          editor.addButton('styleselect', {
              type: 'menubutton',
              text: 'Formats',
              menu: formatMenu,
              onShowMenu: function () {
                  if (editor.settings.style_formats_autohide) {
                      hideFormatMenuItems(editor, this.menu);
                  }
              }
          });
      };

      var register = function (editor) {
          var formatMenu = createFormatMenu(editor);

          registerMenuItems(editor, formatMenu);
          registerButtons(editor, formatMenu);
      };

      return {
          register: register
      };
  }
);

/**
 * InsertButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.InsertButton',
        [
            'ephox.katamari.api.Arr',
            'tinymce.core.util.Tools'
        ],
  function (Arr, Tools) {
      var createCustomMenuItems = function (editor, names) {
          var items, nameList;

          if (typeof names === 'string') {
              nameList = names.split(' ');
          } else if (Tools.isArray(names)) {
              return Arr.flatten(Tools.map(names, function (names) {
                  return createCustomMenuItems(editor, names);
              }));
          }

          items = Tools.grep(nameList, function (name) {
              return name === '|' || name in editor.menuItems;
          });

          return Tools.map(items, function (name) {
              return name === '|' ? { text: '-' } : editor.menuItems[name];
          });
      };

      var isSeparator = function (menuItem) {
          return menuItem && menuItem.text === '-';
      };

      var trimMenuItems = function (menuItems) {
          var menuItems2 = Arr.filter(menuItems, function (menuItem, i, menuItems) {
              return !isSeparator(menuItem) || !isSeparator(menuItems[i - 1]);
          });

          return Arr.filter(menuItems2, function (menuItem, i, menuItems) {
              return !isSeparator(menuItem) || i > 0 && i < menuItems.length - 1;
          });
      };

      var createContextMenuItems = function (editor, context) {
          var outputMenuItems = [{ text: '-' }];
          var menuItems = Tools.grep(editor.menuItems, function (menuItem) {
              return menuItem.context === context;
          });

          Tools.each(menuItems, function (menuItem) {
              if (menuItem.separator === 'before') {
                  outputMenuItems.push({ text: '|' });
              }

              if (menuItem.prependToContext) {
                  outputMenuItems.unshift(menuItem);
              } else {
                  outputMenuItems.push(menuItem);
              }

              if (menuItem.separator === 'after') {
                  outputMenuItems.push({ text: '|' });
              }
          });

          return outputMenuItems;
      };

      var createInsertMenu = function (editor) {
          var insertButtonItems = editor.settings.insert_button_items;

          if (insertButtonItems) {
              return trimMenuItems(createCustomMenuItems(editor, insertButtonItems));
          } else {
              return trimMenuItems(createContextMenuItems(editor, 'insert'));
          }
      };

      var registerButtons = function (editor) {
          editor.addButton('insert', {
              type: 'menubutton',
              icon: 'insert',
              menu: [],
              oncreatemenu: function () {
                  this.menu.add(createInsertMenu(editor));
                  this.menu.renderNew();
              }
          });
      };

      var register = function (editor) {
          registerButtons(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * SimpleControls.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.SimpleControls',
        [
            'tinymce.core.util.Tools',
            'tinymce.ui.editorui.FormatUtils'
        ],
  function (Tools, FormatUtils) {
      var registerFormatButtons = function (editor) {
          Tools.each({
              bold: 'Bold',
              italic: 'Italic',
              underline: 'Underline',
              strikethrough: 'Strikethrough',
              subscript: 'Subscript',
              superscript: 'Superscript'
          }, function (text, name) {
              editor.addButton(name, {
                  tooltip: text,
                  onPostRender: FormatUtils.postRenderFormat(editor, name),
                  onclick: FormatUtils.toggleFormat(editor, name)
              });
          });
      };

      var registerCommandButtons = function (editor) {
          Tools.each({
              outdent: ['Decrease indent', 'Outdent'],
              indent: ['Increase indent', 'Indent'],
              cut: ['Cut', 'Cut'],
              copy: ['Copy', 'Copy'],
              paste: ['Paste', 'Paste'],
              help: ['Help', 'mceHelp'],
              selectall: ['Select all', 'SelectAll'],
              visualaid: ['Visual aids', 'mceToggleVisualAid'],
              newdocument: ['New document', 'mceNewDocument'],
              removeformat: ['Clear formatting', 'RemoveFormat'],
              remove: ['Remove', 'Delete']
          }, function (item, name) {
              editor.addButton(name, {
                  tooltip: item[0],
                  cmd: item[1]
              });
          });
      };

      var registerCommandToggleButtons = function (editor) {
          Tools.each({
              blockquote: ['Blockquote', 'mceBlockQuote'],
              subscript: ['Subscript', 'Subscript'],
              superscript: ['Superscript', 'Superscript']
          }, function (item, name) {
              editor.addButton(name, {
                  tooltip: item[0],
                  cmd: item[1],
                  onPostRender: FormatUtils.postRenderFormat(editor, name)
              });
          });
      };

      var registerButtons = function (editor) {
          registerFormatButtons(editor);
          registerCommandButtons(editor);
          registerCommandToggleButtons(editor);
      };

      var registerMenuItems = function (editor) {
          Tools.each({
              bold: ['Bold', 'Bold', 'Meta+B'],
              italic: ['Italic', 'Italic', 'Meta+I'],
              underline: ['Underline', 'Underline', 'Meta+U'],
              strikethrough: ['Strikethrough', 'Strikethrough'],
              subscript: ['Subscript', 'Subscript'],
              superscript: ['Superscript', 'Superscript'],
              removeformat: ['Clear formatting', 'RemoveFormat'],
              newdocument: ['New document', 'mceNewDocument'],
              cut: ['Cut', 'Cut', 'Meta+X'],
              copy: ['Copy', 'Copy', 'Meta+C'],
              paste: ['Paste', 'Paste', 'Meta+V'],
              selectall: ['Select all', 'SelectAll', 'Meta+A']
          }, function (item, name) {
              editor.addMenuItem(name, {
                  text: item[0],
                  icon: name,
                  shortcut: item[2],
                  cmd: item[1]
              });
          });

          editor.addMenuItem('codeformat', {
              text: 'Code',
              icon: 'code',
              onclick: FormatUtils.toggleFormat(editor, 'code')
          });
      };

      var register = function (editor) {
          registerButtons(editor);
          registerMenuItems(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * UndoRedo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.UndoRedo',
        [
        ],
  function () {
      var toggleUndoRedoState = function (editor, type) {
          return function () {
              var self = this;

              var checkState = function () {
                  var typeFn = type === 'redo' ? 'hasRedo' : 'hasUndo';
                  return editor.undoManager ? editor.undoManager[typeFn]() : false;
              };

              self.disabled(!checkState());
              editor.on('Undo Redo AddUndo TypingUndo ClearUndos SwitchMode', function () {
                  self.disabled(editor.readonly || !checkState());
              });
          };
      };

      var registerMenuItems = function (editor) {
          editor.addMenuItem('undo', {
              text: 'Undo',
              icon: 'undo',
              shortcut: 'Meta+Z',
              onPostRender: toggleUndoRedoState(editor, 'undo'),
              cmd: 'undo'
          });

          editor.addMenuItem('redo', {
              text: 'Redo',
              icon: 'redo',
              shortcut: 'Meta+Y',
              onPostRender: toggleUndoRedoState(editor, 'redo'),
              cmd: 'redo'
          });
      };

      var registerButtons = function (editor) {
          editor.addButton('undo', {
              tooltip: 'Undo',
              onPostRender: toggleUndoRedoState(editor, 'undo'),
              cmd: 'undo'
          });

          editor.addButton('redo', {
              tooltip: 'Redo',
              onPostRender: toggleUndoRedoState(editor, 'redo'),
              cmd: 'redo'
          });
      };

      var register = function (editor) {
          registerMenuItems(editor);
          registerButtons(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * VisualAid.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.editorui.VisualAid',
        [
        ],
  function () {
      var toggleVisualAidState = function (editor) {
          return function () {
              var self = this;

              editor.on('VisualAid', function (e) {
                  self.active(e.hasVisual);
              });

              self.active(editor.hasVisual);
          };
      };

      var registerMenuItems = function (editor) {
          editor.addMenuItem('visualaid', {
              text: 'Visual aids',
              selectable: true,
              onPostRender: toggleVisualAidState(editor),
              cmd: 'mceToggleVisualAid'
          });
      };

      var register = function (editor) {
          registerMenuItems(editor);
      };

      return {
          register: register
      };
  }
);

/**
 * FormatControls.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.FormatControls',
        [
            'ephox.katamari.api.Fun',
            'ephox.sugar.api.node.Element',
            'ephox.sugar.api.search.SelectorFind',
            'global!document',
            'tinymce.core.EditorManager',
            'tinymce.core.Env',
            'tinymce.ui.Control',
            'tinymce.ui.FloatPanel',
            'tinymce.ui.Widget',
            'tinymce.ui.editorui.Align',
            'tinymce.ui.editorui.FontSelect',
            'tinymce.ui.editorui.FontSizeSelect',
            'tinymce.ui.editorui.FormatSelect',
            'tinymce.ui.editorui.Formats',
            'tinymce.ui.editorui.InsertButton',
            'tinymce.ui.editorui.SimpleControls',
            'tinymce.ui.editorui.UndoRedo',
            'tinymce.ui.editorui.VisualAid'
        ],
  function (
    Fun, Element, SelectorFind, document, EditorManager, Env, Control, FloatPanel, Widget, Align, FontSelect, FontSizeSelect, FormatSelect, Formats, InsertButton,
    SimpleControls, UndoRedo, VisualAid
  ) {
      var setupEnvironment = function () {
          Widget.tooltips = !Env.iOS;

          Control.translate = function (text) {
              return EditorManager.translate(text);
          };
      };

      var setupUiContainer = function (editor) {
          if (editor.settings.ui_container) {
              Env.container = SelectorFind.descendant(Element.fromDom(document.body), editor.settings.ui_container).fold(Fun.constant(null), function (elm) {
                  return elm.dom();
              });
          }
      };

      var setupRtlMode = function (editor) {
          if (editor.rtl) {
              Control.rtl = true;
          }
      };

      var setupHideFloatPanels = function (editor) {
          editor.on('mousedown', function () {
              FloatPanel.hideAll();
          });
      };

      var setup = function (editor) {
          setupRtlMode(editor);
          setupHideFloatPanels(editor);
          setupUiContainer(editor);
          setupEnvironment(editor);

          FormatSelect.register(editor);
          Align.register(editor);
          SimpleControls.register(editor);
          UndoRedo.register(editor);
          FontSizeSelect.register(editor);
          FontSelect.register(editor);
          Formats.register(editor);
          VisualAid.register(editor);
          InsertButton.register(editor);
      };

      return {
          setup: setup
      };
  }
);

/**
 * GridLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This layout manager places controls in a grid.
 *
 * @setting {Number} spacing Spacing between controls.
 * @setting {Number} spacingH Horizontal spacing between controls.
 * @setting {Number} spacingV Vertical spacing between controls.
 * @setting {Number} columns Number of columns to use.
 * @setting {String/Array} alignH start|end|center|stretch or array of values for each column.
 * @setting {String/Array} alignV start|end|center|stretch or array of values for each column.
 * @setting {String} pack start|end
 *
 * @class tinymce.ui.GridLayout
 * @extends tinymce.ui.AbsoluteLayout
 */
    define(
  'tinymce.ui.GridLayout',
        [
            'tinymce.ui.AbsoluteLayout'
        ],
  function (AbsoluteLayout) {
      'use strict';

      return AbsoluteLayout.extend({
      /**
       * Recalculates the positions of the controls in the specified container.
       *
       * @method recalc
       * @param {tinymce.ui.Container} container Container instance to recalc.
       */
          recalc: function (container) {
              var settings, rows, cols, items, contLayoutRect, width, height, rect,
                  ctrlLayoutRect, ctrl, x, y, posX, posY, ctrlSettings, contPaddingBox, align, spacingH, spacingV, alignH, alignV, maxX, maxY,
                  colWidths = [], rowHeights = [], ctrlMinWidth, ctrlMinHeight, availableWidth, availableHeight, reverseRows, idx;

        // Get layout settings
              settings = container.settings;
              items = container.items().filter(':visible');
              contLayoutRect = container.layoutRect();
              cols = settings.columns || Math.ceil(Math.sqrt(items.length));
              rows = Math.ceil(items.length / cols);
              spacingH = settings.spacingH || settings.spacing || 0;
              spacingV = settings.spacingV || settings.spacing || 0;
              alignH = settings.alignH || settings.align;
              alignV = settings.alignV || settings.align;
              contPaddingBox = container.paddingBox;
              reverseRows = 'reverseRows' in settings ? settings.reverseRows : container.isRtl();

              if (alignH && typeof alignH === 'string') {
                  alignH = [alignH];
              }

              if (alignV && typeof alignV === 'string') {
                  alignV = [alignV];
              }

        // Zero padd columnWidths
              for (x = 0; x < cols; x++) {
                  colWidths.push(0);
              }

        // Zero padd rowHeights
              for (y = 0; y < rows; y++) {
                  rowHeights.push(0);
              }

        // Calculate columnWidths and rowHeights
              for (y = 0; y < rows; y++) {
                  for (x = 0; x < cols; x++) {
                      ctrl = items[y * cols + x];

            // Out of bounds
                      if (!ctrl) {
                          break;
                      }

                      ctrlLayoutRect = ctrl.layoutRect();
                      ctrlMinWidth = ctrlLayoutRect.minW;
                      ctrlMinHeight = ctrlLayoutRect.minH;

                      colWidths[x] = ctrlMinWidth > colWidths[x] ? ctrlMinWidth : colWidths[x];
                      rowHeights[y] = ctrlMinHeight > rowHeights[y] ? ctrlMinHeight : rowHeights[y];
                  }
              }

        // Calculate maxX
              availableWidth = contLayoutRect.innerW - contPaddingBox.left - contPaddingBox.right;
              for (maxX = 0, x = 0; x < cols; x++) {
                  maxX += colWidths[x] + (x > 0 ? spacingH : 0);
                  availableWidth -= (x > 0 ? spacingH : 0) + colWidths[x];
              }

        // Calculate maxY
              availableHeight = contLayoutRect.innerH - contPaddingBox.top - contPaddingBox.bottom;
              for (maxY = 0, y = 0; y < rows; y++) {
                  maxY += rowHeights[y] + (y > 0 ? spacingV : 0);
                  availableHeight -= (y > 0 ? spacingV : 0) + rowHeights[y];
              }

              maxX += contPaddingBox.left + contPaddingBox.right;
              maxY += contPaddingBox.top + contPaddingBox.bottom;

        // Calculate minW/minH
              rect = {};
              rect.minW = maxX + (contLayoutRect.w - contLayoutRect.innerW);
              rect.minH = maxY + (contLayoutRect.h - contLayoutRect.innerH);

              rect.contentW = rect.minW - contLayoutRect.deltaW;
              rect.contentH = rect.minH - contLayoutRect.deltaH;
              rect.minW = Math.min(rect.minW, contLayoutRect.maxW);
              rect.minH = Math.min(rect.minH, contLayoutRect.maxH);
              rect.minW = Math.max(rect.minW, contLayoutRect.startMinWidth);
              rect.minH = Math.max(rect.minH, contLayoutRect.startMinHeight);

        // Resize container container if minSize was changed
              if (contLayoutRect.autoResize && (rect.minW != contLayoutRect.minW || rect.minH != contLayoutRect.minH)) {
                  rect.w = rect.minW;
                  rect.h = rect.minH;

                  container.layoutRect(rect);
                  this.recalc(container);

          // Forced recalc for example if items are hidden/shown
                  if (container._lastRect === null) {
                      var parentCtrl = container.parent();
                      if (parentCtrl) {
                          parentCtrl._lastRect = null;
                          parentCtrl.recalc();
                      }
                  }

                  return;
              }

        // Update contentW/contentH so absEnd moves correctly
              if (contLayoutRect.autoResize) {
                  rect = container.layoutRect(rect);
                  rect.contentW = rect.minW - contLayoutRect.deltaW;
                  rect.contentH = rect.minH - contLayoutRect.deltaH;
              }

              var flexV;

              if (settings.packV == 'start') {
                  flexV = 0;
              } else {
                  flexV = availableHeight > 0 ? Math.floor(availableHeight / rows) : 0;
              }

        // Calculate totalFlex
              var totalFlex = 0;
              var flexWidths = settings.flexWidths;
              if (flexWidths) {
                  for (x = 0; x < flexWidths.length; x++) {
                      totalFlex += flexWidths[x];
                  }
              } else {
                  totalFlex = cols;
              }

        // Calculate new column widths based on flex values
              var ratio = availableWidth / totalFlex;
              for (x = 0; x < cols; x++) {
                  colWidths[x] += flexWidths ? flexWidths[x] * ratio : ratio;
              }

        // Move/resize controls
              posY = contPaddingBox.top;
              for (y = 0; y < rows; y++) {
                  posX = contPaddingBox.left;
                  height = rowHeights[y] + flexV;

                  for (x = 0; x < cols; x++) {
                      if (reverseRows) {
                          idx = y * cols + cols - 1 - x;
                      } else {
                          idx = y * cols + x;
                      }

                      ctrl = items[idx];

            // No more controls to render then break
                      if (!ctrl) {
                          break;
                      }

            // Get control settings and calculate x, y
                      ctrlSettings = ctrl.settings;
                      ctrlLayoutRect = ctrl.layoutRect();
                      width = Math.max(colWidths[x], ctrlLayoutRect.startMinWidth);
                      ctrlLayoutRect.x = posX;
                      ctrlLayoutRect.y = posY;

            // Align control horizontal
                      align = ctrlSettings.alignH || (alignH ? (alignH[x] || alignH[0]) : null);
                      if (align == 'center') {
                          ctrlLayoutRect.x = posX + (width / 2) - (ctrlLayoutRect.w / 2);
                      } else if (align == 'right') {
                          ctrlLayoutRect.x = posX + width - ctrlLayoutRect.w;
                      } else if (align == 'stretch') {
                          ctrlLayoutRect.w = width;
                      }

            // Align control vertical
                      align = ctrlSettings.alignV || (alignV ? (alignV[x] || alignV[0]) : null);
                      if (align == 'center') {
                          ctrlLayoutRect.y = posY + (height / 2) - (ctrlLayoutRect.h / 2);
                      } else if (align == 'bottom') {
                          ctrlLayoutRect.y = posY + height - ctrlLayoutRect.h;
                      } else if (align == 'stretch') {
                          ctrlLayoutRect.h = height;
                      }

                      ctrl.layoutRect(ctrlLayoutRect);

                      posX += width + spacingH;

                      if (ctrl.recalc) {
                          ctrl.recalc();
                      }
                  }

                  posY += height + spacingV;
              }
          }
      });
  }
);

/**
 * Iframe.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/* jshint scripturl:true */

/**
 * This class creates an iframe.
 *
 * @setting {String} url Url to open in the iframe.
 *
 * @-x-less Iframe.less
 * @class tinymce.ui.Iframe
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Iframe',
        [
            'tinymce.ui.Widget',
            'tinymce.core.util.Delay'
        ],
  function (Widget, Delay) {
      'use strict';

      return Widget.extend({
      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this;

              self.classes.add('iframe');
              self.canFocus = false;

        /* eslint no-script-url:0 */
              return (
          '<iframe id="' + self._id + '" class="' + self.classes + '" tabindex="-1" src="' +
          (self.settings.url || 'javascript:\'\'') + '" frameborder="0"></iframe>'
              );
          },

      /**
       * Setter for the iframe source.
       *
       * @method src
       * @param {String} src Source URL for iframe.
       */
          src: function (src) {
              this.getEl().src = src;
          },

      /**
       * Inner HTML for the iframe.
       *
       * @method html
       * @param {String} html HTML string to set as HTML inside the iframe.
       * @param {function} callback Optional callback to execute when the iframe body is filled with contents.
       * @return {tinymce.ui.Iframe} Current iframe control.
       */
          html: function (html, callback) {
              var self = this, body = this.getEl().contentWindow.document.body;

        // Wait for iframe to initialize IE 10 takes time
              if (!body) {
                  Delay.setTimeout(function () {
                      self.html(html);
                  });
              } else {
                  body.innerHTML = html;

                  if (callback) {
                      callback();
                  }
              }

              return this;
          }
      });
  }
);

/**
 * InfoBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * ....
 *
 * @-x-less InfoBox.less
 * @class tinymce.ui.InfoBox
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.InfoBox',
        [
            'tinymce.ui.Widget'
        ],
  function (Widget) {
      'use strict';

      return Widget.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} multiline Multiline label.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              self.classes.add('widget').add('infobox');
              self.canFocus = false;
          },

          severity: function (level) {
              this.classes.remove('error');
              this.classes.remove('warning');
              this.classes.remove('success');
              this.classes.add(level);
          },

          help: function (state) {
              this.state.set('help', state);
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, prefix = self.classPrefix;

              return (
          '<div id="' + self._id + '" class="' + self.classes + '">' +
          '<div id="' + self._id + '-body">' +
          self.encode(self.state.get('text')) +
          '<button role="button" tabindex="-1">' +
          '<i class="' + prefix + 'ico ' + prefix + 'i-help"></i>' +
          '</button>' +
          '</div>' +
          '</div>'
              );
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:text', function (e) {
                  self.getEl('body').firstChild.data = self.encode(e.value);

                  if (self.state.get('rendered')) {
                      self.updateLayoutRect();
                  }
              });

              self.state.on('change:help', function (e) {
                  self.classes.toggle('has-help', e.value);

                  if (self.state.get('rendered')) {
                      self.updateLayoutRect();
                  }
              });

              return self._super();
          }
      });
  }
);

/**
 * Label.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class creates a label element. A label is a simple text control
 * that can be bound to other controls.
 *
 * @-x-less Label.less
 * @class tinymce.ui.Label
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Label',
        [
            'tinymce.ui.Widget',
            'tinymce.ui.DomUtils'
        ],
  function (Widget, DomUtils) {
      'use strict';

      return Widget.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} multiline Multiline label.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              self.classes.add('widget').add('label');
              self.canFocus = false;

              if (settings.multiline) {
                  self.classes.add('autoscroll');
              }

              if (settings.strong) {
                  self.classes.add('strong');
              }
          },

      /**
       * Initializes the current controls layout rect.
       * This will be executed by the layout managers to determine the
       * default minWidth/minHeight etc.
       *
       * @method initLayoutRect
       * @return {Object} Layout rect instance.
       */
          initLayoutRect: function () {
              var self = this, layoutRect = self._super();

              if (self.settings.multiline) {
                  var size = DomUtils.getSize(self.getEl());

          // Check if the text fits within maxW if not then try word wrapping it
                  if (size.width > layoutRect.maxW) {
                      layoutRect.minW = layoutRect.maxW;
                      self.classes.add('multiline');
                  }

                  self.getEl().style.width = layoutRect.minW + 'px';
                  layoutRect.startMinH = layoutRect.h = layoutRect.minH = Math.min(layoutRect.maxH, DomUtils.getSize(self.getEl()).height);
              }

              return layoutRect;
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this;

              if (!self.settings.multiline) {
                  self.getEl().style.lineHeight = self.layoutRect().h + 'px';
              }

              return self._super();
          },

          severity: function (level) {
              this.classes.remove('error');
              this.classes.remove('warning');
              this.classes.remove('success');
              this.classes.add(level);
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, targetCtrl, forName, forId = self.settings.forId;
              var text = self.settings.html ? self.settings.html : self.encode(self.state.get('text'));

              if (!forId && (forName = self.settings.forName)) {
                  targetCtrl = self.getRoot().find('#' + forName)[0];

                  if (targetCtrl) {
                      forId = targetCtrl._id;
                  }
              }

              if (forId) {
                  return (
            '<label id="' + self._id + '" class="' + self.classes + '"' + (forId ? ' for="' + forId + '"' : '') + '>' +
            text +
            '</label>'
                  );
              }

              return (
          '<span id="' + self._id + '" class="' + self.classes + '">' +
          text +
          '</span>'
              );
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:text', function (e) {
                  self.innerHtml(self.encode(e.value));

                  if (self.state.get('rendered')) {
                      self.updateLayoutRect();
                  }
              });

              return self._super();
          }
      });
  }
);

/**
 * Toolbar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new toolbar.
 *
 * @class tinymce.ui.Toolbar
 * @extends tinymce.ui.Container
 */
    define(
  'tinymce.ui.Toolbar',
        [
            'tinymce.ui.Container'
        ],
  function (Container) {
      'use strict';

      return Container.extend({
          Defaults: {
              role: 'toolbar',
              layout: 'flow'
          },

      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);
              self.classes.add('toolbar');
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self.items().each(function (ctrl) {
                  ctrl.classes.add('toolbar-item');
              });

              return self._super();
          }
      });
  }
);
/**
 * MenuBar.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new menubar.
 *
 * @-x-less MenuBar.less
 * @class tinymce.ui.MenuBar
 * @extends tinymce.ui.Container
 */
    define(
  'tinymce.ui.MenuBar',
        [
            'tinymce.ui.Toolbar'
        ],
  function (Toolbar) {
      'use strict';

      return Toolbar.extend({
          Defaults: {
              role: 'menubar',
              containerCls: 'menubar',
              ariaRoot: true,
              defaults: {
                  type: 'menubutton'
              }
          }
      });
  }
);
/**
 * MenuButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new menu button.
 *
 * @-x-less MenuButton.less
 * @class tinymce.ui.MenuButton
 * @extends tinymce.ui.Button
 */
    define(
  'tinymce.ui.MenuButton',
        [
            'global!window',
            'tinymce.core.ui.Factory',
            'tinymce.ui.Button',
            'tinymce.ui.MenuBar'
        ],
  function (window, Factory, Button, MenuBar) {
      'use strict';

    // TODO: Maybe add as some global function
      function isChildOf (node, parent) {
          while (node) {
              if (parent === node) {
                  return true;
              }

              node = node.parentNode;
          }

          return false;
      }

      var MenuButton = Button.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this;

              self._renderOpen = true;

              self._super(settings);
              settings = self.settings;

              self.classes.add('menubtn');

              if (settings.fixedWidth) {
                  self.classes.add('fixed-width');
              }

              self.aria('haspopup', true);

              self.state.set('menu', settings.menu || self.render());
          },

      /**
       * Shows the menu for the button.
       *
       * @method showMenu
       */
          showMenu: function (toggle) {
              var self = this, menu;

              if (self.menu && self.menu.visible() && toggle !== false) {
                  return self.hideMenu();
              }

              if (!self.menu) {
                  menu = self.state.get('menu') || [];
                  self.classes.add('opened');

          // Is menu array then auto constuct menu control
                  if (menu.length) {
                      menu = {
                          type: 'menu',
                          animate: true,
                          items: menu
                      };
                  } else {
                      menu.type = menu.type || 'menu';
                      menu.animate = true;
                  }

                  if (!menu.renderTo) {
                      self.menu = Factory.create(menu).parent(self).renderTo();
                  } else {
                      self.menu = menu.parent(self).show().renderTo();
                  }

                  self.fire('createmenu');
                  self.menu.reflow();
                  self.menu.on('cancel', function (e) {
                      if (e.control.parent() === self.menu) {
                          e.stopPropagation();
                          self.focus();
                          self.hideMenu();
                      }
                  });

          // Move focus to button when a menu item is selected/clicked
                  self.menu.on('select', function () {
                      self.focus();
                  });

                  self.menu.on('show hide', function (e) {
                      if (e.control === self.menu) {
                          self.activeMenu(e.type == 'show');
                          self.classes.toggle('opened', e.type == 'show');
                      }

                      self.aria('expanded', e.type == 'show');
                  }).fire('show');
              }

              self.menu.show();
              self.menu.layoutRect({ w: self.layoutRect().w });
              self.menu.moveRel(self.getEl(), self.isRtl() ? ['br-tr', 'tr-br'] : ['bl-tl', 'tl-bl']);
              self.fire('showmenu');
          },

      /**
       * Hides the menu for the button.
       *
       * @method hideMenu
       */
          hideMenu: function () {
              var self = this;

              if (self.menu) {
                  self.menu.items().each(function (item) {
                      if (item.hideMenu) {
                          item.hideMenu();
                      }
                  });

                  self.menu.hide();
              }
          },

      /**
       * Sets the active menu state.
       *
       * @private
       */
          activeMenu: function (state) {
              this.classes.toggle('active', state);
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix;
              var icon = self.settings.icon, image, text = self.state.get('text'),
                  textHtml = '';

              image = self.settings.image;
              if (image) {
                  icon = 'none';

          // Support for [high dpi, low dpi] image sources
                  if (typeof image !== 'string') {
                      image = window.getSelection ? image[0] : image[1];
                  }

                  image = ' style="background-image: url(\'' + image + '\')"';
              } else {
                  image = '';
              }

              if (text) {
                  self.classes.add('btn-has-text');
                  textHtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
              }

              icon = self.settings.icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';

              self.aria('role', self.parent() instanceof MenuBar ? 'menuitem' : 'button');

              return (
          '<div id="' + id + '" class="' + self.classes + '" tabindex="-1" aria-labelledby="' + id + '">' +
          '<button id="' + id + '-open" role="presentation" type="button" tabindex="-1">' +
          (icon ? '<i class="' + icon + '"' + image + '></i>' : '') +
          textHtml +
          ' <i class="' + prefix + 'caret"></i>' +
          '</button>' +
          '</div>'
              );
          },

      /**
       * Gets invoked after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self.on('click', function (e) {
                  if (e.control === self && isChildOf(e.target, self.getEl())) {
                      self.focus();
                      self.showMenu(!e.aria);

                      if (e.aria) {
                          self.menu.items().filter(':visible')[0].focus();
                      }
                  }
              });

              self.on('mouseenter', function (e) {
                  var overCtrl = e.control, parent = self.parent(), hasVisibleSiblingMenu;

                  if (overCtrl && parent && overCtrl instanceof MenuButton && overCtrl.parent() == parent) {
                      parent.items().filter('MenuButton').each(function (ctrl) {
                          if (ctrl.hideMenu && ctrl != overCtrl) {
                              if (ctrl.menu && ctrl.menu.visible()) {
                                  hasVisibleSiblingMenu = true;
                              }

                              ctrl.hideMenu();
                          }
                      });

                      if (hasVisibleSiblingMenu) {
                          overCtrl.focus(); // Fix for: #5887
                          overCtrl.showMenu();
                      }
                  }
              });

              return self._super();
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:menu', function () {
                  if (self.menu) {
                      self.menu.remove();
                  }

                  self.menu = null;
              });

              return self._super();
          },

      /**
       * Removes the control and it's menus.
       *
       * @method remove
       */
          remove: function () {
              this._super();

              if (this.menu) {
                  this.menu.remove();
              }
          }
      });

      return MenuButton;
  }
);

/**
 * MenuItem.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new menu item.
 *
 * @-x-less MenuItem.less
 * @class tinymce.ui.MenuItem
 * @extends tinymce.ui.Control
 */
    define(
  'tinymce.ui.MenuItem',
        [
            'tinymce.ui.Widget',
            'tinymce.core.ui.Factory',
            'tinymce.core.Env',
            'tinymce.core.util.Delay'
        ],
  function (Widget, Factory, Env, Delay) {
      'use strict';

      var toggleTextStyle = function (ctrl, state) {
          var textStyle = ctrl._textStyle;
          if (textStyle) {
              var textElm = ctrl.getEl('text');
              textElm.setAttribute('style', textStyle);

              if (state) {
                  textElm.style.color = '';
                  textElm.style.backgroundColor = '';
              }
          }
      };

      return Widget.extend({
          Defaults: {
              border: 0,
              role: 'menuitem'
          },

      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} selectable Selectable menu.
       * @setting {Array} menu Submenu array with items.
       * @setting {String} shortcut Shortcut to display for menu item. Example: Ctrl+X
       */
          init: function (settings) {
              var self = this, text;

              self._super(settings);

              settings = self.settings;

              self.classes.add('menu-item');

              if (settings.menu) {
                  self.classes.add('menu-item-expand');
              }

              if (settings.preview) {
                  self.classes.add('menu-item-preview');
              }

              text = self.state.get('text');
              if (text === '-' || text === '|') {
                  self.classes.add('menu-item-sep');
                  self.aria('role', 'separator');
                  self.state.set('text', '-');
              }

              if (settings.selectable) {
                  self.aria('role', 'menuitemcheckbox');
                  self.classes.add('menu-item-checkbox');
                  settings.icon = 'selected';
              }

              if (!settings.preview && !settings.selectable) {
                  self.classes.add('menu-item-normal');
              }

              self.on('mousedown', function (e) {
                  e.preventDefault();
              });

              if (settings.menu && !settings.ariaHideMenu) {
                  self.aria('haspopup', true);
              }
          },

      /**
       * Returns true/false if the menuitem has sub menu.
       *
       * @method hasMenus
       * @return {Boolean} True/false state if it has submenu.
       */
          hasMenus: function () {
              return !!this.settings.menu;
          },

      /**
       * Shows the menu for the menu item.
       *
       * @method showMenu
       */
          showMenu: function () {
              var self = this, settings = self.settings, menu, parent = self.parent();

              parent.items().each(function (ctrl) {
                  if (ctrl !== self) {
                      ctrl.hideMenu();
                  }
              });

              if (settings.menu) {
                  menu = self.menu;

                  if (!menu) {
                      menu = settings.menu;

            // Is menu array then auto constuct menu control
                      if (menu.length) {
                          menu = {
                              type: 'menu',
                              animate: true,
                              items: menu
                          };
                      } else {
                          menu.type = menu.type || 'menu';
                          menu.animate = true;
                      }

                      if (parent.settings.itemDefaults) {
                          menu.itemDefaults = parent.settings.itemDefaults;
                      }

                      menu = self.menu = Factory.create(menu).parent(self).renderTo();
                      menu.reflow();
                      menu.on('cancel', function (e) {
                          e.stopPropagation();
                          self.focus();
                          menu.hide();
                      });
                      menu.on('show hide', function (e) {
                          if (e.control.items) {
                              e.control.items().each(function (ctrl) {
                                  ctrl.active(ctrl.settings.selected);
                              });
                          }
                      }).fire('show');

                      menu.on('hide', function (e) {
                          if (e.control === menu) {
                              self.classes.remove('selected');
                          }
                      });

                      menu.submenu = true;
                  } else {
                      menu.show();
                  }

                  menu._parentMenu = parent;

                  menu.classes.add('menu-sub');

                  var rel = menu.testMoveRel(
            self.getEl(),
            self.isRtl() ? ['tl-tr', 'bl-br', 'tr-tl', 'br-bl'] : ['tr-tl', 'br-bl', 'tl-tr', 'bl-br']
          );

                  menu.moveRel(self.getEl(), rel);
                  menu.rel = rel;

                  rel = 'menu-sub-' + rel;
                  menu.classes.remove(menu._lastRel).add(rel);
                  menu._lastRel = rel;

                  self.classes.add('selected');
                  self.aria('expanded', true);
              }
          },

      /**
       * Hides the menu for the menu item.
       *
       * @method hideMenu
       */
          hideMenu: function () {
              var self = this;

              if (self.menu) {
                  self.menu.items().each(function (item) {
                      if (item.hideMenu) {
                          item.hideMenu();
                      }
                  });

                  self.menu.hide();
                  self.aria('expanded', false);
              }

              return self;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, settings = self.settings, prefix = self.classPrefix, text = self.state.get('text');
              var icon = self.settings.icon, image = '', shortcut = settings.shortcut;
              var url = self.encode(settings.url), iconHtml = '';

        // Converts shortcut format to Mac/PC variants
              function convertShortcut (shortcut) {
                  var i, value, replace = {};

                  if (Env.mac) {
                      replace = {
                          alt: '&#x2325;',
                          ctrl: '&#x2318;',
                          shift: '&#x21E7;',
                          meta: '&#x2318;'
                      };
                  } else {
                      replace = {
                          meta: 'Ctrl'
                      };
                  }

                  shortcut = shortcut.split('+');

                  for (i = 0; i < shortcut.length; i++) {
                      value = replace[shortcut[i].toLowerCase()];

                      if (value) {
                          shortcut[i] = value;
                      }
                  }

                  return shortcut.join('+');
              }

              function escapeRegExp (str) {
                  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              }

              function markMatches (text) {
                  var match = settings.match || '';

                  return match ? text.replace(new RegExp(escapeRegExp(match), 'gi'), function (match) {
                      return '!mce~match[' + match + ']mce~match!';
                  }) : text;
              }

              function boldMatches (text) {
                  return text
            .replace(new RegExp(escapeRegExp('!mce~match['), 'g'), '<b>')
            .replace(new RegExp(escapeRegExp(']mce~match!'), 'g'), '</b>');
              }

              if (icon) {
                  self.parent().classes.add('menu-has-icons');
              }

              if (settings.image) {
                  image = ' style="background-image: url(\'' + settings.image + '\')"';
              }

              if (shortcut) {
                  shortcut = convertShortcut(shortcut);
              }

              icon = prefix + 'ico ' + prefix + 'i-' + (self.settings.icon || 'none');
              iconHtml = (text !== '-' ? '<i class="' + icon + '"' + image + '></i>\u00a0' : '');

              text = boldMatches(self.encode(markMatches(text)));
              url = boldMatches(self.encode(markMatches(url)));

              return (
          '<div id="' + id + '" class="' + self.classes + '" tabindex="-1">' +
          iconHtml +
          (text !== '-' ? '<span id="' + id + '-text" class="' + prefix + 'text">' + text + '</span>' : '') +
          (shortcut ? '<div id="' + id + '-shortcut" class="' + prefix + 'menu-shortcut">' + shortcut + '</div>' : '') +
          (settings.menu ? '<div class="' + prefix + 'caret"></div>' : '') +
          (url ? '<div class="' + prefix + 'menu-item-link">' + url + '</div>' : '') +
          '</div>'
              );
          },

      /**
       * Gets invoked after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this, settings = self.settings;

              var textStyle = settings.textStyle;
              if (typeof textStyle === 'function') {
                  textStyle = textStyle.call(this);
              }

              if (textStyle) {
                  var textElm = self.getEl('text');
                  if (textElm) {
                      textElm.setAttribute('style', textStyle);
                      self._textStyle = textStyle;
                  }
              }

              self.on('mouseenter click', function (e) {
                  if (e.control === self) {
                      if (!settings.menu && e.type === 'click') {
                          self.fire('select');

              // Edge will crash if you stress it see #2660
                          Delay.requestAnimationFrame(function () {
                              self.parent().hideAll();
                          });
                      } else {
                          self.showMenu();

                          if (e.aria) {
                              self.menu.focus(true);
                          }
                      }
                  }
              });

              self._super();

              return self;
          },

          hover: function () {
              var self = this;

              self.parent().items().each(function (ctrl) {
                  ctrl.classes.remove('selected');
              });

              self.classes.toggle('selected', true);

              return self;
          },

          active: function (state) {
              toggleTextStyle(this, state);

              if (typeof state !== 'undefined') {
                  this.aria('checked', state);
              }

              return this._super(state);
          },

      /**
       * Removes the control and it's menus.
       *
       * @method remove
       */
          remove: function () {
              this._super();

              if (this.menu) {
                  this.menu.remove();
              }
          }
      });
  }
);

/**
 * Throbber.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This class enables you to display a Throbber for any element.
 *
 * @-x-less Throbber.less
 * @class tinymce.ui.Throbber
 */
    define(
  'tinymce.ui.Throbber',
        [
            'tinymce.core.dom.DomQuery',
            'tinymce.ui.Control',
            'tinymce.core.util.Delay'
        ],
  function ($, Control, Delay) {
      'use strict';

    /**
     * Constructs a new throbber.
     *
     * @constructor
     * @param {Element} elm DOM Html element to display throbber in.
     * @param {Boolean} inline Optional true/false state if the throbber should be appended to end of element for infinite scroll.
     */
      return function (elm, inline) {
          var self = this, state, classPrefix = Control.classPrefix, timer;

      /**
       * Shows the throbber.
       *
       * @method show
       * @param {Number} [time] Time to wait before showing.
       * @param {function} [callback] Optional callback to execute when the throbber is shown.
       * @return {tinymce.ui.Throbber} Current throbber instance.
       */
          self.show = function (time, callback) {
              function render () {
                  if (state) {
                      $(elm).append(
              '<div class="' + classPrefix + 'throbber' + (inline ? ' ' + classPrefix + 'throbber-inline' : '') + '"></div>'
            );

                      if (callback) {
                          callback();
                      }
                  }
              }

              self.hide();

              state = true;

              if (time) {
                  timer = Delay.setTimeout(render, time);
              } else {
                  render();
              }

              return self;
          };

      /**
       * Hides the throbber.
       *
       * @method hide
       * @return {tinymce.ui.Throbber} Current throbber instance.
       */
          self.hide = function () {
              var child = elm.lastChild;

              Delay.clearTimeout(timer);

              if (child && child.className.indexOf('throbber') != -1) {
                  child.parentNode.removeChild(child);
              }

              state = false;

              return self;
          };
      };
  }
);

/**
 * Menu.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new menu.
 *
 * @-x-less Menu.less
 * @class tinymce.ui.Menu
 * @extends tinymce.ui.FloatPanel
 */
    define(
  'tinymce.ui.Menu',
        [
            'tinymce.core.Env',
            'tinymce.core.util.Delay',
            'tinymce.core.util.Tools',
            'tinymce.ui.FloatPanel',
            'tinymce.ui.MenuItem',
            'tinymce.ui.Throbber'
        ],
  function (Env, Delay, Tools, FloatPanel, MenuItem, Throbber) {
      'use strict';

      return FloatPanel.extend({
          Defaults: {
              defaultType: 'menuitem',
              border: 1,
              layout: 'stack',
              role: 'application',
              bodyRole: 'menu',
              ariaRoot: true
          },

      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       */
          init: function (settings) {
              var self = this;

              settings.autohide = true;
              settings.constrainToViewport = true;

              if (typeof settings.items === 'function') {
                  settings.itemsFactory = settings.items;
                  settings.items = [];
              }

              if (settings.itemDefaults) {
                  var items = settings.items, i = items.length;

                  while (i--) {
                      items[i] = Tools.extend({}, settings.itemDefaults, items[i]);
                  }
              }

              self._super(settings);
              self.classes.add('menu');

              if (settings.animate && Env.ie !== 11) {
          // IE 11 can't handle transforms it looks horrible and blurry so lets disable that
                  self.classes.add('animate');
              }
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              this.classes.toggle('menu-align', true);

              this._super();

              this.getEl().style.height = '';
              this.getEl('body').style.height = '';

              return this;
          },

      /**
       * Hides/closes the menu.
       *
       * @method cancel
       */
          cancel: function () {
              var self = this;

              self.hideAll();
              self.fire('select');
          },

      /**
       * Loads new items from the factory items function.
       *
       * @method load
       */
          load: function () {
              var self = this, time, factory;

              function hideThrobber () {
                  if (self.throbber) {
                      self.throbber.hide();
                      self.throbber = null;
                  }
              }

              factory = self.settings.itemsFactory;
              if (!factory) {
                  return;
              }

              if (!self.throbber) {
                  self.throbber = new Throbber(self.getEl('body'), true);

                  if (self.items().length === 0) {
                      self.throbber.show();
                      self.fire('loading');
                  } else {
                      self.throbber.show(100, function () {
                          self.items().remove();
                          self.fire('loading');
                      });
                  }

                  self.on('hide close', hideThrobber);
              }

              self.requestTime = time = new Date().getTime();

              self.settings.itemsFactory(function (items) {
                  if (items.length === 0) {
                      self.hide();
                      return;
                  }

                  if (self.requestTime !== time) {
                      return;
                  }

                  self.getEl().style.width = '';
                  self.getEl('body').style.width = '';

                  hideThrobber();
                  self.items().remove();
                  self.getEl('body').innerHTML = '';

                  self.add(items);
                  self.renderNew();
                  self.fire('loaded');
              });
          },

      /**
       * Hide menu and all sub menus.
       *
       * @method hideAll
       */
          hideAll: function () {
              var self = this;

              this.find('menuitem').exec('hideMenu');

              return self._super();
          },

      /**
       * Invoked before the menu is rendered.
       *
       * @method preRender
       */
          preRender: function () {
              var self = this;

              self.items().each(function (ctrl) {
                  var settings = ctrl.settings;

                  if (settings.icon || settings.image || settings.selectable) {
                      self._hasIcons = true;
                      return false;
                  }
              });

              if (self.settings.itemsFactory) {
                  self.on('postrender', function () {
                      if (self.settings.itemsFactory) {
                          self.load();
                      }
                  });
              }

              self.on('show hide', function (e) {
                  if (e.control === self) {
                      if (e.type === 'show') {
                          Delay.setTimeout(function () {
                              self.classes.add('in');
                          }, 0);
                      } else {
                          self.classes.remove('in');
                      }
                  }
              });

              return self._super();
          }
      });
  }
);

/**
 * ListBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new list box control.
 *
 * @-x-less ListBox.less
 * @class tinymce.ui.ListBox
 * @extends tinymce.ui.MenuButton
 */
    define(
  'tinymce.ui.ListBox',
        [
            'tinymce.ui.MenuButton',
            'tinymce.ui.Menu'
        ],
  function (MenuButton, Menu) {
      'use strict';

      return MenuButton.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Array} values Array with values to add to list box.
       */
          init: function (settings) {
              var self = this, values, selected, selectedText, lastItemCtrl;

              function setSelected (menuValues) {
          // Try to find a selected value
                  for (var i = 0; i < menuValues.length; i++) {
                      selected = menuValues[i].selected || settings.value === menuValues[i].value;

                      if (selected) {
                          selectedText = selectedText || menuValues[i].text;
                          self.state.set('value', menuValues[i].value);
                          return true;
                      }

            // If the value has a submenu, try to find the selected values in that menu
                      if (menuValues[i].menu) {
                          if (setSelected(menuValues[i].menu)) {
                              return true;
                          }
                      }
                  }
              }

              self._super(settings);
              settings = self.settings;

              self._values = values = settings.values;
              if (values) {
                  if (typeof settings.value !== 'undefined') {
                      setSelected(values);
                  }

          // Default with first item
                  if (!selected && values.length > 0) {
                      selectedText = values[0].text;
                      self.state.set('value', values[0].value);
                  }

                  self.state.set('menu', values);
              }

              self.state.set('text', settings.text || selectedText);

              self.classes.add('listbox');

              self.on('select', function (e) {
                  var ctrl = e.control;

                  if (lastItemCtrl) {
                      e.lastControl = lastItemCtrl;
                  }

                  if (settings.multiple) {
                      ctrl.active(!ctrl.active());
                  } else {
                      self.value(e.control.value());
                  }

                  lastItemCtrl = ctrl;
              });
          },

      /**
       * Getter/setter function for the control value.
       *
       * @method value
       * @param {String} [value] Value to be set.
       * @return {Boolean/tinymce.ui.ListBox} Value or self if it's a set operation.
       */
          bindStates: function () {
              var self = this;

              function activateMenuItemsByValue (menu, value) {
                  if (menu instanceof Menu) {
                      menu.items().each(function (ctrl) {
                          if (!ctrl.hasMenus()) {
                              ctrl.active(ctrl.value() === value);
                          }
                      });
                  }
              }

              function getSelectedItem (menuValues, value) {
                  var selectedItem;

                  if (!menuValues) {
                      return;
                  }

                  for (var i = 0; i < menuValues.length; i++) {
                      if (menuValues[i].value === value) {
                          return menuValues[i];
                      }

                      if (menuValues[i].menu) {
                          selectedItem = getSelectedItem(menuValues[i].menu, value);
                          if (selectedItem) {
                              return selectedItem;
                          }
                      }
                  }
              }

              self.on('show', function (e) {
                  activateMenuItemsByValue(e.control, self.value());
              });

              self.state.on('change:value', function (e) {
                  var selectedItem = getSelectedItem(self.state.get('menu'), e.value);

                  if (selectedItem) {
                      self.text(selectedItem.text);
                  } else {
                      self.text(self.settings.text);
                  }
              });

              return self._super();
          }
      });
  }
);

/**
 * Radio.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new radio button.
 *
 * @-x-less Radio.less
 * @class tinymce.ui.Radio
 * @extends tinymce.ui.Checkbox
 */
    define(
  'tinymce.ui.Radio',
        [
            'tinymce.ui.Checkbox'
        ],
  function (Checkbox) {
      'use strict';

      return Checkbox.extend({
          Defaults: {
              classes: 'radio',
              role: 'radio'
          }
      });
  }
);
/**
 * ResizeHandle.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Renders a resize handle that fires ResizeStart, Resize and ResizeEnd events.
 *
 * @-x-less ResizeHandle.less
 * @class tinymce.ui.ResizeHandle
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.ResizeHandle',
        [
            'tinymce.ui.Widget',
            'tinymce.ui.DragHelper'
        ],
  function (Widget, DragHelper) {
      'use strict';

      return Widget.extend({
      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, prefix = self.classPrefix;

              self.classes.add('resizehandle');

              if (self.settings.direction == 'both') {
                  self.classes.add('resizehandle-both');
              }

              self.canFocus = false;

              return (
          '<div id="' + self._id + '" class="' + self.classes + '">' +
          '<i class="' + prefix + 'ico ' + prefix + 'i-resize"></i>' +
          '</div>'
              );
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self._super();

              self.resizeDragHelper = new DragHelper(this._id, {
                  start: function () {
                      self.fire('ResizeStart');
                  },

                  drag: function (e) {
                      if (self.settings.direction != 'both') {
                          e.deltaX = 0;
                      }

                      self.fire('Resize', e);
                  },

                  stop: function () {
                      self.fire('ResizeEnd');
                  }
              });
          },

          remove: function () {
              if (this.resizeDragHelper) {
                  this.resizeDragHelper.destroy();
              }

              return this._super();
          }
      });
  }
);

/**
 * SelectBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new select box control.
 *
 * @-x-less SelectBox.less
 * @class tinymce.ui.SelectBox
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.SelectBox',
        [
            'tinymce.ui.Widget'
        ],
  function (Widget) {
      'use strict';

      function createOptions (options) {
          var strOptions = '';
          if (options) {
              for (var i = 0; i < options.length; i++) {
                  strOptions += '<option value="' + options[i] + '">' + options[i] + '</option>';
              }
          }
          return strOptions;
      }

      return Widget.extend({
          Defaults: {
              classes: 'selectbox',
              role: 'selectbox',
              options: []
          },
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Array} options Array with options to add to the select box.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);

              if (self.settings.size) {
                  self.size = self.settings.size;
              }

              if (self.settings.options) {
                  self._options = self.settings.options;
              }

              self.on('keydown', function (e) {
                  var rootControl;

                  if (e.keyCode == 13) {
                      e.preventDefault();

            // Find root control that we can do toJSON on
                      self.parents().reverse().each(function (ctrl) {
                          if (ctrl.toJSON) {
                              rootControl = ctrl;
                              return false;
                          }
                      });

            // Fire event on current text box with the serialized data of the whole form
                      self.fire('submit', { data: rootControl.toJSON() });
                  }
              });
          },

      /**
       * Getter/setter function for the options state.
       *
       * @method options
       * @param {Array} [state] State to be set.
       * @return {Array|tinymce.ui.SelectBox} Array of string options.
       */
          options: function (state) {
              if (!arguments.length) {
                  return this.state.get('options');
              }

              this.state.set('options', state);

              return this;
          },

          renderHtml: function () {
              var self = this, options, size = '';

              options = createOptions(self._options);

              if (self.size) {
                  size = ' size = "' + self.size + '"';
              }

              return (
          '<select id="' + self._id + '" class="' + self.classes + '"' + size + '>' +
          options +
          '</select>'
              );
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:options', function (e) {
                  self.getEl().innerHTML = createOptions(e.value);
              });

              return self._super();
          }
      });
  }
);

/**
 * Slider.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Slider control.
 *
 * @-x-less Slider.less
 * @class tinymce.ui.Slider
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Slider',
        [
            'tinymce.ui.Widget',
            'tinymce.ui.DragHelper',
            'tinymce.ui.DomUtils'
        ],
  function (Widget, DragHelper, DomUtils) {
      'use strict';

      function constrain (value, minVal, maxVal) {
          if (value < minVal) {
              value = minVal;
          }

          if (value > maxVal) {
              value = maxVal;
          }

          return value;
      }

      function setAriaProp (el, name, value) {
          el.setAttribute('aria-' + name, value);
      }

      function updateSliderHandle (ctrl, value) {
          var maxHandlePos, shortSizeName, sizeName, stylePosName, styleValue, handleEl;

          if (ctrl.settings.orientation == 'v') {
              stylePosName = 'top';
              sizeName = 'height';
              shortSizeName = 'h';
          } else {
              stylePosName = 'left';
              sizeName = 'width';
              shortSizeName = 'w';
          }

          handleEl = ctrl.getEl('handle');
          maxHandlePos = (ctrl.layoutRect()[shortSizeName] || 100) - DomUtils.getSize(handleEl)[sizeName];

          styleValue = (maxHandlePos * ((value - ctrl._minValue) / (ctrl._maxValue - ctrl._minValue))) + 'px';
          handleEl.style[stylePosName] = styleValue;
          handleEl.style.height = ctrl.layoutRect().h + 'px';

          setAriaProp(handleEl, 'valuenow', value);
          setAriaProp(handleEl, 'valuetext', '' + ctrl.settings.previewFilter(value));
          setAriaProp(handleEl, 'valuemin', ctrl._minValue);
          setAriaProp(handleEl, 'valuemax', ctrl._maxValue);
      }

      return Widget.extend({
          init: function (settings) {
              var self = this;

              if (!settings.previewFilter) {
                  settings.previewFilter = function (value) {
                      return Math.round(value * 100) / 100.0;
                  };
              }

              self._super(settings);
              self.classes.add('slider');

              if (settings.orientation == 'v') {
                  self.classes.add('vertical');
              }

              self._minValue = settings.minValue || 0;
              self._maxValue = settings.maxValue || 100;
              self._initValue = self.state.get('value');
          },

          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix;

              return (
          '<div id="' + id + '" class="' + self.classes + '">' +
          '<div id="' + id + '-handle" class="' + prefix + 'slider-handle" role="slider" tabindex="-1"></div>' +
          '</div>'
              );
          },

          reset: function () {
              this.value(this._initValue).repaint();
          },

          postRender: function () {
              var self = this, minValue, maxValue, screenCordName,
                  stylePosName, sizeName, shortSizeName;

              function toFraction (min, max, val) {
                  return (val + min) / (max - min);
              }

              function fromFraction (min, max, val) {
                  return (val * (max - min)) - min;
              }

              function handleKeyboard (minValue, maxValue) {
                  function alter (delta) {
                      var value;

                      value = self.value();
                      value = fromFraction(minValue, maxValue, toFraction(minValue, maxValue, value) + (delta * 0.05));
                      value = constrain(value, minValue, maxValue);

                      self.value(value);

                      self.fire('dragstart', { value: value });
                      self.fire('drag', { value: value });
                      self.fire('dragend', { value: value });
                  }

                  self.on('keydown', function (e) {
                      switch (e.keyCode) {
                          case 37:
                          case 38:
                              alter(-1);
                              break;

                          case 39:
                          case 40:
                              alter(1);
                              break;
                      }
                  });
              }

              function handleDrag (minValue, maxValue, handleEl) {
                  var startPos, startHandlePos, maxHandlePos, handlePos, value;

                  self._dragHelper = new DragHelper(self._id, {
                      handle: self._id + '-handle',

                      start: function (e) {
                          startPos = e[screenCordName];
                          startHandlePos = parseInt(self.getEl('handle').style[stylePosName], 10);
                          maxHandlePos = (self.layoutRect()[shortSizeName] || 100) - DomUtils.getSize(handleEl)[sizeName];
                          self.fire('dragstart', { value: value });
                      },

                      drag: function (e) {
                          var delta = e[screenCordName] - startPos;

                          handlePos = constrain(startHandlePos + delta, 0, maxHandlePos);
                          handleEl.style[stylePosName] = handlePos + 'px';

                          value = minValue + (handlePos / maxHandlePos) * (maxValue - minValue);
                          self.value(value);

                          self.tooltip().text('' + self.settings.previewFilter(value)).show().moveRel(handleEl, 'bc tc');

                          self.fire('drag', { value: value });
                      },

                      stop: function () {
                          self.tooltip().hide();
                          self.fire('dragend', { value: value });
                      }
                  });
              }

              minValue = self._minValue;
              maxValue = self._maxValue;

              if (self.settings.orientation == 'v') {
                  screenCordName = 'screenY';
                  stylePosName = 'top';
                  sizeName = 'height';
                  shortSizeName = 'h';
              } else {
                  screenCordName = 'screenX';
                  stylePosName = 'left';
                  sizeName = 'width';
                  shortSizeName = 'w';
              }

              self._super();

              handleKeyboard(minValue, maxValue, self.getEl('handle'));
              handleDrag(minValue, maxValue, self.getEl('handle'));
          },

          repaint: function () {
              this._super();
              updateSliderHandle(this, this.value());
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:value', function (e) {
                  updateSliderHandle(self, e.value);
              });

              return self._super();
          }
      });
  }
);
/**
 * Spacer.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a spacer. This control is used in flex layouts for example.
 *
 * @-x-less Spacer.less
 * @class tinymce.ui.Spacer
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.Spacer',
        [
            'tinymce.ui.Widget'
        ],
  function (Widget) {
      'use strict';

      return Widget.extend({
      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this;

              self.classes.add('spacer');
              self.canFocus = false;

              return '<div id="' + self._id + '" class="' + self.classes + '"></div>';
          }
      });
  }
);
/**
 * SplitButton.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a split button.
 *
 * @-x-less SplitButton.less
 * @class tinymce.ui.SplitButton
 * @extends tinymce.ui.Button
 */
    define(
  'tinymce.ui.SplitButton',
        [
            'global!window',
            'tinymce.core.dom.DomQuery',
            'tinymce.ui.DomUtils',
            'tinymce.ui.MenuButton'
        ],
  function (window, DomQuery, DomUtils, MenuButton) {
      return MenuButton.extend({
          Defaults: {
              classes: 'widget btn splitbtn',
              role: 'button'
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, elm = self.getEl(), rect = self.layoutRect(), mainButtonElm, menuButtonElm;

              self._super();

              mainButtonElm = elm.firstChild;
              menuButtonElm = elm.lastChild;

              DomQuery(mainButtonElm).css({
                  width: rect.w - DomUtils.getSize(menuButtonElm).width,
                  height: rect.h - 2
              });

              DomQuery(menuButtonElm).css({
                  height: rect.h - 2
              });

              return self;
          },

      /**
       * Sets the active menu state.
       *
       * @private
       */
          activeMenu: function (state) {
              var self = this;

              DomQuery(self.getEl().lastChild).toggleClass(self.classPrefix + 'active', state);
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, id = self._id, prefix = self.classPrefix, image;
              var icon = self.state.get('icon'), text = self.state.get('text'),
                  textHtml = '';

              image = self.settings.image;
              if (image) {
                  icon = 'none';

          // Support for [high dpi, low dpi] image sources
                  if (typeof image !== 'string') {
                      image = window.getSelection ? image[0] : image[1];
                  }

                  image = ' style="background-image: url(\'' + image + '\')"';
              } else {
                  image = '';
              }

              icon = self.settings.icon ? prefix + 'ico ' + prefix + 'i-' + icon : '';

              if (text) {
                  self.classes.add('btn-has-text');
                  textHtml = '<span class="' + prefix + 'txt">' + self.encode(text) + '</span>';
              }

              return (
          '<div id="' + id + '" class="' + self.classes + '" role="button" tabindex="-1">' +
          '<button type="button" hidefocus="1" tabindex="-1">' +
          (icon ? '<i class="' + icon + '"' + image + '></i>' : '') +
          textHtml +
          '</button>' +
          '<button type="button" class="' + prefix + 'open" hidefocus="1" tabindex="-1">' +
          // (icon ? '<i class="' + icon + '"></i>' : '') +
          (self._menuBtnText ? (icon ? '\u00a0' : '') + self._menuBtnText : '') +
          ' <i class="' + prefix + 'caret"></i>' +
          '</button>' +
          '</div>'
              );
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this, onClickHandler = self.settings.onclick;

              self.on('click', function (e) {
                  var node = e.target;

                  if (e.control == this) {
            // Find clicks that is on the main button
                      while (node) {
                          if ((e.aria && e.aria.key != 'down') || (node.nodeName == 'BUTTON' && node.className.indexOf('open') == -1)) {
                              e.stopImmediatePropagation();

                              if (onClickHandler) {
                                  onClickHandler.call(this, e);
                              }

                              return;
                          }

                          node = node.parentNode;
                      }
                  }
              });

              delete self.settings.onclick;

              return self._super();
          }
      });
  }
);
/**
 * StackLayout.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * This layout uses the browsers layout when the items are blocks.
 *
 * @-x-less StackLayout.less
 * @class tinymce.ui.StackLayout
 * @extends tinymce.ui.FlowLayout
 */
    define(
  'tinymce.ui.StackLayout',
        [
            'tinymce.ui.FlowLayout'
        ],
  function (FlowLayout) {
      'use strict';

      return FlowLayout.extend({
          Defaults: {
              containerClass: 'stack-layout',
              controlClass: 'stack-layout-item',
              endClass: 'break'
          },

          isNative: function () {
              return true;
          }
      });
  }
);
/**
 * TabPanel.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a tab panel control.
 *
 * @-x-less TabPanel.less
 * @class tinymce.ui.TabPanel
 * @extends tinymce.ui.Panel
 *
 * @setting {Number} activeTab Active tab index.
 */
    define(
  'tinymce.ui.TabPanel',
        [
            'tinymce.ui.Panel',
            'tinymce.core.dom.DomQuery',
            'tinymce.ui.DomUtils'
        ],
  function (Panel, $, DomUtils) {
      'use strict';

      return Panel.extend({
          Defaults: {
              layout: 'absolute',
              defaults: {
                  type: 'panel'
              }
          },

      /**
       * Activates the specified tab by index.
       *
       * @method activateTab
       * @param {Number} idx Index of the tab to activate.
       */
          activateTab: function (idx) {
              var activeTabElm;

              if (this.activeTabId) {
                  activeTabElm = this.getEl(this.activeTabId);
                  $(activeTabElm).removeClass(this.classPrefix + 'active');
                  activeTabElm.setAttribute('aria-selected', 'false');
              }

              this.activeTabId = 't' + idx;

              activeTabElm = this.getEl('t' + idx);
              activeTabElm.setAttribute('aria-selected', 'true');
              $(activeTabElm).addClass(this.classPrefix + 'active');

              this.items()[idx].show().fire('showtab');
              this.reflow();

              this.items().each(function (item, i) {
                  if (idx != i) {
                      item.hide();
                  }
              });
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, layout = self._layout, tabsHtml = '', prefix = self.classPrefix;

              self.preRender();
              layout.preRender(self);

              self.items().each(function (ctrl, i) {
                  var id = self._id + '-t' + i;

                  ctrl.aria('role', 'tabpanel');
                  ctrl.aria('labelledby', id);

                  tabsHtml += (
            '<div id="' + id + '" class="' + prefix + 'tab" ' +
            'unselectable="on" role="tab" aria-controls="' + ctrl._id + '" aria-selected="false" tabIndex="-1">' +
            self.encode(ctrl.settings.title) +
            '</div>'
          );
              });

              return (
          '<div id="' + self._id + '" class="' + self.classes + '" hidefocus="1" tabindex="-1">' +
          '<div id="' + self._id + '-head" class="' + prefix + 'tabs" role="tablist">' +
          tabsHtml +
          '</div>' +
          '<div id="' + self._id + '-body" class="' + self.bodyClasses + '">' +
          layout.renderHtml(self) +
          '</div>' +
          '</div>'
              );
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self._super();

              self.settings.activeTab = self.settings.activeTab || 0;
              self.activateTab(self.settings.activeTab);

              this.on('click', function (e) {
                  var targetParent = e.target.parentNode;

                  if (targetParent && targetParent.id == self._id + '-head') {
                      var i = targetParent.childNodes.length;

                      while (i--) {
                          if (targetParent.childNodes[i] == e.target) {
                              self.activateTab(i);
                          }
                      }
                  }
              });
          },

      /**
       * Initializes the current controls layout rect.
       * This will be executed by the layout managers to determine the
       * default minWidth/minHeight etc.
       *
       * @method initLayoutRect
       * @return {Object} Layout rect instance.
       */
          initLayoutRect: function () {
              var self = this, rect, minW, minH;

              minW = DomUtils.getSize(self.getEl('head')).width;
              minW = minW < 0 ? 0 : minW;
              minH = 0;

              self.items().each(function (item) {
                  minW = Math.max(minW, item.layoutRect().minW);
                  minH = Math.max(minH, item.layoutRect().minH);
              });

              self.items().each(function (ctrl) {
                  ctrl.settings.x = 0;
                  ctrl.settings.y = 0;
                  ctrl.settings.w = minW;
                  ctrl.settings.h = minH;

                  ctrl.layoutRect({
                      x: 0,
                      y: 0,
                      w: minW,
                      h: minH
                  });
              });

              var headH = DomUtils.getSize(self.getEl('head')).height;

              self.settings.minWidth = minW;
              self.settings.minHeight = minH + headH;

              rect = self._super();
              rect.deltaH += headH;
              rect.innerH = rect.h - rect.deltaH;

              return rect;
          }
      });
  }
);

/**
 * TextBox.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Creates a new textbox.
 *
 * @-x-less TextBox.less
 * @class tinymce.ui.TextBox
 * @extends tinymce.ui.Widget
 */
    define(
  'tinymce.ui.TextBox',
        [
            'global!document',
            'tinymce.core.util.Tools',
            'tinymce.ui.DomUtils',
            'tinymce.ui.Widget'
        ],
  function (document, Tools, DomUtils, Widget) {
      return Widget.extend({
      /**
       * Constructs a instance with the specified settings.
       *
       * @constructor
       * @param {Object} settings Name/value object with settings.
       * @setting {Boolean} multiline True if the textbox is a multiline control.
       * @setting {Number} maxLength Max length for the textbox.
       * @setting {Number} size Size of the textbox in characters.
       */
          init: function (settings) {
              var self = this;

              self._super(settings);

              self.classes.add('textbox');

              if (settings.multiline) {
                  self.classes.add('multiline');
              } else {
                  self.on('keydown', function (e) {
                      var rootControl;

                      if (e.keyCode == 13) {
                          e.preventDefault();

              // Find root control that we can do toJSON on
                          self.parents().reverse().each(function (ctrl) {
                              if (ctrl.toJSON) {
                                  rootControl = ctrl;
                                  return false;
                              }
                          });

              // Fire event on current text box with the serialized data of the whole form
                          self.fire('submit', { data: rootControl.toJSON() });
                      }
                  });

                  self.on('keyup', function (e) {
                      self.state.set('value', e.target.value);
                  });
              }
          },

      /**
       * Repaints the control after a layout operation.
       *
       * @method repaint
       */
          repaint: function () {
              var self = this, style, rect, borderBox, borderW, borderH = 0, lastRepaintRect;

              style = self.getEl().style;
              rect = self._layoutRect;
              lastRepaintRect = self._lastRepaintRect || {};

        // Detect old IE 7+8 add lineHeight to align caret vertically in the middle
              var doc = document;
              if (!self.settings.multiline && doc.all && (!doc.documentMode || doc.documentMode <= 8)) {
                  style.lineHeight = (rect.h - borderH) + 'px';
              }

              borderBox = self.borderBox;
              borderW = borderBox.left + borderBox.right + 8;
              borderH = borderBox.top + borderBox.bottom + (self.settings.multiline ? 8 : 0);

              if (rect.x !== lastRepaintRect.x) {
                  style.left = rect.x + 'px';
                  lastRepaintRect.x = rect.x;
              }

              if (rect.y !== lastRepaintRect.y) {
                  style.top = rect.y + 'px';
                  lastRepaintRect.y = rect.y;
              }

              if (rect.w !== lastRepaintRect.w) {
                  style.width = (rect.w - borderW) + 'px';
                  lastRepaintRect.w = rect.w;
              }

              if (rect.h !== lastRepaintRect.h) {
                  style.height = (rect.h - borderH) + 'px';
                  lastRepaintRect.h = rect.h;
              }

              self._lastRepaintRect = lastRepaintRect;
              self.fire('repaint', {}, false);

              return self;
          },

      /**
       * Renders the control as a HTML string.
       *
       * @method renderHtml
       * @return {String} HTML representing the control.
       */
          renderHtml: function () {
              var self = this, settings = self.settings, attrs, elm;

              attrs = {
                  id: self._id,
                  hidefocus: '1'
              };

              Tools.each([
                  'rows', 'spellcheck', 'maxLength', 'size', 'readonly', 'min',
                  'max', 'step', 'list', 'pattern', 'placeholder', 'required', 'multiple'
              ], function (name) {
                  attrs[name] = settings[name];
              });

              if (self.disabled()) {
                  attrs.disabled = 'disabled';
              }

              if (settings.subtype) {
                  attrs.type = settings.subtype;
              }

              elm = DomUtils.create(settings.multiline ? 'textarea' : 'input', attrs);
              elm.value = self.state.get('value');
              elm.className = self.classes;

              return elm.outerHTML;
          },

          value: function (value) {
              if (arguments.length) {
                  this.state.set('value', value);
                  return this;
              }

        // Make sure the real state is in sync
              if (this.state.get('rendered')) {
                  this.state.set('value', this.getEl().value);
              }

              return this.state.get('value');
          },

      /**
       * Called after the control has been rendered.
       *
       * @method postRender
       */
          postRender: function () {
              var self = this;

              self.getEl().value = self.state.get('value');
              self._super();

              self.$el.on('change', function (e) {
                  self.state.set('value', e.target.value);
                  self.fire('change', e);
              });
          },

          bindStates: function () {
              var self = this;

              self.state.on('change:value', function (e) {
                  if (self.getEl().value != e.value) {
                      self.getEl().value = e.value;
                  }
              });

              self.state.on('change:disabled', function (e) {
                  self.getEl().disabled = e.value;
              });

              return self._super();
          },

          remove: function () {
              this.$el.off();
              this._super();
          }
      });
  }
);

/**
 * Api.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.ui.Api',
        [
            'tinymce.core.ui.Factory',
            'tinymce.core.util.Tools',
            'tinymce.ui.AbsoluteLayout',
            'tinymce.ui.BrowseButton',
            'tinymce.ui.Button',
            'tinymce.ui.ButtonGroup',
            'tinymce.ui.Checkbox',
            'tinymce.ui.Collection',
            'tinymce.ui.ColorBox',
            'tinymce.ui.ColorButton',
            'tinymce.ui.ColorPicker',
            'tinymce.ui.ComboBox',
            'tinymce.ui.Container',
            'tinymce.ui.Control',
            'tinymce.ui.DragHelper',
            'tinymce.ui.DropZone',
            'tinymce.ui.ElementPath',
            'tinymce.ui.FieldSet',
            'tinymce.ui.FilePicker',
            'tinymce.ui.FitLayout',
            'tinymce.ui.FlexLayout',
            'tinymce.ui.FloatPanel',
            'tinymce.ui.FlowLayout',
            'tinymce.ui.Form',
            'tinymce.ui.FormatControls',
            'tinymce.ui.FormItem',
            'tinymce.ui.GridLayout',
            'tinymce.ui.Iframe',
            'tinymce.ui.InfoBox',
            'tinymce.ui.KeyboardNavigation',
            'tinymce.ui.Label',
            'tinymce.ui.Layout',
            'tinymce.ui.ListBox',
            'tinymce.ui.Menu',
            'tinymce.ui.MenuBar',
            'tinymce.ui.MenuButton',
            'tinymce.ui.MenuItem',
            'tinymce.ui.MessageBox',
            'tinymce.ui.Movable',
            'tinymce.ui.Notification',
            'tinymce.ui.Panel',
            'tinymce.ui.PanelButton',
            'tinymce.ui.Path',
            'tinymce.ui.Progress',
            'tinymce.ui.Radio',
            'tinymce.ui.ReflowQueue',
            'tinymce.ui.Resizable',
            'tinymce.ui.ResizeHandle',
            'tinymce.ui.Scrollable',
            'tinymce.ui.SelectBox',
            'tinymce.ui.Selector',
            'tinymce.ui.Slider',
            'tinymce.ui.Spacer',
            'tinymce.ui.SplitButton',
            'tinymce.ui.StackLayout',
            'tinymce.ui.TabPanel',
            'tinymce.ui.TextBox',
            'tinymce.ui.Throbber',
            'tinymce.ui.Toolbar',
            'tinymce.ui.Tooltip',
            'tinymce.ui.Widget',
            'tinymce.ui.Window'
        ],
  function (
    Factory, Tools, AbsoluteLayout, BrowseButton, Button, ButtonGroup, Checkbox, Collection, ColorBox, ColorButton, ColorPicker, ComboBox, Container, Control,
    DragHelper, DropZone, ElementPath, FieldSet, FilePicker, FitLayout, FlexLayout, FloatPanel, FlowLayout, Form, FormatControls, FormItem, GridLayout, Iframe,
    InfoBox, KeyboardNavigation, Label, Layout, ListBox, Menu, MenuBar, MenuButton, MenuItem, MessageBox, Movable, Notification, Panel, PanelButton, Path, Progress,
    Radio, ReflowQueue, Resizable, ResizeHandle, Scrollable, SelectBox, Selector, Slider, Spacer, SplitButton, StackLayout, TabPanel, TextBox, Throbber, Toolbar,
    Tooltip, Widget, Window
  ) {
      var getApi = function () {
          return {
              Selector: Selector,
              Collection: Collection,
              ReflowQueue: ReflowQueue,
              Control: Control,
              Factory: Factory,
              KeyboardNavigation: KeyboardNavigation,
              Container: Container,
              DragHelper: DragHelper,
              Scrollable: Scrollable,
              Panel: Panel,
              Movable: Movable,
              Resizable: Resizable,
              FloatPanel: FloatPanel,
              Window: Window,
              MessageBox: MessageBox,
              Tooltip: Tooltip,
              Widget: Widget,
              Progress: Progress,
              Notification: Notification,
              Layout: Layout,
              AbsoluteLayout: AbsoluteLayout,
              Button: Button,
              ButtonGroup: ButtonGroup,
              Checkbox: Checkbox,
              ComboBox: ComboBox,
              ColorBox: ColorBox,
              PanelButton: PanelButton,
              ColorButton: ColorButton,
              ColorPicker: ColorPicker,
              Path: Path,
              ElementPath: ElementPath,
              FormItem: FormItem,
              Form: Form,
              FieldSet: FieldSet,
              FilePicker: FilePicker,
              FitLayout: FitLayout,
              FlexLayout: FlexLayout,
              FlowLayout: FlowLayout,
              FormatControls: FormatControls,
              GridLayout: GridLayout,
              Iframe: Iframe,
              InfoBox: InfoBox,
              Label: Label,
              Toolbar: Toolbar,
              MenuBar: MenuBar,
              MenuButton: MenuButton,
              MenuItem: MenuItem,
              Throbber: Throbber,
              Menu: Menu,
              ListBox: ListBox,
              Radio: Radio,
              ResizeHandle: ResizeHandle,
              SelectBox: SelectBox,
              Slider: Slider,
              Spacer: Spacer,
              SplitButton: SplitButton,
              StackLayout: StackLayout,
              TabPanel: TabPanel,
              TextBox: TextBox,
              DropZone: DropZone,
              BrowseButton: BrowseButton
          };
      };

      var appendTo = function (target) {
          if (target.ui) {
              Tools.each(getApi(), function (ref, key) {
                  target.ui[key] = ref;
              });
          } else {
              target.ui = getApi();
          }
      };

      var registerToFactory = function () {
          Tools.each(getApi(), function (ref, key) {
              Factory.add(key, ref);
          });
      };

      var Api = {
          appendTo: appendTo,
          registerToFactory: registerToFactory
      };

      return Api;
  }
);
/**
 * Theme.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

    define(
  'tinymce.themes.inlite.Theme',
        [
            'global!window',
            'tinymce.core.ThemeManager',
            'tinymce.themes.inlite.api.ThemeApi',
            'tinymce.themes.inlite.ui.Buttons',
            'tinymce.themes.inlite.ui.Panel',
            'tinymce.ui.Api',
            'tinymce.ui.FormatControls'
        ],
  function (window, ThemeManager, ThemeApi, Buttons, Panel, Api, FormatControls) {
      Api.registerToFactory();
      Api.appendTo(window.tinymce ? window.tinymce : {});

      ThemeManager.add('inlite', function (editor) {
          var panel = new Panel();

          FormatControls.setup(editor);
          Buttons.addToEditor(editor, panel);

          return ThemeApi.get(editor, panel);
      });

      return function () { };
  }
);

    dem('tinymce.themes.inlite.Theme')();
})();
