<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button size="large" long type="text">未读消息<Badge class="message-count-badge-outer" class-name="message-count-badge" count="100"></Badge></Button>
            </div>
            <div>
                <Button size="large" long type="text">已读消息<Badge class="message-count-badge-outer" class-name="message-count-badge" count="100"></Badge></Button>
            </div>
            <div>
                <Button size="large" long type="text">回收站<Badge class="message-count-badge-outer" class-name="message-count-badge" count="100"></Badge></Button>
            </div>
        </div>
        <div class="message-content-con">
            <div v-if="showMesTitleList" class="message-title-list-con">
                <div class="message-title-handle-con">
                    <div class="message-title-handle-con-check-con">
                        <Checkbox>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全选</Checkbox>
                    </div>
                </div>
                <ul class="message-title-list">
                    <li v-for="(item, index) in unreadMesTitleList" :key="index">
                        <div class="message-title-list-checkbox-con"><Checkbox></Checkbox></div>
                        <div class="message-title-list-title-con"><a>{{ item.title }}</a></div>
                        <div class="message-title-list-time-con" v-once><span><Icon :size="12" type="android-time"></Icon></span>{{ formatDate(item.time) }}</div>
                        <div class="message-title-list-asread-con"><Button size="small">标为已读</Button></div>
                    </li>
                </ul>
            </div>
            <div v-else class="message-view-content-con">
                s
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            unreadMesTitleList: [],
            showMesTitleList: true
        };
    },
    methods: {
        formatDate (time) {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();
            return year + '/' + month + '/' + day + '  ' + hour + ':' + minute + ':' + second;
        }
    },
    mounted () {
        this.unreadMesTitleList = [
            {
                title: '欢迎登录iView-admin后台管理系统，来了解他的用途吧',
                hasread: false,
                time: 1507390106000
            },
            {
                title: '使用iView-admin和iView-ui组件库快速搭建你的后台系统吧',
                hasread: false,
                time: 1507390106000
            },
            {
                title: '喜欢iView-admin的话，欢迎到github主页给个star吧',
                hasread: false,
                time: 1507390106000
            }
        ];
    }
};
</script>

