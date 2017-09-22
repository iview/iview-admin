'use strict';
/*
 * Engines which do not support caching of their file contents
 * should use the `read()` function defined in consolidate.js
 * On top of this, when an engine compiles to a `Function`,
 * these functions should either be cached within consolidate.js
 * or the engine itself via `options.cache`. This will allow
 * users and frameworks to pass `options.cache = true` for
 * `NODE_ENV=production`, however edit the file(s) without
 * re-loading the application in development.
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

var join = path.join;
var resolve = path.resolve;
var extname = path.extname;
var dirname = path.dirname;

var readCache = {};

/**
 * Require cache.
 */

var cacheStore = {};

/**
 * Require cache.
 */

var requires = {};

/**
 * Clear the cache.
 *
 * @api public
 */

exports.clearCache = function(){
  cacheStore = {};
};

/**
 * Conditionally cache `compiled` template based
 * on the `options` filename and `.cache` boolean.
 *
 * @param {Object} options
 * @param {Function} compiled
 * @return {Function}
 * @api private
 */

function cache(options, compiled) {
  // cachable
  if (compiled && options.filename && options.cache) {
    delete readCache[options.filename];
    cacheStore[options.filename] = compiled;
    return compiled;
  }

  // check cache
  if (options.filename && options.cache) {
    return cacheStore[options.filename];
  }

  return compiled;
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the template string will be cached.
 *
 * @param {String} options
 * @param {Function} fn
 * @api private
 */

function read(path, options, fn) {
  var str = readCache[path];
  var cached = options.cache && str && typeof str === 'string';

  // cached (only if cached is a string and not a compiled template function)
  if (cached) return fn(null, str);

  // read
  fs.readFile(path, 'utf8', function(err, str){
    if (err) return fn(err);
    // remove extraneous utf8 BOM marker
    str = str.replace(/^\uFEFF/, '');
    if (options.cache) readCache[path] = str;
    fn(null, str);
  });
}

/**
 * Read `path` with `options` with
 * callback `(err, str)`. When `options.cache`
 * is true the partial string will be cached.
 *
 * @param {String} options
 * @param {Function} fn
 * @api private
 */

function readPartials(path, options, fn) {
  if (!options.partials) return fn();
  var partials = options.partials;
  var keys = Object.keys(partials);

  function next(index) {
    if (index === keys.length) return fn(null);
    var key = keys[index];
    var file = join(dirname(path), partials[key] + extname(path));
    read(file, options, function(err, str){
      if (err) return fn(err);
      options.partials[key] = str;
      next(++index);
    });
  }

  next(0);
}


/**
 * promisify
 */
function promisify(fn, exec) {
  return new Promise(function (res, rej) {
    fn = fn || function (err, html) {
      if (err) {
        return rej(err);
      }
      res(html);
    };
    exec(fn);
  });
}


/**
 * fromStringRenderer
 */

function fromStringRenderer(name) {
  return function(path, options, fn){
    options.filename = path;

    return promisify(fn, function(fn) {
      readPartials(path, options, function (err) {
        if (err) return fn(err);
        if (cache(options)) {
          exports[name].render('', options, fn);
        } else {
          read(path, options, function(err, str){
            if (err) return fn(err);
            exports[name].render(str, options, fn);
          });
        }
      });
    });
  };
}

/**
 * Liquid support.
 */

exports.liquid = fromStringRenderer('liquid');

/**
 * Liquid string support.
 */

/**
 * Note that in order to get filters and custom tags we've had to push
 * all user-defined locals down into @locals. However, just to make things
 * backwards-compatible, any property of `options` that is left after
 * processing and removing `locals`, `meta`, `filters`, `customTags` and
 * `includeDir` will also become a local.
 */

exports.liquid.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.liquid || (requires.liquid = require('tinyliquid'));
    try {
      var context = engine.newContext();
      var k;

      /**
       * Note that there's a bug in the library that doesn't allow us to pass
       * the locals to newContext(), hence looping through the keys:
       */

      if (options.locals){
        for (k in options.locals){
          context.setLocals(k, options.locals[k]);
        }
        delete options.locals;
      }

      if (options.meta){
        context.setLocals('page', options.meta);
        delete options.meta;
      }

      /**
       * Add any defined filters:
       */

      if (options.filters){
        for (k in options.filters){
          context.setFilter(k, options.filters[k]);
        }
        delete options.filters;
      }

      /**
       * Set up a callback for the include directory:
       */

      var includeDir = options.includeDir || process.cwd();

      context.onInclude(function (name, callback) {
        var extname = path.extname(name) ? '' : '.liquid';
        var filename = path.resolve(includeDir, name + extname);

        fs.readFile(filename, {encoding: 'utf8'}, function (err, data){
          if (err) return callback(err);
          callback(null, engine.parse(data));
        });
      });
      delete options.includeDir;

      /**
       * The custom tag functions need to have their results pushed back
       * through the parser, so set up a shim before calling the provided
       * callback:
       */

      var compileOptions = {
        customTags: {}
      };

      if (options.customTags){
        var tagFunctions = options.customTags;

        for (k in options.customTags){
          /*Tell jshint there's no problem with having this function in the loop */
          /*jshint -W083 */
          compileOptions.customTags[k] = function (context, name, body){
            var tpl = tagFunctions[name](body.trim());
            context.astStack.push(engine.parse(tpl));
          };
          /*jshint +W083 */
        }
        delete options.customTags;
      }

      /**
       * Now anything left in `options` becomes a local:
       */

      for (k in options){
        context.setLocals(k, options[k]);
      }

      /**
       * Finally, execute the template:
       */

      var tmpl = cache(context) || cache(context, engine.compile(str, compileOptions));
      tmpl(context, fn);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Jade support.
 */

exports.jade = function(path, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.jade;
    if (!engine) {
      try {
        engine = requires.jade = require('jade');
      } catch (err) {
        try {
          engine = requires.jade = require('then-jade');
        } catch (otherError) {
          throw err;
        }
      }
    }

    try {
      var tmpl = cache(options) || cache(options, engine.compileFile(path, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Jade string support.
 */

exports.jade.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.jade;
    if (!engine) {
      try {
        engine = requires.jade = require('jade');
      } catch (err) {
        try {
          engine = requires.jade = require('then-jade');
        } catch (otherError) {
          throw err;
        }
      }
    }

    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Dust support.
 */

exports.dust = fromStringRenderer('dust');

/**
 * Dust string support.
 */

exports.dust.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.dust;
    if (!engine) {
      try {
        engine = requires.dust = require('dust');
      } catch (err) {
        try {
          engine = requires.dust = require('dustjs-helpers');
        } catch (err) {
          engine = requires.dust = require('dustjs-linkedin');
        }
      }
    }

    var ext = 'dust';
    var views = '.';

    if (options) {
      if (options.ext) ext = options.ext;
      if (options.views) views = options.views;
      if (options.settings && options.settings.views) views = options.settings.views;
    }
    if (!options || (options && !options.cache)) engine.cache = {};

    engine.onLoad = function(path, callback){
      if ('' === extname(path)) path += '.' + ext;
      if ('/' !== path[0]) path = views + '/' + path;
      read(path, options, callback);
    };

    try {
      var tmpl = cache(options) || cache(options, engine.compileFn(str));
      tmpl(options, fn);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Swig support.
 */

exports.swig = fromStringRenderer('swig');

/**
 * Swig string support.
 */

exports.swig.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.swig || (requires.swig = require('swig'));

    try {
      if(options.cache === true) options.cache = 'memory';
      engine.setDefaults({ cache: options.cache });
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Atpl support.
 */

exports.atpl = fromStringRenderer('atpl');

/**
 * Atpl string support.
 */

exports.atpl.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.atpl || (requires.atpl = require('atpl'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Liquor support,
 */

exports.liquor = fromStringRenderer('liquor');

/**
 * Liquor string support.
 */

exports.liquor.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.liquor || (requires.liquor = require('liquor'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Twig support.
 */

exports.twig = fromStringRenderer('twig');

/**
 * Twig string support.
 */

exports.twig.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.twig || (requires.twig = require('twig').twig);
    var templateData = {
      data: str
    };
    try {
      var tmpl = cache(templateData) || cache(templateData, engine(templateData));
      fn(null, tmpl.render(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * EJS support.
 */

exports.ejs = fromStringRenderer('ejs');

/**
 * EJS string support.
 */

exports.ejs.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.ejs || (requires.ejs = require('ejs'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};


/**
 * Eco support.
 */

exports.eco = fromStringRenderer('eco');

/**
 * Eco string support.
 */

exports.eco.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.eco || (requires.eco = require('eco'));
    try {
      fn(null, engine.render(str, options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Jazz support.
 */

exports.jazz = fromStringRenderer('jazz');

/**
 * Jazz string support.
 */

exports.jazz.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.jazz || (requires.jazz = require('jazz'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      tmpl.eval(options, function(str){
        fn(null, str);
      });
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * JQTPL support.
 */

exports.jqtpl = fromStringRenderer('jqtpl');

/**
 * JQTPL string support.
 */

exports.jqtpl.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.jqtpl || (requires.jqtpl = require('jqtpl'));
    try {
      engine.template(str, str);
      fn(null, engine.tmpl(str, options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Haml support.
 */

exports.haml = fromStringRenderer('haml');

/**
 * Haml string support.
 */

exports.haml.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.haml || (requires.haml = require('hamljs'));
    try {
      options.locals = options;
      fn(null, engine.render(str, options).trimLeft());
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Hamlet support.
 */

exports.hamlet = fromStringRenderer('hamlet');

/**
 * Hamlet string support.
 */

exports.hamlet.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.hamlet || (requires.hamlet = require('hamlet'));
    try {
      options.locals = options;
      fn(null, engine.render(str, options).trimLeft());
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Whiskers support.
 */

exports.whiskers = function(path, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.whiskers || (requires.whiskers = require('whiskers'));
    engine.__express(path, options, fn);
  });
};

/**
 * Whiskers string support.
 */

exports.whiskers.render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.whiskers || (requires.whiskers = require('whiskers'));
    try {
      fn(null, engine.render(str, options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Coffee-HAML support.
 */

exports['haml-coffee'] = fromStringRenderer('haml-coffee');

/**
 * Coffee-HAML string support.
 */

exports['haml-coffee'].render = function(str, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires['haml-coffee'] || (requires['haml-coffee'] = require('haml-coffee'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Hogan support.
 */

exports.hogan = fromStringRenderer('hogan');

/**
 * Hogan string support.
 */

exports.hogan.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.hogan || (requires.hogan = require('hogan.js'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl.render(options, options.partials));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * templayed.js support.
 */

exports.templayed = fromStringRenderer('templayed');

/**
 * templayed.js string support.
 */

exports.templayed.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.templayed || (requires.templayed = require('templayed'));
    try {
      var tmpl = cache(options) || cache(options, engine(str));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Handlebars support.
 */

exports.handlebars = fromStringRenderer('handlebars');

/**
 * Handlebars string support.
 */

exports.handlebars.render = function(str, options, fn) {
  return promisify(fn, function(fn) {
    var engine = requires.handlebars || (requires.handlebars = require('handlebars'));
    try {
      for (var partial in options.partials) {
        engine.registerPartial(partial, options.partials[partial]);
      }
      for (var helper in options.helpers) {
        engine.registerHelper(helper, options.helpers[helper]);
      }
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Underscore support.
 */

exports.underscore = fromStringRenderer('underscore');

/**
 * Underscore string support.
 */

exports.underscore.render = function(str, options, fn) {
  return promisify(fn, function(fn) {
    var engine = requires.underscore || (requires.underscore = require('underscore'));
    try {
      var tmpl = cache(options) || cache(options, engine.template(str, null, options));
      fn(null, tmpl(options).replace(/\n$/, ''));
    } catch (err) {
      fn(err);
    }
  });
};


/**
 * Lodash support.
 */

exports.lodash = fromStringRenderer('lodash');

/**
 * Lodash string support.
 */

exports.lodash.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.lodash || (requires.lodash = require('lodash'));
    try {
      var tmpl = cache(options) || cache(options, engine.template(str, options));
      fn(null, tmpl(options).replace(/\n$/, ''));
    } catch (err) {
      fn(err);
    }
  });
};


/**
 * Pug support. (formerly Jade)
 */

exports.pug = function(path, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.pug;
    if (!engine) {
      try {
        engine = requires.pug = require('pug');
      } catch (err) {
        try {
          engine = requires.pug = require('then-pug');
        } catch (otherError) {
          throw err;
        }
      }
    }

    try {
      var tmpl = cache(options) || cache(options, engine.compileFile(path, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Pug string support.
 */

exports.pug.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.pug;
    if (!engine) {
      try {
        engine = requires.pug = require('pug');
      } catch (err) {
        try {
          engine = requires.pug = require('then-pug');
        } catch (otherError) {
          throw err;
        }
      }
    }

    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};


/**
 * QEJS support.
 */

exports.qejs = fromStringRenderer('qejs');

/**
 * QEJS string support.
 */

exports.qejs.render = function (str, options, fn) {
  return promisify(fn, function (fn) {
    try {
      var engine = requires.qejs || (requires.qejs = require('qejs'));
      engine.render(str, options).then(function (result) {
        fn(null, result);
      }, function (err) {
        fn(err);
      }).done();
    } catch (err) {
      fn(err);
    }
  });
};


/**
 * Walrus support.
 */

exports.walrus = fromStringRenderer('walrus');

/**
 * Walrus string support.
 */

exports.walrus.render = function (str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.walrus || (requires.walrus = require('walrus'));
    try {
      var tmpl = cache(options) || cache(options, engine.parse(str));
      fn(null, tmpl.compile(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Mustache support.
 */

exports.mustache = fromStringRenderer('mustache');

/**
 * Mustache string support.
 */

exports.mustache.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.mustache || (requires.mustache = require('mustache'));
    try {
      fn(null, engine.to_html(str, options, options.partials));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Just support.
 */

exports.just = function(path, options, fn){
  return promisify(fn, function(fn) {
    var engine = requires.just;
    if (!engine) {
      var JUST = require('just');
      engine = requires.just = new JUST();
    }
    engine.configure({ useCache: options.cache });
    engine.render(path, options, fn);
  });
};

/**
 * Just string support.
 */

exports.just.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var JUST = require('just');
    var engine = new JUST({ root: { page: str }});
    engine.render('page', options, fn);
  });
};

/**
 * ECT support.
 */

exports.ect = function(path, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.ect;
    if (!engine) {
      var ECT = require('ect');
      engine = requires.ect = new ECT(options);
    }
    engine.configure({ cache: options.cache });
    engine.render(path, options, fn);
  });
};

/**
 * ECT string support.
 */

exports.ect.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var ECT = require('ect');
    var engine = new ECT({ root: { page: str }});
    engine.render('page', options, fn);
  });
};

/**
 * mote support.
 */

exports.mote = fromStringRenderer('mote');

/**
 * mote string support.
 */

exports.mote.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.mote || (requires.mote = require('mote'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Toffee support.
 */

exports.toffee = function(path, options, fn){
  return promisify(fn, function (fn) {
    var toffee = requires.toffee || (requires.toffee = require('toffee'));
    toffee.__consolidate_engine_render(path, options, fn);
  });
};

/**
 * Toffee string support.
 */

exports.toffee.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.toffee || (requires.toffee = require('toffee'));
    try {
      engine.str_render(str, options,fn);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * doT support.
 */

exports.dot = fromStringRenderer('dot');

/**
 * doT string support.
 */

exports.dot.render = function (str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.dot || (requires.dot = require('dot'));
    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options && options._def));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * bracket support.
 */

exports.bracket = fromStringRenderer('bracket');

/**
 * bracket string support.
 */

exports.bracket.render = function (str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.bracket || (requires.bracket = require('bracket-template'));
    try {
      var tmpl = cache(options) || cache(options, engine.default.compile(str));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Ractive support.
 */

exports.ractive = fromStringRenderer('ractive');

/**
 * Ractive string support.
 */

exports.ractive.render = function(str, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.ractive || (requires.ractive = require('ractive'));

    var template = cache(options) || cache(options, engine.parse(str));
    options.template = template;

    if (options.data === null || options.data === undefined)
    {
      var extend = (requires.extend || (requires.extend = require('util')._extend));

      // Shallow clone the options object
      options.data = extend({}, options);

      // Remove consolidate-specific properties from the clone
      var i, length;
      var properties = ["template", "filename", "cache", "partials"];
      for (i = 0, length = properties.length; i < length; i++) {
        var property = properties[i];
        delete options.data[property];
      }
    }

    try {
      fn(null, new engine(options).toHTML());
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Nunjucks support.
 */

exports.nunjucks = fromStringRenderer('nunjucks');

/**
 * Nunjucks string support.
 */

exports.nunjucks.render = function (str, options, fn) {
  return promisify(fn, function (fn) {

    try {

      var engine = options.nunjucksEnv || requires.nunjucks || (requires.nunjucks = require('nunjucks'));

      var env = engine;

      // deprecated fallback support for express
      // <https://github.com/tj/consolidate.js/pull/152>
      // <https://github.com/tj/consolidate.js/pull/224>
      if (options.settings && options.settings.views)
        env = engine.configure(options.settings.views);
      else if (options.nunjucks && options.nunjucks.configure)
        env = engine.configure.apply(engine, options.nunjucks.configure);

      //
      // because `renderString` does not initiate loaders
      // we must manually create a loader for it based off
      // either `options.settings.views` or `options.nunjucks` or `options.nunjucks.root`
      //
      // <https://github.com/mozilla/nunjucks/issues/730>
      // <https://github.com/crocodilejs/node-email-templates/issues/182>
      //

      //
      // note that the below code didn't work nor make sense before
      // because loaders should take different options from rendering
      //

      /*
      var loader = options.loader;
      if (loader) {
        var env = new engine.Environment(new loader(options));
        env.renderString(str, options, fn);
      } else {
        engine.renderString(str, options, fn);
      }
      */

      // so instead we simply check if we passed a custom loader
      // otherwise we create a simple file based loader
      if (options.loader) {
        env = new engine.Environment(options.loader);
      } else if (options.settings && options.settings.views) {
        env = new engine.Environment(
          new engine.FileSystemLoader(options.settings.views)
        );
      } else if (options.nunjucks && options.nunjucks.loader) {
        if (typeof options.nunjucks.loader === 'string')
          env = new engine.Environment(new engine.FileSystemLoader(options.nunjucks.loader));
        else
          env = new engine.Environment(
            new engine.FileSystemLoader(
              options.nunjucks.loader[0],
              options.nunjucks.loader[1]
            )
          );
      }

      env.renderString(str, options, fn);

    } catch (err) {
      throw fn(err);
    }
  });
};


/**
 * HTMLing support.
 */

exports.htmling = fromStringRenderer('htmling');

/**
 * HTMLing string support.
 */

exports.htmling.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.htmling || (requires.htmling = require('htmling'));
    try {
      var tmpl = cache(options) || cache(options, engine.string(str));
      fn(null, tmpl.render(options));
    } catch (err) {
      fn(err);
    }
  });
};


/**
 *  Rendering function
 */
function requireReact(module, filename) {
  var babel = requires.babel || (requires.babel = require('babel-core'));

  var compiled = babel.transformFileSync(filename, { presets: [ 'react' ] }).code

  return module._compile(compiled, filename);
}

exports.requireReact = requireReact;


/**
 *  Converting a string into a node module.
 */
function requireReactString(src, filename) {
  var babel = requires.babel || (requires.babel = require('babel-core'));

  if (!filename) filename = '';
  var m = new module.constructor();
  filename = filename || '';

  // Compile Using React
  var compiled = babel.transform(src, { presets: [ 'react' ] }).code;

  // Compile as a module
  m.paths = module.paths;
  m._compile(compiled, filename);

  return m.exports;
}


/**
 * A naive helper to replace {{tags}} with options.tags content
 */
function reactBaseTmpl(data, options){

  var exp;
  var regex;

  // Iterates through the keys in file object
  // and interpolate / replace {{key}} with it's value
  for (var k in options){
    if (options.hasOwnProperty(k)){
      exp = '{{' + k + '}}';
      regex = new RegExp(exp, 'g');
      if (data.match(regex)) {
        data = data.replace(regex, options[k]);
      }
    }
  }

  return data;
}



/**
 *  The main render parser for React bsaed templates
 */
function reactRenderer(type){

  if (require.extensions) {

    // Ensure JSX is transformed on require
    if (!require.extensions['.jsx']) {
      require.extensions['.jsx'] = requireReact;
    }

    // Supporting .react extension as well as test cases
    // Using .react extension is not recommended.
    if (!require.extensions['.react']) {
      require.extensions['.react'] = requireReact;
    }

  }

  // Return rendering fx
  return function(str, options, fn) {
    return promisify(fn, function(fn) {
      // React Import
      var ReactDOM = requires.ReactDOM || (requires.ReactDOM = require('react-dom/server'));
      var react = requires.react || (requires.react = require('react'));

      // Assign HTML Base
      var base = options.base;
      delete options.base;

      var enableCache = options.cache;
      delete options.cache;

      var isNonStatic = options.isNonStatic;
      delete options.isNonStatic;

      // Start Conversion
      try {

        var Code;
        var Factory;

        var baseStr;
        var content;
        var parsed;

        if (!cache(options)){
          // Parsing
          Code = (type === 'path') ? require(resolve(str)) : requireReactString(str);
          Factory = cache(options, react.createFactory(Code));

        } else {
          Factory = cache(options);
        }

        parsed = new Factory(options);
        content = (isNonStatic) ? ReactDOM.renderToString(parsed) : ReactDOM.renderToStaticMarkup(parsed);

        if (base){
          baseStr = readCache[str] || fs.readFileSync(resolve(base), 'utf8');

          if (enableCache){
            readCache[str] = baseStr;
          }

          options.content = content;
          content = reactBaseTmpl(baseStr, options);
        }

        fn(null, content);

      } catch (err) {
        fn(err);
      }
    });
  };
}

/**
 * React JS Support
 */
exports.react = reactRenderer('path');


/**
 * React JS string support.
 */
exports.react.render = reactRenderer('string');

/**
 * ARC-templates support.
 */

exports['arc-templates'] = fromStringRenderer('arc-templates');

/**
 * ARC-templates string support.
 */

exports['arc-templates'].render = function(str, options, fn) {
  var readFileWithOptions = Promise.promisify(read);
  var consolidateFileSystem = {};
  consolidateFileSystem.readFile = function (path) {
    return readFileWithOptions(path, options);
  };

  return promisify(fn, function (fn) {
    try {
      var engine = requires['arc-templates'];
      if (!engine) {
        var Engine = require('arc-templates/dist/es5');
        engine = requires['arc-templates'] = new Engine({ filesystem: consolidateFileSystem });
      }

      var compiler = cache(options) || cache(options, engine.compileString(str, options.filename));
      compiler.then(function (func) { return func(options); })
          .then(function (result) { fn(null, result.content); })
          .catch(fn);
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Vash support
 */
exports.vash = fromStringRenderer('vash');

/**
 * Vash string support
 */
exports.vash.render = function(str, options, fn) {
  return promisify(fn, function(fn) {
    var engine = requires.vash || (requires.vash = require('vash'));

    try {
      // helper system : https://github.com/kirbysayshi/vash#helper-system
      if (options.helpers) {
        for (var key in options.helpers) {
          if (!options.helpers.hasOwnProperty(key) || typeof options.helpers[key] !== 'function') {
            continue;
          }
          engine.helpers[key] = options.helpers[key];
        }
      }
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options).replace(/\n$/, ''));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Slm support.
 */

exports.slm = fromStringRenderer('slm');

/**
 * Slm string support.
 */

exports.slm.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.slm || (requires.slm = require('slm'));

    try {
      var tmpl = cache(options) || cache(options, engine.compile(str, options));
      fn(null, tmpl(options));
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Marko support.
 */

exports.marko = function(path, options, fn){
  return promisify(fn, function (fn) {
    var engine = requires.marko || (requires.marko = require('marko'));
    options.writeToDisk = !!options.cache;

    try {
      var tmpl = cache(options) || cache(options, engine.load(path, options));
      tmpl.render(options, fn)
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * Marko string support.
 */

exports.marko.render = function(str, options, fn) {
  return promisify(fn, function (fn) {
    var engine = requires.marko || (requires.marko = require('marko'));
    options.writeToDisk = !!options.cache;

    try {
      var tmpl = cache(options) || cache(options, engine.load('string.marko', str, options));
      tmpl.render(options, fn)
    } catch (err) {
      fn(err);
    }
  });
};

/**
 * expose the instance of the engine
 */

exports.requires = requires;
