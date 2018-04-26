<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">{{ showTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
export default {
  name: 'customBreadCrumb',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 16
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    }
  },
  mounted () {
    // console.log(this.list)
  }
}
</script>
<style lang="less">
@import './custom-bread-crumb.less';
</style>
