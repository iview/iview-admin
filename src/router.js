import Main from './views/Main.vue';

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: require('./views/login.vue')
};

export const otherRouter = {
    path: '/',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: require('./views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: require('./views/own-space/own-space.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: require('./views/message/message.vue') }
    ]
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: require('./views/form/article-publish/preview.vue')
};

export const appRouter = [
    // {
    //     path: '/access',
    //     redirect: '/access/index',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: require('./views/access/access.vue') }
    //     ]
    // },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editer',
                icon: 'compose',
                name: 'text-editer',
                title: '富文本编辑器',
                component: require('./views/my_components/text-editer/textEditer.vue')
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: require('./views/my_components/markdown-editor/markdown-editor.vue')
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: require('./views/my_components/draggable-list/draggable-list.vue')
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: require('./views/my_components/file-upload/file-upload.vue')
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                component: require('./views/my_components/count-to/count-to.vue')
            }
        ]
    },
    {
        path: '/form',
        icon: 'ios-grid-view',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [
            { path: 'artical-publish', title: '文章发布', name: 'articalpublish', icon: 'compose', component: require('./views/form/article-publish/article-publish.vue') },
            { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: require('./views/form/work-flow/work-flow.vue') }

        ]
    },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: require('./views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: require('./views/access/access.vue') }

    //     ]
    // },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [
            { path: 'dragableTable', title: '可拖拽排序', name: 'dragableTable', icon: 'arrow-move', component: require('./views/tables/dragable-table.vue') },
            { path: 'editableTable', title: '可编辑单元格', name: 'editableTable', icon: 'edit', component: require('./views/tables/editable-table.vue') },
            { path: 'exportableTable', title: '表格导出数据', name: 'exportableTable', icon: 'code-download', component: require('./views/tables/exportable-table.vue') },
            { path: 'table2image', title: '表格转图片', name: 'table2image', icon: 'images', component: require('./views/tables/table-to-image.vue') }
        ]
    }
];

export const routers = [
    loginRouter,
    otherRouter,
    preview,
    ...appRouter
];
