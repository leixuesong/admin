import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
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
        meta: { title: '角色管理', icon: 'form' }
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
  },
  {
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

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
