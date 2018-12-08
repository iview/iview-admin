import axios from '@/libs/api.request'


export const getOrgs=(params)=>{
  return axios.request({
    url: '/sys/orgs',
    method: 'get',
    params:params
  })
}
export const getOrg=(id)=>{
  return axios.request({
    url: '/sys/org/'+id,
    method: 'get',
  })
}
export const delOrg=(id)=>{
  return axios.request({
    url: '/sys/org/delete/'+id,
    method: 'get',
  })
}
export const addOrUpdateOrg=(data)=>{
  return axios.request({
    url: '/sys/org/add',
    method: 'post',
    data:data
  })
}
export const orgTreeIview=(params)=>{
  return axios.request({
    url: '/sys/org/tree/iview',
    method: 'get',
    params:params
  })
}
export const orgTree=(params)=>{
  return axios.request({
    url: '/sys/org/tree/',
    method: 'get',
    params:params
  })
}
export const addOrgUser=(data)=>{
  return axios.request({
    url: '/sys/org/user',
    method: 'post',
    data:data
  })
}
export const delOrgUser=(data)=>{
  return axios.request({
    url: '/sys/org/delete/user',
    method: 'post',
    data:data
  })
}

