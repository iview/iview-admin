import { localRead } from "@/libs/util";
import { lazyLoadingCop } from "@/libs/tools";
import { arraySort } from "@/libs/dataHanding"; // 对象数组根据key排序
import Main from "@/components/main"; // 架构组件
import parentView from "@/components/parent-view"; // 二级架构组件
import Vue from "vue";

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = from => {
  let data = localRead("dynamicRouter-template");
  let dynamicRouter = data !== "" ? filterAsyncRouter(JSON.parse(data)) : [];
  console.log(`动态路由数据：${from}`, dynamicRouter);
  return dynamicRouter;
};

// @函数：遍历后台传来的路由数据，转为路由基础数据
export const routerDataHanding = apiRouterData => {
  const asyncRouterMap = [];

  // 外层节点
  apiRouterData.forEach(route => {
    if (route.parentId === "root") {
      if (route.isOutSide === true) {
        // 外链，菜单显示该页面选项， -> 根据url创建外链路由
        asyncRouterMap.push({
          path: route.path,
          name: route.name,
          meta: {
            icon: route.ico,
            title: route.title,
            href: route.url,
            id: route.id // 根据id确定子组件
          },
          sort: route.sort, // 排序用
          children: []
        });
      } else if (route.path === "Main") {
        // 非外链，有子节点的父级路由（模块，非页面）-> 创建父结构路由
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
          sort: route.sort, // 排序用
          children: []
        });
      } else if (parseInt(route.showLevel) === 2) {
        // 非外链，无子节点，页面含菜单栏，菜单显示该页面选项 -> 创建父子结构路由
        asyncRouterMap.push({
          path: "/" + route.url.split("/")[0],
          name: route.name.split("/")[0],
          component: "Main",
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true,
            id: route.id
          },
          sort: route.sort, // 排序用
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
                title: route.title,
                id: `_${route.id}`
              },
              component: route.path,
              children: []
            }
          ]
        });
      } else {
        // 非外链，无子节点，页面不含菜单栏 -> 根节点路由，与main组件平级
        // 根节点路由最后再挂载，因为需要做菜单数据处理
        asyncRouterMap.push({
          path: "/" + route.url,
          name: route.name,
          component: route.path,
          meta: {
            icon: route.ico,
            title: route.title,
            hideInBread: true,
            hideInMenu: parseInt(route.showLevel) !== 1, // true or false 菜单是否隐藏该页面选项,
            id: route.id // 根据id确定子组件
          },
          sort: route.sort, // 排序用
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
        if (data.meta.id === route.parentId) {
          if (route.isOutSide === true) {
            // 外链 -> 根据url创建外链路由
            data.children.push({
              path: route.path,
              name: route.name,
              meta: {
                icon: route.ico,
                title: route.title,
                href: route.url,
                id: route.id // 根据id确定子组件
              },
              sort: route.sort, // 排序用
              children: []
            });
          } else if (parseInt(route.showLevel) === 2) {
            // 非外链，页面含菜单栏，菜单显示该页面选项 -> 创建子路由
            data.children.push({
              path: route.url,
              name: route.name,
              component: route.path,
              meta: {
                icon: route.ico,
                title: route.title,
                id: route.id // 根据id确定子组件
              },
              sort: route.sort, // 排序用
              children: []
            });
          } else {
            // 非外链，页面不含菜单栏，菜单显示该页面选项 -> 根节点路由，与main组件平级（暂时为根菜单）
            // 在app.js里调用menuListHanding方法，将原本不是根菜单的数据重新挂载到相应位置
            //  根节点路由最后再挂载，因为需要做菜单数据处理
            asyncRouterMap.push({
              path: "/" + route.url,
              name: route.name,
              component: route.path,
              meta: {
                icon: route.ico,
                title: route.title,
                hideInBread: true,
                hideInMenu: parseInt(route.showLevel) !== 1, // true or false 菜单是否隐藏该页面选项
                parentId: route.parentId, // 特殊处理：此类需要处理菜单的数据均追加parentId
                id: route.id
              },
              sort: route.sort, // 排序用
              children: []
            });
          }
        }
      });
      // console.log(data);
      handleRecurrence(data.children);
    });
  };
  handleRecurrence(asyncRouterMap);

  // 处理重定向
  asyncRouterMap.forEach(route => {
    if (route.children.length !== 0) {
      // 非 home 页且有子组件 -> 重定向为第一个子组件
      route.redirect = route.path + "/" + route.children[0].path;
    }
  });
  return asyncRouterMap;
};

// @函数：遍历菜单数据，将"原本不应挂载在根菜单"的数据，重新挂载到相应位置
export const menuListHanding = (menuArray, menuList) => {
  menuList.forEach((menu, i) => {
    menuArray.forEach(data => {
      // 1.有meta里有parentId且parentId与另一个meta里的id相同 -> copy并删除parentId键 -> 将copy塞入meta
      if (
        data.meta.parentId !== undefined &&
        menu.meta.id === data.meta.parentId
      ) {
        var dataCopy = JSON.parse(JSON.stringify(data));
        Vue.delete(dataCopy.meta, "parentId");
        menu.children.push(dataCopy);
      }
      // 2.删除剩余的meta里有parentId的数据
      if (menu.meta.parentId !== undefined) {
        menuList.splice(i, 1);
      }
    });
    menuListHanding(menuArray, menu.children);
  });
  /* 排序一定最后再做，因为根节点路由(要从menuList删除)是最后挂载的 */
  menuList.sort(arraySort("sort", "desc")); // 根据sort排序，后端排序可忽略
  return menuList;
};

// @函数: 遍历路由基础数据，转换为前端组件对象
export const filterAsyncRouter = asyncRouterMap => {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "Main") {
        route.component = Main; // Main组件特殊处理
      } else if (route.component === "parentView") {
        route.component = parentView; // parentView组件特殊处理
        route.meta.hideInBread = true; // 还有子路由因此不显示在面包屑
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

/**
 * @函数: 遍历routes路由数据
 * 1.手动往router.options.routes里添加数据
 * 2.如routes里的name有变化，手动修改router.options.routes的name
 */
export const routerUpdateHandle = (routes, router) => {
  // 遍历routes
  routes.forEach(_route => {
    /* 手动往router.options.routes里添加数据 */
    // 1.最外层有没添加的直接添加
    if (
      !router.options.routes.some(_router => _router.meta.id === _route.meta.id)
    ) {
      router.options.routes.push(_route);
    }
    // 2.内层路由递归添加
    const routerChildAddHandle = (array1, child2) => {
      // 遍历array1
      array1.forEach(child1 => {
        // 找到path一致的数据
        if (child1.meta.id === child2.meta.id) {
          // 遍历child2.children
          child2.children.forEach(_child2 => {
            // 比对child1.children -> 有没添加的直接添加
            if (
              !child1.children.some(
                _child1 => _child1.meta.id === _child2.meta.id
              )
            ) {
              child1.children.push(_child2);
            }
            // 递归
            routerChildAddHandle(child1.children, _child2);
          });
        }
      });
    };
    routerChildAddHandle(router.options.routes, _route);

    /* 如routes里的name有变化，手动修改router.options.routes的name */
    // 递归更新
    const routerChildChangeName = (array1, child2) => {
      array1.forEach(child1 => {
        if (child2.meta.id === child1.meta.id && child2.name !== child1.name) {
          child1.name = child2.name;
        }
        child2.children.forEach(_child2 => {
          child1.children && routerChildChangeName(child1.children, _child2);
        });
      });
    };
    routerChildChangeName(router.options.routes, _route);
  });
};
