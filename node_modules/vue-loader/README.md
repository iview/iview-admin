# vue-loader [![Build Status](https://circleci.com/gh/vuejs/vue-loader/tree/master.svg?style=shield)](https://circleci.com/gh/vuejs/vue-loader/tree/master) [![Windows Build status](https://ci.appveyor.com/api/projects/status/8cdonrkbg6m4k1tm/branch/master?svg=true)](https://ci.appveyor.com/project/yyx990803/vue-loader/branch/master) [![npm package](https://img.shields.io/npm/v/vue-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/vue-loader)

> Vue.js component loader for [Webpack](http://webpack.github.io).

**NOTE: the master branch (9.0+) only works with Vue 2.x. For usage with Vue 1.x, see the [8.x branch](https://github.com/vuejs/vue-loader/tree/8.x).**

It allows you to write your components in this format:

![screenshot](http://blog.evanyou.me/images/vue-component.png)

The best way to get started is with [vue-cli](https://github.com/vuejs/vue-cli):

``` js
npm install -g vue-cli
vue init webpack-simple hello
cd hello
npm install
npm run dev
```

This will setup a basic Webpack + `vue-loader` project for you, with `*.vue` files and hot-reloading working out of the box!

For advanced `vue-loader` configuration, checkout the [documentation](http://vuejs.github.io/vue-loader/index.html).
