import store from "@/store";

const USER_MAP = {
  super_admin: {
    name: "super_admin",
    user_id: "1",
    access: ["super_admin"],
    token: "super_admin",
    avator: "https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png"
  },
  visitor: {
    name: "visitor",
    user_id: "2",
    access: ["visitor"],
    token: "visitor",
    avator: "https://avatars0.githubusercontent.com/u/20942571?s=460&v=4"
  }
};

// 用户登录
export const login = req => {
  req = JSON.parse(req.body);
  if (USER_MAP[req.userName] !== undefined) {
    return {
      status: 200,
      message: "成功！",
      token: USER_MAP[req.userName].token
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
