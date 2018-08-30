<template>
  <div class="drag-list-wrapper">
    <div class="drag-list-con con1">
      <slot name="left-title"></slot>
      <draggable class="drop-box1" :class="dropConClass.left" :options="options" :value="list1" @input="handleListChange($event, 'left')" @end="handleEnd($event, 'left')">
        <div class="drag-list-item" v-for="(itemLeft, index) in list1" :key="`drag_li1_${index}`">
          <slot name="left" :itemLeft="itemLeft">{{ itemLeft }}</slot>
        </div>
      </draggable>
    </div>
    <div class="drag-list-con con2">
      <slot name="right-title"></slot>
      <draggable class="drop-box2" :class="dropConClass.right" :options="options" :value="list2" @input="handleListChange($event, 'right')" @end="handleEnd($event, 'right')">
        <div class="drag-list-item" v-for="(itemRight, index) in list2" :key="`drag_li2_${index}`">
          <slot name="right" :itemRight="itemRight">{{ itemRight }}</slot>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'DragList',
  components: {
    draggable
  },
  props: {
    list1: {
      type: Array,
      required: true
    },
    list2: {
      type: Array,
      default: () => []
    },
    dropConClass: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      options: { group: 'drag_list' }
    }
  },
  methods: {
    handleListChange (value, type) {
      if (type === 'left') this.$emit('update:list1', value)
      else this.$emit('update:list2', value)
    },
    handleEnd (event, type) {
      const srcClassName = (event.srcElement || event.target).classList[0]
      const targetClassName = event.to.classList[0]
      let src = ''
      let target = ''
      if (srcClassName === targetClassName) {
        if (type === 'left') {
          src = 'left'
          target = 'left'
        } else {
          src = 'right'
          target = 'right'
        }
      } else {
        if (type === 'left') {
          src = 'left'
          target = 'right'
        } else {
          src = 'right'
          target = 'left'
        }
      }
      this.$emit('on-change', {
        src: src,
        target: target,
        oldIndex: event.oldIndex,
        newIndex: event.newIndex
      })
    }
  }
}
</script>
<style lang="less">
.drag-list-wrapper{
  height: 100%;
  .drag-list-con{
    width: 50%;
    float: left;
  }
}
</style>
