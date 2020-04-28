# iview-dynamicRouter

iview-admin，后端动态生成路由模板

userName：super_admin / visitor

password：any / any


1.axios加工改造，使其更符合后端的回文格式：

libs > axios.js

mock > login.js

store > user.js

view > login.vue


2.mock数据、mock接口：

mock - role.js，新建菜单列表、菜单层级列表，这里以我在实际项目中后端给到的数据结构为例

菜单列表：

菜单层级列表：


注册mock事件不过多陈述：

mock > data getAllMenus
mock > index getAllMenus
api > data getAllMenus


3.动态获取路由数据，并对数据进行处理：

store > app.js

libs > router-util.js 3个封装方法

libs > tools.js 函数: 引入组件

store > user.js 退出登录时清空路由和标签缓存


4.路由改造

router > router.js

router > index.js

view > login.vue 登录后，调用app.js的方法，生成动态路由


进入/回到login页面 -> 路由初始化，清空动态添加的路由

每次登录 -> 后端生成所有动态路由数据，数据存储到localStorage -> 处理后挂载到路由，并生成左侧菜单

每次刷新 -> 从localStorage获取路由，处理后生成左侧菜单


5.前端控制权限

mock - role.js，新建角色列表、菜单列表、菜单层级列表，这里以我在实际项目中后端给到的数据结构为例

角色列表：

菜单列表：

菜单层级列表：

对应关系图

5.github部署：

router > index.js，取消history模式

部署后的css文件 > static > fonts > 把外面的fonts放进去


6.扩展：

项目需求万千，万变不离其宗。以下两种情况我已做好demo并集成到项目中

追加顶部3级菜单：https://github.com/simon9124/fengfeng

动态角色“首页”：
