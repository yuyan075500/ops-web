export const generateState = (length = 16) => {
  // 定义一个字符集，包含大小写字母和数字
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let state = ''

  // 从字符集中随机选择字符生成指定长度的字符串
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    state += charset[randomIndex]
  }

  return state
}
