import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'ownspace/:username', title: '带参个人中心', name: 'ownspace_with_name', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },  // 用于展示带参路由
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: resolve => { require(['./views/argument-page/order-info.vue'], resolve); } },  // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        redirect: '/access/index',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['./views/access/access.vue'], resolve); } }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '权限测试页', name: 'accesstest_index' }
        ]
    },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '富文本编辑器',
                component: resolve => { require(['./views/my_components/text-editor/text-editor.vue'], resolve); }
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: resolve => { require(['./views/my_components/markdown-editor/markdown-editor.vue'], resolve); }
            },
            {
                path: 'image-editor',
                icon: 'crop',
                name: 'image-editor',
                title: '图片预览编辑',
                component: resolve => { require(['./views/my_components/image-editor/image-editor.vue'], resolve); }
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: resolve => { require(['./views/my_components/draggable-list/draggable-list.vue'], resolve); }
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: resolve => { require(['./views/my_components/file-upload/file-upload.vue'], resolve); }
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                component: resolve => { require(['./views/my_components/count-to/count-to.vue'], resolve); }
            }
        ]
    },
    {
        path: '/form',
        icon: 'android-checkbox',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [
            { path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: resolve => { require(['./views/form/article-publish/article-publish.vue'], resolve); } },
            { path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: resolve => { require(['./views/form/work-flow/work-flow.vue'], resolve); } }

        ]
    },
    // {
    //     path: '/charts',
    //     icon: 'ios-analytics',
    //     name: 'charts',
    //     title: '图表',
    //     component: Main,
    //     children: [
    //         { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: resolve => { require('./views/access/access.vue') },
    //         { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: resolve => { require('./views/access/access.vue') }

    //     ]
    // },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [
            { path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: resolve => { require(['./views/tables/dragable-table.vue'], resolve); } },
            { path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: resolve => { require(['./views/tables/editable-table.vue'], resolve); } },
            { path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['./views/tables/exportable-table.vue'], resolve); } },
            { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['./views/tables/table-to-image.vue'], resolve); } }
        ]
    },
    {
        path: '/argument-page',
        icon: 'ios-infinite',
        name: 'argupage',
        title: '带参页面',
        component: Main,
        children: [
            { path: 'index', title: '带参页面', name: 'argupage_index', component: resolve => { require(['./views/argument-page/argument-page.vue'], resolve); } }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            { path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['./views/error_page/error-page.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
