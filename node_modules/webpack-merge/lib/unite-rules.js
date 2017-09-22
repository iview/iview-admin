'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isEqual = require('lodash.isequal');
var mergeWith = require('lodash.mergewith');
var unionWith = require('lodash.unionwith');
var differenceWith = require('lodash.differencewith');

var isArray = Array.isArray;

module.exports = function uniteRules(newRule, rule, prepend) {
  if (String(rule.test) !== String(newRule.test) || newRule.enforce && rule.enforce !== newRule.enforce || newRule.include && !isSameValue(rule.include, newRule.include) || newRule.exclude && !isSameValue(rule.exclude, newRule.exclude)) {
    return false;
  }

  // webpack 2 nested rules support
  if (rule.rules) {
    rule.rules = prepend ? [].concat(_toConsumableArray(differenceWith(newRule.rules, rule.rules, function (b, a) {
      return uniteRules(b, a, true);
    })), _toConsumableArray(rule.rules)) : unionWith(rule.rules, newRule.rules, uniteRules);
  }

  // newRule.loader should always override
  if (newRule.loader) {
    var optionsKey = newRule.options ? 'options' : newRule.query && 'query';

    delete rule.use;
    delete rule.loaders;
    rule.loader = newRule.loader;

    if (optionsKey) {
      rule[optionsKey] = newRule[optionsKey];
    }
  } else if ((rule.use || rule.loaders || rule.loader) && (newRule.use || newRule.loaders)) {
    var expandEntry = function expandEntry(loader) {
      return typeof loader === 'string' ? { loader: loader } : loader;
    };
    // this is only here to avoid breaking existing tests
    var unwrapEntry = function unwrapEntry(entry) {
      return !entry.options && !entry.query ? entry.loader : entry;
    };

    var entries = void 0;
    if (rule.loader) {
      var _optionsKey = rule.options ? 'options' : rule.query && 'query';
      entries = [{ loader: rule.loader }];

      if (_optionsKey) {
        entries[0][_optionsKey] = rule[_optionsKey];
      }

      delete rule.loader;

      if (_optionsKey) {
        delete rule[_optionsKey];
      }
    } else {
      entries = [].concat(rule.use || rule.loaders).map(expandEntry);
    }
    var newEntries = [].concat(newRule.use || newRule.loaders).map(expandEntry);

    var loadersKey = rule.use || newRule.use ? 'use' : 'loaders';
    rule[loadersKey] = prepend ? [].concat(_toConsumableArray(differenceWith(newEntries, entries, uniteEntries)), _toConsumableArray(entries)).map(unwrapEntry) : unionWith(entries, newEntries, uniteEntries).map(unwrapEntry);
  }

  if (newRule.include) {
    rule.include = newRule.include;
  }

  if (newRule.exclude) {
    rule.exclude = newRule.exclude;
  }

  return true;
};

/**
 * Check equality of two values using lodash's isEqual
 * Arrays need to be sorted for equality checking
 * but clone them first so as not to disrupt the sort order in tests
 */
function isSameValue(a, b) {
  var _map = [a, b].map(function (value) {
    return isArray(value) ? [].concat(_toConsumableArray(value)).sort() : value;
  }),
      _map2 = _slicedToArray(_map, 2),
      propA = _map2[0],
      propB = _map2[1];

  return isEqual(propA, propB);
}

function uniteEntries(newEntry, entry) {
  var loaderNameRe = /^([^?]+)/ig;

  var _entry$loader$match = entry.loader.match(loaderNameRe),
      _entry$loader$match2 = _slicedToArray(_entry$loader$match, 1),
      loaderName = _entry$loader$match2[0];

  var _newEntry$loader$matc = newEntry.loader.match(loaderNameRe),
      _newEntry$loader$matc2 = _slicedToArray(_newEntry$loader$matc, 1),
      newLoaderName = _newEntry$loader$matc2[0];

  if (loaderName !== newLoaderName) {
    return false;
  }

  // Replace query values with newer ones
  mergeWith(entry, newEntry);
  return true;
}