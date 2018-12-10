import axios from '@/libs/api.request'

export const getPermissionTree = () => {
  return axios.request({
    url: '/sys/permission/getPermissionTree',
    method: 'GET'
  })
}

export const addPermission = (data) => {
  return axios.request({
    url: '/sys/permission',
    data: data,
    method: 'POST'
  })
}

export const updatePermission = (data) => {
  return axios.request({
    url: '/sys/permission',
    data: data,
    method: 'PUT'
  })
}

export const deletePermissions = (data) => {
  return axios.request({
    url: '/sys/permission/' + data,
    method: 'DELETE'
  })
}
