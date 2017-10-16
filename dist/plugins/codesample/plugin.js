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
["tinymce.plugins.codesample.Plugin","ephox.katamari.api.Cell","tinymce.core.PluginManager","tinymce.plugins.codesample.api.Commands","tinymce.plugins.codesample.core.FilterContent","tinymce.plugins.codesample.core.LoadCss","tinymce.plugins.codesample.ui.Buttons","global!tinymce.util.Tools.resolve","tinymce.plugins.codesample.ui.Dialog","tinymce.plugins.codesample.util.Utils","tinymce.plugins.codesample.core.Prism","tinymce.plugins.codesample.api.Settings","tinymce.core.dom.DOMUtils","tinymce.plugins.codesample.core.CodeSample","tinymce.plugins.codesample.core.Languages"]
jsc*/
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
  'tinymce.core.dom.DOMUtils',
  [
    'global!tinymce.util.Tools.resolve'
  ],
  function (resolve) {
    return resolve('tinymce.dom.DOMUtils');
  }
);

/**
 * Settings.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.api.Settings',
  [
    'tinymce.core.dom.DOMUtils'
  ],
  function (DOMUtils) {
    var getContentCss = function (editor) {
      return editor.settings.codesample_content_css;
    };

    var getLanguages = function (editor) {
      return editor.settings.codesample_languages;
    };

    var getDialogMinWidth = function (editor) {
      return Math.min(DOMUtils.DOM.getViewPort().w, editor.getParam('codesample_dialog_width', 800));
    };

    var getDialogMinHeight = function (editor) {
      return Math.min(DOMUtils.DOM.getViewPort().w, editor.getParam('codesample_dialog_height', 650));
    };

    return {
      getContentCss: getContentCss,
      getLanguages: getLanguages,
      getDialogMinWidth: getDialogMinWidth,
      getDialogMinHeight: getDialogMinHeight
    };
  }
);
/**
 * Prism.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 *
 * Import of prism. Disabled DOMContentLoaded event listener.
 */

/*eslint-disable*/

