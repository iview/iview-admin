<template>
  <div>
    <Card shadow>
      <Row>
        <i-col span="6">
          <Button @click="createTag">添加一个标签</Button>
        </i-col>
        <i-col span="18"></i-col>
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
    createTag () {
      this.addTag({
        route: {
          name: 'argu_page',
          params: {
            id: parseInt(Math.random() * 100000)
          }
        },
        type: 'push'
      })
    }
  }
}
</script>

<style>

</style>
