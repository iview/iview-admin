import axios from '@/libs/api.request'

export const login1 = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return axios.request({
    url: '/sys/login',
    data,
    method: 'post'
  })
}
export const isLogin=()=>{
  return axios.request({
    url: '/sys/isLogin',
    method: 'get'
  })
}
export const addUser=(data)=>{
  return axios.request({
    url: '/sys/add/user',
    method: 'post',
    data:data
  })
}
export const updateUser=(data)=>{
  return axios.request({
    url: '/sys/update/user',
    method: 'post',
    data:data
  })
}
export const deleteUser=(id)=>{
  return axios.request({
    url: '/sys/user/delete/'+id,
    method: 'get',
  })
}
export const isExist=(username)=>{
  return axios.request({
    url: '/sys/checkUsername',
    params:{username:username},
    method: 'get'
  })
}
export const getAllUser= query =>{
  return axios.request({
    url: '/sys/users',
    params:query,
    method: 'get'
  })
}
export const getUser= id =>{
  return axios.request({
    url: '/sys/user/'+id,
    method: 'get'
  })
}
export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: '/sys/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/sys/loginUser',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
