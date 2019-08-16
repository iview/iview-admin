<template>
  <div>
    <Tree
      :data="[{
        title: '',
        nodeKey: 0,
        loading: false,
        children: []
      }]"
      :load-data="buildChild"
      @on-select-change="handlerTreeSelected"
      @on-toggle-expand="handlerTreeExpand"
      :render="renderContent"
    />
  </div>
</template>

<script>
const TREE_NODE_CLASS = 'ivu-tree-children'
const TREE_NODE_HOVER_PREFIX = 'tree-hover-'
const APPEND_BEFORE = 'before'
const APPEND_INNER = 'inner'
const APPEND_AFTER = 'after'
let READY_TO_APPEND = null
let APPEND_TO = null
let APPEND_TARGET = null
export default {
  name: 'tree-drag',
  props: {
    getChild: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handlerTreeSelected (nodeList, node) {
      if (node.loading) return
      if (!node.expand) {
        this.buildChild(node)
      }
      this.$set(node, 'selected', true)
      this.$set(node, 'expand', !node.expand)
      nodeList.filter(n => n.node.selected && n.nodeKey !== node.nodeKey).map(n => {
        this.$set(n.node, 'selected', false)
      })
      this.$emit('on-select', node)
    },
    handlerTreeExpand (node) {
      if (node.loading) return
      if (node.expand) {
        this.buildChild(node)
      }
    },
    async buildChild (node, child) {
      if (node.loading === void (0)) {
        if (child) {
          if (node.children) {
            if (node.children.length > 0) {
              node.children.push(child)
              return
            }
          } else {
            this.$set(node, 'children', [child])
            return
          }
        }
        return
      }
      this.$set(node, 'loading', true)
      // 接口获取数据加载子节点
      const data = (await this.getChild(node)) || []
      if (child) {
        data.push(child)
      }
      if (data.length) {
        this.$set(node, 'children', data)
        this.$set(node, 'expand', true)
      } else {
        this.$delete(node, 'children')
      }
      this.$delete(node, 'loading')
    },
    handlerDragstart (e, { data }) {
      const { target } = e
      target.style.opacity = '.5'
      READY_TO_APPEND = data
    },
    handlerDragOver (e, { data }) {
      if (READY_TO_APPEND === data) {
        APPEND_TARGET = null
        return
      }
      const { offsetY, target } = e
      const offset = offsetY / target.offsetHeight
      if (offset <= 0.33) {
        APPEND_TO = APPEND_BEFORE
      } else if (offset > 0.33 && offset < 0.66) {
        APPEND_TO = APPEND_INNER
      } else if (offset >= 0.66) {
        APPEND_TO = APPEND_AFTER
      }
      this.setBorderOffsetElement(target)
      APPEND_TARGET = data
    },
    handlerDragend (e, { root, node, data }) {
      const { target } = e
      this.clearBorder()
      target.style.opacity = '1'
      if (!APPEND_TARGET || this.isChildren(data, APPEND_TARGET)) {
        return
      }
      // 从树上移除节点，就是拖动的节点
      const removeNode = () => {
        const parent = root.find(el => el.children && el.children.indexOf(data.nodeKey) > -1).node
        const index = parent.children.indexOf(data)
        parent.children.splice(index, 1)
      }
      removeNode()

      // 把移除的节点根据前后位置及父级关系添加回去
      const doAppend = (isBefore) => {
        const parent = root.find(el => el.children && el.children.indexOf(APPEND_TARGET.nodeKey) > -1).node
        const index = parent.children.indexOf(APPEND_TARGET) + (isBefore ? 0 : 1)
        parent.children.splice(index, 0, data)
        if (parent.children.length === 0) {
          delete parent.children
        }
      }

      switch (APPEND_TO) {
        case APPEND_BEFORE:
          doAppend(true)
          break
        case APPEND_AFTER:
          doAppend(false)
          break
        case APPEND_INNER:
          // 先展开
          this.$set(APPEND_TARGET, 'expand', true)
          // 加载内容
          this.buildChild(APPEND_TARGET, data)
          break
      }
      this.$emit('on-drag', data, APPEND_TARGET, APPEND_TO, e)
      READY_TO_APPEND = null
      APPEND_TO = null
      APPEND_TARGET = null
    },
    isChildren (node, child) {
      const { children } = node
      if (!children || !children.map) return false
      let flag = children.some(c => c.nodeKey === child.nodeKey)
      if (!flag) {
        children.map(node => {
          flag = this.isChildren(node, child)
        })
      }
      return flag
    },
    setBorderOffsetElement (target) {
      this.clearBorder()
      let ul = target
      while (ul.className !== TREE_NODE_CLASS) {
        ul = ul.parentElement
      }
      ul.className = `${TREE_NODE_CLASS} ${TREE_NODE_HOVER_PREFIX}${APPEND_TO}`
    },
    clearBorder () {
      let temp = document.querySelectorAll(`
        .${TREE_NODE_HOVER_PREFIX}${APPEND_BEFORE},
        .${TREE_NODE_HOVER_PREFIX}${APPEND_INNER},
        .${TREE_NODE_HOVER_PREFIX}${APPEND_AFTER}
      `)
      for (let i = 0; i < temp.length; i++) {
        temp[i].className = TREE_NODE_CLASS
      }
    },
    renderContent (h, treeData) {
      const { root, data } = treeData
      const { handlerDragstart, handlerDragOver, handlerDragend } = this
      if (root.length === 1) {
        this.handlerTreeSelected(root, data)
      }
      if (data.nodeKey === 0) {
        return null
      } else {
        return (
          <span
            draggable="true"
            on-dragstart={(e) => handlerDragstart(e, treeData)}
            on-dragover={(e) => handlerDragOver(e, treeData)}
            on-dragend={(e) => handlerDragend(e, treeData)}
            class={{ 'ivu-tree-title': true, 'ivu-tree-title-selected': data.selected }}
            onClick={() => this.handlerTreeSelected(root, data)}
          >
            <Icon type={data.icon} size="18" />
            {data.title}
          </span>
        )
      }
    }
  }
}
</script>
<style lang="less">
// 隐藏根节点
.ivu-tree > ul > li > span {
  display: none;
}
// 去掉根节点下的padding
.ivu-tree > ul > li > ul {
  padding: 0;
}
.ivu-tree ul li{
  margin: 0!important;
}
.ivu-tree-arrow, .ivu-tree-title{
  padding: 5px 0!important;
}
.ivu-tree-title{
  width: 100%;
}
.ivu-tree ul{
  border: 1px solid transparent;
}
.tree-hover-before{
  border-top-color: #2d8cf0!important;
}
.tree-hover-inner{
  background-color: #2d8cf0;
  span{
    color: #fff;
  }
}
.tree-hover-after {
  border-bottom-color: #2d8cf0!important;
}
</style>
