import { getRouterReq } from '@/api/routers'
import { getMenuByRouter, getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'
export default {
  namespaced: true,
  state: {
    routerList: [],
    homeRoute: getHomeRoute(routers)
  },
  getters: {
    menuList: state => getMenuByRouter(routers)
  },
  mutations: {
    setRouter (state, routerList) {
      state.routerList = routerList
    }
  },
  actions: {
    getRouter ({ commit, state, rootState }) {
      const token = rootState.user.token
      return new Promise((resolve, reject) => {
        if (token) {
          getRouterReq().then(res => {
            commit('setRouter', res.data.router)
            resolve()
          }).catch(err => {
            reject(err)
          })
        }
      })
    }
  }
}
