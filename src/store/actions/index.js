/* eslint-disable no-extra-boolean-cast */
import * as utils from '../../utils/index';
import userGroupMeta from './userGroup';

// 生成接口请求方法
const _generateApiFunction = (meta) => {
    // 返回一个接受commit和载荷的函数
    return ({ commit }, params) => {
        if (!!!params) {
            params = {
                urlParams: {},
                bodyParams: {},
            };
        }
        let fetchParams = {
            method: meta.httpMethod,
            body: !!params.bodyParams ? utils.getPostParams(params.bodyParams) : '',
            // headers: ActionContext.getAuthHeader(apiUnit.httpMethod),
        };
        // 如果是get方法移除body参数
        if (meta.httpMethod === 'get') delete fetchParams.body;
        return utils.fetchWithTimeout(meta.url + utils.getUrlParams(params.urlParams), fetchParams);
    };
};

// 动态生成接口方法集合
export default (() => {
    let actSet = {};
    let metas = {
        ...userGroupMeta,
    };
    for (let meta in metas) {
        if (metas.hasOwnProperty(meta)) {
            actSet[meta] = _generateApiFunction(metas[meta]);
        }
    }
    return actSet;
})();
