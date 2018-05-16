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
    setTagNavList (state, newRoute) {
      if (newRoute) {
        const { name, path, meta } = newRoute
        let newList = [...state.tagNavList]
        if (newList.findIndex(item => item.name === name) >= 0) return newList
        else newList.push({ name, path, meta })
        state.tagNavList = [...newList]
        setTagNavListInLocalstorage([...newList])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    }
  }
}
