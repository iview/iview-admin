<template>
  <Drawer ref="drawerWrapper"
          :value="value"
          @input="handleInput"
          :width="width"
          :class-name="outerClasses"
          v-bind="$attrs"
          v-on="$listeners">
    <!-- 所有插槽内容显示在这里 ↓ -->

    <template v-for="(slots, slotsName) in $slots">
      <template v-if="slotsName !== 'default'">
        <render-dom v-for="(render, index) in slots"
                    :key="`b_drawer_${slotsName}_${index}`"
                    :render="() => render"
                    :slot="slotsName">
        </render-dom>
      </template>
      <template v-else>
        <div :class="`${prefix}-body-wrapper`"
             :key="`b_drawer_${slotsName}`">
          <render-dom v-for="(render, index) in slots"
                      :key="`b_drawer_${slotsName}_${index}`"
                      :render="() => render"
                      :slot="slotsName">
          </render-dom>
        </div>
      </template>
    </template>
    <!-- 所有插槽内容显示在这里 ↑ -->
    <div v-if="draggable"
         :style="triggerStyle"
         :class="`${prefix}-trigger-wrapper`"
         @mousedown="handleTriggerMousedown">
      <slot name="trigger">
        <drag-drawer-trigger></drag-drawer-trigger>
      </slot>
    </div>
    <div v-if="$slots.footer"
         :class="`${prefix}-footer`">
      <slot name="footer"></slot>
    </div>
  </Drawer>
</template>

<script>
import RenderDom from '@/libs/render-dom'
import DragDrawerTrigger from './drag-drawer-trigger.vue'
import Mixin from './mixin'
import { on, off } from '@/libs/tools'
import './index.less'
export default {
  name: 'BDrawer',
  components: {
    RenderDom,
    DragDrawerTrigger
  },
  mixins: [Mixin],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 256
    },
    // 是否可拖动修改宽度
    draggable: {
      type: Boolean,
      default: false
    },
    // 最小拖动宽度
    minWidth: {
      type: [String, Number],
      default: 256
    }
  },
  data () {
    return {
      canMove: false,
      wrapperWidth: 0,
      wrapperLeft: 0
    }
  },
  computed: {
    outerClasses () {
      const classesArray = [
        `${this.prefix}-wrapper`,
        this.canMove ? 'no-select pointer-events-none' : ''
      ]
      return classesArray.join(' ')
    },
    placement () {
      return this.$attrs.placement
    },
    innerWidth () {
      const width = this.width
      return width <= 100 ? (this.wrapperWidth * width) / 100 : width
    },
    triggerStyle () {
      return {
        [this.placement]: `${this.innerWidth}px`,
        position: this.$attrs.inner ? 'absolute' : 'fixed'
      }
    }
  },
  methods: {
    handleInput (status) {
      this.$emit('input', status)
    },
    handleTriggerMousedown (event) {
      this.canMove = true
      this.$emit('on-resize-start')
      // 防止鼠标选中抽屉中文字，造成拖动trigger触发浏览器原生拖动行为
      window.getSelection().removeAllRanges()
    },
    handleMousemove (event) {
      if (!this.canMove) return
      // 更新容器宽度和距离左侧页面距离，如果是window则距左侧距离为0
      this.setWrapperWidth()
      const left = event.pageX - this.wrapperLeft
      // 如果抽屉方向为右边，宽度计算需用容器宽度减去left
      let width = this.placement === 'right' ? this.wrapperWidth - left : left
      // 限定做小宽度
      width = Math.max(width, parseFloat(this.minWidth))
      event.atMin = width === parseFloat(this.minWidth)
      // 如果当前width不大于100，视为百分比
      if (width <= 100) width = (width / this.wrapperWidth) * 100
      this.$emit('update:width', parseInt(width))
      this.$emit('on-resize', event)
    },
    handleMouseup (event) {
      this.canMove = false
      this.$emit('on-resize-end')
    },
    setWrapperWidth () {
      const {
        width,
        left
      } = this.$refs.drawerWrapper.$el.getBoundingClientRect()
      this.wrapperWidth = width
      this.wrapperLeft = left
    }
  },
  mounted () {
    on(document, 'mousemove', this.handleMousemove)
    on(document, 'mouseup', this.handleMouseup)
    this.setWrapperWidth()
  },
  beforeDestroy () {
    off(document, 'mousemove', this.handleMousemove)
    off(document, 'mouseup', this.handleMouseup)
  }
}
</script>
