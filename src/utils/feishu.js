
import { generateState } from '@/utils/generate-stata'
export function FeishuQrLogin() {
  // 指定回调地址
  const redirect_uri = window.location.protocol + '//' + window.location.hostname + '/login' + window.location.search

  // 组装二维码获取接口地址
  const goto = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${process.env.VUE_APP_FEISHU_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&state=${generateState()}`

  // 请求生成二维码
  const QRLoginObj = window.QRLogin({
    id: 'feishu_login',
    goto: `${goto}`,
    style: 'width: 251px;height: 251px;border: none'
  })

  // 监听用户扫码事件
  const handleMessage = function(event) {
    // 使用matchOrigin和matchData方法来判断message和来自的页面url是否合法
    if (QRLoginObj.matchOrigin(event.origin) && QRLoginObj.matchData(event.data)) {
      const loginTmpCode = event.data.tmp_code
      // 在授权页面地址上拼接上参数tmp_code，并跳转
      window.location.href = `${redirect_uri}&code=${loginTmpCode}`
    }
  }

  if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('message', handleMessage, false)
  } else if (typeof window.attachEvent !== 'undefined') {
    window.attachEvent('onmessage', handleMessage)
  }
}

