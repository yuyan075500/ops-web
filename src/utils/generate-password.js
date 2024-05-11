export const generatePassword = () => {
  // 定义生成密码所需要的字符串
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseLetters = lowercaseLetters.toUpperCase()
  const numbers = '0123456789'
  const specialCharacters = '!@#$%^&*()_+-={}[]|\\:;"<>,.?/'

  let password = ''

  // 指定密码需要包含的字符类串类型
  const categories = [lowercaseLetters, uppercaseLetters, numbers, specialCharacters]

  // 确保每个类别都在密码中表示
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const randomIndex = Math.floor(Math.random() * category.length)
    password += category[randomIndex]
  }

  // 填充剩余的密码，直到达到10个字符的长度
  while (password.length < 12) {
    const randomCategoryIndex = Math.floor(Math.random() * categories.length)
    const randomCategory = categories[randomCategoryIndex]
    const randomIndex = Math.floor(Math.random() * randomCategory.length)
    password += randomCategory[randomIndex]
  }

  // 随机排列密码中的字符
  password = password.split('').sort(function() {
    return 0.5 - Math.random()
  }).join('')

  return password
}
