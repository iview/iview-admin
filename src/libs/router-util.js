import { localRead } from "@/libs/util";
import { lazyLoadingCop } from "@/libs/tools";
import Main from "@/components/main"; // Main 是架构组件，不在后台返回，在文件里单独引入
import parentView from "@/components/parent-view"; // parentView 是二级架构组件，不在后台返回，在文件里单独引入

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = from => {
  let data = localRead("dynamicRouter");
  let dynamicRouter = data !== "" ? filterAsyncRouter(JSON.parse(data)) : [];
  console.log(`动态路由数据：${from}`, dynamicRouter);
  return dynamicRouter;
};

// @函数：遍历后台传来的路由数据，转为路由基础数据
export const routerDataHanding = apiRouterData => {
  const asyncRouterMap = [];

  // 外层节点
  apiRouterData.forEach(route => {
    if (route.parenetId === "root") {
      // console.log(route);
      if (route.path === "") {
        // 有子节点的父级路由（模块，非页面）
        asyncRouterMap.push({
          path: route.url === "/" ? route.url : "/" + route.url,
          name: route.name,
          component: "Main",
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true,
            id: route.id // 根据id确定子组件
          },
          children: []
        });
      } else if (parseInt(route.showLevel) === 3) {
        // 无子节点，菜单显示该页面选项，页面含菜单栏和面包屑 -> 根据url和name创建父子结构的路由
        asyncRouterMap.push({
          path: "/" + route.url.split("/")[0],
          name: route.name.split("/")[0],
          component: "Main",
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true
          },
          children: [
            {
              path: route.url
                .split("/")
                .filter((val, index) => {
                  return index !== 0;
                })
                .join("/"),
              name: route.name
                .split("/")
                .filter((val, index) => {
                  return index !== 0;
                })
                .join("/"),
              meta: {
                icon: route.ico,
                title: route.title
              },
              component: route.path,
              children: []
            }
          ]
        });
      } else if (parseInt(route.showLevel) === 1) {
        // 无子节点，菜单显示该页面选项，页面不含菜单栏不含面包屑 -> 根节点路由，与main组件平级
        asyncRouterMap.push({
          path: "/" + route.url,
          name: route.name,
          component: route.path,
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true
          },
          children: []
        });
      } else if (parseInt(route.showLevel) === 4) {
        // 无子节点，菜单隐藏该页面选项，页面不含菜单栏不含面包屑 -> 根节点路由，与main组件平级
        asyncRouterMap.push({
          path: "/" + route.url,
          name: route.name,
          component: route.path,
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true,
            hideInMenu: true
          },
          children: []
        });
      }
    }
  });

  // console.log(asyncRouterMap);

  // 内层子路由 - 递归
  const handleRecurrence = recurrenceData => {
    recurrenceData.forEach(data => {
      apiRouterData.forEach(route => {
        if (data.meta.id === route.parenetId) {
          data.children.push({
            path: route.url,
            name: route.name,
            meta: {
              icon: data.meta.icon,
              title: route.title
            },
            component: route.path,
            children: []
          });
        }
      });
      // console.log(data);
      handleRecurrence(data.children);
    });
  };
  handleRecurrence(asyncRouterMap);

  // 首页重定向：处理name，追加 redirect 和 notCache
  asyncRouterMap.forEach(route => {
    if (route.path === "/") {
      // home 页 -> 重定向为home
      route.meta.notCache = true;
      route.children[0].meta.notCache = true;
      route.children[0].name = "_" + route.name;
      route.redirect = route.path + route.children[0].path;
    } else if (route.children.length !== 0) {
      // 非 home 页且有子组件 -> 重定向为第一个子组件
      route.redirect = route.path + "/" + route.children[0].path;
    }
  });
  return asyncRouterMap;
};

// @函数: 遍历路由基础数据，转换为前端组件对象
export const filterAsyncRouter = asyncRouterMap => {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "Main") {
        route.component = Main; // Main组件特殊处理
      } else if (route.component === "parentView") {
        route.component = parentView; // parentView组件特殊处理
      } else {
        route.component = lazyLoadingCop(route.component);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children); // 子组件递归
    }
    return true;
  });
  // console.log(accessedRouters);
  return accessedRouters;
};
