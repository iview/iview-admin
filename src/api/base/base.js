import axios from '@/libs/api.request'


export const getCurrentLoginUser=()=>{
  return axios.request({
    url: '/sys/loginUser',
    method: 'get',
  })
}
export const getCurrentLoginRes=()=>{
  return axios.request({
    url: '/sys/loginRes',
    method: 'get',
  })
}



