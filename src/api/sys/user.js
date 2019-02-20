import axios from '@/libs/api.request'

export const getUserList = (data) => {
  return axios.request({
    url: '/admin/sys/user/list',
    data: data,
    method: 'POST'
  })
}

export const apiAddUser = (data) => {
  return axios.request({
    url: '/admin/sys/user',
    data: data,
    method: 'POST'
  })
}

export const apiUpdateUser = (data) => {
  return axios.request({
    url: '/admin/sys/user',
    data: data,
    method: 'PUT'
  })
}

export const apiUserRolesInfo = (id) => {
  return axios.request({
    url: `/admin/sys/user/userRolesInfo/${id}`,
    method: 'GET'
  })
}

export const apiDeleteUser = (data) => {
  return axios.request({
    url: '/admin/sys/user/' + data,
    method: 'DELETE'
  })
}
