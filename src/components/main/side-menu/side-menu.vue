<template>
  <Menu theme="dark" width="auto" @on-select="handleSelect">
    <template v-for="item in menuList">
      <side-menu-item v-if="item.children && item.children.length !== 0" :key="`menu-${item.name}`" :submenu-item="item" :list="item.children"></side-menu-item>
      <menu-item v-else :name="`${item.name}`" :key="`menu-${item.name}`"><Icon :type="item.icon"/>{{ showTitle(item) }}</menu-item>
    </template>
  </Menu>
</template>
<script>
import sideMenuItem from './side-menu-item.vue'
import mixin from './mixin'
export default {
  name: 'sideMenu',
  mixins: [ mixin ],
  components: {
    sideMenuItem
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    useI18n: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name)
    }
  }
}
</script>
