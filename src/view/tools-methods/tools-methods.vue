<template>
  <div>
    <Card shadow>
      <Row>
        <i-col span="4">
          <Button @click="createTagParams">添加一个标签</Button>
        </i-col>
        <i-col span="20">
          <p>动态路由，添加params</p>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 10px;">
      <Row>
        <i-col span="4">
          <Button @click="createTagQuery">添加一个标签</Button>
        </i-col>
        <i-col span="20">
          <p>动态路由，添加query</p>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'tools_methods_page',
  methods: {
    ...mapMutations([
      'addTag'
    ]),
    createTagParams () {
      const id = parseInt(Math.random() * 100000)
      const route = {
        name: 'params',
        params: {
          id
        },
        meta: {
          title: `动态路由-${id}`
        }
      }
      this.addTag({
        route: route,
        type: 'push'
      })
      this.$router.push(route)
    },
    createTagQuery () {
      const id = parseInt(Math.random() * 100000)
      const route = {
        name: 'query',
        query: {
          id
        },
        meta: {
          title: `参数-${id}`
        }
      }
      this.addTag({
        route: route,
        type: 'push'
      })
      this.$router.push(route)
    }
  }
}
</script>

<style>

</style>
