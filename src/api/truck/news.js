import axios from '@/libs/api.request'


export const getNewss=(params)=>{
  return axios.request({
    url: '/news/page',
    method: 'get',
    params:params
  })
}
export const saveNews=(data)=>{
  return axios.request({
    url: '/news/save',
    method: 'post',
    data:data
  })
}
export const getNews=(id)=>{
  return axios.request({
    url: '/news/'+id,
    method: 'get',
  })
}
export const delNews=(id)=>{
  return axios.request({
    url: '/news/delete/'+id,
    method: 'get',
  })
}
export const getContent=(id)=>{
  return axios.request({
    url: '/news/content/'+id,
    method: 'get',
  })
}


