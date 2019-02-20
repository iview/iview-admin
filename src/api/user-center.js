import axios from '@/libs/api.request'

// const Qs = require('qs')

export const cloudLogin = ({ userName, password }) => {
  const data = {
    username: userName,
    password: password,
    grant_type: 'password',
    scope: 'all'
  }
  return axios.request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': 'Basic YmluZzoxMjM='
    },
    params: data,
    method: 'post'
  })
}

export const getCloudUserInfoNew = () => {
  return axios.request({
    url: '/admin/sys/user/getInfo',
    params: {},
    method: 'get'
  })
}
