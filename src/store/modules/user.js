import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  type: '', // 角色 NORMAL ADMIN
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ name: username.trim(), passwd: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_TYPE', data.role)
        setToken(data.token)
        localStorage.setItem('ding_role', data.role.toLowerCase()) // 把用户角色存到本地
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 这里返回的 response格式是：{"role":"ADMIN","name":"acc1"}
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        console.log('getInfo:', data)
        // roles must be a non-empty array
        if (!data.role) {
          reject('getInfo: roles must be a non-null array!')
        }

        // const { roles, name, avatar, introduction } = data

        // 需要处理一下，把用户角色转成["admin"]，符合官方框架逻辑
        var roles = []
        roles.push(data.role.toLowerCase())
        var name = data.name

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_TYPE', data.role)
        // commit('SET_INTRODUCTION', introduction)
        data.roles = roles
        console.log('符合官方框架的角色数据：', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_TYPE', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
