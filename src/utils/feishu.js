
import { generateState } from '@/utils/generate-stata'
export function FeishuQrLogin() {
  // 指定回调地址，需要带上原本所有请求参数，并带上自定义参数"byte=true"，表示飞书扫码登录
  const query = window.location.search
  const redirect_uri = window.location.protocol + '//' + window.location.host + '/login?byte=true' + query.replace('?', '&')
  console.log('redirect_uri:', redirect_uri)

  // 组装二维码获取接口地址
  const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${process.env.VUE_APP_FEISHU_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&state=${generateState()}`

  // 请求生成二维码
  const QRLoginObj = window.QRLogin({
    id: 'feishu_login',
    goto: `${goto}`,
    style: 'width: 255px;height: 255px;border: none'
  })

  // 监听用户扫码事件
  const handleMessage = function(event) {
    // 使用matchOrigin和matchData方法来判断message和来自的页面url是否合法
    if (QRLoginObj.matchOrigin(event.origin) && QRLoginObj.matchData(event.data)) {
      // 获取临时授权码
      const loginTmpCode = event.data.tmp_code

      // 获取授权码，并跳转至redirect_uri（回调地址）
      window.location.href = `${goto}&tmp_code=${loginTmpCode}`
    }
  }

  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('message', handleMessage, false)
  } else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent('onmessage', handleMessage)
  }
}

