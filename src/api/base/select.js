import axios from '@/libs/api.request'


export const getSelects=(params)=>{
  return axios.request({
    url: '/select/selects',
    method: 'get',
    params:params
  })
}
export const getSelect=(id)=>{
  return axios.request({
    url: '/select/'+id,
    method: 'get',
  })
}
export const delSelect=(id)=>{
  return axios.request({
    url: '/select/delete/'+id,
    method: 'get',
  })
}
export const saveSelect=(data)=>{
  return axios.request({
    url: '/select/addOrUpdate',
    method: 'post',
    data:data
  })
}


