import request from '@/utils/request'

// OAuth2授权
export function OAuthAuthorize(data) {
  return request({
    url: '/api/v1/oauth/authorize',
    method: 'post',
    data
  })
}
