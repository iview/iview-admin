<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`"><Icon v-if="showIcon" :type="item.icon" style="margin-right: 4px;" />{{ showTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
import './custom-bread-crumb.less'
export default {
  name: 'customBreadCrumb',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    }
  }
}
</script>
