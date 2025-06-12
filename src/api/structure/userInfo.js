import request from '@/utils/request'

//所有用户
export function userPageList(data) {
  return request({
    url: '/api/user/info/pageUserInfo',
    method: 'post',
    data
  })
}

export function useSelect(data) {
  return request({
    url: '/api/user/info/list_user',
    method: 'post',
    data
  })
}

export function getAllUserInfo() {
  return request({
    url: '/api/role/info/user_role',
    method: 'post'
  })
}

//更新用户密码
export function updatePsw(data) {
  return request({
    url: '/api/user/info/updatePwd',
    method: 'post',
    data
  })
}

//重置用户密码
export function resetPsw(data) {
  return request({
    url: '/api/user/info/resetPwd',
    method: 'post',
    data
  })
}

export function saveUserInfo(data) {
  return request({
    url: '/api/user/info/saveUser',
    method: 'post',
    data: {params: data}
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/api/user/info/updateUser',
    method: 'post',
    data: {params: data}
  })
}

export function deleteUserInfo(data) {
  return request({
    url: '/api/user/info/deleteUserInfo',
    method: 'post',
    data: {params: data}
  })
}

export function getUserDetail(data) {
  return request({
    url: '/api/user/info/userDetail',
    method: 'post',
    data: {params: data}
  })
}

export function changeUserStatus(data) {
  return request({
    url: '/api/user/info/userStatus',
    method: 'post',
    data
  })
}

export function outerUserList(data) {
  return request({
    url: '/api/user/info/outerUserSelected',
    method: 'post',
    data
  })
}


