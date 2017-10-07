<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': hideMenuText}">
        <div class="sidebar-menu-con" :style="{width: hideMenuText?'80px':'200px', background: $store.state.menuTheme === 'dark'?'#495060':'white'}">
            <sidebar-menu :routers="menuList" :iconSize="14">
                <div slot="top" class="logo-con">i<i>V</i>iew admin</div>
            </sidebar-menu>
        </div>
        <div class="main-content-container":style="{left: hideMenuText?'80px':'200px'}">
            <div class="main-content-out-container">
                <div class="main-header">
                    <div class="navicon-con">
                        <Button type="text" @click="toggleClick">
                            <Icon type="navicon" size="32"></Icon>
                        </Button>
                    </div>
                    <div class="header-middle-con">
                        <div class="main-breadcrumb">
                            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                        </div>
                    </div>
                    <div class="header-avator-con">
                        <div @click="handleFullScreen" v-if="showFullScreenBtn" class="full-screen-btn-con">
                            <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                                <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
                            </Tooltip>
                        </div>
                        <div class="switch-theme-con">
                            <Row class="switch-theme" type="flex" justify="center" align="middle">
                                <theme-dropdown-menu></theme-dropdown-menu>
                            </Row>
                        </div>
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown @on-click="handleClickUserDropdown">
                                    <a href="javascript:void(0)">
                                        <span class="main-user-name">{{ userName }}</span>
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                        <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <Avatar icon="person" style="background: #619fe7;margin-left: 10px;"></Avatar>
                            </Row>
                        </div>
                    </div>
                </div>
                
                <div class="main-content">
                    <div class="tags-con">
                        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
                    </div>
                    <div class="single-page-con">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import sidebarMenu from './main_components/sidebarMenu.vue';
    import tagsPageOpened from './main_components/tagsPageopened.vue';
    import breadcrumbNav from './main_components/breadcrumbNav.vue';
    import themeDropdownMenu from './main_components/themeDropdownMenu.vue';
    import Cookies from 'js-cookie';
    import util from './util.js';
    
    export default {
        components: {
            sidebarMenu,
            tagsPageOpened,
            breadcrumbNav,
            themeDropdownMenu
        },
        data () {
            return {
                spanLeft: 4,
                spanRight: 20,
                menuList: this.$store.state.appRouter,
                tagsList: [],  // 所有页面的页面对象
                pageTagsList: this.$store.state.pageOpenedList,  // 打开的页面的页面对象
                currentPath: this.$store.state.currentPath,  // 当前面包屑数组
                currentPageName: '',
                hideMenuText: false,
                userName: '',
                showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
                isFullScreen: false
            };
        },
        methods: {
            init () {
                let tagsList = [];
                this.menuList.map((item) => {
                    if (item.children.length <= 1) {
                        tagsList.push(item);
                    } else {
                        tagsList.push(...item.children);
                    }
                });
                this.$store.commit('setTagsList', tagsList);
                this.$store.commit('setCurrentPageName', this.$route.name);
                let pathArr = util.setCurrentPath(this, this.$route.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
            },
            toggleClick () {
                this.hideMenuText = !this.hideMenuText;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                    let hasOpened = false;
                    this.pageTagsList.forEach((item, index) => {
                        if (item.name === 'ownspace_index') {
                            hasOpened = true;
                            this.$store.commit('moveToSecond', index);
                        }
                    });
                    if (!hasOpened) {
                        this.$store.commit('increateTag', {name: 'ownspace_index', title: '个人中心'});
                    }
                } else if (name === 'loginout') {
                    Cookies.remove('user');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            handleFullScreen () {
                let main = document.getElementById('main');
                if (this.isFullScreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (main.requestFullscreen) {
                        main.requestFullscreen();
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen();
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen();
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen();
                    }
                }
            }
        },
        watch: {
            '$route' (to) {
                this.$store.commit('setCurrentPageName', to.name);
                let currentTitle = this.$store.state.tagsList.filter(item => {
                    return item.name === to.name;
                })[0].title;
                let pathArr = util.setCurrentPath(this, to.name, currentTitle);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
            }
        },
        mounted () {
            this.init();
            document.addEventListener('fullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('mozfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('webkitfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
            document.addEventListener('msfullscreenchange', () => {
                this.isFullScreen = !this.isFullScreen;
            });
        }
    };
</script>
