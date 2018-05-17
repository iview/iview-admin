import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach } from '@/libs/tools'

const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {expires: config.cookieExpires || 1})
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

export const getMenuByRouter = list => {
  let res = []
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (hasChild(item)) {
        obj.children = getMenuByRouter(item.children)
      }
      res.push(obj)
    }
  })
  return res
}

export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    name: 'home',
    to: '/home'
  }, ...res]
}

export const showTitle = (item, vm) => vm.$config.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)

export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}

export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  return homeRoute
}

export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {Boolean} status 状态true/false
 * @description 这里只是为了演示，实际应该将锁定状态的设置和获取用接口来实现
 */
export const setLockStatus = (status) => {
  localStorage.isLocked = status
}
export const getLockStatus = () => {
  return localStorage.isLocked
}
