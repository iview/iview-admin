import Main from '@/view/main'

export default [
  { path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main
  }
]
