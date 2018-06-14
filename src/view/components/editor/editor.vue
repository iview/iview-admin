<template>
  <div>
    <editor v-model="content" @on-change="handleChange"/>
  </div>
</template>

<script>
import Editor from '_c/editor'
export default {
  name: 'editor_page',
  components: {
    Editor
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    handleChange (html, text) {
      console.log(html, text)
    }
  }
}
</script>

<style>

</style>
