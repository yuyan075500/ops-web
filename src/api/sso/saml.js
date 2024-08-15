import request from '@/utils/request'

// OAuth2授权
export function SAMLAuthorize(data) {
  return request({
    url: '/api/v1/sso/saml/authorize',
    method: 'post',
    data
  })
}

// 解析SP Metadata
export function ParseSPMetadata(data) {
  return request({
    url: '/api/v1/sso/saml/metadata',
    method: 'post',
    data
  })
}
