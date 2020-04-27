import Mock from "mockjs";
import { doCustomTimes } from "@/libs/util";
import { menuList } from "./role"; // 菜单列表
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

// 获取菜单列表
export const getAllMenus = req => {
  return { status: 200, message: "成功！", data: menuList };
};
