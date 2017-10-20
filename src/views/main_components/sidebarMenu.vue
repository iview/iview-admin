<template>
    <Menu ref="sideMenu" :active-name="currentPageName" :open-names="openedSubmenuArr" :theme="$store.state.menuTheme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
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
import util from '@/libs/util';
export default {
    data () {
        return {
            currentPageName: this.$route.name,
            openedSubmenuArr: this.$store.state.openedSubmenuArr
        };
    },
    name: 'sidebarMenu',
    props: {
        slotTopClass: String,
        menuList: Array,
        iconSize: Number
    },
    computed: {
        tagsList () {
            return this.$store.state.tagsList;
        }
    },
    methods: {
        changeMenu (active) {
            if (active !== 'accesstest_index') {
                util.openNewPage(this, active);
                this.$router.push({
                    name: active
                });
            }
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
            localStorage.currentPageName = to.name;
        },
        currentPageName () {
            this.openedSubmenuArr = this.$store.state.openedSubmenuArr;
            this.$nextTick(() => {
                this.$refs.sideMenu.updateOpened();
            });
        }
    },
    updated () {
        this.$nextTick(() => {
            this.$refs.sideMenu.updateOpened();
        });
    }

};
</script>
