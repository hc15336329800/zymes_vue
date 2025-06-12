import request from '@/utils/request'

export function menuLazyPage(data) {
  return request({
    url: '/api/menu/info/lazy_page',
    method: 'post',
    data: {"params": data}
  });
}

export function menuTree(data) {
  return request({
    url: '/api/menu/info/menu_tree',
    method: 'post',
    data: {"params": data}
  });
}

export function permByDb(data) {
  return request({
    url: '/api/menu/info/button',
    method: 'post',
    data: data
  });
}


// 查询菜单详细
export function getMenu(data) {
  return request({
    url: '/api/menu/info/detail',
    method: 'POST',
    data: data,
  })
}

// 查询菜单下拉树结构
export function treeselect(data) {
  return request({
    url: '/api/menu/info/tree',
    method: 'post',
    data: data,
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(data) {
  return request({
    url: '/api/menu/info/tree_by_role',
    method: 'post',
    data: data,
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/api/menu/info/add',
    method: 'post',
    data: {"params": data}
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/api/menu/info/edit',
    method: 'post',
    data: {"params": data}
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: '/api/menu/info/delete',
    method: 'post',
    data: {"params": data}
  })
}
