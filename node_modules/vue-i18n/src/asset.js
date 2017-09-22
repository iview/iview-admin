import warn from './warn'

export default function (Vue, langVM) {
  /**
   * Register or retrieve a global locale definition.
   *
   * @param {String} id
   * @param {Object | Function | Promise} definition
   * @param {Function} cb
   */

  Vue.locale = (id, definition, cb) => {
    if (definition === undefined) { // getter
      return langVM.locales[id]
    } else { // setter
      if (definition === null) {
        langVM.locales[id] = undefined
        delete langVM.locales[id]
      } else {
        setLocale(id, definition, locale => {
          if (locale) {
            langVM.$set(langVM.locales, id, locale)
          } else {
            warn('failed set `' + id + '` locale')
          }
          cb && cb()
        })
      }
    }
  }
}


function setLocale (id, definition, cb) {
  if (typeof definition === 'object') { // sync
    cb(definition)
  } else {
    const future = definition.call(this)
    if (typeof future === 'function') {
      if (future.resolved) {
        // cached
        cb(future.resolved)
      } else if (future.requested) {
        // pool callbacks
        future.pendingCallbacks.push(cb)
      } else {
        future.requested = true
        const cbs = future.pendingCallbacks = [cb]
        future(locale => { // resolve
          future.resolved = locale
          for (let i = 0, l = cbs.length; i < l; i++) {
            cbs[i](locale)
          }
        }, () => { // reject
          cb()
        })
      }
    } else if (isPromise(future)) { // promise
      future.then(locale => { // resolve
        cb(locale)
      }, () => { // reject
        cb()
      }).catch(err => {
        console.error(err)
        cb()
      })
    }
  }
}

/**
 * Forgiving check for a promise
 *
 * @param {Object} p
 * @return {Boolean}
 */

function isPromise (p) {
  return p && typeof p.then === 'function'
}
