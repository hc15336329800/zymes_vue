import request from '@/utils/request'

//分页数据
export function usedPageList(data) {
  return request({
    url: '/api/item/mes_item_use/page_list',
    method: 'post',
    data
  })
}

export function uploadUsed(data) {
  return request({
    url: '/api/item/mes_item_use/upload',
    method: 'post',
    data
  })
}

export function itemUsedTree(data) {
  return request({
    url: '/api/item/mes_item_use/item_use_tree',
    method: 'post',
    data
  })
}


// 修改
export function updateUsed(data) {
  return request({
    url: '/api/item/mes_item_use/update',
    method: 'post',
    data
  })
}

// 新增
export function addUsed(data) {
  return request({
    url: '/api/item/mes_item_use/add',
    method: 'post',
    data
  })
}

// 删除
export function deleteUsed(data) {
  return request({
    url: '/api/item/mes_item_use/delete',
    method: 'post',
    data
  })
}

//详情
export function detailUsed(data) {
  return request({
    url: '/api/item/mes_item_use/detail',
    method: 'post',
    data
  })
}
