import axios from '@/libs/api.request'


export const getUploads=(params)=>{
  return axios.request({
    url: '/upload/page',
    method: 'get',
    params:params
  })
}
export const getUploadIdsByRef=(id)=>{
  return axios.request({
    url: '/upload/file/type/'+id,
    method: 'get',
  })
}
export const getRefId=(type)=>{
  return axios.request({
    url: '/upload/refId',
    method: 'get',
    params:{"type":type}
  })
}
export const getUpload=(id)=>{
  return axios.request({
    url: '/upload/'+id,
    method: 'get',
  })
}
export const delUpload=(id)=>{
  return axios.request({
    url: '/upload/delete/'+id,
    method: 'get',
  })
}
export const saveUpload=(data)=>{
  return axios.request({
    url: '/upload/addOrUpdate',
    method: 'post',
    data:data
  })
}
