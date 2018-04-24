<template>
  <Layout style="height: 100%">
    <Sider collapsible :width="260" :collapsed-width="64" v-model="collapsed">
      <side-menu :menu-list="menuList"></side-menu>
    </Sider>
    <Layout>
      <Header></Header>
      <Content></Content>
    </Layout>
  </Layout>
</template>
<script>
import sideMenu from '_c/main/side-menu'
import { mapGetters } from 'vuex'
export default {
  name: 'Main',
  components: {
    sideMenu
  },
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
