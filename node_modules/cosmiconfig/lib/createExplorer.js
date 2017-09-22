'use strict';

var path = require('path');
var isDir = require('is-directory');
var loadPackageProp = require('./loadPackageProp');
var loadRc = require('./loadRc');
var loadJs = require('./loadJs');
var loadDefinedFile = require('./loadDefinedFile');

module.exports = function (options) {
  // These cache Promises that resolve with results, not the results themselves
  var fileCache = (options.cache) ? new Map() : null;
  var directoryCache = (options.cache) ? new Map() : null;
  var transform = options.transform || identityPromise;

  function clearFileCache() {
    if (fileCache) fileCache.clear();
  }

  function clearDirectoryCache() {
    if (directoryCache) directoryCache.clear();
  }

  function clearCaches() {
    clearFileCache();
    clearDirectoryCache();
  }

  function load(searchPath, configPath) {
    if (!configPath && options.configPath) {
      configPath = options.configPath;
    }

    if (configPath) {
      var absoluteConfigPath = path.resolve(process.cwd(), configPath);
      if (fileCache && fileCache.has(absoluteConfigPath)) {
        return fileCache.get(absoluteConfigPath);
      }
      var result = loadDefinedFile(absoluteConfigPath, options)
        .then(transform);
      if (fileCache) fileCache.set(absoluteConfigPath, result);
      return result;
    }

    if (!searchPath) return Promise.resolve(null);

    var absoluteSearchPath = path.resolve(process.cwd(), searchPath);

    return isDirectory(absoluteSearchPath)
      .then(function (searchPathIsDirectory) {
        var directory = (searchPathIsDirectory)
          ? absoluteSearchPath
          : path.dirname(absoluteSearchPath);
        return searchDirectory(directory);
      });
  }

  function searchDirectory(directory) {
    if (directoryCache && directoryCache.has(directory)) {
      return directoryCache.get(directory);
    }

    var result = Promise.resolve()
      .then(function () {
        if (!options.packageProp) return;
        return loadPackageProp(directory, options);
      })
      .then(function (result) {
        if (result || !options.rc) return result;
        return loadRc(path.join(directory, options.rc), options);
      })
      .then(function (result) {
        if (result || !options.js) return result;
        return loadJs(path.join(directory, options.js));
      })
      .then(function (result) {
        if (result) return result;

        var splitPath = directory.split(path.sep);
        var nextDirectory = (splitPath.length > 1)
          ? splitPath.slice(0, -1).join(path.sep)
          : null;

        if (!nextDirectory || directory === options.stopDir) return null;

        return searchDirectory(nextDirectory);
      })
      .then(transform);

    if (directoryCache) directoryCache.set(directory, result);
    return result;
  }

  return {
    load: load,
    clearFileCache: clearFileCache,
    clearDirectoryCache: clearDirectoryCache,
    clearCaches: clearCaches,
  };
};

function isDirectory(filepath) {
  return new Promise(function (resolve, reject) {
    return isDir(filepath, function (err, dir) {
      if (err) return reject(err);
      return resolve(dir);
    });
  });
}

function identityPromise(x) {
  return Promise.resolve(x);
}
