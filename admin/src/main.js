import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import request from '@/utils/request.js'
// 动态权限菜单
import './permission'
// 按钮指令directive
import '@/directive/index.js'
Vue.prototype.$request = request
Vue.use(ElementUI, {
  size: 'mini'
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
