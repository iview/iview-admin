var Promise = require('bluebird');
var fs = require('fs');
var os = require('os');
var path = require('path');
var semver = require('semver');
var util = require('util');
var whenReadFile = Promise.promisify(fs.readFile);

var iniparser = require('./lib/ini');
var minimatch = require('./lib/fnmatch');
var pkg = require('./package.json');

var knownProps = [
  'end_of_line',
  'indent_style',
  'indent_size',
  'insert_final_newline',
  'trim_trailing_whitespace',
  'charset'
].reduce(function (set, prop) {
  set[prop] = true;
  return set;
}, {});

function fnmatch(filepath, glob) {
  var matchOptions = {matchBase: true, dot: true, noext: true};
  glob = glob.replace(/\*\*/g, '{*,**/**/**}');
  return minimatch(filepath, glob, matchOptions);
}

function getConfigFileNames(filepath, options) {
  var paths = [];
  do {
    filepath = path.dirname(filepath);
    paths.push(path.join(filepath, options.config));
  } while (filepath !== options.root);
  return paths;
}

function getFilepathRoot(filepath) {
  if (path.parse !== undefined) {
    // Node.js >= 0.11.15
    return path.parse(filepath).root;
  }
  if (os.platform() === 'win32') {
    return path.resolve(filepath).match(/^(\\\\[^\\]+\\)?[^\\]+\\/)[0];
  }
  return '/';
}

function processMatches(matches, version) {
  // Set indent_size to "tab" if indent_size is unspecified and
  // indent_style is set to "tab".
  if ("indent_style" in matches && matches.indent_style === "tab" &&
    !("indent_size" in matches) && semver.gte(version, "0.10.0")) {
    matches.indent_size = "tab";
  }

  // Set tab_width to indent_size if indent_size is specified and
  // tab_width is unspecified
  if ("indent_size" in matches && !("tab_width" in matches) &&
  matches.indent_size !== "tab")
    matches.tab_width = matches.indent_size;

  // Set indent_size to tab_width if indent_size is "tab"
  if("indent_size" in matches && "tab_width" in matches &&
  matches.indent_size === "tab")
    matches.indent_size = matches.tab_width;

  return matches;
}

function processOptions(options, filepath) {
  options = options || {};
  return {
    config: options.config || '.editorconfig',
    version: options.version || pkg.version,
    root: path.resolve(options.root || getFilepathRoot(filepath))
  };
}

function buildFullGlob(pathPrefix, glob) {
  switch (glob.indexOf('/')) {
    case -1: glob = "**/" + glob; break;
    case  0: glob = glob.substring(1); break;
  }
  return path.join(pathPrefix, glob);
}

function extendProps(props, options) {
  for (var key in options) {
    var value = options[key];
    key = key.toLowerCase();
    if (knownProps[key]) {
      value = value.toLowerCase();
    }
    try {
      value = JSON.parse(value);
    } catch(e) {}
    if (typeof value === 'undefined' || value === null) {
      // null and undefined are values specific to JSON (no special meaning
      // in editorconfig) & should just be returned as regular strings.
      value = String(value);
    }
    props[key] = value;
  }
  return props;
}

function parseFromFiles(filepath, files, options) {
  return getConfigsForFiles(files).then(function (configs) {
    return configs.reverse();
  }).reduce(function (matches, file) {
    var pathPrefix = path.dirname(file.name);
    file.contents.forEach(function (section) {
      var glob = section[0], options = section[1];
      if (!glob) return;
      var fullGlob = buildFullGlob(pathPrefix, glob);
      if (!fnmatch(filepath, fullGlob)) return;
      matches = extendProps(matches, options);
    });
    return matches;
  }, {}).then(function (matches) {
    return processMatches(matches, options.version);
  });
}

function parseFromFilesSync(filepath, files, options) {
  var configs = getConfigsForFilesSync(files);
  configs.reverse();
  var matches = {};
  configs.forEach(function(config) {
    var pathPrefix = path.dirname(config.name);
    config.contents.forEach(function(section) {
      var glob = section[0], options = section[1];
      if (!glob) return;
      var fullGlob = buildFullGlob(pathPrefix, glob);
      if (!fnmatch(filepath, fullGlob)) return;
      matches = extendProps(matches, options);
    });
  });
  return processMatches(matches, options.version);
}

function StopReduce(array) {
  this.array = array;
}

StopReduce.prototype = Object.create(Error.prototype);

function getConfigsForFiles(files) {
  return Promise.reduce(files, function (configs, file) {
    var contents = iniparser.parseString(file.contents);
    configs.push({
      name: file.name,
      contents: contents
    });
    if ((contents[0][1].root || '').toLowerCase() === 'true') {
      return Promise.reject(new StopReduce(configs));
    }
    return configs;
  }, []).catch(StopReduce, function (stop) {
    return stop.array;
  });
}

function getConfigsForFilesSync(files) {
  var configs = [];
  for (var i in files) {
    var file = files[i];
    var contents = iniparser.parseString(file.contents);
    configs.push({
      name: file.name,
      contents: contents
    });
    if ((contents[0][1].root || '').toLowerCase() === 'true') {
      break;
    }
  };
  return configs;
}

function readConfigFiles(filepaths) {
  return Promise.map(filepaths, function (path) {
    return whenReadFile(path, 'utf-8').catch(function () {
      return '';
    }).then(function (contents) {
      return {name: path, contents: contents};
    });
  });
}

function readConfigFilesSync(filepaths) {
  var files = [];
  var file;
  filepaths.forEach(function(filepath) {
    try {
      file = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
      file = '';
    }
    files.push({name: filepath, contents: file});
  });
  return files;
}

module.exports.parseFromFiles = function (filepath, files, options) {
  return new Promise (function (resolve, reject) {
    filepath = path.resolve(filepath);
    options = processOptions(options, filepath);
    resolve(parseFromFiles(filepath, files, options));
  });
};

module.exports.parseFromFilesSync = function (filepath, files, options) {
  filepath = path.resolve(filepath);
  options = processOptions(options, filepath);
  return parseFromFilesSync(filepath, files, options);
};

module.exports.parse = function (filepath, options) {
  return new Promise (function (resolve, reject) {
    filepath = path.resolve(filepath);
    options = processOptions(options, filepath);
    var filepaths = getConfigFileNames(filepath, options);
    var files = readConfigFiles(filepaths);
    resolve(parseFromFiles(filepath, files, options));
  });
};

module.exports.parseSync = function (filepath, options) {
    filepath = path.resolve(filepath);
    options = processOptions(options, filepath);
    var filepaths = getConfigFileNames(filepath, options);
    var files = readConfigFilesSync(filepaths);
    return parseFromFilesSync(filepath, files, options);
};
