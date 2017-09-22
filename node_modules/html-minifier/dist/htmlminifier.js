/*!
 * HTMLMinifier v0.7.2 (http://kangax.github.io/html-minifier/)
 * Copyright 2010-2015 Juriy "kangax" Zaytsev
 * Licensed under MIT (https://github.com/kangax/html-minifier/blob/gh-pages/LICENSE)
 */
/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

/*
 * // Use like so:
 * HTMLParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * // or to get an XML string:
 * HTMLtoXML(htmlString);
 *
 * // or to get an XML DOM Document
 * HTMLtoDOM(htmlString);
 *
 * // or to inject into an existing document/DOM node
 * HTMLtoDOM(htmlString, document);
 * HTMLtoDOM(htmlString, document.body);
 *
 */

 /* global ActiveXObject, DOMDocument */

(function(global) {
  'use strict';

  // Regular Expressions for parsing tags and attributes
  var singleAttrIdentifier = /([\w:\.-]+)/,
      singleAttrAssign = /=/,
      singleAttrAssigns = [ singleAttrAssign ],
      singleAttrValues = [
        /"((?:\\.|[^"])*)"/.source, // attr value double quotes
        /'((?:\\.|[^'])*)'/.source, // attr value, single quotes
        /([^>\s]+)/.source          // attr value, no quotes
      ],
      startTagOpen = /^<([\w:-]+)/,
      startTagClose = /\s*(\/?)>/,
      endTag = /^<\/([\w:-]+)[^>]*>/,
      endingSlash = /\/>$/,
      doctype = /^<!DOCTYPE [^>]+>/i;

  var IS_REGEX_CAPTURING_BROKEN = false;
  'x'.replace(/x(.)?/g, function(m, g) {
    IS_REGEX_CAPTURING_BROKEN = g === '';
  });

  // Empty Elements - HTML 4.01
  var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,wbr');

  // Block Elements - HTML 4.01
  // var block = makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul');

  // Inline Elements - HTML 4.01
  var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var');

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

  // Attributes that have their values filled in disabled='disabled'
  var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

  // Special Elements (can contain anything)
  var special = makeMap('script,style,noscript');

  var reCache = {}, stackedTag, reStackedTag, tagMatch;

  function startTagForHandler( handler ) {
    var customStartTagAttrs;

    var startTagAttrs = new RegExp(
        '(?:\\s*[\\w:\\.-]+'
      +   '(?:\\s*'
      +     '(?:' + joinSingleAttrAssigns(handler) + ')'
      +     '\\s*(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>\\s]+)'
      +   ')?'
      + ')*'
    );

    if ( handler.customAttrSurround ) {
      var attrClauses = [];

      for ( var i = handler.customAttrSurround.length - 1; i >= 0; i-- ) {
        // Capture the custom attribute opening and closing markup surrounding the standard attribute rules
        attrClauses[i] = '(?:\\s*'
          + handler.customAttrSurround[i][0].source
          + startTagAttrs.source
          + handler.customAttrSurround[i][1].source
          + ')';
      }
      attrClauses.unshift(startTagAttrs.source);

      customStartTagAttrs = new RegExp(
        '((?:' + attrClauses.join('|') + ')*)'
      );
    }
    else {
      // No custom attribute wrappers specified, so just capture the standard attribute rules
      customStartTagAttrs = new RegExp('(' + startTagAttrs.source + ')');
    }

    return new RegExp(startTagOpen.source + customStartTagAttrs.source + startTagClose.source);
  }

  function attrForHandler( handler ) {
    var singleAttr = new RegExp(
      singleAttrIdentifier.source
      + '(?:\\s*'
      + '(' + joinSingleAttrAssigns( handler ) + ')'
      + '\\s*'
      + '(?:'
      + singleAttrValues.join('|')
      + ')'
      + ')?'
    );

    if ( handler.customAttrSurround ) {
      var attrClauses = [];
      for ( var i = handler.customAttrSurround.length - 1; i >= 0; i-- ) {
        attrClauses[i] = '(?:'
          + '(' + handler.customAttrSurround[i][0].source + ')'
          + singleAttr.source
          + '(' + handler.customAttrSurround[i][1].source + ')'
          + ')';
      }
      attrClauses.unshift('(?:' + singleAttr.source + ')');

      return new RegExp(attrClauses.join('|'), 'g');
    }
    else {
      return new RegExp(singleAttr.source, 'g');
    }
  }

  function joinSingleAttrAssigns( handler ) {
    return singleAttrAssigns.concat(
      handler.customAttrAssign || []
    ).map(function (assign) {
      return '(?:' + assign.source + ')';
    }).join('|');
  }

  var HTMLParser = global.HTMLParser = function( html, handler ) {
    var index, chars, match, stack = [], last = html, prevTag, nextTag;
    stack.last = function() {
      var last = this[ this.length - 1 ];
      return last && last.tag;
    };

    var startTag = startTagForHandler(handler);
    var attr = attrForHandler(handler);

    while ( html ) {
      chars = true;

      // Make sure we're not in a script or style element
      if ( !stack.last() || !special[ stack.last() ] ) {

        // Comment:
        if ( /^<!--/.test( html ) ) {
          index = html.indexOf('-->');

          if ( index >= 0 ) {
            if ( handler.comment ) {
              handler.comment( html.substring( 4, index ) );
            }
            html = html.substring( index + 3 );
            chars = false;
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if ( /^<!\[/.test( html ) ) {
          index = html.indexOf(']>');

          if (index >= 0) {
            if ( handler.comment ) {
              handler.comment( html.substring(2, index + 1 ), true /* non-standard */ );
            }
            html = html.substring( index + 2 );
            chars = false;
          }
        }

        // Ignored elements?
        else if ( /^<\?/.test( html ) ) {
          index = html.indexOf( '?>', 2 );
          if ( index >= 0 ) {
            if ( handler.chars ) {
              handler.chars( html.substring( 0, index + 2 ) );
            }
            html = html.substring( index + 2 );
          }
        }

        else if ( /^<%/.test( html ) ) {
          index = html.indexOf( '%>', 2 );
          if ( index >= 0 ) {
            if ( handler.chars ) {
              handler.chars(html.substring( 0, index + 2) );
            }
            html = html.substring( index + 2 );
          }
        }

        // Doctype:
        else if ( (match = doctype.exec( html )) ) {
          if ( handler.doctype ) {
            handler.doctype( match[0] );
          }
          html = html.substring( match[0].length );
          chars = false;
        }

        // End tag:
        else if ( /^<\//.test( html ) ) {
          match = html.match( endTag );

          if ( match ) {
            html = html.substring( match[0].length );
            match[0].replace( endTag, parseEndTag );
            prevTag = '/' + match[1].toLowerCase();
            chars = false;
          }

        }
        // Start tag:
        else if ( /^</.test( html ) ) {
          match = html.match( startTag );
          if ( match ) {
            html = html.substring( match[0].length );
            match[0].replace( startTag, parseStartTag );
            prevTag = match[1].toLowerCase();
            chars = false;
          }
        }

        if ( chars ) {
          index = html.indexOf('<');

          var text = index < 0 ? html : html.substring( 0, index );
          html = index < 0 ? '' : html.substring( index );

          // next tag
          tagMatch = html.match( startTag );
          if (tagMatch) {
            nextTag = tagMatch[1];
          }
          else {
            tagMatch = html.match( endTag );
            if (tagMatch) {
              nextTag = '/' + tagMatch[1];
            }
            else {
              nextTag = '';
            }
          }

          if ( handler.chars ) {
            handler.chars(text, prevTag, nextTag);
          }

        }

      }
      else {

        stackedTag = stack.last().toLowerCase();
        reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)<\/' + stackedTag + '[^>]*>', 'i'));

        html = html.replace(reStackedTag, function(all, text) {
          if (stackedTag !== 'script' && stackedTag !== 'style' && stackedTag !== 'noscript') {
            text = text
              .replace(/<!--([\s\S]*?)-->/g, '$1')
              .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
          }

          if ( handler.chars ) {
            handler.chars( text );
          }

          return '';
        });

        parseEndTag( '', stackedTag );
      }

      if ( html === last ) {
        throw 'Parse Error: ' + html;
      }
      last = html;
    }

    // Clean up any remaining tags
    parseEndTag();

    function parseStartTag( tag, tagName, rest, unary ) {
      var unarySlash = false;

      while ( !handler.html5 && stack.last() && inline[ stack.last() ]) {
        parseEndTag( '', stack.last() );
      }

      if ( closeSelf[ tagName ] && stack.last() === tagName ) {
        parseEndTag( '', tagName );
      }

      unary = empty[ tagName ] || !!unary;

      var attrs = [];

      rest.replace(attr, function () {
        var name, value, fallbackValue, customOpen, customClose, customAssign, quote;
        var ncp = 7; // number of captured parts, scalar

        // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
        if (IS_REGEX_CAPTURING_BROKEN && arguments[0].indexOf('""') === -1) {
          if (arguments[3] === '') { arguments[3] = undefined; }
          if (arguments[4] === '') { arguments[4] = undefined; }
          if (arguments[5] === '') { arguments[5] = undefined; }
        }

        name = arguments[1];
        if ( name ) {
          customAssign = arguments[2];
          fallbackValue = arguments[3];
          value = fallbackValue || arguments[4] || arguments[5];

          if (customAssign) {
            quote = arguments[0].charAt(name.length + customAssign.length);
            quote = (quote === '\'' || quote === '"') ? quote : '';
          }

        }
        else if ( handler.customAttrSurround ) {
          for ( var i = handler.customAttrSurround.length - 1; i >= 0; i-- ) {
            name = arguments[i * ncp + 7];
            customAssign = arguments[i * ncp + 8];
            if ( name ) {
              fallbackValue = arguments[i * ncp + 9];
              value = fallbackValue
                || arguments[i * ncp + 10]
                || arguments[i * ncp + 11];
              customOpen = arguments[i * ncp + 6];
              customClose = arguments[i * ncp + 12];
              break;
            }
          }
        }

        if ( value === undefined ) {
          value = fillAttrs[name] ? name : fallbackValue;
        }

        attrs.push({
          name: name,
          value: value,
          escaped: value && value.replace(/(^|.)("+)/g, function(match) {
            return match.replace(/"/g, '&quot;');
          }),
          customAssign: customAssign || '=',
          customOpen:  customOpen || '',
          customClose: customClose || '',
          quote: quote || ''
        });
      });

      if ( !unary ) {
        stack.push( { tag: tagName, attrs: attrs } );
      }
      else {
        unarySlash = tag.match( endingSlash );
      }


      if ( handler.start ) {
        handler.start( tagName, attrs, unary, unarySlash );
      }
    }

    function parseEndTag( tag, tagName ) {
      var pos;

      // If no tag name is provided, clean shop
      if ( !tagName ) {
        pos = 0;
      }
      else {
        // Find the closest opened tag of the same type
        var needle = tagName.toLowerCase();
        for ( pos = stack.length - 1; pos >= 0; pos-- ) {
          if ( stack[ pos ].tag.toLowerCase() === needle ) {
            break;
          }
        }
      }

      if ( pos >= 0 ) {
        // Close all the open elements, up the stack
        for ( var i = stack.length - 1; i >= pos; i-- ) {
          if ( handler.end ) {
            handler.end( stack[ i ].tag, stack[ i ].attrs );
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
      }
    }
  };

  global.HTMLtoXML = function( html ) {
    var results = '';

    new HTMLParser(html, {
      start: function( tag, attrs, unary ) {
        results += '<' + tag;

        for ( var i = 0; i < attrs.length; i++ ) {
          results += ' ' + attrs[i].name + '="' + attrs[i].escaped + '"';
        }

        results += (unary ? '/' : '') + '>';
      },
      end: function( tag ) {
        results += '</' + tag + '>';
      },
      chars: function( text ) {
        results += text;
      },
      comment: function( text ) {
        results += '<!--' + text + '-->';
      },
      ignore: function(text) {
        results += text;
      }
    });

    return results;
  };

  global.HTMLtoDOM = function( html, doc ) {
    // There can be only one of these elements
    var one = makeMap('html,head,body,title');

    // Enforce a structure for the document
    var structure = {
      link: 'head',
      base: 'head'
    };

    if ( !doc ) {
      if ( typeof DOMDocument !== 'undefined' ) {
        doc = new DOMDocument();
      }
      else if ( typeof document !== 'undefined' && document.implementation && document.implementation.createDocument ) {
        doc = document.implementation.createDocument('', '', null);
      }
      else if ( typeof ActiveX !== 'undefined' ) {
        doc = new ActiveXObject('Msxml.DOMDocument');
      }

    }
    else {
      doc = doc.ownerDocument ||
        doc.getOwnerDocument && doc.getOwnerDocument() ||
        doc;
    }

    var elems = [],
      documentElement = doc.documentElement ||
        doc.getDocumentElement && doc.getDocumentElement();

    // If we're dealing with an empty document then we
    // need to pre-populate it with the HTML document structure
    if ( !documentElement && doc.createElement ) {
      (function() {
        var html = doc.createElement('html');
        var head = doc.createElement('head');
        head.appendChild( doc.createElement('title') );
        html.appendChild( head );
        html.appendChild( doc.createElement('body') );
        doc.appendChild( html );
      })();
    }

    // Find all the unique elements
    if ( doc.getElementsByTagName ) {
      for ( var i in one ) {
        one[ i ] = doc.getElementsByTagName( i )[0];
      }
    }

    // If we're working with a document, inject contents into
    // the body element
    var curParentNode = one.body;

    new HTMLParser( html, {
      start: function( tagName, attrs, unary ) {
        // If it's a pre-built element, then we can ignore
        // its construction
        if ( one[ tagName ] ) {
          curParentNode = one[ tagName ];
          return;
        }

        var elem = doc.createElement( tagName );

        for ( var attr in attrs ) {
          elem.setAttribute( attrs[ attr ].name, attrs[ attr ].value );
        }

        if ( structure[ tagName ] && typeof one[ structure[ tagName ] ] !== 'boolean' ) {
          one[ structure[ tagName ] ].appendChild( elem );
        }
        else if ( curParentNode && curParentNode.appendChild ) {
          curParentNode.appendChild( elem );
        }

        if ( !unary ) {
          elems.push( elem );
          curParentNode = elem;
        }
      },
      end: function( /* tag */ ) {
        elems.length -= 1;

        // Init the new parentNode
        curParentNode = elems[ elems.length - 1 ];
      },
      chars: function( text ) {
        curParentNode.appendChild( doc.createTextNode( text ) );
      },
      comment: function( /*text*/ ) {
        // create comment node
      },
      ignore: function( /* text */ ) {
        // What to do here?
      }
    });

    return doc;
  };

  function makeMap(str) {
    var obj = {}, items = str.split(',');
    for ( var i = 0; i < items.length; i++ ) {
      obj[ items[i] ] = true;
      obj[ items[i].toUpperCase() ] = true;
    }
    return obj;
  }
})(typeof exports === 'undefined' ? this : exports);

/* global CleanCSS */

(function(global) {
  'use strict';

  var log, HTMLParser;
  if (global.console && global.console.log) {
    log = function(message) {
      // "preserving" `this`
      global.console.log(message);
    };
  }
  else {
    log = function() {};
  }

  if (global.HTMLParser) {
    HTMLParser = global.HTMLParser;
  }
  else if (typeof require === 'function') {
    HTMLParser = require('./htmlparser').HTMLParser;
  }

  var trimWhitespace = function(str) {
    if (typeof str !== 'string') {
      return str;
    }
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  };
  if (String.prototype.trim) {
    trimWhitespace = function(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.trim();
    };
  }

  function collapseWhitespace(str) {
    return str ? str.replace(/[\t\n\r ]+/g, ' ') : str;
  }

  function collapseWhitespaceSmart(str, prevTag, nextTag, options) {

    // array of non-empty element tags that will maintain a single space outside of them
    var tags = [
      'a', 'abbr', 'acronym', 'b', 'bdi', 'bdo', 'big', 'button', 'cite',
      'code', 'del', 'dfn', 'em', 'font', 'i', 'ins', 'kbd', 'mark', 'q',
      'rt', 'rp', 's', 'samp', 'small', 'span', 'strike', 'strong',
      'sub', 'sup', 'svg', 'time', 'tt', 'u', 'var'
    ],
    lineBreakBefore = /^[\t ]*[\n\r]+[\t\n\r ]*/,
    lineBreakAfter = /[\t\n\r ]*[\n\r]+[\t ]*$/,
    preserveBefore = lineBreakBefore.test(str) ? '\n' : ' ',
    preserveAfter = lineBreakAfter.test(str) ? '\n' : ' ',
    lineBreakStamp = 'htmlmincollapsedlinebreak';

    if (prevTag && prevTag !== 'img' && prevTag !== 'input' && (prevTag.substr(0, 1) !== '/'
      || (prevTag.substr(0, 1) === '/' && tags.indexOf(prevTag.substr(1)) === -1))) {
      str = str.replace(/^\s+/, options.conservativeCollapse ? ' ' : options.preserveLineBreaks ? preserveBefore : '');
    }

    if (nextTag && nextTag !== 'img' && nextTag !== 'input' && (nextTag.substr(0, 1) === '/'
      || (nextTag.substr(0, 1) !== '/' && tags.indexOf(nextTag) === -1))) {
      str = str.replace(/\s+$/, options.conservativeCollapse ? ' ' : options.preserveLineBreaks ? preserveAfter : '');
    }

    if (prevTag && nextTag) {

      if (options.preserveLineBreaks) {
        str = str
          .replace(lineBreakBefore, lineBreakStamp)
          .replace(lineBreakAfter, lineBreakStamp);
      }
      // strip non space whitespace then compress spaces to one
      return str
        .replace(/[\t\n\r]+/g, ' ').replace(/[ ]+/g, ' ')
        .replace(new RegExp(lineBreakStamp, 'g'), '\n');
    }

    return str;
  }

  function isConditionalComment(text) {
    return ((/\[if[^\]]+\]/).test(text) || (/\s*((?:<!)?\[endif\])$/).test(text));
  }

  function isIgnoredComment(text, options) {
    if ((/^!/).test(text)) {
      return true;
    }

    if (options.ignoreCustomComments) {
      for (var i = 0, len = options.ignoreCustomComments.length; i < len; i++) {
        if (options.ignoreCustomComments[i].test(text)) {
          return true;
        }
      }
    }

    return false;
  }

  function isEventAttribute(attrName) {
    return (/^on[a-z]+/).test(attrName);
  }

  function canRemoveAttributeQuotes(value) {
    // http://mathiasbynens.be/notes/unquoted-attribute-values
    return (/^[^\x20\t\n\f\r"'`=<>]+$/).test(value) && !(/\/$/).test(value) &&
    // make sure trailing slash is not interpreted as HTML self-closing tag
        !(/\/$/).test(value);
  }

  function attributesInclude(attributes, attribute) {
    for (var i = attributes.length; i--;) {
      if (attributes[i].name.toLowerCase() === attribute) {
        return true;
      }
    }
    return false;
  }

  function isAttributeRedundant(tag, attrName, attrValue, attrs) {
    attrValue = attrValue ? trimWhitespace(attrValue.toLowerCase()) : '';

    return (
        (tag === 'script' &&
        attrName === 'language' &&
        attrValue === 'javascript') ||

        (tag === 'form' &&
        attrName === 'method' &&
        attrValue === 'get') ||

        (tag === 'input' &&
        attrName === 'type' &&
        attrValue === 'text') ||

        (tag === 'script' &&
        attrName === 'charset' &&
        !attributesInclude(attrs, 'src')) ||

        (tag === 'a' &&
        attrName === 'name' &&
        attributesInclude(attrs, 'id')) ||

        (tag === 'area' &&
        attrName === 'shape' &&
        attrValue === 'rect')
    );
  }

  function isScriptTypeAttribute(tag, attrName, attrValue) {
    return (
      tag === 'script' &&
      attrName === 'type' &&
      trimWhitespace(attrValue.toLowerCase()) === 'text/javascript'
    );
  }

  // https://mathiasbynens.be/demo/javascript-mime-type
  // https://developer.mozilla.org/en/docs/Web/HTML/Element/script#attr-type
  var executableScriptsMimetypes = {
    'text/javascript': 1,
    'text/ecmascript': 1,
    'text/jscript': 1,
    'application/javascript': 1,
    'application/x-javascript': 1,
    'application/ecmascript': 1
  };

  function isExecutableScript(tag, attrs) {
    if (tag !== 'script') {
      return false;
    }
    for (var i = 0, len = attrs.length; i < len; i++) {
      var attrName = attrs[i].name.toLowerCase();
      if (attrName === 'type') {
        return attrs[i].value === '' ||
               executableScriptsMimetypes[attrs[i].value] === 1;
      }
    }
    return true;
  }

  function isStyleLinkTypeAttribute(tag, attrName, attrValue) {
    return (
      (tag === 'style' || tag === 'link') &&
      attrName === 'type' &&
      trimWhitespace(attrValue.toLowerCase()) === 'text/css'
    );
  }

  var enumeratedAttributeValues = {
    draggable: ['true', 'false'] // defaults to 'auto'
  };

  function isBooleanAttribute(attrName, attrValue) {
    var isSimpleBoolean = (/^(?:allowfullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultchecked|defaultmuted|defaultselected|defer|disabled|enabled|formnovalidate|hidden|indeterminate|inert|ismap|itemscope|loop|multiple|muted|nohref|noresize|noshade|novalidate|nowrap|open|pauseonexit|readonly|required|reversed|scoped|seamless|selected|sortable|spellcheck|truespeed|typemustmatch|visible)$/i).test(attrName);
    if (isSimpleBoolean) {
      return true;
    }

    var attrValueEnumeration = enumeratedAttributeValues[attrName.toLowerCase()];
    if (!attrValueEnumeration) {
      return false;
    }
    else {
      return (-1 === attrValueEnumeration.indexOf(attrValue.toLowerCase()));
    }
  }

  function isUriTypeAttribute(attrName, tag) {
    return (
      ((/^(?:a|area|link|base)$/).test(tag) && attrName === 'href') ||
      (tag === 'img' && (/^(?:src|longdesc|usemap)$/).test(attrName)) ||
      (tag === 'object' && (/^(?:classid|codebase|data|usemap)$/).test(attrName)) ||
      (tag === 'q' && attrName === 'cite') ||
      (tag === 'blockquote' && attrName === 'cite') ||
      ((tag === 'ins' || tag === 'del') && attrName === 'cite') ||
      (tag === 'form' && attrName === 'action') ||
      (tag === 'input' && (attrName === 'src' || attrName === 'usemap')) ||
      (tag === 'head' && attrName === 'profile') ||
      (tag === 'script' && (attrName === 'src' || attrName === 'for'))
    );
  }

  function isNumberTypeAttribute(attrName, tag) {
    return (
      ((/^(?:a|area|object|button)$/).test(tag) && attrName === 'tabindex') ||
      (tag === 'input' && (attrName === 'maxlength' || attrName === 'tabindex')) ||
      (tag === 'select' && (attrName === 'size' || attrName === 'tabindex')) ||
      (tag === 'textarea' && (/^(?:rows|cols|tabindex)$/).test(attrName)) ||
      (tag === 'colgroup' && attrName === 'span') ||
      (tag === 'col' && attrName === 'span') ||
      ((tag === 'th' || tag === 'td') && (attrName === 'rowspan' || attrName === 'colspan'))
    );
  }

  function cleanAttributeValue(tag, attrName, attrValue, options, attrs) {
    if (attrValue && isEventAttribute(attrName)) {
      attrValue = trimWhitespace(attrValue).replace(/^javascript:\s*/i, '').replace(/\s*;$/, '');
      if (options.minifyJS) {
        var wrappedCode = '(function(){' + attrValue + '})()';
        var minified = minifyJS(wrappedCode, options.minifyJS);
        return minified.slice(12, minified.length - 4).replace(/"/g, '&quot;');
      }
      return attrValue;
    }
    else if (attrName === 'class') {
      return collapseWhitespace(trimWhitespace(attrValue));
    }
    else if (isUriTypeAttribute(attrName, tag)) {
      attrValue = trimWhitespace(attrValue);
      if (options.minifyURLs) {
        return minifyURLs(attrValue, options.minifyURLs);
      }
      return attrValue;
    }
    else if (isNumberTypeAttribute(attrName, tag)) {
      return trimWhitespace(attrValue);
    }
    else if (attrName === 'style') {
      attrValue = trimWhitespace(attrValue);
      if (attrValue) {
        attrValue = attrValue.replace(/\s*;\s*$/, '');
      }
      if (options.minifyCSS) {
        return minifyCSS(attrValue, options.minifyCSS, true);
      }
      return attrValue;
    }
    else if (isMetaViewport(tag, attrs) && attrName === 'content') {
      attrValue = attrValue.replace(/1\.0/g, '1').replace(/\s+/g, '');
    }
    else if (attrValue && options.customAttrCollapse && options.customAttrCollapse.test(attrName)) {
      attrValue = attrValue.replace(/\n+/g, '');
    }
    return attrValue;
  }

  function isMetaViewport(tag, attrs) {
    if (tag !== 'meta') {
      return false;
    }
    for (var i = 0, len = attrs.length; i < len; i++) {
      if (attrs[i].name === 'name' && attrs[i].value === 'viewport') {
        return true;
      }
    }
  }

  // Wrap CSS declarations for CleanCSS > 3.x
  // See https://github.com/jakubpawlowicz/clean-css/issues/418
  function wrapCSS(text) {
    return '*{' + text + '}';
  }

  function unwrapCSS(text) {
    var matches = text.match(/^\*\{([\s\S]*)\}$/m);
    if (matches && matches[1]) {
      return matches[1];
    }
    else {
      return text;
    }
  }

  function cleanConditionalComment(comment) {
    return comment
      .replace(/^(\[[^\]]+\]>)\s*/, '$1')
      .replace(/\s*(<!\[endif\])$/, '$1');
  }

  function removeCDATASections(text) {
    return text
      // "/* <![CDATA[ */" or "// <![CDATA["
      .replace(/^(?:\s*\/\*\s*<!\[CDATA\[\s*\*\/|\s*\/\/\s*<!\[CDATA\[.*)/, '')
      // "/* ]]> */" or "// ]]>"
      .replace(/(?:\/\*\s*\]\]>\s*\*\/|\/\/\s*\]\]>)\s*$/, '');
  }

  function processScript(text, options, currentAttrs) {
    for (var i = 0, len = currentAttrs.length; i < len; i++) {
      if (currentAttrs[i].name.toLowerCase() === 'type' &&
          options.processScripts.indexOf(currentAttrs[i].value) > -1) {
        return minify(text, options);
      }
    }
    return text;
  }

  var reStartDelimiter = {
    // account for js + html comments (e.g.: //<!--)
    script: /^\s*(?:\/\/)?\s*<!--.*\n?/,
    style: /^\s*<!--\s*/
  };
  var reEndDelimiter = {
    script: /\s*(?:\/\/)?\s*-->\s*$/,
    style: /\s*-->\s*$/
  };
  function removeComments(text, tag) {
    return text.replace(reStartDelimiter[tag], '').replace(reEndDelimiter[tag], '');
  }

  function isOptionalTag(tag) {
    return (/^(?:html|t?body|t?head|tfoot|tr|td|th|dt|dd|option|colgroup|source)$/).test(tag);
  }

  var reEmptyAttribute = new RegExp(
    '^(?:class|id|style|title|lang|dir|on(?:focus|blur|change|click|dblclick|mouse(' +
      '?:down|up|over|move|out)|key(?:press|down|up)))$');

  function canDeleteEmptyAttribute(tag, attrName, attrValue) {
    var isValueEmpty = !attrValue || (/^\s*$/).test(attrValue);
    if (isValueEmpty) {
      return (
        (tag === 'input' && attrName === 'value') ||
        reEmptyAttribute.test(attrName));
    }
    return false;
  }

  function canRemoveElement(tag, attrs) {
    if (tag === 'textarea') {
      return false;
    }

    if (tag === 'script') {
      for (var i = attrs.length - 1; i >= 0; i--) {
        if (attrs[i].name === 'src') {
          return false;
        }
      }
    }

    return true;
  }

  function canCollapseWhitespace(tag) {
    return !(/^(?:script|style|pre|textarea)$/.test(tag));
  }

  function canTrimWhitespace(tag) {
    return !(/^(?:pre|textarea)$/.test(tag));
  }

  function attrsToMarkup(attrs) {
    var markup = '';
    for (var i = 0, len = attrs.length; i < len; i++) {
      markup += (' ' + attrs[i].name + (isBooleanAttribute(attrs[i].value) ? '' : ('="' + attrs[i].value + '"')));
    }
    return markup;
  }

  function normalizeAttribute(attr, attrs, tag, unarySlash, index, options) {

    var attrName = options.caseSensitive ? attr.name : attr.name.toLowerCase(),
        attrValue = options.preventAttributesEscaping ? attr.value : attr.escaped,
        attrQuote = options.preventAttributesEscaping ? attr.quote : '"',
        attrFragment,
        emittedAttrValue,
        isTerminalOfUnarySlash = unarySlash && index === attrs.length - 1;

    if ((options.removeRedundantAttributes &&
      isAttributeRedundant(tag, attrName, attrValue, attrs))
      ||
      (options.removeScriptTypeAttributes &&
      isScriptTypeAttribute(tag, attrName, attrValue))
      ||
      (options.removeStyleLinkTypeAttributes &&
      isStyleLinkTypeAttribute(tag, attrName, attrValue))) {
      return '';
    }

    attrValue = cleanAttributeValue(tag, attrName, attrValue, options, attrs);

    if (attrValue !== undefined && !options.removeAttributeQuotes ||
        !canRemoveAttributeQuotes(attrValue) || isTerminalOfUnarySlash) {
      emittedAttrValue = attrQuote + attrValue + attrQuote;
    }
    else {
      emittedAttrValue = attrValue;
    }

    if (options.removeEmptyAttributes &&
        canDeleteEmptyAttribute(tag, attrName, attrValue)) {
      return '';
    }

    if (attrValue === undefined || (options.collapseBooleanAttributes &&
        isBooleanAttribute(attrName, attrValue))) {
      attrFragment = attrName;
    }
    else {
      attrFragment = attrName + attr.customAssign + emittedAttrValue;
    }

    return (' ' + attr.customOpen + attrFragment + attr.customClose);
  }

  function setDefaultTesters(options) {

    var defaultTesters = ['canCollapseWhitespace', 'canTrimWhitespace'];

    for (var i = 0, len = defaultTesters.length; i < len; i++) {
      if (!options[defaultTesters[i]]) {
        options[defaultTesters[i]] = function() {
          return false;
        };
      }
    }
  }

  function minifyURLs(text, options) {
    if (typeof options !== 'object') {
      options = { };
    }

    try {
      // try to get global reference first
      var __RelateUrl = global.RelateUrl;

      if (typeof __RelateUrl === 'undefined' && typeof require === 'function') {
        __RelateUrl = require('relateurl');
      }

      // noop
      if (!__RelateUrl) {
        return text;
      }

      if (__RelateUrl.relate) {
        return __RelateUrl.relate(text, options);
      }
      else {
        return text;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function minifyJS(text, options) {
    if (typeof options !== 'object') {
      options = { };
    }
    options.fromString = true;
    var outputOptions = options.output || {};
    outputOptions.inline_script = true;
    options.output = outputOptions;

    try {
      // try to get global reference first
      var __UglifyJS = global.UglifyJS;

      if (typeof __UglifyJS === 'undefined' && typeof require === 'function') {
        __UglifyJS = require('uglify-js');
      }

      // noop
      if (!__UglifyJS) {
        return text;
      }

      if (__UglifyJS.minify) {
        return __UglifyJS.minify(text, options).code;
      }
      else if (__UglifyJS.parse) {

        var ast = __UglifyJS.parse(text);
        ast.figure_out_scope();

        var compressor = __UglifyJS.Compressor();
        var compressedAst = ast.transform(compressor);

        compressedAst.figure_out_scope();
        compressedAst.compute_char_frequency();

        if (options.mangle !== false) {
          compressedAst.mangle_names();
        }

        var stream = __UglifyJS.OutputStream(options.output);
        compressedAst.print(stream);

        return stream.toString();
      }
      else {
        return text;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function minifyCSS(text, options, inline) {
    if (typeof options !== 'object') {
      options = { };
    }
    if (typeof options.advanced === 'undefined') {
      options.advanced = false;
    }
    try {
      var cleanCSS;

      if (typeof CleanCSS !== 'undefined') {
        cleanCSS = new CleanCSS(options);
      }
      else if (typeof require === 'function') {
        var CleanCSSModule = require('clean-css');
        cleanCSS = new CleanCSSModule(options);
      }
      if (inline) {
        return unwrapCSS(cleanCSS.minify(wrapCSS(text)).styles);
      }
      else {
        return cleanCSS.minify(text).styles;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function minify(value, options) {

    options = options || {};
    var optionsStack = [];

    value = trimWhitespace(value);
    setDefaultTesters(options);

    var results = [ ],
        buffer = [ ],
        currentChars = '',
        currentTag = '',
        currentAttrs = [],
        stackNoTrimWhitespace = [],
        stackNoCollapseWhitespace = [],
        lint = options.lint,
        isIgnoring = false,
        t = new Date();

    if (options.removeIgnored) {
      value = value
        .replace(/<\?[^\?]+\?>/g, '')
        .replace(/<%[^%]+%>/g, '');
    }

    function _canCollapseWhitespace(tag, attrs) {
      return canCollapseWhitespace(tag) || options.canCollapseWhitespace(tag, attrs);
    }

    function _canTrimWhitespace(tag, attrs) {
      return canTrimWhitespace(tag) || options.canTrimWhitespace(tag, attrs);
    }

    new HTMLParser(value, {
      html5: typeof options.html5 !== 'undefined' ? options.html5 : true,

      start: function(tag, attrs, unary, unarySlash) {
        if (isIgnoring) {
          buffer.push('<' + tag, attrsToMarkup(attrs), unarySlash ? '/' : '', '>');
          return;
        }

        var lowerTag = tag.toLowerCase();

        if (lowerTag === 'svg') {
          optionsStack.push(options);
          var nextOptions = {};
          for (var key in options) {
            nextOptions[key] = options[key];
          }
          nextOptions.keepClosingSlash = true;
          nextOptions.caseSensitive = true;
          options = nextOptions;
        }

        tag = options.caseSensitive ? tag : lowerTag;

        currentTag = tag;
        currentChars = '';
        currentAttrs = attrs;

        // set whitespace flags for nested tags (eg. <code> within a <pre>)
        if (options.collapseWhitespace) {
          if (!_canTrimWhitespace(tag, attrs)) {
            stackNoTrimWhitespace.push(tag);
          }
          if (!_canCollapseWhitespace(tag, attrs)) {
            stackNoCollapseWhitespace.push(tag);
          }
        }

        var openTag = '<' + tag;
        var closeTag = ((unarySlash && options.keepClosingSlash) ? '/' : '') + '>';
        if (attrs.length === 0) {
          openTag += closeTag;
        }

        buffer.push(openTag);

        if (lint) {
          lint.testElement(tag);
        }

        var token;
        for (var i = 0, len = attrs.length; i < len; i++) {
          if (lint) {
            lint.testAttribute(tag, attrs[i].name.toLowerCase(), attrs[i].escaped);
          }
          token = normalizeAttribute(attrs[i], attrs, tag, unarySlash, i, options);
          if (i === len - 1) {
            token += closeTag;
          }
          buffer.push(token);
        }
      },
      end: function(tag, attrs) {

        if (isIgnoring) {
          buffer.push('</' + tag + '>');
          return;
        }

        var lowerTag = tag.toLowerCase();
        if (lowerTag === 'svg') {
          options = optionsStack.pop();
        }

        // check if current tag is in a whitespace stack
        if (options.collapseWhitespace) {
          if (stackNoTrimWhitespace.length &&
            tag === stackNoTrimWhitespace[stackNoTrimWhitespace.length - 1]) {
            stackNoTrimWhitespace.pop();
          }
          if (stackNoCollapseWhitespace.length &&
            tag === stackNoCollapseWhitespace[stackNoCollapseWhitespace.length - 1]) {
            stackNoCollapseWhitespace.pop();
          }
        }

        var isElementEmpty = currentChars === '' && tag === currentTag;
        if ((options.removeEmptyElements && isElementEmpty && canRemoveElement(tag, attrs))) {
          // remove last "element" from buffer, return
          for (var i = buffer.length - 1; i >= 0; i--) {
            if (/^<[^\/!]/.test(buffer[i])) {
              buffer.splice(i);
              break;
            }
          }
          return;
        }
        else if (options.removeOptionalTags && isOptionalTag(tag)) {
          // noop, leave start tag in buffer
          return;
        }
        else {
          // push end tag to buffer
          buffer.push('</' + (options.caseSensitive ? tag : lowerTag) + '>');
          results.push.apply(results, buffer);
        }
        // flush buffer
        buffer.length = 0;
        currentChars = '';
      },
      chars: function(text, prevTag, nextTag) {
        prevTag = prevTag === '' ? 'comment' : prevTag;
        nextTag = nextTag === '' ? 'comment' : nextTag;

        if (isIgnoring) {
          buffer.push(text);
          return;
        }

        if (currentTag === 'script' || currentTag === 'style') {
          if (options.removeCommentsFromCDATA) {
            text = removeComments(text, currentTag);
          }
          if (options.removeCDATASectionsFromCDATA) {
            text = removeCDATASections(text);
          }
          if (options.processScripts) {
            text = processScript(text, options, currentAttrs);
          }
        }
        if (options.minifyJS && isExecutableScript(currentTag, currentAttrs)) {
          text = minifyJS(text, options.minifyJS);
        }
        if (currentTag === 'style' && options.minifyCSS) {
          text = minifyCSS(text, options.minifyCSS);
        }
        if (options.collapseWhitespace) {
          if (!stackNoTrimWhitespace.length) {
            text = ((prevTag && prevTag !== 'comment') || (nextTag && nextTag !== 'comment')) ?
              collapseWhitespaceSmart(text, prevTag, nextTag, options)
              : trimWhitespace(text);
          }
          if (!stackNoCollapseWhitespace.length) {
            text = !(prevTag && nextTag || nextTag === 'html') ? collapseWhitespace(text) : text;
          }
        }
        currentChars = text;
        if (lint) {
          lint.testChars(text);
        }
        buffer.push(text);
      },
      comment: function(text, nonStandard) {

        var prefix = nonStandard ? '<!' : '<!--';
        var suffix = nonStandard ? '>' : '-->';

        if (/^\s*htmlmin:ignore/.test(text)) {
          isIgnoring = !isIgnoring;
          if (!options.removeComments) {
            buffer.push('<!--' + text + '-->');
          }
          return;
        }
        if (options.removeComments) {
          if (isConditionalComment(text)) {
            text = prefix + cleanConditionalComment(text) + suffix;
          }
          else if (isIgnoredComment(text, options)) {
            text = '<!--' + text + '-->';
          }
          else {
            text = '';
          }
        }
        else {
          text = prefix + text + suffix;
        }
        buffer.push(text);
      },
      doctype: function(doctype) {
        buffer.push(options.useShortDoctype ? '<!DOCTYPE html>' : collapseWhitespace(doctype));
      },
      customAttrAssign: options.customAttrAssign,
      customAttrSurround: options.customAttrSurround
    });

    results.push.apply(results, buffer);
    var str = joinResultSegments(results, options);
    log('minified in: ' + (new Date() - t) + 'ms');
    return str;
  }

  function joinResultSegments(results, options) {
    var str;
    var maxLineLength = options.maxLineLength;
    if (maxLineLength) {
      var token;
      var lines = [];
      var line = '';
      for (var i = 0, len = results.length; i < len; i++) {
        token = results[i];
        if (line.length + token.length < maxLineLength) {
          line += token;
        }
        else {
          lines.push(line.replace(/^\n/, ''));
          line = token;
        }
      }
      lines.push(line);

      str = lines.join('\n');
    }
    else {
      str = results.join('');
    }

    return str;
  }

  // for CommonJS enviroments, export everything
  if (typeof exports !== 'undefined') {
    exports.minify = minify;
  }
  else {
    global.minify = minify;
  }

}(this));

/*!
 * HTMLLint (to be used in conjunction with HTMLMinifier)
 *
 * Copyright (c) 2010-2013 Juriy "kangax" Zaytsev
 * Licensed under the MIT license.
 *
 */

(function(global) {
  'use strict';

  function isPresentationalElement(tag) {
    return (/^(?:big|small|hr|blink|marquee)$/).test(tag);
  }
  function isDeprecatedElement(tag) {
    return (/^(?:applet|basefont|center|dir|font|isindex|strike)$/).test(tag);
  }
  function isEventAttribute(attrName) {
    return (/^on[a-z]+/).test(attrName);
  }
  function isStyleAttribute(attrName) {
    return (attrName.toLowerCase() === 'style');
  }
  function isDeprecatedAttribute(tag, attrName) {
    return (
      (attrName === 'align' &&
      (/^(?:caption|applet|iframe|img|imput|object|legend|table|hr|div|h[1-6]|p)$/).test(tag)) ||
      (attrName === 'alink' && tag === 'body') ||
      (attrName === 'alt' && tag === 'applet') ||
      (attrName === 'archive' && tag === 'applet') ||
      (attrName === 'background' && tag === 'body') ||
      (attrName === 'bgcolor' && (/^(?:table|t[rdh]|body)$/).test(tag)) ||
      (attrName === 'border' && (/^(?:img|object)$/).test(tag)) ||
      (attrName === 'clear' && tag === 'br') ||
      (attrName === 'code' && tag === 'applet') ||
      (attrName === 'codebase' && tag === 'applet') ||
      (attrName === 'color' && (/^(?:base(?:font)?)$/).test(tag)) ||
      (attrName === 'compact' && (/^(?:dir|[dou]l|menu)$/).test(tag)) ||
      (attrName === 'face' && (/^base(?:font)?$/).test(tag)) ||
      (attrName === 'height' && (/^(?:t[dh]|applet)$/).test(tag)) ||
      (attrName === 'hspace' && (/^(?:applet|img|object)$/).test(tag)) ||
      (attrName === 'language' && tag === 'script') ||
      (attrName === 'link' && tag === 'body') ||
      (attrName === 'name' && tag === 'applet') ||
      (attrName === 'noshade' && tag === 'hr') ||
      (attrName === 'nowrap' && (/^t[dh]$/).test(tag)) ||
      (attrName === 'object' && tag === 'applet') ||
      (attrName === 'prompt' && tag === 'isindex') ||
      (attrName === 'size' && (/^(?:hr|font|basefont)$/).test(tag)) ||
      (attrName === 'start' && tag === 'ol') ||
      (attrName === 'text' && tag === 'body') ||
      (attrName === 'type' && (/^(?:li|ol|ul)$/).test(tag)) ||
      (attrName === 'value' && tag === 'li') ||
      (attrName === 'version' && tag === 'html') ||
      (attrName === 'vlink' && tag === 'body') ||
      (attrName === 'vspace' && (/^(?:applet|img|object)$/).test(tag)) ||
      (attrName === 'width' && (/^(?:hr|td|th|applet|pre)$/).test(tag))
    );
  }
  function isInaccessibleAttribute(attrName, attrValue) {
    return (
      attrName === 'href' &&
      (/^\s*javascript\s*:\s*void\s*(\s+0|\(\s*0\s*\))\s*$/i).test(attrValue)
    );
  }

  function Lint() {
    this.log = [ ];
    this._lastElement = null;
    this._isElementRepeated = false;
  }

  Lint.prototype.testElement = function(tag) {
    if (isDeprecatedElement(tag)) {
      this.log.push(
        'Found <span class="deprecated-element">deprecated</span> <strong><code>&lt;' +
          tag + '&gt;</code></strong> element'
      );
    }
    else if (isPresentationalElement(tag)) {
      this.log.push(
        'Found <span class="presentational-element">presentational</span> <strong><code>&lt;' +
          tag + '&gt;</code></strong> element'
      );
    }
    else {
      this.checkRepeatingElement(tag);
    }
  };

  Lint.prototype.checkRepeatingElement = function(tag) {
    if (tag === 'br' && this._lastElement === 'br') {
      this._isElementRepeated = true;
    }
    else if (this._isElementRepeated) {
      this._reportRepeatingElement();
      this._isElementRepeated = false;
    }
    this._lastElement = tag;
  };

  Lint.prototype._reportRepeatingElement = function() {
    this.log.push('Found <code>&lt;br></code> sequence. Try replacing it with styling.');
  };

  Lint.prototype.testAttribute = function(tag, attrName, attrValue) {
    if (isEventAttribute(attrName)) {
      this.log.push(
        'Found <span class="event-attribute">event attribute</span> (<strong>' +
        attrName + '</strong>) on <strong><code>&lt;' + tag + '&gt;</code></strong> element.'
      );
    }
    else if (isDeprecatedAttribute(tag, attrName)) {
      this.log.push(
        'Found <span class="deprecated-attribute">deprecated</span> <strong>' +
          attrName + '</strong> attribute on <strong><code>&lt;' + tag + '&gt;</code></strong> element.'
      );
    }
    else if (isStyleAttribute(attrName)) {
      this.log.push(
        'Found <span class="style-attribute">style attribute</span> on <strong><code>&lt;' +
          tag + '&gt;</code></strong> element.'
      );
    }
    else if (isInaccessibleAttribute(attrName, attrValue)) {
      this.log.push(
        'Found <span class="inaccessible-attribute">inaccessible attribute</span> ' +
          '(on <strong><code>&lt;' + tag + '&gt;</code></strong> element).'
      );
    }
  };

  Lint.prototype.testChars = function(chars) {
    this._lastElement = '';
    if (/(&nbsp;\s*){2,}/.test(chars)) {
      this.log.push('Found repeating <strong><code>&amp;nbsp;</code></strong> sequence. Try replacing it with styling.');
    }
  };

  Lint.prototype.test = function(tag, attrName, attrValue) {
    this.testElement(tag);
    this.testAttribute(tag, attrName, attrValue);
  };

  Lint.prototype.populate = function(writeToElement) {
    if (this._isElementRepeated) {
      this._reportRepeatingElement();
    }

    if (this.log.length) {
      if (writeToElement) {
        writeToElement.innerHTML = '<ol><li>' + this.log.join('<li>') + '</ol>';
      }
      else {
        var output = ' - ' +
          this.log.join('\n - ')
          .replace(/(<([^>]+)>)/ig, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        console.log(output);
      }
    }
  };

  global.HTMLLint = Lint;

})(typeof exports === 'undefined' ? this : exports);
