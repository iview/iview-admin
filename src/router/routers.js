import Main from '@/view/main'
import parentView from '@/components/main/parent-view'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'index',
    // redirect: '/home',
    component: Main,
    children: [
      {
        path: 'home',
        name: 'home',
        hideInMenu: true,
        notCache: true,
        component: () => import('@/view/single-page/home')
      },
      {
        path: '/components',
        name: 'components',
        component: parentView,
        children: [
          {
            path: 'count_to',
            name: 'count_to',
            component: () => import('@/view/components/count-to/count-to.vue')
          }
        ]
      },
      {
        path: 'multilevel',
        name: 'multilevel',
        component: parentView,
        children: [
          {
            path: 'level_1',
            name: 'level_1',
            component: () => import('@/view/multilevel/level-1.vue')
          },
          {
            path: 'level_2',
            name: 'level_2',
            component: parentView,
            children: [
              {
                path: 'level_2_1',
                name: 'level_2_1',
                component: () => import('@/view/multilevel/level-2/level-2-1.vue')
              }
            ]
          }
        ]
      }
    ]
  }
]
