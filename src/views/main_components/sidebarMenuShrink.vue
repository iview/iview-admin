<template>
    <div>
        <template v-for="(item, index) in menuList">
            <Dropdown placement="right-start" :key="index" @on-click="changeMenu">
                <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                    <Icon :size="20" color="white" :type="item.icon"></Icon>
                </Button>
                <DropdownMenu style="width: 200px;" slot="list">
                    <div style="position: relative;overflow:hidden;">
                        <template v-for="child in item.children">
                            <DropdownItem :name="child.name" :key="child.title">{{ child.title }}</DropdownItem>
                        </template>
                        <div v-if="item.children.length > 1" style="position: absolute;right:10px;bottom:-10px;z-index:-1;"><Icon color="#e0e1e6" :type="item.icon" :size="140"></Icon></div>
                    </div>
                </DropdownMenu>
            </Dropdown>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        }
    },
    data () {
        return {
            currentPageName: this.$route.name,
            openedSubmenuArr: this.$store.state.openedSubmenuArr
        };
    },
    computed: {
        tagsList () {
            return this.$store.state.tagsList;
        }
    },
    methods: {
        changeMenu (active) {
            if (active !== 'accesstest_index') {
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
                    let tag = this.tagsList.filter((item) => {
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
            }
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
            localStorage.currentPageName = to.name;
        }
    }
};
</script>
