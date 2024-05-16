import request from '@/utils/request'

// 获取菜单列表
export function getMenuList(params) {
  return request({
    url: '/api/v1/menus',
    method: 'get',
    params
  })
}
