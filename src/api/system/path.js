import request from '@/utils/request'

// 获取接口列表
export function getPathList(params) {
  return request({
    url: '/api/v1/paths',
    method: 'get',
    params
  })
}

// 获取所有接口
export function getPathListAll() {
  return request({
    url: '/api/v1/path/list',
    method: 'get'
  })
}
