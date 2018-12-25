import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: '/sys/permission/getRouter',
    params: {
      access
    },
    method: 'get'
  })
}
