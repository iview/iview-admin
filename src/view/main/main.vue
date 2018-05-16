<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed">
      <side-menu accordion :collapsed="collapsed" @on-select="turnToPage" :use-i18n="useI18n" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange"></header-bar>
      </Header>
      <Content>
        <Layout>
          <Header class="tag-nav-wrapper">
            <tags-nav></tags-nav>
          </Header>
          <Content></Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import sideMenu from '_c/main/side-menu'
import headerBar from '_c/main/header-bar'
import tagsNav from '_c/tags-nav'
import { mapState, mapGetters, mapMutations } from 'vuex'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.jpg'
export default {
  name: 'Main',
  components: {
    sideMenu,
    headerBar,
    tagsNav
  },
  data () {
    return {
      collapsed: false,
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
    ...mapMutations('app', [
      'setBreadCrumb'
    ]),
    turnToPage (name) {
      this.$router.push({
        name: name
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    }
  },
  watch: {
    '$route' (res) {
      this.setBreadCrumb(res.matched)
    }
  },
  mounted () {
    console.log(this.$route)
    this.setBreadCrumb(this.$route.matched)
  }
}
</script>
<style lang="less">
@import 'main.less';
</style>
