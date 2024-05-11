import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/api/v1/users',
    method: 'get',
    params
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

// 密码重置
export function resetPassword(data) {
  return request({
    url: '/api/v1/user/reset_password',
    method: 'put',
    data
  })
}
