import axios from '@/libs/api.request'


export const getNotices=(params)=>{
  return axios.request({
    url: '/notice/list',
    method: 'get',
    params:params
  })
}
export const getNotice=(id)=>{
  return axios.request({
    url: '/notice/'+id,
    method: 'get',
  })
}
export const saveNotice=(data)=>{
  return axios.request({
    url: '/notice/addOrUpdate',
    method: 'post',
    data:data
  })
}
export const delNotice=(id)=>{
  return axios.request({
    url: '/notice/delete/'+id,
    method: 'get',
  })
}


