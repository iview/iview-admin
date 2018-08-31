import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, routeHasExist } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: ''
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, { route, type = 'unshift' }) {
      state.tagNavList = getTagNavListFromLocalstorage()
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') {
          const tagIndex = state.tagNavList.findIndex(v => v.name === route.name)
          if (tagIndex && state.tagNavList[tagIndex]) {
            const isParamsOrQuery = ['params', 'query'].some(v => state.tagNavList[tagIndex][v])
            if (!isParamsOrQuery) {
              state.tagNavList.splice(tagIndex, 1, route)
            } else state.tagNavList.push(route)
          } else {
            state.tagNavList.push(route)
          }
        } else {
          if (route.name === 'home') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    }
  }
}
