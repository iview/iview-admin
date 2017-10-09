<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-box">
            <h2>欢迎登录iView-admin</h2>
            <animate-input color="#fff" icon="person" canclear label="账号" v-model="userName"></animate-input>
            <div class="login-item-con">
                <animate-input type="password" color="#fff" icon="ios-locked" canclear label="密码" v-model="password"></animate-input>            
            </div>
            <div class="login-submit-con">
                <div @click="handleSubmit" class="login-submit-btn"><Icon type="checkmark-circled"></Icon><span>登录</span></div>
            </div>
            <div class="login-tips">
                输入任意用户名和密码即可登录
            </div>
        </div>
    </div>
</template>

<script>
import AnimateInput from './login_components/AnimateInput.vue';
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            userName: '',
            password: ''
        };
    },
    components: {
        AnimateInput
    },
    methods: {
        handleSubmit () {
            if (this.userName.length !== 0) {
                if (this.password.length !== 0) {
                    Cookies.set('user', this.userName);
                    Cookies.set('password', this.password);
                    this.$router.push({
                        name: 'home_index'
                    });
                } else {
                    this.$Message.error('请输入密码');
                }
            } else {
                this.$Message.error('请输入用户名');
            }
        }
    }
};
</script>

<style>

</style>
