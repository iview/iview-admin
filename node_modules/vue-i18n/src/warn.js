/**
 * warn
 *
 * @param {String} msg
 * @param {Error} [err]
 *
 */

export default function warn (msg, err) {
  if (window.console) {
    console.warn('[vue-i18n] ' + msg)
    if (err) {
      console.warn(err.stack)
    }
  }
}
