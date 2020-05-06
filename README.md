<p align="center">
    <a href="https://www.iviewui.com">
        <img width="200" src="https://file.iviewui.com/logo-new.svg">
    </a>
</p>

# iview-dynamicRouter

<a href="https://github.com/iview/iview-admin/tree/template"><img src="https://img.shields.io/badge/iview--admin-template-brightgreen"></a>

基于<a href="https://github.com/iview/iview-admin" target="_blank">iview-admin(branch:template)</a>，动态获取路由数据，经数据处理后生成动态路由和菜单的【后端动态路由模板】。

## 在线预览

- <a href="https://simon9124.github.io/iview-dynamicRouter" target="_blank">Live Demo</a>
- userName：super_admin / visitor
- password：any / any
- 在控制台可查看【当前路由】和【左侧菜单】:
<img src="https://mmbiz.qpic.cn/mmbiz_png/Tlm6c1DNgXQMvtNjibjXM4hxUhrRpicuaRaHw2ibHmia0ZPvCkfia5ckocfK1w4CJwejVEJ95d4A54UzZI3hnEge6sA/0?wx_fmt=png">


# 开发文档（更新中）

## axios加工改造

axios加工改造，使其更符合后端的回文格式：

libs > axios.js

mock > login.js

store > user.js

view > login.vue


## mock数据、mock接口：

mock - role.js，新建菜单列表、菜单层级列表，这里以我在实际项目中后端给到的数据结构为例

菜单列表：

菜单层级列表：


注册mock事件不过多陈述：

mock > data getAllMenus
mock > index getAllMenus
api > data getAllMenus


## 动态获取路由数据，并对数据进行处理：

store > app.js

libs > router-util.js 4个封装方法

libs > tools.js 函数: 引入组件

libs > dataHanding.js 追加通用方法

store > user.js 退出登录时清空路由和标签缓存


## 路由改造

router > router.js

router > index.js

view > login.vue 登录后，调用app.js的方法，生成动态路由


进入/回到login页面 -> 路由初始化，清空动态添加的路由

每次登录 -> 后端生成所有动态路由数据，数据存储到localStorage -> 处理后挂载到路由，并生成左侧菜单

每次刷新 -> 从localStorage获取路由，处理后生成左侧菜单


## 前端控制权限

实际开发中，后台会提供“根据用户查询菜单（getAllMenus）”的接口，返回的数据已经是该用户的菜单，因此当前步骤仅针对前端控制权限。

本项目中，一个用户对应多个角色，一个角色对应多个菜单，在用户管理界面给用户绑定角色，在角色管理界面给角色绑定菜单。伙伴们需根据自身项目中【用户、角色、菜单】3者的关系及具体页面逻辑，来解决菜单的权限控制。

mock - role.js，新建角色列表，这里仍以我在实际项目中后端给到的数据结构为例

角色列表：

store > app.js 对路由数据进行用户权限处理


## github部署：

router > index.js，取消history模式

部署后的css文件 > static > fonts > 把外面的fonts放进去


## 扩展：

项目需求万千，万变不离其宗。以下两种情况我已做好demo并集成到项目中

追加顶部3级菜单：https://github.com/simon9124/fengfeng

动态角色“首页”：
