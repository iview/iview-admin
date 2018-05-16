import { getBreadCrumbList, setTagNavListInLocalstorage, getTagNavListFromLocalstorage } from '@/libs/util'
export default {
  namespaced: true,
  state: {
    breadCrumbList: [],
    tagNavList: []
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    }
  }
}
