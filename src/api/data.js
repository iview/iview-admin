import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}
export const getPageTableData = ({ index, size }) => {
  debugger
  const data = {
    index,
    size
  }
  return axios.request({
    url: 'get_page_table_data',
    data,
    method: 'get'
  })
}
