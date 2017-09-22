# vue-hot-reload-api

> 注意: `vue-hot-reload-api@2.x` 仅支持 `vue@2.x`

Vue components 热加载API。[vue-loader](https://github.com/vuejs/vue-loader) 和 [vueify](https://github.com/vuejs/vueify) 底层使用的就是这个。

## 用法

你仅会在开发一个基于 Vue components 构建工具的时候用到这个。对于普通的应用，使用 `vue-loader` 或者 `vueify` 就可以了。

``` js
// 定义一个组件作为选项对象
const myComponentOptions = {
  data () { ... },
  created () { ... },
  render () { ... }
}

// 检测 Webpack 的 HMR API
// https://webpack.github.io/docs/hot-module-replacement.html
if (module.hot) {
  const api = require('vue-hot-reload-api')
  const Vue = require('vue')

  // 将 API 安装到 Vue，并且检查版本的兼容性
  api.install(Vue)

  // 在安装之后使用 api.compatible 来检查兼容性
  if (!api.compatible) {
    throw new Error('vue-hot-reload-api与当前Vue的版本不兼容')
  }

  // 此模块接受热重载
  module.hot.accept()

  if (!module.hot.data) {
    // 为了将每一个组件中的选项变得可以热加载，
    // 你需要用一个不重复的id创建一次记录，
    // 只需要在启动的时候做一次。
    api.createRecord('very-unique-id', myComponentOptions)
  } else {
    // 如果一个组件只是修改了模板或是 render 函数，
    // 只要把所有相关的实例重新渲染一遍就可以了，而不需要销毁重建他们。
    // 这样就可以完整的保持应用的当前状态。
    api.rerender('very-unique-id', myComponentOptions)

    // --- 或者 ---

    // 如果一个组件更改了除 template 或 render 之外的选项，
    // 就需要整个重新加载。
    // 这将销毁并重建整个组件（包括子组件）。
    api.reload('very-unique-id', myComponentOptions)
  }
}
```

## License

[MIT](http://opensource.org/licenses/MIT)
