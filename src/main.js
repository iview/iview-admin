import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import {routers, homeRouter, appRouter} from './router';
// import appRouter from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
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
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
// 状态管理
const store = new Vuex.Store({
    state: {
        routers: [
            homeRouter,
            ...appRouter
        ],
        appRouter: appRouter,
        tagsList: [],
        pageOpenedList: localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [homeRouter.children[0]],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ],  // 面包屑数组
        openedSubmenuArr: []  // 要展开的菜单数组
    },
    getters: {

    },
    mutations: {
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        increateTag (state, tagObj) {
            state.pageOpenedList.splice(1, 0, tagObj);
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        moveToSecond (state, index) {
            let openedPage = state.pageOpenedList[index];
            state.pageOpenedList.splice(index, 1);
            state.pageOpenedList.splice(1, 0, openedPage);
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        addOpenSubmenu (state, name) {
            let i = 0;
            let hasThisName = false;
            let isEmpty = false;
            while (state.openedSubmenuArr[i]) {
                if (name.length === 0) {
                    isEmpty = true;
                }
                if (state.openedSubmenuArr[i] === name) {
                    hasThisName = true;
                }
                i++;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
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
        }
    }
});
