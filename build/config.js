import Env from './env';

let config = {
    env: Env,
    domain: Env === 'development'
        ? 'http://127.0.0.1:8888'   // 开发环境url
        : Env === 'production'      
            ? 'https://www.url.com' // 生产环境url
            : 'https://debug.url.com', // debug url
    cdn: 'https://fe-source.cdn.com',   // 前端资源托管cdn
};

export default config;
