export default {
  props: {
    parentItem: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    parentName () {
      return this.parentItem.name
    },
    children () {
      return this.parentItem.children
    }
  }
}
