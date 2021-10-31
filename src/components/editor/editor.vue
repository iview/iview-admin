<template>
  <div class="editor-wrapper" style="height:100%;">
    <div :id="editorId" style="height:100% !important;" ></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
// import 'wangeditor/release/wangEditor.min.css'
import { oneOf } from '@/libs/tools'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  methods: {
    setHtml (val) {
      this.editor.txt.html(val)
    }
  },
  mounted () {
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.config.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    // this.editor.config.menuTooltipPosition = 'down'
    this.editor.config.showMenuTooltips = false
    this.editor.config.onchangeTimeout = this.changeInterval
    this.editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'italic',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'list',
      'justify',
      'quote',
      'table',
      'splitLine',
      'undo',
      'redo'
    ]
    this.editor.config.colors = [
      '#ffffff',
      '#000000',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b'
    ]
    // create这个方法一定要在所有配置项之后调用
    this.editor.create()
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache
    if (html) this.editor.txt.html(html)
  }
}
</script>

<style lang="less">
.editor-wrapper {
  // z-index: 100 !important;
  .w-e-text-container{
    height: calc(~"100% - 100px") !important;
  }
  .w-e-toolbar{
    height: 100px;
  }
}
</style>
