import { getBreadCrumbList } from '@/libs/util'
export default {
  namespaced: true,
  state: {
    breadCrumbList: []
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    }
  }
}
