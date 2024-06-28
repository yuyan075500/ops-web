import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/mfa_enable',
    name: 'MFA_ENABLE',
    component: () => import('@/views/login/mfa_enable'),
    hidden: true
  },

  {
    path: '/mfa_auth',
    name: 'MFA_AUTH',
    component: () => import('@/views/login/mfa_auth'),
    hidden: true
  },

  {
    path: '/reset_password',
    component: () => import('@/views/account/reset_password/index'),
    hidden: true
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  // 指定路由模式为history模式，则在URL中不使用"#"号
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
