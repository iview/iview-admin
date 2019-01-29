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
  return { token: USER_MAP[req.userName].token }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}
