import request from '@/utils/request'

// 获取账号列表（表格）
export function getAccountList(params) {
  return request({
    url: '/api/v1/accounts',
    method: 'get',
    params
  })
}

// 获取账号密码
export function getAccountPassword(data) {
  return request({
    url: '/api/v1/account/password/' + data.id,
    method: 'get'
  })
}

// 获取短信校验码
export function getCode() {
  return request({
    url: '/api/v1/account/code',
    method: 'get'
  })
}

// 校验码检验
export function codeVerification(data) {
  return request({
    url: '/api/v1/account/code_verification',
    method: 'post',
    data
  })
}

// 新增账号
export function addAccount(data) {
  return request({
    url: '/api/v1/account',
    method: 'post',
    data
  })
}

// 批量新增账号
export function addAccounts(data) {
  return request({
    url: '/api/v1/accounts',
    method: 'post',
    data
  })
}

// 删除账号
export function deleteAccount(data) {
  return request({
    url: '/api/v1/account/' + data.id,
    method: 'delete'
  })
}

// 修改账号信息
export function changeAccount(data) {
  return request({
    url: '/api/v1/account',
    method: 'put',
    data
  })
}

// 修改密码
export function changeAccountPassword(data) {
  return request({
    url: '/api/v1/account/password',
    method: 'put',
    data
  })
}

// 账号分享
export function shareAccount(data) {
  return request({
    url: '/api/v1/account/users',
    method: 'put',
    data
  })
}
