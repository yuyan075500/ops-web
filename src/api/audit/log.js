import request from '@/utils/request'

// 获取短信发送记录
export function getSMSRecordList(params) {
  return request({
    url: '/api/v1/audit/sms/list',
    method: 'get',
    params
  })
}

// 获取用户登录记录
export function getLoginRecordList(params) {
  return request({
    url: '/api/v1/audit/login/list',
    method: 'get',
    params
  })
}
