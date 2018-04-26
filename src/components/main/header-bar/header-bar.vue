<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="navicon-round" @on-change="handleCollpasedChange"></sider-trigger>
    <bread-crumb :list="breadList"></bread-crumb>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import breadCrumb from './bread-crumb'
export default {
  name: 'headerBar',
  components: {
    siderTrigger,
    breadCrumb
  },
  props: {
    collapsed: Boolean,
    breadList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
<style lang="less">
@import './header-bar.less';
</style>
