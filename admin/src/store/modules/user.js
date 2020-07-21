import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { constantRoutes,resetRouter } from '@/router'
import Layout from '@/layout'
import request from '@/utils/request'

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
        url: '/user/info',
        method: 'post'
      }).then(data => {
        if (!data) {
          return reject('token已过期，请重新登录.')
        }
        const { admin_account } = data
        commit('SET_NAME', admin_account)
        let menu = [{
          path: '/menu',
          component: Layout,
          children: [
            {
              path: 'index',
              name: 'menu-index',
              component: () => import('@/views/menu/index'),
              meta: { title: '菜单管理', icon: 'el-icon-s-order' }
            }
          ]
        },

          {
            path: '/role',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'role-index',
                component: () => import('@/views/role/index'),
                meta: { title: '角色管理', icon: 'el-icon-setting' }
              }
            ]
          },

          {
            path: '/user',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'user-index',
                component: () => import('@/views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-s-custom' }
              }
            ]
          },

          {
            path: '/journal',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'journal-index',
                component: () => import('@/views/journal/index'),
                meta: { title: '日志管理', icon: 'el-icon-tickets' }
              }
            ]
          },

          {
            path: '/agent',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'agent-index',
                component: () => import('@/views/agent/index'),
                meta: { title: '代理商管理', icon: 'el-icon-office-building' }
              }
            ]
          }, {
            path: '/merchant',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'merchant-index',
                component: () => import('@/views/merchant/index'),
                meta: { title: '商户管理', icon: 'el-icon-s-home' }
              }
            ]
          },
          {
            path: '/order',
            component: Layout,
            children: [
              {
                path: 'index',
                name: 'order-index',
                component: () => import('@/views/order/index'),
                meta: { title: '订单管理', icon: 'el-icon-s-order' }
              }
            ]
          },
        {
          path: '/profit',
          component: Layout,
          children: [
            {
              path: 'index',
              name: 'profit-index',
              component: () => import('@/views/profit/index'),
              meta: { title: '分润管理', icon: 'el-icon-coin' }
            }
          ]
        },
        { path: '*', redirect: '/404', hidden: true }
        ]
        commit('SET_ROUTES', menu)
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

