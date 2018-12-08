import axios from '@/libs/api.request'


export const getRess=(params)=>{
  return axios.request({
    url: '/sys/ress',
    method: 'get',
    params:params
  })
}
export const getRes=(id)=>{
  return axios.request({
    url: '/sys/res/'+id,
    method: 'get',
  })
}
export const delRes=(id)=>{
  return axios.request({
    url: '/sys/res/delete/'+id,
    method: 'get',
  })
}
export const addOrUpdateRes=(data)=>{
  return axios.request({
    url: '/sys/res/add',
    method: 'post',
    data:data
  })
}
export const resTree=(params)=>{
  return axios.request({
    url: '/sys/res/tree/iview',
    method: 'get',
    params:params
  })
}

