import axios from '@/libs/api.request'


export const getTrucks=(params)=>{
  return axios.request({
    url: '/truck/trucks',
    method: 'get',
    params:params
  })
}


