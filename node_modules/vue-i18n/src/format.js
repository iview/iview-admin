import { isNil, hasOwn } from './util'

/**
 *  String format template
 *  - Inspired:
 *    https://github.com/Matt-Esch/string-template/index.js
 */

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g


export default function (Vue) {
  /**
   * template
   *
   * @param {String} string
   * @param {Array} ...args
   * @return {String}
   */

  function template (string, ...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      args = args[0]
    } else {
      args = {}
    }

    if (!args || !args.hasOwnProperty) {
      args = {}
    }

    return string.replace(RE_NARGS, (match, prefix, i, index) => {
      let result

      if (string[index - 1] === '{' &&
        string[index + match.length] === '}') {
        return i
      } else {
        result = hasOwn(args, i) ? args[i] : match
        if (isNil(result)) {
          return ''
        }

        return result
      }
    })
  }

  return template
}
