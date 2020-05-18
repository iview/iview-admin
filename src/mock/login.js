import store from "@/store";
import { userList } from "./role"; // mockData - 用户列表

// 用户列表
const USER_MAP = {};
userList.forEach(user => {
  USER_MAP[user.name] = user;
});

// 用户登录
export const login = req => {
  req = JSON.parse(req.body);
  if (USER_MAP[req.userName] !== undefined) {
    return {
      status: 200,
      message: "成功！",
      data: USER_MAP[req.userName].name
    };
  } else {
    return { status: 500, message: "用户名或密码错误！", data: null };
  }
};

// 获取用户信息
export const getUserInfo = req => {
  // console.log(store.state.user.token);
  if (store.state.user.token !== undefined) {
    return {
      status: 200,
      message: "成功！",
      data: USER_MAP[store.state.user.token]
    };
  }
};

export const logout = req => {
  return null;
};
