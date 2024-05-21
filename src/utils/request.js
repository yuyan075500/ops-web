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
    return Promise.reject(error)
  }
)

// 返回拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 业务状态码为非0的请求处理（0表示正常的业务状态码）
    if (res.code !== 0) {
      // 在浏览器中显示错误信息
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })

      // 如果状态码为90514表示Token无效或Token过期，进行特殊处理
      if (res.code === 90514) {
        // 重新登录
        MessageBox.confirm('无效的Token或认证已过期，请重新登录。', {
          confirmButtonText: '重新登录',
          cancelButtonText: '关闭',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        return Promise.reject(new Error(res.msg))
      }
    } else {
      return res
    }
  },
  error => {
    // HTTP状态码非200的请求处理
    Message({
      message: error.msg,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
