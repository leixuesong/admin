import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'
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
    addRoutes: [],
    buttons: {}
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
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
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
        const { admin_account, menu, buttons } = data
        commit('SET_NAME', admin_account)
        function createMenu(data, pid = 0) {
          const menu = []; let item = {}
          for (let i = 0; i < data.length; i++) {
            if (data[i].level === 1) {
              item = {
                path: '/' + data[i].controller,
                component: Layout,
                name: data[i].controller + '-' + data[i].method,
                meta: {
                  title: data[i].name,
                  icon: data[i].icon
                }
              }
            } else if (data[i].level === 2) {
              item = {
                path: '/' + data[i].controller + '/' + data[i].method,
                component: loadView(data[i].controller + '/' + data[i].method),
                name: data[i].controller + '-' + data[i].method,
                meta: {
                  title: data[i].name,
                  icon: data[i].icon
                }
              }
            }
            if (data[i].pid === pid) {
              item.children = createMenu(data, data[i].node_id)
              menu.push(item)
            }
          }
          return menu
        }
        console.log(menu)
        const meunu_router = createMenu(menu)
        meunu_router.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', meunu_router)
        commit('SET_BUTTONS', buttons)
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

