import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // 从cookie获取token
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import getParameterByName from '@/utils/url'
import { OAuthAuthorize } from '@/api/sso/oauth'

const _import = require('./router/_import_' + process.env.NODE_ENV) // 获取组件的方法

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 免登录白名单URL
const whiteList = ['/login', '/mfa_enable', '/mfa_auth', '/reset_password']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取Token
  const hasToken = getToken()

  // 确认用户是否登录
  if (hasToken) {
    if (to.path === '/login') {
      // 单点登录处理逻辑（注：已登录）

      const service = getParameterByName('service')
      const client_id = getParameterByName('client_id')
      if (service) {
        // CAS 认证处理逻辑
      } else if (client_id) {
        // OAuth2.0 认证处理逻辑

        // 获取redirect_uri、response_type、scope和state
        const redirect_uri = getParameterByName('redirect_uri')
        const response_type = getParameterByName('response_type')
        const scope = getParameterByName('scope')
        const state = getParameterByName('state')

        // 获取授权OAuth授权
        const data = { 'client_id': client_id, 'redirect_uri': redirect_uri, 'response_type': response_type, 'scope': scope, 'state': state }
        OAuthAuthorize(data).then(res => {
          if (res.code === 0) {
            console.log(res.redirect_uri)
            // 跳转到客户端
            window.location.href = res.redirect_uri
          }
        })
      } else {
        // 本地认证处理逻辑
        next({ path: '/' })
        NProgress.done()
      }
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')

          // 生成用户菜单
          if (store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }
          const menus = filterAsyncRouter(store.getters.menus)
          router.addRoutes(menus)
          global.antRouter = menus

          next({ ...to, replace: true })
        } catch (error) {
          // 移除token并回到登录页面
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 如果没有Token */

    if (whiteList.indexOf(to.path) !== -1) {
      // 如果访问的URL在免登录白名单，则直接跳转
      next()
    } else {
      // 如果访问的URL在尖在免登录白名单，则跳转至登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// 用户菜单转换
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        // Layout组件特殊处理
        route.component = Layout
      } else {
        // 导入组件
        route.component = _import(route.component)
      }
    }

    // 二级菜单处理
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
