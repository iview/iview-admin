<template>
  <div class="split-pane-page-wrapper">
    <split-pane v-model="offset" @on-moving="handleMoving">
      <div slot="left" class="pane left-pane">
        <split-pane v-model="offsetVertical" mode="vertical" @on-moving="handleMoving">
          <div slot="top" class="pane top-pane"></div>
          <div slot="bottom" class="pane bottom-pane"></div>
        </split-pane>
      </div>
      <div slot="right" class="pane right-pane"></div>
    </split-pane>
  </div>
</template>

<script>
import SplitPane from '_c/split-pane'
export default {
  name: 'split_pane_page',
  components: {
    SplitPane
  },
  data () {
    return {
      offset: 0.6,
      offsetVertical: '250px'
    }
  },
  methods: {
    handleMoving (e) {
      console.log(e.atMin, e.atMax)
    }
  }
}
</script>

<style lang="less">
.split-pane-page-wrapper{
  height: 600px;
  .pane{
    width: 100%;
    height: 100%;
    &.left-pane{
      background: sandybrown;
    }
    &.right-pane{
      background: palevioletred;
    }
    &.top-pane{
      background: sandybrown;
    }
    &.bottom-pane{
      background: palevioletred;
    }
  }
}
</style>
