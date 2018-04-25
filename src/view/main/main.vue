<template>
  <Layout style="height: 100%">
    <Sider collapsible :width="260" :collapsed-width="64" v-model="collapsed">
      <side-menu :use-i18n="useI18n" :menu-list="menuList"></side-menu>
    </Sider>
    <Layout>
      <Header></Header>
      <Content></Content>
    </Layout>
  </Layout>
</template>
<script>
import sideMenu from '_c/main/side-menu'
import { mapState, mapGetters } from 'vuex'
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
    ]),
    ...mapState('app', [
      'useI18n'
    ])
  }
}
</script>
