import axios from '@/libs/api.request'

export const apiGetDiscList = (data) => {
  return axios.request({
    url: '/admin/sys/dict/list',
    data: data,
    method: 'POST'
  })
}

export const apiAddDisc = (data) => {
  return axios.request({
    url: '/admin/sys/dict',
    data: data,
    method: 'POST'
  })
}

export const apiUpdateDisc = (data) => {
  return axios.request({
    url: '/admin/sys/dict',
    data: data,
    method: 'PUT'
  })
}

export const apiDeleteDict = (data) => {
  return axios.request({
    url: '/admin/sys/dict/' + data,
    method: 'DELETE'
  })
}
