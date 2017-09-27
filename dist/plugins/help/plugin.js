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
    instances.push(dem(ids[i]));
  callback.apply(null, callback);
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
// this helps with minificiation when using a lot of global references
var defineGlobal = function (id, ref) {
  define(id, [], function () { return ref; });
};
/*jsc
["tinymce.plugins.help.Plugin","tinymce.core.PluginManager","tinymce.plugins.help.ui.Dialog","global!tinymce.util.Tools.resolve","tinymce.core.EditorManager","tinymce.plugins.help.ui.KeyboardShortcutsTab","tinymce.plugins.help.ui.PluginsTab","tinymce.plugins.help.ui.ButtonsRow","ephox.katamari.api.Arr","tinymce.core.util.I18n","tinymce.plugins.help.data.KeyboardShortcuts","ephox.katamari.api.Fun","ephox.katamari.api.Obj","ephox.katamari.api.Strings","tinymce.plugins.help.data.PluginUrls","ephox.katamari.api.Option","global!Array","global!Error","global!String","tinymce.core.Env","global!Object","ephox.katamari.str.StrAppend","ephox.katamari.str.StringParts"]
jsc*/
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
  'tinymce.core.PluginManager',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.PluginManager');
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
      range: range
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
  'tinymce.core.util.I18n',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.util.I18n');
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
  'tinymce.core.Env',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.Env');
  }
);

define(
  'tinymce.plugins.help.data.KeyboardShortcuts',
  [
    'tinymce.core.Env'
  ],
  function (Env) {
    var meta = Env.mac ? '\u2318' : 'Ctrl';
    var access = Env.mac ? 'Ctrl + Alt' : 'Shift + Alt';

    var shortcuts = [
      { shortcut: meta + ' + B', action: 'Bold' },
      { shortcut: meta + ' + I', action: 'Italic' },
      { shortcut: meta + ' + U', action: 'Underline' },
      { shortcut: meta + ' + A', action: 'Select all' },
      { shortcut: meta + ' + Y or ' + meta + ' + Shift + Z', action: 'Redo' },
      { shortcut: meta + ' + Z', action: 'Undo' },
      { shortcut: access + ' + 1', action: 'Header 1' },
      { shortcut: access + ' + 2', action: 'Header 2' },
      { shortcut: access + ' + 3', action: 'Header 3' },
      { shortcut: access + ' + 4', action: 'Header 4' },
      { shortcut: access + ' + 5', action: 'Header 5' },
      { shortcut: access + ' + 6', action: 'Header 6' },
      { shortcut: access + ' + 7', action: 'Paragraph' },
      { shortcut: access + ' + 8', action: 'Div' },
      { shortcut: access + ' + 9', action: 'Address' },
      { shortcut: 'Alt + F9', action: 'Focus to menubar' },
      { shortcut: 'Alt + F10', action: 'Focus to toolbar' },
      { shortcut: 'Alt + F11', action: 'Focus to element path' },
      {
        shortcut: 'Ctrl + Shift + P > Ctrl + Shift + P',
        action: 'Focus to contextual toolbar'
      },
      { shortcut: meta + ' + K', action: 'Insert link (if link plugin activated)' },
      { shortcut: meta + ' + S', action: 'Save (if save plugin activated)' },
      { shortcut: meta + ' + F', action: 'Find (if searchreplace plugin activated)' }
    ];

    return {
      shortcuts: shortcuts
    };
  });