define(
  'tinymce.plugins.codesample.core.Prism',
  [
  ],
  function () {
    var window = {};
    // ------------------ Start wrap

    /* http://prismjs.com/download.html?themes=prism-dark&languages=markup+css+clike+javascript+c+csharp+cpp+java+php+python+ruby */
    var _self = (typeof window !== 'undefined')
      ? window   // if in browser
      : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
          ? self // if in worker
          : {}   // if in node js
      );

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     * MIT license http://www.opensource.org/licenses/mit-license.php/
     * @author Lea Verou http://lea.verou.me
     */

    var Prism = (function () {

      // Private helper vars
      var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

      var _ = _self.Prism = {
        util: {
          encode: function (tokens) {
            if (tokens instanceof Token) {
              return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
            } else if (_.util.type(tokens) === 'Array') {
              return tokens.map(_.util.encode);
            } else {
              return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
            }
          },

          type: function (o) {
            return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
          },

          // Deep clone a language definition (e.g. to extend it)
          clone: function (o) {
            var type = _.util.type(o);

            switch (type) {
              case 'Object':
                var clone = {};

                for (var key in o) {
                  if (o.hasOwnProperty(key)) {
                    clone[key] = _.util.clone(o[key]);
                  }
                }

                return clone;

              case 'Array':
                // Check for existence for IE8
                return o.map && o.map(function (v) { return _.util.clone(v); });
            }

            return o;
          }
        },

        languages: {
          extend: function (id, redef) {
            var lang = _.util.clone(_.languages[id]);

            for (var key in redef) {
              lang[key] = redef[key];
            }

            return lang;
          },

          /**
           * Insert a token before another token in a language literal
           * As this needs to recreate the object (we cannot actually insert before keys in object literals),
           * we cannot just provide an object, we need anobject and a key.
           * @param inside The key (or language id) of the parent
           * @param before The key to insert before. If not provided, the function appends instead.
           * @param insert Object with the key/value pairs to insert
           * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
           */
          insertBefore: function (inside, before, insert, root) {
            root = root || _.languages;
            var grammar = root[inside];

            if (arguments.length == 2) {
              insert = arguments[1];

              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  grammar[newToken] = insert[newToken];
                }
              }

              return grammar;
            }

            var ret = {};

            for (var token in grammar) {

              if (grammar.hasOwnProperty(token)) {

                if (token == before) {

                  for (var newToken in insert) {

                    if (insert.hasOwnProperty(newToken)) {
                      ret[newToken] = insert[newToken];
                    }
                  }
                }

                ret[token] = grammar[token];
              }
            }

            // Update references in other language definitions
            _.languages.DFS(_.languages, function (key, value) {
              if (value === root[inside] && key != inside) {
                this[key] = ret;
              }
            });

            return root[inside] = ret;
          },

          // Traverse a language definition with Depth First Search
          DFS: function (o, callback, type) {
            for (var i in o) {
              if (o.hasOwnProperty(i)) {
                callback.call(o, i, o[i], type || i);

                if (_.util.type(o[i]) === 'Object') {
                  _.languages.DFS(o[i], callback);
                }
                else if (_.util.type(o[i]) === 'Array') {
                  _.languages.DFS(o[i], callback, i);
                }
              }
            }
          }
        },
        plugins: {},

        highlightAll: function (async, callback) {
          var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

          for (var i = 0, element; element = elements[i++];) {
            _.highlightElement(element, async === true, callback);
          }
        },

        highlightElement: function (element, async, callback) {
          // Find language
          var language, grammar, parent = element;

          while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode;
          }

          if (parent) {
            language = (parent.className.match(lang) || [, ''])[1];
            grammar = _.languages[language];
          }

          // Set language on the element, if not present
          element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

          // Set language on the parent, for styling
          parent = element.parentNode;

          if (/pre/i.test(parent.nodeName)) {
            parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
          }

          var code = element.textContent;

          var env = {
            element: element,
            language: language,
            grammar: grammar,
            code: code
          };

          if (!code || !grammar) {
            _.hooks.run('complete', env);
            return;
          }

          _.hooks.run('before-highlight', env);

          if (async && _self.Worker) {
            var worker = new Worker(_.filename);

            worker.onmessage = function (evt) {
              env.highlightedCode = evt.data;

              _.hooks.run('before-insert', env);

              env.element.innerHTML = env.highlightedCode;

              callback && callback.call(env.element);
              _.hooks.run('after-highlight', env);
              _.hooks.run('complete', env);
            };

            worker.postMessage(JSON.stringify({
              language: env.language,
              code: env.code,
              immediateClose: true
            }));
          }
          else {
            env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

            _.hooks.run('before-insert', env);

            env.element.innerHTML = env.highlightedCode;

            callback && callback.call(element);

            _.hooks.run('after-highlight', env);
            _.hooks.run('complete', env);
          }
        },

        highlight: function (text, grammar, language) {
          var tokens = _.tokenize(text, grammar);
          return Token.stringify(_.util.encode(tokens), language);
        },

        tokenize: function (text, grammar, language) {
          var Token = _.Token;

          var strarr = [text];

          var rest = grammar.rest;

          if (rest) {
            for (var token in rest) {
              grammar[token] = rest[token];
            }

            delete grammar.rest;
          }

          tokenloop: for (var token in grammar) {
            if (!grammar.hasOwnProperty(token) || !grammar[token]) {
              continue;
            }

            var patterns = grammar[token];
            patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
              var pattern = patterns[j],
                inside = pattern.inside,
                lookbehind = !!pattern.lookbehind,
                lookbehindLength = 0,
                alias = pattern.alias;

              pattern = pattern.pattern || pattern;

              for (var i = 0; i < strarr.length; i++) { // Don’t cache length as it changes during the loop

                var str = strarr[i];

                if (strarr.length > text.length) {
                  // Something went terribly wrong, ABORT, ABORT!
                  break tokenloop;
                }

                if (str instanceof Token) {
                  continue;
                }

                pattern.lastIndex = 0;

                var match = pattern.exec(str);

                if (match) {
                  if (lookbehind) {
                    lookbehindLength = match[1].length;
                  }

                  var from = match.index - 1 + lookbehindLength,
                    match = match[0].slice(lookbehindLength),
                    len = match.length,
                    to = from + len,
                    before = str.slice(0, from + 1),
                    after = str.slice(to + 1);

                  var args = [i, 1];

                  if (before) {
                    args.push(before);
                  }

                  var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias);

                  args.push(wrapped);

                  if (after) {
                    args.push(after);
                  }

                  Array.prototype.splice.apply(strarr, args);
                }
              }
            }
          }

          return strarr;
        },

        hooks: {
          all: {},

          add: function (name, callback) {
            var hooks = _.hooks.all;

            hooks[name] = hooks[name] || [];

            hooks[name].push(callback);
          },

          run: function (name, env) {
            var callbacks = _.hooks.all[name];

            if (!callbacks || !callbacks.length) {
              return;
            }

            for (var i = 0, callback; callback = callbacks[i++];) {
              callback(env);
            }
          }
        }
      };

      var Token = _.Token = function (type, content, alias) {
        this.type = type;
        this.content = content;
        this.alias = alias;
      };

      Token.stringify = function (o, language, parent) {
        if (typeof o == 'string') {
          return o;
        }

        if (_.util.type(o) === 'Array') {
          return o.map(function (element) {
            return Token.stringify(element, language, o);
          }).join('');
        }

        var env = {
          type: o.type,
          content: Token.stringify(o.content, language, parent),
          tag: 'span',
          classes: ['token', o.type],
          attributes: {},
          language: language,
          parent: parent
        };

        if (env.type == 'comment') {
          env.attributes['spellcheck'] = 'true';
        }

        if (o.alias) {
          var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
          Array.prototype.push.apply(env.classes, aliases);
        }

        _.hooks.run('wrap', env);

        var attributes = '';

        for (var name in env.attributes) {
          attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
        }

        return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

      };

      if (!_self.document) {
        if (!_self.addEventListener) {
          // in Node.js
          return _self.Prism;
        }
        // In worker
        _self.addEventListener('message', function (evt) {
          var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose;

          _self.postMessage(_.highlight(code, _.languages[lang], lang));
          if (immediateClose) {
            _self.close();
          }
        }, false);

        return _self.Prism;
      }
      /*
      // Get current script and highlight
      var script = document.getElementsByTagName('script');

      script = script[script.length - 1];

      if (script) {
        _.filename = script.src;

        if (document.addEventListener && !script.hasAttribute('data-manual')) {
          document.addEventListener('DOMContentLoaded', _.highlightAll);
        }
      }

      return _self.Prism;
      */
    })();

    if (typeof module !== 'undefined' && module.exports) {
      module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof global !== 'undefined') {
      global.Prism = Prism;
    }
    ;
    Prism.languages.markup = {
      'comment': /<!--[\w\W]*?-->/,
      'prolog': /<\?[\w\W]+?\?>/,
      'doctype': /<!DOCTYPE[\w\W]+?>/,
      'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
      'tag': {
        pattern: /<\/?[^\s>\/=.]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        inside: {
          'tag': {
            pattern: /^<\/?[^\s>\/]+/i,
            inside: {
              'punctuation': /^<\/?/,
              'namespace': /^[^\s>\/:]+:/
            }
          },
          'attr-value': {
            pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
            inside: {
              'punctuation': /[=>"']/
            }
          },
          'punctuation': /\/?>/,
          'attr-name': {
            pattern: /[^\s>\/]+/,
            inside: {
              'namespace': /^[^\s>\/:]+:/
            }
          }

        }
      },
      'entity': /&#?[\da-z]{1,8};/i
    };

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {

      if (env.type === 'entity') {
        env.attributes['title'] = env.content.replace(/&amp;/, '&');
      }
    });

    Prism.languages.xml = Prism.languages.markup;
    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;

    Prism.languages.css = {
      'comment': /\/\*[\w\W]*?\*\//,
      'atrule': {
        pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
        inside: {
          'rule': /@[\w-]+/
          // See rest below
        }
      },
      'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
      'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
      'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
      'property': /(\b|\B)[\w-]+(?=\s*:)/i,
      'important': /\B!important\b/i,
      'function': /[-a-z0-9]+(?=\()/i,
      'punctuation': /[(){};:]/
    };

    Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        'style': {
          pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/i,
          inside: {
            'tag': {
              pattern: /<style[\w\W]*?>|<\/style>/i,
              inside: Prism.languages.markup.tag.inside
            },
            rest: Prism.languages.css
          },
          alias: 'language-css'
        }
      });

      Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
          pattern: /\s*style=("|').*?\1/i,
          inside: {
            'attr-name': {
              pattern: /^\s*style/i,
              inside: Prism.languages.markup.tag.inside
            },
            'punctuation': /^\s*=\s*['"]|['"]\s*$/,
            'attr-value': {
              pattern: /.+/i,
              inside: Prism.languages.css
            }
          },
          alias: 'language-css'
        }
      }, Prism.languages.markup.tag);
    };
    Prism.languages.clike = {
      'comment': [
        {
          pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
          lookbehind: true
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: true
        }
      ],
      'string': /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: true,
        inside: {
          punctuation: /(\.|\\)/
        }
      },
      'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
      'boolean': /\b(true|false)\b/,
      'function': /[a-z0-9_]+(?=\()/i,
      'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
      'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
      'punctuation': /[{}[\];(),.:]/
    };

    Prism.languages.javascript = Prism.languages.extend('clike', {
      'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
      'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
    });

    Prism.languages.insertBefore('javascript', 'keyword', {
      'regex': {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: true
      }
    });

    Prism.languages.insertBefore('javascript', 'class-name', {
      'template-string': {
        pattern: /`(?:\\`|\\?[^`])*`/,
        inside: {
          'interpolation': {
            pattern: /\$\{[^}]+\}/,
            inside: {
              'interpolation-punctuation': {
                pattern: /^\$\{|\}$/,
                alias: 'punctuation'
              },
              rest: Prism.languages.javascript
            }
          },
          'string': /[\s\S]+/
        }
      }
    });

    if (Prism.languages.markup) {
      Prism.languages.insertBefore('markup', 'tag', {
        'script': {
          pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
          inside: {
            'tag': {
              pattern: /<script[\w\W]*?>|<\/script>/i,
              inside: Prism.languages.markup.tag.inside
            },
            rest: Prism.languages.javascript
          },
          alias: 'language-javascript'
        }
      });
    }

    Prism.languages.js = Prism.languages.javascript;
    Prism.languages.c = Prism.languages.extend('clike', {
      'keyword': /\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
      'operator': /\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/,
      'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)[ful]*\b/i
    });

    Prism.languages.insertBefore('c', 'string', {
      'macro': {
        // allow for multiline macro definitions
        // spaces after the # character compile fine with gcc
        pattern: /(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,
        lookbehind: true,
        alias: 'property',
        inside: {
          // highlight the path of the include statement as a string
          'string': {
            pattern: /(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,
            lookbehind: true
          }
        }
      }
    });

    delete Prism.languages.c['class-name'];
    delete Prism.languages.c['boolean'];

    Prism.languages.csharp = Prism.languages.extend('clike', {
      'keyword': /\b(abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|descending|dynamic|from|get|global|group|into|join|let|orderby|partial|remove|select|set|value|var|where|yield)\b/,
      'string': [
        /@("|')(\1\1|\\\1|\\?(?!\1)[\s\S])*\1/,
        /("|')(\\?.)*?\1/
      ],
      'number': /\b-?(0x[\da-f]+|\d*\.?\d+)\b/i
    });

    Prism.languages.insertBefore('csharp', 'keyword', {
      'preprocessor': {
        pattern: /(^\s*)#.*/m,
        lookbehind: true
      }
    });

    Prism.languages.cpp = Prism.languages.extend('c', {
      'keyword': /\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
      'boolean': /\b(true|false)\b/,
      'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/
    });

    Prism.languages.insertBefore('cpp', 'keyword', {
      'class-name': {
        pattern: /(class\s+)[a-z0-9_]+/i,
        lookbehind: true
      }
    });
    Prism.languages.java = Prism.languages.extend('clike', {
      'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,
      'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+(?:e[+-]?\d+)?[df]?\b/i,
      'operator': {
        pattern: /(^|[^.])(?:\+[+=]?|-[-=]?|!=?|<<?=?|>>?>?=?|==?|&[&=]?|\|[|=]?|\*=?|\/=?|%=?|\^=?|[?:~])/m,
        lookbehind: true
      }
    });
    /**
     * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
     * Modified by Miles Johnson: http://milesj.me
     *
     * Supports the following:
     *  - Extends clike syntax
     *  - Support for PHP 5.3+ (namespaces, traits, generators, etc)
     *  - Smarter constant and function matching
     *
     * Adds the following new token classes:
     *  constant, delimiter, variable, function, package
     */

    Prism.languages.php = Prism.languages.extend('clike', {
      'keyword': /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
      'constant': /\b[A-Z0-9_]{2,}\b/,
      'comment': {
        pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
        lookbehind: true
      }
    });

    // Shell-like comments are matched after strings, because they are less
    // common than strings containing hashes...
    Prism.languages.insertBefore('php', 'class-name', {
      'shell-comment': {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true,
        alias: 'comment'
      }
    });

    Prism.languages.insertBefore('php', 'keyword', {
      'delimiter': /\?>|<\?(?:php)?/i,
      'variable': /\$\w+\b/i,
      'package': {
        pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
        lookbehind: true,
        inside: {
          punctuation: /\\/
        }
      }
    });

    // Must be defined after the function pattern
    Prism.languages.insertBefore('php', 'operator', {
      'property': {
        pattern: /(->)[\w]+/,
        lookbehind: true
      }
    });

    // Add HTML support of the markup language exists
    if (Prism.languages.markup) {

      // Tokenize all inline PHP blocks that are wrapped in <?php ?>
      // This allows for easy PHP + markup highlighting
      Prism.hooks.add('before-highlight', function (env) {
        if (env.language !== 'php') {
          return;
        }

        env.tokenStack = [];

        env.backupCode = env.code;
        env.code = env.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/ig, function (match) {
          env.tokenStack.push(match);

          return '{{{PHP' + env.tokenStack.length + '}}}';
        });
      });

      // Restore env.code for other plugins (e.g. line-numbers)
      Prism.hooks.add('before-insert', function (env) {
        if (env.language === 'php') {
          env.code = env.backupCode;
          delete env.backupCode;
        }
      });

      // Re-insert the tokens after highlighting
      Prism.hooks.add('after-highlight', function (env) {
        if (env.language !== 'php') {
          return;
        }

        for (var i = 0, t; t = env.tokenStack[i]; i++) {
          // The replace prevents $$, $&, $`, $', $n, $nn from being interpreted as special patterns
          env.highlightedCode = env.highlightedCode.replace('{{{PHP' + (i + 1) + '}}}', Prism.highlight(t, env.grammar, 'php').replace(/\$/g, '$$$$'));
        }

        env.element.innerHTML = env.highlightedCode;
      });

      // Wrap tokens in classes that are missing them
      Prism.hooks.add('wrap', function (env) {
        if (env.language === 'php' && env.type === 'markup') {
          env.content = env.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, "<span class=\"token php\">$1</span>");
        }
      });

      // Add the rules before all others
      Prism.languages.insertBefore('php', 'comment', {
        'markup': {
          pattern: /<[^?]\/?(.*?)>/,
          inside: Prism.languages.markup
        },
        'php': /\{\{\{PHP[0-9]+\}\}\}/
      });
    }
    ;
    Prism.languages.python = {
      'comment': {
        pattern: /(^|[^\\])#.*/,
        lookbehind: true
      },
      'string': /"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(?:\\?.)*?\1/,
      'function': {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g,
        lookbehind: true
      },
      'class-name': {
        pattern: /(\bclass\s+)[a-z0-9_]+/i,
        lookbehind: true
      },
      'keyword': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,
      'boolean': /\b(?:True|False)\b/,
      'number': /\b-?(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
      'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
      'punctuation': /[{}[\];(),.:]/
    };

    /**
     * Original by Samuel Flores
     *
     * Adds the following new token classes:
     *  constant, builtin, variable, symbol, regex
     */
    (function (Prism) {
      Prism.languages.ruby = Prism.languages.extend('clike', {
        'comment': /#(?!\{[^\r\n]*?\}).*/,
        'keyword': /\b(alias|and|BEGIN|begin|break|case|class|def|define_method|defined|do|each|else|elsif|END|end|ensure|false|for|if|in|module|new|next|nil|not|or|raise|redo|require|rescue|retry|return|self|super|then|throw|true|undef|unless|until|when|while|yield)\b/
      });

      var interpolation = {
        pattern: /#\{[^}]+\}/,
        inside: {
          'delimiter': {
            pattern: /^#\{|\}$/,
            alias: 'tag'
          },
          rest: Prism.util.clone(Prism.languages.ruby)
        }
      };

      Prism.languages.insertBefore('ruby', 'keyword', {
        'regex': [
          {
            pattern: /%r([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1[gim]{0,3}/,
            inside: {
              'interpolation': interpolation
            }
          },
          {
            pattern: /%r\((?:[^()\\]|\\[\s\S])*\)[gim]{0,3}/,
            inside: {
              'interpolation': interpolation
            }
          },
          {
            // Here we need to specifically allow interpolation
            pattern: /%r\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}[gim]{0,3}/,
            inside: {
              'interpolation': interpolation
            }
          },
          {
            pattern: /%r\[(?:[^\[\]\\]|\\[\s\S])*\][gim]{0,3}/,
            inside: {
              'interpolation': interpolation
            }
          },
          {
            pattern: /%r<(?:[^<>\\]|\\[\s\S])*>[gim]{0,3}/,
            inside: {
              'interpolation': interpolation
            }
          },
          {
            pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/,
            lookbehind: true
          }
        ],
        'variable': /[@$]+[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/,
        'symbol': /:[a-zA-Z_][a-zA-Z_0-9]*(?:[?!]|\b)/
      });

      Prism.languages.insertBefore('ruby', 'number', {
        'builtin': /\b(Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Stat|File|Fixnum|Fload|Hash|Integer|IO|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|String|Struct|TMS|Symbol|ThreadGroup|Thread|Time|TrueClass)\b/,
        'constant': /\b[A-Z][a-zA-Z_0-9]*(?:[?!]|\b)/
      });

      Prism.languages.ruby.string = [
        {
          pattern: /%[qQiIwWxs]?([^a-zA-Z0-9\s\{\(\[<])(?:[^\\]|\\[\s\S])*?\1/,
          inside: {
            'interpolation': interpolation
          }
        },
        {
          pattern: /%[qQiIwWxs]?\((?:[^()\\]|\\[\s\S])*\)/,
          inside: {
            'interpolation': interpolation
          }
        },
        {
          // Here we need to specifically allow interpolation
          pattern: /%[qQiIwWxs]?\{(?:[^#{}\\]|#(?:\{[^}]+\})?|\\[\s\S])*\}/,
          inside: {
            'interpolation': interpolation
          }
        },
        {
          pattern: /%[qQiIwWxs]?\[(?:[^\[\]\\]|\\[\s\S])*\]/,
          inside: {
            'interpolation': interpolation
          }
        },
        {
          pattern: /%[qQiIwWxs]?<(?:[^<>\\]|\\[\s\S])*>/,
          inside: {
            'interpolation': interpolation
          }
        },
        {
          pattern: /("|')(#\{[^}]+\}|\\(?:\r?\n|\r)|\\?.)*?\1/,
          inside: {
            'interpolation': interpolation
          }
        }
      ];
    }(Prism));

    // ------------------ End wrap
    return Prism;
  }
);

/*eslint-enable */

/**
 * Utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.util.Utils',
  [
  ],
  function () {
    function isCodeSample(elm) {
      return elm && elm.nodeName === 'PRE' && elm.className.indexOf('language-') !== -1;
    }

    function trimArg(predicateFn) {
      return function (arg1, arg2) {
        return predicateFn(arg2);
      };
    }

    return {
      isCodeSample: isCodeSample,
      trimArg: trimArg
    };
  }
);
/**
 * CodeSample.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.CodeSample',
  [
    'tinymce.core.dom.DOMUtils',
    'tinymce.plugins.codesample.core.Prism',
    'tinymce.plugins.codesample.util.Utils'
  ],
  function (DOMUtils, Prism, Utils) {
    var getSelectedCodeSample = function (editor) {
      var node = editor.selection.getNode();

      if (Utils.isCodeSample(node)) {
        return node;
      }

      return null;
    };

    var insertCodeSample = function (editor, language, code) {
      editor.undoManager.transact(function () {
        var node = getSelectedCodeSample(editor);

        code = DOMUtils.DOM.encode(code);

        if (node) {
          editor.dom.setAttrib(node, 'class', 'language-' + language);
          node.innerHTML = code;
          Prism.highlightElement(node);
          editor.selection.select(node);
        } else {
          editor.insertContent('<pre id="__new" class="language-' + language + '">' + code + '</pre>');
          editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
        }
      });
    };

    var getCurrentCode = function (editor) {
      var node = getSelectedCodeSample(editor);

      if (node) {
        return node.textContent;
      }

      return '';
    };

    return {
      getSelectedCodeSample: getSelectedCodeSample,
      insertCodeSample: insertCodeSample,
      getCurrentCode: getCurrentCode
    };
  }
);
/**
 * Languages.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.Languages',
  [
    'tinymce.plugins.codesample.api.Settings',
    'tinymce.plugins.codesample.core.CodeSample'
  ],
  function (Settings, CodeSample) {
    var getLanguages = function (editor) {
      var defaultLanguages = [
        { text: 'HTML/XML', value: 'markup' },
        { text: 'JavaScript', value: 'javascript' },
        { text: 'CSS', value: 'css' },
        { text: 'PHP', value: 'php' },
        { text: 'Ruby', value: 'ruby' },
        { text: 'Python', value: 'python' },
        { text: 'Java', value: 'java' },
        { text: 'C', value: 'c' },
        { text: 'C#', value: 'csharp' },
        { text: 'C++', value: 'cpp' }
      ];

      var customLanguages = Settings.getLanguages(editor);
      return customLanguages ? customLanguages : defaultLanguages;
    };

    var getCurrentLanguage = function (editor) {
      var matches, node = CodeSample.getSelectedCodeSample(editor);

      if (node) {
        matches = node.className.match(/language-(\w+)/);
        return matches ? matches[1] : '';
      }

      return '';
    };

    return {
      getLanguages: getLanguages,
      getCurrentLanguage: getCurrentLanguage
    };
  }
);
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
  'tinymce.plugins.codesample.ui.Dialog',
  [
    'tinymce.plugins.codesample.api.Settings',
    'tinymce.plugins.codesample.core.CodeSample',
    'tinymce.plugins.codesample.core.Languages'
  ],
  function (Settings, CodeSample, Languages) {
    return {
      open: function (editor) {
        var minWidth = Settings.getDialogMinWidth(editor);
        var minHeight = Settings.getDialogMinHeight(editor);
        var currentLanguage = Languages.getCurrentLanguage(editor);
        var currentLanguages = Languages.getLanguages(editor);
        var currentCode = CodeSample.getCurrentCode(editor);

        editor.windowManager.open({
          title: "Insert/Edit code sample",
          minWidth: minWidth,
          minHeight: minHeight,
          layout: 'flex',
          direction: 'column',
          align: 'stretch',
          body: [
            {
              type: 'listbox',
              name: 'language',
              label: 'Language',
              maxWidth: 200,
              value: currentLanguage,
              values: currentLanguages
            },

            {
              type: 'textbox',
              name: 'code',
              multiline: true,
              spellcheck: false,
              ariaLabel: 'Code view',
              flex: 1,
              style: 'direction: ltr; text-align: left',
              classes: 'monospace',
              value: currentCode,
              autofocus: true
            }
          ],
          onSubmit: function (e) {
            CodeSample.insertCodeSample(editor, e.data.language, e.data.code);
          }
        });
      }
    };
  }
);
/**
 * Commands.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.api.Commands',
  [
    'tinymce.plugins.codesample.ui.Dialog',
    'tinymce.plugins.codesample.util.Utils'
  ],
  function (Dialog, Utils) {
    var register = function (editor) {
      editor.addCommand('codesample', function () {
        var node = editor.selection.getNode();
        if (editor.selection.isCollapsed() || Utils.isCodeSample(node)) {
          Dialog.open(editor);
        } else {
          editor.formatter.toggle('code');
        }
      });
    };

    return {
      register: register
    };
  }
);
/**
 * FilterContent.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.FilterContent',
  [
    'tinymce.plugins.codesample.core.Prism',
    'tinymce.plugins.codesample.util.Utils'
  ],
  function (Prism, Utils) {
    var setup = function (editor) {
      var $ = editor.$;

      editor.on('PreProcess', function (e) {
        $('pre[contenteditable=false]', e.node).
          filter(Utils.trimArg(Utils.isCodeSample)).
          each(function (idx, elm) {
            var $elm = $(elm), code = elm.textContent;

            $elm.attr('class', $.trim($elm.attr('class')));
            $elm.removeAttr('contentEditable');

            $elm.empty().append($('<code></code>').each(function () {
              // Needs to be textContent since innerText produces BR:s
              this.textContent = code;
            }));
          });
      });

      editor.on('SetContent', function () {
        var unprocessedCodeSamples = $('pre').filter(Utils.trimArg(Utils.isCodeSample)).filter(function (idx, elm) {
          return elm.contentEditable !== "false";
        });

        if (unprocessedCodeSamples.length) {
          editor.undoManager.transact(function () {
            unprocessedCodeSamples.each(function (idx, elm) {
              $(elm).find('br').each(function (idx, elm) {
                elm.parentNode.replaceChild(editor.getDoc().createTextNode('\n'), elm);
              });

              elm.contentEditable = false;
              elm.innerHTML = editor.dom.encode(elm.textContent);
              Prism.highlightElement(elm);
              elm.className = $.trim(elm.className);
            });
          });
        }
      });
    };

    return {
      setup: setup
    };
  }
);
/**
 * LoadCss.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.core.LoadCss',
  [
    'tinymce.plugins.codesample.api.Settings'
  ],
  function (Settings) {
    // Todo: use a proper css loader here
    var loadCss = function (editor, pluginUrl, addedInlineCss, addedCss) {
      var linkElm, contentCss = Settings.getContentCss(editor);

      if (editor.inline && addedInlineCss.get()) {
        return;
      }

      if (!editor.inline && addedCss.get()) {
        return;
      }

      if (editor.inline) {
        addedInlineCss.set(true);
      } else {
        addedCss.set(true);
      }

      if (contentCss !== false) {
        linkElm = editor.dom.create('link', {
          rel: 'stylesheet',
          href: contentCss ? contentCss : pluginUrl + '/css/prism.css'
        });

        editor.getDoc().getElementsByTagName('head')[0].appendChild(linkElm);
      }
    };

    return {
      loadCss: loadCss
    };
  }
);
/**
 * Buttons.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.ui.Buttons',
  [
  ],
  function () {
    var register = function (editor) {
      editor.addButton('codesample', {
        cmd: 'codesample',
        title: 'Insert/Edit code sample'
      });

      editor.addMenuItem('codesample', {
        cmd: 'codesample',
        text: 'Code sample',
        icon: 'codesample'
      });
    };

    return {
      register: register
    };
  }
);
/**
 * Plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.codesample.Plugin',
  [
    'ephox.katamari.api.Cell',
    'tinymce.core.PluginManager',
    'tinymce.plugins.codesample.api.Commands',
    'tinymce.plugins.codesample.core.FilterContent',
    'tinymce.plugins.codesample.core.LoadCss',
    'tinymce.plugins.codesample.ui.Buttons'
  ],
  function (Cell, PluginManager, Commands, FilterContent, LoadCss, Buttons) {
    var addedInlineCss = Cell(false);

    PluginManager.add('codesample', function (editor, pluginUrl) {
      var addedCss = Cell(false);

      FilterContent.setup(editor);
      Buttons.register(editor);
      Commands.register(editor);

      editor.on('init', function () {
        LoadCss.loadCss(editor, pluginUrl, addedInlineCss, addedCss);
      });
    });

    return function () { };
  }
);
dem('tinymce.plugins.codesample.Plugin')();
})();
