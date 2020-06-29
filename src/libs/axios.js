import axios from "axios";
import store from "@/store";
import { getToken } from "./util";
import { Message } from "iview";
// import { Spin } from 'iview'

const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: { responseURL }
  } = errorInfo;
  let info = {
    type: "ajax",
    code: status,
    mes: statusText,
    url: responseURL
  };
  if (!responseURL.includes("save_error_logger")) {
    store.dispatch("addErrorLog", info);
  }
};

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 如果响应含有token -> 让每个请求携带token，将token放入请求头的Authorization
        getToken() && (config.headers.Authorization = "Bearer " + getToken());
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        switch (res.status) {
          case 200: // 200 -> 服务器连接正确
            if (res.data.status !== true && res.data.status !== 200) {
              // 全局提示5秒的错误讯息
              Message.error({ content: res.data.message, duration: 5 });
            }
            break;
          case 500: // 500 -> 服务器错误
            console.log(res.status.message);
            Message.error({
              content: "服务器异常，请联系技术人员",
              duration: 5
            });
            break;
        }
        this.destroy(url);
        const { data, status } = res;
        return { data, status };
      },
      error => {
        this.destroy(url);
        addErrorLog(error.response);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
