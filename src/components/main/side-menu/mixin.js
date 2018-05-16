export default {
  methods: {
    showTitle (item) {
      return this.$config.useI18n ? this.$t(item.name) : ((item.meta && item.meta.title) || item.name)
    },
    showChildren (item) {
      return item.children && item.children.length !== 0
    }
  }
}
