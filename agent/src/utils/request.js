import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/api/agent',
  method: 'post',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code === 200) {
      return res.data
    } else {
      if (res.code === 500) {
        MessageBox.confirm('你的登录信息已经过期，请重新登陆！', '退出提示', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.message || '请求错误',
          type: 'error',
          duration: 3000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
