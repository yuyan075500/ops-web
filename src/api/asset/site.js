import request from '@/utils/request'

// 获取站点列表
export function getGroupList(params) {
  return request({
    url: '/api/v1/sites',
    method: 'get',
    params
  })
}

// 新增站点分组
export function addGroup(data) {
  return request({
    url: '/api/v1/site/group',
    method: 'post',
    data
  })
}

// 删除站点分组
export function deleteGroup(data) {
  return request({
    url: '/api/v1/site/group/' + data.id,
    method: 'delete'
  })
}

// 修改站点分组
export function changeGroup(data) {
  return request({
    url: '/api/v1/site/group',
    method: 'put',
    data
  })
}
