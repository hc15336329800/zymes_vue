import axios from 'axios'
import {Loading, Message} from 'element-ui'
import {getToken, setToken, clearStorage} from '@/utils/storage'
import _ from 'lodash'
//loading对象
let loading
//当前正在请求的数量
let needLoadingRequestCount = 0

//显示loading
function showLoading(config) {
  //判断当前请求是否设置了不显示Loading
  if (config.headers.showLoading !== false) {
    let target = config.headers.loadingTarget
    // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
    // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
    if (needLoadingRequestCount === 0 && !loading) {
      loading = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.5)',
        spinner: 'el-icon-loading', //加载动画的图标
        target: target || 'body'
      })
    }
    needLoadingRequestCount++
  }
}

//隐藏loading
function hideLoading(config) {
  //判断当前请求是否设置了不显示Loading
  if (config.headers.showLoading !== false) {
    needLoadingRequestCount--
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) //做个保护
    if (needLoadingRequestCount === 0) {
      //关闭loading
      toHideLoading()
    }
  }
}

/**
 * 调整页面
 * @param {路径} url
 */
function toLocation(url) {
  var pathname = `${window.location.pathname}`
  var baseurl = `${window.location.origin}/` + pathname.split('/')[1]
  window.location.href = baseurl + url
}

//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(() => {
  try {
    loading.close()
    loading = null
  } catch (e) {
  }
}, 300)

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 200000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let reqtoken = getToken()
    if (typeof reqtoken === 'string' && reqtoken && reqtoken != 'undefined') {
      config.headers['Authorization'] = 'bearer ' + reqtoken
      config.headers['Authorization'] = 'bearer ' + reqtoken
      showLoading(config)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    hideLoading(config)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    hideLoading(response.config)
    let resultConfig = response.config
    if (res.tx_code && res.tx_code !== '00') {
      const msg = res.error_info.message
      if (resultConfig.url.includes('/api/order/status_scheduled')) {
        return res
      } else {
        Message({
          message: msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res)
      }
    } else {
      const isLogin =
        response.request.responseURL.indexOf('/api/anon/login') !== -1
      if (isLogin) {
        const accessToken = response.headers.authorization
        setToken(accessToken)
      }
      // 文件流 返回对象
      if (
        response.config.responseType === 'blob' ||
        response.config.responseType === 'arraybuffer'
      ) {
        return response
      }
      return res
    }
  },
  err => {
    hideLoading(err.config)
    if (err && err.response) {
      const status = err.response.status
      if (status === 401) {
        /**
         * 登录授权token超时，提示
         */
        clearStorage()
        Message({
          message: '登陆状态已过期，请重新登陆！',
          type: 'error',
          duration: 50 * 1000
        })
        toLocation('/login')
        return Promise.reject(err)
      } else if (status === 403) {
        toLocation('/403')
        return Promise.reject(err)
      } else {
        err.message = '连接错误' + status
      }
    } else {
      err.message = '登陆状态已过期，请重新登陆！'
    }

    console.log('err' + err) // for debug
    Message({
      message: err.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(err)
  }
)

export default service
