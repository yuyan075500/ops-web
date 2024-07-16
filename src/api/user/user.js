import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params
  })
}

// 获取用户列表（所有）
export function getUserListAll() {
  return request({
    url: '/api/v1/user/list',
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/v1/user',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/api/v1/user/' + data.id,
    method: 'delete'
  })
}

// 修改用户
export function changeUser(data) {
  return request({
    url: '/api/v1/user',
    method: 'put',
    data
  })
}

// 密码重置（管理员重置）
export function resetPassword(data) {
  return request({
    url: '/api/v1/user/reset_password',
    method: 'put',
    data
  })
}

// MFA重置
export function resetMFA(data) {
  return request({
    url: '/api/v1/user/reset_mfa/' + data.id,
    method: 'put'
  })
}

// 获取校验码
export function getVerificationCode(data) {
  return request({
    url: '/api/v1/sms/reset_password_code',
    method: 'post',
    data
  })
}

// 密码重置（用户自助）
export function resetPasswordSelf(data) {
  return request({
    url: '/api/v1/reset_password',
    method: 'post',
    data
  })
}

// AD域用户同步
export function userSync() {
  return request({
    url: '/api/v1/user/sync',
    method: 'post'
  })
}
