/* eslint-disable no-extra-boolean-cast */

// 生成url参数后缀
export const getUrlParams = urlParams => {
    if (!!!urlParams) return '';
    else {
        let paramStr = '?';
        for (let key in urlParams) {
            paramStr += key + '=' + urlParams[key] + '&';
        }
        return paramStr.substr(0, paramStr.length - 1);
    }
};

// 生成kv形式的body参数
export const getPostParams = (params, compact = false) => {
    let result = '';
    if (!compact) {
        for (let key in params) {
            result = `${result}&${key}=${encodeURIComponent(params[key])}`;
        }
    } else {
        for (let key in params) {
            if (params[key] !== null) {
                result = `${result}&${key}=${encodeURIComponent(params[key])}`;
            }
        }
    }
    return result.substr(1);
};

// 通用fetch模板，用于处理异常和超时的场景
export const fetchWithTimeout = (url, params) => {
    return Promise.race([
        fetch(url, params),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('request timeout'));
            }, 1000 * 30);
        }),
    ]).then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(res => {
            window.console.log(res);
            return {
                status: 'fail',
                msg: 'request timeout',
            };
        });
};
