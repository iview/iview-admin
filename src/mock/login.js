import { getParams } from '@/libs/util'

const USER_MAP = {
  super_admin: {
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return {token: USER_MAP[req.userName].token}
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}

export const getUserMenus = req => {
  return [
    {
      path: '',
      name: 'doc',
      meta: {
        title: '文档',
        href: 'https://lison16.github.io/iview-admin-doc/#/',
        icon: 'ios-book'
      }
    },
    {
      path: '/multilevel',
      name: 'multilevel',
      meta: {
        icon: 'md-menu',
        title: '多级菜单'
      },
      component: 'components/main',
      children: [
        {
          path: 'level_2_1',
          name: 'level_2_1',
          meta: {
            icon: 'md-funnel',
            title: '二级-1'
          },
          component: 'view/multilevel/level-2-1.vue'
        },
        {
          path: 'level_2_2',
          name: 'level_2_2',
          meta: {
            access: ['super_admin'],
            icon: 'md-funnel',
            showAlways: true,
            title: '二级-2'
          },
          component: 'components/parent-view',
          children: [
            {
              path: 'level_2_2_1',
              name: 'level_2_2_1',
              meta: {
                icon: 'md-funnel',
                title: '三级'
              },
              component: 'view/multilevel/level-2-2/level-3-1.vue'
            }
          ]
        },
        {
          path: 'level_2_3',
          name: 'level_2_3',
          meta: {
            icon: 'md-funnel',
            title: '二级-3'
          },
          component: 'view/multilevel/level-2-3.vue'
        }
      ]
    }
  ]
}
