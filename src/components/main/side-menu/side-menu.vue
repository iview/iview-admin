<template>
  <div class="side-menu-wrapper">
    <slot></slot>
    <Menu v-show="!collapsed" :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <menu-item v-else :name="`${item.name}`" :key="`menu-${item.name}`"><Icon :type="item.icon"/><span>{{ showTitle(item) }}</span></menu-item>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <collapsed-menu @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" v-for="item in menuList" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
    </div>
  </div>
</template>
<script>
import sideMenuItem from './side-menu-item.vue'
import collapsedMenu from './collapsed-menu.vue'
import mixin from './mixin'
export default {
  name: 'sideMenu',
  mixins: [ mixin ],
  components: {
    sideMenuItem,
    collapsedMenu
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
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    }
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name)
    }
  }
}
</script>
<style lang="less">
@import './side-menu.less';
</style>
