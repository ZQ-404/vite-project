/**
 * axios二次封装
 */
import axios from "axios";
import config from "../config";
import router from "../router";
import { ElMessage } from "element-plus";
import storage from "../utils/storage";
const TOKEN_INVALID = "Token认证失败，请重新登录";
const NETWORK_ERROR = "网络请求异常，请稍后重试";
//创建axios实例对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
});
//请求拦截
service.interceptors.request.use((req) => {
  // TO-DO
  const headers = req.headers;
  //判断JWT字段(Authorization)是否存在
  const { token = "" } = storage.getItem("userInfo") || {};
  if (!headers.Authorization) headers.Authorization = "Bear " + token;
  return req;
});
//响应拦截
service.interceptors.response.use((res) => {
  // TO-DO
  const { code, data, msg } = res.data;
  //200表示请求成功
  if (code === 200) {
    return data;
  }
  //40001表示登录失效
  else if (code === 40001) {
    // ElMessage.error(msg);
    //页面提示错误信息
    ElMessage.error(TOKEN_INVALID);
    setTimeout(() => {
      //提示信息出现之后，跳转到登录页面
      router.push("./login");
    }, 15000);
    //控制台抛出异常信息
    return Promise.reject(TOKEN_INVALID);
  }
  //网络异常报错
  else {
    ElMessage.error(msg || NETWORK_ERROR);
    return Promise.reject(msg || NETWORK_ERROR);
  }
});
/**
 * 请求核心函数
 * @param {*} options 请求配置
 * @returns
 */
function request(options) {
  //获取请求方式
  options.method = options.method || "get";
  //判断请求方式
  if (options.method.toLowerCase() === "get") {
    options.params = options.data;
  }
  if (typeof options.mock !== "undefined") {
    config.mock = options.mock;
  }
  //判断生产环境
  if (config.dev === "production") {
    //如果是生产环境就需要去调用baseApi
    service.defaults.baseURL = config.baseApi;
  } else {
    //如果不是生产环境，就判断mock是否为true
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
  }
  return service(options);
}
["get", "post", "put", "delete", "patch"].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    });
  };
});
export default request;
