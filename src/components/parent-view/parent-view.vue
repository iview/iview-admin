<template>
  <keep-alive :include="cacheList" :exclude="notCacheName">
    <router-view ref="child"/>
  </keep-alive>
</template>
<script>
export default {
  name: 'ParentView',
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    notCacheName () {
      return [(this.$route.meta && this.$route.meta.notCache) ? this.$route.name : '']
    },
    cacheList () {
      return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
    }
  }
}
</script>
