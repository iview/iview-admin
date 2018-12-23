import axios from '@/libs/api.request'


export const getCarousels=(params)=>{
  return axios.request({
    url: '/carousel/carousels',
    method: 'get',
    params:params
  })
}
export const saveCarousel=(data)=>{
  return axios.request({
    url: '/carousel/addOrUpdate',
    method: 'post',
    data:data
  })
}
export const getCarousel=(id)=>{
  return axios.request({
    url: '/carousel/'+id,
    method: 'get',
  })
}
export const delCarousel=(id)=>{
  return axios.request({
    url: '/carousel/delete/'+id,
    method: 'get',
  })
}


