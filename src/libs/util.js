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

export const getMenuByRouter = list => {
  let res = []
  forEach(list, (item) => {
    if (!item.hideInMenu) {
      let obj = {
        icon: item.meta.icon,
        name: item.name
      }
      if (item.children && item.children.length !== 0) {
        obj.children = getMenuByRouter(item.children)
      }
      res.push(obj)
    }
  })
  return res
}
