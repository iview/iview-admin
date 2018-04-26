<template>
  <Dropdown placement="right-start">
    <Button><Icon :type="parentItem.icon"/></Button>
    <DropdownMenu slot="list">
      <template v-for="child in children">
        <collapsed-menu v-if="showChildren(child)" :parent-item="child" :key="`drop-${child.name}`"></collapsed-menu>
        <DropdownItem v-else :key="`drop-${child.name}`"><Icon :type="child.icon"/><span>{{ showTitle(child) }}</span></DropdownItem>
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'collapsedMenu',
  mixins: [ mixin, itemMixin ]
}
</script>
