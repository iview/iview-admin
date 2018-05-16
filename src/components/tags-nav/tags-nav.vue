<template>
  <div class="tags-nav">
    <div ref="scrollCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="scroll-outer-con">
      <div class="close-con">
        <Dropdown transfer @on-click="handleTagsOption">
          <Button size="small" type="primary">
            标签选项
            <Icon type="arrow-down-b"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="clearAll">关闭所有</DropdownItem>
            <DropdownItem name="clearOthers">关闭其他</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="btn-con left-btn">
        <Button icon="chevron-left" type="text"></Button>
      </div>
      <div class="btn-con right-btn">
        <Button icon="chevron-right" type="text"></Button>
      </div>
        <!-- <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
            <transition-group name="taglist-moving-animation">
                <Tag
                    type="dot"
                    v-for="(item) in pageTagsList"
                    ref="tagsPageOpened"
                    :key="item.name"
                    :name="item.name"
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ itemTitle(item) }}</Tag>
            </transition-group>
        </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'tagsNav',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      let left = 0
      if (delta > 0) {
        left = Math.min(0, this.tagBodyLeft + delta)
      } else {
        if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
          if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
            left = this.tagBodyLeft
          } else {
            left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
      this.tagBodyLeft = left
    },
    handleTagsOption () {
      //
    }
  }
}
</script>

<style lang="less">
@import './tags-nav.less';
</style>
