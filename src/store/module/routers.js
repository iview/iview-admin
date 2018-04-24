import { getRouterReq } from '@/api/routers'
import { handleRouter } from '@/libs/util'
export default {
  namespaced: true,
  state: {
    routerList: []
  },
  getters: {
    menuList: state => handleRouter(state.routerList)
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
