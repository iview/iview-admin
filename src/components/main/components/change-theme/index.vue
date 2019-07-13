<template>
  <ColorPicker class="change-theme" v-model="primaryColor" @input="changeThemeColor"/>
</template>

<script>
import client from 'webpack-theme-color-replacer/client'
import colorUtil from 'webpack-theme-color-replacer/forElementUI'

export default {
  data () {
    return {
      primaryColor: localStorage.getItem('theme_color') || '#2d8cf0'
    }
  },
  created () {
    this.changeThemeColor(this.primaryColor)
  },
  methods: {
    changeThemeColor (primaryColor) {
      let options = {
        newColors: colorUtil.getElementUISeries(primaryColor).concat('#fff'),
        changeUrl (cssUrl) {
          return `/${cssUrl}` // while router is not `hash` mode, it needs absolute path
        }
      }
      client.changer.changeColor(options, Promise).then(t => {
        localStorage.setItem('theme_color', primaryColor)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .change-theme {
    /deep/ .ivu-color-picker-input {
      width: 34px;
      cursor: pointer;
      border-color: transparent;
      padding-right: 8px;
      margin-right: 4px;
    }

    /deep/ .ivu-icon-ios-arrow-down {
      display: none;
    }
  }
</style>
