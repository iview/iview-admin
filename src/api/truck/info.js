import axios from '@/libs/api.request'


export const getTrucks=(params)=>{
  return axios.request({
    url: '/truck/trucks',
    method: 'get',
    params:params
  })
}
export const saveTruck=(data)=>{
  return axios.request({
    url: '/truck/save',
    method: 'post',
    data:data
  })
}
export const getTruck=(id)=>{
  return axios.request({
    url: '/truck/'+id,
    method: 'get',
  })
}
export const delTruck=(id)=>{
  return axios.request({
    url: '/truck/delete/'+id,
    method: 'get',
  })
}


