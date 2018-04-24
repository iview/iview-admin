<template>
  <Menu theme="dark" width="auto">
    <template v-for="item in menuList">
      <side-menu-item v-if="item.children && item.children.length !== 0" :key="`menu-${item.name}`" :submenu-name="item.name" :list="item.children"></side-menu-item>
      <menu-item v-else :name="`${item.name}`" :key="`menu-${item.name}`">{{ $t(item.name) }}</menu-item>
    </template>
  </Menu>
</template>
<script>
import sideMenuItem from './side-menu-item.vue'
export default {
  name: 'sideMenu',
  components: {
    sideMenuItem
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
