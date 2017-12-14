import axios from "axios";
import qs from "qs";
import env from '../../build/env';
import { Message }  from 'iview';
import Cookies from 'js-cookie';
import router from "../router";

const ajaxUrl = env === 'development'
    ? 'http://test.legions9.com:8088'
    : env === 'production'
    ? 'https://www.url.com'
    : 'https://debug.url.com';


const Axios = axios.create({
	baseURL: ajaxUrl, 
	timeout: 10000,
	responseType: "json",
	withCredentials: true
});

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
	config => {
		console.log(Cookies.get('token'));
		// 若是有做鉴权token , 就给头部带上token
		if(Cookies.get('token')) {
			config.headers['token_'] = Cookies.get('token');
		}
		return config;
	},
	error => {
		Message.error(error);
		return Promise.reject(error.data.error.message);
	}
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
	res => {
		//对响应数据做些事
		if(res.data.code!=0) {
			Message.error(
					res.data.data
			);
			return Promise.reject(res.data.data);
		}
		return res;
	},
	error => {
		// 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
		// 直接丢localStorage或者sessionStorage
		if(!window.localStorage.getItem("loginUserBaseInfo")) {
			// 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
			router.push({
				path: "/login"
			});
		} else {
			// 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
			// 乖乖的返回去登录页重新登录
			let lifeTime =
				JSON.parse(window.localStorage.getItem("loginUserBaseInfo")).lifeTime *
				1000;
			let nowTime = new Date().getTime(); // 当前时间的时间戳
			console.log(nowTime, lifeTime);
			console.log(nowTime > lifeTime);
			if(nowTime > lifeTime) {
				Message.error("登录状态信息过期,请重新登录");
				router.push({
					path: "/login"
				});
			} else {
				// 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
				if(error.response.status === 403) {
					router.push({
						path: "/error/403"
					});
				}
				if(error.response.status === 500) {
					router.push({
						path: "/error/500"
					});
				}
				if(error.response.status === 502) {
					router.push({
						path: "/error/502"
					});
				}
				if(error.response.status === 404) {
					router.push({
						path: "/error/404"
					});
				}
			}
		}
		// 返回 response 里的错误信息
		let errorInfo = error.data.error ? error.data.error.message : error.data;
		return Promise.reject(errorInfo);
	}
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
	install: function(Vue, Option) {
		Object.defineProperty(Vue.prototype, "$http", {
			value: Axios
		});
	}
};