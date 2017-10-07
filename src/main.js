import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import {routers, otherRouter, appRouter} from './router';
// import appRouter from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import Cookies from 'js-cookie';
import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import Locales from './locale';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
const mergeEN = Object.assign(enLocale, locales['en-US']);
Vue.locale('zh-CN', mergeZH);
Vue.locale('en-US', mergeEN);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (!Cookies.get('user') && to.name !== 'login') {
        next({
            name: 'login'
        });
    } else if (Cookies.get('user') && to.name === 'login') {
        next({
            name: 'home'
        });
    } else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
// 状态管理
const store = new Vuex.Store({
    state: {
        routers: [
            otherRouter,
            ...appRouter
        ],
        appRouter: appRouter,
        tagsList: [...otherRouter.children],
        pageOpenedList: localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],  // 面包屑数组
        openedSubmenuArr: [],  // 要展开的菜单数组
        menuTheme: localStorage.menuTheme ? localStorage.menuTheme : 'dark', // 主题
        theme: localStorage.theme ? localStorage.theme : 'b'
    },
    getters: {

    },
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        increateTag (state, tagObj) {
            state.pageOpenedList.splice(1, 0, tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList); // 本地存储已打开页面
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        moveToSecond (state, index) {
            let openedPage = state.pageOpenedList[index];
            state.pageOpenedList.splice(index, 1);
            state.pageOpenedList.splice(1, 0, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        changeTheme (state, theme) {
            state.menuTheme = theme;
        }
    },
    actions: {

    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    methods: {
        init () {
            this.currentPageName = this.$route.name;
            if (localStorage.theme) {
                if (localStorage.theme !== 'b') {
                    let stylesheetPath = '../src/styles/' + this.$store.state.theme + '.css';
                    let themeLink = document.querySelector('link[name="theme"]');
                    themeLink.setAttribute('href', stylesheetPath);
                }
            }
        }
    },
    mounted () {
        this.init();
    }
});
