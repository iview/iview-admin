import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getLockStatus } from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes
})
const LOCK_PAGE_NAME = 'lock_page'
const IS_LOCKED = getLockStatus()
console.log(store)
const routers = store.dispatch('getUserInfo', 'user').then(res => [
  console.log(res)
])

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // if (IS_LOCKED && to.name !== LOCK_PAGE_NAME) {
  //   // 当前是锁定状态并且用户要跳转到的页面不是解锁页面
  //   next({
  //     replace: true, // 重定向到解锁页面
  //     name: LOCK_PAGE_NAME
  //   })
  // } else if (IS_LOCKED && to.name === LOCK_PAGE_NAME) {
  //   // 当前未锁定且用户要跳转到的页面是解锁页面
  //   next(false) // 不做跳转
  // } else {
  //   if (routers) {}
  // }
  next()
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
