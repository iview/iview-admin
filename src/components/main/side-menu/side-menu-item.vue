<template>
  <Submenu :name="`${submenuName}`">
    <template slot="title">
      <Icon type="ios-paper"></Icon>
      {{ $t(submenuName) }}
    </template>
    <template v-for="item in list">
      <side-menu-item v-if="item.children && item.children.length !== 0" :key="`menu-${item.name}`" :submenu-name="item.name" :list="item.children"></side-menu-item>
      <menu-item v-else :name="`${item.name}`" :key="`menu-${item.name}`">{{ $t(item.name) }}</menu-item>
    </template>
  </Submenu>
</template>
<script>
export default {
  name: 'sideMenuItem',
  props: {
    list: Array,
    submenuName: String
  }
}
</script>
