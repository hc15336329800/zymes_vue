import request from '@/utils/request'

export function login(data) {
  console.log("data:" + data);
  return request({
    url: '/api/anon/login',
    method: 'post',
    data
  })
}

export function loginWithoutPassword(data) {
  return request({
    url: '/api/anon/loginWithoutPassword',
    method: 'post',
    data
  })
}

// api/anon/login

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
export function getmenu() {
  return request({
    url: '/api/menu/info/routers',
    method: 'post',
    data: {
      page: {
        page_num: 1,
        page_size: 10
      },
      params: {
        channel: '01'
      }
    }
  })
}
export function getUserButton(data) {
  return request({
    url: '/api/menu/info/button',
    method: 'post',
    data
  })
}
