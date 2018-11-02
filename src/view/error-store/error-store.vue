<template>
  <div>
    <Card>
      iview-admin会自动将你程序中的错误收集起来，你可以将错误日志发给后端保存起来。如果你不需要这个功能，将'./src/config/index.js'里的plugin的'error-store'属性删掉即可。
      另外在开发环境下，你程序中的错误都会被收集起来，这样可能不利于你排查错误，你可以将'./src/config/index.js'的'error-store'的'developmentOff'设为true。
      如果你只是想收集错误日志，不希望登录用户看到错误日志，你可以不提供查看日志的入口，只需将'./src/config/index.js'的'error-store'的'showInHeader'设为false。
    </Card>
    <Card style="margin-top: 20px;">
      <Row>
        <i-col span="8">
          <Button @click="click" style="display: block">点击测试触发程序错误</Button>
          <Button @click="ajaxClick" style="margin-top:10px;">点击测试触发ajax接口请求错误</Button>
        </i-col>
        <i-col span="16">
          ajax接口请求是请求easy-mock的一个不存在接口，所以服务端会报404错误，错误收集机制会收集这个错误，测试的时候有一定网络延迟，所以点击按钮之后稍等一会才会收集到错误。
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { errorReq } from '@/api/data'
export default {
  name: 'error_store_page',
  methods: {
    click () {
      console.log(admin)
    },
    ajaxClick () {
      errorReq()
    }
  }
}
</script>

<style>

</style>
