import request from '@/utils/request'

// 获取短信发送记录
export function getSMSRecordList(params) {
  return request({
    url: '/api/v1/audit/sms',
    method: 'get',
    params
  })
}

// 获取短信发送回执
export function getSMSReceipt(params) {
  console.log(params)
  return request({
    url: '/api/v1/audit/sms/receipt',
    method: 'get',
    params
  })
}

// 获取用户登录记录
export function getLoginRecordList(params) {
  return request({
    url: '/api/v1/audit/login',
    method: 'get',
    params
  })
}
