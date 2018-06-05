import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData } from './data'

// 登录相关和获取用户信息
Mock.mock(/\/login/, login)
Mock.mock(/\/get_info/, getUserInfo)
Mock.mock(/\/logout/, logout)
Mock.mock(/\/get_table_data/, getTableData)

export default Mock
