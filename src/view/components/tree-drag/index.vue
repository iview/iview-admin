<template>
  <div class="tree-drag">
    <div>
      <p>选择了：{{selected.title}}</p>
      <TreeDrag :getChild="getChild" @on-select="handlerSelect" @on-drag="handlerDrag"/>
    </div>
    <div>
      <p>拖拽历史</p>
      <p v-for="(json, index) in dragHis" :key="index">
        ID: {{json.from.id}}({{json.from.title}}) --->> ID: {{json.to.id}}({{json.to.title}})
        <strong>Position: {{json.position}}</strong>
      </p>
    </div>
  </div>
</template>

<script>
import TreeDrag from '_c/tree-drag'
export default {
  name: 'tree-drag-demo',
  components: { TreeDrag },
  data () {
    return {
      selected: {},
      dragHis: []
    }
  },
  methods: {
    getChild (node) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const data = []
          // 接口获取数据加载子节点
          for (let i = 0; i < 10; i++) {
            const child = {
              title: `测试节点${node.nodeKey}-${i}`,
              id: `${node.nodeKey}${i}`,
              loading: false,
              children: []
            }
            // 模拟标记第5个开始没有子节点
            // 不包含loading和children属性则不会有展开的箭头，遵循官方tree使用
            if (i >= 5) {
              delete child.loading
              delete child.children
            }
            data.push(child)
          }
          resolve(data)
        }, 1000)
      })
    },
    handlerSelect (node) {
      this.selected = node
    },
    handlerDrag (from, to, position, e) {
      this.dragHis.push({
        from, to, position, e
      })
    }
  }
}
</script>
<style lang="less">
.tree-drag {
  display: flex;
  &>div{
    flex: 1;
  }
  &>div:first-child{
    border-right: 1px solid #dcdee2;
  }
  &>div:last-child{
    padding-left: 16px;
  }
}
</style>
