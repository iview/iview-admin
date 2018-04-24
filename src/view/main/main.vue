<template>
  <Layout style="height: 100%">
    <Sider collapsible :width="260" :collapsed-width="64" v-model="collapsed"></Sider>
    <Layout>
      <Header></Header>
      <Content></Content>
    </Layout>
  </Layout>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Main',
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
    ...mapGetters('routers', [
      'menuList'
    ])
  }
}
</script>
