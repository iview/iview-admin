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
import routers from "@/router/routers";
import config from "@/config";
import {
  dynamicRouterAdd, // 加载路由菜单，从localStorage拿到路由，在创建路由时使用
  routerDataHanding, // 遍历后台返回的路由数据，转为路由基础数据
  filterAsyncRouter // 遍历路由基础数据，转换为前端组件对象
} from "@/libs/router-util";

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
    homeRoute: getHomeRoute(routers, homeName),
    local: localRead("local"),
    errorList: [],
    hasReadErrorPage: false
  },
  getters: {
    menuList: (state, getters, rootState) =>
      getMenuByRouter(routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
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
    // 获取动态路由数据
    getRouters({ dispatch, commit, rootState }, routes) {
      return new Promise((resolve, reject) => {
        var gotRouter = []; // 设置动态路由
        if (localRead("dynamicRouter") === "") {
          /* localStorage里dynamicRouter值为空 -> 没有路由数据 -> 获取路由数据 */
          console.log("获取路由：从api");
          // if (!isMock) {
          //   // 接口数据
          try {
            getAllMenus(rootState.user.token)
              .then(res => {
                // console.log(res);
                var routerData = routerDataHanding(res.data.data); // 拿到路由接口数据
                localSave("dynamicRouter", JSON.stringify(routerData)); // 存储routerData到localStorage
                gotRouter = filterAsyncRouter(routerData); // 过滤路由,路由组件转换
                // dispatch("updateMenuList", gotRouter).then(res => {
                resolve(routerData);
                // });
              })
              .catch(err => {
                reject(err);
              });
          } catch (error) {
            reject(error);
          }
          // } else {
          //   /* mock数据 */
          //   // 1.根据用户角色，处理该角色的路由数据
          //   var menus = [];
          //   rootState.user.access.forEach(_access => {
          //     // 把该用户所有的角色对应的菜单都加进来
          //     menus = menus.concat(
          //       getValueByKey(roleList, "id", _access.id, "menus")
          //     );
          //   });
          //   menus = [...new Set(menus)]; // 然后去重
          //   // console.log(menus); // 获取该用户所有角色的所有菜单数据
          //   // 2.拿到路由模拟动态数据，与该角色处理后的数据做比对筛选
          //   var routerData = menuList.filter(menu => {
          //     return menus.some(
          //       _menu => _menu.id === menu.id // 根据id全等筛选数据
          //     );
          //   });
          //   routerData = routerDataHanding(
          //     JSON.parse(JSON.stringify(routerData))
          //   );
          //   // console.log(routerData);
          //   // 3.处理后路由数据生成路由和菜单等
          //   localSave("dynamicRouter", JSON.stringify(routerData)); // 存储routerData到localStorage
          //   gotRouter = filterAsyncRouter(routerData); // 过滤路由,路由组件转换
          //   dispatch("updateMenuList", gotRouter).then(res => {
          //     resolve(routerData);
          //   });
          // }
        } else {
          /* 有路由数据 -> 直接从localStorage里面获取 */
          console.log("获取路由：从localStorage");
          gotRouter = dynamicRouterAdd("router-util.js");
          commit("setMenuList", {
            menuList: gotRouter,
            access: rootState.user.access
          });
          resolve(routerData);
        }
      });
    }
  }
};
