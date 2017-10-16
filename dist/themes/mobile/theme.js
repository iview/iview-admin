(function () {

var defs = {}; // id -> {dependencies, definition, instance (possibly undefined)}

// Used when there is no 'main' module.
// The name is probably (hopefully) unique so minification removes for releases.
var register_3795 = function (id) {
  var module = dem(id);
  var fragments = id.split('.');
  var target = Function('return this;')();
  for (var i = 0; i < fragments.length - 1; ++i) {
    if (target[fragments[i]] === undefined)
      target[fragments[i]] = {};
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
  for (var i = 0; i < len; ++i)
    instances[i] = dem(dependencies[i]);
  var defResult = definition.apply(null, instances);
  if (defResult === undefined)
     throw 'module [' + id + '] returned undefined';
  actual.instance = defResult;
};

var def = function (id, dependencies, definition) {
  if (typeof id !== 'string')
    throw 'module id must be a string';
  else if (dependencies === undefined)
    throw 'no dependencies for ' + id;
  else if (definition === undefined)
    throw 'no definition function for ' + id;
  defs[id] = {
    deps: dependencies,
    defn: definition,
    instance: undefined
  };
};

var dem = function (id) {
  var actual = defs[id];
  if (actual === undefined)
    throw 'module [' + id + '] was undefined';
  else if (actual.instance === undefined)
    instantiate(id);
  return actual.instance;
};

var req = function (ids, callback) {
  var len = ids.length;
  var instances = new Array(len);
  for (var i = 0; i < len; ++i)
    instances[i] = dem(ids[i]);
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
/*jsc
["tinymce.themes.mobile.Theme","ephox.alloy.api.behaviour.Swapping","ephox.alloy.api.events.AlloyTriggers","ephox.alloy.api.system.Attachment","ephox.alloy.debugging.Debugging","ephox.katamari.api.Cell","ephox.katamari.api.Fun","ephox.sand.api.PlatformDetection","ephox.sugar.api.dom.Focus","ephox.sugar.api.dom.Insert","ephox.sugar.api.node.Element","ephox.sugar.api.node.Node","tinymce.core.dom.DOMUtils","tinymce.core.ThemeManager","tinymce.themes.mobile.alien.TinyCodeDupe","tinymce.themes.mobile.channels.TinyChannels","tinymce.themes.mobile.features.Features","tinymce.themes.mobile.style.Styles","tinymce.themes.mobile.touch.view.Orientation","tinymce.themes.mobile.ui.AndroidRealm","tinymce.themes.mobile.ui.Buttons","tinymce.themes.mobile.ui.IosRealm","tinymce.themes.mobile.util.CssUrls","tinymce.themes.mobile.util.FormatChangers","tinymce.themes.mobile.util.SkinLoaded","ephox.alloy.api.behaviour.Behaviour","ephox.alloy.behaviour.swapping.SwapApis","ephox.alloy.behaviour.swapping.SwapSchema","ephox.alloy.api.events.SystemEvents","global!Array","global!Error","ephox.katamari.api.Merger","ephox.katamari.api.Obj","ephox.katamari.api.Arr","ephox.katamari.api.Option","ephox.sugar.api.search.Traverse","ephox.sugar.api.dom.Remove","ephox.sugar.api.node.Body","ephox.alloy.log.AlloyLogger","ephox.boulder.api.Objects","ephox.katamari.api.Options","global!console","ephox.katamari.api.Thunk","ephox.sand.core.PlatformDetection","global!navigator","ephox.sugar.api.dom.Compare","global!document","ephox.sugar.api.search.PredicateExists","ephox.sugar.api.node.NodeTypes","global!tinymce.util.Tools.resolve","ephox.alloy.api.behaviour.Receiving","ephox.alloy.api.behaviour.Toggling","ephox.alloy.api.component.Memento","ephox.katamari.api.Type","global!setTimeout","global!window","tinymce.themes.mobile.channels.Receivers","ephox.alloy.api.behaviour.Unselecting","ephox.alloy.api.ui.Button","tinymce.themes.mobile.util.UiDomFactory","tinymce.themes.mobile.ui.ColorSlider","tinymce.themes.mobile.ui.FontSizeSlider","tinymce.themes.mobile.ui.ImagePicker","tinymce.themes.mobile.ui.LinkButton","tinymce.themes.mobile.util.StyleFormats","ephox.sugar.api.events.DomEvent","global!clearInterval","global!Math","global!setInterval","ephox.alloy.api.behaviour.Replacing","ephox.katamari.api.Singleton","tinymce.themes.mobile.api.AndroidWebapp","tinymce.themes.mobile.toolbar.ScrollingToolbar","tinymce.themes.mobile.ui.CommonRealm","tinymce.themes.mobile.ui.Dropup","tinymce.themes.mobile.ui.OuterContainer","tinymce.themes.mobile.api.IosWebapp","tinymce.core.EditorManager","ephox.alloy.behaviour.common.Behaviour","ephox.alloy.behaviour.common.NoState","ephox.boulder.api.FieldSchema","ephox.boulder.combine.ResultCombine","ephox.boulder.core.ObjChanger","ephox.boulder.core.ObjReader","ephox.boulder.core.ObjWriter","ephox.boulder.api.ValueSchema","ephox.sugar.api.properties.Class","ephox.alloy.api.events.NativeEvents","ephox.sand.core.Browser","ephox.sand.core.OperatingSystem","ephox.sand.detect.DeviceType","ephox.sand.detect.UaString","ephox.sand.info.PlatformInfo","global!String","global!Object","ephox.katamari.api.Struct","ephox.sugar.alien.Recurse","ephox.sand.api.Node","ephox.sugar.api.search.Selectors","ephox.sugar.api.dom.InsertAll","ephox.alloy.alien.Truncate","ephox.sugar.api.search.PredicateFind","ephox.alloy.behaviour.receiving.ActiveReceiving","ephox.alloy.behaviour.receiving.ReceivingSchema","ephox.alloy.behaviour.toggling.ActiveToggle","ephox.alloy.behaviour.toggling.ToggleApis","ephox.alloy.behaviour.toggling.ToggleSchema","ephox.alloy.registry.Tagger","ephox.alloy.behaviour.unselecting.ActiveUnselecting","ephox.alloy.api.behaviour.Focusing","ephox.alloy.api.behaviour.Keying","ephox.alloy.api.ui.Sketcher","ephox.alloy.ui.common.ButtonBase","ephox.alloy.api.component.DomFactory","ephox.katamari.api.Strings","ephox.alloy.api.ui.Slider","ephox.sugar.api.properties.Css","tinymce.themes.mobile.ui.ToolbarWidgets","tinymce.themes.mobile.ui.SizeSlider","tinymce.themes.mobile.util.FontSizes","ephox.alloy.api.events.AlloyEvents","ephox.imagetools.api.BlobConversions","ephox.katamari.api.Id","ephox.alloy.api.behaviour.Representing","tinymce.themes.mobile.bridge.LinkBridge","tinymce.themes.mobile.ui.Inputs","tinymce.themes.mobile.ui.SerialisedDialog","tinymce.themes.mobile.util.RangePreserver","tinymce.themes.mobile.features.DefaultStyleFormats","tinymce.themes.mobile.ui.StylesMenu","tinymce.themes.mobile.util.StyleConversions","ephox.sugar.impl.FilteredEvent","ephox.alloy.behaviour.replacing.ReplaceApis","ephox.alloy.api.component.GuiFactory","tinymce.themes.mobile.android.core.AndroidMode","tinymce.themes.mobile.api.MobileSchema","tinymce.themes.mobile.touch.view.TapToEditMask","ephox.alloy.api.behaviour.AddEventsBehaviour","ephox.alloy.api.ui.Container","ephox.alloy.api.ui.Toolbar","ephox.alloy.api.ui.ToolbarGroup","tinymce.themes.mobile.ios.scroll.Scrollables","tinymce.themes.mobile.touch.scroll.Scrollable","ephox.alloy.api.behaviour.Sliding","ephox.alloy.api.system.Gui","tinymce.themes.mobile.ios.core.IosMode","ephox.alloy.alien.EventRoot","ephox.sand.detect.Version","ephox.katamari.str.StrAppend","ephox.katamari.str.StringParts","ephox.alloy.construct.EventHandler","ephox.katamari.api.Result","ephox.katamari.api.Results","ephox.alloy.debugging.FunctionAnnotator","ephox.alloy.dom.DomModification","ephox.boulder.api.FieldPresence","ephox.boulder.core.ValueProcessor","ephox.boulder.core.ChoiceProcessor","ephox.boulder.format.PrettyPrinter","ephox.alloy.behaviour.common.BehaviourState","ephox.sugar.api.properties.Toggler","ephox.sugar.api.properties.Attr","ephox.sugar.impl.ClassList","ephox.katamari.data.Immutable","ephox.katamari.data.MixedBag","ephox.sand.util.Global","ephox.sugar.api.properties.Html","ephox.sugar.api.dom.Replication","ephox.sugar.impl.ClosestOrAncestor","ephox.alloy.data.Fields","ephox.alloy.behaviour.toggling.ToggleModes","ephox.alloy.ephemera.AlloyTags","global!Date","ephox.sugar.api.search.SelectorFind","ephox.alloy.behaviour.focusing.ActiveFocus","ephox.alloy.behaviour.focusing.FocusApis","ephox.alloy.behaviour.focusing.FocusSchema","ephox.alloy.behaviour.keyboard.KeyboardBranches","ephox.alloy.behaviour.keyboard.KeyingState","ephox.alloy.api.ui.GuiTypes","ephox.alloy.api.ui.UiSketcher","ephox.alloy.parts.AlloyParts","ephox.alloy.parts.PartType","ephox.alloy.ui.slider.SliderParts","ephox.alloy.ui.slider.SliderSchema","ephox.alloy.ui.slider.SliderUi","ephox.sugar.impl.Style","ephox.sugar.api.search.TransformFind","ephox.imagetools.util.Conversions","ephox.imagetools.util.ImageResult","ephox.alloy.behaviour.representing.ActiveRepresenting","ephox.alloy.behaviour.representing.RepresentApis","ephox.alloy.behaviour.representing.RepresentSchema","ephox.alloy.behaviour.representing.RepresentState","ephox.sugar.api.properties.TextContent","ephox.alloy.api.behaviour.Composing","ephox.alloy.api.ui.DataField","ephox.alloy.api.ui.Input","ephox.alloy.api.behaviour.Disabling","ephox.alloy.api.behaviour.Highlighting","ephox.alloy.api.ui.Form","ephox.sugar.api.search.SelectorFilter","ephox.sugar.api.view.Width","tinymce.themes.mobile.model.SwipingModel","ephox.alloy.api.behaviour.Transitioning","ephox.alloy.api.component.Component","ephox.alloy.api.component.ComponentApi","ephox.alloy.api.system.NoContextApi","ephox.alloy.events.DefaultEvents","ephox.alloy.spec.CustomSpec","ephox.alloy.api.ui.Menu","ephox.alloy.api.ui.TieredMenu","ephox.alloy.alien.AriaFocus","tinymce.themes.mobile.android.core.AndroidEvents","tinymce.themes.mobile.android.core.AndroidSetup","tinymce.themes.mobile.ios.core.PlatformEditor","tinymce.themes.mobile.util.Thor","tinymce.themes.mobile.touch.view.MetaViewport","ephox.katamari.api.Throttler","ephox.alloy.ui.schema.ToolbarSchema","ephox.alloy.api.behaviour.Tabstopping","ephox.alloy.ui.schema.ToolbarGroupSchema","ephox.alloy.behaviour.sliding.ActiveSliding","ephox.alloy.behaviour.sliding.SlidingApis","ephox.alloy.behaviour.sliding.SlidingSchema","ephox.alloy.behaviour.sliding.SlidingState","ephox.alloy.api.system.SystemApi","ephox.alloy.events.DescribedHandler","ephox.alloy.events.GuiEvents","ephox.alloy.events.Triggers","ephox.alloy.registry.Registry","tinymce.themes.mobile.ios.core.IosEvents","tinymce.themes.mobile.ios.core.IosSetup","tinymce.themes.mobile.ios.view.IosKeyboard","ephox.katamari.api.Resolve","global!Number","ephox.katamari.api.Adt","ephox.boulder.core.SchemaError","ephox.boulder.format.TypeTokens","ephox.sand.api.JSON","ephox.alloy.dom.DomDefinition","ephox.katamari.util.BagUtils","ephox.katamari.api.Contracts","ephox.sugar.api.properties.AttrList","ephox.sugar.api.node.Elements","ephox.alloy.menu.util.MenuMarkers","ephox.alloy.keying.CyclicType","ephox.alloy.keying.ExecutionType","ephox.alloy.keying.FlatgridType","ephox.alloy.keying.FlowType","ephox.alloy.keying.MatrixType","ephox.alloy.keying.MenuType","ephox.alloy.keying.SpecialType","ephox.alloy.parts.PartSubstitutes","ephox.alloy.spec.UiSubstitutes","ephox.alloy.spec.SpecSchema","ephox.alloy.ui.slider.SliderActions","ephox.alloy.behaviour.representing.DatasetStore","ephox.alloy.behaviour.representing.ManualStore","ephox.alloy.behaviour.representing.MemoryStore","ephox.sugar.impl.Dimension","ephox.imagetools.util.Promise","ephox.imagetools.util.Canvas","ephox.imagetools.util.Mime","ephox.imagetools.util.ImageSize","ephox.alloy.behaviour.composing.ComposeApis","ephox.alloy.behaviour.composing.ComposeSchema","ephox.alloy.ui.common.InputBase","ephox.alloy.behaviour.disabling.ActiveDisable","ephox.alloy.behaviour.disabling.DisableApis","ephox.alloy.behaviour.disabling.DisableSchema","ephox.alloy.behaviour.highlighting.HighlightApis","ephox.alloy.behaviour.highlighting.HighlightSchema","ephox.sugar.api.search.PredicateFilter","ephox.alloy.behaviour.transitioning.ActiveTransitioning","ephox.alloy.behaviour.transitioning.TransitionApis","ephox.alloy.behaviour.transitioning.TransitionSchema","ephox.alloy.api.component.CompBehaviours","ephox.alloy.behaviour.common.BehaviourBlob","ephox.alloy.construct.ComponentDom","ephox.alloy.construct.ComponentEvents","ephox.alloy.construct.CustomDefinition","ephox.alloy.dom.DomRender","ephox.alloy.ui.schema.MenuSchema","ephox.alloy.ui.single.MenuSpec","ephox.alloy.ui.single.TieredMenuSpec","tinymce.themes.mobile.util.TappingEvent","tinymce.themes.mobile.android.focus.ResumeEditing","tinymce.themes.mobile.util.DataAttributes","tinymce.themes.mobile.util.Rectangles","ephox.sugar.api.selection.WindowSelection","global!clearTimeout","ephox.alloy.behaviour.tabstopping.ActiveTabstopping","ephox.alloy.behaviour.tabstopping.TabstopSchema","ephox.sugar.api.properties.Classes","ephox.sugar.api.view.Height","ephox.alloy.alien.Keys","ephox.alloy.events.TapEvent","ephox.alloy.events.EventSource","ephox.alloy.events.SimulatedEvent","ephox.alloy.events.EventRegistry","ephox.sugar.api.view.Location","global!parseInt","tinymce.themes.mobile.ios.focus.FakeSelection","tinymce.themes.mobile.ios.scroll.IosScrolling","tinymce.themes.mobile.ios.smooth.BackgroundActivity","tinymce.themes.mobile.ios.view.Greenzone","tinymce.themes.mobile.ios.view.IosUpdates","tinymce.themes.mobile.ios.view.IosViewport","tinymce.themes.mobile.util.CaptureBin","tinymce.themes.mobile.ios.focus.ResumeEditing","ephox.katamari.api.Global","ephox.alloy.keying.KeyingType","ephox.alloy.navigation.ArrNavigation","ephox.alloy.navigation.KeyMatch","ephox.alloy.navigation.KeyRules","ephox.alloy.alien.EditableFields","ephox.alloy.keying.KeyingTypes","ephox.alloy.navigation.DomMovement","ephox.alloy.navigation.DomPinpoint","ephox.alloy.navigation.WrapArrNavigation","ephox.alloy.navigation.DomNavigation","ephox.alloy.navigation.MatrixNavigation","ephox.alloy.ui.slider.SliderModel","ephox.sugar.api.properties.Value","ephox.alloy.alien.Cycles","ephox.alloy.alien.ObjIndex","ephox.alloy.alien.PrioritySort","ephox.alloy.api.focus.FocusManagers","ephox.alloy.menu.build.ItemType","ephox.alloy.menu.build.SeparatorType","ephox.alloy.menu.build.WidgetType","ephox.alloy.menu.util.ItemEvents","ephox.alloy.menu.util.MenuEvents","ephox.alloy.menu.layered.LayeredState","ephox.alloy.alien.DelayedFunction","global!isNaN","ephox.sugar.api.selection.Awareness","ephox.sugar.api.selection.Selection","ephox.sugar.api.dom.DocumentPosition","ephox.sugar.api.node.Fragment","ephox.sugar.api.selection.Situ","ephox.sugar.selection.core.NativeRange","ephox.sugar.selection.core.SelectionDirection","ephox.sugar.selection.query.CaretRange","ephox.sugar.selection.query.Within","ephox.sugar.selection.quirks.Prefilter","ephox.alloy.alien.TransformFind","ephox.sugar.api.view.Position","ephox.sugar.api.dom.Dom","tinymce.themes.mobile.touch.focus.CursorRefresh","ephox.katamari.api.Future","tinymce.themes.mobile.ios.smooth.SmoothAnimation","tinymce.themes.mobile.ios.view.DeviceZones","ephox.katamari.api.LazyValue","ephox.katamari.api.Futures","ephox.sugar.api.properties.Direction","ephox.alloy.navigation.ArrPinpoint","ephox.sugar.api.view.Visibility","ephox.alloy.menu.build.WidgetParts","ephox.alloy.menu.layered.MenuPathing","ephox.sugar.api.node.Text","ephox.sugar.selection.query.ContainerPoint","ephox.sugar.selection.query.EdgePoint","ephox.katamari.async.Bounce","tinymce.themes.mobile.ios.view.Devices","ephox.katamari.async.AsyncValues","ephox.sugar.impl.NodeValue","ephox.sugar.selection.alien.Geometry","ephox.sugar.selection.query.TextPoint","ephox.sugar.api.selection.CursorPosition"]
jsc*/
defineGlobal("global!Array", Array);
defineGlobal("global!Error", Error);
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

    var tripleEquals = function(a, b) {
      return a === b;
    };

    // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
    var curry = function (f) {
      // equivalent to arguments.slice(1)
      // starting at 1 because 0 is the f, makes things tricky.
      // Pay attention to what variable is where, and the -1 magic.
      // thankfully, we have tests for this.
      var args = new Array(arguments.length - 1);
      for (var i = 1; i < arguments.length; i++) args[i-1] = arguments[i];

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

    var call = function(f) {
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

defineGlobal("global!Object", Object);
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
        toString: Fun.constant("none()")
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
          return optfab.fold(none, function(fab) {
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

defineGlobal("global!String", String);
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

      var fastIndex = function (xs, x) { return  pIndexOf.call(xs, x); };

      var slowIndex = function(xs, x) { return slowIndexOf(xs, x); };

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

    var map = function(xs, f) {
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
    var each = function(xs, f) {
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

    var partition = function(xs, pred) {
      var pass = [];
      var fail = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var arr = pred(x, i, xs) ? pass : fail;
        arr.push(x);
      }
      return { pass: pass, fail: fail };
    };

    var filter = function(xs, pred) {
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
        if (! Array.prototype.isPrototypeOf(xs[i])) throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
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

    var mapToObject = function(xs, f) {
      var r = {};
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        r[String(x)] = f(x, i);
      }
      return r;
    };

    var pure = function(x) {
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
      for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
        o = o[parts[i]];
      return o;
    };

    /** resolve :: (String, JsObj?) -> JsObj */
    var resolve = function (p, scope) {
      var parts = p.split('.');
      return path(parts, scope);
    };

    /** step :: (JsObj, String) -> JsObj */
    var step = function (o, part) {
      if (o[part] === undefined || o[part] === null)
        o[part] = {};
      return o[part];
    };

    /** forge :: ([String], JsObj?) -> JsObj */
    var forge = function (parts, target) {
      var o = target !== undefined ? target : Global;      
      for (var i = 0; i < parts.length; ++i)
        o = step(o, parts[i]);
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
define(
  'ephox.katamari.api.Thunk',

  [
  ],

  function () {

    var cached = function (f) {
      var called = false;
      var r;
      return function() {
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

defineGlobal("global!Number", Number);
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
      if (!r) return { major : 0, minor : 0 };
      var group = function(i) {
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
      var isTablet = isiPad || isAndroid3 || ( isAndroid4 && /mobile/i.test(userAgent) === true );
      var isTouch = os.isiOS() || os.isAndroid();
      var isPhone = isTouch && !isTablet;

      var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;

      return {
        isiPad : Fun.constant(isiPad),
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
    var first = function(str, count) {
     return str.substr(0, count);
    };

    /** Return the last 'count' letters from 'str'.
    *  e.g. last("abcde", 2) === "de"
    */
    var last = function(str, count) {
     return str.substr(str.length - count, str.length);
    };

    var head = function(str) {
      return str === '' ? Option.none() : Option.some(str.substr(0, 1));
    };

    var tail = function(str) {
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
    var checkRange = function(str, substr, start) {
      if (substr === '') return true;
      if (str.length < substr.length) return false;
      var x = str.substr(start, start + substr.length);
      return x === substr;
    };

    /** Given a string and object, perform template-replacements on the string, as specified by the object.
     * Any template fields of the form ${name} are replaced by the string or number specified as obj["name"]
     * Based on Douglas Crockford's 'supplant' method for template-replace of strings. Uses different template format.
     */
    var supplant = function(str, obj) {
      var isStringOrNumber = function(a) {
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
 
    var contains = function(str, substr) {
      return str.indexOf(substr) !== -1;
    };

    var capitalize = function(str) {
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
    var startsWith = function(str, prefix) {
      return checkRange(str, prefix, 0);
    };

    /** Does 'str' end with 'suffix'?
     *  Note: all strings end with the empty string.
     *        More formally, for all strings x, endsWith(x, "").
     *        This is so that for all strings x and y, endsWith(x + y, y)
     */
    var endsWith = function(str, suffix) {
      return checkRange(str, suffix, str.length - suffix.length);
    };

   
    /** removes all leading and trailing spaces */
    var trim = function(str) {
      return str.replace(/^\s+|\s+$/g, '');
    };

    var lTrim = function(str) {
      return str.replace(/^\s+/g, '');
    };

    var rTrim = function(str) {
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
        name : 'Edge',
        versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
        search: function (uastring) {
          var monstrosity = Strings.contains(uastring, 'edge/') && Strings.contains(uastring, 'chrome') && Strings.contains(uastring, 'safari') && Strings.contains(uastring, 'applewebkit');
          return monstrosity;
        }
      },
      {
        name : 'Chrome',
        versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
        search : function (uastring) {
          return Strings.contains(uastring, 'chrome') && !Strings.contains(uastring, 'chromeframe');
        }
      },
      {
        name : 'IE',
        versionRegexes: [/.*?msie\ ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/],
        search: function (uastring) {
          return Strings.contains(uastring, 'msie') || Strings.contains(uastring, 'trident');
        }
      },
      // INVESTIGATE: Is this still the Opera user agent?
      {
        name : 'Opera',
        versionRegexes: [normalVersionRegex, /.*?opera\/([0-9]+)\.([0-9]+).*/],
        search : checkContains('opera')
      },
      {
        name : 'Firefox',
        versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
        search : checkContains('firefox')
      },
      {
        name : 'Safari',
        versionRegexes: [normalVersionRegex, /.*?cpu os ([0-9]+)_([0-9]+).*/],
        search : function (uastring) {
          return (Strings.contains(uastring, 'safari') || Strings.contains(uastring, 'mobile/')) && Strings.contains(uastring, 'applewebkit');
        }
      }
    ];

    var oses = [
      {
        name : 'Windows',
        search : checkContains('win'),
        versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name : 'iOS',
        search : function (uastring) {
          return Strings.contains(uastring, 'iphone') || Strings.contains(uastring, 'ipad');
        },
        versionRegexes: [/.*?version\/\ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/]
      },
      {
        name : 'Android',
        search : checkContains('android'),
        versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
      },
      {
        name : 'OSX',
        search : checkContains('os x'),
        versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
      },
      {
        name : 'Linux',
        search : checkContains('linux'),
        versionRegexes: [ ]
      },
      { name : 'Solaris',
        search : checkContains('sunos'),
        versionRegexes: [ ]
      },
      {
       name : 'FreeBSD',
       search : checkContains('freebsd'),
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
defineGlobal("global!navigator", navigator);
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
define("global!console", [], function () { if (typeof console === "undefined") console = { log: function () {} }; return console; });
defineGlobal("global!document", document);
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
  'ephox.sugar.api.node.NodeTypes',

  [

  ],

  function () {
    return {
      ATTRIBUTE:              2,
      CDATA_SECTION:          4,
      COMMENT:                8,
      DOCUMENT:               9,
      DOCUMENT_TYPE:          10,
      DOCUMENT_FRAGMENT:      11,
      ELEMENT:                1,
      TEXT:                   3,
      PROCESSING_INSTRUCTION: 7,
      ENTITY_REFERENCE:       5,
      ENTITY:                 6,
      NOTATION:               12
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
      return test.matches !== undefined ? STANDARD :
             test.msMatchesSelector !== undefined ? MSSTANDARD :
             test.webkitMatchesSelector !== undefined ? WEBKITSTANDARD :
             test.mozMatchesSelector !== undefined ? FIREFOXSTANDARD :
             -1;
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
  'ephox.alloy.alien.EventRoot',

  [
    'ephox.sugar.api.dom.Compare'
  ],

  function (Compare) {
    var isSource = function (component, simulatedEvent) {
      return Compare.eq(component.element(), simulatedEvent.event().target());
    };

    return {
      isSource: isSource
    };
  }
);
define(
  'ephox.alloy.api.events.NativeEvents',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    return {
      contextmenu: Fun.constant('contextmenu'),
      touchstart: Fun.constant('touchstart'),
      touchmove: Fun.constant('touchmove'),
      touchend: Fun.constant('touchend'),
      gesturestart: Fun.constant('gesturestart'),
      mousedown: Fun.constant('mousedown'),
      mousemove: Fun.constant('mousemove'),
      mouseout: Fun.constant('mouseout'),
      mouseup: Fun.constant('mouseup'),
      mouseover: Fun.constant('mouseover'),
      // Not really a native event as it has to be simulated
      focusin: Fun.constant('focusin'),

      keydown: Fun.constant('keydown'),

      input: Fun.constant('input'),
      change: Fun.constant('change'),
      focus: Fun.constant('focus'),

      click: Fun.constant('click'),

      transitionend: Fun.constant('transitionend'),
      selectstart: Fun.constant('selectstart')
    };
  }
);

define(
  'ephox.alloy.api.events.SystemEvents',

  [
    'ephox.alloy.api.events.NativeEvents',
    'ephox.katamari.api.Fun',
    'ephox.sand.api.PlatformDetection'
  ],

  function (NativeEvents, Fun, PlatformDetection) {
    var alloy = { tap: Fun.constant('alloy.tap') };

    return {
      // This is used to pass focus to a component. A component might interpret
      // this event and pass the DOM focus to one of its children, depending on its
      // focus model.
      focus: Fun.constant('alloy.focus'),

      // This event is fired a small amount of time after the blur has fired. This
      // allows the handler to know what was the focused element, and what is now.
      postBlur: Fun.constant('alloy.blur.post'),

      // This event is fired by gui.broadcast*. It is defined by 'receivers'
      receive: Fun.constant('alloy.receive'),

      // This event is for executing buttons and things that have (mostly) enter actions
      execute: Fun.constant('alloy.execute'),

      // This event is used by a menu to tell an item to focus itself because it has been
      // selected. This might automatically focus inside the item, it might focus the outer
      // part of the widget etc.
      focusItem: Fun.constant('alloy.focus.item'),

      // This event represents a touchstart and touchend on the same location, and fires on
      // the touchend
      tap: alloy.tap,

      // Tap event for touch device, otherwise click event
      tapOrClick: PlatformDetection.detect().deviceType.isTouch() ? alloy.tap : NativeEvents.click,

      // This event represents a longpress on the same location
      longpress: Fun.constant('alloy.longpress'),

      // Fire by a child element to tell the outer element to close
      sandboxClose: Fun.constant('alloy.sandbox.close'),

      // Fired when adding to a world
      systemInit: Fun.constant('alloy.system.init'),

      // Fired when the window scrolls
      windowScroll: Fun.constant('alloy.system.scroll'),

      attachedToDom: Fun.constant('alloy.system.attached'),
      detachedFromDom: Fun.constant('alloy.system.detached'),

      changeTab: Fun.constant('alloy.change.tab'),
      dismissTab: Fun.constant('alloy.dismiss.tab')
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
    var typeOf = function(x) {
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
  'ephox.katamari.api.Merger',

  [
    'ephox.katamari.api.Type',
    'global!Array',
    'global!Error'
  ],

  function (Type, Array, Error) {

    var shallow = function (old, nu) {
      return nu;
    };

    var deep = function (old, nu) {
      var bothObjects = Type.isObject(old) && Type.isObject(nu);
      return bothObjects ? deepMerge(old, nu) : nu;
    };

    var baseMerge = function (merger) {
      return function() {
        // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
        var objects = new Array(arguments.length);
        for (var i = 0; i < objects.length; i++) objects[i] = arguments[i];

        if (objects.length === 0) throw new Error('Can\'t merge zero objects');

        var ret = {};
        for (var j = 0; j < objects.length; j++) {
          var curObject = objects[j];
          for (var key in curObject) if (curObject.hasOwnProperty(key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
        }
        return ret;
      };
    };

    var deepMerge = baseMerge(deep);
    var merge = baseMerge(shallow);

    return {
      deepMerge: deepMerge,
      merge: merge
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
      each(obj, function(x, i) {
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
      each(obj, function(value, name) {
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
  'ephox.alloy.api.events.AlloyTriggers',

  [
    'ephox.alloy.api.events.SystemEvents',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj'
  ],

  function (SystemEvents, Fun, Merger, Obj) {
    var emit = function (component, event) {
      dispatchWith(component, component.element(), event, { });
    };

    var emitWith = function (component, event, properties) {
      dispatchWith(component, component.element(), event, properties);
    };

    var emitExecute = function (component) {
      emit(component, SystemEvents.execute());
    };

    var dispatch = function (component, target, event) {
      dispatchWith(component, target, event, { });
    };

    var dispatchWith = function (component, target, event, properties) {
      var data = Merger.deepMerge({
        target: target
      }, properties);
      component.getSystem().triggerEvent(event, target, Obj.map(data, Fun.constant));
    };

    var dispatchEvent = function (component, target, event, simulatedEvent) {
      component.getSystem().triggerEvent(event, target, simulatedEvent.event());
    };

    var dispatchFocus = function (component, target) {
      component.getSystem().triggerFocus(target, component.element());
    };

    return {
      emit: emit,
      emitWith: emitWith,
      emitExecute: emitExecute,
      dispatch: dispatch,
      dispatchWith: dispatchWith,
      dispatchEvent: dispatchEvent,
      dispatchFocus: dispatchFocus
    };
  }
);

define(
  'ephox.katamari.api.Adt',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Type',
    'global!Array',
    'global!Error',
    'global!console'
  ],

  function (Arr, Obj, Type, Array, Error, console) {
    /*
     * Generates a church encoded ADT (https://en.wikipedia.org/wiki/Church_encoding)
     * For syntax and use, look at the test code.
     */
    var generate = function (cases) {
      // validation
      if (!Type.isArray(cases)) {
        throw new Error('cases must be an array');
      }
      if (cases.length === 0) {
        throw new Error('there must be at least one case');
      }

      var constructors = [ ];

      // adt is mutated to add the individual cases
      var adt = {};
      Arr.each(cases, function (acase, count) {
        var keys = Obj.keys(acase);

        // validation
        if (keys.length !== 1) {
          throw new Error('one and only one name per case');
        }

        var key = keys[0];
        var value = acase[key];

        // validation
        if (adt[key] !== undefined) {
          throw new Error('duplicate key detected:' + key);
        } else if (key === 'cata') {
          throw new Error('cannot have a case named cata (sorry)');
        } else if (!Type.isArray(value)) {
          // this implicitly checks if acase is an object
          throw new Error('case arguments must be an array');
        }

        constructors.push(key);
        //
        // constructor for key
        //
        adt[key] = function () {
          var argLength = arguments.length;

          // validation
          if (argLength !== value.length) {
            throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
          }

          // Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
          var args = new Array(argLength);
          for (var i = 0; i < args.length; i++) args[i] = arguments[i];


          var match = function (branches) {
            var branchKeys = Obj.keys(branches);
            if (constructors.length !== branchKeys.length) {
              throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
            }

            var allReqd = Arr.forall(constructors, function (reqKey) {
              return Arr.contains(branchKeys, reqKey);
            });

            if (!allReqd) throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));

            return branches[key].apply(null, args);
          };

          //
          // the fold function for key
          //
          return {
            fold: function (/* arguments */) {
              // runtime validation
              if (arguments.length !== cases.length) {
                throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
              }
              var target = arguments[count];
              return target.apply(null, args);
            },
            match: match,

            // NOTE: Only for debugging.
            log: function (label) {
              console.log(label, {
                constructors: constructors,
                constructor: key,
                params: args
              });
            }
          };
        };
      });

      return adt;
    };
    return {
      generate: generate
    };
  }
);
define(
  'ephox.boulder.api.FieldPresence',

  [
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Fun'
  ],

  function (Adt, Fun) {
    var adt = Adt.generate([
      { strict: [ ] },
      { defaultedThunk: [ 'fallbackThunk' ] },
      { asOption: [ ] },
      { asDefaultedOptionThunk: [ 'fallbackThunk' ] },
      { mergeWithThunk: [ 'baseThunk' ] }
    ]);

    var defaulted = function (fallback) {
      return adt.defaultedThunk(
        Fun.constant(fallback)
      );
    };

    var asDefaultedOption = function (fallback) {
      return adt.asDefaultedOptionThunk(
        Fun.constant(fallback)
      );
    };

    var mergeWith = function (base) {
      return adt.mergeWithThunk(
        Fun.constant(base)
      );
    };

    return {
      strict: adt.strict,
      asOption: adt.asOption,
      
      defaulted: defaulted,
      defaultedThunk: adt.defaultedThunk,
      
      asDefaultedOption: asDefaultedOption,      
      asDefaultedOptionThunk: adt.asDefaultedOptionThunk,

      mergeWith: mergeWith,
      mergeWithThunk: adt.mergeWithThunk
    };
  }
);
define(
  'ephox.katamari.api.Result',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option'
  ],

  function (Fun, Option) {
    /* The type signatures for Result 
     * is :: this Result a -> a -> Bool
     * or :: this Result a -> Result a -> Result a
     * orThunk :: this Result a -> (_ -> Result a) -> Result a
     * map :: this Result a -> (a -> b) -> Result b
     * each :: this Result a -> (a -> _) -> _ 
     * bind :: this Result a -> (a -> Result b) -> Result b
     * fold :: this Result a -> (_ -> b, a -> b) -> b
     * exists :: this Result a -> (a -> Bool) -> Bool
     * forall :: this Result a -> (a -> Bool) -> Bool
     * toOption :: this Result a -> Option a
     * isValue :: this Result a -> Bool
     * isError :: this Result a -> Bool
     * getOr :: this Result a -> a -> a
     * getOrThunk :: this Result a -> (_ -> a) -> a
     * getOrDie :: this Result a -> a (or throws error)
    */

    var value = function (o) {
      var is = function (v) {
        return o === v;      
      };

      var or = function (opt) {
        return value(o);
      };

      var orThunk = function (f) {
        return value(o);
      };

      var map = function (f) {
        return value(f(o));
      };

      var each = function (f) {
        f(o);
      };

      var bind = function (f) {
        return f(o);
      };

      var fold = function (_, onValue) {
        return onValue(o);
      };

      var exists = function (f) {
        return f(o);
      };

      var forall = function (f) {
        return f(o);
      };

      var toOption = function () {
        return Option.some(o);
      };
     
      return {
        is: is,
        isValue: Fun.constant(true),
        isError: Fun.constant(false),
        getOr: Fun.constant(o),
        getOrThunk: Fun.constant(o),
        getOrDie: Fun.constant(o),
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: each,
        bind: bind,
        exists: exists,
        forall: forall,
        toOption: toOption
      };
    };

    var error = function (message) {
      var getOrThunk = function (f) {
        return f();
      };

      var getOrDie = function () {
        return Fun.die(message)();
      };

      var or = function (opt) {
        return opt;
      };

      var orThunk = function (f) {
        return f();
      };

      var map = function (f) {
        return error(message);
      };

      var bind = function (f) {
        return error(message);
      };

      var fold = function (onError, _) {
        return onError(message);
      };

      return {
        is: Fun.constant(false),
        isValue: Fun.constant(false),
        isError: Fun.constant(true),
        getOr: Fun.identity,
        getOrThunk: getOrThunk,
        getOrDie: getOrDie,
        or: or,
        orThunk: orThunk,
        fold: fold,
        map: map,
        each: Fun.noop,
        bind: bind,
        exists: Fun.constant(false),
        forall: Fun.constant(true),
        toOption: Option.none
      };
    };

    return {
      value: value,
      error: error
    };
  }
);

define(
  'ephox.katamari.api.Results',

  [
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Arr'
  ],

  function (Adt, Arr) {
    var comparison = Adt.generate([
      { bothErrors: [ 'error1', 'error2' ] },
      { firstError: [ 'error1', 'value2' ] },
      { secondError: [ 'value1', 'error2' ] },
      { bothValues: [ 'value1', 'value2' ] }
    ]);

    /** partition :: [Result a] -> { errors: [String], values: [a] } */
    var partition = function (results) {
      var errors = [];
      var values = [];

      Arr.each(results, function (result) {
        result.fold(
          function (err)   { errors.push(err); },
          function (value) { values.push(value); }
        );
      });

      return { errors: errors, values: values };
    };

    /** compare :: (Result a, Result b) -> Comparison a b */
    var compare = function (result1, result2) {
      return result1.fold(function (err1) {
        return result2.fold(function (err2) {
          return comparison.bothErrors(err1, err2);
        }, function (val2) {
          return comparison.firstError(err1, val2);
        });
      }, function (val1) {
        return result2.fold(function (err2) {
          return comparison.secondError(val1, err2);
        }, function (val2) {
          return comparison.bothValues(val1, val2);
        });
      });
    };

    return {
      partition: partition,
      compare: compare
    };
  }
);
define(
  'ephox.boulder.combine.ResultCombine',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Result',
    'ephox.katamari.api.Results'
  ],

  function (Arr, Fun, Merger, Result, Results) {
    var mergeValues = function (values, base) {
      return Result.value(
        Merger.deepMerge.apply(undefined, [ base ].concat(values))
      );
    };

    var mergeErrors = function (errors) {
      return Fun.compose(Result.error, Arr.flatten)(errors);
    };

    var consolidateObj = function (objects, base) {
      var partitions = Results.partition(objects);
      return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
    };

    var consolidateArr = function (objects) {
      var partitions = Results.partition(objects);
      return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : Result.value(partitions.values);
    };

    return {
      consolidateObj: consolidateObj,
      consolidateArr: consolidateArr
    };
  }
);
define(
  'ephox.boulder.core.ObjChanger',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj'
  ],

  function (Arr, Obj) {
    var narrow = function (obj, fields) {
      var r = { };
      Arr.each(fields, function (field) {
        if (obj[field] !== undefined && obj.hasOwnProperty(field)) r[field] = obj[field];
      });

      return r;
    };

    var indexOnKey = function (array, key) {
      var obj = { };
      Arr.each(array, function (a) {
        // FIX: Work out what to do here.
        var keyValue = a[key];
        obj[keyValue] = a;
      });
      return obj;
    };

    var exclude = function (obj, fields) {
      var r = { };
      Obj.each(obj, function (v, k) {
        if (! Arr.contains(fields, k)) {
          r[k] = v;
        }
      });
      return r;
    };

    return {
      narrow: narrow,
      exclude: exclude,
      indexOnKey: indexOnKey
    };
  }
);
define(
  'ephox.boulder.core.ObjReader',

  [
    'ephox.katamari.api.Option'
  ],

  function (Option) {
    var readOpt = function (key) {
      return function (obj) {
        return obj.hasOwnProperty(key) ? Option.from(obj[key]) : Option.none();
      };
    };

    var readOr = function (key, fallback) {
      return function (obj) {
        return readOpt(key)(obj).getOr(fallback);
      };
    };

    var readOptFrom = function (obj, key) {
      return readOpt(key)(obj);
    };

    var hasKey = function (obj, key) {
      return obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null;
    };

    return {
      readOpt: readOpt,
      readOr: readOr,
      readOptFrom: readOptFrom,
      hasKey: hasKey
    };
  }
);
define(
  'ephox.boulder.core.ObjWriter',

  [
    'ephox.katamari.api.Arr'
  ],

  function (Arr) {
    var wrap = function (key, value) {
      var r = {};
      r[key] = value;
      return r;
    };

    var wrapAll = function (keyvalues) {
      var r = {};
      Arr.each(keyvalues, function (kv) {
        r[kv.key] = kv.value;
      });
      return r;
    };

    return {
      wrap: wrap,
      wrapAll: wrapAll
    };
  }
);
define(
  'ephox.boulder.api.Objects',

  [
    'ephox.boulder.combine.ResultCombine',
    'ephox.boulder.core.ObjChanger',
    'ephox.boulder.core.ObjReader',
    'ephox.boulder.core.ObjWriter'
  ],

  function (ResultCombine, ObjChanger, ObjReader, ObjWriter) {
    // Perhaps this level of indirection is unnecessary.
    var narrow = function (obj, fields) {
      return ObjChanger.narrow(obj, fields);
    };

    var exclude = function (obj, fields) {
      return ObjChanger.exclude(obj, fields);
    };

    var readOpt = function (key) {
      return ObjReader.readOpt(key);
    };

    var readOr = function (key, fallback) {
      return ObjReader.readOr(key, fallback);
    };

    var readOptFrom = function (obj, key) {
      return ObjReader.readOptFrom(obj, key);
    };

    var wrap = function (key, value) {
      return ObjWriter.wrap(key, value);
    };

    var wrapAll = function (keyvalues) {
      return ObjWriter.wrapAll(keyvalues);
    };

    var indexOnKey = function (array, key) {
      return ObjChanger.indexOnKey(array, key);
    };

    var consolidate = function (objs, base) {
      return ResultCombine.consolidateObj(objs, base);
    };

    var hasKey = function (obj, key) {
      return ObjReader.hasKey(obj, key);
    };

    return {
      narrow: narrow,
      exclude: exclude,
      readOpt: readOpt,
      readOr: readOr,
      readOptFrom: readOptFrom,
      wrap: wrap,
      wrapAll: wrapAll,
      indexOnKey: indexOnKey,
      hasKey: hasKey,
      consolidate: consolidate
    };
  }
);
define(
  'ephox.sand.api.JSON',

  [
    'ephox.sand.util.Global'
  ],

  function (Global) {
    /*
     * IE8 and above per
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var json = function () {
      return Global.getOrDie('JSON');
    };

    var parse = function (obj) {
      return json().parse(obj);
    };

    var stringify = function (obj, replacer, space) {
      return json().stringify(obj, replacer, space);
    };

    return {
      parse: parse,
      stringify: stringify
    };
  }
);
define(
  'ephox.boulder.format.PrettyPrinter',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Type',
    'ephox.sand.api.JSON'
  ],

  function (Arr, Obj, Type, Json) {
    var formatObj = function (input) {
      return Type.isObject(input) && Obj.keys(input).length > 100 ? ' removed due to size' : Json.stringify(input, null, 2);

    };

    var formatErrors = function (errors) {
      var es = errors.length > 10 ? errors.slice(0, 10).concat([
        {
          path: [ ],
          getErrorInfo: function () {
            return '... (only showing first ten failures)';
          }
        }
      ]) : errors;

      // TODO: Work out a better split between PrettyPrinter and SchemaError
      return Arr.map(es, function (e) {
        return 'Failed path: ('  + e.path.join(' > ') + ')\n' + e.getErrorInfo();
      });
    };

    return {
      formatObj: formatObj,
      formatErrors: formatErrors
    };
  }
);
define(
  'ephox.boulder.core.SchemaError',

  [
    'ephox.boulder.format.PrettyPrinter',
    'ephox.katamari.api.Result'
  ],

  function (PrettyPrinter, Result) {
    var nu = function (path, getErrorInfo) {
      return Result.error([{
        path: path,
        // This is lazy so that it isn't calculated unnecessarily
        getErrorInfo: getErrorInfo
      }]);
    };

    var missingStrict = function (path, key, obj) {
      return nu(path, function () {
        return 'Could not find valid *strict* value for "' + key + '" in ' + PrettyPrinter.formatObj(obj);
      });
    };

    var missingKey = function (path, key) {
      return nu(path, function () {
        return 'Choice schema did not contain choice key: "' + key + '"';
      });
    };

    var missingBranch = function (path, branches, branch) {
      return nu(path, function () {
        return 'The chosen schema: "' + branch + '" did not exist in branches: ' + PrettyPrinter.formatObj(branches);
      });
    };

    var unsupportedFields = function (path, unsupported) {
      return nu(path, function () {
        return 'There are unsupported fields: [' + unsupported.join(', ') + '] specified';
      });
    };

    var custom = function (path, err) {
      return nu(path, function () { return err; });
    };

    var toString = function (error) {
      return 'Failed path: ('  + error.path.join(' > ') + ')\n' + error.getErrorInfo();
    };

    return {
      missingStrict: missingStrict,
      missingKey: missingKey,
      missingBranch: missingBranch,
      unsupportedFields: unsupportedFields,
      custom: custom,
      toString: toString
    };
  }
);
define(
  'ephox.boulder.format.TypeTokens',

  [
    'ephox.katamari.api.Adt'
  ],
  
  function (Adt) {
    var typeAdt = Adt.generate([
      { setOf: [ 'validator', 'valueType' ] },
      { arrOf: [ 'valueType' ] },
      { objOf: [ 'fields' ] },
      { itemOf: [ 'validator' ] },
      { choiceOf: [ 'key', 'branches' ] }

    ]);

    var fieldAdt = Adt.generate([
      { field: [ 'name', 'presence', 'type' ] },
      { state: [ 'name' ] }
    ]);

    return {
      typeAdt: typeAdt,
      fieldAdt: fieldAdt
    };
  }
);
define(
  'ephox.boulder.core.ValueProcessor',

  [
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.Objects',
    'ephox.boulder.combine.ResultCombine',
    'ephox.boulder.core.ObjReader',
    'ephox.boulder.core.ObjWriter',
    'ephox.boulder.core.SchemaError',
    'ephox.boulder.format.TypeTokens',
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Result',
    'ephox.katamari.api.Type'
  ],

  function (FieldPresence, Objects, ResultCombine, ObjReader, ObjWriter, SchemaError, TypeTokens, Adt, Arr, Fun, Merger, Obj, Option, Result, Type) {
    var adt = Adt.generate([
      { field: [ 'key', 'okey', 'presence', 'prop' ] },
      { state: [ 'okey', 'instantiator' ] }
    ]);

    var output = function (okey, value) {
      return adt.state(okey, Fun.constant(value));
    };

    var snapshot = function (okey) {
      return adt.state(okey, Fun.identity);
    };

  
    var strictAccess = function (path, obj, key) {
      // In strict mode, if it undefined, it is an error.
      return ObjReader.readOptFrom(obj, key).fold(function () {
        return SchemaError.missingStrict(path, key, obj);
      }, Result.value);
    };

    var fallbackAccess = function (obj, key, fallbackThunk) {
      var v = ObjReader.readOptFrom(obj, key).fold(function () {
        return fallbackThunk(obj);
      }, Fun.identity);
      return Result.value(v);
    };

    var optionAccess = function (obj, key) {
      return Result.value(ObjReader.readOptFrom(obj, key));
    };

    var optionDefaultedAccess = function (obj, key, fallback) {
      var opt = ObjReader.readOptFrom(obj, key).map(function (val) {
        return val === true ? fallback(obj) : val;
      });
      return Result.value(opt);
    };

    var cExtractOne = function (path, obj, field, strength) {
      return field.fold(
        function (key, okey, presence, prop) {
          var bundle = function (av) {
            return prop.extract(path.concat([ key ]), strength, av).map(function (res) {
              return ObjWriter.wrap(okey, strength(res));
            });
          };

          var bundleAsOption = function (optValue) {
            return optValue.fold(function () {
              var outcome = ObjWriter.wrap(okey, strength(Option.none()));
              return Result.value(outcome);
            }, function (ov) {
              return prop.extract(path.concat([ key ]), strength, ov).map(function (res) {
                return ObjWriter.wrap(okey, strength(Option.some(res)));
              });
            });
          };

          return (function () {
            return presence.fold(function () {
              return strictAccess(path, obj, key).bind(bundle);
            }, function (fallbackThunk) {
              return fallbackAccess(obj, key, fallbackThunk).bind(bundle);
            }, function () {
              return optionAccess(obj, key).bind(bundleAsOption);
            }, function (fallbackThunk) {
              // Defaulted option access
              return optionDefaultedAccess(obj, key, fallbackThunk).bind(bundleAsOption);
            }, function (baseThunk) {
              var base = baseThunk(obj);
              return fallbackAccess(obj, key, Fun.constant({})).map(function (v) {
                return Merger.deepMerge(base, v);
              }).bind(bundle);
            });
          })();
        },
        function (okey, instantiator) {
          var state = instantiator(obj);
          return Result.value(ObjWriter.wrap(okey, strength(state)));
        }
      );
    };

    var cExtract = function (path, obj, fields, strength) {
      var results = Arr.map(fields, function (field) {
        return cExtractOne(path, obj, field, strength);
      });

      return ResultCombine.consolidateObj(results, {});
    };

    var value = function (validator) {
      var extract = function (path, strength, val) {
        return validator(val).fold(function (err) {
          return SchemaError.custom(path, err);
        }, Result.value); // ignore strength
      };

      var toString = function () {
        return 'val';
      };

      var toDsl = function () {
        return TypeTokens.typeAdt.itemOf(validator);
      };

      return {
        extract: extract,
        toString: toString,
        toDsl: toDsl
      };      
    };

    // This is because Obj.keys can return things where the key is set to undefined.
    var getSetKeys = function (obj) {
      var keys = Obj.keys(obj);
      return Arr.filter(keys, function (k) {
        return Objects.hasKey(obj, k);
      });
    };

    var objOnly = function (fields) {
      var delegate = obj(fields);

      var fieldNames = Arr.foldr(fields, function (acc, f) {
        return f.fold(function (key) {
          return Merger.deepMerge(acc, Objects.wrap(key, true));
        }, Fun.constant(acc));
      }, { });

      var extract = function (path, strength, o) {
        var keys = Type.isBoolean(o) ? [ ] : getSetKeys(o);
        var extra = Arr.filter(keys, function (k) {
          return !Objects.hasKey(fieldNames, k);
        });

        return extra.length === 0  ? delegate.extract(path, strength, o) : 
          SchemaError.unsupportedFields(path, extra);
      };

      return {
        extract: extract,
        toString: delegate.toString,
        toDsl: delegate.toDsl
      };
    };

    var obj = function (fields) {
      var extract = function (path, strength, o) {
        return cExtract(path, o, fields, strength);
      };

      var toString = function () {
        var fieldStrings = Arr.map(fields, function (field) {
          return field.fold(function (key, okey, presence, prop) {
            return key + ' -> ' + prop.toString();
          }, function (okey, instantiator) {
            return 'state(' + okey + ')';
          });
        });
        return 'obj{\n' + fieldStrings.join('\n') + '}'; 
      };

      var toDsl = function () {
        return TypeTokens.typeAdt.objOf(
          Arr.map(fields, function (f) {
            return f.fold(function (key, okey, presence, prop) {
              return TypeTokens.fieldAdt.field(key, presence, prop);
            }, function (okey, instantiator) {
              return TypeTokens.fieldAdt.state(okey);
            });
          })
        );
      };

      return {
        extract: extract,
        toString: toString,
        toDsl: toDsl
      };
    };

    var arr = function (prop) {
      var extract = function (path, strength, array) {
        var results = Arr.map(array, function (a, i) {
          return prop.extract(path.concat(['[' + i + ']' ]), strength, a);
        });
        return ResultCombine.consolidateArr(results);
      };

      var toString = function () {
        return 'array(' + prop.toString() + ')';
      };

      var toDsl = function () {
        return TypeTokens.typeAdt.arrOf(prop);
      };

      return {
        extract: extract,
        toString: toString,
        toDsl: toDsl
      };
    };

    var setOf = function (validator, prop) {
      var validateKeys = function (path, keys) {
        return arr(value(validator)).extract(path, Fun.identity, keys);
      };
      var extract = function (path, strength, o) {
        // 
        var keys = Obj.keys(o);
        return validateKeys(path, keys).bind(function (validKeys) {
          var schema = Arr.map(validKeys, function (vk) {
            return adt.field(vk, vk, FieldPresence.strict(), prop);
          });

          return obj(schema).extract(path, strength, o);
        });
      };

      var toString = function () {
        return 'setOf(' + prop.toString() + ')';
      };

      var toDsl = function () {
        return TypeTokens.typeAdt.setOf(validator, prop);
      }

      return {
        extract: extract,
        toString: toString,
        toDsl: toDsl
      };
    };

    var anyValue = value(Result.value);

    var arrOfObj = Fun.compose(arr, obj);

    return {
      anyValue: Fun.constant(anyValue),

      value: value,
      obj: obj,
      objOnly: objOnly,
      arr: arr,
      setOf: setOf,

      arrOfObj: arrOfObj,

      state: adt.state,

      field: adt.field,
      
      output: output,
      snapshot: snapshot
    };
  }
);


define(
  'ephox.boulder.api.FieldSchema',

  [
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.core.ValueProcessor',
    'ephox.katamari.api.Result',
    'ephox.katamari.api.Type'
  ],

  function (FieldPresence, ValueProcessor, Result, Type) {
    var strict = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.anyValue());
    };

    var strictOf = function (key, schema) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), schema);
    };

    var strictFunction = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.value(function (f) {
        return Type.isFunction(f) ? Result.value(f) : Result.error('Not a function');
      }));
    };

    var forbid = function (key, message) {
      return ValueProcessor.field(
        key,
        key,
        FieldPresence.asOption(),
        ValueProcessor.value(function (v) {
          return Result.error('The field: ' + key + ' is forbidden. ' + message);
        })
      );
    };

    // TODO: Deprecate
    var strictArrayOf = function (key, prop) {
      return strictOf(key, prop);
    };


    var strictObjOf = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.obj(objSchema));
    };

    var strictArrayOfObj = function (key, objFields) {
      return ValueProcessor.field(
        key,
        key,
        FieldPresence.strict(),
        ValueProcessor.arrOfObj(objFields)
      );
    };

    var option = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.anyValue());
    };

    var optionOf = function (key, schema) {
       return ValueProcessor.field(key, key, FieldPresence.asOption(), schema);
    };

    var optionObjOf = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.obj(objSchema));
    };

    var optionObjOfOnly = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.objOnly(objSchema));
    };

    var defaulted = function (key, fallback) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), ValueProcessor.anyValue());
    };

    var defaultedOf = function (key, fallback, schema) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), schema);
    };

    var defaultedObjOf = function (key, fallback, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), ValueProcessor.obj(objSchema));
    };

    var field = function (key, okey, presence, prop) {
      return ValueProcessor.field(key, okey, presence, prop);
    };

    var state = function (okey, instantiator) {
      return ValueProcessor.state(okey, instantiator);
    };

    return {
      strict: strict,
      strictOf: strictOf,
      strictObjOf: strictObjOf,
      strictArrayOf: strictArrayOf,
      strictArrayOfObj: strictArrayOfObj,
      strictFunction: strictFunction,

      forbid: forbid,

      option: option,
      optionOf: optionOf,
      optionObjOf: optionObjOf,
      optionObjOfOnly: optionObjOfOnly,

      defaulted: defaulted,
      defaultedOf: defaultedOf,
      defaultedObjOf: defaultedObjOf,

      field: field,
      state: state
    };
  }
);
define(
  'ephox.boulder.core.ChoiceProcessor',

  [
    'ephox.boulder.api.Objects',
    'ephox.boulder.core.SchemaError',
    'ephox.boulder.core.ValueProcessor',
    'ephox.boulder.format.TypeTokens',
    'ephox.katamari.api.Obj'
  ],

  function (Objects, SchemaError, ValueProcessor, TypeTokens, Obj) {
    var chooseFrom = function (path, strength, input, branches, ch) {
      var fields = Objects.readOptFrom(branches, ch);
      return fields.fold(function () {
        return SchemaError.missingBranch(path, branches, ch);
      }, function (fs) {
        return ValueProcessor.obj(fs).extract(path.concat([ 'branch: ' + ch ]), strength, input);  
      });         
    };

    // The purpose of choose is to have a key which picks which of the schemas to follow.
    // The key will index into the object of schemas: branches
    var choose = function (key, branches) {
      var extract = function (path, strength, input) {
        var choice = Objects.readOptFrom(input, key);
        return choice.fold(function () {
          return SchemaError.missingKey(path, key);
        }, function (chosen) {
          return chooseFrom(path, strength, input, branches, chosen);
        });
      };

      var toString = function () {
        return 'chooseOn(' + key + '). Possible values: ' + Obj.keys(branches);
      };

      var toDsl = function () {
        return TypeTokens.typeAdt.choiceOf(key, branches);
      };

      return {
        extract: extract,
        toString: toString,
        toDsl: toDsl
      };
    };

    return {
      choose: choose
    };
  }
);
define(
  'ephox.boulder.api.ValueSchema',

  [
    'ephox.boulder.core.ChoiceProcessor',
    'ephox.boulder.core.ValueProcessor',
    'ephox.boulder.format.PrettyPrinter',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Result',
    'global!Error'
  ],

  function (ChoiceProcessor, ValueProcessor, PrettyPrinter, Fun, Result, Error) {
    var anyValue = ValueProcessor.value(Result.value);

    var arrOfObj = function (objFields) {
      return ValueProcessor.arrOfObj(objFields);
    };

    var arrOfVal = function () {
      return ValueProcessor.arr(anyValue);
    };

    var arrOf = ValueProcessor.arr;

    var objOf = ValueProcessor.obj;

    var objOfOnly = ValueProcessor.objOnly;

    var setOf = ValueProcessor.setOf;

    var valueOf = function (validator) {
      return ValueProcessor.value(validator);
    };

    var extract = function (label, prop, strength, obj) {
      return prop.extract([ label ], strength, obj).fold(function (errs) {
        return Result.error({
          input: obj,
          errors: errs
        });
      }, Result.value);
    };

    var asStruct = function (label, prop, obj) {
      return extract(label, prop, Fun.constant, obj);
    };

    var asRaw = function (label, prop, obj) {
      return extract(label, prop, Fun.identity, obj);
    };

    var getOrDie = function (extraction) {
      return extraction.fold(function (errInfo) {
        // A readable version of the error.
        throw new Error(
          formatError(errInfo)
        );
      }, Fun.identity);
    };

    var asRawOrDie = function (label, prop, obj) {
      return getOrDie(asRaw(label, prop, obj));
    };

    var asStructOrDie = function (label, prop, obj) {
      return getOrDie(asStruct(label, prop, obj));
    };

    var formatError = function (errInfo) {
      return 'Errors: \n' + PrettyPrinter.formatErrors(errInfo.errors) + 
        '\n\nInput object: ' + PrettyPrinter.formatObj(errInfo.input);
    };

    var choose = function (key, branches) {
      return ChoiceProcessor.choose(key, branches);
    };

    return {
      anyValue: Fun.constant(anyValue),

      arrOfObj: arrOfObj,
      arrOf: arrOf,
      arrOfVal: arrOfVal,

      valueOf: valueOf,
      setOf: setOf,

      objOf: objOf,
      objOfOnly: objOfOnly,

      asStruct: asStruct,
      asRaw: asRaw,

      asStructOrDie: asStructOrDie,
      asRawOrDie: asRawOrDie,

      getOrDie: getOrDie,
      formatError: formatError,

      choose: choose
    };
  }
);
define(
  'ephox.alloy.construct.EventHandler',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Type',
    'ephox.katamari.api.Arr',
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Fun',
    'global!Array',
    'global!Error'
  ],

  function (FieldSchema, Objects, ValueSchema, Type, Arr, Json, Fun, Array, Error) {
    var nu = function (parts) {
      if (! Objects.hasKey(parts, 'can') && !Objects.hasKey(parts, 'abort') && !Objects.hasKey(parts, 'run')) throw new Error(
        'EventHandler defined by: ' + Json.stringify(parts, null, 2) + ' does not have can, abort, or run!'
      );
      return ValueSchema.asRawOrDie('Extracting event.handler', ValueSchema.objOfOnly([
        FieldSchema.defaulted('can', Fun.constant(true)),
        FieldSchema.defaulted('abort', Fun.constant(false)),
        FieldSchema.defaulted('run', Fun.noop)
      ]), parts);
    };

    var all = function (handlers, f) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return Arr.foldl(handlers, function (acc, handler) {
          return acc && f(handler).apply(undefined, args);
        }, true);
      };
    };

    var any = function (handlers, f) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        return Arr.foldl(handlers, function (acc, handler) {
          return acc || f(handler).apply(undefined, args);
        }, false);
      };
    };

    var read = function (handler) {
      return Type.isFunction(handler) ? {
        can: Fun.constant(true),
        abort: Fun.constant(false),
        run: handler
      } : handler;
    };

    var fuse = function (handlers) {
      var can = all(handlers, function (handler) {
        return handler.can;
      });

      var abort = any(handlers, function (handler) {
        return handler.abort;
      });

      var run = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        Arr.each(handlers, function (handler) {
          // ASSUMPTION: Return value is unimportant.
          handler.run.apply(undefined, args);
        });
      };

      return nu({
        can: can,
        abort: abort,
        run: run
      });
    };

    return {
      read: read,
      fuse: fuse,
      nu: nu
    };
  }
);
define(
  'ephox.alloy.api.events.AlloyEvents',

  [
    'ephox.alloy.alien.EventRoot',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.construct.EventHandler',
    'ephox.boulder.api.Objects'
  ],

  function (EventRoot, AlloyTriggers, SystemEvents, EventHandler, Objects) {
    var derive = Objects.wrapAll;

    var abort = function (name, predicate) {
      return {
        key: name,
        value: EventHandler.nu({
          abort: predicate
        })
      };
    };

    var can = function (name, predicate) {
      return {
        key: name,
        value: EventHandler.nu({
          can: predicate
        })
      };
    };

    var preventDefault = function (name) {
      return {
        key: name,
        value: EventHandler.nu({
          run: function (component, simulatedEvent) {
            simulatedEvent.event().prevent();
          }
        })
      };
    };

    var run = function (name, handler) {
      return {
        key: name,
        value: EventHandler.nu({
          run: handler
        })
      };
    };

    var runActionExtra = function (name, action, extra) {
      return {
        key: name,
        value: EventHandler.nu({
          run: function (component) {
            action.apply(undefined, [ component ].concat(extra));
          }
        })
      };
    };

    var runOnName = function (name) {
      return function (handler) {
        return run(name, handler);
      };
    };

    var runOnSourceName = function (name) {
      return function (handler) {
        return {
          key: name,
          value: EventHandler.nu({
            run: function (component, simulatedEvent) {
              if (EventRoot.isSource(component, simulatedEvent)) handler(component, simulatedEvent);
            }
          })
        };
      };
    };

    var redirectToUid = function (name, uid) {
      return run(name, function (component, simulatedEvent) {
        component.getSystem().getByUid(uid).each(function (redirectee) {
          AlloyTriggers.dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent);
        });
      });
    };

    var redirectToPart = function (name, detail, partName) {
      var uid = detail.partUids()[partName];
      return redirectToUid(name, uid);
    };

    var runWithTarget = function (name, f) {
      return run(name, function (component, simulatedEvent) {
        component.getSystem().getByDom(simulatedEvent.event().target()).each(function (target) {
          f(component, target, simulatedEvent);
        });
      });
    };

    var cutter = function (name) {
      return run(name, function (component, simulatedEvent) {
        simulatedEvent.cut();
      });
    };

    var stopper = function (name) {
      return run(name, function (component, simulatedEvent) {
        simulatedEvent.stop();
      });
    };

    return {
      derive: derive,
      run: run,
      preventDefault: preventDefault,
      runActionExtra: runActionExtra,
      runOnAttached: runOnSourceName(SystemEvents.attachedToDom()),
      runOnDetached: runOnSourceName(SystemEvents.detachedFromDom()),
      runOnInit: runOnSourceName(SystemEvents.systemInit()),
      runOnExecute: runOnName(SystemEvents.execute()),

      redirectToUid: redirectToUid,
      redirectToPart: redirectToPart,
      runWithTarget: runWithTarget,
      abort: abort,
      can: can,
      cutter: cutter,
      stopper: stopper
    };
  }
);

define(
  'ephox.alloy.debugging.FunctionAnnotator',

  [
    'ephox.katamari.api.Option'
  ],

  function (Option) {
    var markAsBehaviourApi = function (f, apiName, apiFunction) {
      return f;
    };

    var markAsExtraApi = function (f, extraName) {
      return f;
    };

    var markAsSketchApi = function (f, apiFunction) {
      return f;
    };

    var getAnnotation = Option.none;

    return {
      markAsBehaviourApi: markAsBehaviourApi,
      markAsExtraApi: markAsExtraApi,
      markAsSketchApi: markAsSketchApi,
      getAnnotation: getAnnotation
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
      return function(/* values */) {
        //  Don't use array slice(arguments), makes the whole function unoptimisable on Chrome
        var values = new Array(arguments.length);
        for (var i = 0; i < values.length; i++) values[i] = arguments[i];

        if (fields.length !== values.length)
          throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');

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
        return i < sorted.length -1 && s === sorted[i + 1];
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

        if (! allReqd) BagUtils.reqMessage(required, keys);

        var unsupported = Arr.filter(keys, function (key) {
          return !Arr.contains(everything, key);
        });

        if (unsupported.length > 0) BagUtils.unsuppMessage(unsupported);

        var r = {};
        Arr.each(required, function (req) {
          r[req] = Fun.constant(obj[req]);
        });

        Arr.each(optional, function (opt) {
          r[opt] = Fun.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? Option.some(obj[opt]): Option.none());
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
  'ephox.alloy.dom.DomDefinition',

  [
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Struct',
    'global!String'
  ],

  function (Json, Struct, String) {
    var nu = Struct.immutableBag([ 'tag' ], [
      'classes',
      'attributes',
      'styles',
      'value',
      'innerHtml',
      'domChildren',
      'defChildren'
    ]);

    var defToStr = function (defn) {
      var raw = defToRaw(defn);
      return Json.stringify(raw, null, 2);
    };

    var defToRaw = function (defn) {
      return {
        tag: defn.tag(),
        classes: defn.classes().getOr([ ]),
        attributes: defn.attributes().getOr({ }),
        styles: defn.styles().getOr({ }),
        value: defn.value().getOr('<none>'),
        innerHtml: defn.innerHtml().getOr('<none>'),
        defChildren: defn.defChildren().getOr('<none>'),
        domChildren: defn.domChildren().fold(function () {
          return '<none>';
        }, function (children) {
          return children.length === 0 ? '0 children, but still specified' : String(children.length);
        })
      };
    };

    return {
      nu: nu,
      defToStr: defToStr,
      defToRaw: defToRaw
    };
  }
);
define(
  'ephox.alloy.dom.DomModification',

  [
    'ephox.alloy.dom.DomDefinition',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Merger',
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Struct'
  ],

  function (DomDefinition, Objects, Arr, Obj, Merger, Json, Struct) {
    var fields = [
      'classes',
      'attributes',
      'styles',
      'value',
      'innerHtml',
      'defChildren',
      'domChildren'
    ];
    // Maybe we'll need to allow add/remove
    var nu = Struct.immutableBag([ ], fields);


    var derive = function (settings) {
      var r = { };
      var keys = Obj.keys(settings);
      Arr.each(keys, function (key) {
        settings[key].each(function (v) {
          r[key] = v;
        });
      });

      return nu(r);
    };

    var modToStr = function (mod) {
      var raw = modToRaw(mod);
      return Json.stringify(raw, null, 2);
    };

    var modToRaw = function (mod) {
      return {
        classes: mod.classes().getOr('<none>'),
        attributes: mod.attributes().getOr('<none>'),
        styles: mod.styles().getOr('<none>'),
        value: mod.value().getOr('<none>'),
        innerHtml: mod.innerHtml().getOr('<none>'),
        defChildren: mod.defChildren().getOr('<none>'),
        domChildren: mod.domChildren().fold(function () {
          return '<none>';
        }, function (children) {
          return children.length === 0 ? '0 children, but still specified' : String(children.length);
        })
      };
    };

    var clashingOptArrays = function (key, oArr1, oArr2) {
      return oArr1.fold(function () {
        return oArr2.fold(function () {
          return { };
        }, function (arr2) {
          return Objects.wrap(key, arr2);
        });
      }, function (arr1) {
        return oArr2.fold(function () {
          return Objects.wrap(key, arr1);
        }, function (arr2) {
          return Objects.wrap(key, arr2);
        });
      });
    };

    var merge = function (defnA, mod) {
      var raw = Merger.deepMerge(
        {
          tag: defnA.tag(),
          classes: mod.classes().getOr([ ]).concat(defnA.classes().getOr([ ])),
          attributes: Merger.merge(
            defnA.attributes().getOr({}),
            mod.attributes().getOr({})
          ),
          styles: Merger.merge(
            defnA.styles().getOr({}),
            mod.styles().getOr({})
          )
        },
        mod.innerHtml().or(defnA.innerHtml()).map(function (innerHtml) {
          return Objects.wrap('innerHtml', innerHtml);
        }).getOr({ }),

        clashingOptArrays('domChildren', mod.domChildren(), defnA.domChildren()),
        clashingOptArrays('defChildren', mod.defChildren(), defnA.defChildren()),

        mod.value().or(defnA.value()).map(function (value) {
          return Objects.wrap('value', value);
        }).getOr({ })
      );

      return DomDefinition.nu(raw);
    };

    return {
      nu: nu,
      derive: derive,

      merge: merge,
      // combine: combine,
      modToStr: modToStr,
      modToRaw: modToRaw
    };
  }
);
define(
  'ephox.alloy.behaviour.common.Behaviour',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.debugging.FunctionAnnotator',
    'ephox.alloy.dom.DomModification',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Thunk',
    'global!Array',
    'global!console',
    'global!Error'
  ],

  function (AlloyEvents, FunctionAnnotator, DomModification, FieldSchema, Objects, ValueSchema, Fun, Merger, Obj, Option, Thunk, Array, console, Error) {
    var executeEvent = function (bConfig, bState, executor) {
      return AlloyEvents.runOnExecute(function (component) {
        executor(component, bConfig, bState);
      });
    };

    var loadEvent = function (bConfig, bState, f) {
      return AlloyEvents.runOnInit(function (component, simulatedEvent) {
        f(component, bConfig, bState);
      });
    };

    var create = function (schema, name, active, apis, extra, state) {
      var configSchema = ValueSchema.objOfOnly(schema);
      var schemaSchema = FieldSchema.optionObjOf(name, [
        FieldSchema.optionObjOfOnly('config', schema)
      ]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };

    var createModes = function (modes, name, active, apis, extra, state) {
      var configSchema = modes;
      var schemaSchema = FieldSchema.optionObjOf(name, [
        FieldSchema.optionOf('config', modes)
      ]);
      return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
    };

    var wrapApi = function (bName, apiFunction, apiName) {
      var f = function (component) {
        var args = arguments;
        return component.config({
          name: Fun.constant(bName)
        }).fold(
          function () {
            throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
          },
          function (info) {
            var rest = Array.prototype.slice.call(args, 1);
            return apiFunction.apply(undefined, [ component, info.config, info.state ].concat(rest));
          }
        );
      };
      return FunctionAnnotator.markAsBehaviourApi(f, apiName, apiFunction);
    };

    // I think the "revoke" idea is fragile at best.
    var revokeBehaviour = function (name) {
      return {
        key: name,
        value: undefined
      };
    };

    var doCreate = function (configSchema, schemaSchema, name, active, apis, extra, state) {
      var getConfig = function (info) {
        return Objects.hasKey(info, name) ? info[name]() : Option.none();
      };

      var wrappedApis = Obj.map(apis, function (apiF, apiName) {
        return wrapApi(name, apiF, apiName);
      });

      var wrappedExtra = Obj.map(extra, function (extraF, extraName) {
        return FunctionAnnotator.markAsExtraApi(extraF, extraName);
      });

      var me = Merger.deepMerge(
        wrappedExtra,
        wrappedApis,
        {
          revoke: Fun.curry(revokeBehaviour, name),
          config: function (spec) {
            var prepared = ValueSchema.asStructOrDie(name + '-config', configSchema, spec);

            return {
              key: name,
              value: {
                config: prepared,
                me: me,
                configAsRaw: Thunk.cached(function () {
                  return ValueSchema.asRawOrDie(name + '-config', configSchema, spec);
                }),
                initialConfig: spec,
                state: state
              }
            };
          },

          schema: function () {
            return schemaSchema;
          },

          exhibit: function (info, base) {
            return getConfig(info).bind(function (behaviourInfo) {
              return Objects.readOptFrom(active, 'exhibit').map(function (exhibitor) {
                return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
              });
            }).getOr(DomModification.nu({ }));
          },

          name: function () {
            return name;
          },

          handlers: function (info) {
            return getConfig(info).bind(function (behaviourInfo) {
              return Objects.readOptFrom(active, 'events').map(function (events) {
                return events(behaviourInfo.config, behaviourInfo.state);
              });
            }).getOr({ });
          }
        }
      );

      return me;
    };

    return {
      executeEvent: executeEvent,
      loadEvent: loadEvent,
      create: create,
      createModes: createModes
    };
  }
);
define(
  'ephox.katamari.api.Contracts',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Type',
    'ephox.katamari.util.BagUtils',
    'global!Error'
  ],

  function (Arr, Fun, Obj, Type, BagUtils, Error) {
    // Ensure that the object has all required fields. They must be functions.
    var base = function (handleUnsupported, required) {
      return baseWith(handleUnsupported, required, {
        validate: Type.isFunction,
        label: 'function'
      });
    };

    // Ensure that the object has all required fields. They must satisy predicates.
    var baseWith = function (handleUnsupported, required, pred) {
      if (required.length === 0) throw new Error('You must specify at least one required field.');

      BagUtils.validateStrArr('required', required);

      BagUtils.checkDupes(required);

      return function (obj) {
        var keys = Obj.keys(obj);

        // Ensure all required keys are present.
        var allReqd = Arr.forall(required, function (req) {
          return Arr.contains(keys, req);
        });

        if (! allReqd) BagUtils.reqMessage(required, keys);

        handleUnsupported(required, keys);
        
        var invalidKeys = Arr.filter(required, function (key) {
          return !pred.validate(obj[key], key);
        });

        if (invalidKeys.length > 0) BagUtils.invalidTypeMessage(invalidKeys, pred.label);

        return obj;
      };
    };

    var handleExact = function (required, keys) {
      var unsupported = Arr.filter(keys, function (key) {
        return !Arr.contains(required, key);
      });

      if (unsupported.length > 0) BagUtils.unsuppMessage(unsupported);
    };

    var allowExtra = Fun.noop;

    return {
      exactly: Fun.curry(base, handleExact),
      ensure: Fun.curry(base, allowExtra),
      ensureWith: Fun.curry(baseWith, allowExtra)
    };
  }
);
define(
  'ephox.alloy.behaviour.common.BehaviourState',

  [
    'ephox.katamari.api.Contracts'
  ],

  function (Contracts) {
    return Contracts.ensure([
      'readState'
    ]);
  }
);

defineGlobal("global!Math", Math);
define(
  'ephox.alloy.behaviour.common.NoState',

  [
    'ephox.alloy.behaviour.common.BehaviourState',
    'global!Math'
  ],

  function (BehaviourState, Math) {
    var init = function () {
      return BehaviourState({
        readState: function () {
          return 'No State required';
        }
      });
    };

    return {
      init: init
    };
  }
);

define(
  'ephox.alloy.api.behaviour.Behaviour',

  [
    'ephox.alloy.behaviour.common.Behaviour',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun'
  ],

  function (Behaviour, NoState, FieldSchema, Objects, ValueSchema, Fun) {
    var derive = function (capabilities) {
      return Objects.wrapAll(capabilities);
    };

    var simpleSchema = ValueSchema.objOfOnly([
      FieldSchema.strict('fields'),
      FieldSchema.strict('name'),
      FieldSchema.defaulted('active', { }),
      FieldSchema.defaulted('apis', { }),
      FieldSchema.defaulted('extra', { }),
      FieldSchema.defaulted('state', NoState)
    ]);

    var create = function (data) {
      var value = ValueSchema.asRawOrDie('Creating behaviour: ' + data.name, simpleSchema, data);
      return Behaviour.create(value.fields, value.name, value.active, value.apis, value.extra, value.state);
    };

    var modeSchema = ValueSchema.objOfOnly([
      FieldSchema.strict('branchKey'),
      FieldSchema.strict('branches'),
      FieldSchema.strict('name'),
      FieldSchema.defaulted('active', { }),
      FieldSchema.defaulted('apis', { }),
      FieldSchema.defaulted('extra', { }),
      FieldSchema.defaulted('state', NoState)
    ]);

    var createModes = function (data) {
      var value = ValueSchema.asRawOrDie('Creating behaviour: ' + data.name, modeSchema, data);
      return Behaviour.createModes(
        ValueSchema.choose(value.branchKey, value.branches),
        value.name, value.active, value.apis, value.extra, value.state
      );
    };

    return {
      derive: derive,
      revoke: Fun.constant(undefined),
      noActive: Fun.constant({ }),
      noApis: Fun.constant({ }),
      noExtra: Fun.constant({ }),
      noState: Fun.constant(NoState),
      create: create,
      createModes: createModes
    };
  }
);
define(
  'ephox.sugar.api.properties.Toggler',

  [
  ],

  function () {
    return function (turnOff, turnOn, initial) {
      var active = initial || false;

      var on = function () {
        turnOn();
        active = true;
      };

      var off = function () {
        turnOff();
        active = false;
      };

      var toggle = function () {
        var f = active ? off : on;
        f();
      };

      var isOn = function () {
        return active;
      };

      return {
        on: on,
        off: off,
        toggle: toggle,
        isOn: isOn
      };
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
  'ephox.sugar.api.properties.Attr',

  [
    'ephox.katamari.api.Type',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.sugar.api.node.Node',
    'global!Error',
    'global!console'
  ],

  /*
   * Direct attribute manipulation has been around since IE8, but
   * was apparently unstable until IE10.
   */
  function (Type, Arr, Obj, Node, Error, console) {
    var rawSet = function (dom, key, value) {
      /*
       * JQuery coerced everything to a string, and silently did nothing on text node/null/undefined.
       *
       * We fail on those invalid cases, only allowing numbers and booleans.
       */
      if (Type.isString(value) || Type.isBoolean(value) || Type.isNumber(value)) {
        dom.setAttribute(key, value + '');
      } else {
        console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
        throw new Error('Attribute value was not simple');
      }
    };

    var set = function (element, key, value) {
      rawSet(element.dom(), key, value);
    };

    var setAll = function (element, attrs) {
      var dom = element.dom();
      Obj.each(attrs, function (v, k) {
        rawSet(dom, k, v);
      });
    };

    var get = function (element, key) {
      var v = element.dom().getAttribute(key);

      // undefined is the more appropriate value for JS, and this matches JQuery
      return v === null ? undefined : v;
    };

    var has = function (element, key) {
      var dom = element.dom();

      // return false for non-element nodes, no point in throwing an error
      return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
    };

    var remove = function (element, key) {
      element.dom().removeAttribute(key);
    };

    var hasNone = function (element) {
      var attrs = element.dom().attributes;
      return attrs === undefined || attrs === null || attrs.length === 0;
    };

    var clone = function (element) {
      return Arr.foldl(element.dom().attributes, function (acc, attr) {
        acc[attr.name] = attr.value;
        return acc;
      }, {});
    };

    var transferOne = function (source, destination, attr) {
      // NOTE: We don't want to clobber any existing attributes
      if (has(source, attr) && !has(destination, attr)) set(destination, attr, get(source, attr));        
    };

    // Transfer attributes(attrs) from source to destination, unless they are already present
    var transfer = function (source, destination, attrs) {
      if (!Node.isElement(source) || !Node.isElement(destination)) return;
      Arr.each(attrs, function (attr) {
        transferOne(source, destination, attr);
      });
    };

    return {
      clone: clone,
      set: set,
      setAll: setAll,
      get: get,
      has: has,
      remove: remove,
      hasNone: hasNone,
      transfer: transfer
    };
  }
);

define(
  'ephox.sugar.api.properties.AttrList',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.Attr'
  ],

  function (Arr, Attr) {
    // Methods for handling attributes that contain a list of values <div foo="alpha beta theta">
    var read = function (element, attr) {
      var value = Attr.get(element, attr);
      return value === undefined || value === '' ? [] : value.split(' ');
    };

    var add = function (element, attr, id) {
      var old = read(element, attr);
      var nu = old.concat([id]);
      Attr.set(element, attr, nu.join(' '));
    };

    var remove = function (element, attr, id) {
      var nu = Arr.filter(read(element, attr), function (v) {
        return v !== id;
      });
      if (nu.length > 0) Attr.set(element, attr, nu.join(' '));
      else Attr.remove(element, attr);
    };

    return {
      read: read,
      add: add,
      remove: remove
    };
  }
);
define(
  'ephox.sugar.impl.ClassList',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.AttrList'
  ],

  function (Arr, AttrList) {

    var supports = function (element) {
      // IE11 Can return undefined for a classList on elements such as math, so we make sure it's not undefined before attempting to use it.
      return element.dom().classList !== undefined;
    };

    var get = function (element) {
      return AttrList.read(element, 'class');
    };

    var add = function (element, clazz) {
      return AttrList.add(element, 'class', clazz);
    };

    var remove = function (element, clazz) {
      return AttrList.remove(element, 'class', clazz);
    };

    var toggle = function (element, clazz) {
      if (Arr.contains(get(element), clazz)) {
        remove(element, clazz);
      } else {
        add(element, clazz);
      }
    };

    return {
      get: get,
      add: add,
      remove: remove,
      toggle: toggle,
      supports: supports
    };
  }
);
define(
  'ephox.sugar.api.properties.Class',

  [
    'ephox.sugar.api.properties.Toggler',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.impl.ClassList'
  ],

  function (Toggler, Attr, ClassList) {
    /*
     * ClassList is IE10 minimum:
     * https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
     *
     * Note that IE doesn't support the second argument to toggle (at all).
     * If it did, the toggler could be better.
     */

    var add = function (element, clazz) {
      if (ClassList.supports(element)) element.dom().classList.add(clazz);
      else ClassList.add(element, clazz);
    };

    var cleanClass = function (element) {
      var classList = ClassList.supports(element) ? element.dom().classList : ClassList.get(element);
      // classList is a "live list", so this is up to date already
      if (classList.length === 0) {
        // No more classes left, remove the class attribute as well
        Attr.remove(element, 'class');
      }
    };

    var remove = function (element, clazz) {
      if (ClassList.supports(element)) {
        var classList = element.dom().classList;
        classList.remove(clazz);
      } else
        ClassList.remove(element, clazz);

      cleanClass(element);
    };

    var toggle = function (element, clazz) {
      return ClassList.supports(element) ? element.dom().classList.toggle(clazz) :
                                           ClassList.toggle(element, clazz);
    };

    var toggler = function (element, clazz) {
      var hasClasslist = ClassList.supports(element);
      var classList = element.dom().classList;
      var off = function () {
        if (hasClasslist) classList.remove(clazz);
        else ClassList.remove(element, clazz);
      };
      var on = function () {
        if (hasClasslist) classList.add(clazz);
        else ClassList.add(element, clazz);
      };
      return Toggler(off, on, has(element, clazz));
    };

    var has = function (element, clazz) {
      // Cereal has a nasty habit of calling this with a text node >.<
      return ClassList.supports(element) && element.dom().classList.contains(clazz);
    };

    // set deleted, risks bad performance. Be deterministic.

    return {
      add: add,
      remove: remove,
      toggle: toggle,
      toggler: toggler,
      has: has
    };
  }
);

define(
  'ephox.alloy.behaviour.swapping.SwapApis',

  [
    'ephox.sugar.api.properties.Class'
  ],

  function (Class) {
    var swap = function (element, addCls, removeCls) {
      Class.remove(element, removeCls);
      Class.add(element, addCls);
    };

    var toAlpha = function (component, swapConfig, swapState) {
      swap(component.element(), swapConfig.alpha(), swapConfig.omega());
    };

    var toOmega = function (component, swapConfig, swapState) {
      swap(component.element(), swapConfig.omega(), swapConfig.alpha());
    };

    var clear = function (component, swapConfig, swapState) {
      Class.remove(component.element(), swapConfig.alpha());
      Class.remove(component.element(), swapConfig.omega());
    };

    var isAlpha = function (component, swapConfig, swapState) {
      return Class.has(component.element(), swapConfig.alpha());
    };

    var isOmega = function (component, swapConfig, swapState) {
      return Class.has(component.element(), swapConfig.omega());
    };

    return {
      toAlpha: toAlpha,
      toOmega: toOmega,
      isAlpha: isAlpha,
      isOmega: isOmega,
      clear: clear
    };
  }
);

define(
  'ephox.alloy.behaviour.swapping.SwapSchema',

  [
    'ephox.boulder.api.FieldSchema'
  ],

  function (FieldSchema) {
    return [
      FieldSchema.strict('alpha'),
      FieldSchema.strict('omega')
    ];
  }
);

define(
  'ephox.alloy.api.behaviour.Swapping',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.swapping.SwapApis',
    'ephox.alloy.behaviour.swapping.SwapSchema'
  ],

  function (Behaviour, SwapApis, SwapSchema) {
    return Behaviour.create({
      fields: SwapSchema,
      name: 'swapping',
      apis: SwapApis
    });
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
  'ephox.sugar.api.dom.Insert',

  [
    'ephox.sugar.api.search.Traverse'
  ],

  function (Traverse) {
    var before = function (marker, element) {
      var parent = Traverse.parent(marker);
      parent.each(function (v) {
        v.dom().insertBefore(element.dom(), marker.dom());
      });
    };

    var after = function (marker, element) {
      var sibling = Traverse.nextSibling(marker);
      sibling.fold(function () {
        var parent = Traverse.parent(marker);
        parent.each(function (v) {
          append(v, element);
        });
      }, function (v) {
        before(v, element);
      });
    };

    var prepend = function (parent, element) {
      var firstChild = Traverse.firstChild(parent);
      firstChild.fold(function () {
        append(parent, element);
      }, function (v) {
        parent.dom().insertBefore(element.dom(), v.dom());
      });
    };

    var append = function (parent, element) {
      parent.dom().appendChild(element.dom());
    };

    var appendAt = function (parent, element, index) {
      Traverse.child(parent, index).fold(function () {
        append(parent, element);
      }, function (v) {
        before(v, element);
      });
    };

    var wrap = function (element, wrapper) {
      before(element, wrapper);
      append(wrapper, element);
    };

    return {
      before: before,
      after: after,
      prepend: prepend,
      append: append,
      appendAt: appendAt,
      wrap: wrap
    };
  }
);

define(
  'ephox.sugar.api.dom.InsertAll',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.dom.Insert'
  ],

  function (Arr, Insert) {
    var before = function (marker, elements) {
      Arr.each(elements, function (x) {
        Insert.before(marker, x);
      });
    };

    var after = function (marker, elements) {
      Arr.each(elements, function (x, i) {
        var e = i === 0 ? marker : elements[i - 1];
        Insert.after(e, x);
      });
    };

    var prepend = function (parent, elements) {
      Arr.each(elements.slice().reverse(), function (x) {
        Insert.prepend(parent, x);
      });
    };

    var append = function (parent, elements) {
      Arr.each(elements, function (x) {
        Insert.append(parent, x);
      });
    };

    return {
      before: before,
      after: after,
      prepend: prepend,
      append: append
    };
  }
);

define(
  'ephox.sugar.api.dom.Remove',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Arr, InsertAll, Traverse) {
    var empty = function (element) {
      // shortcut "empty node" trick. Requires IE 9.
      element.dom().textContent = '';

      // If the contents was a single empty text node, the above doesn't remove it. But, it's still faster in general
      // than removing every child node manually.
      // The following is (probably) safe for performance as 99.9% of the time the trick works and
      // Traverse.children will return an empty array.
      Arr.each(Traverse.children(element), function (rogue) {
        remove(rogue);
      });
    };

    var remove = function (element) {
      var dom = element.dom();
      if (dom.parentNode !== null)
        dom.parentNode.removeChild(dom);
    };

    var unwrap = function (wrapper) {
      var children = Traverse.children(wrapper);
      if (children.length > 0)
        InsertAll.before(wrapper, children);
      remove(wrapper);
    };

    return {
      empty: empty,
      remove: remove,
      unwrap: unwrap
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

    var body = Thunk.cached(function() {
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
  'ephox.alloy.api.system.Attachment',

  [
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.search.Traverse'
  ],

  function (AlloyTriggers, SystemEvents, Arr, Option, Insert, Remove, Body, Traverse) {
    var fireDetaching = function (component) {
      AlloyTriggers.emit(component, SystemEvents.detachedFromDom());
      var children = component.components();
      Arr.each(children, fireDetaching);
    };

    var fireAttaching = function (component) {
      var children = component.components();
      Arr.each(children, fireAttaching);
      AlloyTriggers.emit(component, SystemEvents.attachedToDom());
    };

    var attach = function (parent, child) {
      attachWith(parent, child, Insert.append);
    };

    var attachWith = function (parent, child, insertion) {
      parent.getSystem().addToWorld(child);
      insertion(parent.element(), child.element());
      if (Body.inBody(parent.element())) fireAttaching(child);
      parent.syncComponents();
    };

    var doDetach = function (component) {
      fireDetaching(component);
      Remove.remove(component.element());
      component.getSystem().removeFromWorld(component);
    };

    var detach = function (component) {
      var parent = Traverse.parent(component.element()).bind(function (p) {
        return component.getSystem().getByDom(p).fold(Option.none, Option.some);
      });

      doDetach(component);
      parent.each(function (p) {
        p.syncComponents();
      });
    };

    var detachChildren = function (component) {
      // This will not detach the component, but will detach its children and sync at the end.
      var subs = component.components();
      Arr.each(subs, doDetach);
      // Clear the component also.
      Remove.empty(component.element());
      component.syncComponents();
    };

    var attachSystem = function (element, guiSystem) {
      Insert.append(element, guiSystem.element());
      var children = Traverse.children(guiSystem.element());
      Arr.each(children, function (child) {
        guiSystem.getByDom(child).each(fireAttaching);
      });
    };

    var detachSystem = function (guiSystem) {
      var children = Traverse.children(guiSystem.element());
      Arr.each(children, function (child) {
        guiSystem.getByDom(child).each(fireDetaching);
      });
      Remove.remove(guiSystem.element());
    };

    return {
      attach: attach,
      attachWith: attachWith,
      detach: detach,
      detachChildren: detachChildren,

      attachSystem: attachSystem,
      detachSystem: detachSystem
    };
  }
);

define(
  'ephox.sugar.api.node.Elements',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse',
    'global!document'
  ],

  function (Arr, Element, Traverse, document) {
    var fromHtml = function (html, scope) {
      var doc = scope || document;
      var div = doc.createElement('div');
      div.innerHTML = html;
      return Traverse.children(Element.fromDom(div));
    };

    var fromTags = function (tags, scope) {
      return Arr.map(tags, function (x) {
        return Element.fromTag(x, scope);
      });
    };

    var fromText = function (texts, scope) {
      return Arr.map(texts, function (x) {
        return Element.fromText(x, scope);
      });
    };

    var fromDom = function (nodes) {
      return Arr.map(nodes, Element.fromDom);
    };

    return {
      fromHtml: fromHtml,
      fromTags: fromTags,
      fromText: fromText,
      fromDom: fromDom
    };
  }
);

define(
  'ephox.sugar.api.properties.Html',

  [
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Elements',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Element, Elements, Insert, InsertAll, Remove, Traverse) {
    var get = function (element) {
      return element.dom().innerHTML;
    };

    var set = function (element, content) {
      var owner = Traverse.owner(element);
      var docDom = owner.dom();

      // FireFox has *terrible* performance when using innerHTML = x
      var fragment = Element.fromDom(docDom.createDocumentFragment());
      var contentElements = Elements.fromHtml(content, docDom);
      InsertAll.append(fragment, contentElements);

      Remove.empty(element);
      Insert.append(element, fragment);
    };

    var getOuter = function (element) {
      var container = Element.fromTag('div');
      var clone = Element.fromDom(element.dom().cloneNode(true));
      Insert.append(container, clone);
      return get(container);
    };

    return {
      get: get,
      set: set,
      getOuter: getOuter
    };
  }
);

define(
  'ephox.sugar.api.dom.Replication',

  [
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Attr, Element, Insert, InsertAll, Remove, Traverse) {
    var clone = function (original, deep) {
      return Element.fromDom(original.dom().cloneNode(deep));
    };

    /** Shallow clone - just the tag, no children */
    var shallow = function (original) {
      return clone(original, false);
    };

    /** Deep clone - everything copied including children */
    var deep = function (original) {
      return clone(original, true);
    };

    /** Shallow clone, with a new tag */
    var shallowAs = function (original, tag) {
      var nu = Element.fromTag(tag);

      var attributes = Attr.clone(original);
      Attr.setAll(nu, attributes);

      return nu;
    };

    /** Deep clone, with a new tag */
    var copy = function (original, tag) {
      var nu = shallowAs(original, tag);

      // NOTE
      // previously this used serialisation:
      // nu.dom().innerHTML = original.dom().innerHTML;
      //
      // Clone should be equivalent (and faster), but if TD <-> TH toggle breaks, put it back.

      var cloneChildren = Traverse.children(deep(original));
      InsertAll.append(nu, cloneChildren);

      return nu;
    };

    /** Change the tag name, but keep all children */
    var mutate = function (original, tag) {
      var nu = shallowAs(original, tag);

      Insert.before(original, nu);
      var children = Traverse.children(original);
      InsertAll.append(nu, children);
      Remove.remove(original);
      return nu;
    };

    return {
      shallow: shallow,
      shallowAs: shallowAs,
      deep: deep,
      copy: copy,
      mutate: mutate
    };
  }
);

define(
  'ephox.alloy.alien.Truncate',

  [
    'ephox.sugar.api.properties.Html',
    'ephox.sugar.api.dom.Replication'
  ],

  function (Html, Replication) {
    var getHtml = function (element) {
      var clone = Replication.shallow(element);
      return Html.getOuter(clone);
    };

    return {
      getHtml: getHtml
    };
  }
);
define(
  'ephox.alloy.log.AlloyLogger',

  [
    'ephox.alloy.alien.Truncate'
  ],

  function (Truncate) {
    var element = function (elem) {
      return Truncate.getHtml(elem);
    };

    return {
      element: element
    };
  }
);
define(
  'ephox.katamari.api.Options',

  [
    'ephox.katamari.api.Option'
  ],

  function (Option) {
    /** cat :: [Option a] -> [a] */
    var cat = function (arr) {
      var r = [];
      var push = function (x) {
        r.push(x);
      };
      for (var i = 0; i < arr.length; i++) {
        arr[i].each(push);
      }
      return r;
    };

    /** findMap :: ([a], (a, Int -> Option b)) -> Option b */
    var findMap = function (arr, f) {
      for (var i = 0; i < arr.length; i++) {
        var r = f(arr[i], i);
        if (r.isSome()) {
          return r;
        }
      }
      return Option.none();
    };

    /**
     * if all elements in arr are 'some', their inner values are passed as arguments to f
     * f must have arity arr.length
    */
    var liftN = function(arr, f) {
      var r = [];
      for (var i = 0; i < arr.length; i++) {
        var x = arr[i];
        if (x.isSome()) {
          r.push(x.getOrDie());
        } else {
          return Option.none();
        }
      }
      return Option.some(f.apply(null, r));
    };

    return {
      cat: cat,
      findMap: findMap,
      liftN: liftN
    };
  }
);

define(
  'ephox.alloy.debugging.Debugging',

  [
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.log.AlloyLogger',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Options',
    'global!console',
    'global!Error'
  ],


  function (SystemEvents, AlloyLogger, Objects, Arr, Fun, Obj, Options, console, Error) {
    var unknown = 'unknown';
    var debugging = true;

    var CHROME_INSPECTOR_GLOBAL = '__CHROME_INSPECTOR_CONNECTION_TO_ALLOY__';

    var eventsMonitored = [ ];

    // Ignore these files in the error stack
    var path = [
      'alloy/data/Fields',
      'alloy/debugging/Debugging'
    ];

    var getTrace = function () {
      if (debugging === false) return unknown;
      var err = new Error();
      if (err.stack !== undefined) {
        var lines = err.stack.split('\n');
        return Arr.find(lines, function (line) {
          return line.indexOf('alloy') > 0 && !Arr.exists(path, function (p) { return line.indexOf(p) > -1; });
        }).getOr(unknown);
      } else {
        return unknown;
      }
    };

    var logHandler = function (label, handlerName, trace) {
      // if (debugging) console.log(label + ' [' + handlerName + ']', trace);
    };

    var ignoreEvent = {
      logEventCut: Fun.noop,
      logEventStopped: Fun.noop,
      logNoParent: Fun.noop,
      logEventNoHandlers: Fun.noop,
      logEventResponse: Fun.noop,
      write: Fun.noop
    };

    var monitorEvent = function (eventName, initialTarget, f) {
      var logger = debugging && (eventsMonitored === '*' || Arr.contains(eventsMonitored, eventName)) ? (function () {
        var sequence = [ ];

        return {
          logEventCut: function (name, target, purpose) {
            sequence.push({ outcome: 'cut', target: target, purpose: purpose });
          },
          logEventStopped: function (name, target, purpose) {
            sequence.push({ outcome: 'stopped', target: target, purpose: purpose });
          },
          logNoParent: function (name, target, purpose) {
            sequence.push({ outcome: 'no-parent', target: target, purpose: purpose });
          },
          logEventNoHandlers: function (name, target) {
            sequence.push({ outcome: 'no-handlers-left', target: target });
          },
          logEventResponse: function (name, target, purpose) {
            sequence.push({ outcome: 'response', purpose: purpose, target: target });
          },
          write: function () {
            if (Arr.contains([ 'mousemove', 'mouseover', 'mouseout', SystemEvents.systemInit() ], eventName)) return;
            console.log(eventName, {
              event: eventName,
              target: initialTarget.dom(),
              sequence: Arr.map(sequence, function (s) {
                if (! Arr.contains([ 'cut', 'stopped', 'response' ], s.outcome)) return s.outcome;
                else return '{' + s.purpose + '} ' + s.outcome + ' at (' + AlloyLogger.element(s.target) + ')';
              })
            });
          }
        };
      })() : ignoreEvent;

      var output = f(logger);
      logger.write();
      return output;
    };

    var inspectorInfo = function (comp) {
      var go = function (c) {
        var cSpec = c.spec();

        return {
          '(original.spec)': cSpec,
          '(dom.ref)': c.element().dom(),
          '(element)': AlloyLogger.element(c.element()),
          '(initComponents)': Arr.map(cSpec.components !== undefined ? cSpec.components : [ ], go),
          '(components)': Arr.map(c.components(), go),
          '(bound.events)': Obj.mapToArray(c.events(), function (v, k) {
            return [ k ];
          }).join(', '),
          '(behaviours)': cSpec.behaviours !== undefined ? Obj.map(cSpec.behaviours, function (v, k) {
            return v === undefined ? '--revoked--' : {
              config: v.configAsRaw(),
              'original-config': v.initialConfig,
              state: c.readState(k)
            };
          }) : 'none'
        };
      };

      return go(comp);
    };

    var getOrInitConnection = function () {
      // The format of the global is going to be:
      // lookup(uid) -> Option { name => data }
      // systems: Set AlloyRoots
      if (window[CHROME_INSPECTOR_GLOBAL] !== undefined) return window[CHROME_INSPECTOR_GLOBAL];
      else {
        window[CHROME_INSPECTOR_GLOBAL] = {
          systems: { },
          lookup: function (uid) {
            var systems = window[CHROME_INSPECTOR_GLOBAL].systems;
            var connections = Obj.keys(systems);
            return Options.findMap(connections, function (conn) {
              var connGui = systems[conn];
              return connGui.getByUid(uid).toOption().map(function (comp) {
                return Objects.wrap(AlloyLogger.element(comp.element()), inspectorInfo(comp));
              });
            });
          }
        };
        return window[CHROME_INSPECTOR_GLOBAL];
      }
    };

    var registerInspector = function (name, gui) {
      var connection = getOrInitConnection();
      connection.systems[name] = gui;
    };

    return {
      logHandler: logHandler,
      noLogger: Fun.constant(ignoreEvent),
      getTrace: getTrace,
      monitorEvent: monitorEvent,
      isDebugging: Fun.constant(debugging),
      registerInspector: registerInspector
    };
  }
);

define(
  'ephox.katamari.api.Cell',

  [
  ],

  function () {
    var Cell = function (initial) {
      var value = initial;

      var get = function () {
        return value;
      };

      var set = function (v) {
        value = v;
      };

      var clone = function () {
        return Cell(get());
      };

      return {
        get: get,
        set: set,
        clone: clone
      };
    };

    return Cell;
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
      return is(scope, a) ?
              Option.some(scope) :
              Type.isFunction(isRoot) && isRoot(scope) ?
                  Option.none() :
                  ancestor(scope, a, isRoot);
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
          if (predicate(Element.fromDom(element.childNodes[i])))
            return Option.some(Element.fromDom(element.childNodes[i]));

          var res = descend(element.childNodes[i]);
          if (res.isSome())
            return res;
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
  'ephox.sugar.api.search.PredicateExists',

  [
    'ephox.sugar.api.search.PredicateFind'
  ],

  function (PredicateFind) {
    var any = function (predicate) {
      return PredicateFind.first(predicate).isSome();
    };

    var ancestor = function (scope, predicate, isRoot) {
      return PredicateFind.ancestor(scope, predicate, isRoot).isSome();
    };

    var closest = function (scope, predicate, isRoot) {
      return PredicateFind.closest(scope, predicate, isRoot).isSome();
    };

    var sibling = function (scope, predicate) {
      return PredicateFind.sibling(scope, predicate).isSome();
    };

    var child = function (scope, predicate) {
      return PredicateFind.child(scope, predicate).isSome();
    };

    var descendant = function (scope, predicate) {
      return PredicateFind.descendant(scope, predicate).isSome();
    };

    return {
      any: any,
      ancestor: ancestor,
      closest: closest,
      sibling: sibling,
      child: child,
      descendant: descendant
    };
  }
);

define(
  'ephox.sugar.api.dom.Focus',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.PredicateExists',
    'ephox.sugar.api.search.Traverse',
    'global!document'
  ],

  function (Fun, Option, Compare, Element, PredicateExists, Traverse, document) {
    var focus = function (element) {
      element.dom().focus();
    };

    var blur = function (element) {
      element.dom().blur();
    };

    var hasFocus = function (element) {
      var doc = Traverse.owner(element).dom();
      return element.dom() === doc.activeElement;
    };

    var active = function (_doc) {
      var doc = _doc !== undefined ? _doc.dom() : document;
      return Option.from(doc.activeElement).map(Element.fromDom);
    };

    var focusInside = function (element) {
      // Only call focus if the focus is not already inside it.
      var doc = Traverse.owner(element);
      var inside = active(doc).filter(function (a) {
        return PredicateExists.closest(a, Fun.curry(Compare.eq, element));
      });

      inside.fold(function () {
        focus(element);
      }, Fun.noop);
    };

    /**
     * Return the descendant element that has focus.
     * Use instead of SelectorFind.descendant(container, ':focus')
     *  because the :focus selector relies on keyboard focus.
     */
    var search = function (element) {
      return active(Traverse.owner(element)).filter(function (e) {
        return element.dom().contains(e.dom());
      });
    };

    return {
      hasFocus: hasFocus,
      focus: focus,
      blur: blur,
      active: active,
      search: search,
      focusInside: focusInside
    };
  }
);
defineGlobal("global!tinymce.util.Tools.resolve", tinymce.util.Tools.resolve);
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

define(
  'tinymce.themes.mobile.alien.TinyCodeDupe',

  [
    'global!document'
  ],

  function (document) {
    /// TODO this code is from the tinymce link plugin, deduplicate when we decide how to share it
    var openLink = function (target) {
      var link = document.createElement('a');
      link.target = '_blank';
      link.href = target.href;
      link.rel = 'noreferrer noopener';

      var nuEvt = document.createEvent('MouseEvents');
      nuEvt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

      document.body.appendChild(link);
      link.dispatchEvent(nuEvt);
      document.body.removeChild(link);
    };

    return {
      openLink: openLink
    };
  }
);

define(
  'tinymce.themes.mobile.channels.TinyChannels',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var formatChanged = 'formatChanged';
    var orientationChanged = 'orientationChanged';
    var dropupDismissed = 'dropupDismissed';

    return {
      formatChanged: Fun.constant(formatChanged),
      orientationChanged: Fun.constant(orientationChanged),
      dropupDismissed: Fun.constant(dropupDismissed)
    };
  }
);

define(
  'ephox.alloy.behaviour.receiving.ActiveReceiving',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.log.AlloyLogger',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj'
  ],

  function (AlloyEvents, SystemEvents, AlloyLogger, ValueSchema, Arr, Obj) {
    var chooseChannels = function (channels, message) {
      return message.universal() ? channels : Arr.filter(channels, function (ch) {
        return Arr.contains(message.channels(), ch);
      });
    };

    var events = function (receiveConfig/*, receiveState */) {
      return AlloyEvents.derive([
        AlloyEvents.run(SystemEvents.receive(), function (component, message) {
          var channelMap = receiveConfig.channels();
          var channels = Obj.keys(channelMap);

          var targetChannels = chooseChannels(channels, message);
          Arr.each(targetChannels, function (ch) {
            var channelInfo = channelMap[ch]();
            var channelSchema = channelInfo.schema();
            var data = ValueSchema.asStructOrDie(
              'channel[' + ch + '] data\nReceiver: ' + AlloyLogger.element(component.element()),
              channelSchema, message.data()
            );
            channelInfo.onReceive()(component, data);
          });
        })
      ]);
    };

    return {
      events: events
    };
  }
);
define(
  'ephox.alloy.menu.util.MenuMarkers',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun'
  ],

  function (FieldSchema, ValueSchema, Fun) {
    var menuFields = [
      FieldSchema.strict('menu'),
      FieldSchema.strict('selectedMenu')
    ];

    var itemFields = [
      FieldSchema.strict('item'),
      FieldSchema.strict('selectedItem')
    ];

    var schema = ValueSchema.objOfOnly(
      itemFields.concat(menuFields)
    );

    var itemSchema = ValueSchema.objOfOnly(itemFields);

    return {
      menuFields: Fun.constant(menuFields),
      itemFields: Fun.constant(itemFields),
      schema: Fun.constant(schema),
      itemSchema: Fun.constant(itemSchema)
    };
  }
);
define(
  'ephox.alloy.data.Fields',

  [
    'ephox.alloy.debugging.Debugging',
    'ephox.alloy.menu.util.MenuMarkers',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Result',
    'global!console'
  ],

  function (Debugging, MenuMarkers, FieldPresence, FieldSchema, ValueSchema, Arr, Fun, Option, Result, console) {
    var initSize = FieldSchema.strictObjOf('initSize', [
      FieldSchema.strict('numColumns'),
      FieldSchema.strict('numRows')
    ]);

    var itemMarkers = function () {
      return FieldSchema.strictOf('markers', MenuMarkers.itemSchema());
    };

    var menuMarkers = function () {
      return FieldSchema.strictOf('markers', MenuMarkers.schema());
    };

    var tieredMenuMarkers = function () {
      return FieldSchema.strictObjOf('markers', [
        FieldSchema.strict('backgroundMenu')
      ].concat(MenuMarkers.menuFields()).concat(MenuMarkers.itemFields()));
    };

    var markers = function (required) {
      return FieldSchema.strictObjOf('markers', Arr.map(required, FieldSchema.strict));
    };

    var onPresenceHandler = function (label, fieldName, presence) {
      // We care about where the handler was declared (in terms of which schema)
      var trace = Debugging.getTrace();
      return FieldSchema.field(
        fieldName,
        fieldName,
        presence,
        // Apply some wrapping to their supplied function
        ValueSchema.valueOf(function (f) {
          return Result.value(function () {
            /*
             * This line is just for debugging information
             */
            Debugging.logHandler(label, fieldName, trace);
            return f.apply(undefined, arguments);
          });
        })
      );
    };

    var onHandler = function (fieldName) {
      return onPresenceHandler('onHandler', fieldName, FieldPresence.defaulted(Fun.noop));
    };

    var onKeyboardHandler = function (fieldName) {
      return onPresenceHandler('onKeyboardHandler', fieldName, FieldPresence.defaulted(Option.none));
    };

    var onStrictHandler = function (fieldName) {
      return onPresenceHandler('onHandler', fieldName, FieldPresence.strict());
    };

    var onStrictKeyboardHandler = function (fieldName) {
      return onPresenceHandler('onKeyboardHandler', fieldName, FieldPresence.strict());
    };

    var output = function (name, value) {
      return FieldSchema.state(name, Fun.constant(value));
    };

    var snapshot = function (name) {
      return FieldSchema.state(name, Fun.identity);
    };

    return {
      initSize: Fun.constant(initSize),
      itemMarkers: itemMarkers,
      menuMarkers: menuMarkers,
      tieredMenuMarkers: tieredMenuMarkers,
      markers: markers,

      onHandler: onHandler,
      onKeyboardHandler: onKeyboardHandler,
      onStrictHandler: onStrictHandler,
      onStrictKeyboardHandler: onStrictKeyboardHandler,

      output: output,
      snapshot: snapshot
    };
  }
);
define(
  'ephox.alloy.behaviour.receiving.ReceivingSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Result'
  ],

  function (Fields, FieldSchema, ValueSchema, Result) {
    return [
      FieldSchema.strictOf('channels', ValueSchema.setOf(
        // Allow any keys.
        Result.value,
        ValueSchema.objOfOnly([
          Fields.onStrictHandler('onReceive'),
          FieldSchema.defaulted('schema', ValueSchema.anyValue())
        ])
      ))
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Receiving',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.receiving.ActiveReceiving',
    'ephox.alloy.behaviour.receiving.ReceivingSchema'
  ],

  function (Behaviour, ActiveReceiving, ReceivingSchema) {
    return Behaviour.create({
      fields: ReceivingSchema,
      name: 'receiving',
      active: ActiveReceiving
    });
  }
);
define(
  'ephox.alloy.behaviour.toggling.ToggleApis',

  [
    'ephox.sugar.api.properties.Class'
  ],

  function (Class) {
    var updateAriaState = function (component, toggleConfig, toggleState) {
      var pressed = isOn(component, toggleConfig);

      var ariaInfo = toggleConfig.aria();
      ariaInfo.update()(component, ariaInfo, pressed);
    };

    var toggle = function (component, toggleConfig, toggleState) {
      Class.toggle(component.element(), toggleConfig.toggleClass());
      updateAriaState(component, toggleConfig);
    };

    var on = function (component, toggleConfig, toggleState) {
      Class.add(component.element(), toggleConfig.toggleClass());
      updateAriaState(component, toggleConfig);
    };

    var off = function (component, toggleConfig, toggleState) {
      Class.remove(component.element(), toggleConfig.toggleClass());
      updateAriaState(component, toggleConfig);
    };

    var isOn = function (component, toggleConfig, toggleState) {
      return Class.has(component.element(), toggleConfig.toggleClass());
    };

    var onLoad = function (component, toggleConfig, toggleState) {
      // There used to be a bit of code in here that would only overwrite
      // the attribute if it didn't have a current value. I can't remember
      // what case that was for, so I'm removing it until it is required.
      var api = toggleConfig.selected() ? on : off;
      api(component, toggleConfig, toggleState);
    };

    return {
      onLoad: onLoad,
      toggle: toggle,
      isOn: isOn,
      on: on,
      off: off
    };
  }
);
define(
  'ephox.alloy.behaviour.toggling.ActiveToggle',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.behaviour.common.Behaviour',
    'ephox.alloy.behaviour.toggling.ToggleApis',
    'ephox.alloy.dom.DomModification',
    'ephox.katamari.api.Arr'
  ],

  function (AlloyEvents, Behaviour, ToggleApis, DomModification, Arr) {
    var exhibit = function (base, toggleConfig, toggleState) {
      return DomModification.nu({ });
    };

    var events = function (toggleConfig, toggleState) {
      var execute = Behaviour.executeEvent(toggleConfig, toggleState, ToggleApis.toggle);
      var load = Behaviour.loadEvent(toggleConfig, toggleState, ToggleApis.onLoad);

      return AlloyEvents.derive(
        Arr.flatten([
          toggleConfig.toggleOnExecute() ? [ execute ] : [ ],
          [ load ]
        ])
      );
    };

    return {
      exhibit: exhibit,
      events: events
    };
  }
);
define(
  'ephox.alloy.behaviour.toggling.ToggleModes',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.properties.Attr'
  ],

  function (Objects, Arr, Option, Node, Attr) {
    var updatePressed = function (component, ariaInfo, status) {
      Attr.set(component.element(), 'aria-pressed', status);
      if (ariaInfo.syncWithExpanded()) updateExpanded(component, ariaInfo, status);
    };

    var updateSelected = function (component, ariaInfo, status) {
      Attr.set(component.element(), 'aria-selected', status);
    };

    var updateChecked = function (component, ariaInfo, status) {
      Attr.set(component.element(), 'aria-checked', status);
    };

    var updateExpanded = function (component, ariaInfo, status) {
      Attr.set(component.element(), 'aria-expanded', status);
    };

    // INVESTIGATE: What other things can we derive?
    var tagAttributes = {
      button: [ 'aria-pressed' ],
      'input:checkbox': [ 'aria-checked' ]
    };

    var roleAttributes = {
      'button': [ 'aria-pressed' ],
      'listbox': [ 'aria-pressed', 'aria-expanded' ],
      'menuitemcheckbox': [ 'aria-checked' ]
    };

    var detectFromTag = function (component) {
      var elem = component.element();
      var rawTag = Node.name(elem);
      var suffix = rawTag === 'input' && Attr.has(elem, 'type') ? ':' + Attr.get(elem, 'type') : '';
      return Objects.readOptFrom(tagAttributes, rawTag + suffix);
    };

    var detectFromRole = function (component) {
      var elem = component.element();
      if (! Attr.has(elem, 'role')) return Option.none();
      else {
        var role = Attr.get(elem, 'role');
        return Objects.readOptFrom(roleAttributes, role);
      }
    };

    var updateAuto = function (component, ariaInfo, status) {
      // Role has priority
      var attributes = detectFromRole(component).orThunk(function () {
        return detectFromTag(component);
      }).getOr([ ]);
      Arr.each(attributes, function (attr) {
        Attr.set(component.element(), attr, status);
      });
    };

    return {
      updatePressed: updatePressed,
      updateSelected: updateSelected,
      updateChecked: updateChecked,
      updateExpanded: updateExpanded,
      updateAuto: updateAuto
    };
  }
);

define(
  'ephox.alloy.behaviour.toggling.ToggleSchema',

  [
    'ephox.alloy.behaviour.toggling.ToggleModes',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun'
  ],

  function (ToggleModes, Fields, FieldSchema, ValueSchema, Fun) {
    return [
      FieldSchema.defaulted('selected', false),
      FieldSchema.strict('toggleClass'),
      FieldSchema.defaulted('toggleOnExecute', true),

      FieldSchema.defaultedOf('aria', {
        mode: 'none'
      }, ValueSchema.choose(
        'mode', {
          'pressed': [
            FieldSchema.defaulted('syncWithExpanded', false),
            Fields.output('update', ToggleModes.updatePressed)
          ],
          'checked': [
            Fields.output('update', ToggleModes.updateChecked)
          ],
          'expanded': [
            Fields.output('update', ToggleModes.updateExpanded)
          ],
          'selected': [
            Fields.output('update', ToggleModes.updateSelected)
          ],
          'none': [
            Fields.output('update', Fun.noop)
          ]
        }
      ))
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Toggling',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.toggling.ActiveToggle',
    'ephox.alloy.behaviour.toggling.ToggleApis',
    'ephox.alloy.behaviour.toggling.ToggleSchema'
  ],

  function (Behaviour, ActiveToggle, ToggleApis, ToggleSchema) {
    return Behaviour.create({
      fields: ToggleSchema,
      name: 'toggling',
      active: ActiveToggle,
      apis: ToggleApis
    });
  }
);
define(
  'ephox.alloy.ephemera.AlloyTags',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var prefix = 'alloy-id-';
    var idAttr = 'data-alloy-id';

    return {
      prefix: Fun.constant(prefix),
      idAttr: Fun.constant(idAttr)
    };
  }
);
defineGlobal("global!Date", Date);
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
      var date   = new Date();
      var time   = date.getTime();
      var random = Math.floor(Math.random() * 1000000000);

      unique++;

      return prefix + '_' + random + unique + String(time);
    };

    return {
      generate: generate
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

define(
  'ephox.alloy.registry.Tagger',

  [
    'ephox.alloy.ephemera.AlloyTags',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (AlloyTags, Id, Fun, Option, Attr, Node, SelectorFind) {
    var prefix = AlloyTags.prefix();
    var idAttr = AlloyTags.idAttr();

    var write = function (label, elem) {
      var id = Id.generate(prefix + label);
      Attr.set(elem, idAttr, id);
      return id;
    };

    var writeOnly = function (elem, uid) {
      Attr.set(elem, idAttr, uid);
    };

    var read = function (elem) {
      var id = Node.isElement(elem) ? Attr.get(elem, idAttr) : null;
      return Option.from(id);
    };

    var find = function (container, id) {
      return SelectorFind.descendant(container, id);
    };

    var generate = function (prefix) {
      return Id.generate(prefix);
    };

    var revoke = function (elem) {
      Attr.remove(elem, idAttr);
    };

    return {
      revoke: revoke,
      write: write,
      writeOnly: writeOnly,
      read: read,
      find: find,
      generate: generate,
      attribute: Fun.constant(idAttr)
    };
  }
);
define(
  'ephox.alloy.api.component.Memento',

  [
    'ephox.alloy.registry.Tagger',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option'
  ],

  function (Tagger, Objects, Merger, Option) {
    var record = function (spec) {
      var uid = Objects.hasKey(spec, 'uid') ? spec.uid : Tagger.generate('memento');

      var get = function (any) {
        return any.getSystem().getByUid(uid).getOrDie();
      };

      var getOpt = function (any) {
        return any.getSystem().getByUid(uid).fold(Option.none, Option.some);
      };

      var asSpec = function () {
        return Merger.deepMerge(spec, {
          uid: uid
        });
      };

      return {
        get: get,
        getOpt: getOpt,
        asSpec: asSpec
      };
    };

    return {
      record: record
    };
  }
);
defineGlobal("global!setTimeout", setTimeout);
defineGlobal("global!window", window);
define(
  'tinymce.themes.mobile.channels.Receivers',

  [
    'ephox.alloy.api.behaviour.Receiving',
    'ephox.boulder.api.Objects',
    'tinymce.themes.mobile.channels.TinyChannels'
  ],

  function (Receiving, Objects, TinyChannels) {
    var format = function (command, update) {
      return Receiving.config({
        channels: Objects.wrap(
          TinyChannels.formatChanged(),
          {
            onReceive: function (button, data) {
              if (data.command === command) {
                update(button, data.state);
              }
            }
          }
        )
      });
    };

    var orientation = function (onReceive) {
      return Receiving.config({
        channels: Objects.wrap(
          TinyChannels.orientationChanged(),
          {
            onReceive: onReceive
          }
        )
      });
    };

    var receive = function (channel, onReceive) {
      return {
        key: channel,
        value: {
          onReceive: onReceive
        }
      };
    };

    return {
      format: format,
      orientation: orientation,
      receive: receive
    };
  }
);

define(
  'tinymce.themes.mobile.style.Styles',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var prefix = 'tinymce-mobile';

    var resolve = function (p) {
      return prefix + '-' + p;
    };

    return {
      resolve: resolve,
      prefix: Fun.constant(prefix)
    };
  }
);

define(
  'ephox.alloy.behaviour.unselecting.ActiveUnselecting',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.dom.DomModification',
    'ephox.katamari.api.Fun'
  ],

  function (AlloyEvents, NativeEvents, DomModification, Fun) {
    var exhibit = function (base, unselectConfig) {
      return DomModification.nu({
        styles: {
          '-webkit-user-select': 'none',
          'user-select': 'none',
          '-ms-user-select': 'none',
          '-moz-user-select': '-moz-none'
        },
        attributes: {
          'unselectable': 'on'
        }
      });
    };

    var events = function (unselectConfig) {
      return AlloyEvents.derive([
        AlloyEvents.abort(NativeEvents.selectstart(), Fun.constant(true))
      ]);
    };

    return {
      events: events,
      exhibit: exhibit
    };
  }
);
define(
  'ephox.alloy.api.behaviour.Unselecting',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.unselecting.ActiveUnselecting'
  ],

  function (Behaviour, ActiveUnselecting) {
    return Behaviour.create({
      fields: [ ],
      name: 'unselecting',
      active: ActiveUnselecting
    });
  }
);
define(
  'ephox.alloy.behaviour.focusing.FocusApis',

  [
    'ephox.sugar.api.dom.Focus'
  ],

  function (Focus) {
    var focus = function (component, focusConfig) {
      if (! focusConfig.ignore()) {
        Focus.focus(component.element());
        focusConfig.onFocus()(component);
      }
    };

    var blur = function (component, focusConfig) {
      if (! focusConfig.ignore()) {
        Focus.blur(component.element());
      }
    };

    var isFocused = function (component) {
      return Focus.hasFocus(component.element());
    };

    return {
      focus: focus,
      blur: blur,
      isFocused: isFocused
    };
  }
);
define(
  'ephox.alloy.behaviour.focusing.ActiveFocus',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.behaviour.focusing.FocusApis',
    'ephox.alloy.dom.DomModification'
  ],

  function (AlloyEvents, SystemEvents, FocusApis, DomModification) {
    var exhibit = function (base, focusConfig) {
      if (focusConfig.ignore()) return DomModification.nu({ });
      else return DomModification.nu({
        attributes: {
          'tabindex': '-1'
        }
      });
    };

    var events = function (focusConfig) {
      return AlloyEvents.derive([
        AlloyEvents.run(SystemEvents.focus(), function (component, simulatedEvent) {
          FocusApis.focus(component, focusConfig);
          simulatedEvent.stop();
        })
      ]);
    };

    return {
      exhibit: exhibit,
      events: events
    };
  }
);
define(
  'ephox.alloy.behaviour.focusing.FocusSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema'
  ],

  function (Fields, FieldSchema) {
    return [
      // TODO: Work out when we want to  call this. Only when it is has changed?
      Fields.onHandler('onFocus'),
      FieldSchema.defaulted('ignore', false)
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Focusing',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.focusing.ActiveFocus',
    'ephox.alloy.behaviour.focusing.FocusApis',
    'ephox.alloy.behaviour.focusing.FocusSchema'
  ],

  function (Behaviour, ActiveFocus, FocusApis, FocusSchema) {
    return Behaviour.create({
      fields: FocusSchema,
      name: 'focusing',
      active: ActiveFocus,
      apis: FocusApis
      // Consider adding isFocused an an extra
    });
  }
);
define(
  'ephox.alloy.alien.Keys',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    return {
      BACKSPACE : Fun.constant([8]),
      TAB : Fun.constant([9]),
      ENTER : Fun.constant([13]),
      SHIFT : Fun.constant([16]),
      CTRL : Fun.constant([17]),
      ALT : Fun.constant([18]),
      CAPSLOCK : Fun.constant([20]),
      ESCAPE : Fun.constant([27]),
      SPACE: Fun.constant([32]),
      PAGEUP: Fun.constant([33]),
      PAGEDOWN: Fun.constant([34]),
      END: Fun.constant([35]),
      HOME: Fun.constant([36]),
      LEFT: Fun.constant([37]),
      UP: Fun.constant([38]),
      RIGHT: Fun.constant([39]),
      DOWN: Fun.constant([40]),
      INSERT: Fun.constant([45]),
      DEL: Fun.constant([46]),
      META: Fun.constant([91, 93, 224]),
      F10: Fun.constant([121])
    };
  }
);
define(
  'ephox.alloy.alien.Cycles',

  [

  ],

  function () {
    var cycleBy = function (value, delta, min, max) {
      var r = value + delta;
      if (r > max) return min;
      else return r < min ? max : r;
    };

    var cap = function (value, min, max) {
      if (value <= min) return min;
      else return value >= max ? max : value;
    };

    return {
      cycleBy: cycleBy,
      cap: cap
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

define(
  'ephox.alloy.behaviour.highlighting.HighlightApis',

  [
    'ephox.alloy.alien.Cycles',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Result',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.SelectorFind',
    'global!Error'
  ],

  function (Cycles, Arr, Option, Result, Class, SelectorFilter, SelectorFind, Error) {
    var dehighlightAll = function (component, hConfig, hState) {
      var highlighted = SelectorFilter.descendants(component.element(), '.' + hConfig.highlightClass());
      Arr.each(highlighted, function (h) {
        Class.remove(h, hConfig.highlightClass());
        component.getSystem().getByDom(h).each(function (target) {
          hConfig.onDehighlight()(component, target);
        });
      });
    };

    var dehighlight = function (component, hConfig, hState, target) {
      var wasHighlighted = isHighlighted(component, hConfig, hState, target);
      Class.remove(target.element(), hConfig.highlightClass());

      // Only fire the event if it was highlighted.
      if (wasHighlighted) hConfig.onDehighlight()(component, target);
    };

    var highlight = function (component, hConfig, hState, target) {
      var wasHighlighted = isHighlighted(component, hConfig, hState, target);
      dehighlightAll(component, hConfig, hState);
      Class.add(target.element(), hConfig.highlightClass());

      // TODO: Check whether this should always fire
      if (! wasHighlighted) hConfig.onHighlight()(component, target);
    };

    var highlightFirst = function (component, hConfig, hState) {
      getFirst(component, hConfig, hState).each(function (firstComp) {
        highlight(component, hConfig, hState, firstComp);
      });
    };

    var highlightLast = function (component, hConfig, hState) {
      getLast(component, hConfig, hState).each(function (lastComp) {
        highlight(component, hConfig, hState, lastComp);
      });
    };

    var highlightAt = function (component, hConfig, hState, index) {
      getByIndex(component, hConfig, hState, index).fold(function (err) {
        throw new Error(err);
      }, function (firstComp) {
        highlight(component, hConfig, hState, firstComp);
      });
    };

    var isHighlighted = function (component, hConfig, hState, queryTarget) {
      return Class.has(queryTarget.element(), hConfig.highlightClass());
    };

    var getHighlighted = function (component, hConfig, hState) {
      // FIX: Wrong return type (probably)
      return SelectorFind.descendant(component.element(), '.' + hConfig.highlightClass()).bind(component.getSystem().getByDom);
    };

    var getByIndex = function (component, hConfig, hState, index) {
      var items = SelectorFilter.descendants(component.element(), '.' + hConfig.itemClass());

      return Option.from(items[index]).fold(function () {
        return Result.error('No element found with index ' + index);
      }, component.getSystem().getByDom);
    };

    var getFirst = function (component, hConfig, hState) {
      // FIX: Wrong return type (probably)
      return SelectorFind.descendant(component.element(), '.' + hConfig.itemClass()).bind(component.getSystem().getByDom);
    };

    var getLast = function (component, hConfig, hState) {
      var items = SelectorFilter.descendants(component.element(), '.' + hConfig.itemClass());
      var last = items.length > 0 ? Option.some(items[items.length - 1]) : Option.none();
      return last.bind(component.getSystem().getByDom);
    };

    var getDelta = function (component, hConfig, hState, delta) {
      var items = SelectorFilter.descendants(component.element(), '.' + hConfig.itemClass());
      var current = Arr.findIndex(items, function (item) {
        return Class.has(item, hConfig.highlightClass());
      });

      return current.bind(function (selected) {
        var dest = Cycles.cycleBy(selected, delta, 0, items.length - 1);
        // INVESTIGATE: Are these consistent return types? (Option vs Result)
        return component.getSystem().getByDom(items[dest]);
      });
    };

    var getPrevious = function (component, hConfig, hState) {
      return getDelta(component, hConfig, hState, -1);
    };

    var getNext = function (component, hConfig, hState) {
      return getDelta(component, hConfig, hState, +1);
    };

    return {
      dehighlightAll: dehighlightAll,
      dehighlight: dehighlight,
      highlight: highlight,
      highlightFirst: highlightFirst,
      highlightLast: highlightLast,
      highlightAt: highlightAt,
      isHighlighted: isHighlighted,
      getHighlighted: getHighlighted,
      getFirst: getFirst,
      getLast: getLast,
      getPrevious: getPrevious,
      getNext: getNext
    };
  }
);
define(
  'ephox.alloy.behaviour.highlighting.HighlightSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema'
  ],

  function (Fields, FieldSchema) {
    return [
      FieldSchema.strict('highlightClass'),
      FieldSchema.strict('itemClass'),

      Fields.onHandler('onHighlight'),
      Fields.onHandler('onDehighlight')
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Highlighting',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.highlighting.HighlightApis',
    'ephox.alloy.behaviour.highlighting.HighlightSchema',
    'global!Array'
  ],

  function (Behaviour, HighlightApis, HighlightSchema, Array) {
    return Behaviour.create({
      fields: HighlightSchema,
      name: 'highlighting',
      apis: HighlightApis
    });
  }
);
define(
  'ephox.alloy.api.focus.FocusManagers',

  [
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Focus'
  ],

  function (Highlighting, Fun, Focus) {

    var dom = function () {
      var get = function (component) {
        return Focus.search(component.element());
      };

      var set = function (component, focusee) {
        component.getSystem().triggerFocus(focusee, component.element());
      };

      return {
        get: get,
        set: set
      };
    };

    var highlights = function () {
      var get = function (component) {
        return Highlighting.getHighlighted(component).map(function (item) {
          return item.element();
        });
      };

      var set = function (component, element) {
        component.getSystem().getByDom(element).fold(Fun.noop, function (item) {
          Highlighting.highlight(component, item);
        });
      };

      return {
        get: get,
        set: set
      };
    };

    return {
      dom: dom,
      highlights: highlights
    };
  }
);
define(
  'ephox.alloy.navigation.KeyMatch',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun'
  ],

  function (Arr, Fun) {
    var inSet = function (keys) {
      return function (event) {
        return Arr.contains(keys, event.raw().which);
      };
    };

    var and = function (preds) {
      return function (event) {
        return Arr.forall(preds, function (pred) {
          return pred(event);
        });
      };
    };

    var is = function (key) {
      return function (event) {
        return event.raw().which === key;
      };
    };

    var isShift = function (event) {
      return event.raw().shiftKey === true;
    };

    return {
      inSet: inSet,
      and: and,
      is: is,
      isShift: isShift,
      isNotShift: Fun.not(isShift)

    };
  }
);
define(
  'ephox.alloy.navigation.KeyRules',

  [
    'ephox.alloy.navigation.KeyMatch',
    'ephox.katamari.api.Arr'
  ],

  function (KeyMatch, Arr) {
    var basic = function (key, action) {
      return {
        matches: KeyMatch.is(key),
        classification: action
      };
    };

    var rule = function (matches, action) {
      return {
        matches: matches,
        classification: action
      };
    };

    var choose = function (transitions, event) {
      var transition = Arr.find(transitions, function (t) {
        return t.matches(event);
      });

      return transition.map(function (t) {
        return t.classification;
      });
    };

    return {
      basic: basic,
      rule: rule,
      choose: choose
    };
  }
);
define(
  'ephox.alloy.keying.KeyingType',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.api.focus.FocusManagers',
    'ephox.alloy.data.Fields',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Merger'
  ],

  function (AlloyEvents, NativeEvents, SystemEvents, FocusManagers, Fields, KeyRules, FieldSchema, Merger) {
    var typical = function (infoSchema, stateInit, getRules, getEvents, getApis, optFocusIn) {
      var schema = function () {
        return infoSchema.concat([
          FieldSchema.defaulted('focusManager', FocusManagers.dom()),
          Fields.output('handler', me),
          Fields.output('state', stateInit)
        ]);
      };

      var processKey = function (component, simulatedEvent, keyingConfig, keyingState) {
        var rules = getRules(component, simulatedEvent, keyingConfig, keyingState);

        return KeyRules.choose(rules, simulatedEvent.event()).bind(function (rule) {
          return rule(component, simulatedEvent, keyingConfig, keyingState);
        });
      };

      var toEvents = function (keyingConfig, keyingState) {
        var otherEvents = getEvents(keyingConfig, keyingState);
        var keyEvents = AlloyEvents.derive(
          optFocusIn.map(function (focusIn) {
            return AlloyEvents.run(SystemEvents.focus(), function (component, simulatedEvent) {
              focusIn(component, keyingConfig, keyingState, simulatedEvent);
              simulatedEvent.stop();
            });
          }).toArray().concat([
            AlloyEvents.run(NativeEvents.keydown(), function (component, simulatedEvent) {
              processKey(component, simulatedEvent, keyingConfig, keyingState).each(function (_) {
                simulatedEvent.stop();
              });
            })
          ])
        );
        return Merger.deepMerge(otherEvents, keyEvents);
      };

      var me = {
        schema: schema,
        processKey: processKey,
        toEvents: toEvents,
        toApis: getApis
      };

      return me;
    };

    return {
      typical: typical
    };
  }
);
define(
  'ephox.alloy.navigation.ArrNavigation',

  [
    'ephox.katamari.api.Arr',
    'global!Math'
  ],

  function (Arr, Math) {
    var cyclePrev = function (values, index, predicate) {
      var before = Arr.reverse(values.slice(0, index));
      var after = Arr.reverse(values.slice(index + 1));
      return Arr.find(before.concat(after), predicate);
    };

    var tryPrev = function (values, index, predicate) {
      var before = Arr.reverse(values.slice(0, index));
      return Arr.find(before, predicate);
    };

    var cycleNext = function (values, index, predicate) {
      var before = values.slice(0, index);
      var after = values.slice(index + 1);
      return Arr.find(after.concat(before), predicate);
    };

    var tryNext = function (values, index, predicate) {
      var after = values.slice(index + 1);
      return Arr.find(after, predicate);
    };

    return {
      cyclePrev: cyclePrev,
      cycleNext: cycleNext,
      tryPrev: tryPrev,
      tryNext: tryNext
    };
  }
);
define(
  'ephox.sugar.impl.Style',

  [

  ],

  function () {
    // some elements, such as mathml, don't have style attributes
    var isSupported = function (dom) {
      return dom.style !== undefined;
    };

    return {
      isSupported: isSupported
    };
  }
);
define(
  'ephox.sugar.api.properties.Css',

  [
    'ephox.katamari.api.Type',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.impl.Style',
    'ephox.katamari.api.Strings',
    'global!Error',
    'global!console',
    'global!window'
  ],

  function (Type, Arr, Obj, Option, Attr, Body, Element, Node, Style, Strings, Error, console, window) {
    var internalSet = function (dom, property, value) {
      // This is going to hurt. Apologies.
      // JQuery coerces numbers to pixels for certain property names, and other times lets numbers through.
      // we're going to be explicit; strings only.
      if (!Type.isString(value)) {
        console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
        throw new Error('CSS value must be a string: ' + value);
      }

      // removed: support for dom().style[property] where prop is camel case instead of normal property name
      if (Style.isSupported(dom)) dom.style.setProperty(property, value);
    };

    var internalRemove = function (dom, property) {
      /*
       * IE9 and above - MDN doesn't have details, but here's a couple of random internet claims
       *
       * http://help.dottoro.com/ljopsjck.php
       * http://stackoverflow.com/a/7901886/7546
       */
      if (Style.isSupported(dom)) dom.style.removeProperty(property);
    };

    var set = function (element, property, value) {
      var dom = element.dom();
      internalSet(dom, property, value);
    };

    var setAll = function (element, css) {
      var dom = element.dom();

      Obj.each(css, function (v, k) {
        internalSet(dom, k, v);
      });
    };

    var setOptions = function(element, css) {
      var dom = element.dom();

      Obj.each(css, function (v, k) {
        v.fold(function () {
          internalRemove(dom, k);
        }, function (value) {
          internalSet(dom, k, value);
        });
      });
    };

    /*
     * NOTE: For certain properties, this returns the "used value" which is subtly different to the "computed value" (despite calling getComputedStyle).
     * Blame CSS 2.0.
     *
     * https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     */
    var get = function (element, property) {
      var dom = element.dom();
      /*
       * IE9 and above per
       * https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle
       *
       * Not in numerosity, because it doesn't memoize and looking this up dynamically in performance critical code would be horrendous.
       *
       * JQuery has some magic here for IE popups, but we don't really need that.
       * It also uses element.ownerDocument.defaultView to handle iframes but that hasn't been required since FF 3.6.
       */
      var styles = window.getComputedStyle(dom);
      var r = styles.getPropertyValue(property);

      // jquery-ism: If r is an empty string, check that the element is not in a document. If it isn't, return the raw value.
      // Turns out we do this a lot.
      var v = (r === '' && !Body.inBody(element)) ? getUnsafeProperty(dom, property) : r;

      // undefined is the more appropriate value for JS. JQuery coerces to an empty string, but screw that!
      return v === null ? undefined : v;
    };

    var getUnsafeProperty = function (dom, property) {
      // removed: support for dom().style[property] where prop is camel case instead of normal property name
      // empty string is what the browsers (IE11 and Chrome) return when the propertyValue doesn't exists.
      return Style.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
    };

    /*
     * Gets the raw value from the style attribute. Useful for retrieving "used values" from the DOM:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
     *
     * Returns NONE if the property isn't set, or the value is an empty string.
     */
    var getRaw = function (element, property) {
      var dom = element.dom();
      var raw = getUnsafeProperty(dom, property);

      return Option.from(raw).filter(function (r) { return r.length > 0; });
    };

    var isValidValue = function (tag, property, value) {
      var element = Element.fromTag(tag);
      set(element, property, value);
      var style = getRaw(element, property);
      return style.isSome();
    };

    var remove = function (element, property) {
      var dom = element.dom();

      internalRemove(dom, property);

      if (Attr.has(element, 'style') && Strings.trim(Attr.get(element, 'style')) === '') {
        // No more styles left, remove the style attribute as well
        Attr.remove(element, 'style');
      }
    };

    var preserve = function (element, f) {
      var oldStyles = Attr.get(element, 'style');
      var result = f(element);
      var restore = oldStyles === undefined ? Attr.remove : Attr.set;
      restore(element, 'style', oldStyles);
      return result;
    };

    var copy = function (source, target) {
      var sourceDom = source.dom();
      var targetDom = target.dom();
      if (Style.isSupported(sourceDom) && Style.isSupported(targetDom)) {
        targetDom.style.cssText = sourceDom.style.cssText;
      }
    };

    var reflow = function (e) {
      /* NOTE:
       * do not rely on this return value.
       * It's here so the closure compiler doesn't optimise the property access away.
       */
      return e.dom().offsetWidth;
    };

    var transferOne = function (source, destination, style) {
      getRaw(source, style).each(function (value) {
        // NOTE: We don't want to clobber any existing inline styles.
        if (getRaw(destination, style).isNone()) set(destination, style, value);
      });
    };

    var transfer = function (source, destination, styles) {
      if (!Node.isElement(source) || !Node.isElement(destination)) return;
      Arr.each(styles, function (style) {
        transferOne(source, destination, style);
      });
    };

    return {
      copy: copy,
      set: set,
      preserve: preserve,
      setAll: setAll,
      setOptions: setOptions,
      remove: remove,
      get: get,
      getRaw: getRaw,
      isValidValue: isValidValue,
      reflow: reflow,
      transfer: transfer
    };
  }
);

define(
  'ephox.sugar.impl.Dimension',

  [
    'ephox.katamari.api.Type',
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.impl.Style'
  ],

  function (Type, Arr, Css, Style) {
    return function (name, getOffset) {
      var set = function (element, h) {
        if (!Type.isNumber(h) && !h.match(/^[0-9]+$/)) throw name + '.set accepts only positive integer values. Value was ' + h;
        var dom = element.dom();
        if (Style.isSupported(dom)) dom.style[name] = h + 'px';
      };

      /*
       * jQuery supports querying width and height on the document and window objects.
       *
       * TBIO doesn't do this, so the code is removed to save space, but left here just in case.
       */
  /*
      var getDocumentWidth = function (element) {
        var dom = element.dom();
        if (Node.isDocument(element)) {
          var body = dom.body;
          var doc = dom.documentElement;
          return Math.max(
            body.scrollHeight,
            doc.scrollHeight,
            body.offsetHeight,
            doc.offsetHeight,
            doc.clientHeight
          );
        }
      };

      var getWindowWidth = function (element) {
        var dom = element.dom();
        if (dom.window === dom) {
          // There is no offsetHeight on a window, so use the clientHeight of the document
          return dom.document.documentElement.clientHeight;
        }
      };
  */


      var get = function (element) {
        var r = getOffset(element);

        // zero or null means non-standard or disconnected, fall back to CSS
        if ( r <= 0 || r === null ) {
          var css = Css.get(element, name);
          // ugh this feels dirty, but it saves cycles
          return parseFloat(css) || 0;
        }
        return r;
      };

      // in jQuery, getOuter replicates (or uses) box-sizing: border-box calculations
      // although these calculations only seem relevant for quirks mode, and edge cases TBIO doesn't rely on
      var getOuter = get;

      var aggregate = function (element, properties) {
        return Arr.foldl(properties, function (acc, property) {
          var val = Css.get(element, property);
          var value = val === undefined ? 0: parseInt(val, 10);
          return isNaN(value) ? acc : acc + value;
        }, 0);
      };

      var max = function (element, value, properties) {
        var cumulativeInclusions = aggregate(element, properties);
        // if max-height is 100px and your cumulativeInclusions is 150px, there is no way max-height can be 100px, so we return 0.
        var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
        return absoluteMax;
      };

      return {
        set: set,
        get: get,
        getOuter: getOuter,
        aggregate: aggregate,
        max: max
      };
    };
  }
);
define(
  'ephox.sugar.api.view.Height',

  [
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.impl.Dimension'
  ],

  function (Css, Dimension) {
    var api = Dimension('height', function (element) {
      // IMO passing this function is better than using dom['offset' + 'height']
      return element.dom().offsetHeight;
    });

    var set = function (element, h) {
      api.set(element, h);
    };

    var get = function (element) {
      return api.get(element);
    };

    var getOuter = function (element) {
      return api.getOuter(element);
    };

    var setMax = function (element, value) {
      // These properties affect the absolute max-height, they are not counted natively, we want to include these properties.
      var inclusions = [ 'margin-top', 'border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width', 'margin-bottom' ];
      var absMax = api.max(element, value, inclusions);
      Css.set(element, 'max-height', absMax + 'px');
    };

    return {
      set: set,
      get: get,
      getOuter: getOuter,
      setMax: setMax
    };
  }
);

define(
  'ephox.alloy.keying.CyclicType',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.data.Fields',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.log.AlloyLogger',
    'ephox.alloy.navigation.ArrNavigation',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.SelectorFind',
    'ephox.sugar.api.view.Height'
  ],

  function (
    Keys, NoState, Fields, KeyingType, AlloyLogger, ArrNavigation, KeyMatch, KeyRules, FieldSchema, Arr, Fun, Option, Compare, Focus, SelectorFilter, SelectorFind,
    Height
  ) {
    var schema = [
      FieldSchema.defaulted('selector', '[data-alloy-tabstop="true"]'),
      FieldSchema.option('onEscape'),
      FieldSchema.option('onEnter'),
      FieldSchema.defaulted('firstTabstop', 0),
      FieldSchema.defaulted('useTabstopAt', Fun.constant(true)),
      // Maybe later we should just expose isVisible
      FieldSchema.option('visibilitySelector')
    ];

    // Fire an alloy focus on the first visible element that matches the selector
    var focusIn = function (component, cyclicConfig, cyclicState) {
      var tabstops = SelectorFilter.descendants(component.element(), cyclicConfig.selector());
      var visibles = Arr.filter(tabstops, function (elem) {
        return isVisible(cyclicConfig, elem);
      });

      var visibleOpt = Option.from(visibles[cyclicConfig.firstTabstop()]);

      visibleOpt.each(function (target) {
        var originator = component.element();
        component.getSystem().triggerFocus(target, originator);
      });
    };

    // TODO: Test this
    var isVisible = function (cyclicConfig, element) {
      var target = cyclicConfig.visibilitySelector().bind(function (sel) {
        return SelectorFind.closest(element, sel);
      }).getOr(element);

      // NOTE: We can't use Visibility.isVisible, because the toolbar has width when it has closed, just not height.
      return Height.get(target) > 0;
    };

    var findTabstop = function (component, cyclicConfig) {
      return Focus.search(component.element()).bind(function (elem) {
        return SelectorFind.closest(elem, cyclicConfig.selector());
      });
    };

    var goFromTabstop = function (component, tabstops, stopIndex, cyclicConfig, cycle) {
      return cycle(tabstops, stopIndex, function (elem) {
        return isVisible(cyclicConfig, elem) && cyclicConfig.useTabstopAt(elem);
      }).fold(function () {
        // Even if there is only one, still capture the event.
        // logFailed(index, tabstops);
        return Option.some(true);
      }, function (outcome) {
        // logSuccess(cyclicInfo, index, tabstops, component.element(), outcome);
        var system = component.getSystem();
        var originator = component.element();
        system.triggerFocus(outcome, originator);
        // Kill the event
        return Option.some(true);
      });
    };

    var go = function (component, simulatedEvent, cyclicConfig, cycle) {
      // 1. Find our current tabstop
      // 2. Find the index of that tabstop
      // 3. Cycle the tabstop
      // 4. Fire alloy focus on the resultant tabstop
      var tabstops = SelectorFilter.descendants(component.element(), cyclicConfig.selector());
      return findTabstop(component, cyclicConfig).bind(function (tabstop) {
        // focused component
        var optStopIndex = Arr.findIndex(tabstops, Fun.curry(Compare.eq, tabstop));

        return optStopIndex.bind(function (stopIndex) {
          return goFromTabstop(component, tabstops, stopIndex, cyclicConfig, cycle);
        });
      });
    };

    var goBackwards = function (component, simulatedEvent, cyclicConfig, cyclicState) {
      return go(component, simulatedEvent, cyclicConfig, ArrNavigation.cyclePrev);
    };

    var goForwards = function (component, simulatedEvent, cyclicConfig, cyclicState) {
      return go(component, simulatedEvent, cyclicConfig, ArrNavigation.cycleNext);
    };

    var execute = function (component, simulatedEvent, cyclicConfig, cyclicState) {
      return cyclicConfig.onEnter().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };

    var exit = function (component, simulatedEvent, cyclicConfig, cyclicState) {
      return cyclicConfig.onEscape().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };

    var getRules = Fun.constant([
      KeyRules.rule(KeyMatch.and([ KeyMatch.isShift, KeyMatch.inSet(Keys.TAB()) ]), goBackwards),
      KeyRules.rule(KeyMatch.inSet(Keys.TAB()), goForwards),
      KeyRules.rule(KeyMatch.inSet(Keys.ESCAPE()), exit),
      KeyRules.rule(KeyMatch.and([ KeyMatch.isNotShift, KeyMatch.inSet(Keys.ENTER()) ]), execute)
    ]);

    var getEvents = Fun.constant({ });
    var getApis = Fun.constant({ });

    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.alien.EditableFields',

  [
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.node.Node'
  ],

  function (Attr, Node) {
    var inside = function (target) {
      return (
        (Node.name(target) === 'input' && Attr.get(target, 'type') !== 'radio') ||
        Node.name(target) === 'textarea'
      );
    };

    return {
      inside: inside
    };
  }
);
define(
  'ephox.alloy.keying.KeyingTypes',

  [
    'ephox.alloy.alien.EditableFields',
    'ephox.alloy.alien.Keys',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.katamari.api.Option'
  ],

  function (EditableFields, Keys, AlloyTriggers, SystemEvents, KeyMatch, Option) {

    var doDefaultExecute = function (component, simulatedEvent, focused) {
      // Note, we use to pass through simulatedEvent here and make target: component. This simplification
      // may be a problem
      AlloyTriggers.dispatch(component, focused, SystemEvents.execute());
      return Option.some(true);
    };

    var defaultExecute = function (component, simulatedEvent, focused) {
      return EditableFields.inside(focused) && KeyMatch.inSet(Keys.SPACE())(simulatedEvent.event()) ? Option.none() : doDefaultExecute(component, simulatedEvent, focused);
    };

    return {
      defaultExecute: defaultExecute
    };
  }
);
define(
  'ephox.alloy.keying.ExecutionType',

  [
    'ephox.alloy.alien.EditableFields',
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.keying.KeyingTypes',
    'ephox.alloy.log.AlloyLogger',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option'
  ],

  function (EditableFields, Keys, NoState, KeyingType, KeyingTypes, AlloyLogger, KeyMatch, KeyRules, FieldSchema, Fun, Option) {
    var schema = [
      FieldSchema.defaulted('execute', KeyingTypes.defaultExecute),
      FieldSchema.defaulted('useSpace', false),
      FieldSchema.defaulted('useEnter', true),
      FieldSchema.defaulted('useDown', false)
    ];

    var execute = function (component, simulatedEvent, executeConfig, executeState) {
      return executeConfig.execute()(component, simulatedEvent, component.element());
    };

    var getRules = function (component, simulatedEvent, executeConfig, executeState) {
      var spaceExec = executeConfig.useSpace() && !EditableFields.inside(component.element()) ? Keys.SPACE() : [ ];
      var enterExec = executeConfig.useEnter() ? Keys.ENTER() : [ ];
      var downExec = executeConfig.useDown() ? Keys.DOWN() : [ ];
      var execKeys = spaceExec.concat(enterExec).concat(downExec);

      return [
        KeyRules.rule(KeyMatch.inSet(execKeys), execute)
      ];
    };

    var getEvents = Fun.constant({ });
    var getApis = Fun.constant({ });

    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.none());
  }
);
define(
  'ephox.alloy.behaviour.keyboard.KeyingState',

  [
    'ephox.alloy.behaviour.common.BehaviourState',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option'
  ],

  function (BehaviourState, Cell, Fun, Option) {
    var flatgrid = function (spec) {
      var dimensions = Cell(Option.none());

      var setGridSize = function (numRows, numColumns) {
        dimensions.set(
          Option.some({
            numRows: Fun.constant(numRows),
            numColumns: Fun.constant(numColumns)
          })
        );
      };

      var getNumRows = function () {
        return dimensions.get().map(function (d) {
          return d.numRows();
        });
      };

      var getNumColumns = function () {
        return dimensions.get().map(function (d) {
          return d.numColumns();
        });
      };

      return BehaviourState({
        readState: Fun.constant({ }),
        setGridSize: setGridSize,
        getNumRows: getNumRows,
        getNumColumns: getNumColumns
      });
    };

    var init = function (spec) {
      return spec.state()(spec);
    };

    return {
      flatgrid: flatgrid,
      init: init
    };
  }
);

define(
  'ephox.sugar.api.properties.Direction',

  [
    'ephox.sugar.api.properties.Css'
  ],

  function (Css) {
    var onDirection = function (isLtr, isRtl) {
      return function (element) {
        return getDirection(element) === 'rtl' ? isRtl : isLtr;
      };
    };

    var getDirection = function (element) {
      return Css.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
    };

    return {
      onDirection: onDirection,
      getDirection: getDirection
    };
  }
);
define(
  'ephox.alloy.navigation.DomMovement',

  [
    'ephox.sugar.api.properties.Direction'
  ],

  function (Direction) {
    // Looks up direction (considering LTR and RTL), finds the focused element,
    // and tries to move. If it succeeds, triggers focus and kills the event.
    var useH = function (movement) {
      return function (component, simulatedEvent, config, state) {
        var move = movement(component.element());
        return use(move, component, simulatedEvent, config, state);
      };
    };

    var west = function (moveLeft, moveRight) {
      var movement = Direction.onDirection(moveLeft, moveRight);
      return useH(movement);
    };

    var east = function (moveLeft, moveRight) {
      var movement = Direction.onDirection(moveRight, moveLeft);
      return useH(movement);
    };

    var useV = function (move) {
      return function (component, simulatedEvent, config, state) {
        return use(move, component, simulatedEvent, config, state);
      };
    };

    var use = function (move, component, simulatedEvent, config, state) {
      var outcome = config.focusManager().get(component).bind(function (focused) {
        return move(component.element(), focused, config, state);
      });

      return outcome.map(function (newFocus) {
        config.focusManager().set(component, newFocus);
        return true;
      });
    };

    return {
      east: east,
      west: west,
      north: useV,
      south: useV,
      move: useV
    };
  }
);
define(
  'ephox.alloy.navigation.ArrPinpoint',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Struct'
  ],

  function (Arr, Struct) {
    var indexInfo = Struct.immutableBag([ 'index', 'candidates' ], [ ]);

    var locate = function (candidates, predicate) {
      return Arr.findIndex(candidates, predicate).map(function (index) {
        return indexInfo({
          index: index,
          candidates: candidates
        });
      });
    };

    return {
      locate: locate
    };
  }
);
define(
  'ephox.sugar.api.view.Visibility',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Toggler',
    'ephox.sugar.api.properties.Css'
  ],

  function (Fun, Toggler, Css) {
    // This function is dangerous. Toggle behaviour is different depending on whether the element is in the DOM or not when it's created.
    var visibilityToggler = function (element, property, hiddenValue, visibleValue) {
      var initial = Css.get(element, property);
      // old jquery-ism that this function depends on
      if (initial === undefined) initial = '';

      var value = initial === hiddenValue ? visibleValue : hiddenValue;

      var off = Fun.curry(Css.set, element, property, initial);
      var on = Fun.curry(Css.set, element, property, value);
      return Toggler(off, on, false);
    };

    var toggler = function (element) {
      return visibilityToggler(element, 'visibility', 'hidden', 'visible');
    };

    var displayToggler = function (element, value) {
      return visibilityToggler(element, 'display', 'none', value);
    };

    var isHidden = function (dom) {
      return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
    };

    var isVisible = function (element) {
      var dom = element.dom();
      return !isHidden(dom);
    };

    return {
      toggler: toggler,
      displayToggler: displayToggler,
      isVisible: isVisible
    };
  }
);

define(
  'ephox.alloy.navigation.DomPinpoint',

  [
    'ephox.alloy.navigation.ArrPinpoint',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.view.Visibility'
  ],

  function (ArrPinpoint, Arr, Fun, Compare, SelectorFilter, Visibility) {
    var locateVisible = function (container, current, selector) {
      var filter = Visibility.isVisible;
      return locateIn(container, current, selector, filter);
    };

    var locateIn = function (container, current, selector, filter) {
      var predicate = Fun.curry(Compare.eq, current);
      var candidates = SelectorFilter.descendants(container, selector);
      var visible = Arr.filter(candidates, Visibility.isVisible);
      return ArrPinpoint.locate(visible, predicate);
    };

    var findIndex = function (elements, target) {
      return Arr.findIndex(elements, function (elem) {
        return Compare.eq(target, elem);
      });
    };

    return {
      locateVisible: locateVisible,
      locateIn: locateIn,
      findIndex: findIndex
    };
  }
);
define(
  'ephox.alloy.navigation.WrapArrNavigation',

  [
    'ephox.alloy.alien.Cycles',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'global!Math'
  ],

  function (Cycles, Fun, Option, Math) {
    var withGrid = function (values, index, numCols, f) {
      var oldRow = Math.floor(index / numCols);
      var oldColumn = index % numCols;

      return f(oldRow, oldColumn).bind(function (address) {
        var newIndex = address.row() * numCols + address.column();
        return newIndex >= 0 && newIndex < values.length ? Option.some(values[newIndex]) : Option.none();
      });
    };

    var cycleHorizontal = function (values, index, numRows, numCols, delta) {
      return withGrid(values, index, numCols, function (oldRow, oldColumn) {
        var onLastRow = oldRow === numRows - 1;
        var colsInRow = onLastRow ? values.length - (oldRow * numCols) : numCols;
        var newColumn = Cycles.cycleBy(oldColumn, delta, 0, colsInRow - 1);
        return Option.some({
          row: Fun.constant(oldRow),
          column: Fun.constant(newColumn)
        });
      });
    };

    var cycleVertical = function (values, index, numRows, numCols, delta) {
      return withGrid(values, index, numCols, function (oldRow, oldColumn) {
        var newRow = Cycles.cycleBy(oldRow, delta, 0, numRows - 1);
        var onLastRow = newRow === numRows - 1;
        var colsInRow = onLastRow ? values.length - (newRow * numCols) : numCols;
        var newCol = Cycles.cap(oldColumn, 0, colsInRow - 1);
        return Option.some({
          row: Fun.constant(newRow),
          column: Fun.constant(newCol)
        });
      });
    };

    var cycleRight = function (values, index, numRows, numCols) {
      return cycleHorizontal(values, index, numRows, numCols, +1);
    };

    var cycleLeft = function (values, index, numRows, numCols) {
      return cycleHorizontal(values, index, numRows, numCols, -1);
    };

    var cycleUp = function (values, index, numRows, numCols) {
      return cycleVertical(values, index, numRows, numCols, -1);
    };

    var cycleDown = function (values, index, numRows, numCols) {
      return cycleVertical(values, index, numRows, numCols, +1);
    };

    return {
      cycleDown: cycleDown,
      cycleUp: cycleUp,
      cycleLeft: cycleLeft,
      cycleRight: cycleRight
    };
  }
);
define(
  'ephox.alloy.keying.FlatgridType',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.keyboard.KeyingState',
    'ephox.alloy.data.Fields',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.keying.KeyingTypes',
    'ephox.alloy.navigation.DomMovement',
    'ephox.alloy.navigation.DomPinpoint',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.alloy.navigation.WrapArrNavigation',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (
    Keys, KeyingState, Fields, KeyingType, KeyingTypes, DomMovement, DomPinpoint, KeyMatch, KeyRules, WrapArrNavigation, FieldSchema, Cell, Fun, Option, Focus,
    SelectorFind
  ) {
    var schema = [
      FieldSchema.strict('selector'),
      FieldSchema.defaulted('execute', KeyingTypes.defaultExecute),
      Fields.onKeyboardHandler('onEscape'),
      FieldSchema.defaulted('captureTab', false),
      Fields.initSize()
    ];

    var focusIn = function (component, gridConfig, gridState) {
      SelectorFind.descendant(component.element(), gridConfig.selector()).each(function (first) {
        component.getSystem().triggerFocus(first, component.element());
      });
    };

    var execute = function (component, simulatedEvent, gridConfig, gridState) {
      return Focus.search(component.element(), gridConfig.selector()).bind(function (focused) {
        return gridConfig.execute()(component, simulatedEvent, focused);
      });
    };

    var doMove = function (cycle) {
      return function (element, focused, gridConfig, gridState) {
        return DomPinpoint.locateVisible(element, focused, gridConfig.selector()).bind(function (identified) {
          return cycle(
            identified.candidates(),
            identified.index(),
            gridState.getNumRows().getOr(gridConfig.initSize().numRows()),
            gridState.getNumColumns().getOr(gridConfig.initSize().numColumns())
          );
        });
      };
    };

    var handleTab = function (component, simulatedEvent, gridConfig, gridState) {
      return gridConfig.captureTab() ? Option.some(true) : Option.none();
    };

    var doEscape = function (component, simulatedEvent, gridConfig, gridState) {
      return gridConfig.onEscape()(component, simulatedEvent);
    };

    var moveLeft = doMove(WrapArrNavigation.cycleLeft);
    var moveRight = doMove(WrapArrNavigation.cycleRight);

    var moveNorth = doMove(WrapArrNavigation.cycleUp);
    var moveSouth = doMove(WrapArrNavigation.cycleDown);

    var getRules = Fun.constant([
      KeyRules.rule(KeyMatch.inSet(Keys.LEFT()), DomMovement.west(moveLeft, moveRight)),
      KeyRules.rule(KeyMatch.inSet(Keys.RIGHT()), DomMovement.east(moveLeft, moveRight)),
      KeyRules.rule(KeyMatch.inSet(Keys.UP()), DomMovement.north(moveNorth)),
      KeyRules.rule(KeyMatch.inSet(Keys.DOWN()), DomMovement.south(moveSouth)),
      KeyRules.rule(KeyMatch.and([ KeyMatch.isShift, KeyMatch.inSet(Keys.TAB()) ]), handleTab),
      KeyRules.rule(KeyMatch.and([ KeyMatch.isNotShift, KeyMatch.inSet(Keys.TAB()) ]), handleTab),
      KeyRules.rule(KeyMatch.inSet(Keys.ESCAPE()), doEscape),

      KeyRules.rule(KeyMatch.inSet(Keys.SPACE().concat(Keys.ENTER())), execute)
    ]);

    var getEvents = Fun.constant({ });

    var getApis = {};

    return KeyingType.typical(schema, KeyingState.flatgrid, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.navigation.DomNavigation',

  [
    'ephox.alloy.alien.Cycles',
    'ephox.alloy.navigation.DomPinpoint',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option'
  ],

  function (Cycles, DomPinpoint, Fun, Option) {
    var horizontal = function (container, selector, current, delta) {
      // I wonder if this will be a problem when the focused element is invisible (shouldn't happen)
      return DomPinpoint.locateVisible(container, current, selector, Fun.constant(true)).bind(function (identified) {
        var index = identified.index();
        var candidates = identified.candidates();
        var newIndex = Cycles.cycleBy(index, delta, 0, candidates.length - 1);
        return Option.from(candidates[newIndex]);
      });
    };

    return {
      horizontal: horizontal
    };
  }
);
define(
  'ephox.alloy.keying.FlowType',

  [
    'ephox.alloy.alien.EditableFields',
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.keying.KeyingTypes',
    'ephox.alloy.navigation.DomMovement',
    'ephox.alloy.navigation.DomNavigation',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (EditableFields, Keys, NoState, KeyingType, KeyingTypes, DomMovement, DomNavigation, KeyMatch, KeyRules, FieldSchema, Fun, Option, Focus, SelectorFind) {
    var schema = [
      FieldSchema.strict('selector'),
      FieldSchema.defaulted('getInitial', Option.none),
      FieldSchema.defaulted('execute', KeyingTypes.defaultExecute),
      FieldSchema.defaulted('executeOnMove', false)
    ];

    var execute = function (component, simulatedEvent, flowConfig) {
      return Focus.search(component.element()).bind(function (focused) {
        return flowConfig.execute()(component, simulatedEvent, focused);
      });
    };

    var focusIn = function (component, flowConfig) {
      flowConfig.getInitial()(component).or(SelectorFind.descendant(component.element(), flowConfig.selector())).each(function (first) {
        component.getSystem().triggerFocus(first, component.element());
      });
    };

    var moveLeft = function (element, focused, info) {
      return DomNavigation.horizontal(element, info.selector(), focused, -1);
    };

    var moveRight = function (element, focused, info) {
      return DomNavigation.horizontal(element, info.selector(), focused, +1);
    };

    var doMove = function (movement) {
      return function (component, simulatedEvent, flowConfig) {
        return movement(component, simulatedEvent, flowConfig).bind(function () {
          return flowConfig.executeOnMove() ? execute(component, simulatedEvent, flowConfig) : Option.some(true);
        });
      };
    };

    var getRules = function (_) {
      return [
        KeyRules.rule(KeyMatch.inSet(Keys.LEFT().concat(Keys.UP())), doMove(DomMovement.west(moveLeft, moveRight))),
        KeyRules.rule(KeyMatch.inSet(Keys.RIGHT().concat(Keys.DOWN())), doMove(DomMovement.east(moveLeft, moveRight))),
        KeyRules.rule(KeyMatch.inSet(Keys.ENTER()), execute),
        KeyRules.rule(KeyMatch.inSet(Keys.SPACE()), execute)
      ];
    };

    var getEvents = Fun.constant({ });

    var getApis = Fun.constant({ });
    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.navigation.MatrixNavigation',

  [
    'ephox.alloy.alien.Cycles',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Struct',
    'global!Math'
  ],

  function (Cycles, Option, Struct, Math) {
    var outcome = Struct.immutableBag([ 'rowIndex', 'columnIndex', 'cell' ], [ ]);

    var toCell = function (matrix, rowIndex, columnIndex) {
      return Option.from(matrix[rowIndex]).bind(function (row) {
        return Option.from(row[columnIndex]).map(function (cell) {
          return outcome({
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            cell: cell
          });
        });
      });
    };

    var cycleHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
      var row = matrix[rowIndex];
      var colsInRow = row.length;
      var newColIndex = Cycles.cycleBy(startCol, deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };

    var cycleVertical = function (matrix, colIndex, startRow, deltaRow) {
      var nextRowIndex = Cycles.cycleBy(startRow, deltaRow, 0, matrix.length - 1);
      var colsInNextRow = matrix[nextRowIndex].length;
      var nextColIndex = Cycles.cap(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };

    var moveHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
      var row = matrix[rowIndex];
      var colsInRow = row.length;
      var newColIndex = Cycles.cap(startCol + deltaCol, 0, colsInRow - 1);
      return toCell(matrix, rowIndex, newColIndex);
    };

    var moveVertical = function (matrix, colIndex, startRow, deltaRow) {
      var nextRowIndex = Cycles.cap(startRow + deltaRow, 0, matrix.length - 1);
      var colsInNextRow = matrix[nextRowIndex].length;
      var nextColIndex = Cycles.cap(colIndex, 0, colsInNextRow - 1);
      return toCell(matrix, nextRowIndex, nextColIndex);
    };

    // return address(Math.floor(index / columns), index % columns);
    var cycleRight = function (matrix, startRow, startCol) {
      return cycleHorizontal(matrix, startRow, startCol, +1);
    };

    var cycleLeft = function (matrix, startRow, startCol) {
      return cycleHorizontal(matrix, startRow, startCol, -1);
    };

    var cycleUp = function (matrix, startRow, startCol) {
      return cycleVertical(matrix, startCol, startRow, -1);
    };

    var cycleDown = function (matrix, startRow, startCol) {
      return cycleVertical(matrix, startCol, startRow, +1);
    };

    var moveLeft = function (matrix, startRow, startCol) {
      return moveHorizontal(matrix, startRow, startCol, -1);
    };

    var moveRight = function (matrix, startRow, startCol) {
      return moveHorizontal(matrix, startRow, startCol, +1);
    };

    var moveUp = function (matrix, startRow, startCol) {
      return moveVertical(matrix, startCol, startRow, -1);
    };

    var moveDown = function (matrix, startRow, startCol) {
      return moveVertical(matrix, startCol, startRow, +1);
    };

    return {
      cycleRight: cycleRight,
      cycleLeft: cycleLeft,
      cycleUp: cycleUp,
      cycleDown: cycleDown,

      moveLeft: moveLeft,
      moveRight: moveRight,
      moveUp: moveUp,
      moveDown: moveDown
    };
  }
);
define(
  'ephox.alloy.keying.MatrixType',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.keying.KeyingTypes',
    'ephox.alloy.navigation.DomMovement',
    'ephox.alloy.navigation.DomPinpoint',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.alloy.navigation.MatrixNavigation',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (
    Keys, NoState, KeyingType, KeyingTypes, DomMovement, DomPinpoint, KeyMatch, KeyRules, MatrixNavigation, FieldSchema, Arr, Fun, Option, Focus, SelectorFilter,
    SelectorFind
  ) {
    var schema = [
      FieldSchema.strictObjOf('selectors', [
        FieldSchema.strict('row'),
        FieldSchema.strict('cell')
      ]),

      // Used to determine whether pressing right/down at the end cycles back to the start/top
      FieldSchema.defaulted('cycles', true),
      FieldSchema.defaulted('previousSelector', Option.none),
      FieldSchema.defaulted('execute', KeyingTypes.defaultExecute)
    ];

    var focusIn = function (component, matrixConfig) {
      var focused = matrixConfig.previousSelector()(component).orThunk(function () {
        var selectors = matrixConfig.selectors();
        return SelectorFind.descendant(component.element(), selectors.cell());
      });

      focused.each(function (cell) {
        component.getSystem().triggerFocus(cell, component.element());
      });
    };

    var execute = function (component, simulatedEvent, matrixConfig) {
      return Focus.search(component.element()).bind(function (focused) {
        return matrixConfig.execute()(component, simulatedEvent, focused);
      });
    };

    var toMatrix = function (rows, matrixConfig) {
      return Arr.map(rows, function (row) {
        return SelectorFilter.descendants(row, matrixConfig.selectors().cell());
      });
    };

    var doMove = function (ifCycle, ifMove) {
      return function (element, focused, matrixConfig) {
        var move = matrixConfig.cycles() ? ifCycle : ifMove;
        return SelectorFind.closest(focused, matrixConfig.selectors().row()).bind(function (inRow) {
          var cellsInRow = SelectorFilter.descendants(inRow, matrixConfig.selectors().cell());

          return DomPinpoint.findIndex(cellsInRow, focused).bind(function (colIndex) {
            var allRows = SelectorFilter.descendants(element, matrixConfig.selectors().row());
            return DomPinpoint.findIndex(allRows, inRow).bind(function (rowIndex) {
              // Now, make the matrix.
              var matrix = toMatrix(allRows, matrixConfig);
              return move(matrix, rowIndex, colIndex).map(function (next) {
                return next.cell();
              });
            });
          });
        });
      };
    };

    var moveLeft = doMove(MatrixNavigation.cycleLeft, MatrixNavigation.moveLeft);
    var moveRight = doMove(MatrixNavigation.cycleRight, MatrixNavigation.moveRight);

    var moveNorth = doMove(MatrixNavigation.cycleUp, MatrixNavigation.moveUp);
    var moveSouth = doMove(MatrixNavigation.cycleDown, MatrixNavigation.moveDown);

    var getRules = Fun.constant([
      KeyRules.rule(KeyMatch.inSet(Keys.LEFT()), DomMovement.west(moveLeft, moveRight)),
      KeyRules.rule(KeyMatch.inSet(Keys.RIGHT()), DomMovement.east(moveLeft, moveRight)),
      KeyRules.rule(KeyMatch.inSet(Keys.UP()), DomMovement.north(moveNorth)),
      KeyRules.rule(KeyMatch.inSet(Keys.DOWN()), DomMovement.south(moveSouth)),
      KeyRules.rule(KeyMatch.inSet(Keys.SPACE().concat(Keys.ENTER())), execute)
    ]);

    var getEvents = Fun.constant({ });

    var getApis = Fun.constant({ });
    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.keying.MenuType',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.keying.KeyingTypes',
    'ephox.alloy.navigation.DomMovement',
    'ephox.alloy.navigation.DomNavigation',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (Keys, NoState, KeyingType, KeyingTypes, DomMovement, DomNavigation, KeyMatch, KeyRules, FieldSchema, Fun, Option, Focus, SelectorFind) {
    var schema = [
      FieldSchema.strict('selector'),
      FieldSchema.defaulted('execute', KeyingTypes.defaultExecute),
      FieldSchema.defaulted('moveOnTab', false)
    ];

    var execute = function (component, simulatedEvent, menuConfig) {
      return menuConfig.focusManager().get(component).bind(function (focused) {
        return menuConfig.execute()(component, simulatedEvent, focused);
      });
    };

    var focusIn = function (component, menuConfig, simulatedEvent) {
      // Maybe keep selection if it was there before
      SelectorFind.descendant(component.element(), menuConfig.selector()).each(function (first) {
        menuConfig.focusManager().set(component, first);
      });
    };

    var moveUp = function (element, focused, info) {
      return DomNavigation.horizontal(element, info.selector(), focused, -1);
    };

    var moveDown = function (element, focused, info) {
      return DomNavigation.horizontal(element, info.selector(), focused, +1);
    };

    var fireShiftTab = function (component, simulatedEvent, menuConfig) {
      return menuConfig.moveOnTab() ? DomMovement.move(moveUp)(component, simulatedEvent, menuConfig) : Option.none();
    };

    var fireTab = function (component, simulatedEvent, menuConfig) {
      return menuConfig.moveOnTab() ? DomMovement.move(moveDown)(component, simulatedEvent, menuConfig) : Option.none();
    };

    var getRules = Fun.constant([
      KeyRules.rule(KeyMatch.inSet(Keys.UP()), DomMovement.move(moveUp)),
      KeyRules.rule(KeyMatch.inSet(Keys.DOWN()), DomMovement.move(moveDown)),
      KeyRules.rule(KeyMatch.and([ KeyMatch.isShift, KeyMatch.inSet(Keys.TAB()) ]), fireShiftTab),
      KeyRules.rule(KeyMatch.and([ KeyMatch.isNotShift, KeyMatch.inSet(Keys.TAB()) ]), fireTab),
      KeyRules.rule(KeyMatch.inSet(Keys.ENTER()), execute),
      KeyRules.rule(KeyMatch.inSet(Keys.SPACE()), execute)
    ]);

    var getEvents = Fun.constant({ });

    var getApis = Fun.constant({ });

    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.keying.SpecialType',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.data.Fields',
    'ephox.alloy.keying.KeyingType',
    'ephox.alloy.navigation.KeyMatch',
    'ephox.alloy.navigation.KeyRules',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option'
  ],

  function (Keys, NoState, Fields, KeyingType, KeyMatch, KeyRules, FieldSchema, Fun, Option) {
    var schema = [
      Fields.onKeyboardHandler('onSpace'),
      Fields.onKeyboardHandler('onEnter'),
      Fields.onKeyboardHandler('onShiftEnter'),
      Fields.onKeyboardHandler('onLeft'),
      Fields.onKeyboardHandler('onRight'),
      Fields.onKeyboardHandler('onTab'),
      Fields.onKeyboardHandler('onShiftTab'),
      Fields.onKeyboardHandler('onUp'),
      Fields.onKeyboardHandler('onDown'),
      Fields.onKeyboardHandler('onEscape'),
      FieldSchema.option('focusIn')
    ];

    var getRules = function (component, simulatedEvent, executeInfo) {
      return [
        KeyRules.rule(KeyMatch.inSet(Keys.SPACE()), executeInfo.onSpace()),
        KeyRules.rule(
          KeyMatch.and([ KeyMatch.isNotShift, KeyMatch.inSet(Keys.ENTER()) ]), executeInfo.onEnter()
        ),
        KeyRules.rule(
          KeyMatch.and([ KeyMatch.isShift, KeyMatch.inSet(Keys.ENTER()) ]), executeInfo.onShiftEnter()
        ),
        KeyRules.rule(
          KeyMatch.and([ KeyMatch.isShift, KeyMatch.inSet(Keys.TAB()) ]), executeInfo.onShiftTab()
        ),
        KeyRules.rule(
          KeyMatch.and([ KeyMatch.isNotShift, KeyMatch.inSet(Keys.TAB()) ]), executeInfo.onTab()
        ),

        KeyRules.rule(KeyMatch.inSet(Keys.UP()), executeInfo.onUp()),
        KeyRules.rule(KeyMatch.inSet(Keys.DOWN()), executeInfo.onDown()),
        KeyRules.rule(KeyMatch.inSet(Keys.LEFT()), executeInfo.onLeft()),
        KeyRules.rule(KeyMatch.inSet(Keys.RIGHT()), executeInfo.onRight()),
        KeyRules.rule(KeyMatch.inSet(Keys.SPACE()), executeInfo.onSpace()),
        KeyRules.rule(KeyMatch.inSet(Keys.ESCAPE()), executeInfo.onEscape())
      ];
    };

    var focusIn = function (component, executeInfo) {
      return executeInfo.focusIn().bind(function (f) {
        return f(component, executeInfo);
      });
    };

    var getEvents = Fun.constant({ });
    var getApis = Fun.constant({ });

    return KeyingType.typical(schema, NoState.init, getRules, getEvents, getApis, Option.some(focusIn));
  }
);
define(
  'ephox.alloy.behaviour.keyboard.KeyboardBranches',

  [
    'ephox.alloy.keying.CyclicType',
    'ephox.alloy.keying.ExecutionType',
    'ephox.alloy.keying.FlatgridType',
    'ephox.alloy.keying.FlowType',
    'ephox.alloy.keying.MatrixType',
    'ephox.alloy.keying.MenuType',
    'ephox.alloy.keying.SpecialType'
  ],

  function (CyclicType, ExecutionType, FlatgridType, FlowType, MatrixType, MenuType, SpecialType) {
    return {
      cyclic: CyclicType.schema(),
      flow: FlowType.schema(),
      flatgrid: FlatgridType.schema(),
      matrix: MatrixType.schema(),
      execution: ExecutionType.schema(),
      menu: MenuType.schema(),
      special: SpecialType.schema()
    };
  }
);
define(
  'ephox.alloy.api.behaviour.Keying',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.keyboard.KeyboardBranches',
    'ephox.alloy.behaviour.keyboard.KeyingState',
    'ephox.boulder.api.Objects',
    'global!console'
  ],

  function (Behaviour, KeyboardBranches, KeyingState, Objects, console) {
    // These APIs are going to be interesting because they are not
    // available for all keying modes
    return Behaviour.createModes({
      branchKey: 'mode',
      branches: KeyboardBranches,
      name: 'keying',
      active: {
        events: function (keyingConfig, keyingState) {
          var handler = keyingConfig.handler();
          return handler.toEvents(keyingConfig, keyingState);
        }
      },
      apis: {
        focusIn: function (component/*, keyConfig, keyState */) {
          component.getSystem().triggerFocus(component.element(), component.element());
        },

        // These APIs are going to be interesting because they are not
        // available for all keying modes
        setGridSize: function (component, keyConfig, keyState, numRows, numColumns) {
          if (! Objects.hasKey(keyState, 'setGridSize')) {
            console.error('Layout does not support setGridSize');
          } else {
            keyState.setGridSize(numRows, numColumns);
          }
        }
      },
      state: KeyingState
    });
  }
);
define(
  'ephox.alloy.api.ui.GuiTypes',

  [
    'ephox.alloy.debugging.FunctionAnnotator',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Id',
    'global!Array'
  ],

  function (FunctionAnnotator, Objects, Arr, Fun, Id, Array) {
    var premadeTag = Id.generate('alloy-premade');
    var apiConfig = Id.generate('api');


    var premade = function (comp) {
      return Objects.wrap(premadeTag, comp);
    };

    var getPremade = function (spec) {
      return Objects.readOptFrom(spec, premadeTag);
    };

    var makeApi = function (f) {
      return FunctionAnnotator.markAsSketchApi(function (component/*, ... */) {
        var args = Array.prototype.slice.call(arguments, 0);
        var spi = component.config(apiConfig);
        return f.apply(undefined, [ spi ].concat(args));
      }, f);
    };

    return {
      apiConfig: Fun.constant(apiConfig),
      makeApi: makeApi,
      premade: premade,
      getPremade: getPremade
    };
  }
);
define(
  'ephox.alloy.parts.PartType',

  [
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Option'
  ],

  function (FieldPresence, FieldSchema, ValueSchema, Adt, Fun, Id, Option) {
    var adt = Adt.generate([
      { required: [ 'data' ] },
      { external: [ 'data' ] },
      { optional: [ 'data' ] },
      { group: [ 'data' ] }
    ]);

    var fFactory = FieldSchema.defaulted('factory', { sketch: Fun.identity });
    var fSchema = FieldSchema.defaulted('schema', [ ]);
    var fName = FieldSchema.strict('name');
    var fPname = FieldSchema.field(
      'pname',
      'pname',
      FieldPresence.defaultedThunk(function (typeSpec) {
        return '<alloy.' + Id.generate(typeSpec.name) + '>';
      }),
      ValueSchema.anyValue()
    );

    var fDefaults = FieldSchema.defaulted('defaults', Fun.constant({ }));
    var fOverrides = FieldSchema.defaulted('overrides', Fun.constant({ }));

    var requiredSpec = ValueSchema.objOf([
      fFactory, fSchema, fName, fPname, fDefaults, fOverrides
    ]);

    var externalSpec = ValueSchema.objOf([
      fFactory, fSchema, fName, fDefaults, fOverrides
    ]);

    var optionalSpec = ValueSchema.objOf([
      fFactory, fSchema, fName, fPname, fDefaults, fOverrides
    ]);

    var groupSpec = ValueSchema.objOf([
      fFactory, fSchema, fName,
      FieldSchema.strict('unit'),
      fPname, fDefaults, fOverrides
    ]);

    var asNamedPart = function (part) {
      return part.fold(Option.some, Option.none, Option.some, Option.some);
    };

    var name = function (part) {
      var get = function (data) {
        return data.name();
      };

      return part.fold(get, get, get, get);
    };

    var asCommon = function (part) {
      return part.fold(Fun.identity, Fun.identity, Fun.identity, Fun.identity);
    };

    var convert = function (adtConstructor, partSpec) {
      return function (spec) {
        var data = ValueSchema.asStructOrDie('Converting part type', partSpec, spec);
        return adtConstructor(data);
      };
    };

    return {
      required: convert(adt.required, requiredSpec),
      external: convert(adt.external, externalSpec),
      optional: convert(adt.optional, optionalSpec),
      group: convert(adt.group, groupSpec),
      asNamedPart: asNamedPart,
      name: name,
      asCommon: asCommon,

      original: Fun.constant('entirety')
    };
  }
);
define(
  'ephox.alloy.spec.UiSubstitutes',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Merger',
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Adt',
    'global!Error'
  ],

  function (Objects, Arr, Obj, Merger, Json, Fun, Adt, Error) {
    var placeholder = 'placeholder';

    var adt = Adt.generate([
      { single: [ 'required', 'valueThunk' ] },
      { multiple: [ 'required', 'valueThunks' ] }
    ]);

    var isSubstitute = function (uiType) {
      return Arr.contains([
        placeholder
      ], uiType);
    };

    var subPlaceholder = function (owner, detail, compSpec, placeholders) {
      if (owner.exists(function (o) { return o !== compSpec.owner; })) return adt.single(true, Fun.constant(compSpec));
      // Ignore having to find something for the time being.
      return Objects.readOptFrom(placeholders, compSpec.name).fold(function () {
        throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' +
          Obj.keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + Json.stringify(compSpec, null, 2)
        );
      }, function (newSpec) {
        // Must return a single/multiple type
        return newSpec.replace();
      });
    };

    var scan = function (owner, detail, compSpec, placeholders) {
      if (compSpec.uiType === placeholder) return subPlaceholder(owner, detail, compSpec, placeholders);
      else return adt.single(false, Fun.constant(compSpec));
    };

    var substitute = function (owner, detail, compSpec, placeholders) {
      var base = scan(owner, detail, compSpec, placeholders);

      return base.fold(
        function (req, valueThunk) {
          var value = valueThunk(detail, compSpec.config, compSpec.validated);
          var childSpecs = Objects.readOptFrom(value, 'components').getOr([ ]);
          var substituted = Arr.bind(childSpecs, function (c) {
            return substitute(owner, detail, c, placeholders);
          });
          return [
            Merger.deepMerge(value, {
              components: substituted
            })
          ];
        },
        function (req, valuesThunk) {
          var values = valuesThunk(detail, compSpec.config, compSpec.validated);
          return values;
        }
      );
    };

    var substituteAll = function (owner, detail, components, placeholders) {
      return Arr.bind(components, function (c) {
        return substitute(owner, detail, c, placeholders);
      });
    };

    var oneReplace = function (label, replacements) {
      var called = false;

      var used = function () {
        return called;
      };

      var replace = function () {
        if (called === true) throw new Error(
          'Trying to use the same placeholder more than once: ' + label
        );
        called = true;
        return replacements;
      };

      var required = function () {
        return replacements.fold(function (req, _) {
          return req;
        }, function (req, _) {
          return req;
        });
      };

      return {
        name: Fun.constant(label),
        required: required,
        used: used,
        replace: replace
      };
    };

    var substitutePlaces = function (owner, detail, components, placeholders) {
      var ps = Obj.map(placeholders, function (ph, name) {
        return oneReplace(name, ph);
      });

      var outcome = substituteAll(owner, detail, components, ps);

      Obj.each(ps, function (p) {
        if (p.used() === false && p.required()) {
          throw new Error(
            'Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' +
            Json.stringify(detail.components(), null, 2)
          );
        }
      });

      return outcome;
    };

    var singleReplace = function (detail, p) {
      var replacement = p;
      return replacement.fold(function (req, valueThunk) {
        return [ valueThunk(detail) ];
      }, function (req, valuesThunk) {
        return valuesThunk(detail);
      });
    };

    return {
      single: adt.single,
      multiple: adt.multiple,
      isSubstitute: isSubstitute,
      placeholder: Fun.constant(placeholder),
      substituteAll: substituteAll,
      substitutePlaces: substitutePlaces,

      singleReplace: singleReplace
    };
  }
);
define(
  'ephox.alloy.parts.PartSubstitutes',

  [
    'ephox.alloy.parts.PartType',
    'ephox.alloy.spec.UiSubstitutes',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger'
  ],

  function (PartType, UiSubstitutes, Objects, Arr, Fun, Merger) {
    var combine = function (detail, data, partSpec, partValidated) {
      var spec = partSpec;

      return Merger.deepMerge(
        data.defaults()(detail, partSpec, partValidated),
        partSpec,
        { uid: detail.partUids()[data.name()] },
        data.overrides()(detail, partSpec, partValidated),
        {
          'debug.sketcher': Objects.wrap('part-' + data.name(), spec)
        }
      );
    };

    var subs = function (owner, detail, parts) {
      var internals = { };
      var externals = { };

      Arr.each(parts, function (part) {
        part.fold(
          // Internal
          function (data) {
            internals[data.pname()] = UiSubstitutes.single(true, function (detail, partSpec, partValidated) {
              return data.factory().sketch(
                combine(detail, data, partSpec, partValidated)
              );
            });
          },

          // External
          function (data) {
            var partSpec = detail.parts()[data.name()]();
            externals[data.name()] = Fun.constant(
              combine(detail, data, partSpec[PartType.original()]())
            );
            // no placeholders
          },

          // Optional
          function (data) {
            internals[data.pname()] = UiSubstitutes.single(false, function (detail, partSpec, partValidated) {
              return data.factory().sketch(
                combine(detail, data, partSpec, partValidated)
              );
            });
          },

          // Group
          function (data) {
            internals[data.pname()] = UiSubstitutes.multiple(true, function (detail, _partSpec, _partValidated) {
              var units = detail[data.name()]();
              return Arr.map(units, function (u) {
                // Group multiples do not take the uid because there is more than one.
                return data.factory().sketch(
                  Merger.deepMerge(
                    data.defaults()(detail, u),
                    u,
                    data.overrides()(detail, u)
                  )
                );
              });
            });
          }
        );
      });

      return {
        internals: Fun.constant(internals),
        externals: Fun.constant(externals)
      };
    };

    return {
      subs: subs
    };
  }
);

define(
  'ephox.alloy.parts.AlloyParts',

  [
    'ephox.alloy.data.Fields',
    'ephox.alloy.parts.PartSubstitutes',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.spec.UiSubstitutes',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option'
  ],

  function (Fields, PartSubstitutes, PartType, UiSubstitutes, FieldPresence, FieldSchema, Objects, ValueSchema, Arr, Fun, Merger, Obj, Option) {
    // TODO: Make more functional if performance isn't an issue.
    var generate = function (owner, parts) {
      var r = { };

      Arr.each(parts, function (part) {
        PartType.asNamedPart(part).each(function (np) {
          var g = doGenerateOne(owner, np.pname());
          r[np.name()] = function (config) {
            var validated = ValueSchema.asRawOrDie('Part: ' + np.name() + ' in ' + owner, ValueSchema.objOf(np.schema()), config);
            return Merger.deepMerge(g, {
              config: config,
              validated: validated
            });
          };
        });
      });

      return r;
    };

    // Does not have the config.
    var doGenerateOne = function (owner, pname) {
      return {
        uiType: UiSubstitutes.placeholder(),
        owner: owner,
        name: pname
      };
    };

    var generateOne = function (owner, pname, config) {
      return {
        uiType: UiSubstitutes.placeholder(),
        owner: owner,
        name: pname,
        config: config,
        validated: { }
      };
    };

    var schemas = function (parts) {
      // This actually has to change. It needs to return the schemas for things that will
      // not appear in the components list, which is only externals
      return Arr.bind(parts, function (part) {
        return part.fold(
          Option.none,
          Option.some,
          Option.none,
          Option.none
        ).map(function (data) {
          return FieldSchema.strictObjOf(data.name(), data.schema().concat([
            Fields.snapshot(PartType.original())
          ]));
        }).toArray();
      });
    };

    var names = function (parts) {
      return Arr.map(parts, PartType.name);
    };

    var substitutes = function (owner, detail, parts) {
      return PartSubstitutes.subs(owner, detail, parts);
    };

    var components = function (owner, detail, internals) {
      return UiSubstitutes.substitutePlaces(Option.some(owner), detail, detail.components(), internals);
    };

    var getPart = function (component, detail, partKey) {
      var uid = detail.partUids()[partKey];
      return component.getSystem().getByUid(uid).toOption();
    };

    var getPartOrDie = function (component, detail, partKey) {
      return getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
    };

    var getParts = function (component, detail, partKeys) {
      var r = { };
      var uids = detail.partUids();

      var system = component.getSystem();
      Arr.each(partKeys, function (pk) {
        r[pk] = system.getByUid(uids[pk]);
      });

      // Structing
      return Obj.map(r, Fun.constant);
    };

    var getAllParts = function (component, detail) {
      var system = component.getSystem();
      return Obj.map(detail.partUids(), function (pUid, k) {
        return Fun.constant(system.getByUid(pUid));
      });
    };

    var getPartsOrDie = function (component, detail, partKeys) {
      var r = { };
      var uids = detail.partUids();

      var system = component.getSystem();
      Arr.each(partKeys, function (pk) {
        r[pk] = system.getByUid(uids[pk]).getOrDie();
      });

      // Structing
      return Obj.map(r, Fun.constant);
    };
    
    var defaultUids = function (baseUid, partTypes) {
      var partNames = names(partTypes);

      return Objects.wrapAll(
        Arr.map(partNames, function (pn) { 
          return { key: pn, value: baseUid + '-' + pn };
        })
      );
    };

    var defaultUidsSchema = function (partTypes) {
      return FieldSchema.field(
        'partUids',
        'partUids',
        FieldPresence.mergeWithThunk(function (spec) {
          return defaultUids(spec.uid, partTypes);
        }),
        ValueSchema.anyValue()
      );
    };

    return {
      generate: generate,
      generateOne: generateOne,
      schemas: schemas,
      names: names,
      substitutes: substitutes,
      components: components,

      defaultUids: defaultUids,
      defaultUidsSchema: defaultUidsSchema,

      getAllParts: getAllParts,
      getPart: getPart,
      getPartOrDie: getPartOrDie,
      getParts: getParts,
      getPartsOrDie: getPartsOrDie
    };
  }
);

define(
  'ephox.alloy.spec.SpecSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.alloy.spec.UiSubstitutes',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.sand.api.JSON',
    'global!Error'
  ],

  function (Fields, UiSubstitutes, FieldSchema, Objects, ValueSchema, Arr, Fun, Merger, Obj, Json, Error) {
    var getPartsSchema = function (partNames, _optPartNames, _owner) {
      var owner = _owner !== undefined ? _owner : 'Unknown owner';
      var fallbackThunk = function () {
        return [
          Fields.output('partUids', { })
        ];
      };

      var optPartNames = _optPartNames !== undefined ? _optPartNames : fallbackThunk();
      if (partNames.length === 0 && optPartNames.length === 0) return fallbackThunk();

      // temporary hacking
      var partsSchema = FieldSchema.strictObjOf(
        'parts',
        Arr.flatten([
          Arr.map(partNames, FieldSchema.strict),
          Arr.map(optPartNames, function (optPart) {
            return FieldSchema.defaulted(optPart, UiSubstitutes.single(false, function () {
              throw new Error('The optional part: ' + optPart + ' was not specified in the config, but it was used in components');
            }));
          })
        ])
      );

      var partUidsSchema = FieldSchema.state(
        'partUids',
        function (spec) {
          if (! Objects.hasKey(spec, 'parts')) {
            throw new Error(
              'Part uid definition for owner: ' + owner + ' requires "parts"\nExpected parts: ' + partNames.join(', ') + '\nSpec: ' +
              Json.stringify(spec, null, 2)
            );
          }
          var uids = Obj.map(spec.parts, function (v, k) {
            return Objects.readOptFrom(v, 'uid').getOrThunk(function () {
              return spec.uid + '-' + k;
            });
          });
          return uids;
        }
      );

      return [ partsSchema, partUidsSchema ];
    };

    var getPartUidsSchema = function (label, spec) {
      return FieldSchema.state(
        'partUids',
        function (spec) {
          if (! Objects.hasKey(spec, 'parts')) {
            throw new Error(
              'Part uid definition for owner: ' + label + ' requires "parts\nSpec: ' +
              Json.stringify(spec, null, 2)
            );
          }
          var uids = Obj.map(spec.parts, function (v, k) {
            return Objects.readOptFrom(v, 'uid').getOrThunk(function () {
              return spec.uid + '-' + k;
            });
          });
          return uids;
        }
      );
    };

    var base = function (label, partSchemas, partUidsSchemas, spec) {
      var ps = partSchemas.length > 0 ? [
        FieldSchema.strictObjOf('parts', partSchemas)
      ] : [ ];

      return ps.concat([
        FieldSchema.strict('uid'),
        FieldSchema.defaulted('dom', { }), // Maybe get rid of.
        FieldSchema.defaulted('components', [ ]),
        Fields.snapshot('originalSpec'),
        FieldSchema.defaulted('debug.sketcher', { })
      ]).concat(partUidsSchemas);
    };


    var asRawOrDie = function (label, schema, spec, partSchemas) {

      var baseS = base(label, partSchemas, spec);
      return ValueSchema.asRawOrDie(label + ' [SpecSchema]', ValueSchema.objOfOnly(baseS.concat(schema)), spec);
    };

    var asStructOrDie = function (label, schema, spec, partSchemas, partUidsSchemas) {
      var baseS = base(label, partSchemas, partUidsSchemas, spec);
      return ValueSchema.asStructOrDie(label + ' [SpecSchema]', ValueSchema.objOfOnly(baseS.concat(schema)), spec);
    };

    var extend = function (builder, original, nu) {
      // Merge all at the moment.
      var newSpec = Merger.deepMerge(original, nu);
      return builder(newSpec);
    };

    var addBehaviours = function (original, behaviours) {
      return Merger.deepMerge(original, behaviours);
    };


    return {
      asRawOrDie: asRawOrDie,
      asStructOrDie: asStructOrDie,
      addBehaviours: addBehaviours,

      getPartsSchema: getPartsSchema,
      extend: extend
    };
  }
);
define(
  'ephox.alloy.api.ui.UiSketcher',

  [
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.registry.Tagger',
    'ephox.alloy.spec.SpecSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Merger'
  ],

  function (AlloyParts, Tagger, SpecSchema, Objects, Merger) {
    var single = function (owner, schema, factory, spec) {
      var specWithUid = supplyUid(spec);
      var detail = SpecSchema.asStructOrDie(owner, schema, specWithUid, [ ], [ ]);
      return Merger.deepMerge(
        factory(detail, specWithUid),
        { 'debug.sketcher': Objects.wrap(owner, spec) }
      );
    };

    var composite = function (owner, schema, partTypes, factory, spec) {
      var specWithUid = supplyUid(spec);

      // Identify any information required for external parts
      var partSchemas = AlloyParts.schemas(partTypes);

      // Generate partUids for all parts (external and otherwise)
      var partUidsSchema = AlloyParts.defaultUidsSchema(partTypes);

      var detail = SpecSchema.asStructOrDie(owner, schema, specWithUid, partSchemas, [ partUidsSchema ]);

      // Create (internals, externals) substitutions
      var subs = AlloyParts.substitutes(owner, detail, partTypes);

      // Work out the components by substituting internals
      var components = AlloyParts.components(owner, detail, subs.internals());

      return Merger.deepMerge(
        // Pass through the substituted components and the externals
        factory(detail, components, specWithUid, subs.externals()),
        { 'debug.sketcher': Objects.wrap(owner, spec) }
      );
    };


    var supplyUid = function (spec) {
      return Merger.deepMerge(
        {
          uid: Tagger.generate('uid')
        }, spec
      );
    };

    return {
      supplyUid: supplyUid,
      single: single,
      composite: composite
    };
  }
);
define(
  'ephox.alloy.api.ui.Sketcher',

  [
    'ephox.alloy.api.ui.GuiTypes',
    'ephox.alloy.api.ui.UiSketcher',
    'ephox.alloy.debugging.FunctionAnnotator',
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.parts.PartType',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj'
  ],

  function (GuiTypes, UiSketcher, FunctionAnnotator, AlloyParts, PartType, FieldSchema, ValueSchema, Fun, Merger, Obj) {
    var singleSchema = ValueSchema.objOfOnly([
      FieldSchema.strict('name'),
      FieldSchema.strict('factory'),
      FieldSchema.strict('configFields'),
      FieldSchema.defaulted('apis', { }),
      FieldSchema.defaulted('extraApis', { })
    ]);

    var compositeSchema = ValueSchema.objOfOnly([
      FieldSchema.strict('name'),
      FieldSchema.strict('factory'),
      FieldSchema.strict('configFields'),
      FieldSchema.strict('partFields'),
      FieldSchema.defaulted('apis', { }),
      FieldSchema.defaulted('extraApis', { })
    ]);

    var single = function (rawConfig) {
      var config = ValueSchema.asRawOrDie('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);

      var sketch = function (spec) {
        return UiSketcher.single(config.name, config.configFields, config.factory, spec);
      };

      var apis = Obj.map(config.apis, GuiTypes.makeApi);
      var extraApis = Obj.map(config.extraApis, function (f, k) {
        return FunctionAnnotator.markAsExtraApi(f, k);
      });

      return Merger.deepMerge(
        {
          name: Fun.constant(config.name),
          partFields: Fun.constant([ ]),
          configFields: Fun.constant(config.configFields),

          sketch: sketch
        },
        apis,
        extraApis
      );
    };

    var composite = function (rawConfig) {
      var config = ValueSchema.asRawOrDie('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);

      var sketch = function (spec) {
        return UiSketcher.composite(config.name, config.configFields, config.partFields, config.factory, spec);
      };

      // These are constructors that will store their configuration.
      var parts = AlloyParts.generate(config.name, config.partFields);

      var apis = Obj.map(config.apis, GuiTypes.makeApi);
      var extraApis = Obj.map(config.extraApis, function (f, k) {
        return FunctionAnnotator.markAsExtraApi(f, k);
      });

      return Merger.deepMerge(
        {
          name: Fun.constant(config.name),
          partFields: Fun.constant(config.partFields),
          configFields: Fun.constant(config.configFields),
          sketch: sketch,
          parts: Fun.constant(parts)
        },
        apis,
        extraApis
      );
    };

    return {
      single: single,
      composite: composite
    };
  }
);

define(
  'ephox.alloy.ui.common.ButtonBase',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.katamari.api.Arr',
    'ephox.sand.api.PlatformDetection'
  ],

  function (AlloyEvents, AlloyTriggers, NativeEvents, SystemEvents, Arr, PlatformDetection) {
    var events = function (optAction) {
      var executeHandler = function (action) {
        return AlloyEvents.run(SystemEvents.execute(), function (component, simulatedEvent) {
          action(component);
          simulatedEvent.stop();
        });
      };

      var onClick = function (component, simulatedEvent) {
        simulatedEvent.stop();
        AlloyTriggers.emitExecute(component);
      };

      // Other mouse down listeners above this one should not get mousedown behaviour (like dragging)
      var onMousedown = function (component, simulatedEvent) {
        simulatedEvent.cut();
      };

      var pointerEvents = PlatformDetection.detect().deviceType.isTouch() ? [
        AlloyEvents.run(SystemEvents.tap(), onClick)
      ] : [
        AlloyEvents.run(NativeEvents.click(), onClick),
        AlloyEvents.run(NativeEvents.mousedown(), onMousedown)
      ];

      return AlloyEvents.derive(
        Arr.flatten([
          // Only listen to execute if it is supplied
          optAction.map(executeHandler).toArray(),
          pointerEvents
        ])
      );
    };

    return {
      events: events
    };
  }
);
define(
  'ephox.alloy.api.ui.Button',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.common.ButtonBase',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Merger'
  ],

  function (Behaviour, Focusing, Keying, Sketcher, ButtonBase, FieldSchema, Merger) {
    var factory = function (detail, spec) {
      var events = ButtonBase.events(detail.action());

      return {
        uid: detail.uid(),
        dom: detail.dom(),
        components: detail.components(),
        events: events,
        behaviours: Merger.deepMerge(
          Behaviour.derive([
            Focusing.config({ }),
            Keying.config({
              mode: 'execution',
              useSpace: true,
              useEnter: true
            })
          ]),
          detail.buttonBehaviours()
        ),
        domModification: {
          attributes: {
            type: 'button',
            role: detail.role().getOr('button')
          }
        },
        eventOrder: detail.eventOrder()
      };
    };

    return Sketcher.single({
      name: 'Button',
      factory: factory,
      configFields: [
        FieldSchema.defaulted('uid', undefined),
        FieldSchema.strict('dom'),
        FieldSchema.defaulted('components', [ ]),
        FieldSchema.defaulted('buttonBehaviours', { }),
        FieldSchema.option('action'),
        FieldSchema.option('role'),
        FieldSchema.defaulted('eventOrder', { })
      ]
    });
  }
);
define(
  'ephox.alloy.api.component.DomFactory',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Merger',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.properties.Html',
    'ephox.sugar.api.search.Traverse',
    'global!Array'
  ],

  function (Objects, Arr, Merger, Element, Node, Html, Traverse, Array) {
    var getAttrs = function (elem) {
      var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [ ];
      return Arr.foldl(attributes, function (b, attr) {
        // Make class go through the class path. Do not list it as an attribute.
        if (attr.name === 'class') return b;
        else return Merger.deepMerge(b, Objects.wrap(attr.name, attr.value));
      }, {});
    };

    var getClasses = function (elem) {
      return Array.prototype.slice.call(elem.dom().classList, 0);
    };

    var fromHtml = function (html) {
      var elem = Element.fromHtml(html);

      var children = Traverse.children(elem);
      var attrs = getAttrs(elem);
      var classes = getClasses(elem);
      var contents = children.length === 0 ? { } : { innerHtml: Html.get(elem) };

      return Merger.deepMerge({
        tag: Node.name(elem),
        classes: classes,
        attributes: attrs
      }, contents);
    };

    var sketch = function (sketcher, html, config) {
      return sketcher.sketch(
        Merger.deepMerge({
          dom: fromHtml(html)
        }, config)
      );
    };

    return {
      fromHtml: fromHtml,
      sketch: sketch
    };
  }
);

define(
  'tinymce.themes.mobile.util.UiDomFactory',

  [
    'ephox.alloy.api.component.DomFactory',
    'ephox.katamari.api.Strings',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (DomFactory, Strings, Styles) {
    var dom = function (rawHtml) {
      var html = Strings.supplant(rawHtml, {
        'prefix': Styles.prefix()
      });
      return DomFactory.fromHtml(html);
    };

    var spec = function (rawHtml) {
      var sDom = dom(rawHtml);
      return {
        dom: sDom
      };
    };

    return {
      dom: dom,
      spec: spec
    };
  }
);

define(
  'tinymce.themes.mobile.ui.Buttons',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.behaviour.Unselecting',
    'ephox.alloy.api.ui.Button',
    'ephox.katamari.api.Merger',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (Behaviour, Toggling, Unselecting, Button, Merger, Receivers, Styles, UiDomFactory) {
    var forToolbarCommand = function (editor, command) {
      return forToolbar(command, function () {
        editor.execCommand(command);
      }, { });
    };

    var getToggleBehaviours = function (command) {
      return Behaviour.derive([
        Toggling.config({
          toggleClass: Styles.resolve('toolbar-button-selected'),
          toggleOnExecute: false,
          aria: {
            mode: 'pressed'
          }
        }),
        Receivers.format(command, function (button, status) {
          var toggle = status ? Toggling.on : Toggling.off;
          toggle(button);
        })
      ]);
    };

    var forToolbarStateCommand = function (editor, command) {
      var extraBehaviours = getToggleBehaviours(command);

      return forToolbar(command, function () {
        editor.execCommand(command);
      }, extraBehaviours);
    };

    // The action is not just executing the same command
    var forToolbarStateAction = function (editor, clazz, command, action) {
      var extraBehaviours = getToggleBehaviours(command);
      return forToolbar(clazz, action, extraBehaviours);
    };

    var forToolbar = function (clazz, action, extraBehaviours) {
      return Button.sketch({
        dom: UiDomFactory.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-' + clazz + ' ${prefix}-icon"></span>'),
        action: action,

        buttonBehaviours: Merger.deepMerge(
          Behaviour.derive([
            Unselecting.config({ })
          ]),
          extraBehaviours
        )
      });
    };

    return {
      forToolbar: forToolbar,
      forToolbarCommand: forToolbarCommand,
      forToolbarStateAction: forToolbarStateAction,
      forToolbarStateCommand: forToolbarStateCommand
    };
  }
);
define(
  'ephox.alloy.ui.slider.SliderModel',

  [
    'global!Math'
  ],

  function (Math) {
    var reduceBy = function (value, min, max, step) {
      if (value < min) return value;
      else if (value > max) return max;
      else if (value === min) return min - 1;
      else return Math.max(min, value - step);
    };

    var increaseBy = function (value, min, max, step) {
      if (value > max) return value;
      else if (value < min) return min;
      else if (value === max) return max + 1;
      else return Math.min(max, value + step);
    };

    var capValue = function (value, min, max) {
      return Math.max(
        min,
        Math.min(max, value)
      );
    };

    var snapValueOfX = function (bounds, value, min, max, step, snapStart) {
      // We are snapping by the step size. Therefore, find the nearest multiple of
      // the step
      return snapStart.fold(function () {
        // There is no initial snapping start, so just go from the minimum
        var initValue = value - min;
        var extraValue = Math.round(initValue / step) * step;
        return capValue(min + extraValue, min - 1, max + 1);
      }, function (start) {
        // There is an initial snapping start, so using that as the starting point,
        // calculate the nearest snap position based on the value
        var remainder = (value - start) % step;
        var adjustment = Math.round(remainder / step);


        var rawSteps = Math.floor((value - start) / step);
        var maxSteps = Math.floor((max - start) / step);

        var numSteps = Math.min(maxSteps, rawSteps + adjustment);
        var r = start + (numSteps * step);
        return Math.max(start, r);
      });
    };

    var findValueOfX = function (bounds, min, max, xValue, step, snapToGrid, snapStart) {
      var range = max - min;
      // TODO: TM-26 Make this bounding of edges work only occur if there are edges (and work with snapping)
      if (xValue < bounds.left) return min - 1;
      else if (xValue > bounds.right) return max + 1;
      else {
        var xOffset = Math.min(bounds.right, Math.max(xValue, bounds.left)) - bounds.left;
        var newValue = capValue(((xOffset / bounds.width) * range) + min, min - 1, max + 1);
        var roundedValue = Math.round(newValue);
        return snapToGrid && newValue >= min && newValue <= max ? snapValueOfX(bounds, newValue, min, max, step, snapStart) : roundedValue;
      }
    };


    return {
      reduceBy: reduceBy,
      increaseBy: increaseBy,
      findValueOfX: findValueOfX
    };
  }
);
define(
  'ephox.alloy.ui.slider.SliderActions',

  [
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.ui.slider.SliderModel',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sand.api.PlatformDetection',
    'global!Math'
  ],

  function (AlloyTriggers, SliderModel, Fun, Option, PlatformDetection, Math) {
    var changeEvent = 'slider.change.value';

    var isTouch = PlatformDetection.detect().deviceType.isTouch();

    var getEventSource = function (simulatedEvent) {
      var evt = simulatedEvent.event().raw();
      if (isTouch && evt.touches !== undefined && evt.touches.length === 1) return Option.some(evt.touches[0]);
      else if (isTouch && evt.touches !== undefined) return Option.none();
      else if (! isTouch && evt.clientX !== undefined) return Option.some(evt);
      else return Option.none();
    };

    var getEventX = function (simulatedEvent) {
      var spot = getEventSource(simulatedEvent);
      return spot.map(function (s) {
        return s.clientX;
      });
    };

    var fireChange = function (component, value) {
      AlloyTriggers.emitWith(component, changeEvent, { value: value });
    };

    var moveRightFromLedge = function (ledge, detail) {
      fireChange(ledge, detail.min(), Option.none());
    };

    var moveLeftFromRedge = function (redge, detail) {
      fireChange(redge, detail.max(), Option.none());
    };

    var setToRedge = function (redge, detail) {
      fireChange(redge, detail.max() + 1, Option.none());
    };

    var setToLedge = function (ledge, detail) {
      fireChange(ledge, detail.min() - 1, Option.none());
    };

    var setToX = function (spectrum, spectrumBounds, detail, xValue) {
      var value = SliderModel.findValueOfX(
        spectrumBounds, detail.min(), detail.max(),
        xValue, detail.stepSize(), detail.snapToGrid(), detail.snapStart()
      );

      fireChange(spectrum, value);
    };

    var setXFromEvent = function (spectrum, detail, spectrumBounds, simulatedEvent) {
      return getEventX(simulatedEvent).map(function (xValue) {
        setToX(spectrum, spectrumBounds, detail, xValue);
        return xValue;
      });
    };

    var moveLeft = function (spectrum, detail) {
      var newValue = SliderModel.reduceBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
      fireChange(spectrum, newValue, Option.none());
    };

    var moveRight = function (spectrum, detail) {
      var newValue = SliderModel.increaseBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
      fireChange(spectrum, newValue, Option.none());
    };


    return {
      setXFromEvent: setXFromEvent,
      setToLedge: setToLedge,
      setToRedge: setToRedge,
      moveLeftFromRedge: moveLeftFromRedge,
      moveRightFromLedge: moveRightFromLedge,
      moveLeft: moveLeft,
      moveRight: moveRight,

      changeEvent: Fun.constant(changeEvent)
    };
  }
);
define(
  'ephox.alloy.ui.slider.SliderParts',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.ui.slider.SliderActions',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sand.api.PlatformDetection'
  ],

  function (Behaviour, Focusing, Keying, AlloyEvents, NativeEvents, PartType, SliderActions, FieldSchema, Cell, Fun, Option, PlatformDetection) {
    var platform = PlatformDetection.detect();
    var isTouch = platform.deviceType.isTouch();

    var edgePart = function (name, action) {
      return PartType.optional({
        name: '' + name + '-edge',
        overrides: function (detail) {
          var touchEvents = AlloyEvents.derive([
            AlloyEvents.runActionExtra(NativeEvents.touchstart(), action, [ detail ])
          ]);

          var mouseEvents = AlloyEvents.derive([
            AlloyEvents.runActionExtra(NativeEvents.mousedown(), action, [ detail ]),
            AlloyEvents.runActionExtra(NativeEvents.mousemove(), function (l, det) {
              if (det.mouseIsDown().get()) action (l, det);
            }, [ detail ])
          ]);

          return {
            events: isTouch ? touchEvents : mouseEvents
          };
        }
      });
    };

    // When the user touches the left edge, it should move the thumb
    var ledgePart = edgePart('left', SliderActions.setToLedge);

    // When the user touches the right edge, it should move the thumb
    var redgePart = edgePart('right', SliderActions.setToRedge);

    // The thumb part needs to have position absolute to be positioned correctly
    var thumbPart = PartType.required({
      name: 'thumb',
      defaults: Fun.constant({
        dom: {
          styles: { position: 'absolute' }
        }
      }),
      overrides: function (detail) {
        return {
          events: AlloyEvents.derive([
            // If the user touches the thumb itself, pretend they touched the spectrum instead. This
            // allows sliding even when they touchstart the current value
            AlloyEvents.redirectToPart(NativeEvents.touchstart(), detail, 'spectrum'),
            AlloyEvents.redirectToPart(NativeEvents.touchmove(), detail, 'spectrum'),
            AlloyEvents.redirectToPart(NativeEvents.touchend(), detail, 'spectrum')
          ])
        };
      }
    });

    var spectrumPart = PartType.required({
      schema: [
        FieldSchema.state('mouseIsDown', function () { return Cell(false); })
      ],
      name: 'spectrum',
      overrides: function (detail) {

        var moveToX = function (spectrum, simulatedEvent) {
          var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
          SliderActions.setXFromEvent(spectrum, detail, spectrumBounds, simulatedEvent);
        };

        var touchEvents = AlloyEvents.derive([
          AlloyEvents.run(NativeEvents.touchstart(), moveToX),
          AlloyEvents.run(NativeEvents.touchmove(), moveToX)
        ]);

        var mouseEvents = AlloyEvents.derive([
          AlloyEvents.run(NativeEvents.mousedown(), moveToX),
          AlloyEvents.run(NativeEvents.mousemove(), function (spectrum, se) {
            if (detail.mouseIsDown().get()) moveToX(spectrum, se);
          })
        ]);


        return {
          behaviours: Behaviour.derive(isTouch ? [ ] : [
            // Move left and right along the spectrum
            Keying.config({
              mode: 'special',
              onLeft: function (spectrum) {
                SliderActions.moveLeft(spectrum, detail);
                return Option.some(true);
              },
              onRight: function (spectrum) {
                SliderActions.moveRight(spectrum, detail);
                return Option.some(true);
              }
            }),
            Focusing.config({ })
          ]),

          events: isTouch ? touchEvents : mouseEvents
        };
      }
    });

    return [
      ledgePart,
      redgePart,
      thumbPart,
      spectrumPart
    ];
  }
);
define(
  'ephox.alloy.ui.slider.SliderSchema',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.sand.api.PlatformDetection'
  ],

  function (FieldSchema, Cell, Fun, PlatformDetection) {
    var isTouch = PlatformDetection.detect().deviceType.isTouch();

    return [
      FieldSchema.strict('min'),
      FieldSchema.strict('max'),
      FieldSchema.defaulted('stepSize', 1),
      FieldSchema.defaulted('onChange', Fun.noop),
      FieldSchema.defaulted('onInit', Fun.noop),
      FieldSchema.defaulted('onDragStart', Fun.noop),
      FieldSchema.defaulted('onDragEnd', Fun.noop),
      FieldSchema.defaulted('snapToGrid', false),
      FieldSchema.option('snapStart'),
      FieldSchema.strict('getInitialValue'),
      FieldSchema.defaulted('sliderBehaviours', { }),

      FieldSchema.state('value', function (spec) { return Cell(spec.min); })
    ].concat(! isTouch ? [
      // Only add if not on a touch device
      FieldSchema.state('mouseIsDown', function () { return Cell(false); })
    ] : [ ]);
  }
);
define(
  'ephox.alloy.behaviour.representing.RepresentApis',

  [

  ],

  function () {
    var onLoad = function (component, repConfig, repState) {
      repConfig.store().manager().onLoad(component, repConfig, repState);
    };

    var onUnload = function (component, repConfig, repState) {
      repConfig.store().manager().onUnload(component, repConfig, repState);
    };

    var setValue = function (component, repConfig, repState, data) {
      repConfig.store().manager().setValue(component, repConfig, repState, data);
    };

    var getValue = function (component, repConfig, repState) {
      return repConfig.store().manager().getValue(component, repConfig, repState);
    };

    return {
      onLoad: onLoad,
      onUnload: onUnload,
      setValue: setValue,
      getValue: getValue
    };
  }
);
define(
  'ephox.alloy.behaviour.representing.ActiveRepresenting',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.behaviour.common.Behaviour',
    'ephox.alloy.behaviour.representing.RepresentApis'
  ],

  function (AlloyEvents, Behaviour, RepresentApis) {
    var events = function (repConfig, repState) {
      var es = repConfig.resetOnDom() ? [
        AlloyEvents.runOnAttached(function (comp, se) {
          RepresentApis.onLoad(comp, repConfig, repState);
        }),
        AlloyEvents.runOnDetached(function (comp, se) {
          RepresentApis.onUnload(comp, repConfig, repState);
        })
      ] : [
        Behaviour.loadEvent(repConfig, repState, RepresentApis.onLoad)
      ];

      return AlloyEvents.derive(es);
    };

    return {
      events: events
    };
  }
);
define(
  'ephox.alloy.behaviour.representing.RepresentState',

  [
    'ephox.alloy.behaviour.common.BehaviourState',
    'ephox.katamari.api.Cell'
  ],

  function (BehaviourState, Cell) {
    var memory = function () {
      var data = Cell(null);

      var readState = function () {
        return {
          mode: 'memory',
          value: data.get()
        };
      };

      var isNotSet = function () {
        return data.get() === null;
      };

      var clear = function () {
        data.set(null);
      };

      return BehaviourState({
        set: data.set,
        get: data.get,
        isNotSet: isNotSet,
        clear: clear,
        readState: readState
      });
    };

    var manual = function () {
      var readState = function () {

      };

      return BehaviourState({
        readState: readState
      });
    };

    var dataset = function () {
      var data = Cell({ });

      var readState = function () {
        return {
          mode: 'dataset',
          dataset: data.get()
        };
      };

      return BehaviourState({
        readState: readState,
        set: data.set,
        get: data.get
      });
    };

    var init = function (spec) {
      return spec.store().manager().state(spec);
    };

    return {
      memory: memory,
      dataset: dataset,
      manual: manual,

      init: init
    };
  }
);

define(
  'ephox.alloy.behaviour.representing.DatasetStore',

  [
    'ephox.alloy.behaviour.representing.RepresentState',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Fun'
  ],

  function (RepresentState, Fields, FieldSchema, Objects, Fun) {
    var setValue = function (component, repConfig, repState, data) {
      // TODO: Really rethink this mode.
      var dataKey = repConfig.store().getDataKey();
      repState.set({ });
      repConfig.store().setData()(component, data);
      repConfig.onSetValue()(component, data);
    };

    var getValue = function (component, repConfig, repState) {
      var key = repConfig.store().getDataKey()(component);
      var dataset = repState.get();
      return Objects.readOptFrom(dataset, key).fold(function () {
        return repConfig.store().getFallbackEntry()(key);
      }, function (data) {
        return data;
      });
    };

    var onLoad = function (component, repConfig, repState) {
      repConfig.store().initialValue().each(function (data) {
        setValue(component, repConfig, repState, data);
      });
    };

    var onUnload = function (component, repConfig, repState) {
      repState.set({ });
    };

    return [
      FieldSchema.option('initialValue'),
      FieldSchema.strict('getFallbackEntry'),
      FieldSchema.strict('getDataKey'),
      FieldSchema.strict('setData'),
      Fields.output('manager', {
        setValue: setValue,
        getValue: getValue,
        onLoad: onLoad,
        onUnload: onUnload,
        state: RepresentState.dataset
      })
    ];
  }
);

define(
  'ephox.alloy.behaviour.representing.ManualStore',

  [
    'ephox.alloy.behaviour.common.NoState',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun'
  ],

  function (NoState, Fields, FieldSchema, Fun) {
    var getValue = function (component, repConfig, repState) {
      return repConfig.store().getValue()(component);
    };

    var setValue = function (component, repConfig, repState, data) {
      repConfig.store().setValue()(component, data);
      repConfig.onSetValue()(component, data);
    };

    var onLoad = function (component, repConfig, repState) {
      repConfig.store().initialValue().each(function (data) {
        repConfig.store().setValue()(component, data);
      });
    };

    return [
      FieldSchema.strict('getValue'),
      FieldSchema.defaulted('setValue', Fun.noop),
      FieldSchema.option('initialValue'),
      Fields.output('manager', {
        setValue: setValue,
        getValue: getValue,
        onLoad: onLoad,
        onUnload: Fun.noop,
        state: NoState.init
      })
    ];
  }
);

define(
  'ephox.alloy.behaviour.representing.MemoryStore',

  [
    'ephox.alloy.behaviour.representing.RepresentState',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema'
  ],

  function (RepresentState, Fields, FieldSchema) {
    var setValue = function (component, repConfig, repState, data) {
      repState.set(data);
      repConfig.onSetValue()(component, data);
    };

    var getValue = function (component, repConfig, repState) {
      return repState.get();
    };

    var onLoad = function (component, repConfig, repState) {
      repConfig.store().initialValue().each(function (initVal) {
        if (repState.isNotSet()) repState.set(initVal);
      });
    };

    var onUnload = function (component, repConfig, repState) {
      repState.clear();
    };

    return [
      FieldSchema.option('initialValue'),
      Fields.output('manager', {
        setValue: setValue,
        getValue: getValue,
        onLoad: onLoad,
        onUnload: onUnload,
        state: RepresentState.memory
      })
    ];
  }
);

define(
  'ephox.alloy.behaviour.representing.RepresentSchema',

  [
    'ephox.alloy.behaviour.representing.DatasetStore',
    'ephox.alloy.behaviour.representing.ManualStore',
    'ephox.alloy.behaviour.representing.MemoryStore',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema'
  ],

  function (DatasetStore, ManualStore, MemoryStore, Fields, FieldSchema, ValueSchema) {
    return [
      FieldSchema.defaultedOf('store', { mode: 'memory' }, ValueSchema.choose('mode', {
        memory: MemoryStore,
        manual: ManualStore,
        dataset: DatasetStore
      })),
      Fields.onHandler('onSetValue'),
      FieldSchema.defaulted('resetOnDom', false)
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Representing',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.representing.ActiveRepresenting',
    'ephox.alloy.behaviour.representing.RepresentApis',
    'ephox.alloy.behaviour.representing.RepresentSchema',
    'ephox.alloy.behaviour.representing.RepresentState'
  ],

  function (Behaviour, ActiveRepresenting, RepresentApis, RepresentSchema, RepresentState) {
    // The self-reference is clumsy.
    var me = Behaviour.create({
      fields: RepresentSchema,
      name: 'representing',
      active: ActiveRepresenting,
      apis: RepresentApis,
      extra: {
        setValueFrom: function (component, source) {
          var value = me.getValue(source);
          me.setValue(component, value);
        }
      },
      state: RepresentState
    });

    return me;
  }
);
define(
  'ephox.sugar.api.view.Width',

  [
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.impl.Dimension'
  ],

  function (Css, Dimension) {
    var api = Dimension('width', function (element) {
      // IMO passing this function is better than using dom['offset' + 'width']
      return element.dom().offsetWidth;
    });

    var set = function (element, h) {
      api.set(element, h);
    };

    var get = function (element) {
      return api.get(element);
    };

    var getOuter = function (element) {
      return api.getOuter(element);
    };

    var setMax = function (element, value) {
      // These properties affect the absolute max-height, they are not counted natively, we want to include these properties.
      var inclusions = [ 'margin-left', 'border-left-width', 'padding-left', 'padding-right', 'border-right-width', 'margin-right' ];
      var absMax = api.max(element, value, inclusions);
      Css.set(element, 'max-width', absMax + 'px');
    };

    return {
      set: set,
      get: get,
      getOuter: getOuter,
      setMax: setMax
    };
  }
);

define(
  'ephox.alloy.ui.slider.SliderUi',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.ui.slider.SliderActions',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.view.Width'
  ],

  function (Behaviour, Keying, Representing, AlloyEvents, NativeEvents, AlloyParts, SliderActions, Arr, Fun, Merger, Option, PlatformDetection, Css, Width) {
    var isTouch = PlatformDetection.detect().deviceType.isTouch();

    var sketch = function (detail, components, spec, externals) {
      var range = detail.max() - detail.min();

      var getXCentre = function (component) {
        var rect = component.element().dom().getBoundingClientRect();
        return (rect.left + rect.right) / 2;
      };

      var getThumb = function (component) {
        return AlloyParts.getPartOrDie(component, detail, 'thumb');
      };

      var getXOffset = function (slider, spectrumBounds, detail) {
        var v = detail.value().get();
        if (v < detail.min()) {
          return AlloyParts.getPart(slider, detail, 'left-edge').fold(function () {
            return 0;
          }, function (ledge) {
            return getXCentre(ledge) - spectrumBounds.left;
          });
        } else if (v > detail.max()) {
          // position at right edge
          return AlloyParts.getPart(slider, detail, 'right-edge').fold(function () {
            return spectrumBounds.width;
          }, function (redge) {
            return getXCentre(redge) - spectrumBounds.left;
          });
        } else {
          // position along the slider
          return (detail.value().get() - detail.min()) / range * spectrumBounds.width;
        }
      };

      var getXPos = function (slider) {
        var spectrum = AlloyParts.getPartOrDie(slider, detail, 'spectrum');
        var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
        var sliderBounds = slider.element().dom().getBoundingClientRect();

        var xOffset = getXOffset(slider, spectrumBounds, detail);
        return (spectrumBounds.left - sliderBounds.left) + xOffset;
      };

      var refresh = function (component) {
        var pos = getXPos(component);
        var thumb = getThumb(component);
        var thumbRadius = Width.get(thumb.element()) / 2;
        Css.set(thumb.element(), 'left', (pos - thumbRadius) + 'px');
      };

      var changeValue = function (component, newValue) {
        var oldValue = detail.value().get();
        var thumb = getThumb(component);
        // The left check is used so that the first click calls refresh
        if (oldValue !== newValue || Css.getRaw(thumb.element(), 'left').isNone()) {
          detail.value().set(newValue);
          refresh(component);
          detail.onChange()(component, thumb, newValue);
          return Option.some(true);
        } else {
          return Option.none();
        }
      };

      var resetToMin = function (slider) {
        changeValue(slider, detail.min(), Option.none());
      };

      var resetToMax = function (slider) {
        changeValue(slider, detail.max(), Option.none());
      };

      var uiEventsArr = isTouch ? [
        AlloyEvents.run(NativeEvents.touchstart(), function (slider, simulatedEvent) {
          detail.onDragStart()(slider, getThumb(slider));
        }),
        AlloyEvents.run(NativeEvents.touchend(), function (slider, simulatedEvent) {
          detail.onDragEnd()(slider, getThumb(slider));
        })
      ] : [
        AlloyEvents.run(NativeEvents.mousedown(), function (slider, simulatedEvent) {
          simulatedEvent.stop();
          detail.onDragStart()(slider, getThumb(slider));
          detail.mouseIsDown().set(true);
        }),
        AlloyEvents.run(NativeEvents.mouseup(), function (slider, simulatedEvent) {
          detail.onDragEnd()(slider, getThumb(slider));
          detail.mouseIsDown().set(false);
        })
      ];

      return {
        uid: detail.uid(),
        dom: detail.dom(),
        components: components,

        behaviours: Merger.deepMerge(
          Behaviour.derive(
            Arr.flatten([
              !isTouch ? [
                Keying.config({
                  mode: 'special',
                  focusIn: function (slider) {
                    return AlloyParts.getPart(slider, detail, 'spectrum').map(Keying.focusIn).map(Fun.constant(true));
                  }
                })
              ] : [],
              [
                Representing.config({
                  store: {
                    mode: 'manual',
                    getValue: function (_) {
                      return detail.value().get();
                    }
                  }
                })
              ]
            ])
          ),
          detail.sliderBehaviours()
        ),

        events: AlloyEvents.derive(
          [
            AlloyEvents.run(SliderActions.changeEvent(), function (slider, simulatedEvent) {
              changeValue(slider, simulatedEvent.event().value());
            }),
            AlloyEvents.runOnAttached(function (slider, simulatedEvent) {
              detail.value().set(detail.getInitialValue()());
              var thumb = getThumb(slider);
              // Call onInit instead of onChange for the first value.
              refresh(slider);
              detail.onInit()(slider, thumb, detail.value().get());
            })
          ].concat(uiEventsArr)
        ),

        apis: {
          resetToMin: resetToMin,
          resetToMax: resetToMax,
          refresh: refresh
        },

        domModification: {
          styles: {
            position: 'relative'
          }
        }
      };
    };

    return {
      sketch: sketch
    };
  }
);
define(
  'ephox.alloy.api.ui.Slider',

  [
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.slider.SliderParts',
    'ephox.alloy.ui.slider.SliderSchema',
    'ephox.alloy.ui.slider.SliderUi',
    'global!Math'
  ],

  function (Sketcher, SliderParts, SliderSchema, SliderUi, Math) {
    return Sketcher.composite({
      name: 'Slider',
      configFields: SliderSchema,
      partFields: SliderParts,
      factory: SliderUi.sketch,
      apis: {
        resetToMin: function (apis, slider) {
          apis.resetToMin(slider);
        },
        resetToMax: function (apis, slider) {
          apis.resetToMax(slider);
        },
        refresh: function (apis, slider) {
          apis.refresh(slider);
        }
      }
    });
  }
);
define(
  'tinymce.themes.mobile.ui.ToolbarWidgets',

  [
    'tinymce.themes.mobile.ui.Buttons'
  ],

  function (Buttons) {
    var button = function (realm, clazz, makeItems) {
      return Buttons.forToolbar(clazz, function () {
        var items = makeItems();
        realm.setContextToolbar([
          {
            // FIX: I18n
            label: clazz + ' group',
            items: items
          }
        ]);
      }, { });
    };

    return {
      button: button
    };
  }
);

define(
  'tinymce.themes.mobile.ui.ColorSlider',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Receiving',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.ui.Slider',
    'ephox.sugar.api.properties.Css',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.ui.ToolbarWidgets',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (Behaviour, Receiving, Toggling, Slider, Css, Receivers, Styles, ToolbarWidgets, UiDomFactory) {
    var BLACK = -1;

    var makeSlider = function (spec) {
      var getColor = function (hue) {
        // Handle edges.
        if (hue < 0) {
          return 'black';
        } else if (hue > 360) {
          return 'white';
        } else {
          return 'hsl(' + hue + ', 100%, 50%)';
        }
      };

      // Does not fire change intentionally.
      var onInit = function (slider, thumb, value) {
        var color = getColor(value);
        Css.set(thumb.element(), 'background-color', color);
      };

      var onChange = function (slider, thumb, value) {
        var color = getColor(value);
        Css.set(thumb.element(), 'background-color', color);
        spec.onChange(slider, thumb, color);
      };

      return Slider.sketch({
        dom: UiDomFactory.dom('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
        components: [
          Slider.parts()['left-edge'](UiDomFactory.spec('<div class="${prefix}-hue-slider-black"></div>')),
          Slider.parts().spectrum({
            dom: UiDomFactory.dom('<div class="${prefix}-slider-gradient-container"></div>'),
            components: [
              UiDomFactory.spec('<div class="${prefix}-slider-gradient"></div>')
            ],
            behaviours: Behaviour.derive([
              Toggling.config({
                toggleClass: Styles.resolve('thumb-active')
              })
            ])
          }),
          Slider.parts()['right-edge'](UiDomFactory.spec('<div class="${prefix}-hue-slider-white"></div>')),
          Slider.parts().thumb({
            dom: UiDomFactory.dom('<div class="${prefix}-slider-thumb"></div>'),
            behaviours: Behaviour.derive([
              Toggling.config({
                toggleClass: Styles.resolve('thumb-active')
              })
            ])
          })
        ],

        onChange: onChange,
        onDragStart: function (slider, thumb) {
          Toggling.on(thumb);
        },
        onDragEnd: function (slider, thumb) {
          Toggling.off(thumb);
        },
        onInit: onInit,
        stepSize: 10,
        min: 0,
        max: 360,
        getInitialValue: spec.getInitialValue,

        sliderBehaviours: Behaviour.derive([
          Receivers.orientation(Slider.refresh)
        ])
      });
    };

    var makeItems = function (spec) {
      return [
        makeSlider(spec)
      ];
    };

    var sketch = function (realm, editor) {
      var spec = {
        onChange: function (slider, thumb, color) {
          editor.undoManager.transact(function () {
            editor.formatter.apply('forecolor', { value: color });
            editor.nodeChanged();
          });
        },
        getInitialValue: function (/* slider */) {
          // Return black
          return BLACK;
        }
      };

      return ToolbarWidgets.button(realm, 'color', function () {
        return makeItems(spec);
      });
    };

    return {
      makeItems: makeItems,
      sketch: sketch
    };
  }
);
define(
  'tinymce.themes.mobile.ui.SizeSlider',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Receiving',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.ui.Slider',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (Behaviour, Receiving, Toggling, Slider, FieldSchema, ValueSchema, Receivers, Styles, UiDomFactory) {
    var schema = ValueSchema.objOfOnly([
      FieldSchema.strict('getInitialValue'),
      FieldSchema.strict('onChange'),
      FieldSchema.strict('category'),
      FieldSchema.strict('sizes')
    ]);

    var sketch = function (rawSpec) {
      var spec = ValueSchema.asRawOrDie('SizeSlider', schema, rawSpec);

      var isValidValue = function (valueIndex) {
        return valueIndex >= 0 && valueIndex < spec.sizes.length;
      };

      var onChange = function (slider, thumb, valueIndex) {
        if (isValidValue(valueIndex)) {
          spec.onChange(valueIndex);
        }
      };

      return Slider.sketch({
        dom: {
          tag: 'div',
          classes: [
            Styles.resolve('slider-' + spec.category + '-size-container'),
            Styles.resolve('slider'),
            Styles.resolve('slider-size-container') ]
        },
        onChange: onChange,
        onDragStart: function (slider, thumb) {
          Toggling.on(thumb);
        },
        onDragEnd: function (slider, thumb) {
          Toggling.off(thumb);
        },
        min: 0,
        max: spec.sizes.length - 1,
        stepSize: 1,
        getInitialValue: spec.getInitialValue,
        snapToGrid: true,

        sliderBehaviours: Behaviour.derive([
          Receivers.orientation(Slider.refresh)
        ]),

        components: [
          Slider.parts().spectrum({
            dom: UiDomFactory.dom('<div class="${prefix}-slider-size-container"></div>'),
            components: [
              UiDomFactory.spec('<div class="${prefix}-slider-size-line"></div>')
            ]
          }),
          
          Slider.parts().thumb({
            dom: UiDomFactory.dom('<div class="${prefix}-slider-thumb"></div>'),
            behaviours: Behaviour.derive([
              Toggling.config({
                toggleClass: Styles.resolve('thumb-active')
              })
            ])
          })
        ]
      });
    };

    return {
      sketch: sketch
    };
  }
);

define(
  'ephox.sugar.api.search.TransformFind',

  [
    'ephox.katamari.api.Type',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Element'
  ],

  function (Type, Fun, Option, Element) {
    var ancestor = function (scope, transform, isRoot) {
      var element = scope.dom();
      var stop = Type.isFunction(isRoot) ? isRoot : Fun.constant(false);

      while (element.parentNode) {
        element = element.parentNode;
        var el = Element.fromDom(element);

        var transformed = transform(el);
        if (transformed.isSome()) return transformed;
        else if (stop(el)) break;
      }
      return Option.none();
    };

    var closest = function (scope, transform, isRoot) {
      var current = transform(scope);
      return current.orThunk(function () {
        return isRoot(scope) ? Option.none() : ancestor(scope, transform, isRoot);
      });
    };

    return {
      ancestor: ancestor,
      closest: closest
    };
  }
);
define(
  'tinymce.themes.mobile.util.FontSizes',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.TransformFind',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Arr, Fun, Option, Compare, Element, Node, Css, TransformFind, Traverse) {
    var candidates = [ '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px' ];

    var defaultSize = 'medium';
    var defaultIndex = 2;

    var indexToSize = function (index) {
      return Option.from(candidates[index]);
    };

    var sizeToIndex = function (size) {
      return Arr.findIndex(candidates, function (v) {
        return v === size;
      });
    };

    var getRawOrComputed = function (isRoot, rawStart) {
      var optStart = Node.isElement(rawStart) ? Option.some(rawStart) : Traverse.parent(rawStart);
      return optStart.map(function (start) {
        var inline = TransformFind.closest(start, function (elem) {
          return Css.getRaw(elem, 'font-size');
        }, isRoot);

        return inline.getOrThunk(function () {
          return Css.get(start, 'font-size');
        });
      }).getOr('');
    };

    var getSize = function (editor) {
      // This was taken from the tinymce approach (FontInfo is unlikely to be global)
      var node = editor.selection.getStart();
      var elem = Element.fromDom(node);
      var root = Element.fromDom(editor.getBody());

      var isRoot = function (e) {
        return Compare.eq(root, e);
      };

      var elemSize = getRawOrComputed(isRoot, elem);
      return Arr.find(candidates, function (size) {
        return elemSize === size;
      }).getOr(defaultSize);
    };

    var applySize = function (editor, value) {
      var currentValue = getSize(editor);
      if (currentValue !== value) {
        editor.execCommand('fontSize', false, value);
      }
    };

    var get = function (editor) {
      var size = getSize(editor);
      return sizeToIndex(size).getOr(defaultIndex);
    };

    var apply = function (editor, index) {
      indexToSize(index).each(function (size) {
        applySize(editor, size);
      });
    };

    return {
      candidates: Fun.constant(candidates),
      get: get,
      apply: apply
    };
  }
);

define(
  'tinymce.themes.mobile.ui.FontSizeSlider',

  [
    'tinymce.themes.mobile.ui.SizeSlider',
    'tinymce.themes.mobile.ui.ToolbarWidgets',
    'tinymce.themes.mobile.util.FontSizes',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],


  function (SizeSlider, ToolbarWidgets, FontSizes, UiDomFactory) {
    var sizes = FontSizes.candidates();

    var makeSlider = function (spec) {
      return SizeSlider.sketch({
        onChange: spec.onChange,
        sizes: sizes,
        category: 'font',
        getInitialValue: spec.getInitialValue
      });
    };

    var makeItems = function (spec) {
      return [
        UiDomFactory.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'),
        makeSlider(spec),
        UiDomFactory.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>')
      ];
    };

    var sketch = function (realm, editor) {
      var spec = {
        onChange: function (value) {
          FontSizes.apply(editor, value);
        },
        getInitialValue: function (/* slider */) {
          return FontSizes.get(editor);
        }
      };

      return ToolbarWidgets.button(realm, 'font-size', function () {
        return makeItems(spec);
      });
    };

    return {
      makeItems: makeItems,
      sketch: sketch
    };
  }
);

/* eslint-disable */
/* jshint ignore:start */

/**
 * Modifed to be a feature fill and wrapped as tinymce module.
 *
 * Promise polyfill under MIT license: https://github.com/taylorhakes/promise-polyfill
 */
define(
  'ephox.imagetools.util.Promise',
  [
  ],
  function () {
    if (window.Promise) {
      return window.Promise;
    }

    // Use polyfill for setImmediate for performance gains
    var asap = Promise.immediateFn || (typeof setImmediate === 'function' && setImmediate) ||
      function (fn) { setTimeout(fn, 1); };

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }

    var isArray = Array.isArray || function (value) { return Object.prototype.toString.call(value) === "[object Array]"; };

    function Promise(fn) {
      if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      this._state = null;
      this._value = null;
      this._deferreds = [];

      doResolve(fn, bind(resolve, this), bind(reject, this));
    }

    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        }
        catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }

    function resolve(newValue) {
      try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) { reject.call(this, e); }
    }

    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }

    function finale() {
      for (var i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
      }
      this._deferreds = null;
    }

    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done) return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done) return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done) return;
        done = true;
        onRejected(ex);
      }
    }

    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };

    Promise.all = function () {
      var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

      return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) { res(i, val); }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    };

    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };

    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };

    return Promise;
  });

/* jshint ignore:end */
/* eslint-enable */

define(
  'ephox.imagetools.util.Canvas',
  [
  ],
  function () {
    function create(width, height) {
      return resize(document.createElement('canvas'), width, height);
    }

    function clone(canvas) {
      var tCanvas, ctx;
      tCanvas = create(canvas.width, canvas.height);
      ctx = get2dContext(tCanvas);
      ctx.drawImage(canvas, 0, 0);
      return tCanvas;
    }

    function get2dContext(canvas) {
      return canvas.getContext("2d");
    }

    function get3dContext(canvas) {
      var gl = null;
      try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      }
      catch (e) { }

      if (!gl) { // it seems that sometimes it doesn't throw exception, but still fails to get context
        gl = null;
      }
      return gl;
    }

    function resize(canvas, width, height) {
      canvas.width = width;
      canvas.height = height;

      return canvas;
    }

    return {
      create: create,
      clone: clone,
      resize: resize,
      get2dContext: get2dContext,
      get3dContext: get3dContext
    };
  });
define(
  'ephox.imagetools.util.Mime',
  [
  ],
  function () {
    function getUriPathName(uri) {
      var a = document.createElement('a');
      a.href = uri;
      return a.pathname;
    }

    function guessMimeType(uri) {
      var parts, ext, mimes, matches;

      if (uri.indexOf('data:') === 0) {
        uri = uri.split(',');
        matches = /data:([^;]+)/.exec(uri[0]);
        return matches ? matches[1] : '';
      } else {
        mimes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png'
        };

        parts = getUriPathName(uri).split('.');
        ext = parts[parts.length - 1];

        if (ext) {
          ext = ext.toLowerCase();
        }
        return mimes[ext];
      }
    }


    return {
      guessMimeType: guessMimeType
    };
  });
define(
  'ephox.imagetools.util.ImageSize',
  [
  ],
  function() {
  function getWidth(image) {
    return image.naturalWidth || image.width;
  }

  function getHeight(image) {
    return image.naturalHeight || image.height;
  }

  return {
    getWidth: getWidth,
    getHeight: getHeight
  };
});
define(
  'ephox.imagetools.util.Conversions',
  [
    'ephox.imagetools.util.Promise',
    'ephox.imagetools.util.Canvas',
    'ephox.imagetools.util.Mime',
    'ephox.imagetools.util.ImageSize'
  ],
  function (Promise, Canvas, Mime, ImageSize) {
    function loadImage(image) {
      return new Promise(function (resolve) {
        function loaded() {
          image.removeEventListener('load', loaded);
          resolve(image);
        }

        if (image.complete) {
          resolve(image);
        } else {
          image.addEventListener('load', loaded);
        }
      });
    }

    function imageToCanvas(image) {
      return loadImage(image).then(function (image) {
        var context, canvas;

        canvas = Canvas.create(ImageSize.getWidth(image), ImageSize.getHeight(image));
        context = Canvas.get2dContext(canvas);
        context.drawImage(image, 0, 0);

        return canvas;
      });
    }

    function imageToBlob(image) {
      return loadImage(image).then(function (image) {
        var src = image.src;

        if (src.indexOf('blob:') === 0) {
          return blobUriToBlob(src);
        }

        if (src.indexOf('data:') === 0) {
          return dataUriToBlob(src);
        }

        return imageToCanvas(image).then(function (canvas) {
          return dataUriToBlob(canvas.toDataURL(Mime.guessMimeType(src)));
        });
      });
    }

    function blobToImage(blob) {
      return new Promise(function (resolve) {
        var image = new Image();

        function loaded() {
          image.removeEventListener('load', loaded);
          resolve(image);
        }

        image.addEventListener('load', loaded);
        image.src = URL.createObjectURL(blob);

        if (image.complete) {
          loaded();
        }
      });
    }

    function blobUriToBlob(url) {
      return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          }
        };

        xhr.send();
      });
    }

    function dataUriToBlobSync(uri) {
      var str, arr, i, matches, type, blobBuilder;

      uri = uri.split(',');

      matches = /data:([^;]+)/.exec(uri[0]);
      if (matches) {
        type = matches[1];
      }

      str = atob(uri[1]);

      if (window.WebKitBlobBuilder) {
        /*globals WebKitBlobBuilder:false */
        blobBuilder = new WebKitBlobBuilder();

        arr = new ArrayBuffer(str.length);
        for (i = 0; i < arr.length; i++) {
          arr[i] = str.charCodeAt(i);
        }

        blobBuilder.append(arr);
        return blobBuilder.getBlob(type);
      }

      arr = new Uint8Array(str.length);
      for (i = 0; i < arr.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return new Blob([arr], { type: type });
    }

    function dataUriToBlob(uri) {
      return new Promise(function (resolve) {
        resolve(dataUriToBlobSync(uri));
      });
    }

    function uriToBlob(url) {
      if (url.indexOf('blob:') === 0) {
        return blobUriToBlob(url);
      }

      if (url.indexOf('data:') === 0) {
        return dataUriToBlob(url);
      }

      return null;
    }

    function canvasToBlob(canvas, type, quality) {
      type = type || 'image/png';

      if (HTMLCanvasElement.prototype.toBlob) {
        return new Promise(function (resolve) {
          canvas.toBlob(function (blob) {
            resolve(blob);
          }, type, quality);
        });
      } else {
        return dataUriToBlob(canvas.toDataURL(type, quality));
      }
    }

    function blobToDataUri(blob) {
      return new Promise(function (resolve) {
        var reader = new FileReader();

        reader.onloadend = function () {
          resolve(reader.result);
        };

        reader.readAsDataURL(blob);
      });
    }

    function blobToBase64(blob) {
      return blobToDataUri(blob).then(function (dataUri) {
        return dataUri.split(',')[1];
      });
    }

    function revokeImageUrl(image) {
      URL.revokeObjectURL(image.src);
    }

    return {
      // used outside
      blobToImage: blobToImage,
      // used outside
      imageToBlob: imageToBlob,
      // used outside
      blobToDataUri: blobToDataUri,
      // used outside
      blobToBase64: blobToBase64,

      // helper method
      imageToCanvas: imageToCanvas,
      // helper method
      canvasToBlob: canvasToBlob,
      // helper method
      revokeImageUrl: revokeImageUrl,
      // helper method
      uriToBlob: uriToBlob,
      // helper method
      dataUriToBlobSync: dataUriToBlobSync
    };
  });
define(
  'ephox.imagetools.util.ImageResult',
  [
    'ephox.imagetools.util.Promise',
    'ephox.imagetools.util.Conversions',
    'ephox.imagetools.util.Mime',
    'ephox.imagetools.util.Canvas'
  ],
  function (Promise, Conversions, Mime, Canvas) {
    function create(canvas, initialType) {
      function getType() {
        return initialType;
      }

      function toBlob(type, quality) {
        return Conversions.canvasToBlob(canvas, type || initialType, quality);
      }

      function toDataURL(type, quality) {
        return canvas.toDataURL(type || initialType, quality);
      }

      function toBase64(type, quality) {
        return toDataURL(type, quality).split(',')[1];
      }

      function toCanvas() {
        return Canvas.clone(canvas);
      }

      return {
        getType: getType,
        toBlob: toBlob,
        toDataURL: toDataURL,
        toBase64: toBase64,
        toCanvas: toCanvas
      };
    }

    function fromBlob(blob) {
      return Conversions.blobToImage(blob)
        .then(function (image) {
          var result = Conversions.imageToCanvas(image);
          Conversions.revokeImageUrl(image);
          return result;
        })
        .then(function (canvas) {
          return create(canvas, blob.type);
        });
    }

    function fromCanvas(canvas, type) {
      return new Promise(function (resolve) {
        resolve(create(canvas, type));
      });
    }

    function fromImage(image) {
      var type = Mime.guessMimeType(image.src);
      return Conversions.imageToCanvas(image).then(function (canvas) {
        return create(canvas, type);
      });
    }

    return {
      fromBlob: fromBlob,
      fromCanvas: fromCanvas,
      fromImage: fromImage
    };
  });

define(
  'ephox.imagetools.api.BlobConversions',
  [
    'ephox.imagetools.util.Conversions',
    'ephox.imagetools.util.ImageResult'
  ],
  function (Conversions, ImageResult) {
    var blobToImage = function (image) {
      return Conversions.blobToImage(image);
    };

    var imageToBlob = function (blob) {
      return Conversions.imageToBlob(blob);
    };

    var blobToDataUri = function (blob) {
      return Conversions.blobToDataUri(blob);
    };

    var blobToBase64 = function (blob) {
      return Conversions.blobToBase64(blob);
    };

    var blobToImageResult = function(blob) {
      return ImageResult.fromBlob(blob);
    };

    var dataUriToImageResult = function(uri) {
      return Conversions.uriToBlob(uri).then(ImageResult.fromBlob);
    };

    var imageToImageResult = function(image) {
      return ImageResult.fromImage(image);
    };

    var imageResultToBlob = function(ir, type, quality) {
      return ir.toBlob(type, quality);
    };

    var imageResultToBlobSync = function(ir, type, quality) {
      return Conversions.dataUriToBlobSync(ir.toDataURL(type, quality));
    };

    return {
      // used outside
      blobToImage: blobToImage,
      // used outside
      imageToBlob: imageToBlob,
      // used outside
      blobToDataUri: blobToDataUri,
      // used outside
      blobToBase64: blobToBase64,
      // used outside
      blobToImageResult: blobToImageResult,
      // used outside
      dataUriToImageResult: dataUriToImageResult,
      // used outside
      imageToImageResult: imageToImageResult,
      // used outside
      imageResultToBlob: imageResultToBlob,
      // just in case
      imageResultToBlobSync: imageResultToBlobSync
    };
  }
);
define(
  'tinymce.themes.mobile.ui.ImagePicker',

  [
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.ui.Button',
    'ephox.imagetools.api.BlobConversions',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Option',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (Memento, AlloyEvents, NativeEvents, Button, BlobConversions, Id, Option, UiDomFactory) {
    var addImage = function (editor, blob) {
      BlobConversions.blobToBase64(blob).then(function (base64) {
        editor.undoManager.transact(function () {
          var cache = editor.editorUpload.blobCache;
          var info = cache.create(
            Id.generate('mceu'), blob, base64
          );
          cache.add(info);
          var img = editor.dom.createHTML('img', {
            src: info.blobUri()
          });
          editor.insertContent(img);
        });
      });
    };

    var extractBlob = function (simulatedEvent) {
      var event = simulatedEvent.event();
      var files = event.raw().target.files || event.raw().dataTransfer.files;
      return Option.from(files[0]);
    };

    var sketch = function (editor) {
      var pickerDom = {
        tag: 'input',
        attributes: { accept: 'image/*', type: 'file', title: '' },
         // Visibility hidden so that it cannot be seen, and position absolute so that it doesn't
        // disrupt the layout
        styles: { visibility: 'hidden', position: 'absolute' }
      };

      var memPicker = Memento.record({
        dom: pickerDom,
        events: AlloyEvents.derive([
          // Stop the event firing again at the button level
          AlloyEvents.cutter(NativeEvents.click()),

          AlloyEvents.run(NativeEvents.change(), function (picker, simulatedEvent) {
            extractBlob(simulatedEvent).each(function (blob) {
              addImage(editor, blob);
            });
          })
        ])
      });

      return Button.sketch({
        dom: UiDomFactory.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-image ${prefix}-icon"></span>'),
        components: [
          memPicker.asSpec()
        ],
        action: function (button) {
          var picker = memPicker.get(button);
          // Trigger a dom click for the file input
          picker.element().dom().click();
        }
      });
    };

    return {
      sketch: sketch
    };
  }
);

define(
  'ephox.sugar.api.properties.TextContent',

  [
    
  ],

  function () {
    // REQUIRES IE9
    var get = function (element) {
      return element.dom().textContent;
    };

    var set = function (element, value) {
      element.dom().textContent = value;
    };

    return {
      get: get,
      set: set
    };
  }
);

define(
  'tinymce.themes.mobile.bridge.LinkBridge',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.TextContent',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (Fun, Option, Element, Attr, TextContent, SelectorFind) {
    var isNotEmpty = function (val) {
      return val.length > 0;
    };

    var defaultToEmpty = function (str) {
      return str === undefined || str === null ? '' : str;
    };

    var noLink = function (editor) {
      var text = editor.selection.getContent({ format: 'text' });
      return {
        url: '',
        text: text,
        title: '',
        target: '',
        link: Option.none()
      };
    };

    var fromLink = function (link) {
      var text = TextContent.get(link);
      var url = Attr.get(link, 'href');
      var title = Attr.get(link, 'title');
      var target = Attr.get(link, 'target');
      return {
        url: defaultToEmpty(url),
        text: text !== url ? defaultToEmpty(text) : '',
        title: defaultToEmpty(title),
        target: defaultToEmpty(target),
        link: Option.some(link)
      };
    };

    var getInfo = function (editor) {
      // TODO: Improve with more of tiny's link logic?
      return query(editor).fold(
        function () {
          return noLink(editor);
        },
        function (link) {
          return fromLink(link);
        }
      );
    };

    var wasSimple = function (link) {
      var prevHref = Attr.get(link, 'href');
      var prevText = TextContent.get(link);
      return prevHref === prevText;
    };

    var getTextToApply = function (link, url, info) {
      return info.text.filter(isNotEmpty).fold(function () {
        return wasSimple(link) ? Option.some(url) : Option.none();
      }, Option.some);
    };

    var unlinkIfRequired = function (editor, info) {
      var activeLink = info.link.bind(Fun.identity);
      activeLink.each(function (link) {
        editor.execCommand('unlink');
      });
    };

    var getAttrs = function (url, info) {
      var attrs = { };
      attrs.href = url;

      info.title.filter(isNotEmpty).each(function (title) {
        attrs.title = title;
      });
      info.target.filter(isNotEmpty).each(function (target) {
        attrs.target = target;
      });
      return attrs;
    };

    var applyInfo = function (editor, info) {
      info.url.filter(isNotEmpty).fold(function () {
        // Unlink if there is something to unlink
        unlinkIfRequired(editor, info);
      }, function (url) {
        // We must have a non-empty URL to insert a link
        var attrs = getAttrs(url, info);

        var activeLink = info.link.bind(Fun.identity);
        activeLink.fold(function () {
          var text = info.text.filter(isNotEmpty).getOr(url);
          editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)));
        }, function (link) {
          var text = getTextToApply(link, url, info);
          Attr.setAll(link, attrs);
          text.each(function (newText) {
            TextContent.set(link, newText);
          });
        });
      });
    };

    var query = function (editor) {
      var start = Element.fromDom(editor.selection.getStart());
      return SelectorFind.closest(start, 'a');
    };

    return {
      getInfo: getInfo,
      applyInfo: applyInfo,
      query: query
    };
  }
);

define(
  'ephox.alloy.api.behaviour.AddEventsBehaviour',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun'
  ],

  function (Behaviour, AlloyEvents, FieldSchema, Fun) {
    var events = function (name, eventHandlers) {
      var events = AlloyEvents.derive(eventHandlers);

      return Behaviour.create({
        fields: [
          FieldSchema.strict('enabled')
        ],
        name: name,
        active: {
          events: Fun.constant(events)
        }
      });
    };

    var config = function (name, eventHandlers) {
      var me = events(name, eventHandlers);

      return {
        key: name,
        value: {
          config: { },
          me: me,
          configAsRaw: Fun.constant({ }),
          initialConfig: { },
          state: Behaviour.noState()
        }
      };
    };

    return {
      events: events,
      config: config
    };
  }
);
define(
  'ephox.alloy.behaviour.composing.ComposeApis',

  [

  ],

  function () {
    var getCurrent = function (component, composeConfig, composeState) {
      return composeConfig.find()(component);
    };

    return {
      getCurrent: getCurrent
    };
  }
);
define(
  'ephox.alloy.behaviour.composing.ComposeSchema',

  [
    'ephox.boulder.api.FieldSchema'
  ],

  function (FieldSchema) {
    return [
      FieldSchema.strict('find')
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Composing',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.composing.ComposeApis',
    'ephox.alloy.behaviour.composing.ComposeSchema'
  ],

  function (Behaviour, ComposeApis, ComposeSchema) {
    return Behaviour.create({
      fields: ComposeSchema,
      name: 'composing',
      apis: ComposeApis
    });
  }
);
define(
  'ephox.alloy.api.ui.Container',

  [
    'ephox.alloy.api.ui.Sketcher',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Merger'
  ],

  function (Sketcher, FieldSchema, Merger) {
    var factory = function (detail, spec) {
      return {
        uid: detail.uid(),
        dom: Merger.deepMerge(
          {
            tag: 'div',
            attributes: {
              role: 'presentation'
            }
          },
          detail.dom()
        ),
        components: detail.components(),
        behaviours: detail.containerBehaviours(),
        events: detail.events(),
        domModification: detail.domModification(),
        eventOrder: detail.eventOrder()
      };
    };

    return Sketcher.single({
      name: 'Container',
      factory: factory,
      configFields: [
        FieldSchema.defaulted('components', [ ]),
        FieldSchema.defaulted('containerBehaviours', { }),
        FieldSchema.defaulted('events', { }),
        FieldSchema.defaulted('domModification', { }),
        FieldSchema.defaulted('eventOrder', { })
      ]
    });
  }
);
define(
  'ephox.alloy.api.ui.DataField',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Option'
  ],

  function (Behaviour, Composing, Representing, AlloyEvents, Sketcher, FieldSchema, Option) {
    var factory = function (detail, spec) {
      return {
        uid: detail.uid(),
        dom: detail.dom(),
        behaviours: Behaviour.derive([
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: detail.getInitialValue()()
            }
          }),
          Composing.config({
            find: Option.some
          })
        ]),
        events: AlloyEvents.derive([
          AlloyEvents.runOnAttached(function (component, simulatedEvent) {
            Representing.setValue(component, detail.getInitialValue()());
          })
        ])
      };
    };

    return Sketcher.single({
      name: 'DataField',
      factory: factory,
      configFields: [
        FieldSchema.strict('uid'),
        FieldSchema.strict('dom'),
        FieldSchema.strict('getInitialValue')
      ]
    });
  }
);
define(
  'ephox.alloy.behaviour.tabstopping.ActiveTabstopping',

  [
    'ephox.alloy.dom.DomModification',
    'ephox.boulder.api.Objects'
  ],

  function (DomModification, Objects) {
    var exhibit = function (base, tabConfig) {
      return DomModification.nu({
        attributes: Objects.wrapAll([
          { key: tabConfig.tabAttr(), value: 'true' }
        ])
      });
    };

    return {
      exhibit: exhibit
    };
  }
);
define(
  'ephox.alloy.behaviour.tabstopping.TabstopSchema',

  [
    'ephox.boulder.api.FieldSchema'
  ],

  function (FieldSchema) {
    return [
      FieldSchema.defaulted('tabAttr', 'data-alloy-tabstop')
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Tabstopping',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.tabstopping.ActiveTabstopping',
    'ephox.alloy.behaviour.tabstopping.TabstopSchema'
  ],

  function (Behaviour, ActiveTabstopping, TabstopSchema) {
    return Behaviour.create({
      fields: TabstopSchema,
      name: 'tabstopping',
      active: ActiveTabstopping
    });
  }
);
define(
  'ephox.sugar.api.properties.Value',

  [
    'global!Error'
  ],

  function (Error) {
    var get = function (element) {
      return element.dom().value;
    };

    var set = function (element, value) {
      if (value === undefined) throw new Error('Value.set was undefined');
      element.dom().value = value;
    };

    return {
      set: set,
      get: get
    };
  }
);

define(
  'ephox.alloy.ui.common.InputBase',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Tabstopping',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.sugar.api.properties.Value'
  ],

  function (Behaviour, Focusing, Representing, Tabstopping, Fields, FieldSchema, Objects, Fun, Merger, Value) {

    var schema = [
      FieldSchema.option('data'),
      FieldSchema.defaulted('inputAttributes', { }),
      FieldSchema.defaulted('inputStyles', { }),
      FieldSchema.defaulted('type', 'input'),
      FieldSchema.defaulted('tag', 'input'),
      Fields.onHandler('onSetValue'),
      FieldSchema.defaulted('styles', { }),
      FieldSchema.option('placeholder'),
      FieldSchema.defaulted('eventOrder', { }),
      FieldSchema.defaulted('hasTabstop', true),
      FieldSchema.defaulted('inputBehaviours', { }),
      FieldSchema.defaulted('selectOnFocus', true)
    ];

    var behaviours = function (detail) {
      return Merger.deepMerge(
        Behaviour.derive([
          Representing.config({
            store: {
              mode: 'manual',
              // Propagating its Option
              initialValue: detail.data().getOr(undefined),
              getValue: function (input) {
                return Value.get(input.element());
              },
              setValue: function (input, data) {
                var current = Value.get(input.element());
                // Only set it if it has changed ... otherwise the cursor goes to the end.
                if (current !== data) {
                  Value.set(input.element(), data);
                }
              }
            },
            onSetValue: detail.onSetValue()
          }),
          Focusing.config({
            onFocus: detail.selectOnFocus() === false ? Fun.noop : function (component) {
              var input = component.element();
              var value = Value.get(input);
              input.dom().setSelectionRange(0, value.length);
            }
          }),
          detail.hasTabstop() ? Tabstopping.config({ }) : Tabstopping.revoke()
        ]),
        detail.inputBehaviours()
      );
    };

    var dom = function (detail) {
      return {
        tag: detail.tag(),
        attributes: Merger.deepMerge(
          Objects.wrapAll([
            {
              key: 'type',
              value: detail.type()
            }
          ].concat(detail.placeholder().map(function (pc) {
            return {
              key: 'placeholder',
              value: pc
            };
          }).toArray())),
          detail.inputAttributes()
        ),
        styles: detail.inputStyles()
      };
    };

    return {
      schema: Fun.constant(schema),
      behaviours: behaviours,
      dom: dom
    };
  }
);
define(
  'ephox.alloy.api.ui.Input',

  [
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.common.InputBase'
  ],

  function (Sketcher, InputBase) {
    var factory = function (detail, spec) {
      return {
        uid: detail.uid(),
        dom: InputBase.dom(detail),
        // No children.
        components: [ ],
        behaviours: InputBase.behaviours(detail),
        eventOrder: detail.eventOrder()
      };
    };

    return Sketcher.single({
      name: 'Input',
      configFields: InputBase.schema(),
      factory: factory
    });
  }
);
define(
  'tinymce.themes.mobile.ui.Inputs',

  [
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.api.ui.DataField',
    'ephox.alloy.api.ui.Input',
    'ephox.katamari.api.Option',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (
    AddEventsBehaviour, Behaviour, Composing, Representing, Toggling, Memento, AlloyEvents,
    AlloyTriggers, NativeEvents, Button, Container, DataField, Input, Option, Styles, UiDomFactory
  ) {
    var clearInputBehaviour = 'input-clearing';

    var field = function (name, placeholder) {
      var inputSpec = Memento.record(Input.sketch({
        placeholder: placeholder,
        onSetValue: function (input, data) {
          // If the value changes, inform the container so that it can update whether the "x" is visible
          AlloyTriggers.emit(input, NativeEvents.input());
        },
        inputBehaviours: Behaviour.derive([
          Composing.config({
            find: Option.some
          })
        ]),
        selectOnFocus: false
      }));

      var buttonSpec = Memento.record(
        Button.sketch({
          dom: UiDomFactory.dom('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
          action: function (button) {
            var input = inputSpec.get(button);
            Representing.setValue(input, '');
          }
        })
      );

      return {
        name: name,
        spec: Container.sketch({
          dom: UiDomFactory.dom('<div class="${prefix}-input-container"></div>'),
          components: [
            inputSpec.asSpec(),
            buttonSpec.asSpec()
          ],
          containerBehaviours: Behaviour.derive([
            Toggling.config({
              toggleClass: Styles.resolve('input-container-empty')
            }),
            Composing.config({
              find: function (comp) {
                return Option.some(inputSpec.get(comp));
              }
            }),
            AddEventsBehaviour.config(clearInputBehaviour, [
              // INVESTIGATE: Because this only happens on input,
              // it won't reset unless it has an initial value
              AlloyEvents.run(NativeEvents.input(), function (iContainer) {
                var input = inputSpec.get(iContainer);
                var val = Representing.getValue(input);
                var f = val.length > 0 ? Toggling.off : Toggling.on;
                f(iContainer);
              })
            ])
          ])
        })
      };
    };

    var hidden = function (name) {
      return {
        name: name,
        spec: DataField.sketch({
          dom: {
            tag: 'span',
            styles: {
              display: 'none'
            }
          },
          getInitialValue: function () {
            return Option.none();
          }
        })
      };
    };

    return {
      field: field,
      hidden: hidden
    };
  }
);
define(
  'ephox.alloy.behaviour.disabling.DisableApis',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.node.Node'
  ],

  function (Arr, Attr, Class, Node) {
    // Just use "disabled" attribute for these, not "aria-disabled"
    var nativeDisabled = [
      'input',
      'button',
      'textarea'
    ];

    var onLoad = function (component, disableConfig, disableState) {
      if (disableConfig.disabled()) disable(component, disableConfig, disableState);
    };

    var hasNative = function (component) {
      return Arr.contains(nativeDisabled, Node.name(component.element()));
    };

    var nativeIsDisabled = function (component) {
      return Attr.has(component.element(), 'disabled');
    };

    var nativeDisable = function (component) {
      Attr.set(component.element(), 'disabled', 'disabled');
    };

    var nativeEnable = function (component) {
      Attr.remove(component.element(), 'disabled');
    };

    var ariaIsDisabled = function (component) {
      return Attr.get(component.element(), 'aria-disabled') === 'true';
    };

    var ariaDisable = function (component) {
      Attr.set(component.element(), 'aria-disabled', 'true');
    };

    var ariaEnable = function (component) {
      Attr.set(component.element(), 'aria-disabled', 'false');
    };

    var disable = function (component, disableConfig, disableState) {
      disableConfig.disableClass().each(function (disableClass) {
        Class.add(component.element(), disableClass);
      });
      var f = hasNative(component) ? nativeDisable : ariaDisable;
      f(component);
    };

    var enable = function (component, disableConfig, disableState) {
      disableConfig.disableClass().each(function (disableClass) {
        Class.remove(component.element(), disableClass);
      });
      var f = hasNative(component) ? nativeEnable : ariaEnable;
      f(component);
    };

    var isDisabled = function (component) {
      return hasNative(component) ? nativeIsDisabled(component) : ariaIsDisabled(component);
    };

    return {
      enable: enable,
      disable: disable,
      isDisabled: isDisabled,
      onLoad: onLoad
    };
  }
);
define(
  'ephox.alloy.behaviour.disabling.ActiveDisable',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.behaviour.common.Behaviour',
    'ephox.alloy.behaviour.disabling.DisableApis',
    'ephox.alloy.dom.DomModification',
    'ephox.katamari.api.Arr'
  ],

  function (AlloyEvents, SystemEvents, Behaviour, DisableApis, DomModification, Arr) {
    var exhibit = function (base, disableConfig, disableState) {
      return DomModification.nu({
        // Do not add the attribute yet, because it will depend on the node name
        // if we use "aria-disabled" or just "disabled"
        classes: disableConfig.disabled() ? disableConfig.disableClass().map(Arr.pure).getOr([ ]) : [ ]
      });
    };

    var events = function (disableConfig, disableState) {
      return AlloyEvents.derive([
        AlloyEvents.abort(SystemEvents.execute(), function (component, simulatedEvent) {
          return DisableApis.isDisabled(component, disableConfig, disableState);
        }),
        Behaviour.loadEvent(disableConfig, disableState, DisableApis.onLoad)
      ]);
    };

    return {
      exhibit: exhibit,
      events: events
    };
  }
);
define(
  'ephox.alloy.behaviour.disabling.DisableSchema',

  [
    'ephox.boulder.api.FieldSchema'
  ],

  function (FieldSchema) {
    return [
      FieldSchema.defaulted('disabled', false),
      FieldSchema.option('disableClass')
    ];
  }
);
define(
  'ephox.alloy.api.behaviour.Disabling',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.disabling.ActiveDisable',
    'ephox.alloy.behaviour.disabling.DisableApis',
    'ephox.alloy.behaviour.disabling.DisableSchema'
  ],

  function (Behaviour, ActiveDisable, DisableApis, DisableSchema) {
    return Behaviour.create({
      fields: DisableSchema,
      name: 'disabling',
      active: ActiveDisable,
      apis: DisableApis
    });
  }
);
define(
  'ephox.alloy.api.ui.Form',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.ui.UiSketcher',
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.parts.PartType',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj'
  ],

  function (Behaviour, Composing, Representing, UiSketcher, AlloyParts, PartType, FieldSchema, Arr, Merger, Obj) {
    var owner = 'form';

    var schema = [
      FieldSchema.defaulted('formBehaviours', { })
    ];

    var getPartName = function (name) {
      return '<alloy.field.' + name + '>';
    };

    var sketch = function (fSpec) {
      var parts = (function () {
        var record = [ ];

        var field = function (name, config) {
          record.push(name);
          return AlloyParts.generateOne(owner, getPartName(name), config);
        };

        return {
          field: field,
          record: function () { return record; }
        };
      })();
      
      var spec = fSpec(parts);

      var partNames = parts.record();
      // Unlike other sketches, a form does not know its parts in advance (as they represent each field
      // in a particular form). Therefore, it needs to calculate the part names on the fly
      var fieldParts = Arr.map(partNames, function (n) {
        return PartType.required({ name: n, pname: getPartName(n) });
      });

      return UiSketcher.composite(owner, schema, fieldParts, make, spec);
    };

    var make = function (detail, components, spec) {
      return Merger.deepMerge(
        {
          'debug.sketcher': {
            'Form': spec
          },
          uid: detail.uid(),
          dom: detail.dom(),
          components: components,

          // Form has an assumption that every field must have composing, and that the composed element has representing.
          behaviours: Merger.deepMerge(
            Behaviour.derive([
              Representing.config({
                store: {
                  mode: 'manual',
                  getValue: function (form) {
                    var optPs = AlloyParts.getAllParts(form, detail);
                    return Obj.map(optPs, function (optPThunk, pName) {
                      return optPThunk().bind(Composing.getCurrent).map(Representing.getValue);
                    });
                  },
                  setValue: function (form, values) {
                    Obj.each(values, function (newValue, key) {
                      AlloyParts.getPart(form, detail, key).each(function (wrapper) {
                        Composing.getCurrent(wrapper).each(function (field) {
                          Representing.setValue(field, newValue);
                        });
                      });
                    });
                  }
                }
              })
            ]),
            detail.formBehaviours()
          )
        }
      );
    };

    return {
      sketch: sketch
    };
  }
);
define(
  'ephox.katamari.api.Singleton',

  [
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Cell'
  ],

  function (Option, Cell) {
    var revocable = function (doRevoke) {
      var subject = Cell(Option.none());

      var revoke = function () {
        subject.get().each(doRevoke);
      };

      var clear = function () {
        revoke();
        subject.set(Option.none());
      };

      var set = function (s) {
        revoke();
        subject.set(Option.some(s));
      };

      var isSet = function () {
        return subject.get().isSome();
      };

      return {
        clear: clear,
        isSet: isSet,
        set: set
      };
    };

    var destroyable = function () {
      return revocable(function (s) {
        s.destroy();
      });
    };

    var unbindable = function () {
      return revocable(function (s) {
        s.unbind();
      });
    };

    var api = function () {
      var subject = Cell(Option.none());

      var revoke = function () {
        subject.get().each(function (s) {
          s.destroy();
        });
      };

      var clear = function () {
        revoke();
        subject.set(Option.none());
      };

      var set = function (s) {
        revoke();
        subject.set(Option.some(s));
      };

      var run = function (f) {
        subject.get().each(f);
      };

      var isSet = function () {
        return subject.get().isSome();
      };

      return {
        clear: clear,
        isSet: isSet,
        set: set,
        run: run
      };
    };

    var value = function () {
      var subject = Cell(Option.none());

      var clear = function () {
        subject.set(Option.none());
      };

      var set = function (s) {
        subject.set(Option.some(s));
      };

      var on = function (f) {
        subject.get().each(f);
      };

      var isSet = function () {
        return subject.get().isSome();
      };

      return {
        clear: clear,
        set: set,
        isSet: isSet,
        on: on
      };
    };

    return {
      destroyable: destroyable,
      unbindable: unbindable,
      api: api,
      value: value
    };
  }
);
define(
  'tinymce.themes.mobile.model.SwipingModel',

  [

  ],

  function () {
    var SWIPING_LEFT = 1;
    var SWIPING_RIGHT = -1;
    var SWIPING_NONE = 0;

    /* The state is going to record the edge points before the direction changed. We can then use
     * these points to identify whether or not the swipe was *consistent enough*
     */

    var init = function (xValue) {
      return {
        xValue: xValue,
        points: [ ]
      };
    };

    var move = function (model, xValue) {
      if (xValue === model.xValue) {
        return model; // do nothing.
      }

      // If the direction is the same as the previous direction, the change the last point
      // in the points array (because we have a new edge point). If the direction is different,
      // add a new point to the points array (because we have changed direction)
      var currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;

      var newPoint = { direction: currentDirection, xValue: xValue };

      var priorPoints = (function () {
        if (model.points.length === 0) {
          return [ ];
        } else {
          var prev = model.points[model.points.length - 1];
          return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points;
        }
      })();

      return {
        xValue: xValue,
        points: priorPoints.concat([ newPoint ])
      };
    };

    var complete = function (model/*, snaps*/) {
      if (model.points.length === 0) {
        return SWIPING_NONE;
      } else {
        // Preserving original intention
        var firstDirection = model.points[0].direction;
        var lastDirection = model.points[model.points.length - 1].direction;
        // eslint-disable-next-line no-nested-ternary
        return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT :
          firstDirection === SWIPING_LEFT && lastDirection == SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE;
      }
    };

    return {
      init: init,
      move: move,
      complete: complete
    };
  }
);
define(
  'tinymce.themes.mobile.ui.SerialisedDialog',

  [
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Disabling',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Receiving',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.api.ui.Form',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Singleton',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.SelectorFind',
    'ephox.sugar.api.view.Width',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.model.SwipingModel',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (
    AddEventsBehaviour, Behaviour, Disabling, Highlighting, Keying, Receiving, Representing, Memento, AlloyEvents, AlloyTriggers, NativeEvents, Button, Container,
    Form, FieldSchema, ValueSchema, Arr, Cell, Option, Singleton, Css, SelectorFilter, SelectorFind, Width, Receivers, SwipingModel, Styles, UiDomFactory
  ) {
    var sketch = function (rawSpec) {
      var navigateEvent = 'navigateEvent';

      var wrapperAdhocEvents = 'serializer-wrapper-events';
      var formAdhocEvents = 'form-events';

      var schema = ValueSchema.objOf([
        FieldSchema.strict('fields'),
        // Used for when datafields are present.
        FieldSchema.defaulted('maxFieldIndex', rawSpec.fields.length - 1),
        FieldSchema.strict('onExecute'),
        FieldSchema.strict('getInitialValue'),
        FieldSchema.state('state', function () {
          return {
            dialogSwipeState: Singleton.value(),
            currentScreen: Cell(0)
          };
        })
      ]);

      var spec = ValueSchema.asRawOrDie('SerialisedDialog', schema, rawSpec);

      var navigationButton = function (direction, directionName, enabled) {
        return Button.sketch({
          dom: UiDomFactory.dom('<span class="${prefix}-icon-' + directionName + ' ${prefix}-icon"></span>'),
          action: function (button) {
            AlloyTriggers.emitWith(button, navigateEvent, { direction: direction });
          },
          buttonBehaviours: Behaviour.derive([
            Disabling.config({
              disableClass: Styles.resolve('toolbar-navigation-disabled'),
              disabled: !enabled
            })
          ])
        });
      };

      var reposition = function (dialog, message) {
        SelectorFind.descendant(dialog.element(), '.' + Styles.resolve('serialised-dialog-chain')).each(function (parent) {
          Css.set(parent, 'left', (-spec.state.currentScreen.get() * message.width) + 'px');
        });
      };

      var navigate = function (dialog, direction) {
        var screens = SelectorFilter.descendants(dialog.element(), '.' + Styles.resolve('serialised-dialog-screen'));
        SelectorFind.descendant(dialog.element(), '.' + Styles.resolve('serialised-dialog-chain')).each(function (parent) {
          if ((spec.state.currentScreen.get() + direction) >= 0 && (spec.state.currentScreen.get() + direction) < screens.length) {
            Css.getRaw(parent, 'left').each(function (left) {
              var currentLeft = parseInt(left, 10);
              var w = Width.get(screens[0]);
              Css.set(parent, 'left', (currentLeft - (direction * w)) + 'px');
            });
            spec.state.currentScreen.set(spec.state.currentScreen.get() + direction);
          }
        });
      };

      // Unfortunately we need to inspect the DOM to find the input that is currently on screen
      var focusInput = function (dialog) {
        var inputs = SelectorFilter.descendants(dialog.element(), 'input');
        var optInput = Option.from(inputs[spec.state.currentScreen.get()]);
        optInput.each(function (input) {
          dialog.getSystem().getByDom(input).each(function (inputComp) {
            AlloyTriggers.dispatchFocus(dialog, inputComp.element());
          });
        });
        var dotitems = memDots.get(dialog);
        Highlighting.highlightAt(dotitems, spec.state.currentScreen.get());
      };

      var resetState = function () {
        spec.state.currentScreen.set(0);
        spec.state.dialogSwipeState.clear();
      };

      var memForm = Memento.record(
        Form.sketch(function (parts) {
          return {
            dom: UiDomFactory.dom('<div class="${prefix}-serialised-dialog"></div>'),
            components: [
              Container.sketch({
                dom: UiDomFactory.dom('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
                components: Arr.map(spec.fields, function (field, i) {
                  return i <= spec.maxFieldIndex ? Container.sketch({
                    dom: UiDomFactory.dom('<div class="${prefix}-serialised-dialog-screen"></div>'),
                    components: Arr.flatten([
                      [ navigationButton(-1, 'previous', (i > 0)) ],
                      [ parts.field(field.name, field.spec) ],
                      [ navigationButton(+1, 'next', (i < spec.maxFieldIndex)) ]
                    ])
                  }) : parts.field(field.name, field.spec);
                })
              })
            ],

            formBehaviours: Behaviour.derive([
              Receivers.orientation(function (dialog, message) {
                reposition(dialog, message);
              }),
              Keying.config({
                mode: 'special',
                focusIn: function (dialog/*, specialInfo */) {
                  focusInput(dialog);
                },
                onTab: function (dialog/*, specialInfo */) {
                  navigate(dialog, +1);
                  return Option.some(true);
                },
                onShiftTab: function (dialog/*, specialInfo */) {
                  navigate(dialog, -1);
                  return Option.some(true);
                }
              }),

              AddEventsBehaviour.config(formAdhocEvents, [
                AlloyEvents.runOnAttached(function (dialog, simulatedEvent) {
                  // Reset state to first screen.
                  resetState();
                  var dotitems = memDots.get(dialog);
                  Highlighting.highlightFirst(dotitems);
                  spec.getInitialValue(dialog).each(function (v) {
                    Representing.setValue(dialog, v);
                  });
                }),

                AlloyEvents.runOnExecute(spec.onExecute),

                AlloyEvents.run(NativeEvents.transitionend(), function (dialog, simulatedEvent) {
                  if (simulatedEvent.event().raw().propertyName === 'left') {
                    focusInput(dialog);
                  }
                }),

                AlloyEvents.run(navigateEvent, function (dialog, simulatedEvent) {
                  var direction = simulatedEvent.event().direction();
                  navigate(dialog, direction);
                })
              ])
            ])
          };
        })
      );

      var memDots = Memento.record({
        dom: UiDomFactory.dom('<div class="${prefix}-dot-container"></div>'),
        behaviours: Behaviour.derive([
          Highlighting.config({
            highlightClass: Styles.resolve('dot-active'),
            itemClass: Styles.resolve('dot-item')
          })
        ]),
        components: Arr.bind(spec.fields, function (_f, i) {
          return i <= spec.maxFieldIndex ? [
            UiDomFactory.spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')
          ] : [];
        })
      });

      return {
        dom: UiDomFactory.dom('<div class="${prefix}-serializer-wrapper"></div>'),
        components: [
          memForm.asSpec(),
          memDots.asSpec()
        ],

        behaviours: Behaviour.derive([
          Keying.config({
            mode: 'special',
            focusIn: function (wrapper) {
              var form = memForm.get(wrapper);
              Keying.focusIn(form);
            }
          }),

          AddEventsBehaviour.config(wrapperAdhocEvents, [
            AlloyEvents.run(NativeEvents.touchstart(), function (wrapper, simulatedEvent) {
              spec.state.dialogSwipeState.set(
                SwipingModel.init(simulatedEvent.event().raw().touches[0].clientX)
              );
            }),
            AlloyEvents.run(NativeEvents.touchmove(), function (wrapper, simulatedEvent) {
              spec.state.dialogSwipeState.on(function (state) {
                simulatedEvent.event().prevent();
                spec.state.dialogSwipeState.set(
                  SwipingModel.move(state, simulatedEvent.event().raw().touches[0].clientX)
                );
              });
            }),
            AlloyEvents.run(NativeEvents.touchend(), function (wrapper/*, simulatedEvent */) {
              spec.state.dialogSwipeState.on(function (state) {
                var dialog = memForm.get(wrapper);
                // Confusing
                var direction = -1 * SwipingModel.complete(state);
                navigate(dialog, direction);
              });
            })
          ])
        ])
      };
    };

    return {
      sketch: sketch
    };
  }
);
define(
  'tinymce.themes.mobile.util.RangePreserver',

  [
    'ephox.katamari.api.Fun',
    'ephox.sand.api.PlatformDetection'
  ],

  function (Fun, PlatformDetection) {
    var platform = PlatformDetection.detect();
    /* At the moment, this is only going to be used for Android. The Google keyboard
     * that comes with Android seems to shift the selection when the editor gets blurred
     * to the end of the word. This function rectifies that behaviour
     *
     * See fiddle: http://fiddle.tinymce.com/xNfaab/3 or http://fiddle.tinymce.com/xNfaab/4
     */
    var preserve = function (f, editor) {
      var rng = editor.selection.getRng();
      f();
      editor.selection.setRng(rng);
    };

    var forAndroid = function (editor, f) {
      var wrapper = platform.os.isAndroid() ? preserve : Fun.apply;
      wrapper(f, editor);
    };

    return {
      forAndroid: forAndroid
    };
  }
);

define(
  'tinymce.themes.mobile.ui.LinkButton',

  [
    'ephox.alloy.api.behaviour.Representing',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Thunk',
    'tinymce.themes.mobile.bridge.LinkBridge',
    'tinymce.themes.mobile.ui.Buttons',
    'tinymce.themes.mobile.ui.Inputs',
    'tinymce.themes.mobile.ui.SerialisedDialog',
    'tinymce.themes.mobile.util.RangePreserver'
  ],

  function (Representing, Option, Thunk, LinkBridge, Buttons, Inputs, SerialisedDialog, RangePreserver) {
    var getGroups = Thunk.cached(function (realm, editor) {
      return [
        {
          label: 'the link group',
          items: [
            SerialisedDialog.sketch({
              fields: [
                Inputs.field('url', 'Type or paste URL'),
                Inputs.field('text', 'Link text'),
                Inputs.field('title', 'Link title'),
                Inputs.field('target', 'Link target'),
                Inputs.hidden('link')
              ],

              // Do not include link
              maxFieldIndex: [ 'url', 'text', 'title', 'target' ].length - 1,
              getInitialValue: function (/* dialog */) {
                return Option.some(
                  LinkBridge.getInfo(editor)
                );
              },

              onExecute: function (dialog/*, simulatedEvent */) {
                var info = Representing.getValue(dialog);
                LinkBridge.applyInfo(editor, info);
                realm.restoreToolbar();
                editor.focus();
              }
            })
          ]
        }
      ];
    });

    var sketch = function (realm, editor) {
      return Buttons.forToolbarStateAction(editor, 'link', 'link', function () {
        var groups = getGroups(realm, editor);
        
        realm.setContextToolbar(groups);
        // Focus inside
        // On Android, there is a bug where if you position the cursor (collapsed) within a
        // word, and you blur the editor (by focusing an input), the selection moves to the
        // end of the word (http://fiddle.tinymce.com/xNfaab/3 or 4). This is actually dependent
        // on your keyboard (Google Keyboard) and is probably considered a feature. It does
        // not happen on Samsung (for example).
        RangePreserver.forAndroid(editor, function () {
          realm.focusToolbar();
        });

        LinkBridge.query(editor).each(function (link) {
          editor.selection.select(link.dom());
        });
      });
    };

    return {
      sketch: sketch
    };
  }
);
define(
  'tinymce.themes.mobile.features.DefaultStyleFormats',

  [

  ],

  function () {
    return [
      {
        title: 'Headings', items: [
          { title: 'Heading 1', format: 'h1' },
          { title: 'Heading 2', format: 'h2' },
          { title: 'Heading 3', format: 'h3' },
          { title: 'Heading 4', format: 'h4' },
          { title: 'Heading 5', format: 'h5' },
          { title: 'Heading 6', format: 'h6' }
        ]
      },

      {
        title: 'Inline', items: [
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
        title: 'Blocks', items: [
          { title: 'Paragraph', format: 'p' },
          { title: 'Blockquote', format: 'blockquote' },
          { title: 'Div', format: 'div' },
          { title: 'Pre', format: 'pre' }
        ]
      },

      {
        title: 'Alignment', items: [
          { title: 'Left', icon: 'alignleft', format: 'alignleft' },
          { title: 'Center', icon: 'aligncenter', format: 'aligncenter' },
          { title: 'Right', icon: 'alignright', format: 'alignright' },
          { title: 'Justify', icon: 'alignjustify', format: 'alignjustify' }
        ]
      }
    ];
  }
);

define(
  'ephox.alloy.behaviour.transitioning.TransitionApis',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Class'
  ],

  function (Objects, Fun, Option, Attr, Class) {
    var findRoute = function (component, transConfig, transState, route) {
      return Objects.readOptFrom(transConfig.routes(), route.start()).map(Fun.apply).bind(function (sConfig) {
        return Objects.readOptFrom(sConfig, route.destination()).map(Fun.apply);
      });
    };

    var getTransition = function (comp, transConfig, transState) {
      var route = getCurrentRoute(comp, transConfig, transState);
      return route.bind(function (r) {
        return getTransitionOf(comp, transConfig, transState, r);
      });
    };

    var getTransitionOf = function (comp, transConfig, transState, route) {
      return findRoute(comp, transConfig, transState, route).bind(function (r) {
        return r.transition().map(function (t) {
          return {
            transition: Fun.constant(t),
            route: Fun.constant(r)
          };
        });
      });
    };

    var disableTransition = function (comp, transConfig, transState) {
      // Disable the current transition
      getTransition(comp, transConfig, transState).each(function (routeTransition) {
        var t = routeTransition.transition();
        Class.remove(comp.element(), t.transitionClass());
        Attr.remove(comp.element(), transConfig.destinationAttr());
      });
    };

    var getNewRoute = function (comp, transConfig, transState, destination) {
      return {
        start: Fun.constant(Attr.get(comp.element(), transConfig.stateAttr())),
        destination: Fun.constant(destination)
      };
    };

    var getCurrentRoute = function (comp, transConfig, transState) {
      var el = comp.element();
      return Attr.has(el, transConfig.destinationAttr()) ? Option.some({
        start: Fun.constant(Attr.get(comp.element(), transConfig.stateAttr())),
        destination: Fun.constant(Attr.get(comp.element(), transConfig.destinationAttr()))
      }) : Option.none();
    };

    var jumpTo = function (comp, transConfig, transState, destination) {
      // Remove the previous transition
      disableTransition(comp, transConfig, transState);
      // Only call finish if there was an original state
      if (Attr.has(comp.element(), transConfig.stateAttr()) && Attr.get(comp.element(), transConfig.stateAttr()) !== destination) transConfig.onFinish()(comp, destination);
      Attr.set(comp.element(), transConfig.stateAttr(), destination);
    };

    var fasttrack = function (comp, transConfig, transState, destination) {
      if (Attr.has(comp.element(), transConfig.destinationAttr())) {
        Attr.set(comp.element(), transConfig.stateAttr(), Attr.get(comp.element(), transConfig.destinationAttr()));
        Attr.remove(comp.element(), transConfig.destinationAttr());
      }
    };

    var progressTo = function (comp, transConfig, transState, destination) {
      fasttrack(comp, transConfig, transState, destination);
      var route = getNewRoute(comp, transConfig, transState, destination);
      getTransitionOf(comp, transConfig, transState, route).fold(function () {
        jumpTo(comp, transConfig, transState, destination);
      }, function (routeTransition) {
        disableTransition(comp, transConfig, transState);
        var t = routeTransition.transition();
        Class.add(comp.element(), t.transitionClass());
        Attr.set(comp.element(), transConfig.destinationAttr(), destination);
      });
    };

    var getState = function (comp, transConfig, transState) {
      var e = comp.element();
      return Attr.has(e, transConfig.stateAttr()) ? Option.some(
        Attr.get(e, transConfig.stateAttr())
      ) : Option.none();
    };

    return {
      findRoute: findRoute,
      disableTransition: disableTransition,
      getCurrentRoute: getCurrentRoute,
      jumpTo: jumpTo,
      progressTo: progressTo,
      getState: getState
    };
  }
);

define(
  'ephox.alloy.behaviour.transitioning.ActiveTransitioning',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.behaviour.transitioning.TransitionApis'
  ],

  function (AlloyEvents, NativeEvents, TransitionApis) {
    var events = function (transConfig, transState) {
      return AlloyEvents.derive([
        AlloyEvents.run(NativeEvents.transitionend(), function (component, simulatedEvent) {
          var raw = simulatedEvent.event().raw();
          TransitionApis.getCurrentRoute(component, transConfig, transState).each(function (route) {
            TransitionApis.findRoute(component, transConfig, transState, route).each(function (rInfo) {
              rInfo.transition().each(function (rTransition) {
                if (raw.propertyName === rTransition.property()) {
                  TransitionApis.jumpTo(component, transConfig, transState, route.destination());
                  transConfig.onTransition()(component, route);
                }
              });
            });
          });
        }),

        AlloyEvents.runOnAttached(function (comp, se) {
          TransitionApis.jumpTo(comp, transConfig, transState, transConfig.initialState());
        })
      ]);
    };

    return {
      events: events
    };
  }
);

define(
  'ephox.alloy.behaviour.transitioning.TransitionSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Result'
  ],

  function (Fields, FieldSchema, ValueSchema, Result) {
    return [
      FieldSchema.defaulted('destinationAttr', 'data-transitioning-destination'),
      FieldSchema.defaulted('stateAttr', 'data-transitioning-state'),
      FieldSchema.strict('initialState'),
      Fields.onHandler('onTransition'),
      Fields.onHandler('onFinish'),
      FieldSchema.strictOf(
        'routes',
        ValueSchema.setOf(
          Result.value,
          ValueSchema.setOf(
            Result.value,
            ValueSchema.objOfOnly([
              FieldSchema.optionObjOfOnly('transition', [
                FieldSchema.strict('property'),
                FieldSchema.strict('transitionClass')
              ])
            ])
          )
        )
      )
    ];
  }
);

define(
  'ephox.alloy.api.behaviour.Transitioning',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.transitioning.ActiveTransitioning',
    'ephox.alloy.behaviour.transitioning.TransitionApis',
    'ephox.alloy.behaviour.transitioning.TransitionSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Obj'
  ],

  function (Behaviour, ActiveTransitioning, TransitionApis, TransitionSchema, Objects, Obj) {
    var createRoutes = function (routes) {
      var r = { };
      Obj.each(routes, function (v, k) {
        var waypoints = k.split('<->');
        r[waypoints[0]] = Objects.wrap(waypoints[1], v);
        r[waypoints[1]] = Objects.wrap(waypoints[0], v);
      });
      return r;
    };

    var createBistate = function (first, second, transitions) {
      return Objects.wrapAll([
        { key: first, value: Objects.wrap(second, transitions) },
        { key: second, value: Objects.wrap(first, transitions) }
      ]);
    };

    var createTristate = function (first, second, third, transitions) {
      return Objects.wrapAll([
        {
          key: first,
          value: Objects.wrapAll([
            { key: second, value: transitions },
            { key: third, value: transitions }
          ])
        },
        {
          key: second,
          value: Objects.wrapAll([
            { key: first, value: transitions },
            { key: third, value: transitions }
          ])
        },
        {
          key: third,
          value: Objects.wrapAll([
            { key: first, value: transitions },
            { key: second, value: transitions }
          ])
        }
      ]);
    };

    return Behaviour.create({
      fields: TransitionSchema,
      name: 'transitioning',
      active: ActiveTransitioning,
      apis: TransitionApis,
      extra: {
        createRoutes: createRoutes,
        createBistate: createBistate,
        createTristate: createTristate
      }
    });
  }
);

define(
  'ephox.alloy.behaviour.common.BehaviourBlob',

  [
    'ephox.alloy.behaviour.common.NoState',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'ephox.sand.api.JSON',
    'global!Error'
  ],

  function (NoState, FieldPresence, FieldSchema, ValueSchema, Arr, Fun, Obj, JSON, Error) {
    var generateFrom = function (spec, all) {
      var schema = Arr.map(all, function (a) {
        return FieldSchema.field(a.name(), a.name(), FieldPresence.asOption(), ValueSchema.objOf([
          FieldSchema.strict('config'),
          FieldSchema.defaulted('state', NoState)
        ]));
      });

      var validated = ValueSchema.asStruct('component.behaviours', ValueSchema.objOf(schema), spec.behaviours).fold(function (errInfo) {
        throw new Error(
          ValueSchema.formatError(errInfo) + '\nComplete spec:\n' +
            JSON.stringify(spec, null, 2)
        );
      }, Fun.identity);

      return {
        list: all,
        data: Obj.map(validated, function (blobOptionThunk/*, rawK */) {
          var blobOption = blobOptionThunk();
          return Fun.constant(blobOption.map(function (blob) {
            return {
              config: blob.config(),
              state: blob.state().init(blob.config())
            };
          }));
        })
      };
    };

    var getBehaviours = function (bData) {
      return bData.list;
    };

    var getData = function (bData) {
      return bData.data;
    };

    return {
      generateFrom: generateFrom,
      getBehaviours: getBehaviours,
      getData: getData
    };
  }
);

define(
  'ephox.alloy.api.component.CompBehaviours',

  [
    'ephox.alloy.behaviour.common.BehaviourBlob',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'global!Error'
  ],

  function (BehaviourBlob, Objects, Arr, Obj, Error) {
    var getBehaviours = function (spec) {
      var behaviours = Objects.readOptFrom(spec, 'behaviours').getOr({ });
      var keys = Arr.filter(
        Obj.keys(behaviours),
        function (k) { return behaviours[k] !== undefined; }
      );
      return Arr.map(keys, function (k) {
        return spec.behaviours[k].me;
      });
    };

    var generateFrom = function (spec, all) {
      return BehaviourBlob.generateFrom(spec, all);
    };

    var generate = function (spec) {
      var all = getBehaviours(spec);
      return generateFrom(spec, all);
    };

    return {
      generate: generate,
      generateFrom: generateFrom
    };
  }
);

define(
  'ephox.alloy.api.component.ComponentApi',

  [
    'ephox.katamari.api.Contracts'
  ],

  function (Contracts) {
    return Contracts.exactly([
      'getSystem',
      'config',
      'spec',
      'connect',
      'disconnect',
      'element',
      'syncComponents',
      'readState',
      'components',
      'events'
    ]);
  }
);

define(
  'ephox.alloy.api.system.SystemApi',

  [
    'ephox.katamari.api.Contracts'
  ],

  function (Contracts) {
    return Contracts.exactly([
      'debugInfo',
      'triggerFocus',
      'triggerEvent',
      'triggerEscape',
      // TODO: Implement later. See lab for details.
      // 'openPopup',
      // 'closePopup',
      'addToWorld',
      'removeFromWorld',
      'addToGui',
      'removeFromGui',
      'build',
      'getByUid',
      'getByDom',

      'broadcast',
      'broadcastOn'
    ]);
  }
);
define(
  'ephox.alloy.api.system.NoContextApi',

  [
    'ephox.alloy.api.system.SystemApi',
    'ephox.alloy.log.AlloyLogger',
    'ephox.katamari.api.Fun',
    'global!Error'
  ],

  function (SystemApi, AlloyLogger, Fun, Error) {
    return function (getComp) {
      var fail = function (event) {
        return function () {
          throw new Error('The component must be in a context to send: ' + event + '\n' +
            AlloyLogger.element(getComp().element()) + ' is not in context.'
          );
        };
      };

      return SystemApi({
        debugInfo: Fun.constant('fake'),
        triggerEvent: fail('triggerEvent'),
        triggerFocus: fail('triggerFocus'),
        triggerEscape: fail('triggerEscape'),
        build: fail('build'),
        addToWorld: fail('addToWorld'),
        removeFromWorld: fail('removeFromWorld'),
        addToGui: fail('addToGui'),
        removeFromGui: fail('removeFromGui'),
        getByUid: fail('getByUid'),
        getByDom: fail('getByDom'),
        broadcast: fail('broadcast'),
        broadcastOn: fail('broadcastOn')
      });
    };
  }
);
define(
  'ephox.alloy.alien.ObjIndex',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Obj'
  ],

  function (Objects, Obj) {

    /*
     * This is used to take something like:
     *
     * {
     *   behaviour: {
     *     event1: listener
     *   },
     *   behaviour2: {
     *     event1: listener
     *   }
     * }
     *
     * And turn it into something like:
     *
     * {
     *   event1: [ { b: behaviour1, l: listener }, { b: behaviour2, l: listener } ]
     * }
     */


    var byInnerKey = function (data, tuple) {
      var r = {};
      Obj.each(data, function (detail, key) {
        Obj.each(detail, function (value, indexKey) {
          var chain = Objects.readOr(indexKey, [ ])(r);
          r[indexKey] = chain.concat([
            tuple(key, value)
          ]);
        });
      });
      return r;
    };

    return {
      byInnerKey: byInnerKey
    };

  }
);
define(
  'ephox.alloy.construct.ComponentDom',

  [
    'ephox.alloy.alien.ObjIndex',
    'ephox.alloy.dom.DomModification',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Merger',
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Result'
  ],

  function (ObjIndex, DomModification, Objects, Arr, Obj, Merger, Json, Fun, Result) {
    var behaviourDom = function (name, modification) {
      return {
        name: Fun.constant(name),
        modification: modification
      };
    };

    var concat = function (chain, aspect) {
      var values = Arr.bind(chain, function (c) {
        return c.modification().getOr([ ]);
      });
      return Result.value(
        Objects.wrap(aspect, values)
      );
    };

    var onlyOne = function (chain, aspect, order) {
      if (chain.length > 1) return Result.error(
        'Multiple behaviours have tried to change DOM "' + aspect + '". The guilty behaviours are: ' +
          Json.stringify(Arr.map(chain, function (b) { return b.name(); })) + '. At this stage, this ' +
          'is not supported. Future releases might provide strategies for resolving this.'
      );
      else if (chain.length === 0) return Result.value({ });
      else return Result.value(
        chain[0].modification().fold(function () {
          return { };
        }, function (m) {
          return Objects.wrap(aspect, m);
        })
      );
    };

    var duplicate = function (aspect, k, obj, behaviours) {
      return Result.error('Mulitple behaviours have tried to change the _' + k + '_ "' + aspect + '"' +
        '. The guilty behaviours are: ' + Json.stringify(Arr.bind(behaviours, function (b) {
          return b.modification().getOr({})[k] !== undefined ? [ b.name() ] : [ ];
        }), null, 2) + '. This is not currently supported.'
      );
    };

    var safeMerge = function (chain, aspect) {
      // return unsafeMerge(chain, aspect);
      var y = Arr.foldl(chain, function (acc, c) {
        var obj = c.modification().getOr({});
        return acc.bind(function (accRest) {
          var parts = Obj.mapToArray(obj, function (v, k) {
            return accRest[k] !== undefined ? duplicate(aspect, k, obj, chain) :
              Result.value(Objects.wrap(k, v));
          });
          return Objects.consolidate(parts, accRest);
        });
      }, Result.value({}));

      return y.map(function (yValue) {
        return Objects.wrap(aspect, yValue);
      });
    };

    var mergeTypes = {
      classes: concat,
      attributes: safeMerge,
      styles: safeMerge,

      // Group these together somehow
      domChildren: onlyOne,
      defChildren: onlyOne,
      innerHtml: onlyOne,

      value: onlyOne
    };

    var combine = function (info, baseMod, behaviours, base) {
      // Get the Behaviour DOM modifications
      var behaviourDoms = Merger.deepMerge({ }, baseMod);
      Arr.each(behaviours, function (behaviour) {
        behaviourDoms[behaviour.name()] = behaviour.exhibit(info, base);
      });

      var byAspect = ObjIndex.byInnerKey(behaviourDoms, behaviourDom);
      // byAspect format: { classes: [ { name: Toggling, modification: [ 'selected' ] } ] }

      var usedAspect = Obj.map(byAspect, function (values, aspect) {
        return Arr.bind(values, function (value) {
          return value.modification().fold(function () {
            return [ ];
          }, function (v) {
            return [ value ];
          });
        });
      });

      var modifications = Obj.mapToArray(usedAspect, function (values, aspect) {
        return Objects.readOptFrom(mergeTypes, aspect).fold(function () {
          return Result.error('Unknown field type: ' + aspect);
        }, function (merger) {
          return merger(values, aspect);
        });
      });

      var consolidated = Objects.consolidate(modifications, {});

      return consolidated.map(DomModification.nu);
    };

    return {
      combine: combine
    };
  }
);
define(
  'ephox.alloy.alien.PrioritySort',

  [
    'ephox.sand.api.JSON',
    'ephox.katamari.api.Result',
    'global!Error'
  ],

  function (Json, Result, Error) {
    var sortKeys = function (label, keyName, array, order) {
      var sliced = array.slice(0);
      try {
        var sorted = sliced.sort(function (a, b) {
          var aKey = a[keyName]();
          var bKey = b[keyName]();
          var aIndex = order.indexOf(aKey);
          var bIndex = order.indexOf(bKey);
          if (aIndex === -1) throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey +
            '.\nOrder specified: ' + Json.stringify(order, null, 2));
          if (bIndex === -1) throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey +
            '.\nOrder specified: ' + Json.stringify(order, null, 2));
          if (aIndex < bIndex) return -1;
          else if (bIndex < aIndex) return 1;
          else return 0;
        });
        return Result.value(sorted);
      } catch (err) {
        return Result.error([ err ]);
      }
    };

    return {
      sortKeys: sortKeys
    };
  }
);
define(
  'ephox.alloy.events.DescribedHandler',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var nu = function (handler, purpose) {
      return {
        handler: handler,
        purpose: Fun.constant(purpose)
      };
    };

    var curryArgs = function (descHandler, extraArgs) {
      return {
        handler: Fun.curry.apply(undefined, [ descHandler.handler ].concat(extraArgs)),
        purpose: descHandler.purpose
      };
    };

    var getHandler = function (descHandler) {
      return descHandler.handler;
    };

    return {
      nu: nu,
      curryArgs: curryArgs,
      getHandler: getHandler
    };
  }
);

define(
  'ephox.alloy.construct.ComponentEvents',

  [
    'ephox.alloy.alien.ObjIndex',
    'ephox.alloy.alien.PrioritySort',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.events.DescribedHandler',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Result',
    'ephox.sand.api.JSON',
    'global!Array',
    'global!Error'
  ],

  function (ObjIndex, PrioritySort, EventHandler, DescribedHandler, Objects, Arr, Fun, Merger, Obj, Result, Json, Array, Error) {
    /*
     * The process of combining a component's events
     *
     * - Generate all the handlers based on the behaviour and the base events
     * - Create an index (eventName -> [tuples(behaviourName, handler)])
     * - Map over this index:
     *    - if the list == length 1, then collapse it to the head value
     *    - if the list > length 1, then:
     *        - sort the tuples using the behavour name ordering specified using
                eventOrder[event]. Return error if insufficient
     *        - generate a can, run, and abort that combines the handlers of the
                tuples in the sorted order
     *
     * So at the end, you should have Result(eventName -> single function)
     */
    var behaviourTuple = function (name, handler) {
      return {
        name: Fun.constant(name),
        handler: Fun.constant(handler)
      };
    };

    var nameToHandlers = function (behaviours, info) {
      var r = {};
      Arr.each(behaviours, function (behaviour) {
        r[behaviour.name()] = behaviour.handlers(info);
      });
      return r;
    };

    var groupByEvents = function (info, behaviours, base) {
      var behaviourEvents = Merger.deepMerge(base, nameToHandlers(behaviours, info));
      // Now, with all of these events, we need to index by event name
      return ObjIndex.byInnerKey(behaviourEvents, behaviourTuple);
    };

    var combine = function (info, eventOrder, behaviours, base) {
      var byEventName = groupByEvents(info, behaviours, base);
      return combineGroups(byEventName, eventOrder);
    };

    var assemble = function (rawHandler) {
      var handler = EventHandler.read(rawHandler);
      return function (component, simulatedEvent/*, others */) {
        var args = Array.prototype.slice.call(arguments, 0);
        if (handler.abort.apply(undefined, args)) {
          simulatedEvent.stop();
        } else if (handler.can.apply(undefined, args)) {
          handler.run.apply(undefined, args);
        }
      };
    };

    var missingOrderError = function (eventName, tuples) {
      return new Result.error([
        'The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' +
        'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' +
        'can trigger it are: ' + Json.stringify(Arr.map(tuples, function (c) { return c.name(); }), null, 2)
      ]);
    };

    var fuse = function (tuples, eventOrder, eventName) {
      // ASSUMPTION: tuples.length will never be 0, because it wouldn't have an entry if it was 0
      var order = eventOrder[eventName];
      if (! order) return missingOrderError(eventName, tuples);
      else return PrioritySort.sortKeys('Event: ' + eventName, 'name', tuples, order).map(function (sortedTuples) {
        var handlers = Arr.map(sortedTuples, function (tuple) { return tuple.handler(); });
        return EventHandler.fuse(handlers);
      });
    };

    var combineGroups = function (byEventName, eventOrder) {
      var r = Obj.mapToArray(byEventName, function (tuples, eventName) {
        var combined = tuples.length === 1 ? Result.value(tuples[0].handler()) : fuse(tuples, eventOrder, eventName);
        return combined.map(function (handler) {
          var assembled = assemble(handler);
          var purpose = tuples.length > 1 ? Arr.filter(eventOrder, function (o) {
            return Arr.contains(tuples, function (t) { return t.name() === o; });
          }).join(' > ') : tuples[0].name();
          return Objects.wrap(eventName, DescribedHandler.nu(assembled, purpose));
        });
      });

      return Objects.consolidate(r, {});
    };

    return {
      combine: combine
    };
  }
);
define(
  'ephox.alloy.construct.CustomDefinition',

  [
    'ephox.alloy.data.Fields',
    'ephox.alloy.dom.DomDefinition',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.ephemera.AlloyTags',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'global!Error'
  ],

  function (Fields, DomDefinition, DomModification, AlloyTags, FieldPresence, FieldSchema, Objects, ValueSchema, Arr, Fun, Merger, Error) {

    var toInfo = function (spec) {
      return ValueSchema.asStruct('custom.definition', ValueSchema.objOfOnly([
        FieldSchema.field('dom', 'dom', FieldPresence.strict(), ValueSchema.objOfOnly([
          // Note, no children.
          FieldSchema.strict('tag'),
          FieldSchema.defaulted('styles', {}),
          FieldSchema.defaulted('classes', []),
          FieldSchema.defaulted('attributes', {}),
          FieldSchema.option('value'),
          FieldSchema.option('innerHtml')
        ])),
        FieldSchema.strict('components'),
        FieldSchema.strict('uid'),

        FieldSchema.defaulted('events', {}),
        FieldSchema.defaulted('apis', Fun.constant({})),

        // Use mergeWith in the future when pre-built behaviours conflict
        FieldSchema.field(
          'eventOrder',
          'eventOrder',
          FieldPresence.mergeWith({
            'alloy.execute': [ 'disabling', 'alloy.base.behaviour', 'toggling' ],
            'alloy.focus': [ 'alloy.base.behaviour', 'keying', 'focusing' ],
            'alloy.system.init': [ 'alloy.base.behaviour', 'disabling', 'toggling', 'representing' ],
            'input': [ 'alloy.base.behaviour', 'representing', 'streaming', 'invalidating' ],
            'alloy.system.detached': [ 'alloy.base.behaviour', 'representing' ]
          }),
          ValueSchema.anyValue()
        ),

        FieldSchema.option('domModification'),
        Fields.snapshot('originalSpec'),

        // Need to have this initially
        FieldSchema.defaulted('debug.sketcher', 'unknown')
      ]), spec);
    };

    var getUid = function (info) {
      return Objects.wrap(AlloyTags.idAttr(), info.uid());
    };

    var toDefinition = function (info) {
      var base = {
        tag: info.dom().tag(),
        classes: info.dom().classes(),
        attributes: Merger.deepMerge(
          getUid(info),
          info.dom().attributes()
        ),
        styles: info.dom().styles(),
        domChildren: Arr.map(info.components(), function (comp) { return comp.element(); })
      };

      return DomDefinition.nu(Merger.deepMerge(base,
        info.dom().innerHtml().map(function (h) { return Objects.wrap('innerHtml', h); }).getOr({ }),
        info.dom().value().map(function (h) { return Objects.wrap('value', h); }).getOr({ })
      ));
    };

    var toModification = function (info) {
      return info.domModification().fold(function () {
        return DomModification.nu({ });
      }, DomModification.nu);
    };

    // Probably want to pass info to these at some point.
    var toApis = function (info) {
      return info.apis();
    };

    var toEvents = function (info) {
      return info.events();
    };

    return {
      toInfo: toInfo,
      toDefinition: toDefinition,
      toModification: toModification,
      toApis: toApis,
      toEvents: toEvents
    };
  }
);
define(
  'ephox.sugar.api.properties.Classes',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.impl.ClassList',
    'global!Array'
  ],

  function (Arr, Class, ClassList, Array) {
    /*
     * ClassList is IE10 minimum:
     * https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
     */
    var add = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.add(element, x);
      });
    };

    var remove = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.remove(element, x);
      });
    };

    var toggle = function (element, classes) {
      Arr.each(classes, function (x) {
        Class.toggle(element, x);
      });
    };

    var hasAll = function (element, classes) {
      return Arr.forall(classes, function (clazz) {
        return Class.has(element, clazz);
      });
    };

    var hasAny = function (element, classes) {
      return Arr.exists(classes, function (clazz) {
        return Class.has(element, clazz);
      });
    };

    var getNative = function (element) {
      var classList = element.dom().classList;
      var r = new Array(classList.length);
      for (var i = 0; i < classList.length; i++) {
        r[i] = classList.item(i);
      }
      return r;
    };

    var get = function (element) {
      return ClassList.supports(element) ? getNative(element) : ClassList.get(element);
    };

    // set deleted, risks bad performance. Be deterministic.

    return {
      add: add,
      remove: remove,
      toggle: toggle,
      hasAll: hasAll,
      hasAny: hasAny,
      get: get
    };
  }
);

define(
  'ephox.alloy.dom.DomRender',

  [
    'ephox.alloy.dom.DomDefinition',
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Html',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.properties.Value',
    'global!Error'
  ],

  function (DomDefinition, Arr, Attr, Classes, Css, Element, Html, InsertAll, Value, Error) {
    var getChildren = function (definition) {
      if (definition.domChildren().isSome() && definition.defChildren().isSome()) {
        throw new Error('Cannot specify children and child specs! Must be one or the other.\nDef: ' + DomDefinition.defToStr(definition));
      } else {
        return definition.domChildren().fold(function () {
          var defChildren = definition.defChildren().getOr([ ]);
          return Arr.map(defChildren, renderDef);
        }, function (domChildren) {
          return domChildren;
        });
      }
    };

    var renderToDom = function (definition) {
      var subject = Element.fromTag(definition.tag());
      Attr.setAll(subject, definition.attributes().getOr({ }));
      Classes.add(subject, definition.classes().getOr([ ]));
      Css.setAll(subject, definition.styles().getOr({ }));
      // Remember: Order of innerHtml vs children is important.
      Html.set(subject, definition.innerHtml().getOr(''));

      // Children are already elements.
      var children = getChildren(definition);
      InsertAll.append(subject, children);

      definition.value().each(function (value) {
        Value.set(subject, value);
      });

      return subject;
    };

    var renderDef = function (spec) {
      var definition = DomDefinition.nu(spec);
      return renderToDom(definition);
    };

    return {
      renderToDom: renderToDom
    };
  }
);
define(
  'ephox.alloy.api.component.Component',

  [
    'ephox.alloy.api.component.CompBehaviours',
    'ephox.alloy.api.component.ComponentApi',
    'ephox.alloy.api.system.NoContextApi',
    'ephox.alloy.api.ui.GuiTypes',
    'ephox.alloy.behaviour.common.BehaviourBlob',
    'ephox.alloy.construct.ComponentDom',
    'ephox.alloy.construct.ComponentEvents',
    'ephox.alloy.construct.CustomDefinition',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.dom.DomRender',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Type',
    'ephox.sand.api.JSON',
    'ephox.sugar.api.search.Traverse',
    'global!Error'
  ],

  function (
    CompBehaviours, ComponentApi, NoContextApi, GuiTypes, BehaviourBlob, ComponentDom, ComponentEvents, CustomDefinition, DomModification, DomRender, ValueSchema,
    Arr, Cell, Fun, Merger, Type, Json, Traverse, Error
  ) {
    var build = function (spec) {
      var getMe = function () {
        return me;
      };

      var systemApi = Cell(NoContextApi(getMe));


      var info = ValueSchema.getOrDie(CustomDefinition.toInfo(Merger.deepMerge(
        spec,
        {behaviours: undefined}
      )));

      // The behaviour configuration is put into info.behaviours(). For everything else,
      // we just need the list of static behaviours that this component cares about. The behaviour info
      // to pass through will come from the info.behaviours() obj.
      var bBlob = CompBehaviours.generate(spec);
      var bList = BehaviourBlob.getBehaviours(bBlob);
      var bData = BehaviourBlob.getData(bBlob);

      var definition = CustomDefinition.toDefinition(info);

      var baseModification = {
        'alloy.base.modification': CustomDefinition.toModification(info)
      };

      var modification = ComponentDom.combine(bData, baseModification, bList, definition).getOrDie();

      var modDefinition = DomModification.merge(definition, modification);

      var item = DomRender.renderToDom(modDefinition);

      var baseEvents = {
        'alloy.base.behaviour': CustomDefinition.toEvents(info)
      };

      var events = ComponentEvents.combine(bData, info.eventOrder(), bList, baseEvents).getOrDie();

      var subcomponents = Cell(info.components());

      var connect = function (newApi) {
        systemApi.set(newApi);
      };

      var disconnect = function () {
        systemApi.set(NoContextApi(getMe));
      };

      var syncComponents = function () {
        // Update the component list with the current children
        var children = Traverse.children(item);
        var subs = Arr.bind(children, function (child) {

          return systemApi.get().getByDom(child).fold(function () {
            // INVESTIGATE: Not sure about how to handle text nodes here.
            return [ ];
          }, function (c) {
            return [ c ];
          });
        });
        subcomponents.set(subs);
      };

      var config = function (behaviour) {
        if (behaviour === GuiTypes.apiConfig()) return info.apis();
        var b = bData;
        var f = Type.isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
          throw new Error('Could not find ' + behaviour.name() + ' in ' + Json.stringify(spec, null, 2));
        };
        return f();
        // });
      };

      var readState = function (behaviourName) {
        return bData[behaviourName]().map(function (b) {
          return b.state.readState();
        }).getOr('not enabled');
      };

      var me = ComponentApi({
        getSystem: systemApi.get,
        config: config,
        spec: Fun.constant(spec),
        readState: readState,

        connect: connect,
        disconnect: disconnect,
        element: Fun.constant(item),
        syncComponents: syncComponents,
        components: subcomponents.get,
        events: Fun.constant(events)
      });

      return me;
    };

    return {
      build: build
    };
  }
);
define(
  'ephox.alloy.events.DefaultEvents',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.log.AlloyLogger',
    'ephox.sugar.api.dom.Compare',
    'global!console'
  ],

  function (AlloyEvents, SystemEvents, AlloyLogger, Compare, console) {
    // The purpose of this check is to ensure that a simulated focus call is not going
    // to recurse infinitely. Essentially, if the originator of the focus call is the same
    // as the element receiving it, and it wasn't its own target, then stop the focus call
    // and log a warning.
    var isRecursive = function (component, originator, target) {
      return Compare.eq(originator, component.element()) &&
        !Compare.eq(originator, target);
    };

    return {
      events: AlloyEvents.derive([
        AlloyEvents.can(SystemEvents.focus(), function (component, simulatedEvent) {
          // originator may not always be there. Will need to check this.
          var originator = simulatedEvent.event().originator();
          var target = simulatedEvent.event().target();
          if (isRecursive(component, originator, target)) {
            console.warn(
              SystemEvents.focus() + ' did not get interpreted by the desired target. ' +
              '\nOriginator: ' + AlloyLogger.element(originator) +
              '\nTarget: ' + AlloyLogger.element(target) +
              '\nCheck the ' + SystemEvents.focus() + ' event handlers'
            );
            return false;
          } else {
            return true;
          }
        })
      ])
    };
  }
);
define(
  'ephox.alloy.spec.CustomSpec',

  [

  ],

  function () {
    var make = function (spec) {
      // Maybe default some arguments here
      return spec;
    };

    return {
      make: make
    };
  }
);
define(
  'ephox.alloy.api.component.GuiFactory',

  [
    'ephox.alloy.api.component.Component',
    'ephox.alloy.api.component.ComponentApi',
    'ephox.alloy.api.system.NoContextApi',
    'ephox.alloy.api.ui.GuiTypes',
    'ephox.alloy.events.DefaultEvents',
    'ephox.alloy.registry.Tagger',
    'ephox.alloy.spec.CustomSpec',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Result',
    'ephox.sugar.api.node.Element',
    'global!Error'
  ],

  function (
    Component, ComponentApi, NoContextApi, GuiTypes, DefaultEvents, Tagger, CustomSpec, FieldSchema, Objects, ValueSchema, Arr, Cell, Fun, Merger, Option, Result,
    Element, Error
  ) {
    var buildSubcomponents = function (spec) {
      var components = Objects.readOr('components', [ ])(spec);
      return Arr.map(components, build);
    };

    var buildFromSpec = function (userSpec) {
      var spec = CustomSpec.make(userSpec);

      // Build the subcomponents
      var components = buildSubcomponents(spec);

      var completeSpec = Merger.deepMerge(
        DefaultEvents,
        spec,
        Objects.wrap('components', components)
      );

      return Result.value(
        Component.build(completeSpec)
      );
    };

    var text = function (textContent) {
      var element = Element.fromText(textContent);

      return external({
        element: element
      });
    };

    var external = function (spec) {
      var extSpec = ValueSchema.asStructOrDie('external.component', ValueSchema.objOfOnly([
        FieldSchema.strict('element'),
        FieldSchema.option('uid')
      ]), spec);

      var systemApi = Cell(NoContextApi());

      var connect = function (newApi) {
        systemApi.set(newApi);
      };

      var disconnect = function () {
        systemApi.set(NoContextApi(function () {
          return me;
        }));
      };

      extSpec.uid().each(function (uid) {
        Tagger.writeOnly(extSpec.element(), uid);
      });

      var me = ComponentApi({
        getSystem: systemApi.get,
        config: Option.none,
        connect: connect,
        disconnect: disconnect,
        element: Fun.constant(extSpec.element()),
        spec: Fun.constant(spec),
        readState: Fun.constant('No state'),
        syncComponents: Fun.noop,
        components: Fun.constant([ ]),
        events: Fun.constant({ })
      });

      return GuiTypes.premade(me);
    };

    // INVESTIGATE: A better way to provide 'meta-specs'
    var build = function (rawUserSpec) {

      return GuiTypes.getPremade(rawUserSpec).fold(function () {
        var userSpecWithUid = Merger.deepMerge({ uid: Tagger.generate('') }, rawUserSpec);
        return buildFromSpec(userSpecWithUid).getOrDie();
      }, function (prebuilt) {
        return prebuilt;
      });
    };

    return {
      build: build,
      premade: GuiTypes.premade,
      external: external,
      text: text
    };
  }
);
define(
  'ephox.alloy.menu.util.ItemEvents',

  [
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Focus'
  ],

  function (Focusing, AlloyTriggers, Fun, Focus) {
    var hoverEvent = 'alloy.item-hover';
    var focusEvent = 'alloy.item-focus';

    var onHover = function (item) {
      // Firstly, check that the focus isn't already inside the item. This
      // is to handle situations like widgets where the widget is inside the item
      // and it has the focus, so as you slightly adjust the mouse, you don't
      // want to lose focus on the widget. Note, that because this isn't API based
      // (i.e. we are manually searching for focus), it may not be that flexible.
      if (Focus.search(item.element()).isNone() || Focusing.isFocused(item)) {
        if (! Focusing.isFocused(item)) Focusing.focus(item);
        AlloyTriggers.emitWith(item, hoverEvent, { item: item });
      }
    };

    var onFocus = function (item) {
      AlloyTriggers.emitWith(item, focusEvent, { item: item });
    };

    return {
      hover: Fun.constant(hoverEvent),
      focus: Fun.constant(focusEvent),

      onHover: onHover,
      onFocus: onFocus
    };
  }
);
define(
  'ephox.alloy.menu.build.ItemType',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.data.Fields',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Merger'
  ],

  function (Behaviour, Focusing, Keying, Representing, Toggling, AlloyEvents, AlloyTriggers, NativeEvents, SystemEvents, Fields, ItemEvents, FieldSchema, Merger) {
    var builder = function (info) {
      return {
        dom: Merger.deepMerge(
          info.dom(),
          {
            attributes: {
              role: info.toggling().isSome() ? 'menuitemcheckbox' : 'menuitem'
            }
          }
        ),
        behaviours: Merger.deepMerge(
          Behaviour.derive([
            info.toggling().fold(Toggling.revoke, function (tConfig) {
              return Toggling.config(
                Merger.deepMerge({
                  aria: {
                    mode: 'checked'
                  }
                }, tConfig)
              );
            }),
            Focusing.config({
              ignore: info.ignoreFocus(),
              onFocus: function (component) {
                ItemEvents.onFocus(component);
              }
            }),
            Keying.config({
              mode: 'execution'
            }),
            Representing.config({
              store: {
                mode: 'memory',
                initialValue: info.data()
              }
            })
          ]),
          info.itemBehaviours()
        ),
        events: AlloyEvents.derive([
          // Trigger execute when clicked
          AlloyEvents.runWithTarget(SystemEvents.tapOrClick(), AlloyTriggers.emitExecute),

          // Like button, stop mousedown propagating up the DOM tree.
          AlloyEvents.cutter(NativeEvents.mousedown()),

          AlloyEvents.run(NativeEvents.mouseover(), ItemEvents.onHover),

          AlloyEvents.run(SystemEvents.focusItem(), Focusing.focus)
        ]),
        components: info.components(),

        domModification: info.domModification()
      };
    };

    var schema = [
      FieldSchema.strict('data'),
      FieldSchema.strict('components'),
      FieldSchema.strict('dom'),

      FieldSchema.option('toggling'),

      // Maybe this needs to have fewer behaviours
      FieldSchema.defaulted('itemBehaviours', { }),

      FieldSchema.defaulted('ignoreFocus', false),
      FieldSchema.defaulted('domModification', { }),
      Fields.output('builder', builder)
    ];



    return schema;
  }
);
define(
  'ephox.alloy.menu.build.SeparatorType',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema'
  ],

  function (AlloyEvents, SystemEvents, Fields, FieldSchema) {
    var builder = function (detail) {
      return {
        dom: detail.dom(),
        components: detail.components(),
        events: AlloyEvents.derive([
          AlloyEvents.stopper(SystemEvents.focusItem())
        ])
      };
    };

    var schema = [
      FieldSchema.strict('dom'),
      FieldSchema.strict('components'),
      Fields.output('builder', builder)
    ];

    return schema;
  }
);
define(
  'ephox.alloy.menu.build.WidgetParts',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.parts.PartType',
    'ephox.katamari.api.Fun'
  ],

  function (Behaviour, Representing, PartType, Fun) {
    var owner = 'item-widget';

    var partTypes = [
      PartType.required({
        name: 'widget',
        overrides: function (detail) {
          return {
            behaviours: Behaviour.derive([
              Representing.config({
                store: {
                  mode: 'manual',
                  getValue: function (component) {
                    return detail.data();
                  },
                  setValue: function () { }
                }
              })
            ])
          };
        }
      })
    ];

    return {
      owner: Fun.constant(owner),
      parts: Fun.constant(partTypes)
    };
  }
);

define(
  'ephox.alloy.menu.build.WidgetType',

  [
    'ephox.alloy.alien.EditableFields',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.data.Fields',
    'ephox.alloy.menu.build.WidgetParts',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.alloy.parts.AlloyParts',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option'
  ],

  function (
    EditableFields, Behaviour, Focusing, Keying, Representing, AlloyEvents, NativeEvents, SystemEvents, Fields, WidgetParts, ItemEvents, AlloyParts, FieldSchema,
    Merger, Option
  ) {
    var builder = function (info) {
      var subs = AlloyParts.substitutes(WidgetParts.owner(), info, WidgetParts.parts());
      var components = AlloyParts.components(WidgetParts.owner(), info, subs.internals());

      var focusWidget = function (component) {
        return AlloyParts.getPart(component, info, 'widget').map(function (widget) {
          Keying.focusIn(widget);
          return widget;
        });
      };

      var onHorizontalArrow = function (component, simulatedEvent) {
        return EditableFields.inside(simulatedEvent.event().target()) ? Option.none() : (function () {
          if (info.autofocus()) {
            simulatedEvent.setSource(component.element());
            return Option.none();
          } else {
            return Option.none();
          }
        })();
      };

      return Merger.deepMerge({
        dom: info.dom(),
        components: components,
        domModification: info.domModification(),
        events: AlloyEvents.derive([
          AlloyEvents.runOnExecute(function (component, simulatedEvent) {
            focusWidget(component).each(function (widget) {
              simulatedEvent.stop();
            });
          }),

          AlloyEvents.run(NativeEvents.mouseover(), ItemEvents.onHover),

          AlloyEvents.run(SystemEvents.focusItem(), function (component, simulatedEvent) {
            if (info.autofocus()) focusWidget(component);
            else Focusing.focus(component);
          })
        ]),
        behaviours: Behaviour.derive([
          Representing.config({
            store: {
              mode: 'memory',
              initialValue: info.data()
            }
          }),
          Focusing.config({
            onFocus: function (component) {
              ItemEvents.onFocus(component);
            }
          }),
          Keying.config({
            mode: 'special',
            // focusIn: info.autofocus() ? function (component) {
            //   focusWidget(component);
            // } : Behaviour.revoke(),
            onLeft: onHorizontalArrow,
            onRight: onHorizontalArrow,
            onEscape: function (component, simulatedEvent) {
              // If the outer list item didn't have focus,
              // then focus it (i.e. escape the inner widget). Only do if not autofocusing
              // Autofocusing should treat the widget like it is the only item, so it should
              // let its outer menu handle escape
              if (! Focusing.isFocused(component) && !info.autofocus()) {
                Focusing.focus(component);
                return Option.some(true);
              } else if (info.autofocus()) {
                simulatedEvent.setSource(component.element());
                return Option.none();
              } else {
                return Option.none();
              }
            }
          })
        ])
      });
    };

    var schema = [
      FieldSchema.strict('uid'),
      FieldSchema.strict('data'),
      FieldSchema.strict('components'),
      FieldSchema.strict('dom'),
      FieldSchema.defaulted('autofocus', false),
      FieldSchema.defaulted('domModification', { }),
      // We don't have the uid at this point
      AlloyParts.defaultUidsSchema(WidgetParts.parts()),
      Fields.output('builder', builder)
    ];


    return schema;
  }
);
define(
  'ephox.alloy.ui.schema.MenuSchema',

  [
    'ephox.alloy.api.focus.FocusManagers',
    'ephox.alloy.data.Fields',
    'ephox.alloy.menu.build.ItemType',
    'ephox.alloy.menu.build.SeparatorType',
    'ephox.alloy.menu.build.WidgetType',
    'ephox.alloy.parts.PartType',
    'ephox.alloy.registry.Tagger',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger'
  ],

  function (FocusManagers, Fields, ItemType, SeparatorType, WidgetType, PartType, Tagger, FieldSchema, ValueSchema, Fun, Merger) {
    var itemSchema = ValueSchema.choose(
      'type',
      {
        widget: WidgetType,
        item: ItemType,
        separator: SeparatorType
      }
    );

    var configureGrid = function (detail, movementInfo) {
      return {
        mode: 'flatgrid',
        selector: '.' + detail.markers().item(),
        initSize: {
          numColumns: movementInfo.initSize().numColumns(),
          numRows: movementInfo.initSize().numRows()
        },
        focusManager: detail.focusManager()
      };
    };

    var configureMenu = function (detail, movementInfo) {
      return {
        mode: 'menu',
        selector: '.' + detail.markers().item(),
        moveOnTab: movementInfo.moveOnTab(),
        focusManager: detail.focusManager()
      };
    };

    var parts = [
      PartType.group({
        factory: {
          sketch: function (spec) {
            var itemInfo = ValueSchema.asStructOrDie('menu.spec item', itemSchema, spec);
            return itemInfo.builder()(itemInfo);
          }
        },
        name: 'items',
        unit: 'item',
        defaults: function (detail, u) {
          var fallbackUid = Tagger.generate('');
          return Merger.deepMerge(
            {
              uid: fallbackUid
            },
            u
          );
        },
        overrides: function (detail, u) {
          return {
            type: u.type,
            ignoreFocus: detail.fakeFocus(),
            domModification: {
              classes: [ detail.markers().item() ]
            }
          };
        }
      })
    ];

    var schema = [
      FieldSchema.strict('value'),
      FieldSchema.strict('items'),
      FieldSchema.strict('dom'),
      FieldSchema.strict('components'),
      FieldSchema.defaulted('eventOrder', { }),
      FieldSchema.defaulted('menuBehaviours', { }),


      FieldSchema.defaultedOf('movement', {
        mode: 'menu',
        moveOnTab: true
      }, ValueSchema.choose(
        'mode',
        {
          grid: [
            Fields.initSize(),
            Fields.output('config', configureGrid)
          ],
          menu: [
            FieldSchema.defaulted('moveOnTab', true),
            Fields.output('config', configureMenu)
          ]
        }
      )),

      Fields.itemMarkers(),

      FieldSchema.defaulted('fakeFocus', false),
      FieldSchema.defaulted('focusManager', FocusManagers.dom()),
      Fields.onHandler('onHighlight')
    ];

    return {
      name: Fun.constant('Menu'),
      schema: Fun.constant(schema),
      parts: Fun.constant(parts)
    };
  }
);
define(
  'ephox.alloy.menu.util.MenuEvents',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var focusEvent = 'alloy.menu-focus';

    return {
      focus: Fun.constant(focusEvent)
    };
  }
);
define(
  'ephox.alloy.ui.single.MenuSpec',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.alloy.menu.util.MenuEvents',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'global!Error'
  ],

  function (Behaviour, Composing, Highlighting, Keying, Representing, AlloyEvents, AlloyTriggers, ItemEvents, MenuEvents, Fun, Merger, Error) {
    var make = function (detail, components, spec, externals) {
      return Merger.deepMerge(
        {
          dom: Merger.deepMerge(
            detail.dom(),
            {
              attributes: {
                role: 'menu'
              }
            }
          ),
          uid: detail.uid(),

          behaviours: Merger.deepMerge(
            Behaviour.derive([
              Highlighting.config({
                // Highlighting for a menu is selecting items inside the menu
                highlightClass: detail.markers().selectedItem(),
                itemClass: detail.markers().item(),
                onHighlight: detail.onHighlight()
              }),
              Representing.config({
                store: {
                  mode: 'memory',
                  initialValue: detail.value()
                }
              }),
              // FIX: Is this used? It has the wrong return type.
              Composing.config({
                find: Fun.identity
              }),
              Keying.config(detail.movement().config()(detail, detail.movement()))
            ]),
            detail.menuBehaviours()
          ),
          events: AlloyEvents.derive([
            // This is dispatched from a menu to tell an item to be highlighted.
            AlloyEvents.run(ItemEvents.focus(), function (menu, simulatedEvent) {
              // Highlight the item
              var event = simulatedEvent.event();
              menu.getSystem().getByDom(event.target()).each(function (item) {
                Highlighting.highlight(menu, item);

                simulatedEvent.stop();

                // Trigger the focus event on the menu.
                AlloyTriggers.emitWith(menu, MenuEvents.focus(), { menu: menu, item: item });
              });
            }),

            // Highlight the item that the cursor is over. The onHighlight
            // code needs to handle updating focus if required
            AlloyEvents.run(ItemEvents.hover(), function (menu, simulatedEvent) {
              var item = simulatedEvent.event().item();
              Highlighting.highlight(menu, item);
            })
          ]),
          components: components,
          eventOrder: detail.eventOrder()
        }
      );
    };

    return {
      make: make
    };
  }
);
define(
  'ephox.alloy.api.ui.Menu',

  [
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.schema.MenuSchema',
    'ephox.alloy.ui.single.MenuSpec'
  ],

  function (Sketcher, MenuSchema, MenuSpec) {
    return Sketcher.composite({
      name: 'Menu',
      configFields: MenuSchema.schema(),
      partFields: MenuSchema.parts(),
      factory: MenuSpec.make
    });
  }
);
define(
  'ephox.alloy.alien.AriaFocus',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.search.PredicateFind',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Option, Compare, Focus, PredicateFind, Traverse) {
    var preserve = function (f, container) {
      var ownerDoc = Traverse.owner(container);

      var refocus = Focus.active(ownerDoc).bind(function (focused) {
        var hasFocus = function (elem) {
          return Compare.eq(focused, elem);
        };
        return hasFocus(container) ? Option.some(container) : PredicateFind.descendant(container, hasFocus);
      });

      var result = f(container);

      // If there is a focussed element, the F function may cause focus to be lost (such as by hiding elements). Restore it afterwards.
      refocus.each(function (oldFocus) {
        Focus.active(ownerDoc).filter(function (newFocus) {
          return Compare.eq(newFocus, oldFocus);
        }).orThunk(function () {
          // Only refocus if the focus has changed, otherwise we break IE
          Focus.focus(oldFocus);
        });
      });
      return result;
    };

    return {
      preserve: preserve
    };
  }
);
define(
  'ephox.alloy.behaviour.replacing.ReplaceApis',

  [
    'ephox.alloy.alien.AriaFocus',
    'ephox.alloy.api.system.Attachment',
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Insert'
  ],

  function (AriaFocus, Attachment, Arr, Compare, Insert) {
    var set = function (component, replaceConfig, replaceState, data) {
      Attachment.detachChildren(component);

      // NOTE: we may want to create a behaviour which allows you to switch
      // between predefined layouts, which would make a noop detection easier.
      // Until then, we'll just use AriaFocus like redesigning does.
      AriaFocus.preserve(function () {
        var children = Arr.map(data, component.getSystem().build);

        Arr.each(children, function (l) {
          Attachment.attach(component, l);
        });
      }, component.element());
    };

    var insert = function (component, replaceConfig, insertion, childSpec) {
      var child = component.getSystem().build(childSpec);
      Attachment.attachWith(component, child, insertion);
    };

    var append = function (component, replaceConfig, replaceState, appendee) {
      insert(component, replaceConfig, Insert.append, appendee);
    };

    var prepend = function (component, replaceConfig, replaceState, prependee) {
      insert(component, replaceConfig, Insert.prepend, prependee);
    };

    // NOTE: Removee is going to be a component, not a spec.
    var remove = function (component, replaceConfig, replaceState, removee) {
      var children = contents(component, replaceConfig);
      var foundChild = Arr.find(children, function (child) {
        return Compare.eq(removee.element(), child.element());
      });

      foundChild.each(Attachment.detach);
    };

    // TODO: Rename
    var contents = function (component, replaceConfig/*, replaceState */) {
      return component.components();
    };

    return {
      append: append,
      prepend: prepend,
      remove: remove,
      set: set,
      contents: contents
    };
  }
);
define(
  'ephox.alloy.api.behaviour.Replacing',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.replacing.ReplaceApis'
  ],

  function (Behaviour, ReplaceApis) {
    return Behaviour.create({
      fields: [ ],
      name: 'replacing',
      apis: ReplaceApis
    });
  }
);
define(
  'ephox.alloy.menu.layered.MenuPathing',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option'
  ],

  function (Objects, Arr, Obj, Option) {
    var transpose = function (obj) {
      // Assumes no duplicate fields.
      return Obj.tupleMap(obj, function (v, k) {
        return { k: v, v: k };
      });
    };
    var trace = function (items, byItem, byMenu, finish) {
      // Given a finishing submenu (which will be the value of expansions),
      // find the triggering item, find its menu, and repeat the process. If there
      // is no triggering item, we are done.
      return Objects.readOptFrom(byMenu, finish).bind(function (triggerItem) {
        return Objects.readOptFrom(items, triggerItem).bind(function (triggerMenu) {
          var rest = trace(items, byItem, byMenu, triggerMenu);
          return Option.some([ triggerMenu ].concat(rest));
        });
      }).getOr([ ]);
    };

    var generate = function (menus, expansions) {
      var items = { };
      Obj.each(menus, function (menuItems, menu) {
        Arr.each(menuItems, function (item) {
          items[item] = menu;
        });
      });

      var byItem = expansions;
      var byMenu = transpose(expansions);

      var menuPaths = Obj.map(byMenu, function (triggerItem, submenu) {
        return [ submenu ].concat(trace(items, byItem, byMenu, submenu));
      });

      return Obj.map(items, function (path) {
        return Objects.readOptFrom(menuPaths, path).getOr([ path ]);
      });
    };

    return {
      generate: generate
    };
  }
);
define(
  'ephox.alloy.menu.layered.LayeredState',

  [
    'ephox.alloy.menu.layered.MenuPathing',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Cell'
  ],

  function (MenuPathing, Objects, Arr, Obj, Fun, Option, Cell) {
    return function () {
      var expansions = Cell({ });
      var menus = Cell({ });
      var paths = Cell({ });
      var primary = Cell(Option.none());

      // Probably think of a better way to store this information.
      var toItemValues = Cell(
        Fun.constant([ ])
      );

      var clear = function () {
        expansions.set({});
        menus.set({});
        paths.set({});
        primary.set(Option.none());
      };

      var isClear = function () {
        return primary.get().isNone();
      };

      var setContents = function (sPrimary, sMenus, sExpansions, sToItemValues) {
        primary.set(Option.some(sPrimary));
        expansions.set(sExpansions);
        menus.set(sMenus);
        toItemValues.set(sToItemValues);
        var menuValues = sToItemValues(sMenus);
        var sPaths = MenuPathing.generate(menuValues, sExpansions);
        paths.set(sPaths);
      };

      var expand = function (itemValue) {
        return Objects.readOptFrom(expansions.get(), itemValue).map(function (menu) {
          var current = Objects.readOptFrom(paths.get(), itemValue).getOr([ ]);
          return [ menu ].concat(current);
        });
      };

      var collapse = function (itemValue) {
        // Look up which key has the itemValue
        return Objects.readOptFrom(paths.get(), itemValue).bind(function (path) {
          return path.length > 1 ? Option.some(path.slice(1)) : Option.none();
        });
      };

      var refresh = function (itemValue) {
        return Objects.readOptFrom(paths.get(), itemValue);
      };

      var lookupMenu = function (menuValue) {
        return Objects.readOptFrom(
          menus.get(),
          menuValue
        );
      };

      var otherMenus = function (path) {
        var menuValues = toItemValues.get()(menus.get());
        return Arr.difference(Obj.keys(menuValues), path);
      };

      var getPrimary = function () {
        return primary.get().bind(lookupMenu);
      };

      var getMenus = function () {
        return menus.get();
      };

      return {
        setContents: setContents,
        expand: expand,
        refresh: refresh,
        collapse: collapse,
        lookupMenu: lookupMenu,
        otherMenus: otherMenus,
        getPrimary: getPrimary,
        getMenus: getMenus,
        clear: clear,
        isClear: isClear
      };
    };
  }
);
define(
  'ephox.alloy.ui.single.TieredMenuSpec',

  [
    'ephox.alloy.alien.EditableFields',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Composing',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.api.focus.FocusManagers',
    'ephox.alloy.api.ui.Menu',
    'ephox.alloy.menu.layered.LayeredState',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.alloy.menu.util.MenuEvents',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Options',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (
    EditableFields, Behaviour, Composing, Highlighting, Keying, Replacing, Representing, GuiFactory, AlloyEvents, AlloyTriggers, SystemEvents, FocusManagers,
    Menu, LayeredState, ItemEvents, MenuEvents, Objects, Arr, Fun, Merger, Obj, Option, Options, Body, Class, Classes, SelectorFind
  ) {
    var make = function (detail, rawUiSpec) {
      var buildMenus = function (container, menus) {
        return Obj.map(menus, function (spec, name) {
          var data = Menu.sketch(
            Merger.deepMerge(
              spec,
              {
                value: name,
                items: spec.items,
                markers: Objects.narrow(rawUiSpec.markers, [ 'item', 'selectedItem' ]),

                // Fake focus.
                fakeFocus: detail.fakeFocus(),
                onHighlight: detail.onHighlight(),


                focusManager: detail.fakeFocus() ? FocusManagers.highlights() : FocusManagers.dom()
              }
            )
          );

          return container.getSystem().build(data);
        });
      };

      var state = LayeredState();

      var setup = function (container) {
        var componentMap = buildMenus(container, detail.data().menus());
        state.setContents(detail.data().primary(), componentMap, detail.data().expansions(), function (sMenus) {
          return toMenuValues(container, sMenus);
        });

        return state.getPrimary();
      };

      var getItemValue = function (item) {
        return Representing.getValue(item).value;
      };

      var toMenuValues = function (container, sMenus) {
        return Obj.map(detail.data().menus(), function (data, menuName) {
          return Arr.bind(data.items, function (item) {
            return item.type === 'separator' ? [ ] : [ item.data.value ];
          });
        });
      };

      var setActiveMenu = function (container, menu) {
        Highlighting.highlight(container, menu);
        Highlighting.getHighlighted(menu).orThunk(function () {
          return Highlighting.getFirst(menu);
        }).each(function (item) {
          AlloyTriggers.dispatch(container, item.element(), SystemEvents.focusItem());
        });
      };

      var getMenus = function (state, menuValues) {
        return Options.cat(
          Arr.map(menuValues, state.lookupMenu)
        );
      };

      var updateMenuPath = function (container, state, path) {
        return Option.from(path[0]).bind(state.lookupMenu).map(function (activeMenu) {
          var rest = getMenus(state, path.slice(1));
          Arr.each(rest, function (r) {
            Class.add(r.element(), detail.markers().backgroundMenu());
          });

          if (! Body.inBody(activeMenu.element())) {
            Replacing.append(container, GuiFactory.premade(activeMenu));
          }

          // Remove the background-menu class from the active menu
          Classes.remove(activeMenu.element(), [ detail.markers().backgroundMenu() ]);
          setActiveMenu(container, activeMenu);
          var others = getMenus(state, state.otherMenus(path));
          Arr.each(others, function (o) {
            // May not need to do the active menu thing.
            Classes.remove(o.element(), [ detail.markers().backgroundMenu() ]);
            if (! detail.stayInDom()) Replacing.remove(container, o);
          });
          
          return activeMenu;
        });

      };

      var expandRight = function (container, item) {
        var value = getItemValue(item);
        return state.expand(value).bind(function (path) {
          // When expanding, always select the first.
          Option.from(path[0]).bind(state.lookupMenu).each(function (activeMenu) {
            // DUPE with above. Fix later.
            if (! Body.inBody(activeMenu.element())) {
              Replacing.append(container, GuiFactory.premade(activeMenu));
            }

            detail.onOpenSubmenu()(container, item, activeMenu);
            Highlighting.highlightFirst(activeMenu);
          });

          return updateMenuPath(container, state, path);
        });
      };

      var collapseLeft = function (container, item) {
        var value = getItemValue(item);
        return state.collapse(value).bind(function (path) {
          return updateMenuPath(container, state, path).map(function (activeMenu) {
            detail.onCollapseMenu()(container, item, activeMenu);
            return activeMenu;
          });
        });
      };

      var updateView = function (container, item) {
        var value = getItemValue(item);
        return state.refresh(value).bind(function (path) {
          return updateMenuPath(container, state, path);
        });
      };

      var onRight = function (container, item) {
        return EditableFields.inside(item.element()) ? Option.none() : expandRight(container, item);
      };

      var onLeft = function (container, item) {
        // Exclude inputs, textareas etc.
        return EditableFields.inside(item.element()) ? Option.none() : collapseLeft(container, item);
      };

      var onEscape = function (container, item) {
        return collapseLeft(container, item).orThunk(function () {
          return detail.onEscape()(container, item);
        // This should only fire when the user presses ESC ... not any other close.
          // return HotspotViews.onEscape(detail.lazyAnchor()(), container);
        });
      };

      var keyOnItem = function (f) {
        return function (container, simulatedEvent) {
          return SelectorFind.closest(simulatedEvent.getSource(), '.' + detail.markers().item()).bind(function (target) {
            return container.getSystem().getByDom(target).bind(function (item) {
              return f(container, item);
            });
          });
        };
      };

      var events = AlloyEvents.derive([
        // Set "active-menu" for the menu with focus
        AlloyEvents.run(MenuEvents.focus(), function (sandbox, simulatedEvent) {
          var menu = simulatedEvent.event().menu();
          Highlighting.highlight(sandbox, menu);
        }),

        
        AlloyEvents.runOnExecute(function (sandbox, simulatedEvent) {
          // Trigger on execute on the targeted element
          // I.e. clicking on menu item
          var target = simulatedEvent.event().target();
          return sandbox.getSystem().getByDom(target).bind(function (item) {
            var itemValue = getItemValue(item);
            if (itemValue.indexOf('collapse-item') === 0) {
              return collapseLeft(sandbox, item);
            }


            return expandRight(sandbox, item).orThunk(function () {
              return detail.onExecute()(sandbox, item);
            });
          });
        }),

        // Open the menu as soon as it is added to the DOM
        AlloyEvents.runOnAttached(function (container, simulatedEvent) {
          setup(container).each(function (primary) {
            Replacing.append(container, GuiFactory.premade(primary));

            if (detail.openImmediately()) {
              setActiveMenu(container, primary);
              detail.onOpenMenu()(container, primary);
            }
          });
        })
      ].concat(detail.navigateOnHover() ? [
        // Hide any irrelevant submenus and expand any submenus based
        // on hovered item
        AlloyEvents.run(ItemEvents.hover(), function (sandbox, simulatedEvent) {
          var item = simulatedEvent.event().item();
          updateView(sandbox, item);
          expandRight(sandbox, item);
          detail.onHover()(sandbox, item);
        })
      ] : [ ]));

      var collapseMenuApi = function (container) {
        Highlighting.getHighlighted(container).each(function (currentMenu) {
          Highlighting.getHighlighted(currentMenu).each(function (currentItem) {
            collapseLeft(container, currentItem);
          });
        });
      };

      return {
        uid: detail.uid(),
        dom: detail.dom(),
        behaviours: Merger.deepMerge(
          Behaviour.derive([
            Keying.config({
              mode: 'special',
              onRight: keyOnItem(onRight),
              onLeft: keyOnItem(onLeft),
              onEscape: keyOnItem(onEscape),
              focusIn: function (container, keyInfo) {
                state.getPrimary().each(function (primary) {
                  AlloyTriggers.dispatch(container, primary.element(), SystemEvents.focusItem());
                });
              }
            }),
            // Highlighting is used for highlighting the active menu
            Highlighting.config({
              highlightClass: detail.markers().selectedMenu(),
              itemClass: detail.markers().menu()
            }),
            Composing.config({
              find: function (container) {
                return Highlighting.getHighlighted(container);
              }
            }),
            Replacing.config({ })
          ]),
          detail.tmenuBehaviours()
        ),
        eventOrder: detail.eventOrder(),
        apis: {
          collapseMenu: collapseMenuApi
        },
        events: events
      };
    };

    return {
      make: make,
      collapseItem: Fun.constant('collapse-item')
    };
  }
);
define(
  'ephox.alloy.api.ui.TieredMenu',

  [
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.data.Fields',
    'ephox.alloy.ui.single.TieredMenuSpec',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Id'
  ],

  function (Sketcher, Fields, TieredMenuSpec, FieldSchema, Objects, Id) {
    var tieredData = function (primary, menus, expansions) {
      return {
        primary: primary,
        menus: menus,
        expansions: expansions
      };
    };

    var singleData = function (name, menu) {
      return {
        primary: name,
        menus: Objects.wrap(name, menu),
        expansions: { }
      };
    };

    var collapseItem = function (text) {
      return {
        value: Id.generate(TieredMenuSpec.collapseItem()),
        text: text
      };
    };

    return Sketcher.single({
      name: 'TieredMenu',
      configFields: [
        Fields.onStrictKeyboardHandler('onExecute'),
        Fields.onStrictKeyboardHandler('onEscape'),

        Fields.onStrictHandler('onOpenMenu'),
        Fields.onStrictHandler('onOpenSubmenu'),
        Fields.onHandler('onCollapseMenu'),

        FieldSchema.defaulted('openImmediately', true),

        FieldSchema.strictObjOf('data', [
          FieldSchema.strict('primary'),
          FieldSchema.strict('menus'),
          FieldSchema.strict('expansions')
        ]),

        FieldSchema.defaulted('fakeFocus', false),
        Fields.onHandler('onHighlight'),
        Fields.onHandler('onHover'),
        Fields.tieredMenuMarkers(),


        FieldSchema.strict('dom'),

        FieldSchema.defaulted('navigateOnHover', true),
        FieldSchema.defaulted('stayInDom', false),

        FieldSchema.defaulted('tmenuBehaviours', { }),
        FieldSchema.defaulted('eventOrder', { })
      ],

      apis: {
        collapseMenu: function (apis, tmenu) {
          apis.collapseMenu(tmenu);
        }
      },

      factory: TieredMenuSpec.make,

      extraApis: {
        tieredData: tieredData,
        singleData: singleData,
        collapseItem: collapseItem
      }
    });
  }
);
define(
  'tinymce.themes.mobile.touch.scroll.Scrollable',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Class',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (Fun, Class, Styles) {
    var scrollable = Styles.resolve('scrollable');

    var register = function (element) {
    /*
     *  The reason this function exists is to have a
     *  central place where to set if an element can be explicitly
     *  scrolled. This is for mobile devices atm.
     */
      Class.add(element, scrollable);
    };

    var deregister = function (element) {
      Class.remove(element, scrollable);
    };

    return {
      register: register,
      deregister: deregister,
      scrollable: Fun.constant(scrollable)
    };
  }
);

define(
  'tinymce.themes.mobile.ui.StylesMenu',

  [
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.behaviour.Transitioning',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Menu',
    'ephox.alloy.api.ui.TieredMenu',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Obj',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.SelectorFind',
    'ephox.sugar.api.view.Width',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.scroll.Scrollable'
  ],

  function (
    AddEventsBehaviour, Behaviour, Representing, Toggling, Transitioning, GuiFactory, Memento,
    AlloyEvents, Button, Menu, TieredMenu, Objects, Arr, Merger, Obj, Css, SelectorFind,
    Width, Receivers, Styles, Scrollable
  ) {

    var getValue = function (item) {
      return Objects.readOptFrom(item, 'format').getOr(item.title);
    };

    var convert = function (formats, memMenuThunk) {
      var mainMenu = makeMenu('Styles', [
      ].concat(
        Arr.map(formats.items, function (k) {
          return makeItem(getValue(k), k.title, k.isSelected(), k.getPreview(), Objects.hasKey(formats.expansions, getValue(k)));
        })
      ), memMenuThunk, false);

      var submenus = Obj.map(formats.menus, function (menuItems, menuName) {
        var items = Arr.map(menuItems, function (item) {
          return makeItem(
            getValue(item),
            item.title,
            item.isSelected !== undefined ? item.isSelected() : false,
            item.getPreview !== undefined ? item.getPreview() : '',
            Objects.hasKey(formats.expansions, getValue(item))
          );
        });
        return makeMenu(menuName, items, memMenuThunk, true);
      });

      var menus = Merger.deepMerge(submenus, Objects.wrap('styles', mainMenu));


      var tmenu = TieredMenu.tieredData('styles', menus, formats.expansions);

      return {
        tmenu: tmenu
      };
    };

    var makeItem = function (value, text, selected, preview, isMenu) {
      return {
        data: {
          value: value,
          text: text
        },
        type: 'item',
        dom: {
          tag: 'div',
          classes: isMenu ? [ Styles.resolve('styles-item-is-menu') ] : [ ]
        },
        toggling: {
          toggleOnExecute: false,
          toggleClass: Styles.resolve('format-matches'),
          selected: selected
        },
        itemBehaviours: Behaviour.derive(isMenu ? [ ] : [
          Receivers.format(value, function (comp, status) {
            var toggle = status ? Toggling.on : Toggling.off;
            toggle(comp);
          })
        ]),
        components: [
          {
            dom: {
              tag: 'div',
              attributes: {
                style: preview
              },
              innerHtml: text
            }
          }
        ]
      };
    };

    var makeMenu = function (value, items, memMenuThunk, collapsable) {
      return {
        value: value,
        dom: {
          tag: 'div'
        },
        components: [
          Button.sketch({
            dom: {
              tag: 'div',
              classes: [ Styles.resolve('styles-collapser') ]
            },
            components: collapsable ? [
              {
                dom: {
                  tag: 'span',
                  classes: [ Styles.resolve('styles-collapse-icon') ]
                }
              },
              GuiFactory.text(value)
            ] : [ GuiFactory.text(value) ],
            action: function (item) {
              if (collapsable) {
                var comp = memMenuThunk().get(item);
                TieredMenu.collapseMenu(comp);
              }
            }
          }),
          {
            dom: {
              tag: 'div',
              classes: [ Styles.resolve('styles-menu-items-container') ]
            },
            components: [
              Menu.parts().items({ })
            ],

            behaviours: Behaviour.derive([
              AddEventsBehaviour.config('adhoc-scrollable-menu', [
                AlloyEvents.runOnAttached(function (component, simulatedEvent) {
                  Css.set(component.element(), 'overflow-y', 'auto');
                  Css.set(component.element(), '-webkit-overflow-scrolling', 'touch');
                  Scrollable.register(component.element());
                }),

                AlloyEvents.runOnDetached(function (component) {
                  Css.remove(component.element(), 'overflow-y');
                  Css.remove(component.element(), '-webkit-overflow-scrolling');
                  Scrollable.deregister(component.element());
                })
              ])
            ])
          }
        ],
        items: items,
        menuBehaviours: Behaviour.derive([
          Transitioning.config({
            initialState: 'after',
            routes: Transitioning.createTristate('before', 'current', 'after', {
              transition: {
                property: 'transform',
                transitionClass: 'transitioning'
              }
            })
          })
        ])
      };
    };

    var sketch = function (settings) {
      var dataset = convert(settings.formats, function () {
        return memMenu;
      });
      // Turn settings into a tiered menu data.

      var memMenu = Memento.record(TieredMenu.sketch({
        dom: {
          tag: 'div',
          classes: [ Styles.resolve('styles-menu') ]
        },
        components: [ ],

        // Focus causes issues when the things being focused are offscreen.
        fakeFocus: true,
        // For animations, need things to stay around in the DOM (at least until animation is done)
        stayInDom: true,

        onExecute: function (tmenu, item) {
          var v = Representing.getValue(item);
          settings.handle(item, v.value);
        },
        onEscape: function () {
        },
        onOpenMenu: function (container, menu) {
          var w = Width.get(container.element());
          Width.set(menu.element(), w);
          Transitioning.jumpTo(menu, 'current');
        },
        onOpenSubmenu: function (container, item, submenu) {
          var w = Width.get(container.element());
          var menu = SelectorFind.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
          var menuComp = container.getSystem().getByDom(menu).getOrDie();

          Width.set(submenu.element(), w);

          Transitioning.progressTo(menuComp, 'before');
          Transitioning.jumpTo(submenu, 'after');
          Transitioning.progressTo(submenu, 'current');
        },

        onCollapseMenu: function (container, item, menu) {
          var submenu = SelectorFind.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
          var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
          Transitioning.progressTo(submenuComp, 'after');
          Transitioning.progressTo(menu, 'current');
        },

        navigateOnHover: false,

        openImmediately: true,
        data: dataset.tmenu,

        markers: {
          backgroundMenu: Styles.resolve('styles-background-menu'),
          menu: Styles.resolve('styles-menu'),
          selectedMenu: Styles.resolve('styles-selected-menu'),
          item: Styles.resolve('styles-item'),
          selectedItem: Styles.resolve('styles-selected-item')
        }
      }));

      return memMenu.asSpec();
    };

    return {
      sketch: sketch
    };
  }
);

define(
  'tinymce.themes.mobile.util.StyleConversions',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Merger'
  ],

  function (Objects, Arr, Merger) {

    var getFromExpandingItem = function (item) {
      var newItem = Merger.deepMerge(
        Objects.exclude(item, [ 'items' ]),
        {
          menu: true
        }
      );

      var rest = expand(item.items, item.title);

      var newMenus = Merger.deepMerge(
        rest.menus,
        Objects.wrap(
          item.title,
          rest.items
        )
      );
      var newExpansions = Merger.deepMerge(
        rest.expansions,
        Objects.wrap(item.title, item.title)
      );

      return {
        item: newItem,
        menus: newMenus,
        expansions: newExpansions
      };
    };

    var getFromItem = function (item) {
      return Objects.hasKey(item, 'items') ? getFromExpandingItem(item) : {
        item: item,
        menus: { },
        expansions: { }
      };
    };

  
    // Takes items, and consolidates them into its return value
    var expand = function (items) {
      return Arr.foldr(items, function (acc, item) {
        var newData = getFromItem(item);
        return {
          menus: Merger.deepMerge(acc.menus, newData.menus),
          items: [ newData.item ].concat(acc.items),
          expansions: Merger.deepMerge(acc.expansions, newData.expansions)
        };
      }, {
        menus: { },
        expansions: { },
        items: [ ]
      });
    };

    return {
      expand: expand
    };
  }
);

define(
  'tinymce.themes.mobile.util.StyleFormats',

  [
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Id',
    'ephox.katamari.api.Merger',
    'tinymce.themes.mobile.features.DefaultStyleFormats',
    'tinymce.themes.mobile.ui.StylesMenu',
    'tinymce.themes.mobile.util.StyleConversions'
  ],

  function (Toggling, Objects, Arr, Fun, Id, Merger, DefaultStyleFormats, StylesMenu, StyleConversions) {
    var register = function (editor, settings) {

      var isSelectedFor = function (format) {
        return function () {
          return editor.formatter.match(format);
        };
      };

      var getPreview = function (format) {
        return function () {
          var styles = editor.formatter.getCssText(format);
          return styles;
        };
      };

      var enrichSupported = function (item) {
        return Merger.deepMerge(item, {
          isSelected: isSelectedFor(item.format),
          getPreview: getPreview(item.format)
        });
      };

      // Item that triggers a submenu
      var enrichMenu = function (item) {
        return Merger.deepMerge(item, {
          isSelected: Fun.constant(false),
          getPreview: Fun.constant('')
        });
      };

      var enrichCustom = function (item) {
        var formatName = Id.generate(item.title);
        var newItem = Merger.deepMerge(item, {
          format: formatName,
          isSelected: isSelectedFor(formatName),
          getPreview: getPreview(formatName)
        });
        editor.formatter.register(formatName, newItem);
        return newItem;
      };

      var formats = Objects.readOptFrom(settings, 'style_formats').getOr(DefaultStyleFormats);

      var doEnrich = function (items) {
        return Arr.map(items, function (item) {
          if (Objects.hasKey(item, 'items')) {
            var newItems = doEnrich(item.items);
            return Merger.deepMerge(
              enrichMenu(item),
              {
                items: newItems
              }
            );
          } else if (Objects.hasKey(item, 'format')) {
            return enrichSupported(item);
          } else {
            return enrichCustom(item);
          }
        });
      };

      return doEnrich(formats);
    };

    var prune = function (editor, formats) {

      var doPrune = function (items) {
        return Arr.bind(items, function (item) {
          if (item.items !== undefined) {
            var newItems = doPrune(item.items);
            return newItems.length > 0 ? [ item ] : [ ];
          } else {
            var keep = Objects.hasKey(item, 'format') ? editor.formatter.canApply(item.format) : true;
            return keep ? [ item ] : [ ];
          }
        });
      };

      var prunedItems = doPrune(formats);
      return StyleConversions.expand(prunedItems);
    };


    var ui = function (editor, formats, onDone) {
      var pruned = prune(editor, formats);

      return StylesMenu.sketch({
        formats: pruned,
        handle: function (item, value) {
          editor.undoManager.transact(function () {
            if (Toggling.isOn(item)) {
              editor.formatter.remove(value);
            } else {
              editor.formatter.apply(value);
            }
          });
          onDone();
        }
      });
    };

    return {
      register: register,
      ui: ui
    };
  }
);
define(
  'tinymce.themes.mobile.features.Features',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Receiving',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.Memento',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Type',
    'global!setTimeout',
    'global!window',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.channels.TinyChannels',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.ui.Buttons',
    'tinymce.themes.mobile.ui.ColorSlider',
    'tinymce.themes.mobile.ui.FontSizeSlider',
    'tinymce.themes.mobile.ui.ImagePicker',
    'tinymce.themes.mobile.ui.LinkButton',
    'tinymce.themes.mobile.util.StyleFormats'
  ],

  function (
    Behaviour, Receiving, Toggling, Memento, Objects, Arr, Fun, Option, Type, setTimeout, window, Receivers, TinyChannels, Styles, Buttons, ColorSlider, FontSizeSlider,
    ImagePicker, LinkButton, StyleFormats
  ) {
    var defaults = [ 'undo', 'bold', 'italic', 'link', 'image', 'bullist', 'styleselect' ];

    var extract = function (rawToolbar) {
      // Ignoring groups
      var toolbar = rawToolbar.replace(/\|/g, ' ').trim();
      return toolbar.length > 0 ? toolbar.split(/\s+/) : [ ];
    };

    var identifyFromArray = function (toolbar) {
      return Arr.bind(toolbar, function (item) {
        return Type.isArray(item) ? identifyFromArray(item) : extract(item);
      });
    };

    var identify = function (settings) {
      // Firstly, flatten the toolbar
      var toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults;
      return Type.isArray(toolbar) ? identifyFromArray(toolbar) : extract(toolbar);
    };

    var setup = function (realm, editor) {
      var commandSketch = function (name) {
        return function () {
          return Buttons.forToolbarCommand(editor, name);
        };
      };

      var stateCommandSketch = function (name) {
        return function () {
          return Buttons.forToolbarStateCommand(editor, name);
        };
      };

      var actionSketch = function (name, query, action) {
        return function () {
          return Buttons.forToolbarStateAction(editor, name, query, action);
        };
      };

      var undo = commandSketch('undo');
      var redo = commandSketch('redo');
      var bold = stateCommandSketch('bold');
      var italic = stateCommandSketch('italic');
      var underline = stateCommandSketch('underline');
      var removeformat = commandSketch('removeformat');

      var link = function () {
        return LinkButton.sketch(realm, editor);
      };
      
      var unlink = actionSketch('unlink', 'link', function () {
        editor.execCommand('unlink', null, false);
      });
      var image = function () {
        return ImagePicker.sketch(editor);
      };

      var bullist = actionSketch('unordered-list', 'ul', function () {
        editor.execCommand('InsertUnorderedList', null, false);
      });

      var numlist = actionSketch('ordered-list', 'ol', function () {
        editor.execCommand('InsertOrderedList', null, false);
      });

      var fontsizeselect = function () {
        return FontSizeSlider.sketch(realm, editor);
      };

      var forecolor = function () {
        return ColorSlider.sketch(realm, editor);
      };

      var styleFormats = StyleFormats.register(editor, editor.settings);

      var styleFormatsMenu = function () {
        return StyleFormats.ui(editor, styleFormats, function () {
          editor.fire('scrollIntoView');
        });
      };

      var styleselect = function () {
        return Buttons.forToolbar('style-formats', function (button) {
          editor.fire('toReading');
          realm.dropup().appear(styleFormatsMenu, Toggling.on, button);
        }, Behaviour.derive([
          Toggling.config({
            toggleClass: Styles.resolve('toolbar-button-selected'),
            toggleOnExecute: false,
            aria: {
              mode: 'pressed'
            }
          }),
          Receiving.config({
            channels: Objects.wrapAll([
              Receivers.receive(TinyChannels.orientationChanged(), Toggling.off),
              Receivers.receive(TinyChannels.dropupDismissed(), Toggling.off)
            ])
          })
        ]));
      };

      var feature = function (prereq, sketch) {
        return {
          isSupported: function () {
            // NOTE: forall is true for none
            return prereq.forall(function (p) {
              return Objects.hasKey(editor.buttons, p);
            });
          },
          sketch: sketch
        };
      };

      return {
        undo: feature(Option.none(), undo),
        redo: feature(Option.none(), redo),
        bold: feature(Option.none(), bold),
        italic: feature(Option.none(), italic),
        underline: feature(Option.none(), underline),
        removeformat: feature(Option.none(), removeformat),
        link: feature(Option.none(), link),
        unlink: feature(Option.none(), unlink),
        image: feature(Option.none(), image),
        // NOTE: Requires "lists" plugin.
        bullist: feature(Option.some('bullist'), bullist),
        numlist: feature(Option.some('numlist'), numlist),
        fontsizeselect: feature(Option.none(), fontsizeselect),
        forecolor: feature(Option.none(), forecolor),
        styleselect: feature(Option.none(), styleselect)
      };
    };

    var detect = function (settings, features) {
      // Firstly, work out which items are in the toolbar
      var itemNames = identify(settings);

      // Now, build the list only including supported features and no duplicates.
      var present = { };
      return Arr.bind(itemNames, function (iName) {
        var r = !Objects.hasKey(present, iName) && Objects.hasKey(features, iName) && features[iName].isSupported() ? [ features[iName].sketch() ] : [];
        // NOTE: Could use fold to avoid mutation, but it might be overkill and not performant
        present[iName] = true;
        return r;
      });
    };

    return {
      identify: identify,
      setup: setup,
      detect: detect
    };
  }
);

define(
  'ephox.sugar.impl.FilteredEvent',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.node.Element'
  ],

  function (Fun, Element) {

    var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
      // switched from a struct to manual Fun.constant() because we are passing functions now, not just values
      return {
        'target':  Fun.constant(target),
        'x':       Fun.constant(x),
        'y':       Fun.constant(y),
        'stop':    stop,
        'prevent': prevent,
        'kill':    kill,
        'raw':     Fun.constant(raw)
      };
    };

    var handle = function (filter, handler) {
      return function (rawEvent) {
        if (!filter(rawEvent)) return;

        // IE9 minimum
        var target = Element.fromDom(rawEvent.target);

        var stop = function () {
          rawEvent.stopPropagation();
        };

        var prevent = function () {
          rawEvent.preventDefault();
        };

        var kill = Fun.compose(prevent, stop); // more of a sequence than a compose, but same effect

        // FIX: Don't just expose the raw event. Need to identify what needs standardisation.
        var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
        handler(evt);
      };
    };

    var binder = function (element, event, filter, handler, useCapture) {
      var wrapped = handle(filter, handler);
      // IE9 minimum
      element.dom().addEventListener(event, wrapped, useCapture);

      return {
        unbind: Fun.curry(unbind, element, event, wrapped, useCapture)
      };
    };

    var bind = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, false);
    };

    var capture = function (element, event, filter, handler) {
      return binder(element, event, filter, handler, true);
    };

    var unbind = function (element, event, handler, useCapture) {
      // IE9 minimum
      element.dom().removeEventListener(event, handler, useCapture);
    };

    return {
      bind: bind,
      capture: capture
    };
  }
);
define(
  'ephox.sugar.api.events.DomEvent',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.impl.FilteredEvent'
  ],

  function (Fun, FilteredEvent) {
    var filter = Fun.constant(true); // no filter on plain DomEvents

    var bind = function (element, event, handler) {
      return FilteredEvent.bind(element, event, filter, handler);
    };

    var capture = function (element, event, handler) {
      return FilteredEvent.capture(element, event, filter, handler);
    };

    return {
      bind: bind,
      capture: capture
    };
  }
);

defineGlobal("global!clearInterval", clearInterval);
defineGlobal("global!setInterval", setInterval);
define(
  'tinymce.themes.mobile.touch.view.Orientation',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'global!clearInterval',
    'global!Math',
    'global!setInterval'
  ],

  function (Fun, Option, PlatformDetection, DomEvent, Element, clearInterval, Math, setInterval) {
    var INTERVAL = 50;
    var INSURANCE = 1000 / INTERVAL;

    var get = function (outerWindow) {
      // We need to use this because the window shrinks due to an app keyboard,
      // width > height is no longer reliable.
      var isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches;
      return {
        isPortrait: Fun.constant(isPortrait)
      };
    };


    // In iOS the width of the window is not swapped properly when the device is
    // rotated causing problems.
    // getActualWidth will return the actual width of the window accurated with the
    // orientation of the device.
    var getActualWidth = function (outerWindow) {
      var isIos = PlatformDetection.detect().os.isiOS();
      var isPortrait = get(outerWindow).isPortrait();
      return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width;
    };

    var onChange = function (outerWindow, listeners) {
      var win = Element.fromDom(outerWindow);
      var poller = null;

      var change = function () {
        // If a developer is spamming orientation events in the simulator, clear our last check
        clearInterval(poller);

        var orientation = get(outerWindow);
        listeners.onChange(orientation);

        onAdjustment(function () {
          // We don't care about whether there was a resize or not.
          listeners.onReady(orientation);
        });
      };

      var orientationHandle = DomEvent.bind(win, 'orientationchange', change);

      var onAdjustment = function (f) {
        // If a developer is spamming orientation events in the simulator, clear our last check
        clearInterval(poller);

        var flag = outerWindow.innerHeight;
        var insurance = 0;
        poller = setInterval(function () {
          if (flag !== outerWindow.innerHeight) {
            clearInterval(poller);
            f(Option.some(outerWindow.innerHeight));
          } else if (insurance > INSURANCE) {
            clearInterval(poller);
            f(Option.none());
          }
          insurance++;
        }, INTERVAL);
      };

      var destroy = function () {
        orientationHandle.unbind();
      };

      return {
        onAdjustment: onAdjustment,
        destroy: destroy
      };
    };

    return {
      get: get,
      onChange: onChange,
      getActualWidth: getActualWidth
    };
  }
);
defineGlobal("global!clearTimeout", clearTimeout);
define(
  'ephox.alloy.alien.DelayedFunction',

  [
    'global!clearTimeout',
    'global!setTimeout'
  ],

  function (clearTimeout, setTimeout) {
    return function (fun, delay) {
      var ref = null;

      var schedule = function () {
        var args = arguments;
        ref = setTimeout(function () {
          fun.apply(null, args);
          ref = null;
        }, delay);
      };

      var cancel = function () {
        if (ref !== null) {
          clearTimeout(ref);
          ref = null;
        }
      };

      return {
        cancel: cancel,
        schedule: schedule
      };
    };
  }
);

define(
  'ephox.alloy.events.TapEvent',

  [
    'ephox.alloy.alien.DelayedFunction',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'global!Math'
  ],

  function (DelayedFunction, NativeEvents, SystemEvents, Objects, Cell, Fun, Option, Compare, Math) {
    var SIGNIFICANT_MOVE = 5;

    var LONGPRESS_DELAY = 400;

    var getTouch = function (event) {
      if (event.raw().touches === undefined || event.raw().touches.length !== 1) return Option.none();
      return Option.some(event.raw().touches[0]);
    };

    // Check to see if the touch has changed a *significant* amount
    var isFarEnough = function (touch, data) {
      var distX = Math.abs(touch.clientX - data.x());
      var distY = Math.abs(touch.clientY - data.y());
      return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
    };

    var monitor = function (settings) {
      /* A tap event is a combination of touchstart and touchend on the same element
       * without a *significant* touchmove in between.
       */

      // Need a return value, so can't use Singleton.value;
      var startData = Cell(Option.none());

      var longpress = DelayedFunction(function (event) {
        // Stop longpress firing a tap
        startData.set(Option.none());
        settings.triggerEvent(SystemEvents.longpress(), event);
      }, LONGPRESS_DELAY);

      var handleTouchstart = function (event) {
        getTouch(event).each(function (touch) {
          longpress.cancel();

          var data = {
            x: Fun.constant(touch.clientX),
            y: Fun.constant(touch.clientY),
            target: event.target
          };

          longpress.schedule(data);
          startData.set(Option.some(data));
        });
        return Option.none();
      };

      var handleTouchmove = function (event) {
        longpress.cancel();
        getTouch(event).each(function (touch) {
          startData.get().each(function (data) {
            if (isFarEnough(touch, data)) startData.set(Option.none());
          });
        });
        return Option.none();
      };

      var handleTouchend = function (event) {
        longpress.cancel();

        var isSame = function (data) {
          return Compare.eq(data.target(), event.target());
        };

        return startData.get().filter(isSame).map(function (data) {
          return settings.triggerEvent(SystemEvents.tap(), event);
        });
      };

      var handlers = Objects.wrapAll([
        { key: NativeEvents.touchstart(), value: handleTouchstart },
        { key: NativeEvents.touchmove(), value: handleTouchmove },
        { key: NativeEvents.touchend(), value: handleTouchend }
      ]);

      var fireIfReady = function (event, type) {
        return Objects.readOptFrom(handlers, type).bind(function (handler) {
          return handler(event);
        });
      };

      return {
        fireIfReady: fireIfReady
      };
    };

    return {
      monitor: monitor
    };
  }
);

define(
  'tinymce.themes.mobile.util.TappingEvent',

  [
    'ephox.alloy.events.TapEvent',
    'ephox.sugar.api.events.DomEvent'
  ],

  function (TapEvent, DomEvent) {
    // TODO: TapEvent needs to be exposed in alloy's API somehow
    var monitor = function (editorApi) {
      var tapEvent = TapEvent.monitor({
        triggerEvent: function (type, evt) {
          editorApi.onTapContent(evt);
        }
      });

      // convenience methods
      var onTouchend = function () {
        return DomEvent.bind(editorApi.body(), 'touchend', function (evt) {
          tapEvent.fireIfReady(evt, 'touchend');
        });
      };
      
      var onTouchmove = function () {
        return DomEvent.bind(editorApi.body(), 'touchmove', function (evt) {
          tapEvent.fireIfReady(evt, 'touchmove');
        });
      };

      var fireTouchstart = function (evt) {
        tapEvent.fireIfReady(evt, 'touchstart');
      };

      return {
        fireTouchstart: fireTouchstart,
        onTouchend: onTouchend,
        onTouchmove: onTouchmove
      };
    };

    return {
      monitor: monitor
    };
  }
);

define(
  'tinymce.themes.mobile.android.core.AndroidEvents',

  [
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.Traverse',
    'tinymce.themes.mobile.util.TappingEvent'
  ],

  function (Toggling, Arr, Fun, PlatformDetection, Compare, Focus, DomEvent, Element, Node, Traverse, TappingEvent) {

    var isAndroid6 = PlatformDetection.detect().os.version.major >= 6;
    /*

      `selectionchange` on the iframe document. If the selection is *ranged*, then we add the margin, because we
      assume that the context menu has appeared. If it is collapsed, then the context menu shouldn't appear
      (there is no selected text to format), so we reset the margin to `0px`. Note, when adding a margin,
      we add `23px` --- this is most likely based on trial and error. We may need to work out how to get
      this value properly.

      2. `select` on the outer document. This will also need to add the margin if the selection is ranged within
      an input or textarea

    */
    var initEvents = function (editorApi, toolstrip, alloy) {

      var tapping = TappingEvent.monitor(editorApi);
      var outerDoc = Traverse.owner(toolstrip);

      var isRanged = function (sel) {
        return !Compare.eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset();
      };

      var hasRangeInUi = function () {
        return Focus.active(outerDoc).filter(function (input) {
          return Node.name(input) === 'input';
        }).exists(function (input) {
          return input.dom().selectionStart !== input.dom().selectionEnd;
        });
      };

      var updateMargin = function () {
        var rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged);
        alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off);
      };

      var listeners = [
        DomEvent.bind(editorApi.body(), 'touchstart', function (evt) {
          editorApi.onTouchContent();
          tapping.fireTouchstart(evt);
        }),
        tapping.onTouchmove(),
        tapping.onTouchend(),

        DomEvent.bind(toolstrip, 'touchstart', function (evt) {
          editorApi.onTouchToolstrip();
        }),

        editorApi.onToReading(function () {
          Focus.blur(editorApi.body());
        }),
        editorApi.onToEditing(Fun.noop),

        // Scroll to cursor and update the iframe height
        editorApi.onScrollToCursor(function (tinyEvent) {
          tinyEvent.preventDefault();
          editorApi.getCursorBox().each(function (bounds) {
            var cWin = editorApi.win();
            // The goal here is to shift as little as required.
            var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
            var cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50/*EXTRA_SPACING*/ : 0;
            if (cScrollBy !== 0) {
              cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
            }         
          });
        })
      ].concat(
        isAndroid6 === true ? [ ] : [
          DomEvent.bind(Element.fromDom(editorApi.win()), 'blur', function () {
            alloy.getByDom(toolstrip).each(Toggling.off);
          }),
          DomEvent.bind(outerDoc, 'select', updateMargin),
          DomEvent.bind(editorApi.doc(), 'selectionchange', updateMargin)
        ]
      );

      var destroy = function () {
        Arr.each(listeners, function (l) {
          l.unbind();
        });
      };

      return {
        destroy: destroy
      };
    };

    return {
      initEvents: initEvents
    };
  }
);

define(
  'tinymce.themes.mobile.android.focus.ResumeEditing',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'global!setTimeout'
  ],

  function (Arr, Fun, Focus, Element, Node, setTimeout) {
    // There are numerous problems with Google Keyboard when we need to switch focus back from a toolbar item / dialog to
    // the content for editing. The major problem is to do with autocomplete. Android Google Keyboard (not Swift) seems to
    // remember the things that you've typed into the input, and then adds them to whatever you type in the content once you give it
    // focus, as long as the keyboard has stayed up.

    // We tried turning autocomplete off, and then turning it back on again with a setTimeout, and although it fixed the problem,
    // the autcomplete on didn't start working immediately. Maurizio also pointed out that it was probably keyboard specific
    // (and he was right) autocomplete off, and then turn it back on in an attempt to stop this happening. It works, but the
    // autocomplete on part takes a while to start working again.

    // Then we tried everyone's favourite setTimeout solution. This appears to work because it looks like the bug might
    // be caused by the fact that the autocomplete cache is maintained while in the same event queue. As soon as we
    // disconnect the stack, it looks like it is fixed. That makes some level of sense.
    var autocompleteHack = function (/* iBody */) {
      return function (f) {
        setTimeout(function () {
          f();
        }, 0);
      };
    };

    var resume = function (cWin) {
      cWin.focus();
      var iBody = Element.fromDom(cWin.document.body);

      var inInput = Focus.active().exists(function (elem) {
        return Arr.contains([ 'input', 'textarea' ], Node.name(elem));
      });

      var transaction = inInput ? autocompleteHack(iBody) : Fun.apply;

      transaction(function () {
        // If we don't blur before focusing the content, a previous focus in something like a statebutton
        // which represents the chosen font colour can stop the keyboard from appearing. Therefore, we blur
        // first.
        Focus.active().each(Focus.blur);
        Focus.focus(iBody);
      });
    };

    return {
      resume: resume
    };
  }
);

defineGlobal("global!isNaN", isNaN);
defineGlobal("global!parseInt", parseInt);
define(
  'tinymce.themes.mobile.util.DataAttributes',

  [
    'ephox.sugar.api.properties.Attr',
    'global!isNaN',
    'global!parseInt'
  ],

  function (Attr, isNaN, parseInt) {
    var safeParse = function (element, attribute) {
      var parsed = parseInt(Attr.get(element, attribute), 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    return {
      safeParse: safeParse
    };
  }
);
define(
  'ephox.sugar.impl.NodeValue',

  [
    'ephox.sand.api.PlatformDetection',
    'ephox.katamari.api.Option',
    'global!Error'
  ],

  function (PlatformDetection, Option, Error) {
    return function (is, name) {
      var get = function (element) {
        if (!is(element)) throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
        return getOption(element).getOr('');
      };

      var getOptionIE10 = function (element) {
        // Prevent IE10 from throwing exception when setting parent innerHTML clobbers (TBIO-451).
        try {
          return getOptionSafe(element);
        } catch (e) {
          return Option.none();
        }
      };

      var getOptionSafe = function (element) {
        return is(element) ? Option.from(element.dom().nodeValue) : Option.none();
      };

      var browser = PlatformDetection.detect().browser;
      var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;

      var set = function (element, value) {
        if (!is(element)) throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
        element.dom().nodeValue = value;
      };

      return {
        get: get,
        getOption: getOption,
        set: set
      };
    };
  }
);
define(
  'ephox.sugar.api.node.Text',

  [
    'ephox.sugar.api.node.Node',
    'ephox.sugar.impl.NodeValue'
  ],

  function (Node, NodeValue) {
    var api = NodeValue(Node.isText, 'text');

    var get = function (element) {
      return api.get(element);
    };

    var getOption = function (element) {
      return api.getOption(element);
    };

    var set = function (element, value) {
      api.set(element, value);
    };

    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }
);

define(
  'ephox.sugar.api.selection.Awareness',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.node.Text',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Arr, Node, Text, Traverse) {
    var getEnd = function (element) {
      return Node.name(element) === 'img' ? 1 : Text.getOption(element).fold(function () {
        return Traverse.children(element).length;
      }, function (v) {
        return v.length;
      });
    };

    var isEnd = function (element, offset) {
      return getEnd(element) === offset;
    };

    var isStart = function (element, offset) {
      return offset === 0;
    };

    var NBSP = '\u00A0';

    var isTextNodeWithCursorPosition = function (el) {
      return Text.getOption(el).filter(function (text) {
        // For the purposes of finding cursor positions only allow text nodes with content,
        // but trim removes &nbsp; and that's allowed
        return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
      }).isSome();
    };

    var elementsWithCursorPosition = [ 'img', 'br' ];
    var isCursorPosition = function (elem) {
      var hasCursorPosition = isTextNodeWithCursorPosition(elem);
      return hasCursorPosition || Arr.contains(elementsWithCursorPosition, Node.name(elem));
    };

    return {
      getEnd: getEnd,
      isEnd: isEnd,
      isStart: isStart,
      isCursorPosition: isCursorPosition
    };
  }
);

define(
  'ephox.sugar.api.selection.Selection',

  [
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Struct'
  ],

  function (Adt, Struct) {
    // Consider adding a type for "element"
    var type = Adt.generate([
      { domRange: [ 'rng' ] },
      { relative: [ 'startSitu', 'finishSitu' ] },
      { exact: [ 'start', 'soffset', 'finish', 'foffset' ] }
    ]);

    var range = Struct.immutable(
      'start',
      'soffset',
      'finish',
      'foffset'
    );

    var exactFromRange = function (simRange) {
      return type.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
    };

    return {
      domRange: type.domRange,
      relative: type.relative,
      exact: type.exact,

      exactFromRange: exactFromRange,
      range: range
    };
  }
);

define(
  'ephox.sugar.api.dom.DocumentPosition',

  [
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse'
  ],

  function (Compare, Element, Traverse) {
    var makeRange = function (start, soffset, finish, foffset) {
      var doc = Traverse.owner(start);

      // TODO: We need to think about a better place to put native range creation code. Does it even belong in sugar?
      // Could the `Compare` checks (node.compareDocumentPosition) handle these situations better?
      var rng = doc.dom().createRange();
      rng.setStart(start.dom(), soffset);
      rng.setEnd(finish.dom(), foffset);
      return rng;
    };

    // Return the deepest - or furthest down the document tree - Node that contains both boundary points
    // of the range (start:soffset, finish:foffset).
    var commonAncestorContainer = function (start, soffset, finish, foffset) {
      var r = makeRange(start, soffset, finish, foffset);
      return Element.fromDom(r.commonAncestorContainer);
    };

    var after = function (start, soffset, finish, foffset) {
      var r = makeRange(start, soffset, finish, foffset);

      var same = Compare.eq(start, finish) && soffset === foffset;
      return r.collapsed && !same;
    };

    return {
      after: after,
      commonAncestorContainer: commonAncestorContainer
    };
  }
);
define(
  'ephox.sugar.api.node.Fragment',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'global!document'
  ],

  function (Arr, Element, document) {
    var fromElements = function (elements, scope) {
      var doc = scope || document;
      var fragment = doc.createDocumentFragment();
      Arr.each(elements, function (element) {
        fragment.appendChild(element.dom());
      });
      return Element.fromDom(fragment);
    };

    return {
      fromElements: fromElements
    };
  }
);

define(
  'ephox.sugar.api.selection.Situ',

  [
    'ephox.katamari.api.Adt'
  ],

  function (Adt) {
    var adt = Adt.generate([
      { 'before': [ 'element' ] },
      { 'on': [ 'element', 'offset' ] },
      { after: [ 'element' ] }
    ]);

    // Probably don't need this given that we now have "match"
    var cata = function (subject, onBefore, onOn, onAfter) {
      return subject.fold(onBefore, onOn, onAfter);
    };

    return {
      before: adt.before,
      on: adt.on,
      after: adt.after,
      cata: cata
    };
  }
);

define(
  'ephox.sugar.selection.core.NativeRange',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element'
  ],

  function (Fun, Option, Compare, Element) {
    var selectNodeContents = function (win, element) {
      var rng = win.document.createRange();
      selectNodeContentsUsing(rng, element);
      return rng;
    };

    var selectNodeContentsUsing = function (rng, element) {
      rng.selectNodeContents(element.dom());
    };

    var isWithin = function (outerRange, innerRange) {
      // Adapted from: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
      return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 &&
        innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
    };

    var create = function (win) {
      return win.document.createRange();
    };

    // NOTE: Mutates the range.
    var setStart = function (rng, situ) {
      situ.fold(function (e) {
        rng.setStartBefore(e.dom());
      }, function (e, o) {
        rng.setStart(e.dom(), o);
      }, function (e) {
        rng.setStartAfter(e.dom());
      });
    };

    var setFinish = function (rng, situ) {
      situ.fold(function (e) {
        rng.setEndBefore(e.dom());
      }, function (e, o) {
        rng.setEnd(e.dom(), o);
      }, function (e) {
        rng.setEndAfter(e.dom());
      });
    };

    var replaceWith = function (rng, fragment) {
      // Note: this document fragment approach may not work on IE9.
      deleteContents(rng);
      rng.insertNode(fragment.dom());
    };

    var isCollapsed = function (start, soffset, finish, foffset) {
      return Compare.eq(start, finish) && soffset === foffset;
    };

    var relativeToNative = function (win, startSitu, finishSitu) {
      var range = win.document.createRange();
      setStart(range, startSitu);
      setFinish(range, finishSitu);
      return range;
    };

    var exactToNative = function (win, start, soffset, finish, foffset) {
      var rng = win.document.createRange();
      rng.setStart(start.dom(), soffset);
      rng.setEnd(finish.dom(), foffset);
      return rng;
    };

    var deleteContents = function (rng) {
      rng.deleteContents();
    };

    var cloneFragment = function (rng) {
      var fragment = rng.cloneContents();
      return Element.fromDom(fragment);
    };

    var toRect = function (rect) {
      return {
        left: Fun.constant(rect.left),
        top: Fun.constant(rect.top),
        right: Fun.constant(rect.right),
        bottom: Fun.constant(rect.bottom),
        width: Fun.constant(rect.width),
        height: Fun.constant(rect.height)
      };
    };
    
    var getFirstRect = function (rng) {
      var rects = rng.getClientRects();
      // ASSUMPTION: The first rectangle is the start of the selection
      var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0  ? Option.some(rect).map(toRect) : Option.none();
    };

    var getBounds = function (rng) {
      var rect = rng.getBoundingClientRect();
      return rect.width > 0 || rect.height > 0  ? Option.some(rect).map(toRect) : Option.none();
    };

    var toString = function (rng) {
      return rng.toString();
    };

    return {
      create: create,
      replaceWith: replaceWith,
      selectNodeContents: selectNodeContents,
      selectNodeContentsUsing: selectNodeContentsUsing,
      isCollapsed: isCollapsed,
      relativeToNative: relativeToNative,
      exactToNative: exactToNative,
      deleteContents: deleteContents,
      cloneFragment: cloneFragment,
      getFirstRect: getFirstRect,
      getBounds: getBounds,
      isWithin: isWithin,
      toString: toString
    };
  }
);

define(
  'ephox.sugar.selection.core.SelectionDirection',

  [
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Thunk',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.selection.core.NativeRange'
  ],

  function (Adt, Fun, Option, Thunk, Element, NativeRange) {
    var adt = Adt.generate([
      { ltr: [ 'start', 'soffset', 'finish', 'foffset' ] },
      { rtl: [ 'start', 'soffset', 'finish', 'foffset' ] }
    ]);

    var fromRange = function (win, type, range) {
      return type(Element.fromDom(range.startContainer), range.startOffset, Element.fromDom(range.endContainer), range.endOffset);
    };

    var getRanges = function (win, selection) {
      return selection.match({
        domRange: function (rng) {
          return {
            ltr: Fun.constant(rng),
            rtl: Option.none
          };
        },
        relative: function (startSitu, finishSitu) {
          return {
            ltr: Thunk.cached(function () {
              return NativeRange.relativeToNative(win, startSitu, finishSitu);
            }),
            rtl: Thunk.cached(function () {
              return Option.some(
                NativeRange.relativeToNative(win, finishSitu, startSitu)
              );
            })
          };
        },
        exact: function (start, soffset, finish, foffset) {
          return {
            ltr: Thunk.cached(function () {
              return NativeRange.exactToNative(win, start, soffset, finish, foffset);
            }),
            rtl: Thunk.cached(function () {
              return Option.some(
                NativeRange.exactToNative(win, finish, foffset, start, soffset)
              );
            })
          };
        }
      });
    };

    var doDiagnose = function (win, ranges) {
      // If we cannot create a ranged selection from start > finish, it could be RTL
      var rng = ranges.ltr();
      if (rng.collapsed) {
        // Let's check if it's RTL ... if it is, then reversing the direction will not be collapsed
        var reversed = ranges.rtl().filter(function (rev) {
          return rev.collapsed === false;
        });
        
        return reversed.map(function (rev) {
          // We need to use "reversed" here, because the original only has one point (collapsed)
          return adt.rtl(
            Element.fromDom(rev.endContainer), rev.endOffset,
            Element.fromDom(rev.startContainer), rev.startOffset  
          );
        }).getOrThunk(function () {
          return fromRange(win, adt.ltr, rng);
        });
      } else {
        return fromRange(win, adt.ltr, rng);
      }
    };

    var diagnose = function (win, selection) {
      var ranges = getRanges(win, selection);
      return doDiagnose(win, ranges);
    };

    var asLtrRange = function (win, selection) {
      var diagnosis = diagnose(win, selection);
      return diagnosis.match({
        ltr: function (start, soffset, finish, foffset) {
          var rng = win.document.createRange();
          rng.setStart(start.dom(), soffset);
          rng.setEnd(finish.dom(), foffset);
          return rng;
        },
        rtl: function (start, soffset, finish, foffset) {
          // NOTE: Reversing start and finish
          var rng = win.document.createRange();
          rng.setStart(finish.dom(), foffset);
          rng.setEnd(start.dom(), soffset);
          return rng;
        }
      });
    };

    return {
      ltr: adt.ltr,
      rtl: adt.rtl,
      diagnose: diagnose,
      asLtrRange: asLtrRange
    };
  }
);

define(
  'ephox.sugar.selection.alien.Geometry',

  [
    'global!Math'
  ],

  function (Math) {
    var searchForPoint = function (rectForOffset, x, y, maxX, length) {
      // easy cases
      if (length === 0) return 0;
      else if (x === maxX) return length - 1;

      var xDelta = maxX;

      // start at 1, zero is the fallback
      for (var i = 1; i < length; i++) {
        var rect = rectForOffset(i);
        var curDeltaX = Math.abs(x - rect.left);

        if (y > rect.bottom) {
          // range is too high, above drop point, do nothing
        } else if (y < rect.top || curDeltaX > xDelta) {
          // if the search winds up on the line below the drop point,
          // or we pass the best X offset,
          // wind back to the previous (best) delta
          return i - 1;
        } else {
          // update current search delta
          xDelta = curDeltaX;
        }
      }
      return 0; // always return something, even if it's not the exact offset it'll be better than nothing
    };

    var inRect = function (rect, x, y) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    return {
      inRect: inRect,
      searchForPoint: searchForPoint
    };

  }
);

define(
  'ephox.sugar.selection.query.TextPoint',

  [
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Options',
    'ephox.sugar.api.node.Text',
    'ephox.sugar.selection.alien.Geometry',
    'global!Math'
  ],

  function (Option, Options, Text, Geometry, Math) {
    var locateOffset = function (doc, textnode, x, y, rect) {
      var rangeForOffset = function (offset) {
        var r = doc.dom().createRange();
        r.setStart(textnode.dom(), offset);
        r.collapse(true);
        return r;
      };

      var rectForOffset = function (offset) {
        var r = rangeForOffset(offset);
        return r.getBoundingClientRect();
      };

      var length = Text.get(textnode).length;
      var offset = Geometry.searchForPoint(rectForOffset, x, y, rect.right, length);
      return rangeForOffset(offset);
    };

    var locate = function (doc, node, x, y) {
      var r = doc.dom().createRange();
      r.selectNode(node.dom());
      var rects = r.getClientRects();
      var foundRect = Options.findMap(rects, function (rect) {
        return Geometry.inRect(rect, x, y) ? Option.some(rect) : Option.none();
      });

      return foundRect.map(function (rect) {
        return locateOffset(doc, node, x, y, rect);
      });
    };

    return {
      locate: locate
    };
  }
);

define(
  'ephox.sugar.selection.query.ContainerPoint',

  [
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Options',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.selection.alien.Geometry',
    'ephox.sugar.selection.query.TextPoint',
    'global!Math'
  ],

  function (Option, Options, Node, Traverse, Geometry, TextPoint, Math) {
    /**
     * Future idea:
     *
     * This code requires the drop point to be contained within the nodes array somewhere. If it isn't,
     * we fall back to the extreme start or end of the node array contents.
     * This isn't really what the user intended.
     *
     * In theory, we could just find the range point closest to the boxes representing the node
     * (repartee does something similar).
     */

    var searchInChildren = function (doc, node, x, y) {
      var r = doc.dom().createRange();
      var nodes = Traverse.children(node);
      return Options.findMap(nodes, function (n) {
        // slight mutation because we assume creating ranges is expensive
        r.selectNode(n.dom());
        return Geometry.inRect(r.getBoundingClientRect(), x, y) ?
                locateNode(doc, n, x, y) :
                Option.none();
      });
    };

    var locateNode = function (doc, node, x, y) {
      var locator = Node.isText(node) ? TextPoint.locate : searchInChildren;
      return locator(doc, node, x, y);
    };

    var locate = function (doc, node, x, y) {
      var r = doc.dom().createRange();
      r.selectNode(node.dom());
      var rect = r.getBoundingClientRect();
      // Clamp x,y at the bounds of the node so that the locate function has SOME chance
      var boundedX = Math.max(rect.left, Math.min(rect.right, x));
      var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));

      return locateNode(doc, node, boundedX, boundedY);
    };

    return {
      locate: locate
    };
  }
);

define(
  'ephox.sugar.api.selection.CursorPosition',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.search.PredicateFind',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.Awareness'
  ],

  function (Option, PredicateFind, Traverse, Awareness) {
    var first = function (element) {
      return PredicateFind.descendant(element, Awareness.isCursorPosition);
    };

    var last = function (element) {
      return descendantRtl(element, Awareness.isCursorPosition);
    };

    // Note, sugar probably needs some RTL traversals.
    var descendantRtl = function (scope, predicate) {
      var descend = function (element) {
        var children = Traverse.children(element);
        for (var i = children.length - 1; i >= 0; i--) {
          var child = children[i];
          if (predicate(child)) return Option.some(child);
          var res = descend(child);
          if (res.isSome()) return res;
        }

        return Option.none();
      };

      return descend(scope);
    };

    return {
      first: first,
      last: last
    };
  }
);

define(
  'ephox.sugar.selection.query.EdgePoint',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.CursorPosition'
  ],

  function (Option, Traverse, CursorPosition) {
    /* 
     * When a node has children, we return either the first or the last cursor
     * position, whichever is closer horizontally
     * 
     * When a node has no children, we return the start of end of the element,
     * depending on which is closer horizontally
     * */

    // TODO: Make this RTL compatible
    var COLLAPSE_TO_LEFT = true;
    var COLLAPSE_TO_RIGHT = false;

    var getCollapseDirection = function (rect, x) {
      return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
    };

    var createCollapsedNode = function (doc, target, collapseDirection) {
      var r = doc.dom().createRange();
      r.selectNode(target.dom());
      r.collapse(collapseDirection);
      return r;
    };

    var locateInElement = function (doc, node, x) {
      var cursorRange = doc.dom().createRange();
      cursorRange.selectNode(node.dom());
      var rect = cursorRange.getBoundingClientRect();
      var collapseDirection = getCollapseDirection(rect, x);

      var f = collapseDirection === COLLAPSE_TO_LEFT ? CursorPosition.first : CursorPosition.last;
      return f(node).map(function (target) {
        return createCollapsedNode(doc, target, collapseDirection);
      });
    };

    var locateInEmpty = function (doc, node, x) {
      var rect = node.dom().getBoundingClientRect();
      var collapseDirection = getCollapseDirection(rect, x);
      return Option.some(createCollapsedNode(doc, node, collapseDirection));
    };

    var search = function (doc, node, x) {
      var f = Traverse.children(node).length === 0 ? locateInEmpty : locateInElement;
      return f(doc, node, x);
    };

    return {
      search: search
    };
  }
);

define(
  'ephox.sugar.selection.query.CaretRange',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.selection.query.ContainerPoint',
    'ephox.sugar.selection.query.EdgePoint',
    'global!document',
    'global!Math'
  ],

  function (Option, Element, Traverse, Selection, ContainerPoint, EdgePoint, document, Math) {
    var caretPositionFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
        // It turns out that Firefox can return null for pos.offsetNode
        if (pos.offsetNode === null) return Option.none();
        var r = doc.dom().createRange();
        r.setStart(pos.offsetNode, pos.offset);
        r.collapse();
        return Option.some(r);
      });
    };

    var caretRangeFromPoint = function (doc, x, y) {
      return Option.from(doc.dom().caretRangeFromPoint(x, y));
    };

    var searchTextNodes = function (doc, node, x, y) {
      var r = doc.dom().createRange();
      r.selectNode(node.dom());
      var rect = r.getBoundingClientRect();
      // Clamp x,y at the bounds of the node so that the locate function has SOME chance
      var boundedX = Math.max(rect.left, Math.min(rect.right, x));
      var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));

      return ContainerPoint.locate(doc, node, boundedX, boundedY);
    };

    var searchFromPoint = function (doc, x, y) {
      // elementFromPoint is defined to return null when there is no element at the point
      // This often happens when using IE10 event.y instead of event.clientY
      return Option.from(doc.dom().elementFromPoint(x, y)).map(Element.fromDom).bind(function (elem) {
        // used when the x,y position points to an image, or outside the bounds
        var fallback = function () {
          return EdgePoint.search(doc, elem, x);
        };

        return Traverse.children(elem).length === 0 ? fallback() :
                // if we have children, search for the right text node and then get the offset out of it
                searchTextNodes(doc, elem, x, y).orThunk(fallback);
      });
    };

    var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint :  // defined standard
                          document.caretRangeFromPoint ? caretRangeFromPoint :        // webkit implementation
                          searchFromPoint;                                            // fallback


    var fromPoint = function (win, x, y) {
      var doc = Element.fromDom(win.document);
      return availableSearch(doc, x, y).map(function (rng) {
        return Selection.range(
          Element.fromDom(rng.startContainer),
          rng.startOffset,
          Element.fromDom(rng.endContainer),
          rng.endOffset
        );
      });
    };

    return {
      fromPoint: fromPoint
    };
  }
);

define(
  'ephox.sugar.selection.query.Within',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.Selectors',
    'ephox.sugar.selection.core.NativeRange',
    'ephox.sugar.selection.core.SelectionDirection'
  ],

  function (Arr, Element, Node, SelectorFilter, Selectors, NativeRange, SelectionDirection) {
    var withinContainer = function (win, ancestor, outerRange, selector) {
      var innerRange = NativeRange.create(win);
      var self = Selectors.is(ancestor, selector) ? [ ancestor ] : [];
      var elements = self.concat(SelectorFilter.descendants(ancestor, selector));
      return Arr.filter(elements, function (elem) {
        // Mutate the selection to save creating new ranges each time
        NativeRange.selectNodeContentsUsing(innerRange, elem);
        return NativeRange.isWithin(outerRange, innerRange);
      });
    };

    var find = function (win, selection, selector) {
      // Reverse the selection if it is RTL when doing the comparison
      var outerRange = SelectionDirection.asLtrRange(win, selection);
      var ancestor = Element.fromDom(outerRange.commonAncestorContainer);
      // Note, this might need to change when we have to start looking for non elements.
      return Node.isElement(ancestor) ? 
        withinContainer(win, ancestor, outerRange, selector) : [];
    };

    return {
      find: find
    };
  }
);
define(
  'ephox.sugar.selection.quirks.Prefilter',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.api.selection.Situ'
  ],

  function (Arr, Node, Selection, Situ) {
    var beforeSpecial = function (element, offset) {
      // From memory, we don't want to use <br> directly on Firefox because it locks the keyboard input.
      // It turns out that <img> directly on IE locks the keyboard as well.
      // If the offset is 0, use before. If the offset is 1, use after.
      // TBIO-3889: Firefox Situ.on <input> results in a child of the <input>; Situ.before <input> results in platform inconsistencies
      var name = Node.name(element);
      if ('input' === name) return Situ.after(element);
      else if (!Arr.contains([ 'br', 'img' ], name)) return Situ.on(element, offset);
      else return offset === 0 ? Situ.before(element) : Situ.after(element);
    };

    var preprocess = function (startSitu, finishSitu) {
      var start = startSitu.fold(Situ.before, beforeSpecial, Situ.after);
      var finish = finishSitu.fold(Situ.before, beforeSpecial, Situ.after);
      return Selection.relative(start, finish);
    };

    return {
      beforeSpecial: beforeSpecial,
      preprocess: preprocess
    };
  }
);

define(
  'ephox.sugar.api.selection.WindowSelection',

  [
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.DocumentPosition',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Fragment',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.api.selection.Situ',
    'ephox.sugar.selection.core.NativeRange',
    'ephox.sugar.selection.core.SelectionDirection',
    'ephox.sugar.selection.query.CaretRange',
    'ephox.sugar.selection.query.Within',
    'ephox.sugar.selection.quirks.Prefilter'
  ],

  function (Option, DocumentPosition, Element, Fragment, Selection, Situ, NativeRange, SelectionDirection, CaretRange, Within, Prefilter) {
    var doSetNativeRange = function (win, rng) {
      var selection = win.getSelection();
      selection.removeAllRanges();
      selection.addRange(rng);
    };

    var doSetRange = function (win, start, soffset, finish, foffset) {
      var rng = NativeRange.exactToNative(win, start, soffset, finish, foffset);
      doSetNativeRange(win, rng);
    };

    var findWithin = function (win, selection, selector) {
      return Within.find(win, selection, selector);
    };

    var setExact = function (win, start, soffset, finish, foffset) {
      setRelative(win, Situ.on(start, soffset), Situ.on(finish, foffset));
    };

    var setRelative = function (win, startSitu, finishSitu) {
      var relative = Prefilter.preprocess(startSitu, finishSitu);

      return SelectionDirection.diagnose(win, relative).match({
        ltr: function (start, soffset, finish, foffset) {
          doSetRange(win, start, soffset, finish, foffset);
        },
        rtl: function (start, soffset, finish, foffset) {
          var selection = win.getSelection();
          // If this selection is backwards, then we need to use extend.
          if (selection.extend) {
            selection.collapse(start.dom(), soffset);
            selection.extend(finish.dom(), foffset);
          } else {
            doSetRange(win, finish, foffset, start, soffset);
          }
        }
      });
    };

    // NOTE: We are still reading the range because it gives subtly different behaviour
    // than using the anchorNode and focusNode. I'm not sure if this behaviour is any
    // better or worse; it's just different.
    var readRange = function (selection) {
      var rng = Option.from(selection.getRangeAt(0));
      return rng.map(function (r) {
        return Selection.range(Element.fromDom(r.startContainer), r.startOffset, Element.fromDom(r.endContainer), r.endOffset);
      });
    };

    var doGetExact = function (selection) {
      var anchorNode = Element.fromDom(selection.anchorNode);
      var focusNode = Element.fromDom(selection.focusNode);
      return DocumentPosition.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? Option.some(
        Selection.range(
          Element.fromDom(selection.anchorNode),
          selection.anchorOffset,
          Element.fromDom(selection.focusNode),
          selection.focusOffset
        )
      ) : readRange(selection);
    };

    var setToElement = function (win, element) {
      var rng = NativeRange.selectNodeContents(win, element);
      doSetNativeRange(win, rng);
    };

    var forElement = function (win, element) {
      var rng = NativeRange.selectNodeContents(win, element);
      return Selection.range(
        Element.fromDom(rng.startContainer), rng.startOffset, 
        Element.fromDom(rng.endContainer), rng.endOffset
      );
    };

    var getExact = function (win) {
      // We want to retrieve the selection as it is.
      var selection = win.getSelection();
      return selection.rangeCount > 0 ? doGetExact(selection) : Option.none();
    };

    // TODO: Test this.
    var get = function (win) {
      return getExact(win).map(function (range) {
        return Selection.exact(range.start(), range.soffset(), range.finish(), range.foffset());
      });
    };

    var getFirstRect = function (win, selection) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      return NativeRange.getFirstRect(rng);
    };

    var getBounds = function (win, selection) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      return NativeRange.getBounds(rng);
    };

    var getAtPoint = function (win, x, y) {
      return CaretRange.fromPoint(win, x, y);
    };

    var getAsString = function (win, selection) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      return NativeRange.toString(rng);
    };

    var clear = function (win) {
      var selection = win.getSelection();
      selection.removeAllRanges();
    };

    var clone = function (win, selection) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      return NativeRange.cloneFragment(rng);
    };

    var replace = function (win, selection, elements) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      var fragment = Fragment.fromElements(elements);
      NativeRange.replaceWith(rng, fragment);
    };

    var deleteAt = function (win, selection) {
      var rng = SelectionDirection.asLtrRange(win, selection);
      NativeRange.deleteContents(rng);
    };

    return {
      setExact: setExact,
      getExact: getExact,
      get: get,
      setRelative: setRelative,
      setToElement: setToElement,
      clear: clear,

      clone: clone,
      replace: replace,
      deleteAt: deleteAt,

      forElement: forElement,

      getFirstRect: getFirstRect,
      getBounds: getBounds,
      getAtPoint: getAtPoint,

      findWithin: findWithin,
      getAsString: getAsString
    };
  }
);

define(
  'tinymce.themes.mobile.util.Rectangles',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.selection.Awareness',
    'ephox.sugar.api.selection.Selection',
    'ephox.sugar.api.selection.WindowSelection'
  ],

  function (Arr, Fun, Element, Traverse, Awareness, Selection, WindowSelection) {
    var COLLAPSED_WIDTH = 2;

    var collapsedRect = function (rect) {
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: Fun.constant(COLLAPSED_WIDTH),
        height: rect.height
      };
    };

    var toRect = function (rawRect) {
      return {
        left: Fun.constant(rawRect.left),
        top: Fun.constant(rawRect.top),
        right: Fun.constant(rawRect.right),
        bottom: Fun.constant(rawRect.bottom),
        width: Fun.constant(rawRect.width),
        height: Fun.constant(rawRect.height)
      };
    };

    var getRectsFromRange = function (range) {
      if (! range.collapsed) {
        return Arr.map(range.getClientRects(), toRect);
      } else {
        var start = Element.fromDom(range.startContainer);
        return Traverse.parent(start).bind(function (parent) {
          var selection = Selection.exact(start, range.startOffset, parent, Awareness.getEnd(parent));
          var optRect = WindowSelection.getFirstRect(range.startContainer.ownerDocument.defaultView, selection);
          return optRect.map(collapsedRect).map(Arr.pure);
        }).getOr([ ]);
      }
    };

    var getRectangles = function (cWin) {
      var sel = cWin.getSelection();
      // In the Android WebView for some reason cWin.getSelection returns undefined.
      // The undefined check it is to avoid throwing of a JS error.
      return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : [ ];
    };

    return {
      getRectangles: getRectangles
    };
  }
);

define(
  'tinymce.themes.mobile.android.core.AndroidSetup',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Attr',
    'global!Math',
    'tinymce.themes.mobile.android.focus.ResumeEditing',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.DataAttributes',
    'tinymce.themes.mobile.util.Rectangles'
  ],

  function (Fun, Option, DomEvent, Element, Attr, Math, ResumeEditing, Styles, DataAttributes, Rectangles) {
    // This amount is added to the minimum scrolling distance when calculating how much to scroll
    // because the soft keyboard has appeared.
    var EXTRA_SPACING = 50;

    var data = 'data-' + Styles.resolve('last-outer-height');

    var setLastHeight = function (cBody, value) {
      Attr.set(cBody, data, value);
    };

    var getLastHeight = function (cBody) {
      return DataAttributes.safeParse(cBody, data);
    };

    var getBoundsFrom = function (rect) {
      return {
        top: Fun.constant(rect.top()),
        bottom: Fun.constant(rect.top() + rect.height())
      };
    };

    var getBounds = function (cWin) {
      var rects = Rectangles.getRectangles(cWin);
      return rects.length > 0 ? Option.some(rects[0]).map(getBoundsFrom) : Option.none();
    };

    var findDelta = function (outerWindow, cBody) {
      var last = getLastHeight(cBody);
      var current = outerWindow.innerHeight;
      return last > current ? Option.some(last - current) : Option.none();
    };

    var calculate = function (cWin, bounds, delta) {
      // The goal here is to shift as little as required.
      var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
      return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0;
    };

    var setup = function (outerWindow, cWin) {
      var cBody = Element.fromDom(cWin.document.body);

      var toEditing = function () {
        // TBIO-3816 throttling the resume was causing keyboard hide/show issues with undo/redo
        // throttling was introduced to work around a different keyboard hide/show issue, where
        // async uiChanged in Processor in polish was causing keyboard hide, which no longer seems to occur
        ResumeEditing.resume(cWin);
      };

      var onResize = DomEvent.bind(Element.fromDom(outerWindow), 'resize', function () {

        findDelta(outerWindow, cBody).each(function (delta) {
          getBounds(cWin).each(function (bounds) {
            // If the top is offscreen, scroll it into view.
            var cScrollBy = calculate(cWin, bounds, delta);
            if (cScrollBy !== 0) {
              cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
            }
          });
        });
        setLastHeight(cBody, outerWindow.innerHeight);
      });

      setLastHeight(cBody, outerWindow.innerHeight);

      var destroy = function () {
        onResize.unbind();
      };

      return {
        toEditing: toEditing,
        destroy: destroy
      };
    };

    return {
      setup: setup
    };
  }
);

define(
  'tinymce.themes.mobile.ios.core.PlatformEditor',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.selection.WindowSelection'
  ],

  function (Fun, Option, Compare, DomEvent, Element, WindowSelection) {
    var getBodyFromFrame = function (frame) {
      return Option.some(Element.fromDom(frame.dom().contentWindow.document.body));
    };

    var getDocFromFrame = function (frame) {
      return Option.some(Element.fromDom(frame.dom().contentWindow.document));
    };

    var getWinFromFrame = function (frame) {
      return Option.from(frame.dom().contentWindow);
    };

    var getSelectionFromFrame = function (frame) {
      var optWin = getWinFromFrame(frame);
      return optWin.bind(WindowSelection.getExact);
    };

    var getFrame = function (editor) {
      return editor.getFrame();
    };

    var getOrDerive = function (name, f) {
      return function (editor) {
        var g = editor[name].getOrThunk(function () {
          var frame = getFrame(editor);
          return function () {
            return f(frame);
          };
        });

        return g();
      };
    };

    var getOrListen = function (editor, doc, name, type) {
      return editor[name].getOrThunk(function () {
        return function (handler) {
          return DomEvent.bind(doc, type, handler);
        };
      });
    };

    var toRect = function (rect) {
      return {
        left: Fun.constant(rect.left),
        top: Fun.constant(rect.top),
        right: Fun.constant(rect.right),
        bottom: Fun.constant(rect.bottom),
        width: Fun.constant(rect.width),
        height: Fun.constant(rect.height)
      };
    };

    var getActiveApi = function (editor) {
      var frame = getFrame(editor);

      // Empty paragraphs can have no rectangle size, so let's just use the start container
      // if it is collapsed;
      var tryFallbackBox = function (win) {
        var isCollapsed = function (sel) {
          return Compare.eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset();
        };

        var toStartRect = function (sel) {
          var rect = sel.start().dom().getBoundingClientRect();
          return rect.width > 0 || rect.height > 0 ? Option.some(rect).map(toRect) : Option.none();
        };

        return WindowSelection.getExact(win).filter(isCollapsed).bind(toStartRect);
      };

      return getBodyFromFrame(frame).bind(function (body) {
        return getDocFromFrame(frame).bind(function (doc) {
          return getWinFromFrame(frame).map(function (win) {

            var html = Element.fromDom(doc.dom().documentElement);

            var getCursorBox = editor.getCursorBox.getOrThunk(function () {
              return function () {
                return WindowSelection.get(win).bind(function (sel) {
                  return WindowSelection.getFirstRect(win, sel).orThunk(function () {
                    return tryFallbackBox(win);
                  });
                });
              };
            });

            var setSelection = editor.setSelection.getOrThunk(function () {
              return function (start, soffset, finish, foffset) {
                WindowSelection.setExact(win, start, soffset, finish, foffset);
              };
            });

            var clearSelection = editor.clearSelection.getOrThunk(function () {
              return function () {
                WindowSelection.clear(win);
              };
            });

            return {
              body: Fun.constant(body),
              doc: Fun.constant(doc),
              win: Fun.constant(win),
              html: Fun.constant(html),
              getSelection: Fun.curry(getSelectionFromFrame, frame),
              setSelection: setSelection,
              clearSelection: clearSelection,
              frame: Fun.constant(frame),

              onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
              onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'selectionchange'),
              onDomChanged: editor.onDomChanged, // consider defaulting with MutationObserver

              onScrollToCursor: editor.onScrollToCursor,
              onScrollToElement: editor.onScrollToElement,
              onToReading: editor.onToReading,
              onToEditing: editor.onToEditing,

              onToolbarScrollStart: editor.onToolbarScrollStart,
              onTouchContent: editor.onTouchContent,
              onTapContent: editor.onTapContent,
              onTouchToolstrip: editor.onTouchToolstrip,

              getCursorBox: getCursorBox
            };
          });
        });
      });
    };

    return {
      getBody: getOrDerive('getBody', getBodyFromFrame),
      getDoc: getOrDerive('getDoc', getDocFromFrame),
      getWin: getOrDerive('getWin', getWinFromFrame),
      getSelection: getOrDerive('getSelection', getSelectionFromFrame),
      getFrame: getFrame,
      getActiveApi: getActiveApi
    };
  }
);

define(
  'tinymce.themes.mobile.util.Thor',

  [
    'ephox.katamari.api.Arr',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.SelectorFilter'
  ],

  function (Arr, PlatformDetection, Attr, Css, SelectorFilter) {
    var attr = 'data-ephox-mobile-fullscreen-style';
    var siblingStyles = 'display:none!important;';
    var ancestorPosition = 'position:absolute!important;';
    var ancestorStyles = 'top:0!important;left:0!important;margin:0' +
      '!important;padding:0!important;width:100%!important;';
    var bgFallback = 'background-color:rgb(255,255,255)!important;';

    var isAndroid = PlatformDetection.detect().os.isAndroid();

    var matchColor = function (editorBody) {
      // in iOS you can overscroll, sometimes when you overscroll you can reveal the bgcolor of an element beneath,
      // by matching the bg color and clobbering ensures any reveals are 'camouflaged' the same color
      var color = Css.get(editorBody, 'background-color');
      return (color !== undefined && color !== '') ? 'background-color:' + color + '!important' : bgFallback;
    };

    // We clobber all tags, direct ancestors to the editorBody get ancestorStyles, everything else gets siblingStyles
    var clobberStyles = function (container, editorBody) {
      var gatherSibilings = function (element) {
        var siblings = SelectorFilter.siblings(element, '*');
        return siblings;
      };

      var clobber = function (clobberStyle) {
        return function (element) {
          var styles = Attr.get(element, 'style');
          var backup = styles === undefined ? 'no-styles' : styles.trim();

          if (backup === clobberStyle) {
            return;
          } else {
            Attr.set(element, attr, backup);
            Attr.set(element, 'style', clobberStyle);
          }
        };
      };

      var ancestors = SelectorFilter.ancestors(container, '*');
      var siblings = Arr.bind(ancestors, gatherSibilings);
      var bgColor = matchColor(editorBody);

      /* NOTE: This assumes that container has no siblings itself */
      Arr.each(siblings, clobber(siblingStyles));
      Arr.each(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
      // position absolute on the outer-container breaks Android flex layout
      var containerStyles = isAndroid === true ? '' : ancestorPosition;
      clobber(containerStyles + ancestorStyles + bgColor)(container);
    };

    var restoreStyles = function () {
      var clobberedEls = SelectorFilter.all('[' + attr + ']');
      Arr.each(clobberedEls, function (element) {
        var restore = Attr.get(element, attr);
        if (restore !== 'no-styles') {
          Attr.set(element, 'style', restore);
        } else {
          Attr.remove(element, 'style');
        }
        Attr.remove(element, attr);
      });
    };

    return {
      clobberStyles: clobberStyles,
      restoreStyles: restoreStyles
    };
  }
);

define(
  'tinymce.themes.mobile.touch.view.MetaViewport',

  [
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.search.SelectorFind'
  ],

  function (Insert, Element, Attr, SelectorFind) {
    /*
     * The purpose of this fix is to toggle the presence of a meta tag which disables scrolling
     * for the user
     */
    var tag = function () {
      var head = SelectorFind.first('head').getOrDie();

      var nu = function () {
        var meta = Element.fromTag('meta');
        Attr.set(meta, 'name', 'viewport');
        Insert.append(head, meta);
        return meta;
      };

      var element = SelectorFind.first('meta[name="viewport"]').getOrThunk(nu);
      var backup = Attr.get(element, 'content');

      var maximize = function () {
        Attr.set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
      };

      var restore = function () {
        if (backup !== undefined && backup !== null && backup.length > 0) {
          Attr.set(element, 'content', backup);
        } else {
          // TODO: user-scalable is left as disabled when the editor closes
          Attr.remove(element, 'content');
        }
      };

      return {
        maximize: maximize,
        restore: restore
      };
    };

    return {
      tag: tag
    };
  }
);
define(
  'tinymce.themes.mobile.android.core.AndroidMode',

  [
    'ephox.katamari.api.Singleton',
    'ephox.sugar.api.properties.Class',
    'tinymce.themes.mobile.android.core.AndroidEvents',
    'tinymce.themes.mobile.android.core.AndroidSetup',
    'tinymce.themes.mobile.ios.core.PlatformEditor',
    'tinymce.themes.mobile.util.Thor',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.view.MetaViewport'
  ],

  function (Singleton, Class, AndroidEvents, AndroidSetup, PlatformEditor, Thor, Styles, MetaViewport) {
    var create = function (platform, mask) {

      var meta = MetaViewport.tag();
      var androidApi = Singleton.api();

      var androidEvents = Singleton.api();

      var enter = function () {
        mask.hide();

        Class.add(platform.container, Styles.resolve('fullscreen-maximized'));
        Class.add(platform.container, Styles.resolve('android-maximized'));
        meta.maximize();

        /// TM-48 Prevent browser refresh by swipe/scroll on android devices
        Class.add(platform.body, Styles.resolve('android-scroll-reload'));

        androidApi.set(
          AndroidSetup.setup(platform.win, PlatformEditor.getWin(platform.editor).getOrDie('no'))
        );

        PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
          Thor.clobberStyles(platform.container, editorApi.body());
          androidEvents.set(
            AndroidEvents.initEvents(editorApi, platform.toolstrip, platform.alloy)
          );
        });
      };

      var exit = function () {
        meta.restore();
        mask.show();
        Class.remove(platform.container, Styles.resolve('fullscreen-maximized'));
        Class.remove(platform.container, Styles.resolve('android-maximized'));
        Thor.restoreStyles();

        /// TM-48 re-enable swipe/scroll browser refresh on android
        Class.remove(platform.body, Styles.resolve('android-scroll-reload'));

        androidEvents.clear();

        androidApi.clear();
      };

      return {
        enter: enter,
        exit: exit
      };
    };

    return {
      create: create
    };
  }
);

define(
  'tinymce.themes.mobile.api.MobileSchema',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.search.Traverse',
    'global!window'
  ],

  function (FieldSchema, ValueSchema, Fun, Element, Traverse, window) {
    return ValueSchema.objOf([
      FieldSchema.strictObjOf('editor', [
        // Maybe have frame as a method, but I doubt it ... I think we pretty much need a frame
        FieldSchema.strict('getFrame'),
        FieldSchema.option('getBody'),
        FieldSchema.option('getDoc'),
        FieldSchema.option('getWin'),
        FieldSchema.option('getSelection'),
        FieldSchema.option('setSelection'),
        FieldSchema.option('clearSelection'),

        FieldSchema.option('cursorSaver'),

        FieldSchema.option('onKeyup'),
        FieldSchema.option('onNodeChanged'),
        FieldSchema.option('getCursorBox'),

        FieldSchema.strict('onDomChanged'),

        FieldSchema.defaulted('onTouchContent', Fun.noop),
        FieldSchema.defaulted('onTapContent', Fun.noop),
        FieldSchema.defaulted('onTouchToolstrip', Fun.noop),


        FieldSchema.defaulted('onScrollToCursor', Fun.constant({ unbind: Fun.noop })),
        FieldSchema.defaulted('onScrollToElement', Fun.constant({ unbind: Fun.noop })),
        FieldSchema.defaulted('onToEditing', Fun.constant({ unbind: Fun.noop })),
        FieldSchema.defaulted('onToReading', Fun.constant({ unbind: Fun.noop })),
        FieldSchema.defaulted('onToolbarScrollStart', Fun.identity)
      ]),

      FieldSchema.strict('socket'),
      FieldSchema.strict('toolstrip'),
      FieldSchema.strict('dropup'),
      FieldSchema.strict('toolbar'),
      FieldSchema.strict('container'),
      FieldSchema.strict('alloy'),
      FieldSchema.state('win', function (spec) {
        return Traverse.owner(spec.socket).dom().defaultView;
      }),
      FieldSchema.state('body', function (spec) {
        return Element.fromDom(
          spec.socket.dom().ownerDocument.body
        );
      }),
      FieldSchema.defaulted('translate', Fun.identity),
      FieldSchema.defaulted('setReadOnly', Fun.noop)
    ]);
  }
);

define(
  'ephox.katamari.api.Throttler',

  [
    'global!clearTimeout',
    'global!setTimeout'
  ],

  function (clearTimeout, setTimeout) {
    // Run a function fn afer rate ms. If another invocation occurs
    // during the time it is waiting, update the arguments f will run
    // with (but keep the current schedule)
    var adaptable = function (fn, rate) {
      var timer = null;
      var args = null;
      var cancel = function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
          args = null;
        }
      };
      var throttle = function () {
        args = arguments;
        if (timer === null) {
          timer = setTimeout(function () {
            fn.apply(null, args);
            timer = null;
            args = null;
          }, rate);
        }
      };

      return {
        cancel: cancel,
        throttle: throttle
      };
    };

    // Run a function fn after rate ms. If another invocation occurs
    // during the time it is waiting, ignore it completely.
    var first = function (fn, rate) {
      var timer = null;
      var cancel = function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
      };
      var throttle = function () {
        var args = arguments;
        if (timer === null) {
          timer = setTimeout(function () {
            fn.apply(null, args);
            timer = null;
            args = null;
          }, rate);
        }
      };

      return {
        cancel: cancel,
        throttle: throttle
      };
    };

    // Run a function fn after rate ms. If another invocation occurs
    // during the time it is waiting, reschedule the function again
    // with the new arguments.
    var last = function (fn, rate) {
      var timer = null;
      var cancel = function () {
        if (timer !== null) {
          clearTimeout(timer);
          timer = null;
        }
      };
      var throttle = function () {
        var args = arguments;
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      };

      return {
        cancel: cancel,
        throttle: throttle
      };
    };

    return {
      adaptable: adaptable,
      first: first,
      last: last
    };
  }
);
define(
  'tinymce.themes.mobile.touch.view.TapToEditMask',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.Memento',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.katamari.api.Throttler',
    'global!setTimeout',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (Behaviour, Toggling, Memento, Button, Container, Throttler, setTimeout, Styles, UiDomFactory) {
    var sketch = function (onView, translate) {

      var memIcon = Memento.record(
        Container.sketch({
          dom: UiDomFactory.dom('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
          containerBehaviours: Behaviour.derive([
            Toggling.config({
              toggleClass: Styles.resolve('mask-tap-icon-selected'),
              toggleOnExecute: false
            })
          ])
        })
      );

      var onViewThrottle = Throttler.first(onView, 200);

      return Container.sketch({
        dom: UiDomFactory.dom('<div class="${prefix}-disabled-mask"></div>'),
        components: [
          Container.sketch({
            dom: UiDomFactory.dom('<div class="${prefix}-content-container"></div>'),
            components: [
              Button.sketch({
                dom: UiDomFactory.dom('<div class="${prefix}-content-tap-section"></div>'),
                components: [
                  memIcon.asSpec()
                ],
                action: function (button) {
                  onViewThrottle.throttle();
                },

                buttonBehaviours: Behaviour.derive([
                  Toggling.config({
                    toggleClass: Styles.resolve('mask-tap-icon-selected')
                  })
                ])
              })
            ]
          })
        ]
      });
    };

    return {
      sketch: sketch
    };
  }
);

define(
  'tinymce.themes.mobile.api.AndroidWebapp',

  [
    'ephox.alloy.api.component.GuiFactory',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.properties.Css',
    'tinymce.themes.mobile.android.core.AndroidMode',
    'tinymce.themes.mobile.api.MobileSchema',
    'tinymce.themes.mobile.touch.view.TapToEditMask'
  ],

  function (GuiFactory, ValueSchema, Fun, Insert, Css, AndroidMode, MobileSchema, TapToEditMask) {
    // TODO: Remove dupe with IosWebapp
    var produce = function (raw) {
      var mobile = ValueSchema.asRawOrDie(
        'Getting AndroidWebapp schema',
        MobileSchema,
        raw
      );

      /* Make the toolbar */
      Css.set(mobile.toolstrip, 'width', '100%');

      // We do not make the Android container relative, because we aren't positioning the toolbar absolutely.
      var onTap = function () {
        mobile.setReadOnly(true);
        mode.enter();
      };

      var mask = GuiFactory.build(
        TapToEditMask.sketch(onTap, mobile.translate)
      );

      mobile.alloy.add(mask);
      var maskApi = {
        show: function () {
          mobile.alloy.add(mask);
        },
        hide: function () {
          mobile.alloy.remove(mask);
        }
      };

      Insert.append(mobile.container, mask.element());

      var mode = AndroidMode.create(mobile, maskApi);

      return {
        setReadOnly: mobile.setReadOnly,
        // Not used.
        refreshStructure: Fun.noop,
        enter: mode.enter,
        exit: mode.exit,
        destroy: Fun.noop
      };
    };

    return {
      produce: produce
    };
  }
);

define(
  'ephox.alloy.ui.schema.ToolbarSchema',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.data.Fields',
    'ephox.alloy.parts.PartType',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun'
  ],

  function (Behaviour, Replacing, Fields, PartType, FieldSchema, Fun) {
    var schema = [
      FieldSchema.defaulted('shell', true),
      FieldSchema.defaulted('toolbarBehaviours', { })
    ];

    // TODO: Dupe with Toolbar
    var enhanceGroups = function (detail) {
      return {
        behaviours: Behaviour.derive([
          Replacing.config({ })
        ])
      };
    };

    var partTypes = [
      // Note, is the container for putting all the groups in, not a group itself.
      PartType.optional({
        name: 'groups',
        overrides: enhanceGroups
      })
    ];

    return {
      name: Fun.constant('Toolbar'),
      schema: Fun.constant(schema),
      parts: Fun.constant(partTypes)
    };
  }
);
define(
  'ephox.alloy.api.ui.Toolbar',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.parts.AlloyParts',
    'ephox.alloy.ui.schema.ToolbarSchema',
    'ephox.katamari.api.Merger',
    'ephox.katamari.api.Option',
    'global!console',
    'global!Error'
  ],

  function (Behaviour, Replacing, Sketcher, AlloyParts, ToolbarSchema, Merger, Option, console, Error) {
    var factory = function (detail, components, spec, _externals) {
      var setGroups = function (toolbar, groups) {
        getGroupContainer(toolbar).fold(function () {
          // check that the group container existed. It may not have if the components
          // did not list anything, and shell was false.
          console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
          throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        }, function (container) {
          Replacing.set(container, groups);
        });
      };

      var getGroupContainer = function (component) {
        return detail.shell() ? Option.some(component) : AlloyParts.getPart(component, detail, 'groups');
      };

      // In shell mode, the group overrides need to be added to the main container, and there can be no children
      var extra = detail.shell() ? { behaviours: [ Replacing.config({ }) ], components: [ ] } :
        { behaviours: [ ], components: components };

      return {
        uid: detail.uid(),
        dom: detail.dom(),
        components: extra.components,

        behaviours: Merger.deepMerge(
          Behaviour.derive(extra.behaviours),
          detail.toolbarBehaviours()
        ),
        apis: {
          setGroups: setGroups
        },
        domModification: {
          attributes: {
            role: 'group'
          }
        }
      };
    };

    return Sketcher.composite({
      name: 'Toolbar',
      configFields: ToolbarSchema.schema(),
      partFields: ToolbarSchema.parts(),
      factory: factory,
      apis: {
        setGroups: function (apis, toolbar, groups) {
          apis.setGroups(toolbar, groups);
        }
      }
    });
  }
);
define(
  'ephox.alloy.ui.schema.ToolbarGroupSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.alloy.parts.PartType',
    'ephox.boulder.api.FieldSchema',
    'ephox.katamari.api.Fun'
  ],

  function (Fields, PartType, FieldSchema, Fun) {
    var schema = [
      FieldSchema.strict('items'),
      Fields.markers([ 'itemClass' ]),
      FieldSchema.defaulted('hasTabstop', true),
      FieldSchema.defaulted('tgroupBehaviours', { })
    ];

    var partTypes = [
      PartType.group({
        name: 'items',
        unit: 'item',
        overrides: function (detail) {
          return {
            domModification: {
              classes: [ detail.markers().itemClass() ]
            }
          };
        }
      })
    ];

    return {
      name: Fun.constant('ToolbarGroup'),
      schema: Fun.constant(schema),
      parts: Fun.constant(partTypes)
    };
  }
);
define(
  'ephox.alloy.api.ui.ToolbarGroup',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Tabstopping',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.ui.schema.ToolbarGroupSchema',
    'ephox.katamari.api.Merger',
    'global!Error'
  ],

  function (Behaviour, Keying, Tabstopping, Sketcher, ToolbarGroupSchema, Merger, Error) {
    var factory = function (detail, components, spec, _externals) {
      return Merger.deepMerge(
        {
          dom: {
            attributes: {
              role: 'toolbar'
            }
          }
        },
        {
          uid: detail.uid(),
          dom: detail.dom(),
          components: components,

          behaviours: Merger.deepMerge(
            Behaviour.derive([
              Keying.config({
                mode: 'flow',
                selector: '.' + detail.markers().itemClass()
              }),
              detail.hasTabstop() ? Tabstopping.config({ }) : Tabstopping.revoke()
            ]),
            detail.tgroupBehaviours()
          ),

          'debug.sketcher': spec['debug.sketcher']
        }
      );
    };

    return Sketcher.composite({
      name: 'ToolbarGroup',
      configFields: ToolbarGroupSchema.schema(),
      partFields: ToolbarGroupSchema.parts(),
      factory: factory
    });
  }
);
define(
  'tinymce.themes.mobile.ios.scroll.Scrollables',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.search.SelectorFind',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (Fun, DomEvent, Attr, SelectorFind, Styles) {
    var dataHorizontal = 'data-' + Styles.resolve('horizontal-scroll');

    var canScrollVertically = function (container) {
      container.dom().scrollTop = 1;
      var result = container.dom().scrollTop !== 0;
      container.dom().scrollTop = 0;
      return result;
    };

    var canScrollHorizontally = function (container) {
      container.dom().scrollLeft = 1;
      var result = container.dom().scrollLeft !== 0;
      container.dom().scrollLeft = 0;
      return result;
    };

    var hasVerticalScroll = function (container) {
      return container.dom().scrollTop > 0 || canScrollVertically(container);
    };

    var hasHorizontalScroll = function (container) {
      return container.dom().scrollLeft > 0 || canScrollHorizontally(container);
    };

    var markAsHorizontal = function (container) {
      Attr.set(container, dataHorizontal, 'true');
    };

    var hasScroll = function (container) {
      return Attr.get(container, dataHorizontal) === 'true' ? hasHorizontalScroll : hasVerticalScroll;
    };

    /*
     * Prevents default on touchmove for anything that is not within a scrollable area. The
     * scrollable areas are defined by selector.
     */
    var exclusive = function (scope, selector) {
      return DomEvent.bind(scope, 'touchmove', function (event) {
        SelectorFind.closest(event.target(), selector).filter(hasScroll).fold(function () {
          event.raw().preventDefault();
        }, Fun.noop);
      });
    };

    return {
      exclusive: exclusive,
      markAsHorizontal: markAsHorizontal
    };
  }
);

define(
  'tinymce.themes.mobile.toolbar.ScrollingToolbar',

  [
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.api.ui.Toolbar',
    'ephox.alloy.api.ui.ToolbarGroup',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Css',
    'tinymce.themes.mobile.ios.scroll.Scrollables',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.scroll.Scrollable',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (
    AddEventsBehaviour, Behaviour, Keying, Toggling, GuiFactory, AlloyEvents, Container, Toolbar, ToolbarGroup, Arr, Cell, Fun, Css, Scrollables, Styles, Scrollable,
    UiDomFactory
  ) {
    return function () {
      var makeGroup = function (gSpec) {
        var scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : '';
        return {
          dom: UiDomFactory.dom('<div aria-label="' + gSpec.label + '" class="${prefix}-toolbar-group ' + scrollClass + '"></div>'),

          tgroupBehaviours: Behaviour.derive([
            AddEventsBehaviour.config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [
              AlloyEvents.runOnInit(function (component, simulatedEvent) {
                Css.set(component.element(), 'overflow-x', 'auto');
                Scrollables.markAsHorizontal(component.element());
                Scrollable.register(component.element());
              })
            ] : [ ])
          ]),

          components: [
            Container.sketch({
              components: [
                ToolbarGroup.parts().items({ })
              ]
            })
          ],
          markers: {
            itemClass: Styles.resolve('toolbar-group-item')
          },

          items: gSpec.items
        };
      };

      var toolbar = GuiFactory.build(
        Toolbar.sketch(
          {
            dom: UiDomFactory.dom('<div class="${prefix}-toolbar"></div>'),
            components: [
              Toolbar.parts().groups({ })
            ],
            toolbarBehaviours: Behaviour.derive([
              Toggling.config({
                toggleClass: Styles.resolve('context-toolbar'),
                toggleOnExecute: false,
                aria: {
                  mode: 'none'
                }
              }),
              Keying.config({
                mode: 'cyclic'
              })
            ]),
            shell: true
          }
        )
      );

      var wrapper = GuiFactory.build(
        Container.sketch({
          dom: {
            classes: [ Styles.resolve('toolstrip') ]
          },
          components: [
            GuiFactory.premade(toolbar)
          ],
          containerBehaviours: Behaviour.derive([
            Toggling.config({
              toggleClass: Styles.resolve('android-selection-context-toolbar'),
              toggleOnExecute: false
            })
          ])
        })
      );

      var resetGroups = function () {
        Toolbar.setGroups(toolbar, initGroups.get());
        Toggling.off(toolbar);
      };

      var initGroups = Cell([ ]);

      var setGroups = function (gs) {
        initGroups.set(gs);
        resetGroups();
      };

      var createGroups = function (gs) {
        return Arr.map(gs, Fun.compose(ToolbarGroup.sketch, makeGroup));
      };

      var refresh = function () {
        Toolbar.refresh(toolbar);
      };

      var setContextToolbar = function (gs) {
        Toggling.on(toolbar);
        Toolbar.setGroups(toolbar, gs);
      };

      var restoreToolbar = function () {
        if (Toggling.isOn(toolbar)) {
          resetGroups();
        }
      };

      var focus = function () {
        Keying.focusIn(toolbar);
      };

      return {
        wrapper: Fun.constant(wrapper),
        toolbar: Fun.constant(toolbar),
        createGroups: createGroups,
        setGroups: setGroups,
        setContextToolbar: setContextToolbar,
        restoreToolbar: restoreToolbar,
        refresh: refresh,
        focus: focus
      };
    };

  }
);
define(
  'tinymce.themes.mobile.ui.CommonRealm',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.behaviour.Swapping',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Class',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.UiDomFactory'
  ],

  function (
    Behaviour, Replacing, Swapping, GuiFactory, Button, Container, Fun, Class, Styles,
    UiDomFactory
  ) {
    var makeEditSwitch = function (webapp) {
      return GuiFactory.build(
        Button.sketch({
          dom: UiDomFactory.dom('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
          action: function () {
            webapp.run(function (w) {
              w.setReadOnly(false);
            });
          }
        })
      );
    };

    var makeSocket = function () {
      return GuiFactory.build(
        Container.sketch({
          dom: UiDomFactory.dom('<div class="${prefix}-editor-socket"></div>'),
          components: [ ],
          containerBehaviours: Behaviour.derive([
            Replacing.config({ })
          ])
        })
      );
    };

    var showEdit = function (socket, switchToEdit) {
      Replacing.append(socket, GuiFactory.premade(switchToEdit));
    };

    var hideEdit = function (socket, switchToEdit) {
      Replacing.remove(socket, switchToEdit);
    };

    var updateMode = function (socket, switchToEdit, readOnly, root) {
      var swap = (readOnly === true) ? Swapping.toAlpha : Swapping.toOmega;
      swap(root);

      var f = readOnly ? showEdit : hideEdit;
      f(socket, switchToEdit);
    };

    return {
      makeEditSwitch: makeEditSwitch,
      makeSocket: makeSocket,
      updateMode: updateMode
    };
  }
);

define(
  'ephox.alloy.behaviour.sliding.SlidingApis',

  [
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.properties.Css'
  ],

  function (Class, Classes, Css) {
    var getAnimationRoot = function (component, slideConfig) {
      return slideConfig.getAnimationRoot().fold(function () {
        return component.element();
      }, function (get) {
        return get(component);
      });
    };

    var getDimensionProperty = function (slideConfig) {
      return slideConfig.dimension().property();
    };

    var getDimension = function (slideConfig, elem) {
      return slideConfig.dimension().getDimension()(elem);
    };

    var disableTransitions = function (component, slideConfig) {
      var root = getAnimationRoot(component, slideConfig);
      Classes.remove(root, [ slideConfig.shrinkingClass(), slideConfig.growingClass() ]);
    };

    var setShrunk = function (component, slideConfig) {
      Class.remove(component.element(), slideConfig.openClass());
      Class.add(component.element(), slideConfig.closedClass());
      Css.set(component.element(), getDimensionProperty(slideConfig), '0px');
      Css.reflow(component.element());
    };

    // Note, this is without transitions, so we can measure the size instantaneously
    var measureTargetSize = function (component, slideConfig) {
      setGrown(component, slideConfig);
      var expanded = getDimension(slideConfig, component.element());
      setShrunk(component, slideConfig);
      return expanded;
    };

    var setGrown = function (component, slideConfig) {
      Class.remove(component.element(), slideConfig.closedClass());
      Class.add(component.element(), slideConfig.openClass());
      Css.remove(component.element(), getDimensionProperty(slideConfig));
    };

    var doImmediateShrink = function (component, slideConfig, slideState) {
      slideState.setCollapsed();

      // Force current dimension to begin transition
      Css.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
      Css.reflow(component.element());

      disableTransitions(component, slideConfig);

      setShrunk(component, slideConfig);
      slideConfig.onStartShrink()(component);
      slideConfig.onShrunk()(component);
    };

    var doStartShrink = function (component, slideConfig, slideState) {
      slideState.setCollapsed();

      // Force current dimension to begin transition
      Css.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
      Css.reflow(component.element());

      var root = getAnimationRoot(component, slideConfig);
      Class.add(root, slideConfig.shrinkingClass()); // enable transitions
      setShrunk(component, slideConfig);
      slideConfig.onStartShrink()(component);
    };

    // Showing is complex due to the inability to transition to "auto".
    // We also can't cache the dimension as the parents may have resized since it was last shown.
    var doStartGrow = function (component, slideConfig, slideState) {
      var fullSize = measureTargetSize(component, slideConfig);

      // Start the growing animation styles
      var root = getAnimationRoot(component, slideConfig);
      Class.add(root, slideConfig.growingClass());

      setGrown(component, slideConfig);

      Css.set(component.element(), getDimensionProperty(slideConfig), fullSize);
      // We might need to consider having a Css.reflow here. We can't have it in setGrown because
      // it stops the transition immediately because it jumps to the final size.

      slideState.setExpanded();
      slideConfig.onStartGrow()(component);
    };

    var grow = function (component, slideConfig, slideState) {
      if (! slideState.isExpanded()) doStartGrow(component, slideConfig, slideState);
    };

    var shrink = function (component, slideConfig, slideState) {
      if (slideState.isExpanded()) doStartShrink(component, slideConfig, slideState);
    };

    var immediateShrink = function (component, slideConfig, slideState) {
      if (slideState.isExpanded()) doImmediateShrink(component, slideConfig, slideState);
    };

    var hasGrown = function (component, slideConfig, slideState) {
      return slideState.isExpanded();
    };

    var hasShrunk = function (component, slideConfig, slideState) {
      return slideState.isCollapsed();
    };

    var isGrowing = function (component, slideConfig, slideState) {
      var root = getAnimationRoot(component, slideConfig);
      return Class.has(root, slideConfig.growingClass()) === true;
    };

    var isShrinking = function (component, slideConfig, slideState) {
      var root = getAnimationRoot(component, slideConfig);
      return Class.has(root, slideConfig.shrinkingClass()) === true;
    };

    var isTransitioning = function (component, slideConfig, slideState) {
      return isGrowing(component, slideConfig, slideState) === true || isShrinking(component, slideConfig, slideState) === true;
    };

    var toggleGrow = function (component, slideConfig, slideState) {
      var f = slideState.isExpanded() ? doStartShrink : doStartGrow;
      f(component, slideConfig, slideState);
    };

    return {
      grow: grow,
      shrink: shrink,
      immediateShrink: immediateShrink,
      hasGrown: hasGrown,
      hasShrunk: hasShrunk,
      isGrowing: isGrowing,
      isShrinking: isShrinking,
      isTransitioning: isTransitioning,
      toggleGrow: toggleGrow,
      disableTransitions: disableTransitions
    };
  }
);
define(
  'ephox.alloy.behaviour.sliding.ActiveSliding',

  [
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.behaviour.sliding.SlidingApis',
    'ephox.alloy.dom.DomModification',
    'ephox.boulder.api.Objects',
    'ephox.sugar.api.properties.Css'
  ],

  function (AlloyEvents, NativeEvents, SlidingApis, DomModification, Objects, Css) {
    var exhibit = function (base, slideConfig/*, slideState */) {
      var expanded = slideConfig.expanded();

      return expanded ? DomModification.nu({
        classes: [ slideConfig.openClass() ],
        styles: { }
      }) : DomModification.nu({
        classes: [ slideConfig.closedClass() ],
        styles: Objects.wrap(slideConfig.dimension().property(), '0px')
      });
    };

    var events = function (slideConfig, slideState) {
      return AlloyEvents.derive([
        AlloyEvents.run(NativeEvents.transitionend(), function (component, simulatedEvent) {
          var raw = simulatedEvent.event().raw();
          // This will fire for all transitions, we're only interested in the dimension completion
          if (raw.propertyName === slideConfig.dimension().property()) {
            SlidingApis.disableTransitions(component, slideConfig, slideState); // disable transitions immediately (Safari animates the dimension removal below)
            if (slideState.isExpanded()) Css.remove(component.element(), slideConfig.dimension().property()); // when showing, remove the dimension so it is responsive
            var notify = slideState.isExpanded() ? slideConfig.onGrown() : slideConfig.onShrunk();
            notify(component, simulatedEvent);
          }
        })
      ]);
    };

    return {
      exhibit: exhibit,
      events: events
    };
  }
);
define(
  'ephox.alloy.behaviour.sliding.SlidingSchema',

  [
    'ephox.alloy.data.Fields',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.sugar.api.view.Height',
    'ephox.sugar.api.view.Width'
  ],

  function (Fields, FieldSchema, ValueSchema, Height, Width) {
    return [
      FieldSchema.strict('closedClass'),
      FieldSchema.strict('openClass'),
      FieldSchema.strict('shrinkingClass'),
      FieldSchema.strict('growingClass'),

      // Element which shrinking and growing animations
      FieldSchema.option('getAnimationRoot'),

      Fields.onHandler('onShrunk'),
      Fields.onHandler('onStartShrink'),
      Fields.onHandler('onGrown'),
      Fields.onHandler('onStartGrow'),
      FieldSchema.defaulted('expanded', false),
      FieldSchema.strictOf('dimension', ValueSchema.choose(
        'property', {
          width: [
            Fields.output('property', 'width'),
            Fields.output('getDimension', function (elem) {
              return Width.get(elem) + 'px';
            })
          ],
          height: [
            Fields.output('property', 'height'),
            Fields.output('getDimension', function (elem) {
              return Height.get(elem) + 'px';
            })
          ]
        }
      ))

    ];
  }
);
define(
  'ephox.alloy.behaviour.sliding.SlidingState',

  [
    'ephox.alloy.behaviour.common.BehaviourState',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun'
  ],

  function (BehaviourState, Cell, Fun) {
    var init = function (spec) {
      var state = Cell(spec.expanded());

      var readState = function () {
        return 'expanded: ' + state.get();
      };

      return BehaviourState({
        isExpanded: function () { return state.get() === true; },
        isCollapsed: function () { return state.get() === false; },
        setCollapsed: Fun.curry(state.set, false),
        setExpanded: Fun.curry(state.set, true),
        readState: readState
      });
    };

    return {
      init: init
    };
  }
);

define(
  'ephox.alloy.api.behaviour.Sliding',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.behaviour.sliding.ActiveSliding',
    'ephox.alloy.behaviour.sliding.SlidingApis',
    'ephox.alloy.behaviour.sliding.SlidingSchema',
    'ephox.alloy.behaviour.sliding.SlidingState'
  ],

  function (Behaviour, ActiveSliding, SlidingApis, SlidingSchema, SlidingState) {
    return Behaviour.create({
      fields: SlidingSchema,
      name: 'sliding',
      active: ActiveSliding,
      apis: SlidingApis,
      state: SlidingState
    });
  }
);
define(
  'tinymce.themes.mobile.ui.Dropup',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.behaviour.Sliding',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.ui.Container',
    'ephox.katamari.api.Fun',
    'global!window',
    'tinymce.themes.mobile.channels.Receivers',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (Behaviour, Replacing, Sliding, GuiFactory, Container, Fun, window, Receivers, Styles) {
    var build = function (refresh, scrollIntoView) {
      var dropup = GuiFactory.build(
        Container.sketch({
          dom: {
            tag: 'div',
            classes: Styles.resolve('dropup')
          },
          components: [
            
          ],
          containerBehaviours: Behaviour.derive([
            Replacing.config({ }),
            Sliding.config({
              closedClass: Styles.resolve('dropup-closed'),
              openClass: Styles.resolve('dropup-open'),
              shrinkingClass: Styles.resolve('dropup-shrinking'),
              growingClass: Styles.resolve('dropup-growing'),
              dimension: {
                property: 'height'
              },
              onShrunk: function (component) {
                refresh();
                scrollIntoView();

                Replacing.set(component, [ ]);
              },
              onGrown: function (component) {
                refresh();
                scrollIntoView();
              }
            }),
            Receivers.orientation(function (component, data) {
              disappear(Fun.noop);
            })
          ])
        })
      );

      var appear = function (menu, update, component) {
        if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
          window.requestAnimationFrame(function () {
            update(component);
            Replacing.set(dropup, [ menu() ]);
            Sliding.grow(dropup);
          });
        }
      };

      var disappear = function (onReadyToShrink) {
        window.requestAnimationFrame(function () {
          onReadyToShrink();
          Sliding.shrink(dropup);
        });
      };

      return {
        appear: appear,
        disappear: disappear,
        component: Fun.constant(dropup),
        element: dropup.element
      };
    };

    return {
      build: build
    };
  }
);

define(
  'ephox.alloy.events.GuiEvents',

  [
    'ephox.alloy.alien.Keys',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.events.TapEvent',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Arr',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.Traverse',
    'global!setTimeout'
  ],

  function (Keys, SystemEvents, TapEvent, FieldSchema, ValueSchema, Arr, PlatformDetection, DomEvent, Node, Traverse, setTimeout) {
    var isDangerous = function (event) {
      // Will trigger the Back button in the browser
      return event.raw().which === Keys.BACKSPACE()[0] && !Arr.contains([ 'input', 'textarea' ], Node.name(event.target()));
    };

    var isFirefox = PlatformDetection.detect().browser.isFirefox();

    var settingsSchema = ValueSchema.objOfOnly([
      // triggerEvent(eventName, event)
      FieldSchema.strictFunction('triggerEvent'),
      FieldSchema.strictFunction('broadcastEvent'),
      FieldSchema.defaulted('stopBackspace', true)
    ]);

    var bindFocus = function (container, handler) {
      if (isFirefox) {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=687787
        return DomEvent.capture(container, 'focus', handler);
      } else {
        return DomEvent.bind(container, 'focusin', handler);
      }
    };

    var bindBlur = function (container, handler) {
      if (isFirefox) {
        // https://bugzilla.mozilla.org/show_bug.cgi?id=687787
        return DomEvent.capture(container, 'blur', handler);
      } else {
        return DomEvent.bind(container, 'focusout', handler);
      }
    };

    var setup = function (container, rawSettings) {
      var settings = ValueSchema.asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings);

      var pointerEvents = PlatformDetection.detect().deviceType.isTouch() ? [
        'touchstart',
        'touchmove',
        'touchend',
        'gesturestart'
      ] : [
        'mousedown',
        'mouseup',
        'mouseover',
        'mousemove',
        'mouseout',
        'click'
      ];

      var tapEvent = TapEvent.monitor(settings);

      // These events are just passed through ... no additional processing
      var simpleEvents = Arr.map(
        pointerEvents.concat([
          'selectstart',
          'input',
          'contextmenu',
          'change',
          'transitionend',
          // Test the drag events
          'dragstart',
          'dragover',
          'drop'
        ]),
        function (type) {
          return DomEvent.bind(container, type, function (event) {
            tapEvent.fireIfReady(event, type).each(function (tapStopped) {
              if (tapStopped) event.kill();
            });

            var stopped = settings.triggerEvent(type, event);
            if (stopped) event.kill();
          });
        }
      );

      var onKeydown = DomEvent.bind(container, 'keydown', function (event) {
        // Prevent default of backspace when not in input fields.
        var stopped = settings.triggerEvent('keydown', event);
        if (stopped) event.kill();
        else if (settings.stopBackspace === true && isDangerous(event)) { event.prevent(); }
      });

      var onFocusIn = bindFocus(container, function (event) {
        var stopped = settings.triggerEvent('focusin', event);
        if (stopped) event.kill();
      });

      var onFocusOut = bindBlur(container, function (event) {
        var stopped = settings.triggerEvent('focusout', event);
        if (stopped) event.kill();

        // INVESTIGATE: Come up with a better way of doing this. Related target can be used, but not on FF.
        // It allows the active element to change before firing the blur that we will listen to
        // for things like closing popups
        setTimeout(function () {
          settings.triggerEvent(SystemEvents.postBlur(), event);
        }, 0);
      });

      var defaultView = Traverse.defaultView(container);
      var onWindowScroll = DomEvent.bind(defaultView, 'scroll', function (event) {
        var stopped = settings.broadcastEvent(SystemEvents.windowScroll(), event);
        if (stopped) event.kill();
      });

      var unbind = function () {
        Arr.each(simpleEvents, function (e) {
          e.unbind();
        });
        onKeydown.unbind();
        onFocusIn.unbind();
        onFocusOut.unbind();
        onWindowScroll.unbind();
      };

      return {
        unbind: unbind
      };
    };

    return {
      setup: setup
    };
  }
);
define(
  'ephox.alloy.events.EventSource',

  [
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Cell'
  ],

  function (Objects, Cell) {
    var derive = function (rawEvent, rawTarget) {
      var source = Objects.readOptFrom(rawEvent, 'target').map(function (getTarget) {
        return getTarget();
      }).getOr(rawTarget);

      return Cell(source);
    };

    return {
      derive: derive
    };
  }
);
define(
  'ephox.alloy.events.SimulatedEvent',

  [
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'global!Error'
  ],

  function (Cell, Fun, Error) {
    var fromSource = function (event, source) {
      var stopper = Cell(false);

      var cutter = Cell(false);

      var stop = function () {
        stopper.set(true);
      };

      var cut = function () {
        cutter.set(true);
      };

      return {
        stop: stop,
        cut: cut,
        isStopped: stopper.get,
        isCut: cutter.get,
        event: Fun.constant(event),
        // Used only for tiered menu at the moment. It is an element, not a component
        setSource: source.set,
        getSource: source.get
      };
    };

    // Events that come from outside of the alloy root (e.g. window scroll)
    var fromExternal = function (event) {
      var stopper = Cell(false);

      var stop = function () {
        stopper.set(true);
      };

      return {
        stop: stop,
        cut: Fun.noop, // cutting has no meaning for a broadcasted event
        isStopped: stopper.get,
        isCut: Fun.constant(false),
        event: Fun.constant(event),
        // Nor do targets really
        setTarget: Fun.die(
          new Error('Cannot set target of a broadcasted event')
        ),
        getTarget: Fun.die(
          new Error('Cannot get target of a broadcasted event')
        )
      };
    };

    var fromTarget = function (event, target) {
      var source = Cell(target);
      return fromSource(event, source);
    };

    return {
      fromSource: fromSource,
      fromExternal: fromExternal,
      fromTarget: fromTarget
    };
  }
);

define(
  'ephox.alloy.events.Triggers',

  [
    'ephox.alloy.events.DescribedHandler',
    'ephox.alloy.events.EventSource',
    'ephox.alloy.events.SimulatedEvent',
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.search.Traverse',
    'global!Error'
  ],

  function (DescribedHandler, EventSource, SimulatedEvent, Adt, Arr, Traverse, Error) {
    var adt = Adt.generate([
      { stopped: [ ] },
      { resume: [ 'element' ] },
      { complete: [ ] }
    ]);

    var doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
      var handler = lookup(eventType, target);

      var simulatedEvent = SimulatedEvent.fromSource(rawEvent, source);

      return handler.fold(function () {
        // No handler, so complete.
        logger.logEventNoHandlers(eventType, target);
        return adt.complete();
      }, function (handlerInfo) {
        var descHandler = handlerInfo.descHandler();
        var eventHandler = DescribedHandler.getHandler(descHandler);
        eventHandler(simulatedEvent);

        // Now, check if the event was stopped.
        if (simulatedEvent.isStopped()) {
          logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose());
          return adt.stopped();
        }
        // Now, check if the event was cut
        else if (simulatedEvent.isCut()) {
          logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose());
          return adt.complete();
        }
        else return Traverse.parent(handlerInfo.element()).fold(function () {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose());
          // No parent, so complete.
          return adt.complete();
        }, function (parent) {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose());
          // Resume at parent
          return adt.resume(parent);
        });
      });
    };

    var doTriggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, source, logger) {
      return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(function () {
        // stopped.
        return true;
      }, function (parent) {
        // Go again.
        return doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger);
      }, function () {
        // completed
        return false;
      });
    };

    var triggerHandler = function (lookup, eventType, rawEvent, target, logger) {
      var source = EventSource.derive(rawEvent, target);
      return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
    };

    var broadcast = function (listeners, rawEvent, logger) {
      var simulatedEvent = SimulatedEvent.fromExternal(rawEvent);

      Arr.each(listeners, function (listener) {
        var descHandler = listener.descHandler();
        var handler = DescribedHandler.getHandler(descHandler);
        handler(simulatedEvent);
      });

      return simulatedEvent.isStopped();
    };

    var triggerUntilStopped = function (lookup, eventType, rawEvent, logger) {
      var rawTarget = rawEvent.target();
      return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger);
    };

    var triggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, logger) {
      var source = EventSource.derive(rawEvent, rawTarget);
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
    };

    return {
      triggerHandler: triggerHandler,
      triggerUntilStopped: triggerUntilStopped,
      triggerOnUntilStopped: triggerOnUntilStopped,
      broadcast: broadcast
    };
  }
);
define(
  'ephox.alloy.alien.TransformFind',

  [
    'ephox.sugar.api.search.PredicateFind'
  ],

  function (PredicateFind) {
    var closest = function (target, transform, isRoot) {
      // TODO: Sugar method is inefficient ... .need to write something new which allows me to keep the optional
      // information, rather than just returning a boolean. Sort of a findMap for Predicate.ancestor.
      var delegate = PredicateFind.closest(target, function (elem) {
        return transform(elem).isSome();
      }, isRoot);

      return delegate.bind(transform);
    };

    return {
      closest: closest
    };
  }
);
define(
  'ephox.alloy.events.EventRegistry',

  [
    'ephox.alloy.alien.TransformFind',
    'ephox.alloy.events.DescribedHandler',
    'ephox.alloy.registry.Tagger',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Struct',
    'global!console'
  ],

  function (TransformFind, DescribedHandler, Tagger, Objects, Fun, Obj, Option, Struct, console) {
    var eventHandler = Struct.immutable('element', 'descHandler');

    var messageHandler = function (id, handler) {
      return {
        id: Fun.constant(id),
        descHandler: Fun.constant(handler)
      };
    };

    return function () {
      var registry = { };

      var registerId = function (extraArgs, id, events) {
        Obj.each(events, function (v, k) {
          var handlers = registry[k] !== undefined ? registry[k] : { };
          handlers[id] = DescribedHandler.curryArgs(v, extraArgs);
          registry[k] = handlers;
        });
      };

      var findHandler = function (handlers, elem) {
        return Tagger.read(elem).fold(function (err) {
          return Option.none();
        }, function (id) {
          var reader = Objects.readOpt(id);
          return handlers.bind(reader).map(function (descHandler) {
            return eventHandler(elem, descHandler);
          });
        });
      };

      // Given just the event type, find all handlers regardless of element
      var filterByType = function (type) {
        return Objects.readOptFrom(registry, type).map(function (handlers) {
          return Obj.mapToArray(handlers, function (f, id) {
            return messageHandler(id, f);
          });
        }).getOr([ ]);
      };

      // Given event type, and element, find the handler.
      var find = function (isAboveRoot, type, target) {
        var readType = Objects.readOpt(type);
        var handlers = readType(registry);
        return TransformFind.closest(target, function (elem) {
          return findHandler(handlers, elem);
        }, isAboveRoot);
      };

      var unregisterId = function (id) {
        // INVESTIGATE: Find a better way than mutation if we can.
        Obj.each(registry, function (handlersById, eventName) {
          if (handlersById.hasOwnProperty(id)) delete handlersById[id];
        });
      };

      return {
        registerId: registerId,
        unregisterId: unregisterId,
        filterByType: filterByType,
        find: find
      };
    };
  }
);
define(
  'ephox.alloy.registry.Registry',

  [
    'ephox.alloy.events.EventRegistry',
    'ephox.alloy.log.AlloyLogger',
    'ephox.alloy.registry.Tagger',
    'ephox.boulder.api.Objects',
    'ephox.sugar.api.node.Body',
    'global!Error'
  ],

  function (EventRegistry, AlloyLogger, Tagger, Objects, Body, Error) {
    return function () {
      var events = EventRegistry();

      var components = { };

      var readOrTag = function (component) {
        var elem = component.element();
        return Tagger.read(elem).fold(function () {
          // No existing tag, so add one.
          return Tagger.write('uid-', component.element());
        }, function (uid) {
          return uid;
        });
      };

      var failOnDuplicate = function (component, tagId) {
        var conflict = components[tagId];
        if (conflict === component) unregister(component);
        else throw new Error(
          'The tagId "' + tagId + '" is already used by: ' + AlloyLogger.element(conflict.element()) + '\nCannot use it for: ' + AlloyLogger.element(component.element()) + '\n' +
            'The conflicting element is' + (Body.inBody(conflict.element()) ? ' ' : ' not ') + 'already in the DOM'
        );
      };

      var register = function (component) {
        var tagId = readOrTag(component);
        if (Objects.hasKey(components, tagId)) failOnDuplicate(component, tagId);
        // Component is passed through an an extra argument to all events
        var extraArgs = [ component ];
        events.registerId(extraArgs, tagId, component.events());
        components[tagId] = component;
      };

      var unregister = function (component) {
        Tagger.read(component.element()).each(function (tagId) {
          components[tagId] = undefined;
          events.unregisterId(tagId);
        });
      };

      var filter = function (type) {
        return events.filterByType(type);
      };

      var find = function (isAboveRoot, type, target) {
        return events.find(isAboveRoot, type, target);
      };

      var getById = function (id) {
        return Objects.readOpt(id)(components);
      };

      return {
        find: find,
        filter: filter,
        register: register,
        unregister: unregister,
        getById: getById
      };
    };
  }
);
define(
  'ephox.alloy.api.system.Gui',

  [
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.api.system.Attachment',
    'ephox.alloy.api.system.SystemApi',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.debugging.Debugging',
    'ephox.alloy.events.DescribedHandler',
    'ephox.alloy.events.GuiEvents',
    'ephox.alloy.events.Triggers',
    'ephox.alloy.log.AlloyLogger',
    'ephox.alloy.registry.Registry',
    'ephox.alloy.registry.Tagger',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Result',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.search.Traverse',
    'global!Error'
  ],

  function (
    GuiFactory, SystemEvents, Attachment, SystemApi, Container, Debugging, DescribedHandler, GuiEvents, Triggers, AlloyLogger, Registry, Tagger, Arr, Fun, Result,
    Compare, Focus, Insert, Remove, Node, Class, Traverse, Error
  ) {
    var create = function () {
      var root = GuiFactory.build(
        Container.sketch({
          dom: {
            tag: 'div'
          }
        })
      );
      return takeover(root);
    };

    var takeover = function (root) {
      var isAboveRoot = function (el) {
        return Traverse.parent(root.element()).fold(
          function () {
            return true;
          },
          function (parent) {
            return Compare.eq(el, parent);
          }
        );
      };

      var registry = Registry();

      var lookup = function (eventName, target) {
        return registry.find(isAboveRoot, eventName, target);
      };

      var domEvents = GuiEvents.setup(root.element(), {
        triggerEvent: function (eventName, event) {
          return Debugging.monitorEvent(eventName, event.target(), function (logger) {
            return Triggers.triggerUntilStopped(lookup, eventName, event, logger);
          });
        },

        // This doesn't follow usual DOM bubbling. It will just dispatch on all
        // targets that have the event. It is the general case of the more specialised
        // "message". "messages" may actually just go away. This is used for things
        // like window scroll.
        broadcastEvent: function (eventName, event) {
          var listeners = registry.filter(eventName);
          return Triggers.broadcast(listeners, event);
        }
      });

      var systemApi = SystemApi({
        // This is a real system
        debugInfo: Fun.constant('real'),
        triggerEvent: function (customType, target, data) {
          Debugging.monitorEvent(customType, target, function (logger) {
            // The return value is not used because this is a fake event.
            Triggers.triggerOnUntilStopped(lookup, customType, data, target, logger);
          });
        },
        triggerFocus: function (target, originator) {
          Tagger.read(target).fold(function () {
            // When the target is not within the alloy system, dispatch a normal focus event.
            Focus.focus(target);
          }, function (_alloyId) {
            Debugging.monitorEvent(SystemEvents.focus(), target, function (logger) {
              Triggers.triggerHandler(lookup, SystemEvents.focus(), {
                // originator is used by the default events to ensure that focus doesn't
                // get called infinitely
                originator: Fun.constant(originator),
                target: Fun.constant(target)
              }, target, logger);
            });
          });
        },

        triggerEscape: function (comp, simulatedEvent) {
          systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event());
        },

        getByUid: function (uid) {
          return getByUid(uid);
        },
        getByDom: function (elem) {
          return getByDom(elem);
        },
        build: GuiFactory.build,
        addToGui: function (c) { add(c); },
        removeFromGui: function (c) { remove(c); },
        addToWorld: function (c) { addToWorld(c); },
        removeFromWorld: function (c) { removeFromWorld(c); },
        broadcast: function (message) {
          broadcast(message);
        },
        broadcastOn: function (channels, message) {
          broadcastOn(channels, message);
        }
      });

      var addToWorld = function (component) {
        component.connect(systemApi);
        if (!Node.isText(component.element())) {
          registry.register(component);
          Arr.each(component.components(), addToWorld);
          systemApi.triggerEvent(SystemEvents.systemInit(), component.element(), { target: Fun.constant(component.element()) });
        }
      };

      var removeFromWorld = function (component) {
        if (!Node.isText(component.element())) {
          Arr.each(component.components(), removeFromWorld);
          registry.unregister(component);
        }
        component.disconnect();
      };

      var add = function (component) {
        Attachment.attach(root, component);
      };

      var remove = function (component) {
        Attachment.detach(component);
      };

      var destroy = function () {
        // INVESTIGATE: something with registry?
        domEvents.unbind();
        Remove.remove(root.element());
      };

      var broadcastData = function (data) {
        var receivers = registry.filter(SystemEvents.receive());
        Arr.each(receivers, function (receiver) {
          var descHandler = receiver.descHandler();
          var handler = DescribedHandler.getHandler(descHandler);
          handler(data);
        });
      };

      var broadcast = function (message) {
        broadcastData({
          universal: Fun.constant(true),
          data: Fun.constant(message)
        });
      };

      var broadcastOn = function (channels, message) {
        broadcastData({
          universal: Fun.constant(false),
          channels: Fun.constant(channels),
          data: Fun.constant(message)
        });
      };

      var getByUid = function (uid) {
        return registry.getById(uid).fold(function () {
          return Result.error(
            new Error('Could not find component with uid: "' + uid + '" in system.')
          );
        }, Result.value);
      };

      var getByDom = function (elem) {
        return Tagger.read(elem).bind(getByUid);
      };

      addToWorld(root);

      return {
        root: Fun.constant(root),
        element: root.element,
        destroy: destroy,
        add: add,
        remove: remove,
        getByUid: getByUid,
        getByDom: getByDom,

        addToWorld: addToWorld,
        removeFromWorld: removeFromWorld,

        broadcast: broadcast,
        broadcastOn: broadcastOn
      };
    };

    return {
      create: create,
      takeover: takeover
    };
  }
);
define(
  'tinymce.themes.mobile.ui.OuterContainer',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Swapping',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.system.Gui',
    'ephox.alloy.api.ui.Container',
    'ephox.katamari.api.Fun',
    'tinymce.themes.mobile.style.Styles'
  ],

  function (Behaviour, Swapping, GuiFactory, Gui, Container, Fun, Styles) {
    var READ_ONLY_MODE_CLASS = Fun.constant(Styles.resolve('readonly-mode'));
    var EDIT_MODE_CLASS = Fun.constant(Styles.resolve('edit-mode'));

    return function (spec) {
      var root = GuiFactory.build(
        Container.sketch({
          dom: {
            classes: [ Styles.resolve('outer-container') ].concat(spec.classes)
          },

          containerBehaviours: Behaviour.derive([
            Swapping.config({
              alpha: READ_ONLY_MODE_CLASS(),
              omega: EDIT_MODE_CLASS()
            })
          ])
        })
      );

      return Gui.takeover(root);
    };
  }
);

define(
  'tinymce.themes.mobile.ui.AndroidRealm',

  [
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.alloy.api.behaviour.Swapping',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Singleton',
    'tinymce.themes.mobile.api.AndroidWebapp',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.toolbar.ScrollingToolbar',
    'tinymce.themes.mobile.ui.CommonRealm',
    'tinymce.themes.mobile.ui.Dropup',
    'tinymce.themes.mobile.ui.OuterContainer'
  ],


  function (Replacing, Swapping, Fun, Singleton, AndroidWebapp, Styles, ScrollingToolbar, CommonRealm, Dropup, OuterContainer) {
    return function (scrollIntoView) {
      var alloy = OuterContainer({
        classes: [ Styles.resolve('android-container') ]
      });

      var toolbar = ScrollingToolbar();

      var webapp = Singleton.api();

      var switchToEdit = CommonRealm.makeEditSwitch(webapp);

      var socket = CommonRealm.makeSocket();

      var dropup = Dropup.build(Fun.noop, scrollIntoView);

      alloy.add(toolbar.wrapper());
      alloy.add(socket);
      alloy.add(dropup.component());

      var setToolbarGroups = function (rawGroups) {
        var groups = toolbar.createGroups(rawGroups);
        toolbar.setGroups(groups);
      };

      var setContextToolbar = function (rawGroups) {
        var groups = toolbar.createGroups(rawGroups);
        toolbar.setContextToolbar(groups);
      };

      // You do not always want to do this.
      var focusToolbar = function () {
        toolbar.focus();
      };

      var restoreToolbar = function () {
        toolbar.restoreToolbar();
      };

      var init = function (spec) {
        webapp.set(
          AndroidWebapp.produce(spec)
        );
      };

      var exit = function () {
        webapp.run(function (w) {
          w.exit();
          Replacing.remove(socket, switchToEdit);
        });
      };

      var updateMode = function (readOnly) {
        CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root());
      };

      return {
        system: Fun.constant(alloy),
        element: alloy.element,
        init: init,
        exit: exit,
        setToolbarGroups: setToolbarGroups,
        setContextToolbar: setContextToolbar,
        focusToolbar: focusToolbar,
        restoreToolbar: restoreToolbar,
        updateMode: updateMode,
        socket: Fun.constant(socket),
        dropup: Fun.constant(dropup)
      };
    };
  }
);

define(
  'ephox.sugar.api.view.Position',

  [
    'ephox.katamari.api.Fun'
  ],

  function (Fun) {
    var r = function (left, top) {
      var translate = function (x, y) {
        return r(left + x, top + y);
      };

      return {
        left: Fun.constant(left),
        top: Fun.constant(top),
        translate: translate
      };
    };

    return r;
  }
);

define(
  'ephox.sugar.api.dom.Dom',

  [
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'ephox.sugar.api.search.PredicateFind',
    'global!document'
  ],

  function (Fun, Compare, Element, Node, PredicateFind, document) {
    // TEST: Is this just Body.inBody which doesn't need scope ??
    var attached = function (element, scope) {
      var doc = scope || Element.fromDom(document.documentElement);
      return PredicateFind.ancestor(element, Fun.curry(Compare.eq, doc)).isSome();
    };

    // TEST: Is this just Traverse.defaultView ??
    var windowOf = function (element) {
      var dom = element.dom();
      if (dom === dom.window) return element;
      return Node.isDocument(element) ? dom.defaultView || dom.parentWindow : null;
    };

    return {
      attached: attached,
      windowOf: windowOf
    };
  }
);

define(
  'ephox.sugar.api.view.Location',

  [
    'ephox.sugar.api.view.Position',
    'ephox.sugar.api.dom.Dom',
    'ephox.sugar.api.node.Element'
  ],

  function (Position, Dom, Element) {
    var boxPosition = function (dom) {
      var box = dom.getBoundingClientRect();
      return Position(box.left, box.top);
    };

    // Avoids falsy false fallthrough
    var firstDefinedOrZero = function (a, b) {
      return a !== undefined ? a :
             b !== undefined ? b :
             0;
    };

    var absolute = function (element) {
      var doc = element.dom().ownerDocument;
      var body = doc.body;
      var win = Dom.windowOf(Element.fromDom(doc));
      var html = doc.documentElement;


      var scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop);
      var scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft);

      var clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
      var clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);

      return viewport(element).translate(
          scrollLeft - clientLeft,
          scrollTop - clientTop);
    };

    // This is the old $.position(), but JQuery does nonsense calculations.
    // We're only 1 <-> 1 with the old value in the single place we use this function
    // (ego.api.Dragging) so the rest can bite me.
    var relative = function (element) {
      var dom = element.dom();
      // jquery-ism: when style="position: fixed", this === boxPosition()
      // but tests reveal it returns the same thing anyway
      return Position(dom.offsetLeft, dom.offsetTop);
    };

    var viewport = function (element) {
      var dom = element.dom();

      var doc = dom.ownerDocument;
      var body = doc.body;
      var html = Element.fromDom(doc.documentElement);

      if (body === dom)
        return Position(body.offsetLeft, body.offsetTop);

      if (!Dom.attached(element, html))
        return Position(0, 0);

      return boxPosition(dom);
    };

    return {
      absolute: absolute,
      relative: relative,
      viewport: viewport
    };
  }
);

define(
  'tinymce.themes.mobile.ios.core.IosEvents',

  [
    'ephox.alloy.events.TapEvent',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Throttler',
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.view.Height',
    'ephox.sugar.api.view.Location',
    'tinymce.themes.mobile.util.TappingEvent'
  ],

  function (TapEvent, Arr, Throttler, Compare, DomEvent, Height, Location, TappingEvent) {
    var initEvents = function (editorApi, iosApi, toolstrip, socket, dropup) {
      var saveSelectionFirst = function () {
        iosApi.run(function (api) {
          api.highlightSelection();
        });
      };

      var refreshIosSelection = function () {
        iosApi.run(function (api) {
          api.refreshSelection();
        });
      };

      var scrollToY = function (yTop, height) {
        // Because the iframe has no scroll, and the socket is the part that scrolls,
        // anything visible inside the iframe actually has a top value (for bounding
        // rectangle) > socket.scrollTop. The rectangle is with respect to the top of
        // the iframe, which has scrolled up above the socket viewport.
        var y = yTop - socket.dom().scrollTop;
        iosApi.run(function (api) {
          api.scrollIntoView(y, y + height);
        });
      };

      var scrollToElement = function (target) {
        var yTop = Location.absolute(target).top();
        var height = Height.get(target);
        scrollToY(iosApi, socket, yTop, height);
      };

      var scrollToCursor = function () {
        editorApi.getCursorBox().each(function (box) {
          scrollToY(box.top(), box.height());
        });
      };

      var clearSelection = function () {
        // Clear any fake selections visible.
        iosApi.run(function (api) {
          api.clearSelection();
        });
      };

      var clearAndRefresh = function () {
        clearSelection();
        refreshThrottle.throttle();
      };

      var refreshView = function () {
        scrollToCursor(editorApi, iosApi, socket);
        iosApi.run(function (api) {
          api.syncHeight();
        });
      };

      var reposition = function () {
        var toolbarHeight = Height.get(toolstrip);
        iosApi.run(function (api) {
          api.setViewportOffset(toolbarHeight);
        });

        refreshIosSelection(iosApi);
        refreshView(editorApi, iosApi, socket);
      };

      var toEditing = function () {
        iosApi.run(function (api) {
          api.toEditing();
        });
      };

      var toReading = function () {
        iosApi.run(function (api) {
          api.toReading();
        });
      };

      var onToolbarTouch = function (event) {
        iosApi.run(function (api) {
          api.onToolbarTouch(event);
        });
      };

      var tapping = TappingEvent.monitor(editorApi);

      var refreshThrottle = Throttler.last(refreshView, 300);
      var listeners = [
        // Clear any fake selections, scroll to cursor, and update the iframe height
        editorApi.onKeyup(clearAndRefresh),
        // Update any fake selections that are showing
        editorApi.onNodeChanged(refreshIosSelection),

        // Scroll to cursor, and update the iframe height
        editorApi.onDomChanged(refreshThrottle.throttle),
        // Update any fake selections that are showing
        editorApi.onDomChanged(refreshIosSelection),

        // Scroll to cursor and update the iframe height
        editorApi.onScrollToCursor(function (tinyEvent) {
          tinyEvent.preventDefault();
          refreshThrottle.throttle();
        }),

        // Scroll to element
        editorApi.onScrollToElement(function (event) {
          scrollToElement(event.element());
        }),

        // Focus the content and show the keyboard
        editorApi.onToEditing(toEditing),

        // Dismiss keyboard
        editorApi.onToReading(toReading),

        // If the user is touching outside the content, but on the body(?) or html elements, find the nearest selection
        // and focus that.
        DomEvent.bind(editorApi.doc(), 'touchend', function (touchEvent) {
          if (Compare.eq(editorApi.html(), touchEvent.target()) || Compare.eq(editorApi.body(), touchEvent.target())) {
            // IosHacks.setSelectionAtTouch(editorApi, touchEvent);
          }
        }),

        // Listen to the toolstrip growing animation so that we can update the position of the socket once it is done.
        DomEvent.bind(toolstrip, 'transitionend', function (transitionEvent) {
          if (transitionEvent.raw().propertyName === 'height') {
            reposition();
          }
        }),

        // Capture the start of interacting with a toolstrip. It is most likely going to lose the selection, so we save it
        // before that happens
        DomEvent.capture(toolstrip, 'touchstart', function (touchEvent) {
          // When touching the toolbar, the first thing that we need to do is 'represent' the selection. We do this with
          // a fake selection. As soon as the focus switches away from the content, the real selection will disappear, so
          // this lets the user still see their selection.

          saveSelectionFirst();

          // Then, depending on the keyboard mode, we may need to do something else (like dismiss the keyboard)
          onToolbarTouch(touchEvent);

          // Fire the touchstart event to the theme for things like hiding dropups
          editorApi.onTouchToolstrip();
        }),

        // When the user clicks back into the content, clear any fake selections
        DomEvent.bind(editorApi.body(), 'touchstart', function (evt) {
          clearSelection();
          editorApi.onTouchContent();
          tapping.fireTouchstart(evt);
        }),

        tapping.onTouchmove(),
        tapping.onTouchend(),

        // Stop any "clicks" being processed in the body at alls
        DomEvent.bind(editorApi.body(), 'click', function (event) {
          event.kill();
        }),

        // Close any menus when scrolling the toolstrip
        DomEvent.bind(toolstrip, 'touchmove', function (/* event */) {
          editorApi.onToolbarScrollStart();
        })
      ];

      var destroy = function () {
        Arr.each(listeners, function (l) {
          l.unbind();
        });
      };

      return {
        destroy: destroy
      };
    };


    return {
      initEvents: initEvents
    };
  }
);

define(
  'tinymce.themes.mobile.touch.focus.CursorRefresh',

  [
    'ephox.sugar.api.dom.Focus',
    'global!setTimeout'
  ],

  function (Focus, setTimeout) {
    var refreshInput = function (input) {
      // This is magic used to refresh the iOS cursor on an input field when input focus is
      // lost and then restored. The setTime out is important for consistency, a lower value
      // may not yield a successful reselection when the time out value is 10, 30% success
      // on making the blue selection reappear.
      var start = input.dom().selectionStart;
      var end = input.dom().selectionEnd;
      var dir = input.dom().selectionDirection;
      setTimeout(function () {
        input.dom().setSelectionRange(start, end, dir);
        Focus.focus(input);
      }, 50);
    };

    var refresh = function (winScope) {
      // Sometimes the cursor can get out of sync with the content, it looks weird and importantly
      // it causes the code that dismisses the keyboard to fail, Fussy has selection code, but since
      // this is fired often and confined to iOS, it's implemented with more native code. Note, you
      // can see the need for this if you remove this code, and click near the bottom of the content
      // and start typing. The content will scroll up to go into the greenzone, but the cursor will
      // still display in the old location. It only updates once you keep typing. However, if we do this
      // hack, then the cursor is updated. You'll still have any autocorrect selection boxes, though.
      var sel = winScope.getSelection();
      if (sel.rangeCount > 0) {
        var br = sel.getRangeAt(0);
        var r = winScope.document.createRange();
        r.setStart(br.startContainer, br.startOffset);
        r.setEnd(br.endContainer, br.endOffset);

        // Note, if dropdowns appear to flicker, we might want to remove this line. All selections
        // (not Firefox) probably just replace the one selection anyway.
        sel.removeAllRanges();
        sel.addRange(r);
      }
    };

    return {
      refreshInput: refreshInput,
      refresh: refresh
    };
  }
);

define(
  'tinymce.themes.mobile.ios.focus.ResumeEditing',

  [
    'ephox.sugar.api.dom.Compare',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.node.Element',
    'tinymce.themes.mobile.touch.focus.CursorRefresh'
  ],

  function (Compare, Focus, Element, CursorRefresh) {
    var resume = function (cWin, frame) {
      Focus.active().each(function (active) {
        // INVESTIGATE: This predicate may not be required. The purpose of it is to ensure
        // that the content window's frame element is not unnecessarily blurred before giving
        // it focus.
        if (! Compare.eq(active, frame)) {
          Focus.blur(active);
        }
      });
      // Required when transferring from another input area.
      cWin.focus();

      Focus.focus(Element.fromDom(cWin.document.body));
      CursorRefresh.refresh(cWin);
    };

    return {
      resume: resume
    };
  }
);

define(
  'tinymce.themes.mobile.ios.focus.FakeSelection',

  [
    'ephox.katamari.api.Arr',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.Traverse',
    'tinymce.themes.mobile.ios.focus.ResumeEditing',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.Rectangles'
  ],

  function (Arr, Insert, InsertAll, Remove, DomEvent, Element, Class, Classes, Css, Traverse, ResumeEditing, Styles, Rectangles) {
    return function (win, frame) {
      // NOTE: This may be required for android also.


      /*
       * FakeSelection is used to draw rectangles around selection so that when the content loses
       * focus, the selection is still visible. The selections should match the current content
       * selection, and be removed as soon as the user clicks on them (because the content will
       * get focus again)
       */
      var doc = win.document;

      var container = Element.fromTag('div');
      Class.add(container, Styles.resolve('unfocused-selections'));

      Insert.append(Element.fromDom(doc.documentElement), container);

      var onTouch = DomEvent.bind(container, 'touchstart', function (event) {
        // We preventDefault the event incase the touch is between 2 letters creating a new collapsed selection,
        // in this very specific case we just want to turn the fake cursor into a real cursor.  Remember that
        // touchstart may be used to dimiss popups too, so don't kill it completely, just prevent its
        // default native selection
        event.prevent();
        ResumeEditing.resume(win, frame);
        clear();
      });

      var make = function (rectangle) {
        var span = Element.fromTag('span');
        Classes.add(span, [ Styles.resolve('layer-editor'), Styles.resolve('unfocused-selection') ]);
        Css.setAll(span, {
          'left': rectangle.left() + 'px',
          'top': rectangle.top() + 'px',
          'width': rectangle.width() + 'px',
          'height': rectangle.height() + 'px'
        });
        return span;
      };

      var update = function () {
        clear();
        var rectangles = Rectangles.getRectangles(win);
        var spans = Arr.map(rectangles, make);
        InsertAll.append(container, spans);
      };

      var clear = function () {
        Remove.empty(container);
      };

      var destroy = function () {
        onTouch.unbind();
        Remove.remove(container);
      };

      var isActive = function () {
        return Traverse.children(container).length > 0;
      };

      return {
        update: update,
        isActive: isActive,
        destroy: destroy,
        clear: clear
      };
    };
  }
);
define(
  'ephox.katamari.api.LazyValue',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'global!setTimeout'
  ],

  function (Arr, Option, setTimeout) {
    var nu = function (baseFn) {
      var data = Option.none();
      var callbacks = [];

      /** map :: this LazyValue a -> (a -> b) -> LazyValue b */
      var map = function (f) {
        return nu(function (nCallback) {
          get(function (data) {
            nCallback(f(data));
          });
        });
      };

      var get = function (nCallback) {
        if (isReady()) call(nCallback);
        else callbacks.push(nCallback);
      };

      var set = function (x) {
        data = Option.some(x);
        run(callbacks);
        callbacks = [];
      };

      var isReady = function () {
        return data.isSome();
      };

      var run = function (cbs) {
        Arr.each(cbs, call);
      };

      var call = function(cb) {
        data.each(function(x) {
          setTimeout(function() {
            cb(x);
          }, 0);
        });
      };

      // Lazy values cache the value and kick off immediately
      baseFn(set);

      return {
        get: get,
        map: map,
        isReady: isReady
      };
    };

    var pure = function (a) {
      return nu(function (callback) {
        callback(a);
      });
    };

    return {
      nu: nu,
      pure: pure
    };
  }
);
define(
  'ephox.katamari.async.Bounce',

  [
    'global!Array',
    'global!setTimeout'
  ],

  function (Array, setTimeout) {

    var bounce = function(f) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var me = this;
        setTimeout(function() {
          f.apply(me, args);
        }, 0);
      };
    };

    return {
      bounce: bounce
    };
  }
);

define(
  'ephox.katamari.api.Future',

  [
    'ephox.katamari.api.LazyValue',
    'ephox.katamari.async.Bounce'
  ],

  /** A future value that is evaluated on demand. The base function is re-evaluated each time 'get' is called. */
  function (LazyValue, Bounce) {
    var nu = function (baseFn) {
      var get = function(callback) {
        baseFn(Bounce.bounce(callback));
      };

      /** map :: this Future a -> (a -> b) -> Future b */
      var map = function (fab) {
        return nu(function (callback) {
          get(function (a) {
            var value = fab(a);
            callback(value);
          });
        });
      };

      /** bind :: this Future a -> (a -> Future b) -> Future b */
      var bind = function (aFutureB) {
        return nu(function (callback) {
          get(function (a) {
            aFutureB(a).get(callback);
          });
        });
      };

      /** anonBind :: this Future a -> Future b -> Future b
       *  Returns a future, which evaluates the first future, ignores the result, then evaluates the second.
       */
      var anonBind = function (futureB) {
        return nu(function (callback) {
          get(function (a) {
            futureB.get(callback);
          });
        });
      };

      var toLazy = function () {
        return LazyValue.nu(get);
      };

      return {
        map: map,
        bind: bind,
        anonBind: anonBind,
        toLazy: toLazy,
        get: get
      };

    };

    /** a -> Future a */
    var pure = function (a) {
      return nu(function (callback) {
        callback(a);
      });
    };

    return {
      nu: nu,
      pure: pure
    };
  }
);

define(
  'tinymce.themes.mobile.ios.smooth.SmoothAnimation',

  [
    'ephox.katamari.api.Option',
    'global!clearInterval',
    'global!Math',
    'global!setInterval'
  ],

  function (Option, clearInterval, Math, setInterval) {
    var adjust = function (value, destination, amount) {
      if (Math.abs(value - destination) <= amount) {
        return Option.none();
      } else if (value < destination) {
        return Option.some(value + amount);
      } else {
        return Option.some(value - amount);
      }
    };

    var create = function () {
      var interval = null;

      var animate = function (getCurrent, destination, amount, increment, doFinish, rate) {
        var finished = false;

        var finish = function (v) {
          finished = true;
          doFinish(v);
        };

        clearInterval(interval);

        var abort = function (v) {
          clearInterval(interval);
          finish(v);
        };

        interval = setInterval(function () {
          var value = getCurrent();
          adjust(value, destination, amount).fold(function () {
            clearInterval(interval);
            finish(destination);
          }, function (s) {
            increment(s, abort);
            if (! finished) {
              var newValue = getCurrent();
              // Jump to the end if the increment is no longer working.
              if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
                clearInterval(interval);
                finish(destination);
              }
            }
          });
        }, rate);
      };

      return {
        animate: animate
      };
    };

    return {
      create: create,
      adjust: adjust
    };
  }
);

define(
  'tinymce.themes.mobile.ios.view.Devices',

  [
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Options'
  ],

  function (Option, Options) {
    /*

    DEVICE SCREEN AND KEYBOARD SIZES

    iPhone 4
    320 x 480
    portrait  : 297
    landscape : 237

    iPhone 5
    320 x 568
    portrait  : 297
    landscape : 237

    iPhone 6
    375 x 667
    portrait  : 302
    landscape : 237

    iPhone 6 +
    414 x 736
    portrait  : 314
    landscape : 238

    iPad (mini and full)
    768 x 1024
    portrait  : 313
    landscape : 398

    iPad Pro
    1024 x 1366
    portrait  : 371
    landscape : 459

    */

    var findDevice = function (deviceWidth, deviceHeight) {
      var devices = [
        // iPhone 4 class
        { width: 320, height: 480, keyboard: { portrait: 300, landscape: 240 } },
        // iPhone 5 class
        { width: 320, height: 568, keyboard: { portrait: 300, landscape: 240 } },
        // iPhone 6 class
        { width: 375, height: 667, keyboard: { portrait: 305, landscape: 240 } },
        // iPhone 6+ class
        { width: 414, height: 736, keyboard: { portrait: 320, landscape: 240 } },
        // iPad class
        { width: 768, height: 1024, keyboard: { portrait: 320, landscape: 400 } },
        // iPad pro class
        { width: 1024, height: 1366, keyboard: { portrait: 380, landscape: 460 } }
      ];

      return Options.findMap(devices, function (device) {
        return deviceWidth <= device.width && deviceHeight <= device.height ?
            Option.some(device.keyboard) :
            Option.none();
      }).getOr({ portrait: deviceHeight / 5, landscape: deviceWidth / 4 });
    };

    return {
      findDevice: findDevice
    };
  }
);
define(
  'tinymce.themes.mobile.ios.view.DeviceZones',

  [
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.view.Height',
    'tinymce.themes.mobile.ios.view.Devices',
    'tinymce.themes.mobile.touch.view.Orientation'
  ],

  function (Css, Traverse, Height, Devices, Orientation) {
    // Green zone is the area below the toolbar and above the keyboard, its considered the viewable
    // region that is not obstructed by the keyboard. If the keyboard is down, then the Green Zone is larger.

      /*
          _______________________
          |        toolbar      |
          |_____________________|
          |                     |
          |                     |
          |       greenzone     |
          |_____________________|
          |                     |
          |       keyboard      |
          |_____________________|

      */

    var softKeyboardLimits = function (outerWindow) {
      return Devices.findDevice(outerWindow.screen.width, outerWindow.screen.height);
    };

    var accountableKeyboardHeight = function (outerWindow) {
      var portrait = Orientation.get(outerWindow).isPortrait();
      var limits = softKeyboardLimits(outerWindow);

      var keyboard = portrait ? limits.portrait : limits.landscape;

      var visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width;

      // This is our attempt to detect when we are in a webview. If the DOM window height is smaller than the
      // actual screen height by about the size of a keyboard, we assume that's because a keyboard is
      // causing it to be that small. We will improve this at a later date.
      return (visualScreenHeight - outerWindow.innerHeight) > keyboard ? 0 : keyboard;
    };

    var getGreenzone = function (socket, dropup) {
      var outerWindow = Traverse.owner(socket).dom().defaultView;
      // Include the dropup for this calculation because it represents the total viewable height.
      var viewportHeight = Height.get(socket) + Height.get(dropup);
      var acc = accountableKeyboardHeight(outerWindow);
      return viewportHeight - acc;
    };

    var updatePadding = function (contentBody, socket, dropup) {
      var greenzoneHeight = getGreenzone(socket, dropup);
      var deltaHeight = (Height.get(socket) + Height.get(dropup)) - greenzoneHeight;
      // TBIO-3878 Changed the element that was receiving the padding from the iframe to the body of the
      // iframe's document. The reasoning for this is that the syncHeight function of IosSetup.js relies on
      // the scrollHeight of the body to set the height of the iframe itself. If we don't set the
      // padding-bottom on the body, the scrollHeight is too short, effectively disappearing the content from view.
      Css.set(contentBody, 'padding-bottom', deltaHeight + 'px');
    };

    return {
      getGreenzone: getGreenzone,
      updatePadding: updatePadding
    };
  }
);
define(
  'tinymce.themes.mobile.ios.view.IosViewport',

  [
    'ephox.katamari.api.Adt',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.search.Traverse',
    'ephox.sugar.api.view.Height',
    'tinymce.themes.mobile.ios.view.DeviceZones',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.scroll.Scrollable',
    'tinymce.themes.mobile.util.DataAttributes'
  ],

  function (Adt, Arr, Fun, Attr, Css, SelectorFilter, Traverse, Height, DeviceZones, Styles, Scrollable, DataAttributes) {
    var fixture = Adt.generate([
      { 'fixed': [ 'element', 'property', 'offsetY' ] },
      // Not supporting property yet
      { 'scroller' :[ 'element', 'offsetY' ] }
    ]);

    var yFixedData = 'data-' + Styles.resolve('position-y-fixed');
    var yFixedProperty = 'data-' + Styles.resolve('y-property');
    var yScrollingData = 'data-' + Styles.resolve('scrolling');
    var windowSizeData = 'data-' + Styles.resolve('last-window-height');

    var getYFixedData = function (element) {
      return DataAttributes.safeParse(element, yFixedData);
    };

    var getYFixedProperty = function (element) {
      return Attr.get(element, yFixedProperty);
    };

    var getLastWindowSize = function (element) {
      return DataAttributes.safeParse(element, windowSizeData);
    };

    var classifyFixed = function (element, offsetY) {
      var prop = getYFixedProperty(element);
      return fixture.fixed(element, prop, offsetY);
    };

    var classifyScrolling = function (element, offsetY) {
      return fixture.scroller(element, offsetY);
    };

    var classify = function (element) {
      var offsetY = getYFixedData(element);
      var classifier = Attr.get(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed;
      return classifier(element, offsetY);
    };

    var findFixtures = function (container) {
      var candidates = SelectorFilter.descendants(container, '[' + yFixedData + ']');
      return Arr.map(candidates, classify);
    };

    var takeoverToolbar = function (toolbar) {
      var oldToolbarStyle = Attr.get(toolbar, 'style');
      Css.setAll(toolbar, {
        position: 'absolute',
        top: '0px'
      });

      Attr.set(toolbar, yFixedData, '0px');
      Attr.set(toolbar, yFixedProperty, 'top');

      var restore = function () {
        Attr.set(toolbar, 'style', oldToolbarStyle || '');
        Attr.remove(toolbar, yFixedData);
        Attr.remove(toolbar, yFixedProperty);
      };

      return {
        restore: restore
      };
    };

    var takeoverViewport = function (toolbarHeight, height, viewport) {
      var oldViewportStyle = Attr.get(viewport, 'style');

      Scrollable.register(viewport);
      Css.setAll(viewport, {
        'position': 'absolute',
        // I think there a class that does this overflow scrolling touch part
        'height': height + 'px',
        'width': '100%',
        'top': toolbarHeight + 'px'
      });

      Attr.set(viewport, yFixedData, toolbarHeight + 'px');
      Attr.set(viewport, yScrollingData, 'true');
      Attr.set(viewport, yFixedProperty, 'top');

      var restore = function () {
        Scrollable.deregister(viewport);
        Attr.set(viewport, 'style', oldViewportStyle || '');
        Attr.remove(viewport, yFixedData);
        Attr.remove(viewport, yScrollingData);
        Attr.remove(viewport, yFixedProperty);
      };

      return {
        restore: restore
      };
    };

    var takeoverDropup = function (dropup, toolbarHeight, viewportHeight) {
      var oldDropupStyle = Attr.get(dropup, 'style');
      Css.setAll(dropup, {
        position: 'absolute',
        bottom: '0px'
      });

      Attr.set(dropup, yFixedData, '0px');
      Attr.set(dropup, yFixedProperty, 'bottom');

      var restore = function () {
        Attr.set(dropup, 'style', oldDropupStyle || '');
        Attr.remove(dropup, yFixedData);
        Attr.remove(dropup, yFixedProperty);
      };

      return {
        restore: restore
      };
    };

    var deriveViewportHeight = function (viewport, toolbarHeight, dropupHeight) {
      // Note, Mike thinks this value changes when the URL address bar grows and shrinks. If this value is too high
      // the main problem is that scrolling into the greenzone may not scroll into an area that is viewable. Investigate.
      var outerWindow = Traverse.owner(viewport).dom().defaultView;
      var winH = outerWindow.innerHeight;
      Attr.set(viewport, windowSizeData, winH + 'px');
      return winH - toolbarHeight - dropupHeight;
    };

    var takeover = function (viewport, contentBody, toolbar, dropup) {
      var outerWindow = Traverse.owner(viewport).dom().defaultView;
      var toolbarSetup = takeoverToolbar(toolbar);
      var toolbarHeight = Height.get(toolbar);
      var dropupHeight = Height.get(dropup);
      var viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight);

      var viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport);

      var dropupSetup = takeoverDropup(dropup, toolbarHeight, viewportHeight);

      var isActive = true;

      var restore = function () {
        isActive = false;
        toolbarSetup.restore();
        viewportSetup.restore();
        dropupSetup.restore();
      };

      var isExpanding = function () {
        var currentWinHeight = outerWindow.innerHeight;
        var lastWinHeight = getLastWindowSize(viewport);
        return currentWinHeight > lastWinHeight;
      };

      var refresh = function () {
        if (isActive) {
          var newToolbarHeight = Height.get(toolbar);
          var dropupHeight = Height.get(dropup);
          var newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight);
          Attr.set(viewport, yFixedData, newToolbarHeight + 'px');
          Css.set(viewport, 'height', newHeight + 'px');

          Css.set(dropup, 'bottom', -(newToolbarHeight + newHeight + dropupHeight) + 'px');
          DeviceZones.updatePadding(contentBody, viewport, dropup);
        }
      };

      var setViewportOffset = function (newYOffset) {
        var offsetPx = newYOffset + 'px';
        Attr.set(viewport, yFixedData, offsetPx);
        // The toolbar height has probably changed, so recalculate the viewport height.
        refresh();
      };

      DeviceZones.updatePadding(contentBody, viewport, dropup);

      return {
        setViewportOffset: setViewportOffset,
        isExpanding: isExpanding,
        isShrinking: Fun.not(isExpanding),
        refresh: refresh,
        restore: restore
      };
    };

    return {
      findFixtures: findFixtures,
      takeover: takeover,
      getYFixedData: getYFixedData
    };
  }
);

define(
  'tinymce.themes.mobile.ios.scroll.IosScrolling',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Future',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.properties.Classes',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.search.Traverse',
    'global!Math',
    'tinymce.themes.mobile.ios.smooth.SmoothAnimation',
    'tinymce.themes.mobile.ios.view.IosViewport',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.util.DataAttributes'
  ],

  function (Fun, Future, Attr, Classes, Css, Traverse, Math, SmoothAnimation, IosViewport, Styles, DataAttributes) {
    var animator = SmoothAnimation.create();

    var ANIMATION_STEP = 15;
    var NUM_TOP_ANIMATION_FRAMES = 10;
    var ANIMATION_RATE = 10;

    var lastScroll = 'data-' + Styles.resolve('last-scroll-top');

    var getTop = function (element) {
      var raw = Css.getRaw(element, 'top').getOr(0);
      return parseInt(raw, 10);
    };

    var getScrollTop = function (element) {
      return parseInt(element.dom().scrollTop, 10);
    };

    var moveScrollAndTop = function (element, destination, finalTop) {
      return Future.nu(function (callback) {
        var getCurrent = Fun.curry(getScrollTop, element);

        var update = function (newScroll) {
          element.dom().scrollTop = newScroll;
          Css.set(element, 'top', (getTop(element) + ANIMATION_STEP) + 'px');
        };

        var finish = function (/* dest */) {
          element.dom().scrollTop = destination;
          Css.set(element, 'top', finalTop + 'px');
          callback(destination);
        };

        animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE);
      });
    };

    var moveOnlyScroll = function (element, destination) {
      return Future.nu(function (callback) {
        var getCurrent = Fun.curry(getScrollTop, element);
        Attr.set(element, lastScroll, getCurrent());

        var update = function (newScroll, abort) {
          var previous = DataAttributes.safeParse(element, lastScroll);
          // As soon as we detect a scroll value that we didn't set, assume the user
          // is scrolling, and abort the scrolling.
          if (previous !== element.dom().scrollTop) {
            abort(element.dom().scrollTop);
          } else {
            element.dom().scrollTop = newScroll;
            Attr.set(element, lastScroll, newScroll);
          }
        };

        var finish = function (/* dest */) {
          element.dom().scrollTop = destination;
          Attr.set(element, lastScroll, destination);
          callback(destination);
        };

        // Identify the number of steps based on distance (consistent time)
        var distance = Math.abs(destination - getCurrent());
        var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
        animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
      });
    };

    var moveOnlyTop = function (element, destination) {
      return Future.nu(function (callback) {
        var getCurrent = Fun.curry(getTop, element);

        var update = function (newTop) {
          Css.set(element, 'top', newTop + 'px');
        };

        var finish = function (/* dest */) {
          update(destination);
          callback(destination);
        };

        var distance = Math.abs(destination - getCurrent());
        var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
        animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
      });
    };

    var updateTop = function (element, amount) {
      var newTop = (amount + IosViewport.getYFixedData(element)) + 'px';
      Css.set(element, 'top', newTop);
    };

    // Previously, we moved the window scroll back smoothly with the SmoothAnimation concept.
    // However, on tinyMCE, we seemed to get a lot more cursor flickering as the window scroll
    // was changing. Therefore, until tests prove otherwise, we are just going to jump to the
    // destination in one go.
    var moveWindowScroll = function (toolbar, viewport, destY) {
      var outerWindow = Traverse.owner(toolbar).dom().defaultView;
      return Future.nu(function (callback) {
        updateTop(toolbar, destY);
        updateTop(viewport, destY);
        outerWindow.scrollTo(0, destY);
        callback(destY);
      });
    };

    return {
      moveScrollAndTop: moveScrollAndTop,
      moveOnlyScroll: moveOnlyScroll,
      moveOnlyTop: moveOnlyTop,
      moveWindowScroll: moveWindowScroll
    };
  }
);

define(
  'tinymce.themes.mobile.ios.smooth.BackgroundActivity',

  [
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.LazyValue'
  ],

  function (Cell, LazyValue) {
    return function (doAction) {
      // Start the activity in idle state.
      var action = Cell(
        LazyValue.pure({})
      );

      var start = function (value) {
        var future = LazyValue.nu(function (callback) {
          return doAction(value).get(callback);
        });

        // Note: LazyValue kicks off immediately
        action.set(future);
      };

      // Idle will fire g once the current action is complete.
      var idle = function (g) {
        action.get().get(function () {
          g();
        });
      };

      return {
        start: start,
        idle: idle
      };
    };
  }
);

define(
  'tinymce.themes.mobile.ios.view.Greenzone',

  [
    'ephox.katamari.api.Fun',
    'global!parseInt',
    'tinymce.themes.mobile.ios.scroll.IosScrolling',
    'tinymce.themes.mobile.ios.view.DeviceZones',
    'tinymce.themes.mobile.touch.focus.CursorRefresh'
  ],

  function (Fun, parseInt, IosScrolling, DeviceZones, CursorRefresh) {
    var scrollIntoView = function (cWin, socket, dropup, top, bottom) {
      var greenzone = DeviceZones.getGreenzone(socket, dropup);
      var refreshCursor = Fun.curry(CursorRefresh.refresh, cWin);

      if (top > greenzone || bottom > greenzone) {
        IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor);
      } else if (top < 0) {
        IosScrolling.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor);
      } else {
        // do nothing
      }
    };

    return {
      scrollIntoView: scrollIntoView
    };
  }
);
define(
  'ephox.katamari.async.AsyncValues',

  [
    'ephox.katamari.api.Arr'
  ],

  function (Arr) {
    /* 
     * NOTE: an `asyncValue` must have a `get` function which gets given a callback and calls 
     * that callback with a value once it is ready
     *
     * e.g 
     * {
     *   get: function (callback) { callback(10); }
     * }
     */
    var par = function (asyncValues, nu) {
      return nu(function(callback) {
        var r = [];
        var count = 0;

        var cb = function(i) {
          return function(value) {
            r[i] = value;
            count++;
            if (count >= asyncValues.length) {
              callback(r);
            }
          };
        };

        if (asyncValues.length === 0) {
          callback([]);
        } else {
          Arr.each(asyncValues, function(asyncValue, i) {
            asyncValue.get(cb(i));
          });
        }
      });
    };

    return {
      par: par
    };
  }
);
define(
  'ephox.katamari.api.Futures',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Future',
    'ephox.katamari.async.AsyncValues'
  ],

  function (Arr, Future, AsyncValues) {
    /** par :: [Future a] -> Future [a] */
    var par = function(futures) {
      return AsyncValues.par(futures, Future.nu);
    };

    /** mapM :: [a] -> (a -> Future b) -> Future [b] */
    var mapM = function(array, fn) {
      var futures = Arr.map(array, fn);
      return par(futures);
    };

    /** Kleisli composition of two functions: a -> Future b.
     *  Note the order of arguments: g is invoked first, then the result passed to f.
     *  This is in line with f . g = \x -> f (g a)
     *
     *  compose :: ((b -> Future c), (a -> Future b)) -> a -> Future c
     */
    var compose = function (f, g) {
      return function (a) {
        return g(a).bind(f);
      };
    };

    return {
      par: par,
      mapM: mapM,
      compose: compose
    };
  }
);
define(
  'tinymce.themes.mobile.ios.view.IosUpdates',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Future',
    'ephox.katamari.api.Futures',
    'ephox.sugar.api.properties.Css',
    'tinymce.themes.mobile.ios.scroll.IosScrolling',
    'tinymce.themes.mobile.ios.view.IosViewport'
  ],

  function (Arr, Future, Futures, Css, IosScrolling, IosViewport) {
    var updateFixed = function (element, property, winY, offsetY) {
      var destination = winY + offsetY;
      Css.set(element, property, destination + 'px');
      return Future.pure(offsetY);
    };

    var updateScrollingFixed = function (element, winY, offsetY) {
      var destTop = winY + offsetY;
      var oldProp = Css.getRaw(element, 'top').getOr(offsetY);
      // While we are changing top, aim to scroll by the same amount to keep the cursor in the same location.
      var delta = destTop - parseInt(oldProp, 10);
      var destScroll = element.dom().scrollTop + delta;
      return IosScrolling.moveScrollAndTop(element, destScroll, destTop);
    };

    var updateFixture = function (fixture, winY) {
      return fixture.fold(function (element, property, offsetY) {
        return updateFixed(element, property, winY, offsetY);
      }, function (element, offsetY) {
        return updateScrollingFixed(element, winY, offsetY);
      });
    };

    var updatePositions = function (container, winY) {
      var fixtures = IosViewport.findFixtures(container);
      var updates = Arr.map(fixtures, function (fixture) {
        return updateFixture(fixture, winY);
      });
      return Futures.par(updates);
    };

    return {
      updatePositions: updatePositions
    };
  }
);

define(
  'tinymce.themes.mobile.util.CaptureBin',

  [
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Css'
  ],

  function (Focus, Insert, Remove, Element, Css) {
    var input = function (parent, operation) {
      // to capture focus allowing the keyboard to remain open with no 'real' selection
      var input = Element.fromTag('input');
      Css.setAll(input, {
        'opacity': '0',
        'position': 'absolute',
        'top': '-1000px',
        'left': '-1000px'
      });
      Insert.append(parent, input);

      Focus.focus(input);
      operation(input);
      Remove.remove(input);
    };

    return {
      input: input
    };
  }
);
define(
  'tinymce.themes.mobile.ios.core.IosSetup',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.katamari.api.Throttler',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Css',
    'global!clearInterval',
    'global!clearTimeout',
    'global!console',
    'global!Math',
    'global!parseInt',
    'global!setInterval',
    'global!setTimeout',
    'tinymce.themes.mobile.ios.focus.FakeSelection',
    'tinymce.themes.mobile.ios.scroll.IosScrolling',
    'tinymce.themes.mobile.ios.smooth.BackgroundActivity',
    'tinymce.themes.mobile.ios.view.Greenzone',
    'tinymce.themes.mobile.ios.view.IosUpdates',
    'tinymce.themes.mobile.ios.view.IosViewport',
    'tinymce.themes.mobile.touch.view.Orientation',
    'tinymce.themes.mobile.util.CaptureBin',
    'tinymce.themes.mobile.util.Rectangles'
  ],

  function (
    Fun, Option, Throttler, Focus, DomEvent, Body, Element, Css, clearInterval, clearTimeout, console, Math, parseInt, setInterval, setTimeout, FakeSelection,
    IosScrolling, BackgroundActivity, Greenzone, IosUpdates, IosViewport, Orientation, CaptureBin, Rectangles
  ) {
    var VIEW_MARGIN = 5;

    var register = function (toolstrip, socket, container, outerWindow, structure, cWin) {
      var scroller = BackgroundActivity(function (y) {
        return IosScrolling.moveWindowScroll(toolstrip, socket, y);
      });

      // NOTE: This is a WebView specific way of scrolling when out of bounds. When we need to make
      // the webapp work again, we'll have to adjust this function. Essentially, it just jumps the scroll
      // back to show the current selection rectangle.
      var scrollBounds = function () {
        var rects = Rectangles.getRectangles(cWin);
        return Option.from(rects[0]).bind(function (rect) {
          var viewTop = rect.top() - socket.dom().scrollTop;
          var outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN;
          return outside ? Option.some({
            top: Fun.constant(viewTop),
            bottom: Fun.constant(viewTop + rect.height())
          }) : Option.none();
        });
      };

      var scrollThrottle = Throttler.last(function () {
        /*
         * As soon as the window is back to 0 (idle), scroll the toolbar and socket back into place on scroll.
         */
        scroller.idle(function () {
          IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(function (/* _ */) {
            var extraScroll = scrollBounds();
            extraScroll.each(function (extra) {
              // TODO: Smoothly animate this in a way that doesn't conflict with anything else.
              socket.dom().scrollTop = socket.dom().scrollTop + extra.top();
            });
            scroller.start(0);
            structure.refresh();
          });
        });
      }, 1000);

      var onScroll = DomEvent.bind(Element.fromDom(outerWindow), 'scroll', function () {
        if (outerWindow.pageYOffset < 0) {
          return;
        }

        /*
        We've experimented with trying to set the socket scroll (hidden vs. scroll) based on whether the outer body
        has scrolled. When the window starts scrolling, we would lock the socket scroll, and we would
        unlock it when the window stopped scrolling. This would give a nice rubber-band effect at the end
        of the content, but would break the code that tried to position the text in the viewable area
        (more details below). Also, as soon as you flicked to outer scroll, if you started scrolling up again,
        you would drag the whole window down, because you would still be in outerscroll mode. That's hardly
        much of a problem, but it is a minor issue. It also didn't play nicely with keeping the toolbar on the screen.

        The big problem was that this was incompatible with the toolbar and scrolling code. We need a padding inside
        the socket so that the bottom of the content can be scrolled into the viewable greenzone. If it doesn't
        have padding, then unless we move the socket top to some negative value as well, then we can't get
        a scrollTop high enough to get the selection into the viewable greenzone. This is the purpose of the
        padding at the bottom of the iframe. Without it, the scroll consistently jumps back to its
        max scroll value, and you can't keep the last line on screen when the keyboard is up.

        However, if the padding is too large, then the content can be 'effectively' scrolled off the screen
        (the iframe anyway), and the user can get lost about where they are. Our short-term fix is just to
        make the padding at the end the height - the greenzone height so that content should always be
        visible on the screen, even if they've scrolled to the end.
        */

        scrollThrottle.throttle();
      });

      IosUpdates.updatePositions(container, outerWindow.pageYOffset).get(Fun.identity);

      return {
        unbind: onScroll.unbind
      };
    };

    var setup = function (bag) {
      var cWin = bag.cWin();
      var ceBody = bag.ceBody();
      var socket = bag.socket();
      var toolstrip = bag.toolstrip();
      var toolbar = bag.toolbar();
      var contentElement = bag.contentElement();
      var keyboardType = bag.keyboardType();
      var outerWindow = bag.outerWindow();
      var dropup = bag.dropup();

      var structure = IosViewport.takeover(socket, ceBody, toolstrip, dropup);
      var keyboardModel = keyboardType(bag.outerBody(), cWin, Body.body(), contentElement, toolstrip, toolbar);

      var toEditing = function () {
        // Consider inlining, though it will make it harder to follow the API
        keyboardModel.toEditing();
        clearSelection();
      };

      var toReading = function () {
        keyboardModel.toReading();
      };

      var onToolbarTouch = function (event) {
        keyboardModel.onToolbarTouch(event);
      };

      var onOrientation = Orientation.onChange(outerWindow, {
        onChange: Fun.noop,
        onReady: structure.refresh
      });

      // NOTE: When the window is resizing (probably due to meta tags and viewport definitions), we are not receiving a window resize event.
      // However, it happens shortly after we start Ios mode, so here we just wait for the first window size event that we get. This code
      // is also the same code that is used for the Orientation ready event.
      onOrientation.onAdjustment(function () {
        structure.refresh();
      });

      var onResize = DomEvent.bind(Element.fromDom(outerWindow), 'resize', function () {
        if (structure.isExpanding()) {
          structure.refresh();
        }
      });

      var onScroll = register(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin);

      var unfocusedSelection = FakeSelection(cWin, contentElement);

      var refreshSelection = function () {
        if (unfocusedSelection.isActive()) {
          unfocusedSelection.update();
        }
      };

      var highlightSelection = function () {
        unfocusedSelection.update();
      };

      var clearSelection = function () {
        unfocusedSelection.clear();
      };

      var scrollIntoView = function (top, bottom) {
        Greenzone.scrollIntoView(cWin, socket, dropup, top, bottom);
      };

      var syncHeight = function () {
        Css.set(contentElement, 'height', contentElement.dom().contentWindow.document.body.scrollHeight + 'px');
      };

      var setViewportOffset = function (newYOffset) {
        structure.setViewportOffset(newYOffset);
        IosScrolling.moveOnlyTop(socket, newYOffset).get(Fun.identity);
      };

      var destroy = function () {
        structure.restore();
        onOrientation.destroy();
        onScroll.unbind();
        onResize.unbind();
        keyboardModel.destroy();

        unfocusedSelection.destroy();

        // Try and dismiss the keyboard on close, as they have no input focus.
        CaptureBin.input(Body.body(), Focus.blur);
      };

      return {
        toEditing: toEditing,
        toReading: toReading,
        onToolbarTouch: onToolbarTouch,
        refreshSelection: refreshSelection,
        clearSelection: clearSelection,
        highlightSelection: highlightSelection,
        scrollIntoView: scrollIntoView,
        updateToolbarPadding: Fun.noop,
        setViewportOffset: setViewportOffset,
        syncHeight: syncHeight,
        refreshStructure: structure.refresh,
        destroy: destroy
      };
    };

    return {
      setup: setup
    };
  }
);
define(
  'tinymce.themes.mobile.ios.view.IosKeyboard',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Body',
    'ephox.sugar.api.node.Node',
    'tinymce.themes.mobile.ios.focus.ResumeEditing',
    'tinymce.themes.mobile.util.CaptureBin'
  ],

  function (Arr, Fun, Focus, DomEvent, Body, Node, ResumeEditing, CaptureBin) {
    /*
     * Stubborn IOS Keyboard mode:
     *
     * The keyboard will stubbornly refuse to go away. The only time it will go away is when toReading
     * is called (which is currently only used by the insert image button). It will probably go away
     * at other times, but we never explicitly try to make it go away.
     *
     * The major problem with not dismissing the keyboard when the user presses the toolbar is that
     * the input focus can be put in some very interesting things. Once the input focus is in something
     * that is not the content or an input that the user can clearly see, behaviour gets very strange
     * very quickly. The Stubborn keyboard tries to resolve this issue in a few ways:
     *
     * 1. After scrolling the toolbar, it resumes editing of the content. This has the built-in assumption
     * that there are no slick toolbars that require scrolling AND input focus
     * 2. Any time a keydown is received on the outer page, we resume editing of the content. What this means
     * is that in situations where the user has still managed to get into the toolbar (e.g. they typed while
     * the dropdown was visible, or the insert image toReading didn't quite work etc.), then the first keystroke
     * sends the input back to the content, and then subsequent keystrokes appear in the content. Although
     * this means that their first keystroke is lost, it is a reasonable way of ensuring that they don't
     * get stuck in some weird input somewhere. The goal of the stubborn keyboard is to view this as a
     * fallback ... we want to prevent it getting to this state wherever possible. However, there are just
     * some situations where we really don't know what typing on the keyboard should do (e.g. a dropdown is open).
     * Note, when we transfer the focus back to the content, we also close any menus that are still visible.
     *
     * Now, because in WebView mode, the actual window is shrunk when the keyboard appears, the dropdown vertical
     * scrolling is set to the right height. However, when running as a webapp, this won't be the case. To use
     * the stubborn keyboard in webapp mode, we will need to find some way to let repartee know the MaxHeight
     * needs to exclude the keyboard. This isn't a problem with timid, because the keyboard is dismissed.
     */
    var stubborn = function (outerBody, cWin, page, frame/*, toolstrip, toolbar*/) {
      var toEditing = function () {
        ResumeEditing.resume(cWin, frame);
      };

      var toReading = function () {
        CaptureBin.input(outerBody, Focus.blur);
      };

      var captureInput = DomEvent.bind(page, 'keydown', function (evt) {
        // Think about killing the event.
        if (! Arr.contains([ 'input', 'textarea' ], Node.name(evt.target()))) {

          // FIX: Close the menus
          // closeMenus()

          toEditing();
        }
      });

      var onToolbarTouch = function (/* event */) {
        // Do nothing
      };

      var destroy = function () {
        captureInput.unbind();
      };

      return {
        toReading: toReading,
        toEditing: toEditing,
        onToolbarTouch: onToolbarTouch,
        destroy: destroy
      };
    };

    /*
     * Timid IOS Keyboard mode:
     *
     * In timid mode, the keyboard will be dismissed as soon as the toolbar is clicked. In lot of
     * situations, it will then quickly reappear is toEditing is called. The timid mode is safe,
     * but can be very jarring.
     *
     * One situation that the timid mode does not handle is when in a WebView, if the user has
     * scrolled to the bottom of the content and is editing it, as soon as they click on a formatting
     * operation, the keyboard will be dismissed, and the content will visibly jump back down to
     * the bottom of the screen (because the increased window size has decreased the amount of
     * scrolling available). As soon as the formatting operation is completed (which can be
     * instantaneously for something like bold), then the keyboard reappears and the content
     * jumps again. It's very jarring and there's not much we can do (I think).
     *
     * However, the timid keyboard mode will seamlessly integrate with dropdowns max-height, because
     * dropdowns dismiss the keyboard, so they have all the height they require.
     */
    var timid = function (outerBody, cWin, page, frame/*, toolstrip, toolbar*/) {
      var dismissKeyboard = function () {
        Focus.blur(frame);
      };

      var onToolbarTouch = function () {
        dismissKeyboard();
      };

      var toReading = function () {
        dismissKeyboard();
      };

      var toEditing = function () {
        ResumeEditing.resume(cWin, frame);
      };

      return {
        toReading: toReading,
        toEditing: toEditing,
        onToolbarTouch: onToolbarTouch,
        destroy: Fun.noop
      };
    };

    return {
      stubborn: stubborn,
      timid: timid
    };
  }
);
define(
  'tinymce.themes.mobile.ios.core.IosMode',

  [
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Singleton',
    'ephox.katamari.api.Struct',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Css',
    'global!document',
    'tinymce.themes.mobile.ios.core.IosEvents',
    'tinymce.themes.mobile.ios.core.IosSetup',
    'tinymce.themes.mobile.ios.core.PlatformEditor',
    'tinymce.themes.mobile.ios.scroll.Scrollables',
    'tinymce.themes.mobile.ios.view.IosKeyboard',
    'tinymce.themes.mobile.util.Thor',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.scroll.Scrollable',
    'tinymce.themes.mobile.touch.view.MetaViewport'
  ],

  function (
    Fun, Singleton, Struct, Focus, Element, Class, Css, document, IosEvents, IosSetup,
    PlatformEditor, Scrollables, IosKeyboard, Thor, Styles, Scrollable, MetaViewport
  ) {
    var create = function (platform, mask) {
      var meta = MetaViewport.tag();

      var priorState = Singleton.value();
      var scrollEvents = Singleton.value();

      var iosApi = Singleton.api();
      var iosEvents = Singleton.api();

      var enter = function () {
        mask.hide();
        var doc = Element.fromDom(document);
        PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
          // TODO: Orientation changes.
          // orientation = Orientation.onChange();

          priorState.set({
            socketHeight: Css.getRaw(platform.socket, 'height'),
            iframeHeight: Css.getRaw(editorApi.frame(), 'height'),
            outerScroll: document.body.scrollTop
          });

          scrollEvents.set({
            // Allow only things that have scrollable class to be scrollable. Without this,
            // the toolbar scrolling gets prevented
            exclusives: Scrollables.exclusive(doc, '.' + Scrollable.scrollable())
          });

          Class.add(platform.container, Styles.resolve('fullscreen-maximized'));
          Thor.clobberStyles(platform.container, editorApi.body());
          meta.maximize();

          /* NOTE: Making the toolbar scrollable is now done when the middle group is created */

          Css.set(platform.socket, 'overflow', 'scroll');
          Css.set(platform.socket, '-webkit-overflow-scrolling', 'touch');

          Focus.focus(editorApi.body());

          var setupBag = Struct.immutableBag([
            'cWin',
            'ceBody',
            'socket',
            'toolstrip',
            'toolbar',
            'dropup',
            'contentElement',
            'cursor',
            'keyboardType',
            'isScrolling',
            'outerWindow',
            'outerBody'
          ], []);

          iosApi.set(
            IosSetup.setup(setupBag({
              'cWin': editorApi.win(),
              'ceBody': editorApi.body(),
              'socket': platform.socket,
              'toolstrip': platform.toolstrip,
              'toolbar': platform.toolbar,
              'dropup': platform.dropup.element(),
              'contentElement': editorApi.frame(),
              'cursor': Fun.noop,
              'outerBody': platform.body,
              'outerWindow': platform.win,
              'keyboardType': IosKeyboard.stubborn,
              'isScrolling': function () {
                return scrollEvents.get().exists(function (s) {
                  return s.socket.isScrolling();
                });
              }
            }))
          );

          iosApi.run(function (api) {
            api.syncHeight();
          });


          iosEvents.set(
            IosEvents.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup)
          );
        });
      };

      var exit = function () {
        meta.restore();
        iosEvents.clear();
        iosApi.clear();

        mask.show();

        priorState.on(function (s) {
          s.socketHeight.each(function (h) {
            Css.set(platform.socket, 'height', h);
          });
          s.iframeHeight.each(function (h) {
            Css.set(platform.editor.getFrame(), 'height', h);
          });
          document.body.scrollTop = s.scrollTop;
        });
        priorState.clear();

        scrollEvents.on(function (s) {
          s.exclusives.unbind();
        });
        scrollEvents.clear();

        Class.remove(platform.container, Styles.resolve('fullscreen-maximized'));
        Thor.restoreStyles();
        Scrollable.deregister(platform.toolbar);

        Css.remove(platform.socket, 'overflow'/*, 'scroll'*/);
        Css.remove(platform.socket, '-webkit-overflow-scrolling'/*, 'touch'*/);

        // Hide the keyboard and remove the selection so there isn't a blue cursor in the content
        // still even once exited.
        Focus.blur(platform.editor.getFrame());

        PlatformEditor.getActiveApi(platform.editor).each(function (editorApi) {
          editorApi.clearSelection();
        });
      };

      // dropup
      var refreshStructure = function () {
        iosApi.run(function (api) {
          api.refreshStructure();
        });
      };

      return {
        enter: enter,
        refreshStructure: refreshStructure,
        exit: exit
      };
    };

    return {
      create: create
    };
  }
);

define(
  'tinymce.themes.mobile.api.IosWebapp',

  [
    'ephox.alloy.api.component.GuiFactory',
    'ephox.boulder.api.ValueSchema',
    'ephox.katamari.api.Fun',
    'ephox.sugar.api.properties.Css',
    'tinymce.themes.mobile.api.MobileSchema',
    'tinymce.themes.mobile.ios.core.IosMode',
    'tinymce.themes.mobile.touch.view.TapToEditMask'
  ],

  function (GuiFactory, ValueSchema, Fun, Css, MobileSchema, IosMode, TapToEditMask) {
    var produce = function (raw) {
      var mobile = ValueSchema.asRawOrDie(
        'Getting IosWebapp schema',
        MobileSchema,
        raw
      );

      /* Make the toolbar */
      Css.set(mobile.toolstrip, 'width', '100%');

      Css.set(mobile.container, 'position', 'relative');
      var onView = function () {
        mobile.setReadOnly(true);
        mode.enter();
      };

      var mask = GuiFactory.build(
        TapToEditMask.sketch(onView, mobile.translate)
      );

      mobile.alloy.add(mask);
      var maskApi = {
        show: function () {
          mobile.alloy.add(mask);
        },
        hide: function () {
          mobile.alloy.remove(mask);
        }
      };

      var mode = IosMode.create(mobile, maskApi);

      return {
        setReadOnly: mobile.setReadOnly,
        refreshStructure: mode.refreshStructure,
        enter: mode.enter,
        exit: mode.exit,
        destroy: Fun.noop
      };
    };

    return {
      produce: produce
    };
  }
);

define(
  'tinymce.themes.mobile.ui.IosRealm',

  [
    'ephox.alloy.api.behaviour.Replacing',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Singleton',
    'tinymce.themes.mobile.api.IosWebapp',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.toolbar.ScrollingToolbar',
    'tinymce.themes.mobile.ui.CommonRealm',
    'tinymce.themes.mobile.ui.Dropup',
    'tinymce.themes.mobile.ui.OuterContainer'
  ],

  function (Replacing, Fun, Singleton, IosWebapp, Styles, ScrollingToolbar, CommonRealm, Dropup, OuterContainer) {
    return function (scrollIntoView) {
      var alloy = OuterContainer({
        classes: [ Styles.resolve('ios-container') ]
      });

      var toolbar = ScrollingToolbar();

      var webapp = Singleton.api();

      var switchToEdit = CommonRealm.makeEditSwitch(webapp);

      var socket = CommonRealm.makeSocket();

      var dropup = Dropup.build(function () {
        webapp.run(function (w) {
          w.refreshStructure();
        });
      }, scrollIntoView);

      alloy.add(toolbar.wrapper());
      alloy.add(socket);
      alloy.add(dropup.component());

      var setToolbarGroups = function (rawGroups) {
        var groups = toolbar.createGroups(rawGroups);
        toolbar.setGroups(groups);
      };

      var setContextToolbar = function (rawGroups) {
        var groups = toolbar.createGroups(rawGroups);
        toolbar.setContextToolbar(groups);
      };

      var focusToolbar = function () {
        toolbar.focus();
      };

      var restoreToolbar = function () {
        toolbar.restoreToolbar();
      };

      var init = function (spec) {
        webapp.set(
          IosWebapp.produce(spec)
        );
      };

      var exit = function () {
        webapp.run(function (w) {
          Replacing.remove(socket, switchToEdit);
          w.exit();
        });
      };

      var updateMode = function (readOnly) {
        CommonRealm.updateMode(socket, switchToEdit, readOnly, alloy.root());
      };

      return {
        system: Fun.constant(alloy),
        element: alloy.element,
        init: init,
        exit: exit,
        setToolbarGroups: setToolbarGroups,
        setContextToolbar: setContextToolbar,
        focusToolbar: focusToolbar,
        restoreToolbar: restoreToolbar,
        updateMode: updateMode,
        socket: Fun.constant(socket),
        dropup: Fun.constant(dropup)
      };
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

define(
  'tinymce.themes.mobile.util.CssUrls',

  [
    'ephox.boulder.api.Objects',
    'tinymce.core.EditorManager'
  ],

  function (Objects, EditorManager) {
    var derive = function (editor) {
      var base = Objects.readOptFrom(editor.settings, 'skin_url').fold(function () {
        return EditorManager.baseURL + '/skins/' + 'lightgray';
      }, function (url) {
        return url;
      });

      return {
        content: base + '/content.mobile.min.css',
        ui: base + '/skin.mobile.min.css'
      };
    };

    return {
      derive: derive
    };
  }
);

define(
  'tinymce.themes.mobile.util.FormatChangers',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Obj',
    'tinymce.themes.mobile.channels.TinyChannels'
  ],

  function (Arr, Fun, Obj, TinyChannels) {
    var fontSizes = [ 'x-small', 'small', 'medium', 'large', 'x-large' ];

    var fireChange = function (realm, command, state) {
      realm.system().broadcastOn([ TinyChannels.formatChanged() ], {
        command: command,
        state: state
      });
    };

    var init = function (realm, editor) {
      var allFormats = Obj.keys(editor.formatter.get());
      Arr.each(allFormats, function (command) {
        editor.formatter.formatChanged(command, function (state) {
          fireChange(realm, command, state);
        });
      });

      Arr.each([ 'ul', 'ol' ], function (command) {
        editor.selection.selectorChanged(command, function (state, data) {
          fireChange(realm, command, state);
        });
      });
    };

    return {
      init: init,
      fontSizes: Fun.constant(fontSizes)
    };
  }
);

define(
  'tinymce.themes.mobile.util.SkinLoaded',

  [

  ],

  function () {
    var fireSkinLoaded = function (editor) {
      var done = function () {
        editor._skinLoaded = true;
        editor.fire('SkinLoaded');
      };

      return function () {
        if (editor.initialized) {
          done();
        } else {
          editor.on('init', done);
        }
      };
    };

    return {
      fireSkinLoaded: fireSkinLoaded
    };
  }
);

define(
  'tinymce.themes.mobile.Theme',

  [
    'ephox.alloy.api.behaviour.Swapping',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.system.Attachment',
    'ephox.alloy.debugging.Debugging',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.sand.api.PlatformDetection',
    'ephox.sugar.api.dom.Focus',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.node.Node',
    'tinymce.core.dom.DOMUtils',
    'tinymce.core.ThemeManager',
    'tinymce.themes.mobile.alien.TinyCodeDupe',
    'tinymce.themes.mobile.channels.TinyChannels',
    'tinymce.themes.mobile.features.Features',
    'tinymce.themes.mobile.style.Styles',
    'tinymce.themes.mobile.touch.view.Orientation',
    'tinymce.themes.mobile.ui.AndroidRealm',
    'tinymce.themes.mobile.ui.Buttons',
    'tinymce.themes.mobile.ui.IosRealm',
    'tinymce.themes.mobile.util.CssUrls',
    'tinymce.themes.mobile.util.FormatChangers',
    'tinymce.themes.mobile.util.SkinLoaded'
  ],


  function (
    Swapping, AlloyTriggers, Attachment, Debugging, Cell, Fun, PlatformDetection, Focus, Insert, Element, Node, DOMUtils, ThemeManager, TinyCodeDupe, TinyChannels,
    Features, Styles, Orientation, AndroidRealm, Buttons, IosRealm, CssUrls, FormatChangers, SkinLoaded
  ) {
    /// not to be confused with editor mode
    var READING = Fun.constant('toReading'); /// 'hide the keyboard'
    var EDITING = Fun.constant('toEditing'); /// 'show the keyboard'

    ThemeManager.add('mobile', function (editor) {
      var renderUI = function (args) {
        var cssUrls = CssUrls.derive(editor);

        editor.contentCSS.push(cssUrls.content);
        DOMUtils.DOM.styleSheetLoader.load(cssUrls.ui, SkinLoaded.fireSkinLoaded(editor));

        var doScrollIntoView = function () {
          editor.fire('scrollIntoView');
        };

        var wrapper = Element.fromTag('div');
        var realm = PlatformDetection.detect().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView);
        var original = Element.fromDom(args.targetNode);
        Insert.after(original, wrapper);
        Attachment.attachSystem(wrapper, realm.system());

        var findFocusIn = function (elem) {
          return Focus.search(elem).bind(function (focused) {
            return realm.system().getByDom(focused).toOption();
          });
        };
        var outerWindow = args.targetNode.ownerDocument.defaultView;
        var orientation = Orientation.onChange(outerWindow, {
          onChange: function () {
            var alloy = realm.system();
            alloy.broadcastOn([ TinyChannels.orientationChanged() ], { width: Orientation.getActualWidth(outerWindow) });
          },
          onReady: Fun.noop
        });

        var setReadOnly = function (readOnlyGroups, mainGroups, ro) {
          if (ro === false) editor.selection.collapse();
          realm.setToolbarGroups(ro ? readOnlyGroups.get() : mainGroups.get());
          editor.setMode(ro === true ? 'readonly' : 'design');
          editor.fire(ro === true ? READING() : EDITING());
          realm.updateMode(ro);
        };

        var bindHandler = function (label, handler) {
          editor.on(label, handler);
          return {
            unbind: function () {
              editor.off(label);
            }
          };
        };

        editor.on('init', function () {
          realm.init({
            editor: {
              getFrame: function () {
                return Element.fromDom(editor.contentAreaContainer.querySelector('iframe'));
              },

              onDomChanged: function () {
                return {
                  unbind: Fun.noop
                };
              },

              onToReading: function (handler) {
                return bindHandler(READING(), handler);
              },

              onToEditing: function (handler) {
                return bindHandler(EDITING(), handler);
              },

              onScrollToCursor: function (handler) {
                editor.on('scrollIntoView', function (tinyEvent) {
                  handler(tinyEvent);
                });

                var unbind = function () {
                  editor.off('scrollIntoView');
                  orientation.destroy();
                };

                return {
                  unbind: unbind
                };
              },

              onTouchToolstrip: function () {
                hideDropup();
              },

              onTouchContent: function () {
                var toolbar = Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolbar')));
                // If something in the toolbar had focus, fire an execute on it (execute on tap away)
                // Perhaps it will be clearer later what is a better way of doing this.
                findFocusIn(toolbar).each(AlloyTriggers.emitExecute);
                realm.restoreToolbar();
                hideDropup();
              },

              onTapContent: function (evt) {
                var target = evt.target();
                // If the user has tapped (touchstart, touchend without movement) on an image, select it.
                if (Node.name(target) === 'img') {
                  editor.selection.select(target.dom());
                  // Prevent the default behaviour from firing so that the image stays selected
                  evt.kill();
                } else if (Node.name(target) === 'a')  {
                  var component = realm.system().getByDom(Element.fromDom(editor.editorContainer));
                  component.each(function (container) {
                    /// view mode
                    if (Swapping.isAlpha(container)) {
                      TinyCodeDupe.openLink(target.dom());
                    }
                  });
                }
              }
            },
            container: Element.fromDom(editor.editorContainer),
            socket: Element.fromDom(editor.contentAreaContainer),
            toolstrip: Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolstrip'))),
            toolbar: Element.fromDom(editor.editorContainer.querySelector('.' + Styles.resolve('toolbar'))),
            dropup: realm.dropup(),
            alloy: realm.system(),
            translate: Fun.noop,

            setReadOnly: function (ro) {
              setReadOnly(readOnlyGroups, mainGroups, ro);
            }
          });

          var hideDropup = function () {
            realm.dropup().disappear(function () {
              realm.system().broadcastOn([ TinyChannels.dropupDismissed() ], { });
            });
          };

          Debugging.registerInspector('remove this', realm.system());

          var backToMaskGroup = {
            label: 'The first group',
            scrollable: false,
            items: [
              Buttons.forToolbar('back', function (/* btn */) {
                editor.selection.collapse();
                realm.exit();
              }, { })
            ]
          };

          var backToReadOnlyGroup = {
            label: 'Back to read only',
            scrollable: false,
            items: [
              Buttons.forToolbar('readonly-back', function (/* btn */) {
                setReadOnly(readOnlyGroups, mainGroups, true);
              }, {})
            ]
          };

          var readOnlyGroup = {
            label: 'The read only mode group',
            scrollable: true,
            items: []
          };

          var features = Features.setup(realm, editor);
          var items = Features.detect(editor.settings, features);
          
          var actionGroup = {
            label: 'the action group',
            scrollable: true,
            items: items
          };

          var extraGroup = {
            label: 'The extra group',
            scrollable: false,
            items: [
              // This is where the "add button" button goes.
            ]
          };

          var mainGroups = Cell([ backToReadOnlyGroup, actionGroup, extraGroup ]);
          var readOnlyGroups = Cell([ backToMaskGroup, readOnlyGroup, extraGroup ]);

          // Investigate ways to keep in sync with the ui
          FormatChangers.init(realm, editor);
        });

        return {
          iframeContainer: realm.socket().element().dom(),
          editorContainer: realm.element().dom()
        };
      };

      return {
        getNotificationManagerImpl: function () {
          return {
            open: Fun.identity,
            close: Fun.noop,
            reposition: Fun.noop,
            getArgs: Fun.identity
          };
        },
        renderUI: renderUI
      };
    });

    return function () { };

  }
);

dem('tinymce.themes.mobile.Theme')();
})();
