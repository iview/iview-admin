import { login, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  namespaced: true,
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken()
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    }
  },
  actions: {
    handleLogin ({ commit }, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          const data = res.data
          setToken(data.token)
          commit('setAvator', data.avator)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          commit('setAvator', data.avator)
          commit('setUserName', data.user_name)
          commit('setUserId', data.user_id)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
