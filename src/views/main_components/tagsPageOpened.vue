<template>
    <div>
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
    </div>
</template>

<script>
import routers from '../../router.js';
import util from '../util.js';

export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name
        }
    },
    props: {
        pageTagsList: Array
    },
    methods: {
        closePage (event, name) {
            this.$store.commit('removeTag', name)
            if(this.currentPageName === name){
                let lastPageName = '';
                if(this.$store.state.pageOpenedList.length>1){
                    lastPageName = this.$store.state.pageOpenedList[1].name;
                }else{
                    lastPageName = this.$store.state.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                })
            }
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList)
        },
        linkTo (name){
            let pathArr = util.setCurrentPath(this, name);
            if(pathArr.length>2){
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.$router.push({
                name: name
            });
        },
        // tagColor (item) {
        //     return item.children?
        //     (item.children[0].name===this.currentPageName?'blue':'yellow'):
        //     (item.name===this.currentPageName?'blue':'yellow')
        // }
    },
    watch: {
        '$route' (to, from) {
            this.currentPageName = to.name
            let pathArr = util.setCurrentPath(this, to.name);
            if(pathArr.length>2){
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
        }
    },
    mounted () {
        
    }
}
</script>
