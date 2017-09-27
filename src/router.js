import Main from './views/Main.vue';

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: require('./login.vue')
};

export const homeRouter = {
    path: '/',
    redirect: '/home',
    name: 'home',
    title: '首页',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: require('./views/home/home.vue') }
    ]
};

export const appRouter = [
    {
        path: '/access',
        redirect: '/access/index',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: require('./views/access/access.vue') }
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
                component: require('./views/my_components/text-editor.vue')
            },
            {
                path: 'avatar-editor',
                icon: 'ios-crop-strong',
                name: 'avatar-editor',
                title: '头像编辑器',
                component: require('./views/my_components/avator-editor.vue')
            }
        ]
    },
    {
        path: '/charts',
        icon: 'ios-analytics',
        name: 'charts',
        title: '图表',
        component: Main,
        children: [
            { path: 'pie', title: '饼状图', name: 'pie', icon: 'ios-pie', component: require('./views/access/access.vue') },
            { path: 'histogram', title: '柱状图', name: 'histogram', icon: 'stats-bars', component: require('./views/access/access.vue') }

        ]
    }
];

export const routers = [
    loginRouter,
    homeRouter,
    ...appRouter
];

export const RouterConfig = {
    mode: 'history',
    routes: routers
};
