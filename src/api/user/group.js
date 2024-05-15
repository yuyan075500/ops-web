import request from '@/utils/request'

// 获取分组列表
export function getGroupList(params) {
  return request({
    url: '/api/v1/groups',
    method: 'get',
    params
  })
}

// 新增分组
export function addGroup(data) {
  return request({
    url: '/api/v1/group',
    method: 'post',
    data
  })
}

// 删除分组
export function deleteGroup(data) {
  return request({
    url: '/api/v1/group/' + data.id,
    method: 'delete'
  })
}

// 修改分组
export function changeGroup(data) {
  return request({
    url: '/api/v1/group',
    method: 'put',
    data
  })
}

// 分组用户管理
export function changeGroupUser(data) {
  return request({
    url: '/api/v1/group/users',
    method: 'put',
    data
  })
}
