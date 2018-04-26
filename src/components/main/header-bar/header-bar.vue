<template>
  <div class="header-bar">
    <sider-trigger :collapsed="collapsed" icon="navicon-round" @on-change="handleCollpasedChange"></sider-trigger>
    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import customBreadCrumb from './custom-bread-crumb'
import { mapState } from 'vuex'
export default {
  name: 'headerBar',
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    ...mapState('app', [
      'breadCrumbList'
    ])
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
