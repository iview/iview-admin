// Based on iniparser by shockie <https://npmjs.org/package/iniparser>

/*
 * get the file handler
 */
var fs = require('fs');

/*
 * define the possible values:
 * section: [section]
 * param: key=value
 * comment: ;this is a comment
 */
var regex = {
  section: /^\s*\[(([^#;]|\\#|\\;)+)\]\s*([#;].*)?$/,
  param: /^\s*([\w\.\-\_]+)\s*[=:]\s*(.*?)\s*([#;].*)?$/,
  comment: /^\s*[#;].*$/
};

/*
 * parses a .ini file
 * @param: {String} file, the location of the .ini file
 * @param: {Function} callback, the function that will be called when parsing is done
 * @return: none
 */
exports.parse = function (file, callback) {
  if (!callback) {
    return;
  }
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, parse(data));
    }
  });
};

exports.parseSync = function (file) {
  return parse(fs.readFileSync(file, 'utf8'));
};

exports.parseString = function (data) {
  var sectionBody = {};
  var sectionName = null;
  var value = [[sectionName, sectionBody]];
  var lines = data.split(/\r\n|\r|\n/);
  lines.forEach(function (line) {
    var match;
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      match = line.match(regex.param);
      sectionBody[match[1]] = match[2];
    } else if (regex.section.test(line)) {
      match = line.match(regex.section);
      sectionName = match[1];
      sectionBody = {};
      value.push([sectionName, sectionBody]);
    }
  });
  return value;
};
