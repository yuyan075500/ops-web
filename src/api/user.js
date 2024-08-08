import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 用户注销
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

// 获取当前登录的用户信息
export function getUserInfo() {
  return request({
    url: '/api/v1/user/info',
    method: 'get'
  })
}

// 获取谷歌双因素认证二维码
export function getGoogleQrcode(params) {
  return request({
    url: '/api/v1/user/mfa_qrcode',
    method: 'get',
    params
  })
}

// 谷歌双因素认证
export function mfaAuth(data) {
  return request({
    url: '/api/v1/user/mfa_auth',
    method: 'post',
    data
  })
}
