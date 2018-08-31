<template>
  <div>
    <Card>
      <h2>ID: {{ $route.query.id }}</h2>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'query',
  watch: {
    '$route.path' () {
      this.addRouteTag()
    }
  },
  computed: {
    componentName () {
      return this.$vnode.tag.replace(/^vue-component-\d*-/, '')
    }
  },
  methods: {
    ...mapMutations([
      'addTag'
    ]),
    addRouteTag () {
      if (this.$route.name === this.componentName) {
        const { name, query } = this.$route
        const route = {
          name,
          query,
          meta: {
            title: `参数-${query.id}`
          }
        }
        this.addTag({
          route,
          type: 'push'
        })
      }
    }
  },
  created () {
    this.addRouteTag()
  }
}
</script>

<style>

</style>
