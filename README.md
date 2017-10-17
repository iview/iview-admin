<p align="center">
    <a href="https://www.iviewui.com">
        <img width="200" src="https://file.iviewui.com/logo.svg">
    </a>
</p>

# iView Admin
[![](https://img.shields.io/travis/iview/iview-admin.svg?style=flat-square)](https://travis-ci.org/iview/iview-admin)
[![vue](https://img.shields.io/badge/vue-2.5.2-brightgreen.svg?style=flat-square)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/iview-2.5.0-brightgreen.svg?style=flat-square)](https://github.com/iview/iview)
## Run

```
npm run dev
```

## 简介
iView admin是基于Vue.js，搭配使用[iView](https://www.iviewui.com) UI组件库形成的一套后台集成解决方案，由TalkingData前端可视化团队部分成员开发维护。iView admin遵守iView设计和开发约定，风格统一，设计考究，并且更多功能在不停开发中。

## 功能

- 登录/登出
- 权限管理
    - 列表过滤
    - 权限切换
- 组件
    - 富文本编辑器
    - Markdown编辑器
    - 可拖拽列表
    - 文件上传
    - 数字渐变
- 表单编辑
    - 文章发布
    - 工作流
- 表格
    - 可拖拽排序
    - 可编辑表格
        - 行内编辑
        - 单元格编辑
    - 表格导出数据
        - 导出为Csv文件
        - 导出为Xls文件
    - 表格转图片
- 错误页面
    - 401页面
    - 404页面
    - 500页面
- 换肤
- 收缩侧边栏
- tag标签导航
- 面包屑导航
- 全屏/退出全屏
- 锁屏
- 消息中心
- 个人中心

## 文件结构
```shell
.
├── dist
│   ├── langs
│   ├── plugins
│   │   ├── advlist
│   │   ├── anchor
│   │   ├── autolink
│   │   ├── autoresize
│   │   ├── autosave
│   │   ├── bbcode
│   │   ├── charmap
│   │   ├── code
│   │   ├── codesample
│   │   │   └── css
│   │   ├── colorpicker
│   │   ├── contextmenu
│   │   ├── directionality
│   │   ├── emoticons
│   │   │   └── img
│   │   ├── fullpage
│   │   ├── fullscreen
│   │   ├── help
│   │   │   └── img
│   │   ├── hr
│   │   ├── image
│   │   ├── imagetools
│   │   ├── importcss
│   │   ├── insertdatetime
│   │   ├── legacyoutput
│   │   ├── link
│   │   ├── lists
│   │   ├── media
│   │   ├── nonbreaking
│   │   ├── noneditable
│   │   ├── pagebreak
│   │   ├── paste
│   │   ├── preview
│   │   ├── print
│   │   ├── save
│   │   ├── searchreplace
│   │   ├── spellchecker
│   │   ├── tabfocus
│   │   ├── table
│   │   ├── template
│   │   ├── textcolor
│   │   ├── textpattern
│   │   ├── toc
│   │   ├── visualblocks
│   │   │   └── css
│   │   ├── visualchars
│   │   └── wordcount
│   ├── skins
│   │   └── lightgray
│   │       ├── fonts
│   │       └── img
│   └── themes
│       ├── inlite
│       ├── mobile
│       └── modern
├── github-gif
└── src
    ├── config
    ├── images
    ├── libs
    ├── styles
    │   └── fonts
    ├── template
    └── views
        ├── access
        ├── error_page
        ├── form
        │   ├── article-publish
        │   └── work-flow
        ├── home
        │   ├── components
        │   │   └── styles
        │   └── map-data
        ├── main_components
        ├── message
        ├── my_components
        │   ├── avator-editer
        │   ├── count-to
        │   ├── draggable-list
        │   ├── file-upload
        │   ├── markdown-editor
        │   └── text-editer
        ├── own-space
        ├── screen-shorts
        └── tables
            ├── components
            └── data
```
## 效果展示

- 登录
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/home.gif)

- 标签导航
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/tags.gif)

- 权限管理
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/access.gif)

- 可拖拽列表
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/dragable-list.gif)

- 文件上传
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/upload.gif)

- 数字渐变
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/count-to.gif)

- 文章发布
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/article-publish.gif)

- 工作流
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/workflow.gif)

- 可拖拽表格
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/dragable-table.gif)

- 可编辑表格
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/editable-table.gif)

- 表格导出数据
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/exportable-table.gif)

- 表格转图片
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/table2image.gif)

- 错误页面
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/error-page.gif)

- 锁屏
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/locking.gif)

- 可收缩侧边栏
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/sidebarmenu.gif)s

- 主题切换
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/theme.gif)

- 消息中心
![image](https://github.com/iview/iview-admin/raw/dev/github-gif/message.gif)

## Links

- [TalkingData](https://github.com/TalkingData)
- [Vue](https://github.com/vuejs/vue)
- [Webpack](https://github.com/webpack/webpack)

## License
[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-present, iView
