<template>
  <Layout style="height: 100%" class="main">
    <Sider collapsible :width="260" :collapsed-width="64" v-model="collapsed">
      <side-menu :collapsed="collapsed" @on-select="turnToPage" :use-i18n="useI18n" :menu-list="menuList">
        <div class="logo-con">
          <img v-show="!collapsed"  :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
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
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
export default {
  name: 'Main',
  components: {
    sideMenu
  },
  data () {
    return {
      collapsed: true,
      minLogo,
      maxLogo
    }
  },
  computed: {
    ...mapGetters('routers', [
      'menuList'
    ]),
    ...mapState('app', [
      'useI18n'
    ])
  },
  methods: {
    turnToPage (name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>
<style lang="less">
@import 'main.less';
</style>
