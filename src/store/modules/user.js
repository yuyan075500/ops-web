import { login, logout, getInfo } from '@/api/user'
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
    id: ''
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
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('认证失败，请重新登录.')
        }

        const { name, avatar, username, email, phone_number } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERNAME', username)
        commit('SET_EMAIL', email)
        commit('SET_PHONE_NUMBER', phone_number)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 用户注销后必须移除Token
        resetRouter()
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
      removeToken()
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

