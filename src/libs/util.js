import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function (title) {
    title = title || 'iView admin';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
    ? 'http://127.0.0.1:8888'
    : env === 'production'
    ? 'https://www.url.com'
    : 'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.map(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && itAccess.isArray()) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getPathObjByName = function (vm, name) {
    let pathObj = vm.$store.state.routers.filter((item) => {
        if (item.children.length <= 1) {
            return item.name === name;
        } else {
            let i = 0;
            let childArr = item.children;
            let len = childArr.length;
            while (i < len) {
                if (childArr[i].name === name) {
                    return true;
                }
                i++;
            }
            return false;
        }
    })[0];
    return pathObj;
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = item.title;
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = child.title;
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: '首页',
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu) {
    let pageOpenedList = vm.$store.state.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {  // 页面已经打开
            vm.$store.commit('moveToSecond', {
                index: i,
                argu: argu
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        tag = tag.children ? tag.children[0] : tag;
        if (argu) {
            tag.argu = argu;
        }
        vm.$store.commit('increateTag', tag);
        localStorage.pageOpenedList = JSON.stringify(vm.$store.state.pageOpenedList); // 本地存储已打开页面
    }
    vm.$store.commit('setCurrentPageName', name);
};

export default util;
