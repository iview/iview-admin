<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed">
      <side-menu accordion :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
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
            <tags-nav v-model="currentTag" :list="tagList"></tags-nav>
          </div>
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
      maxLogo,
      currentTag: {
        name: '5555',
        meta: {
          title: '5555'
        }
      },
      tagList: [
        {
          name: '11111',
          meta: {
            title: '11111'
          }
        },
        {
          name: '22222',
          meta: {
            title: '22222'
          }
        },
        {
          name: '3333',
          meta: {
            title: '3333'
          }
        },
        {
          name: '4444',
          meta: {
            title: '4444'
          }
        },
        {
          name: '5555',
          meta: {
            title: '5555'
          }
        },
        {
          name: '6666',
          meta: {
            title: '6666'
          }
        },
        {
          name: '7777',
          meta: {
            title: '7777'
          }
        },
        {
          name: '8888',
          meta: {
            title: '8888'
          }
        },
        {
          name: '9999',
          meta: {
            title: '9999'
          }
        },
        {
          name: '0000',
          meta: {
            title: '0000'
          }
        },
        {
          name: '4545',
          meta: {
            title: '4545'
          }
        },
        {
          name: '2323',
          meta: {
            title: '2323'
          }
        },
        {
          name: '1122',
          meta: {
            title: '1122'
          }
        },
        {
          name: '9988',
          meta: {
            title: '9988'
          }
        },
        {
          name: '7766',
          meta: {
            title: '7766'
          }
        },
        {
          name: '2453',
          meta: {
            title: '2453'
          }
        },
        {
          name: '1234',
          meta: {
            title: '1234'
          }
        },
        {
          name: '9900',
          meta: {
            title: '9900'
          }
        },
        {
          name: '77888',
          meta: {
            title: '77888'
          }
        },
        {
          name: '4554',
          meta: {
            title: '4554'
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters('routers', [
      'menuList'
    ]),
    ...mapState('app', [
      //
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
