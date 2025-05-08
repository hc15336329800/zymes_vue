import {
  login,
  logout,
  loginWithoutPassword,
  getmenu,
  getUserButton
} from '@/api/user'
import {
  setUser,
  setPerm,
  getToken,
  clearStorage,
  getUser,
  setMenus
} from '@/utils/storage'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({params: {userName: username.trim(), password: password}})
        .then(response => {
          const {data} = response
          setUser(data)
          getmenu().then(res => {
            setMenus(res.data)
            resolve(res.data)
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // user login
  loginWithoutPassword({commit}, username) {
    return new Promise((resolve, reject) => {
      loginWithoutPassword({
        page: {
          page_num: 0,
          page_size: 0
        },
        params: {
          userName: username
        }
      })
        .then(response => {
          const {data} = response
          setUser(data)
          getmenu().then(res => {
            setMenus(res.data.subs)
            resolve()
          })
          // commit('SET_TOKEN', data.token)
          // setToken(data.token)
          // resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      const data = getUser()
      const {userName} = data
      commit('SET_NAME', userName)
      commit('SET_ROLES', '123')
      // commit('SET_NAME', nickName)
      // commit('SET_AVATAR', avatarUrl)
      commit('SET_INTRODUCTION', '')
      resolve(data)
      getUserButton({params: {channel: '01'}}).then(res => {
        const buttons = res.data
        setPerm(buttons)
      })
    })
  },

  // user logout
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      clearStorage()
      resetRouter()
      // reset visited views and cached views
      // dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      window.location.reload() //解决退出登入之后不刷新登入页面空白问题；暂时没发现是框架哪里有问题?
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      clearStorage()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({commit, dispatch}, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const {roles} = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, {root: true})
  },

  set_userInfo({commit}, val) {
    commit('SET_USERINFO', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
