import axios from '@/libs/api.request'

export const addForm = ({data, url}) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}
