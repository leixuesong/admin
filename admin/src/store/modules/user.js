import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { constantRoutes,resetRouter } from '@/router'
import Layout from '@/layout'
import request from '@/utils/request'
export const loadView = (view) => { 

  return (resolve) => require([`@/views/${view}`], resolve)

}
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    routes: [],
    addRoutes: []
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
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      request({
        url: '/login/auth',
        method: 'post',
        data: { username: username.trim(), password }
      }).then(data => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      request({
        url: '/user/getuserinfo',
        method: 'post'
      }).then(data => {
        if (!data) {
          return reject('token已过期，请重新登录.')
        }
        const { admin_account,menu } = data
        commit('SET_NAME', admin_account)
        let meunu_router = menu.map((item) => {
          item.component = Layout;
          item.children[0].component = loadView(item.children[0].view)
          return item
        })
        meunu_router.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', meunu_router)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
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

