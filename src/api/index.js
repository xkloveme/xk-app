import request from "./request";


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    request.get(url, {
      params: params
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    request.post(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    request.put(url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}
/**
 * 封装delete方法
 * @param url
 * @param data
 * @returns {Promise}
 */
function del (url, params = {}) {
  return new Promise((resolve, reject) => {
    request.delete(url, {
      params: params
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  })
}
export default {
  get,
  post,
  put,
  del
}