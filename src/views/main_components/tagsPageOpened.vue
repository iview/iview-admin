<style lang="less">
    @import '../main.less';
</style>

<template>
    <div ref="scrollCon" @mousewheel="handlescroll" @mouseout="handlemouseout" class="tags-outer-scroll-con">
        <div class="close-all-tag-con">
            <Dropdown @on-click="handleTagsOption">
                <Button size="small" type="primary">
                    标签选项
                    <Icon type="arrow-down-b"></Icon>
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">关闭所有</DropdownItem>
                    <DropdownItem name="clearOthers">关闭其他</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
        <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagConLeft + 'px'}">
            <transition-group name="taglist-moving-animation">
                <Tag 
                    type="dot"
                    v-for="item in pageTagsList" 
                    :key="item.name" 
                    :name="item.name" 
                    @on-close="closePage"
                    @click.native="linkTo(item)"
                    :closable="item.name==='home_index'?false:true"
                    :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
                >{{ item.title }}</Tag>
            </transition-group>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name,
            tagConLeft: 0
        };
    },
    props: {
        pageTagsList: Array
    },
    computed: {
        title () {
            return this.$store.state.currentTitle;
        }
    },
    methods: {
        closePage (event, name) {
            this.$store.commit('removeTag', name);
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            if (this.currentPageName === name) {
                let lastPageName = '';
                if (this.$store.state.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            }
        },
        linkTo (item) {
            if (item.path.indexOf(':') > -1) {
                this.$router.push({
                    name: item.name,
                    params: item.argu
                });
            } else {
                this.$router.push({
                    name: item.name
                });
            }
        },
        handlescroll (e) {
            document.body.style.overflow = 'hidden';
            let left = 0;
            if (e.wheelDelta > 0) {
                left = Math.min(0, this.tagConLeft + e.wheelDelta);
            } else {
                if (this.$refs.scrollCon.offsetWidth < this.$refs.scrollBody.offsetWidth) {
                    left = Math.max(this.tagConLeft + e.wheelDelta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth);
                }
            }
            this.tagConLeft = left;
        },
        handlemouseout () {
            document.body.style.overflow = 'auto';
        },
        handleTagsOption (type) {
            if (type === 'clearAll') {
                this.$store.commit('clearAllTags');
            } else {
                this.$store.commit('clearOtherTags', this);
            }
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
        }
    }
};
</script>
