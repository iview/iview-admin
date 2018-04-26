import config from '@/config'
import { getBreadCrumbList } from '@/libs/util'
export default {
  namespaced: true,
  state: {
    useI18n: config.useI18n,
    breadCrumbList: []
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    }
  }
}
