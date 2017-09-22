import warn from './warn'
import Format from './format'
import Path from './path'
import { isNil, isObject, bind } from './util'

/**
 * extend
 *
 * @param {Vue} Vue
 * @return {Vue}
 */

export default function (Vue) {
  const format = Format(Vue)
  const getValue = Path(Vue)

  function parseArgs (...args) {
    let lang = Vue.config.lang
    const fallback = Vue.config.fallbackLang

    if (args.length === 1) {
      if (isObject(args[0]) || Array.isArray(args[0])) {
        args = args[0]
      } else if (typeof args[0] === 'string') {
        lang = args[0]
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        lang = args[0]
      }
      if (isObject(args[1]) || Array.isArray(args[1])) {
        args = args[1]
      }
    }

    return { lang, fallback, params: args }
  }

  function exist (locale, key) {
    if (!locale || !key) { return false }
    return !isNil(getValue(locale, key))
  }

  function interpolate (locale, key, args) {
    if (!locale) { return null }

    let val = getValue(locale, key)
    if (Array.isArray(val)) { return val }
    if (isNil(val)) { val = locale[key] }
    if (isNil(val)) { return null }
    if (typeof val !== 'string') { warn("Value of key '" + key + "' is not a string!"); return null }

    // Check for the existance of links within the translated string
    if (val.indexOf('@:') >= 0) {
      // Match all the links within the local
      // We are going to replace each of
      // them with its translation
      const matches = val.match(/(@:[\w|.]+)/g)
      for (const idx in matches) {
        const link = matches[idx]
        // Remove the leading @:
        const linkPlaceholder = link.substr(2)
        // Translate the link
        const translatedstring = interpolate(locale, linkPlaceholder, args)
        // Replace the link with the translated string
        val = val.replace(link, translatedstring)
      }
    }

    return !args
      ? val
      : Vue.config.i18nFormatter
        ? Vue.config.i18nFormatter.apply(null, [val].concat(args))
        : format(val, args)
  }

  function translate (getter, lang, fallback, key, params) {
    let res = null
    res = interpolate(getter(lang), key, params)
    if (!isNil(res)) { return res }

    res = interpolate(getter(fallback), key, params)
    if (!isNil(res)) {
      if (process.env.NODE_ENV !== 'production') {
        warn('Fall back to translate the keypath "' + key + '" with "' +
          fallback + '" language.')
      }
      return res
    } else {
      return null
    }
  }


  function warnDefault (lang, key, vm, result) {
    if (!isNil(result)) { return result }
    if (Vue.config.missingHandler) {
      Vue.config.missingHandler.apply(null, [lang, key, vm])
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn('Cannot translate the value of keypath "' + key + '". ' +
          'Use the value of keypath as default')
      }
    }
    return key
  }

  function getAssetLocale (lang) {
    return Vue.locale(lang)
  }

  function getComponentLocale (lang) {
    return this.$options.locales[lang]
  }

  function getOldChoiceIndexFixed (choice) {
    return choice ? choice > 1 ? 1 : 0 : 1
  }

  function getChoiceIndex (choice, choicesLength) {
    choice = Math.abs(choice)

    if (choicesLength === 2) { return getOldChoiceIndexFixed(choice) }

    return choice ? Math.min(choice, 2) : 0
  }

  function fetchChoice (locale, choice) {
    if (!locale && typeof locale !== 'string') { return null }
    const choices = locale.split('|')

    choice = getChoiceIndex(choice, choices.length)
    if (!choices[choice]) { return locale }
    return choices[choice].trim()
  }

  /**
   * Vue.t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.t = (key, ...args) => {
    if (!key) { return '' }
    const { lang, fallback, params } = parseArgs(...args)
    return warnDefault(lang, key, null, translate(getAssetLocale, lang, fallback, key, params))
  }

  /**
   * Vue.tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.tc = (key, choice, ...args) => {
    return fetchChoice(Vue.t(key, ...args), choice)
  }

  /**
   * Vue.te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   */

  Vue.te = (key, ...args) => {
    const { lang } = parseArgs(...args)
    return exist(getAssetLocale(lang), key)
  }

  /**
   * $t
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$t = function (key, ...args) {
    if (!key) { return '' }
    const { lang, fallback, params } = parseArgs(...args)
    let res = null
    if (this.$options.locales) {
      res = translate(
        bind(getComponentLocale, this), lang, fallback, key, params
      )
      if (res) { return res }
    }
    return warnDefault(lang, key, this, translate(getAssetLocale, lang, fallback, key, params))
  }

  /**
   * $tc
   *
   * @param {String} key
   * @param {number|undefined} choice
   * @param {Array} ...args
   * @return {String}
   */

  Vue.prototype.$tc = function (key, choice, ...args) {
    if (typeof choice !== 'number' && typeof choice !== 'undefined') {
      return key
    }
    return fetchChoice(this.$t(key, ...args), choice)
  }

  /**
   * $te
   *
   * @param {String} key
   * @param {Array} ...args
   * @return {Boolean}
   *
   */

  Vue.prototype.$te = function (key, ...args) {
    const { lang } = parseArgs(...args)
    let found = false
    if (this.$options.locales) { // exist component locale
      found = exist(bind(getComponentLocale)(lang), key)
    }
    if (!found) {
      found = exist(getAssetLocale(lang), key)
    }
    return found
  }

  Vue.mixin({
    computed: {
      $lang () {
        return Vue.config.lang
      }
    }
  })

  return Vue
}