define(
  'tinymce.plugins.help.ui.KeyboardShortcutsTab',
  [
    'ephox.katamari.api.Arr',
    'tinymce.core.util.I18n',
    'tinymce.plugins.help.data.KeyboardShortcuts'
  ],
  function (Arr, I18n, KeyboardShortcuts) {
    var makeTab = function () {
      var makeAriaLabel = function (shortcut) {
        return 'aria-label="Action: ' + shortcut.action + ', Shortcut: ' + shortcut.shortcut.replace(/Ctrl/g, 'Control') + '"';
      };
      var shortcutLisString = Arr.map(KeyboardShortcuts.shortcuts, function (shortcut) {
        return '<tr data-mce-tabstop="1" tabindex="-1" ' + makeAriaLabel(shortcut) + '>' +
                  '<td>' + I18n.translate(shortcut.action) + '</td>' +
                  '<td>' + shortcut.shortcut + '</td>' +
                '</tr>';
      }).join('');

      return {
        title: 'Handy Shortcuts',
        type: 'container',
        style: 'overflow-y: auto; overflow-x: hidden; max-height: 250px',
        items: [
          {
            type: 'container',
            html: '<div>' +
                    '<table class="mce-table-striped">' +
                      '<thead>' +
                        '<th>' + I18n.translate('Action') + '</th>' +
                        '<th>' + I18n.translate('Shortcut') + '</th>' +
                      '</thead>' +
                      shortcutLisString +
                    '</table>' +
                  '</div>'
          }
        ]
      };
    };

    return {
      makeTab: makeTab
    };
  });

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
  'tinymce.plugins.help.data.PluginUrls',
  [
  ],
  function () {
    var urls = [
      { key: 'advlist', name: 'Advanced List' },
      { key: 'anchor', name: 'Anchor' },
      { key: 'autolink', name: 'Autolink' },
      { key: 'autoresize', name: 'Autoresize' },
      { key: 'autosave', name: 'Autosave' },
      { key: 'bbcode', name: 'BBCode' },
      { key: 'charmap', name: 'Character Map' },
      { key: 'code', name: 'Code' },
      { key: 'codesample', name: 'Code Sample' },
      { key: 'colorpicker', name: 'Color Picker' },
      { key: 'compat3x', name: '3.x Compatibility' },
      { key: 'contextmenu', name: 'Context Menu' },
      { key: 'directionality', name: 'Directionality' },
      { key: 'emoticons', name: 'Emoticons' },
      { key: 'fullpage', name: 'Full Page' },
      { key: 'fullscreen', name: 'Full Screen' },
      { key: 'help', name: 'Help' },
      { key: 'hr', name: 'Horizontal Rule' },
      { key: 'image', name: 'Image' },
      { key: 'imagetools', name: 'Image Tools' },
      { key: 'importcss', name: 'Import CSS' },
      { key: 'insertdatetime', name: 'Insert Date/Time' },
      { key: 'legacyoutput', name: 'Legacy Output' },
      { key: 'link', name: 'Link' },
      { key: 'lists', name: 'Lists' },
      { key: 'media', name: 'Media' },
      { key: 'nonbreaking', name: 'Nonbreaking' },
      { key: 'noneditable', name: 'Noneditable' },
      { key: 'pagebreak', name: 'Page Break' },
      { key: 'paste', name: 'Paste' },
      { key: 'preview', name: 'Preview' },
      { key: 'print', name: 'Print' },
      { key: 'save', name: 'Save' },
      { key: 'searchreplace', name: 'Search and Replace' },
      { key: 'spellchecker', name: 'Spell Checker' },
      { key: 'tabfocus', name: 'Tab Focus' },
      { key: 'table', name: 'Table' },
      { key: 'template', name: 'Template' },
      { key: 'textcolor', name: 'Text Color' },
      { key: 'textpattern', name: 'Text Pattern' },
      { key: 'toc', name: 'Table of Contents' },
      { key: 'visualblocks', name: 'Visual Blocks' },
      { key: 'visualchars', name: 'Visual Characters' },
      { key: 'wordcount', name: 'Word Count' }
    ];

    return {
      urls: urls
    };
  });

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
});

define(
  'tinymce.plugins.help.ui.ButtonsRow',
  [
    'tinymce.core.EditorManager',
    'tinymce.core.util.I18n'
  ],
  function (EditorManager, I18n) {
    var getVersion = function (major, minor) {
      return major.indexOf('@') === 0 ? 'X.X.X' : major + '.' + minor;
    };

    var makeRow = function () {
      var version = getVersion(EditorManager.majorVersion, EditorManager.minorVersion);
      var changeLogLink = '<a href="https://www.tinymce.com/docs/changelog/" target="_blank">TinyMCE ' + version + '</a>';

      return [
        {
          type: 'label',
          html: I18n.translate(['You are using {0}', changeLogLink])
        },
        {
          type: 'spacer',
          flex: 1
        },
        {
          text: 'Close',
          onclick: function () {
            this.parent().parent().close();
          }
        }
      ];
    };

    return {
      makeRow: makeRow
    };
  }
);

define(
  'tinymce.plugins.help.ui.Dialog',
  [
    'tinymce.core.EditorManager',
    'tinymce.plugins.help.ui.KeyboardShortcutsTab',
    'tinymce.plugins.help.ui.PluginsTab',
    'tinymce.plugins.help.ui.ButtonsRow'
  ],
  function (EditorManager, KeyboardShortcutsTab, PluginsTab, ButtonsRow) {
    var openDialog = function (editor, url) {
      return function () {
        editor.windowManager.open({
          title: 'Help',
          bodyType: 'tabpanel',
          layout: 'flex',
          body: [
            KeyboardShortcutsTab.makeTab(),
            PluginsTab.makeTab(editor, url)
          ],
          buttons: ButtonsRow.makeRow(),
          onPostRender: function () {
            var title = this.getEl('title');
            title.innerHTML = '<img src="' + url + '/img/logo.png" alt="TinyMCE Logo" style="width: 200px">';
          }
        });
      };
    };

    return {
      openDialog: openDialog
    };
  });

define(
  'tinymce.plugins.help.Plugin',
  [
    'tinymce.core.PluginManager',
    'tinymce.plugins.help.ui.Dialog'
  ],
  function (PluginManager, Dialog) {
    var Plugin = function (editor, url) {
      editor.addButton('help', {
        icon: 'help',
        onclick: Dialog.openDialog(editor, url)
      });

      editor.addMenuItem('Help', {
        text: 'Help',
        icon: 'help',
        context: 'view',
        onclick: Dialog.openDialog(editor, url)
      });

      editor.addCommand('mceHelp', Dialog.openDialog(editor, url));

      editor.shortcuts.add('Alt+0', 'Open help dialog', Dialog.openDialog(editor, url));
    };

    PluginManager.add('help', Plugin);

    return function () {};
  }
);

dem('tinymce.plugins.help.Plugin')();
})();
