import Main from '@/view/main'
import parentView from '@/components/main/parent-view'

export default [
  {
    path: '/login',
    name: 'login',
    hideInMenu: true,
    meta: {
      title: 'Login - 登录'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'index',
    // redirect: '/home',
    hideInMenu: true,
    component: Main,
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'social-buffer'
    },
    component: Main,
    children: [
      {
        path: 'count_to',
        name: 'count_to',
        meta: {
          icon: 'arrow-graph-up-right'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      }
    ]
  },
  {
    path: 'multilevel',
    name: 'multilevel',
    meta: {
      icon: 'arrow-graph-up-right'
    },
    component: Main,
    children: [
      {
        path: 'level_1',
        name: 'level_1',
        meta: {
          icon: 'arrow-graph-up-right'
        },
        component: () => import('@/view/multilevel/level-1.vue')
      },
      {
        path: 'level_2',
        name: 'level_2',
        meta: {
          icon: 'arrow-graph-up-right'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_1',
            name: 'level_2_1',
            meta: {
              icon: 'arrow-graph-up-right'
            },
            component: () => import('@/view/multilevel/level-2/level-2-1.vue')
          }
        ]
      }
    ]
  }
]
