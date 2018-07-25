<template>
  <Dropdown @on-click="handleClick" transer placement="right-start">
    <a class="drop-menu-a" type="text" :style="{textAlign: !hideTitle ? 'left' : ''}"><common-icon :size="rootIconSize" :color="textColor" :type="parentItem.icon"/><span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span><Icon v-if="!hideTitle" :size="10" :color="textColor" type="chevron-right" style="float: right;margin-top: 4px;"/></a>
    <DropdownMenu slot="list">
      <template v-for="child in children">
        <collapsed-menu v-if="showChildren(child)" :icon-size="iconSize" :parent-item="child" :key="`drop-${child.name}`"></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`" :name="child.name"><common-icon :size="iconSize" :type="child.icon"/><span class="menu-title">{{ showTitle(child) }}</span></DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'

export default {
  name: 'CollapsedMenu',
  mixins: [ mixin, itemMixin ],
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 16
    }
  },
  methods: {
    handleClick (name) {
      this.$emit('on-click', name)
    }
  }
}
</script>
