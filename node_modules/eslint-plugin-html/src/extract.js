"use strict";

var htmlparser = require("htmlparser2");

function parseIndentDescriptor(indentDescriptor) {
  var match = /^(\+)?(tab|\d+)$/.exec(indentDescriptor);

  if (!match) {
    return { relative: false, spaces: "auto" };
  }

  return {
    relative: match[1] === "+",
    spaces: match[2] === "tab" ? "\t" : Array(Number(match[2]) + 1).join(" "),
  };

}

function iterateScripts(code, options, onScript) {
  var index = 0;
  var currentScript = null;
  var cdataSize = 0;

  var parser = new htmlparser.Parser({

    onopentag: function (name, attrs) {
      // Test if current tag is a valid <script> tag.
      if (name !== "script") {
        return;
      }

      if (attrs.type && !/^(application|text)\/(x-)?(javascript|babel|ecmascript-6)$/i.test(attrs.type)) {
        return;
      }

      currentScript = "";
    },

    oncdatastart: function () {
      cdataSize += 12; // CDATA sections adds a 12 characters overhead (<![CDATA[]]>)
    },

    onclosetag: function (name) {
      if (name !== "script" || currentScript === null) {
        return;
      }

      onScript(code.slice(index, parser.startIndex - currentScript.length - cdataSize), currentScript);

      index = parser.startIndex;
      currentScript = null;
    },

    ontext: function (data) {
      if (currentScript === null) {
        return;
      }

      currentScript += data;
    },

  }, {
    xmlMode: options.xmlMode === true,
  });

  parser.parseComplete(code);
}


function extract(code, options) {

  var indentDescriptor = parseIndentDescriptor(options && options.indent);
  var reportBadIndentation = options && options.reportBadIndent;
  var xmlMode = options && options.xmlMode;
  var resultCode = "";
  var map = [];
  var lineNumber = 1;
  var badIndentationLines = [];

  iterateScripts(code, {
    xmlMode: xmlMode,
  }, function (previousCode, scriptCode) {

    // Mark that we're inside a <script> a tag and push all new lines
    // in between the last </script> tag and this <script> tag to preserve
    // location information.
    var newLines = previousCode.match(/\r\n|\n|\r/g);
    if (newLines) {
      resultCode += newLines.map(function (newLine) {
        return "//eslint-disable-line" + newLine
      }).join("");
      lineNumber += newLines.length;
      map[lineNumber] = previousCode.match(/[^\n\r]*$/)[0].length;
    }

    var currentScriptIndent = previousCode.match(/([^\n\r]*)<[^<]*$/)[1];

    var indent;
    if (indentDescriptor.spaces === "auto") {
      var indentMatch = /[\n\r]+([ \t]*)/.exec(scriptCode);
      indent = indentMatch ? indentMatch[1] : "";
    }
    else {
      indent = indentDescriptor.spaces;
      if (indentDescriptor.relative) {
        indent = currentScriptIndent + indent;
      }
    }

    var hadNonEmptyLine = false;
    resultCode += scriptCode
      .replace(/(\r\n|\n|\r)([ \t]*)(.*)/g, function (_, newLineChar, lineIndent, lineText) {
        lineNumber += 1;

        var isNonEmptyLine = Boolean(lineText);
        var isFirstNonEmptyLine = isNonEmptyLine && !hadNonEmptyLine;

        var badIndentation =
          // Be stricter on the first line
          isFirstNonEmptyLine ?
            indent !== lineIndent :
            lineIndent.indexOf(indent) !== 0;

        if (badIndentation) {
          // Don't report line if the line is empty
          if (reportBadIndentation && isNonEmptyLine) {
            badIndentationLines.push(lineNumber);
          }
          map[lineNumber] = 0;
        }
        else {
          // Dedent code
          lineIndent = lineIndent.slice(indent.length);
          map[lineNumber] = indent.length;
        }

        if (isNonEmptyLine) {
          hadNonEmptyLine = true;
        }

        return newLineChar + lineIndent + lineText;
      })
      .replace(/[ \t]*$/, "");  // Remove spaces on the last line
  });

  return {
    map: map,
    code: resultCode,
    badIndentationLines: badIndentationLines,
  };
}

module.exports = extract;
