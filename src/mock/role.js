// 用户列表
const userList = [
  {
    user_id: "1",
    name: "super_admin",
    displayName: "孙悟空",
    phone: "13888888881",
    access: ["super_admin", "visitor"],
    avator: "https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png"
  },
  {
    user_id: "2",
    name: "visitor",
    displayName: "特兰克斯",
    phone: "13888888882",
    access: ["visitor"],
    avator: "https://avatars0.githubusercontent.com/u/20942571?s=460&v=4"
  }
];

// 角色列表
const roleList = [
  {
    name: "super_admin",
    title: "超级管理员",
    menus: [
      "doc",
      "control",
      "multilevel",
      "level_2_1",
      "level_2_2",
      "level_2_2_1",
      "screen2",
      "level_2_2_2",
      "level_2_3",
      "screen",
      "github",
      "singleMenu",
      "authority",
      "userManage",
      "roleManage",
      "menuManage"
    ],
    id: "1"
  },
  {
    name: "visitor",
    title: "访客",
    menus: [
      "control",
      "multilevel",
      "level_2_1",
      "level_2_2",
      "level_2_2_1",
      "level_2_2_2",
      "level_2_3",
      "screen",
      "singleMenu"
    ],
    id: "2"
  }
];

/** menuList路由列表
 * isOutSide：是否为外链
 * showLevel：路由层级，详见menuLevel路由层级列表
 * path：前端组件路径（父组件为空）
 */

// 路由层级
const menuLevel = [
  {
    label: "菜单显示该页面选项，页面不含菜单栏",
    value: "1"
  },
  {
    label: "菜单显示该页面选项，页面含菜单栏",
    value: "2"
  },
  {
    label: "菜单隐藏该页面选项，页面不含菜单栏",
    value: "3"
  }
];

// 路由列表
const menuList = [
  {
    id: "doc",
    name: "doc",
    title: "文档",
    url: "https://simon9124.github.io/iview-dynamicRouter-doc/",
    path: "",
    sort: 28,
    parentId: "root",
    ico: "ios-book",
    isOutSide: true,
    showLevel: 1
  },
  {
    id: "control",
    name: "control",
    title: "驾驶舱",
    url: "control",
    path: "screen",
    sort: 26,
    parentId: "root",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: 1
  },
  {
    id: "multilevel",
    name: "multilevel",
    title: "多级菜单",
    url: "multilevel",
    path: "Main",
    sort: 24,
    parentId: "root",
    ico: "md-menu",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "level_2_1",
    name: "level_2_1",
    title: "二级-1",
    url: "level_2_1",
    path: "template",
    sort: 10,
    parentId: "multilevel",
    ico: "md-funnel",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "level_2_2",
    name: "level_2_2",
    title: "二级-2",
    url: "level_2_2",
    path: "parentView",
    sort: 8,
    parentId: "multilevel",
    ico: "md-funnel",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "level_2_2_1",
    name: "level_2_2_1",
    title: "三级-1",
    url: "level_2_2_1",
    path: "template",
    sort: 10,
    parentId: "level_2_2",
    ico: "md-funnel",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "screen2",
    name: "screen2",
    title: "三级大屏",
    url: "screen2",
    path: "screen",
    sort: 8,
    parentId: "level_2_2",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: 1
  },
  {
    id: "level_2_2_2",
    name: "level_2_2_2",
    title: "三级-2",
    url: "level_2_2_2",
    path: "template",
    sort: 6,
    parentId: "level_2_2",
    ico: "md-funnel",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "level_2_3",
    name: "level_2_3",
    title: "二级-3",
    url: "level_2_3",
    path: "template",
    sort: 6,
    parentId: "multilevel",
    ico: "md-funnel",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "screen",
    name: "screen",
    title: "二级大屏",
    url: "screen",
    path: "screen",
    sort: 4,
    parentId: "multilevel",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: 1
  },
  {
    id: "github",
    name: "github",
    title: "github",
    url: "https://github.com/simon9124/iview-dynamicRouter",
    path: "",
    sort: 2,
    parentId: "multilevel",
    ico: "md-log-in",
    isOutSide: true,
    showLevel: 1
  },
  {
    id: "singleMenu",
    name: "single/menu",
    title: "单极菜单",
    url: "single/menu",
    path: "template",
    sort: 22,
    parentId: "root",
    ico: "md-document",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "authority",
    name: "authority",
    title: "权限管理",
    url: "authority",
    path: "Main",
    sort: 20,
    parentId: "root",
    ico: "md-settings",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "userManage",
    name: "userManage",
    title: "用户管理",
    url: "userManage",
    path: "authority/user",
    sort: 10,
    parentId: "authority",
    ico: "",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "roleManage",
    name: "roleManage",
    title: "角色管理",
    url: "roleManage",
    path: "authority/role",
    sort: 8,
    parentId: "authority",
    ico: "",
    isOutSide: false,
    showLevel: 2
  },
  {
    id: "menuManage",
    name: "menuManage",
    title: "菜单管理",
    url: "menuManage",
    path: "authority/menu",
    sort: 6,
    parentId: "authority",
    ico: "",
    isOutSide: false,
    showLevel: 2
  }
];

export { userList, roleList, menuList, menuLevel };
