<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed">
      <side-menu accordion :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
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
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"></tags-nav>
          </div>
          <Content>
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import sideMenu from './components/side-menu'
import headerBar from './components/header-bar'
import tagsNav from './components/tags-nav'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList } from '@/libs/util'
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
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.map(item => item.name).filter(item => !(item.meta && item.meta.notCache)) : []
    },
    menuList () {
      return this.$store.getters.menuList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    turnToPage (name) {
      this.$router.push({
        name: name
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type) {
      this.setTagNavList(res)
      if (type === 'all') this.turnToPage('home')
    },
    handleClick (item) {
      this.turnToPage(item.name)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag(this.$store.state.routers.homeRoute)
    this.setBreadCrumb(this.$route.matched)
    /**
     * @description 获取登录用户信息和可访问路由列表
     */
    // this.
  }
}
</script>
<style lang="less">
@import 'main.less';
</style>
