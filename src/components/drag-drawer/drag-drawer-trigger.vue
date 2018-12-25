<template>
  <div :class="`${prefix}-move-trigger`">
    <div :class="`${prefix}-move-trigger-point`">
      <i></i><i></i><i></i><i></i><i></i>
    </div>
  </div>
</template>

<script>
import Mixin from './mixin'
export default {
  name: 'DragDrawerTrigger',
  mixins: [Mixin]
}
</script>

<style>
</style>
