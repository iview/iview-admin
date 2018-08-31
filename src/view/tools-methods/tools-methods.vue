<template>
  <div>
    <Card shadow>
      <Row>
        <i-col span="4">
          <Button @click="createParamsRoute()">添加一个标签</Button>
        </i-col>
        <i-col span="20">
          <p>动态路由，添加params</p>
        </i-col>
      </Row>
    </Card>
    <Card shadow style="margin-top: 10px;">
      <Row>
        <i-col span="4">
          <Button @click="createQueryRoute()">添加一个标签</Button>
        </i-col>
        <i-col span="20">
          <p>动态路由，添加query</p>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'tools_methods_page',
  methods: {
    createParamsRoute () {
      const id = parseInt(Math.random() * 100000)
      this.$router.push({
        name: 'params',
        params: {
          id
        }
      })
    },
    createQueryRoute () {
      const id = parseInt(Math.random() * 100000)
      this.$router.push({
        name: 'query',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style>

</style>
