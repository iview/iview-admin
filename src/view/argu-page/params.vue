<template>
  <div>
    <Card>
      <h2>ID: {{ $route.params.id }}</h2>
    </Card>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'params',
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
        const { name, params } = this.$route
        const route = {
          name,
          params,
          meta: {
            title: `动态路由-${params.id}`
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
