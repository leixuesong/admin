import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import request from '@/utils/request.js'
import './permission'
Vue.prototype.$request = request
Vue.prototype.$ImagePath = 'http://localhost/backend/public/uploads/'
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
