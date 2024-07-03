import request from '@/utils/request'

// 获取菜单列表
export function getGroupList(params) {
  return request({
    url: '/api/v1/sites',
    method: 'get',
    params
  })
}
