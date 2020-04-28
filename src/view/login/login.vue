<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
// function
import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由

export default {
  components: {
    LoginForm
  },
  created() {
    localStorage.setItem("dynamicRouter", []);
    refreshRoute();
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo", "getRouters"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        res.data.status === 200 &&
          this.getUserInfo().then(res => {
            this.getRouters().then(resRoutes => {
              this.$router.push({
                name: this.$config.homeName
              });
            });
          });
      });
    }
  }
};
</script>

<style>
</style>
