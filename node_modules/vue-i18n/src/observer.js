/**
 * Observer
 */

let Watcher
/**
 * getWatcher
 *
 * @param {Vue} vm
 * @return {Watcher}
 */

export function getWatcher (vm) {
  if (!Watcher) {
    const unwatch = vm.$watch('__watcher__', a => {})
    Watcher = vm._watchers[0].constructor
    unwatch()
  }
  return Watcher
}

let Dep
/**
 * getDep
 *
 * @param {Vue} vm
 * @return {Dep}
 */

export function getDep (vm) {
  if (!Dep && vm && vm._data && vm._data.__ob__ && vm._data.__ob__.dep) {
    Dep = vm._data.__ob__.dep.constructor
  }
  return Dep
}
