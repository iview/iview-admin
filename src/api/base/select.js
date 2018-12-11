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

export const getOptions=(params)=>{
  return axios.request({
    url: '/select/options',
    method: 'get',
    params:params
  })
}
export const getOption=(id)=>{
  return axios.request({
    url: '/select/option/'+id,
    method: 'get',
  })
}
export const getOptionTree=(code)=>{
  return axios.request({
    url: '/select/option/tree',
    method: 'get',
    params:{code:code}
  })
}
export const getOptionTreeSelect=(code)=>{
  return axios.request({
    url: '/select/option/tree/select',
    method: 'get',
    params:{code:code}
  })
}
export const delOption=(id)=>{
  return axios.request({
    url: '/select/delete/option/'+id,
    method: 'get',
  })
}
export const saveOption=(data)=>{
  return axios.request({
    url: '/select/option/addOrUpdate',
    method: 'post',
    data:data
  })
}


