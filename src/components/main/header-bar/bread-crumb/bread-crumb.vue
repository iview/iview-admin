<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">{{  }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'breadCrumb',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>
