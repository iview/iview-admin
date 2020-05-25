import axios from "@/libs/api.request";

export const getTableData = () => {
  return axios.request({
    url: "get_table_data",
    method: "get"
  });
};

export const getDragList = () => {
  return axios.request({
    url: "get_drag_list",
    method: "get"
  });
};

export const errorReq = () => {
  return axios.request({
    url: "error_url",
    method: "post"
  });
};

export const saveErrorLogger = info => {
  return axios.request({
    url: "save_error_logger",
    data: info,
    method: "post"
  });
};

// 获取用户数据
export const getUserList = () => {
  return axios.request({ url: "get_user_list", method: "get" });
};

// 获取角色数据
export const getRoleList = () => {
  return axios.request({ url: "get_role_list", method: "get" });
};

// 获取菜单数据
export const getAllMenus = token => {
  return axios.request({ url: "get_all_menus", method: "get" });
};
