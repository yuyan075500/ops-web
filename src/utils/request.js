import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建1个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 浏览器请求超时时间，单位：毫秒
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在此处添加发送请求前的一些操作

    if (store.getters.token) {
      // 指定后端认证请求头的参数名，根据实际情况修改
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // 请求错误动作
    console.log(error)
    return Promise.reject(error)
  }
)

// 返回拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 指定后端返回的正确业务状态码，默认为0
    if (res.code !== 0) {
      // 业务状态码为0的请求处理

      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 返回的HTTP状态码非200的请求处理
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
