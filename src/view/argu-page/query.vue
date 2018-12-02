<template>
  <div>
    <Card>
      <h2>ID: {{ $route.query.id }}</h2>
      <Button @click="close">调用closeTag方法关闭本页</Button>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'query',
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    close () {
      /**
       * 如果是调用closeTag方法，普通的页面传入的对象参数只需要写name字段即可
       * 如果是动态路由和带参路由，需要传入query或params字段，用来区别关闭的是参数为多少的页面
       */
      this.closeTag({
        name: 'query',
        query: {
          id: this.$route.query.id
        }
      })
    }
  }
}
</script>

<style>

</style>
