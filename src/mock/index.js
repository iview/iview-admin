import Mock from "mockjs";
import { login, logout, getUserInfo } from "./login";
import { getTableData, getDragList, getAllMenus } from "./data";

// 登录相关和获取用户信息
Mock.mock(/\/login/, login);
Mock.mock(/\/get_info/, getUserInfo);
Mock.mock(/\/logout/, logout);
Mock.mock(/\/get_table_data/, getTableData);
Mock.mock(/\/get_drag_list/, getDragList);
Mock.mock(/\/get_all_menus/, getAllMenus);
Mock.mock(/\/save_error_logger/, "success");

export default Mock;
