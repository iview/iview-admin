import Cookies from 'js-cookie'
// cookie保存的天数
import cookieExpires from '_conf/app/basic'

const TOKEN_KEY = 'token'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: ''
  },
  mutations: {
    handleLogin (state, {userName, userId, token, avator}) {
      if (token) {
        Cookies.set(TOKEN_KEY, token, {expires: cookieExpires})
      }
      state.userName = userName
      state.userId = userId
      state.avator = avator
    }
  }
}
