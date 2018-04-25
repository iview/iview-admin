<template>
  <Submenu :name="`${submenuName}`">
    <template slot="title">
      <Icon :type="submenuItem.icon"/>
      <span>{{ showTitle(submenuItem) }}</span>
    </template>
    <template v-for="item in children">
      <side-menu-item v-if="item.children && item.children.length !== 0" :key="`menu-${item.name}`" :submenu-item="item"></side-menu-item>
      <menu-item v-else :name="`${item.name}`" :key="`menu-${item.name}`"><Icon :type="item.icon"/><span>{{ showTitle(item) }}</span></menu-item>
    </template>
  </Submenu>
</template>
<script>
import mixin from './mixin'
export default {
  name: 'sideMenuItem',
  props: {
    submenuItem: Object
  },
  mixins: [ mixin ],
  computed: {
    submenuName () {
      return this.submenuItem.name
    },
    children () {
      return this.submenuItem.children
    }
  }
}
</script>
