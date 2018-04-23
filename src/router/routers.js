import Main from '@/view/main'

const addChildPage = (name, path = '') => {
  return {
    path: name,
    name: name,
    component: () => import(`@/view/${path}${name}`)
  }
}

export default [
  {
    path: '/',
    name: 'pageNotShowInMenu',
    component: Main,
    children: [
      addChildPage('home'), // 首页
      addChildPage('ownspace', 'single-page/'), // 个人中心
      addChildPage('message', 'single-page/'), // 消息中心
      addChildPage('shopping', 'single-page/') // 购物中心
    ]
  },
  {
    path: '/international',
    name: 'international',
    component: Main,
    children: [
      // addChildPage('index', )
    ]
  }
]
