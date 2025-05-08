import request from '@/utils/request'

export function rolePageList(data) {
  return request({
    url: '/api/role/info/page',
    method: 'post',
    data
  });
}

export function getRoleInfo(data) {
  return request({
    url: '/api/role/info/detail',
    method: 'post',
    data: {"params": data}
  });
}

export function addRoleInfo(data) {
  return request({
    url: '/api/role/info/add',
    method: 'post',
    data: {"params": data}
  });
}

export function updateRole(data) {
  return request({
    url: '/api/role/info/update',
    method: 'post',
    data: {"params": data}
  });
}

export function delRole(data) {
  return request({
    url: '/api/role/info/delete',
    method: 'post',
    data: {"params": data}
  });
}

export function roleMenuInfo(data) {
  return request({
    url: '/api/role/info/role_menu',
    method: 'post',
    data: {"params": data}
  });
}

export function addRoleMenu(data) {
  return request({
    url: '/api/role/info/add_role_menu',
    method: 'post',
    data: {"params": data}
  });
}


export function userRoleInfo(data) {
  return request({
    url: '/api/role/info/user_role',
    method: 'post',
    data
  });
}
