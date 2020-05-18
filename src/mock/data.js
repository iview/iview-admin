import Mock from "mockjs";
import { doCustomTimes } from "@/libs/util";
import {
  userList, // 用户列表
  roleList, // 角色列表
  menuList // 菜单列表
} from "./role";
const Random = Mock.Random;

export const getTableData = req => {
  let tableData = [];
  doCustomTimes(5, () => {
    tableData.push(
      Mock.mock({
        name: "@name",
        email: "@email",
        createTime: "@date"
      })
    );
  });
  return tableData;
};

export const getDragList = req => {
  let dragList = [];
  doCustomTimes(5, () => {
    dragList.push(
      Mock.mock({
        name: Random.csentence(10, 13),
        id: Random.increment(10)
      })
    );
  });
  return dragList;
};

// 获取用户列表
export const getUserList = req => {
  return { status: 200, message: "成功！", data: userList };
};

// 获取角色列表
export const getRoleList = req => {
  return { status: 200, message: "成功！", data: roleList };
};

// 获取菜单列表
export const getAllMenus = req => {
  return { status: 200, message: "成功！", data: menuList };
};
