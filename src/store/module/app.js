import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from "@/libs/util";
import beforeClose from "@/router/before-close";
import {
  saveErrorLogger,
  getAllMenus // 获取当前用户的全部菜单
} from "@/api/data";
import router from "@/router";
// import routers from "@/router/routers";
import config from "@/config";
import {
  dynamicRouterAdd, // 加载路由菜单，从localStorage拿到路由，在创建路由时使用
  routerDataHanding, // 遍历后台返回的路由数据，转为路由基础数据
  filterAsyncRouter, // 遍历路由基础数据，转换为前端组件对象
  menuListHanding, // 遍历菜单数据，将"原本不应挂载在根菜单"的数据，重新挂载到相应位置
  routerUpdateHandle // 遍历routes路由数据，1.手动往router.options.routes里添加数据；2.如routes里的name有变化，手动修改router.options.routes的name
} from "@/libs/router-util";
import { getValueByKey } from "@/libs/dataHanding"; // 根据对象数组某个key的value，查询另一个key的value
import { roleList } from "@/mock/role"; // mockData - 角色列表

const { homeName } = config;
const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    // homeRoute: getHomeRoute(routers, homeName),
    homeRoute: {},
    local: localRead("local"),
    errorList: [],
    hasReadErrorPage: false,
    menuList: [] // 菜单数据
  },
  getters: {
    menuList: (state, getters, rootState) =>
      // getMenuByRouter(routers, rootState.user.access),
      getMenuByRouter(dynamicRouterAdd("app.js"), rootState.user.access), // 根据路由加载菜单(仅mock时用)
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    // 配置主页route
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavListFromLocalstorage() || [];
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
      let homeTagIndex = tagList.findIndex(item => item.name === homeName);
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      if (
        route.meta &&
        route.meta.beforeCloseName &&
        route.meta.beforeCloseName in beforeClose
      ) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route);
          }
        });
      } else {
        closePage(state, route);
      }
    },
    addTag(state, { route, type = "unshift" }) {
      let router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === "push") state.tagNavList.push(router);
        else {
          if (router.name === homeName) state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setLocal(state, lang) {
      localSave("local", lang);
      state.local = lang;
    },
    addError(state, error) {
      state.errorList.push(error);
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status;
    },
    // 根据路由和权限，生成左侧菜单
    setMenuList(state, data) {
      state.menuList = getMenuByRouter(data.menuList, data.access);
    }
  },
  actions: {
    addErrorLog({ commit, rootState }, info) {
      if (!window.location.href.includes("error_logger_page")) {
        commit("setHasReadErrorLoggerStatus", false);
      }
      const {
        user: { token, userId, userName }
      } = rootState;
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      };
      saveErrorLogger(info).then(() => {
        commit("addError", data);
      });
    },
    // 动态路由数据 -> 首次登录挂载路由
    updateMenuList({ commit, rootState }, routes) {
      // 动态菜单数据
      var menuList = JSON.parse(JSON.stringify(routes));
      // 路由数据处理：将"菜单显示该页面选项，页面不含菜单栏"重新挂载到根路由上
      menuListHanding(menuList, menuList);
      console.log("动态添加路由：", routes);
      console.log("左侧动态菜单：", menuList);
      // 动态添加路由 - 真正添加路由（不会立刻刷新，需要手动往router.options.routes里添加数据）
      router.addRoutes(routes);
      // 手动添加路由数据
      routerUpdateHandle(routes, router);
      // 动态渲染菜单数据
      commit("setMenuList", {
        menuList: menuList,
        access: rootState.user.access
      });
    },
    // 获取动态路由数据
    getRouters({ dispatch, commit, rootState }, routes) {
      return new Promise((resolve, reject) => {
        var gotRouter = []; // 设置动态路由
        if (localRead("dynamicRouter-template") === "") {
          /* localStorage里dynamicRouter值为空 -> 没有路由数据 -> 获取路由数据 */
          console.log("获取路由：从api");
          try {
            getAllMenus(rootState.user.token)
              .then(res => {
                // console.log(res);
                /* 1.拿到路由接口数据 */
                var routerData = res.data.data;
                // console.log(routerData);
                /* 2.根据用户角色，处理该角色的路由数据（后端生成数据时忽略此步骤） */
                var menus = [];
                rootState.user.access.forEach(_access => {
                  // 把该用户所有的角色对应的菜单都加进来
                  menus = menus.concat(
                    getValueByKey(roleList, "name", _access, "menus")
                  );
                });
                menus = [...new Set(menus)]; // 然后去重
                // console.log(menus); // 获取该用户所有角色的所有菜单
                /* 3.将路由动态数据与该角色拥有的菜单做比对筛选（后端生成数据时忽略此步骤） */
                routerData = routerData.filter(menu => {
                  return menus.some(_menu => _menu === menu.id); // 根据id全等筛选数据
                });
                // console.log(routerData); // 筛选出该角色拥有的路由数据
                routerData = routerDataHanding(
                  JSON.parse(JSON.stringify(routerData))
                );
                /* 4.处理后路由数据生成路由和菜单等 */
                localSave("dynamicRouter-template", JSON.stringify(routerData)); // 存储routerData到localStorage
                gotRouter = filterAsyncRouter(routerData); // 过滤路由,路由组件转换
                dispatch("updateMenuList", gotRouter).then(res => {
                  resolve(routerData);
                });
              })
              .catch(err => {
                reject(err);
              });
          } catch (error) {
            reject(error);
          }
        } else {
          /* 有路由数据 -> 直接从localStorage里面获取 */
          console.log("获取路由：从localStorage");
          gotRouter = dynamicRouterAdd("router-util.js");
          menuListHanding(gotRouter, gotRouter);
          console.log("左侧动态菜单：", gotRouter);
          commit("setMenuList", {
            menuList: gotRouter,
            access: rootState.user.access
          });
          resolve();
        }
      });
    }
  }
};
