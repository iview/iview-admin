<style lang="less">
    @import '../main.less';
</style>

<template>
    <div>
        <transition-group name="taglist-moving-animation">
            <Tag 
                type="dot"
                v-for="item in pageTagsList" 
                :key="item.name" 
                :name="item.name" 
                @on-close="closePage"
                @click.native="linkTo(item.name)"
                :closable="item.name==='home_index'?false:true"
                :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
            >{{ item.title }}</Tag>
        </transition-group>
    </div>
</template>

<script>
import util from '../util.js';

export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name
        };
    },
    props: {
        pageTagsList: Array
    },
    methods: {
        closePage (event, name) {
            this.$store.commit('removeTag', name);
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
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
        },
        linkTo (name) {
            let pathArr = util.setCurrentPath(this, name);
            if (pathArr.length > 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.$router.push({
                name: name
            });
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
            let pathArr = util.setCurrentPath(this, to.name);
            if (pathArr.length > 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
        }
    }
};
</script>
