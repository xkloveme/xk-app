import axios from "axios";
import { toast } from 'vue3-toastify';
import errorCode from "@/utils/errorCode";

// 是否隐藏响应提示
let hideLoading = false;
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 60000
});

// request拦截器
service.interceptors.request.use(
  config => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // if (getToken() && !isToken) {
    //   config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    if (config.baseURL) {
      axios.defaults.baseURL = config.baseURL;
    }
    // 是否隐藏ElMessage.error响应提示
    hideLoading = !!config.hideLoading;
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    if (code === 401) {
      let msgErr = "登录状态已过期，您可以继续留在该页面，或者重新登录"
      !hideLoading &&
        toast.error(msgErr);
      return Promise.reject(msgErr);
    } else if (code === 500) {
      !hideLoading &&
        toast.error(msg);
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      !hideLoading &&
        toast.error(msg);
      return Promise.reject("error");
    } else {
      return Promise.resolve(res.data);
    }
  },
  error => {
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message && message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message && message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    toast.error(message || "后端接口连接异常");
    return Promise.reject(error);
  }
);


export default service;
