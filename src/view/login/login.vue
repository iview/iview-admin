<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import loginForm from '_c/login-form'
import { mapMutations } from 'vuex'
export default {
  components: {
    loginForm
  },
  methods: {
    ...mapMutations([
      'handleLogin'
    ]),
    handleSubmit ({userName, password}) {

    }
  }
}
</script>

<style>

</style>
