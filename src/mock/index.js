import Mock from "mockjs";
import { login, logout, getUserInfo } from "./login";
import {
  getTableData,
  getDragList,
  getUserList,
  getRoleList,
  getAllMenus
} from "./data";

// 登录相关和获取用户信息
Mock.mock(/\/login/, login);
Mock.mock(/\/get_info/, getUserInfo);
Mock.mock(/\/logout/, logout);
Mock.mock(/\/get_table_data/, getTableData);
Mock.mock(/\/get_drag_list/, getDragList);
Mock.mock(/\/get_user_list/, getUserList);
Mock.mock(/\/get_role_list/, getRoleList);
Mock.mock(/\/get_all_menus/, getAllMenus);
Mock.mock(/\/save_error_logger/, "success");

export default Mock;
