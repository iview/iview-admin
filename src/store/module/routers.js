import { getRouterReq } from '@/api/routers'
import { getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    canViewRouterList: [],
    homeRoute: getHomeRoute(routers)
  },
  mutations: {
    setRouter (state, canViewRouterList) {
      state.canViewRouterList = canViewRouterList
    }
  },
  actions: {
    getRouter ({ commit, state, rootState }, access) {
      const token = rootState.user.token
      return new Promise((resolve, reject) => {
        if (token) {
          getRouterReq(access).then(res => {
            commit('setRouter', res.data.router)
            resolve(res.data.router)
          }).catch(err => {
            reject(err)
          })
        }
      })
    }
  }
}
