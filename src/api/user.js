import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

// 钉钉扫码登录
export function GetDingTalkAuthorize(data) {
  return request({
    url: '/api/auth/dingtalk_login',
    method: 'post',
    data
  })
}

// 企业微信扫码登录
export function GetWeChatAuthorize(data) {
  return request({
    url: '/api/auth/ww_login',
    method: 'post',
    data
  })
}

// 飞书扫码登录
export function GetFeishuAuthorize(data) {
  return request({
    url: '/api/auth/feishu_login',
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

// OAuth2授权
export function GetOAuthAuthorize(data) {
  return request({
    url: '/api/v1/sso/oauth/authorize',
    method: 'post',
    data
  })
}

// CAS授权
export function GetCASAuthorize(data) {
  return request({
    url: '/api/v1/sso/cas/authorize',
    method: 'post',
    data
  })
}

// SAML2授权
export function GetSAMLAuthorize(data) {
  return request({
    url: '/api/v1/sso/saml/authorize',
    method: 'post',
    data
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
