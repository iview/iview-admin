<style lang="less">
    @import './unlock.less';
</style>

<template>
    <transition name="show-unlock">
        <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
            <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                <img class="unlock-avator-img" :src="avatorPath">
                <div  class="unlock-avator-cover">
                    <span><Icon type="unlocked" :size="30"></Icon></span>
                    <p>解锁</p>
                </div>
            </div>
            <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
            <div class="unlock-input-con">
                <div class="unlock-input-overflow-con">
                    <div class="unlock-overflow-body" :style="{right: inputLeft}">
                        <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
                        <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"><Icon color="white" type="key"></Icon></button>
                    </div>
                </div>
            </div>
            <div class="unlock-locking-tip-con">已锁定</div>
        </div>
    </transition>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'Unlock',
    data () {
        return {
            avatorLeft: '0px',
            inputLeft: '400px',
            password: ''
        };
    },
    props: {
        showUnlock: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        handleClickAvator () {
            this.avatorLeft = '-180px';
            this.inputLeft = '0px';
            this.$refs.inputEle.focus();
        },
        handleUnlock () {
            if (Cookies.get('password') === this.password) {
                this.avatorLeft = '0px';
                this.inputLeft = '400px';
                this.password = '';
                this.$store.commit('unlock');
                this.$emit('on-unlock');
            } else {
                this.$Message.error('密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证');
            }
        },
        unlockMousedown () {
            this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
        },
        unlockMouseup () {
            this.$refs.unlockBtn.className = 'unlock-btn';
        }
    }
};
</script>
