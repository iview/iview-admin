import axios from '@/libs/api.request'


export const getTrucks=(params)=>{
  return axios.request({
    url: '/sys/orgs',
    method: 'get',
    params:params
  })
}


