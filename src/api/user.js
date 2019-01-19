import axios from '@/libs/api.request'
import qs from 'query-string'

export const login = ({ userName, password }) => {
  const data = qs.stringify({
    account: userName,
    password: password
  })
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    // headers: {
    //   'Authorization': token
    // },
    method: 'get'
  })
}
