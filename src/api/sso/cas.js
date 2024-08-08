import request from '@/utils/request'

// OAuth2授权
export function CASAuthorize(data) {
  return request({
    url: '/api/v1/sso/cas/authorize',
    method: 'post',
    data
  })
}
