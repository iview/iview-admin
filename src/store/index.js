import Vue from 'vue';
import Vuex from 'vuex';
import Util from '@/libs/util';

import app from './modules/app';
import user from './modules/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        dontCache: ['text-editor', 'artical-publish']  // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.app.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.app.cachePage);
            }
            state.app.pageOpenedList.push(tagObj);
        }
    },
    actions: {

    },
    modules: {
        app,
        user
    }
});

export default store;
