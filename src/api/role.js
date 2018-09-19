import axios from '@/libs/api.request'

export const getRoleList = (data) => {
  return axios.request({
    url: 'admin/sys/role/list',
    data: data,
    method: 'post'
  })
}
