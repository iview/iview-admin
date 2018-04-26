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
  forEach(list, (item) => {
    if (!(item.meta && item.meta.hideInMenu)) {
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
    if (!hasChild(item)) obj.to = item.path
    return obj
  })
  res = res.filter(item => {
    console.log(item)
    return !item.meta.hideInMenu
  })
  console.log(res)
  return [{
    name: 'home',
    to: '/home'
  }, ...res]
}
