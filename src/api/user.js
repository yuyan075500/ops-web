import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 用户注销
export function logout() {
  return request({
    url: '/logout',
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

// 获取当前登录的用户菜单
export function getUserMenu() {
  return request({
    url: '/api/v1/user/menu',
    method: 'get'
  })
}
