import request from '@/utils/request'

// 解析SP Metadata
export function ParseSPMetadata(data) {
  return request({
    url: '/api/v1/sso/saml/metadata',
    method: 'post',
    data
  })
}
