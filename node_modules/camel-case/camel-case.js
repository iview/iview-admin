var upperCase = require('upper-case')
var sentenceCase = require('sentence-case')

/**
 * Camel case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale, mergeNumbers) {
  var result = sentenceCase(string, locale)

  // Replace periods between numeric entities with an underscore.
  if (!mergeNumbers) {
    result = result.replace(/(\d) (?=\d)/g, '$1_')
  }

  // Replace spaces between words with an upper cased character.
  return result.replace(/ (.)/g, function (m, $1) {
    return upperCase($1, locale)
  })
}
