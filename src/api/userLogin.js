import request from '@/utils/request'

export function loginWeb(data) {
  return request({
    url: '/api/anon/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/info/loginUserInfo',
    method: 'post'
  })
}

export function logoutWeb() {
  return request({
    url: '/api/logout/logout',
    method: 'post'
  })
}

//强制踢人下线，通过token值
export function forceLogout(data) {
  return request({
    url: '/api/logout/force_logout',
    method: 'post',
    data
  })
}

export function getUserMenu(data) {
  return request({
    url: '/api/menu/info/routers',
    method: 'post',
    data
  })
}

export function getUserButton(data) {
  return request({
    url: '/api/menu/info/button',
    method: 'post',
    data
  })
}
