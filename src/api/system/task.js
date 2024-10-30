import request from '@/utils/request'

// 新增定时任务
export function addTask(data) {
  return request({
    url: '/api/v1/task',
    method: 'post',
    data
  })
}

// 删除定时任务
export function deleteTask(data) {
  return request({
    url: '/api/v1/task/' + data.ID,
    method: 'delete'
  })
}

// 修改定时任务
export function changeTask(data) {
  return request({
    url: '/api/v1/task',
    method: 'put',
    data
  })
}

// 获取定时任务列表
export function getTaskList(params) {
  return request({
    url: '/api/v1/tasks',
    method: 'get',
    params
  })
}

// 获取定时任务执行日志列表
export function getTaskLogList(params) {
  return request({
    url: '/api/v1/task/logs',
    method: 'get',
    params
  })
}
