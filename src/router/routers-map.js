const Main = () => import('@/components/main')
const ParentView = () => import('@/components/parent-view')
const Login = () => import('@/view/login/login.vue')
const Home = () => import('@/view/single-page/home')
const Error401 = () => import('@/view/error-page/401.vue')
const Error404 = () => import('@/view/error-page/404.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Markdown = () => import('@/view/components/markdown/markdown.vue')
const Editor = () => import('@/view/components/editor/editor.vue')
const JoinPage = () => import('@/view/join-page.vue')

export const routerMap = {
  Main,
  ParentView,
  Login,
  Home,
  Error401,
  Error404,
  Error500,
  Markdown,
  Editor,
  JoinPage
}

export const staticRouters = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: routerMap['Login']
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: routerMap['Main'],
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: routerMap['Home']
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error401']
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error404']
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: routerMap['Error500']
  },
  {
    path: '/sys',
    name: 'sys',
    meta: {
      icon: 'md-settings',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'user_table_page',
        name: 'user_table_page',
        meta: {
          icon: 'md-contacts',
          title: '用户管理'
        },
        component: () => import('@/view/sys/user/user.vue')
      },
      {
        path: 'permission_table_page',
        name: 'permission_table_page',
        meta: {
          icon: 'md-contacts',
          title: '权限管理'
        },
        component: () => import('@/view/sys/permission/permission.vue')
      },
      {
        path: 'role_table_page',
        name: 'role_table_page',
        meta: {
          icon: 'md-contacts',
          title: '角色管理'
        },
        component: () => import('@/view/sys/role/role.vue')
      },
      {
        path: 'update_paste_page',
        name: 'update_paste_page',
        meta: {
          icon: 'md-clipboard',
          title: '粘贴表格数据'
        },
        component: () => import('@/view/update/update-paste.vue')
      }
    ]
  }
]
