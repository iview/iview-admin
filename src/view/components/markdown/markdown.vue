<template>
  <div>
    <div>
      <markdown-editor v-model="content"/>
    </div>
    <Button style="margin: 10px 0;" type="primary" @click="markdownToHtml">转为HTML</Button>
    <div v-html="html"></div>
  </div>
</template>

<script>
import MarkdownEditor from '_c/markdown'
import ShowDown from 'showdown'
export default {
  name: 'markdown_page',
  components: {
    MarkdownEditor
  },
  data () {
    return {
      content: '**我是测试文字**',
      html: ''
    }
  },
  methods: {
    markdownToHtml () {
      const converter = new ShowDown.Converter()
      this.html = converter.makeHtml(this.content)
    }
  }
}
</script>

<style>

</style>
