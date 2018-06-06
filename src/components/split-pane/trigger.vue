<template>
  <div :class="classes"></div>
</template>

<script>
export default {
  name: 'Trigger',
  props: {
    mode: String
  },
  data () {
    return {
      prefix: 'ivu-split-trigger',
      initOffset: 0
    }
  },
  computed: {
    classes () {
      return [
        this.prefix,
        this.mode === 'vertical' ? `${this.prefix}-vertical` : `${this.prefix}-horizontal`
      ]
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
