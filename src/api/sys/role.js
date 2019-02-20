import axios from '@/libs/api.request'

export const apiGetRoleList = (data) => {
  return axios.request({
    url: '/admin/sys/role/list',
    data: data,
    method: 'POST'
  })
}

export const apiAddRole = (data) => {
  return axios.request({
    url: '/admin/sys/role',
    data: data,
    method: 'POST'
  })
}

export const apiUpdateRole = (data) => {
  return axios.request({
    url: '/admin/sys/role',
    data: data,
    method: 'PUT'
  })
}

export const apiDeleteRole = (data) => {
  return axios.request({
    url: '/admin/sys/role/' + data,
    method: 'DELETE'
  })
}

export const apiGetRolePermissionTree = (data) => {
  return axios.request({
    url: '/admin//sys/role/permissionTree/' + data,
    method: 'GET'
  })
}

export const apiUpdateRolePermission = (data) => {
  return axios.request({
    url: '/admin//sys/role/updateRolePermission',
    data: data,
    method: 'POST'
  })
}

export const apiQueryRole = (roleName) => {
  return axios.request({
    url: `/admin/sys/role/queryRole?roleName${roleName}`,
    method: 'GET'
  })
}
