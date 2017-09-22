import Main from './views/Main.vue';

export const login_router = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: require('./login.vue')
}

export const home_router = {
    path: '/',
    redirect: '/home',
    name: 'home',
    title: '首页',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: require('./views/home/home.vue') }
    ]
}

export const app_router = [
    {
        path: '/access',
        redirect: '/access/index',
        icon: 'search',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: require('./views/access/access.vue') }
        ]
    },
    {
        path: '/icons',
        redirect: '/icons/index',
        icon: 'search',
        name: 'icons',
        title: 'Icon图标',
        component: Main,
        children: [
            { path: 'index', title: 'Icon图标', name: 'icons_index', component: require('./views/icons/icons.vue') }
        ]
    },
    {
        path: '/component',
        icon: 'search',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'search',
                name: 'text-editor',
                title: '富文本编辑器',
                component: require('./views/my_components/text-editor.vue')
            },
            {
                path: 'avatar-editor',
                icon: 'search',
                name: 'avatar-editor',
                title: '头像编辑器',
                component: require('./views/my_components/avator-editor.vue')
            }
        ]
    }
]

export const routers = [
    login_router,
    home_router,
    ...app_router
]

export const RouterConfig = {
    mode: 'history',
    routes: routers
};
