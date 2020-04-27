# iview-dynamicRouter
iview-admin，后端动态生成路由模板
userName：super_admin / visitor
password：any / any

1.axios加工改造，使其更符合后端的回文格式：
libs > axios.js
mock > login.js
store > user.js
view > login.vue

2.mock数据改造：

mock - role.js，新建用户列表、角色列表、菜单列表、菜单层级列表
对应关系图

3.动态获取路由数据

store > app.js，动态获取路由事件，动态挂载菜单
libs > 
router > 

3.github部署：
router > index.js，取消history模式
部署后的css文件 > static > fonts > 把外面的fonts放进去

4.扩展：
项目需求万千，万变不离其宗。以下两种情况我已做好demo并集成到项目中
追加顶部3级菜单：
动态角色“首页”：
