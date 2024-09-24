import { login, logout, getUserInfo, mfaAuth, GetSAMLAuthorize, GetCASAuthorize, GetOAuthAuthorize, GetDingTalkAuthorize } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    // Token
    token: getToken(),
    // 姓名
    name: '',
    // 头像
    avatar: '',
    // 用户名
    username: '',
    // 邮箱
    email: '',
    // 电话
    phone_number: '',
    // ID
    id: '',
    // 菜单
    menus: [],
    // 接口权限
    permissions: [],
    // 角色
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_PHONE_NUMBER: (state, phone_number) => {
    state.phone_number = phone_number
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { token, redirect } = response

        // 如果redirect不为undefined，则直接返回
        if (redirect !== undefined) {
          resolve(response)
        } else {
          // 将token存储到vuex中
          commit('SET_TOKEN', token)
          // 将token存储到cookie中
          setToken(token)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取钉钉授权
  get_dingtalk_authorize({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      GetDingTalkAuthorize(userInfo).then(response => {
        const { token } = response
        // 将token存储到vuex中
        commit('SET_TOKEN', token)
        // 将token存储到cookie中
        setToken(token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取SAML授权
  get_saml_authorize({ commit }, formData) {
    return new Promise((resolve, reject) => {
      GetSAMLAuthorize(formData).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取CAS授权
  get_cas_authorize({ commit }, formData) {
    return new Promise((resolve, reject) => {
      GetCASAuthorize(formData).then(response => {
        window.location.href = response.redirect_uri
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取OAuth授权
  get_oauth_authorize({ commit }, formData) {
    return new Promise((resolve, reject) => {
      GetOAuthAuthorize(formData).then(response => {
        window.location.href = response.redirect_uri
      }).catch(error => {
        reject(error)
      })
    })
  },

  /* MFA认证 */
  mfa_auth({ commit }, formData) {
    return new Promise((resolve, reject) => {
      mfaAuth(formData).then(response => {
        const { token } = response
        if (response.code === 0) {
          // 将token存储到vuex中
          commit('SET_TOKEN', token)
          // 将token存储到cookie中
          setToken(token)
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        if (response.code === 0) {
          const { data } = response
          const { id, name, avatar, username, email, phone_number, roles, permissions } = data
          let { menus } = data

          // 如果后端返回的菜单为null，则需要将变量menus更改为空数组，否则后面无法追加404路由，会导致用户登录后如何进入系统
          if (menus === null) {
            menus = []
          }

          // 增加404路由到末尾
          menus.push(
            { path: '/404', component: '404', hidden: true },
            { path: '*', redirect: '/404', hidden: true }
          )

          // 将用户信息存储到vuex中
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_USERNAME', username)
          commit('SET_EMAIL', email)
          commit('SET_ID', id)
          commit('SET_PHONE_NUMBER', phone_number)
          commit('SET_MENUS', menus)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_ROLES', roles)
          resolve(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        // 移除Token
        removeToken()
        // 重置路由
        resetRouter()
        // 重置vuex中的用户信息
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      // 移除Token
      removeToken()
      // 重置vuex中的用户信息
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

