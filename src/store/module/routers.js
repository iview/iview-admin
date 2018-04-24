import { getRouterReq } from '@/api/routers'
import { getMenuByRouter } from '@/libs/util'
import routers from '@/router/routers'
export default {
  namespaced: true,
  state: {
    routerList: []
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
