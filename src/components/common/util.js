export const showTitle = (item, vm) => {
  return vm.useI18n ? vm.$t(item.name) : ((item.meta && item.meta.title) || item.name)
}
