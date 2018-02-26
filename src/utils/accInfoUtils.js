import Cookies from 'js-cookie';
import * as AppConst from '../constants/appConst';

let accFuncSet = {
    // 设置登录用户信息
    setAccountInfo: acc => {
        Cookies.set(AppConst.ACCOUNT_ID, acc.id);
        Cookies.set(AppConst.ACCOUNT_ROLE, acc.role);
        Cookies.set(AppConst.ACCOUNT_NAME, acc.name ? acc.name : '');
        Cookies.set(AppConst.ACCOUNT_PHONE, acc.phone ? acc.phone : '');
        Cookies.set(AppConst.ACCOUNT_MAIL, acc.mail ? acc.mail : '');
    },

    // 获取登录用户信息
    getAccountInfo: () => {
        return {
            id: Cookies.get(AppConst.ACCOUNT_ID),
            role: Cookies.get(AppConst.ACCOUNT_ROLE),
            name: Cookies.get(AppConst.ACCOUNT_NAME),
            phone: Cookies.get(AppConst.ACCOUNT_PHONE),
            mail: Cookies.get(AppConst.ACCOUNT_MAIL),
        };
    },

    // 清除用户信息
    clearAccountInfo: () => {
        Cookies.remove(AppConst.ACCOUNT_ID);
        Cookies.remove(AppConst.ACCOUNT_ROLE);
        Cookies.remove(AppConst.ACCOUNT_NAME);
        Cookies.remove(AppConst.ACCOUNT_PHONE);
        Cookies.remove(AppConst.ACCOUNT_MAIL);
    },

    // 登录判定
    isLogin: () => {
        return !!Cookies.get(AppConst.ACCOUNT_ID);
    },

    // 生成接口验证的header信息，使用简写方式避免箭头函数对this上下文的绑定问题
    getAuthHeader (httpMethod) {
        return {
            'content-type': (() => {
                switch (httpMethod) {
                    case AppConst.HTTP.POST:
                        return 'application/x-www-form-urlencoded';
                    case AppConst.HTTP.GET:
                    default:
                        return 'text/html';
                }
            })(),
            'ck': this.getClientKey(),
            'id': Cookies.get(AppConst.ACCOUNT_ID),
        };
    },

    // 客户端验证信息
    // 可以使用密钥/token，取决于后端实现方案
    getClientKey: () => {
        return 'sample_key';
    },
};

// 后台用户信息方法集合
export default accFuncSet;
