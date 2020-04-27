// 角色列表
const roleList = [
  {
    name: "super_admin",
    title: "超级管理员",
    menus: [],
    id: "1"
  },
  {
    name: "visitor",
    title: "访客",
    menus: [],
    id: "2"
  }
];

// 菜单列表
const menuList = [
  {
    id: "a4a49ff8874044dfbd90c06544be165b",
    name: "home",
    title: "首页概览",
    url: "/home",
    path: "single-page/home/home",
    sort: 30,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "",
    ico: "md-home",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "3976b690e56b48639e108ac6d6ca622b",
    name: "control-leader-shop",
    title: "驾驶舱",
    url: "control-leader-shop",
    path: "6inspector/control",
    sort: 25,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "驾驶舱-车间（管理员或车间主管）",
    ico: "md-laptop",
    isOutSide: false,
    showLevel: 1
  },
  {
    id: "ef93f8fe1b154de688bcbaab1a2a88ef",
    name: "task",
    title: "任务管理",
    url: "task",
    path: "",
    sort: 15,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "",
    ico: "md-shuffle",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "8502de35df2c4d19ad337c5548f661b4",
    name: "sopMessage/message",
    title: "查看SOP",
    url: "sopMessage/message",
    path: "8taskManage/sopMessage",
    sort: 13,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "",
    ico: "md-document",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "2",
    name: "account",
    title: "账号管理",
    url: "account",
    path: "3manage/account",
    sort: 13,
    parenetId: "d30bf0ff035c4e51875e7014ad46e1af",
    parenetPath: "root.d30bf0ff035c4e51875e7014ad46e1af",
    status: 1,
    description: "系统账号管理",
    ico: null,
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "3",
    name: "role",
    title: "角色管理",
    url: "role",
    path: "3manage/role",
    sort: 12,
    parenetId: "d30bf0ff035c4e51875e7014ad46e1af",
    parenetPath: "root.d30bf0ff035c4e51875e7014ad46e1af",
    status: 1,
    description: "系统角色管理",
    ico: null,
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "23001d1a12fe43ceac9769ee08f899f2",
    name: "menu",
    title: "菜单管理",
    url: "menu",
    path: "3manage/menu",
    sort: 11,
    parenetId: "d30bf0ff035c4e51875e7014ad46e1af",
    parenetPath: "root.d30bf0ff035c4e51875e7014ad46e1af",
    status: 1,
    description: "",
    ico: null,
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "c64f399d2c03445dbfa2b23c240e2dc6",
    name: "number/print",
    title: "条码打印",
    url: "number/print",
    path: "3manage/number",
    sort: 11,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "",
    ico: "md-print",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "013ad32e79c44427a8cad340fb056821",
    name: "report",
    title: "报表中心",
    url: "report",
    path: "",
    sort: 3,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "",
    ico: "md-analytics",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "6b2d3c49373946989262e586d655dccf",
    name: "mould",
    title: "模板配置",
    url: "mould",
    path: "3manage/mould/index",
    sort: 3,
    parenetId: "013ad32e79c44427a8cad340fb056821",
    parenetPath: "root.013ad32e79c44427a8cad340fb056821",
    status: 1,
    description: "",
    ico: "",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "3db9fdd0ada749dab01149fa0248eb23",
    name: "distribute",
    title: "任务派发",
    url: "distribute",
    path: "8taskManage/taskDistribution",
    sort: 2,
    parenetId: "ef93f8fe1b154de688bcbaab1a2a88ef",
    parenetPath: "root.ef93f8fe1b154de688bcbaab1a2a88ef",
    status: 1,
    description: "",
    ico: "",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "d30bf0ff035c4e51875e7014ad46e1af",
    name: "manage",
    title: "管理中心",
    url: "manage",
    path: "",
    sort: 2,
    parenetId: "root",
    parenetPath: "root",
    status: 1,
    description: "系统基础配置",
    ico: "md-settings",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "82814bef61934f5aadb4e1e84608f414",
    name: "view",
    title: "异常产品报表",
    url: "view/12",
    path: "3manage/mould/reportView",
    sort: 1,
    parenetId: "013ad32e79c44427a8cad340fb056821",
    parenetPath: "root.013ad32e79c44427a8cad340fb056821",
    status: 1,
    description: "",
    ico: "",
    isOutSide: false,
    showLevel: 3
  },
  {
    id: "e7dfaf2ec6aa482c93410d9b4e2323e5",
    name: "history",
    title: "历史任务",
    url: "history",
    path: "8taskManage/taskHistory",
    sort: 1,
    parenetId: "ef93f8fe1b154de688bcbaab1a2a88ef",
    parenetPath: "root.ef93f8fe1b154de688bcbaab1a2a88ef",
    status: 1,
    description: "",
    ico: "",
    isOutSide: false,
    showLevel: 3
  }
];

// 菜单层级
const menuLevel = [
  {
    label: "菜单显示该页面选项，页面不含菜单栏不含面包屑",
    value: "1"
  },
  {
    label: "菜单显示该页面选项，页面含菜单栏但不含面包屑",
    value: "2"
  },
  {
    label: "菜单显示该页面选项，页面含菜单栏和面包屑",
    value: "3"
  },
  {
    label: "菜单隐藏该页面选项，页面不含菜单栏不含面包屑",
    value: "4"
  }
];

export { roleList, menuList, menuLevel };
