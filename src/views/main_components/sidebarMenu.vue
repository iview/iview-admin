<template>
    <Menu ref="sideMenu" :active-name="currentPageName" :open-names="openedSubmenuArr" theme="dark" width="auto" @on-select="changeMenu">
        <slot name="top" :class="slotTopClass"></slot>

        <template v-for="item in routers">
            <MenuItem v-if="item.children.length<=1" :name="item.children[0].name" :key="item.path">
                <Icon :type="item.icon" :size="iconSize" :key="item.path"></Icon>
                <span class="layout-text" :key="item.path">{{ item.title }}</span>
            </MenuItem>

            <Submenu v-if="item.children.length>1" :name="item.name" :key="item.path">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ item.title }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="child.name">
                        <Icon :type="child.icon" :size="iconSize" :key="child.name"></Icon>
                        <span class="layout-text" :key="child.name">{{ child.title }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
// import util from '../util.js';

export default {
    data () {
        return {
            currentPageName: this.$store.state.currentPageName,
            tags_list: this.$store.state.tags_list,
            openedSubmenuArr: this.$store.state.openedSubmenuArr
        };
    },
    name: 'sidebarMenu',
    props: {
        slotTopClass: String,
        routers: Array,
        iconSize: Number
    },
    methods: {
        init () {
            this.tags_list = this.$store.state.tags_list;
            this.currentPageName = this.$route.name;
        },
        changeMenu (active) {
            let pageOpenedList = this.$store.state.pageOpenedList;
            let openedPageLen = pageOpenedList.length;
            let i = 0;
            let tagHasOpened = false;
            while (i < openedPageLen) {
                if (active === pageOpenedList[i].name) {  // 页面已经打开
                    this.$store.commit('moveToSecond', i);
                    tagHasOpened = true;
                    break;
                }
                i++;
            }
            if (!tagHasOpened) {
                let tag = this.tags_list.filter((item) => {
                    if (item.children) {
                        return active === item.children[0].name;
                    } else {
                        return active === item.name;
                    }
                });
                tag = tag[0];
                tag = tag.children ? tag.children[0] : tag;
                this.$store.commit('increateTag', tag);
            }
            this.$store.commit('setCurrentPageName', active);
            this.$router.push({
                name: active
            });
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList); // 本地存储已打开页面
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
        },
        currentPageName () {
            this.openedSubmenuArr = this.$store.state.openedSubmenuArr;
            this.$nextTick(
                this.$refs.sideMenu.updateOpened()
            );
        }
    },
    created () {
        this.init();
    }

};
</script>

<style>
.layout-hide-text .layout-text{
    display: none;
}
</style>
