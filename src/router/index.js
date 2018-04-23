import Vue from 'vue'
import Router from 'vue-router'
import baseRouter from './base-router'

Vue.use(Router)

export default new Router({
  routes: [
    ...baseRouter
  ]
})
